import { db } from "../db";
import { type RowData } from "../../types/db";
import { bulkInsertRows } from "../services/bulkInsertOptimized";
import { createCaller } from "../api/root";
import fs from "fs";
import path from "path";

const CHECKPOINT_FILE = path.join(process.cwd(), ".load-test-checkpoint.json");

// Configuration from Prompt 2a findings
const BATCH_SIZE = 25_000;
const CONCURRENCY = 2; // "Goldilocks" setting
const TOTAL_ROWS_TARGET = 1_000_000;

const MOCK_USER_ID = "stress-test-user";
const MOCK_SESSION = {
    user: { id: MOCK_USER_ID, name: "Stress Tester", email: "test@lyra.com" },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

async function getOrCreateTestSetup() {
    // 1. Create a Mock User first
    await db.user.upsert({
        where: { id: MOCK_USER_ID },
        update: {},
        create: {
            id: MOCK_USER_ID,
            name: "Stress Tester",
            email: "test@lyra.com",
        },
    });

    const caller = createCaller({ db, session: MOCK_SESSION, headers: new Headers() });
    let base = await db.base.findFirst({ where: { name: "1M Load Test Base", createdById: MOCK_USER_ID } });

    if (!base) {
        console.log("Creating new base...");
        base = await caller.base.create({ name: "1M Load Test Base" });
    }

    // Reuse existing table if we are resuming, otherwise create new
    // For simplicity in this script, we'll try to find the most recent table for this base
    const table = await db.table.findFirst({
        where: { baseId: base.id },
        orderBy: { createdAt: 'desc' },
        include: { columns: true }
    });

    if (table) return { table, columns: table.columns };

    console.log("Creating new Table for this run...");
    return await caller.table.create({
        baseId: base.id,
        name: `Big Data Table ${Date.now()}`,
    });
}

async function main() {
    console.log("🚀 Starting Async Job Processor...");

    // 1. Job Discovery / Creation
    // In a real worker, we would pull from a queue. Here we look for a pending job or create one.
    let job = await db.ingestionJob.findFirst({
        where: { status: { in: ["PENDING", "PROCESSING"] } },
        orderBy: { createdAt: "desc" },
        include: { table: { include: { columns: true } } }
    });

    let columns;
    let tableId;

    if (!job) {
        console.log("⚠️ No pending job found. Creating a NEW test job...");
        const setup = await getOrCreateTestSetup();
        columns = setup.columns;
        tableId = setup.table.id;

        job = await db.ingestionJob.create({
            data: {
                tableId: tableId,
                status: "PENDING",
                totalRows: TOTAL_ROWS_TARGET,
                progress: 0
            },
            include: { table: { include: { columns: true } } }
        });
        console.log(`✅ Created Job ${job.id} for Table ${tableId}`);
    } else {
        console.log(`Found existing job ${job.id} (Status: ${job.status})`);
        tableId = job.tableId;
        columns = job.table.columns;
        // If columns are missing from relation include (shouldn't be if typed correctly), fetch them
        if (!columns || columns.length === 0) {
            columns = await db.column.findMany({ where: { tableId } });
        }
    }

    // 2. Checkpoint Recovery
    let processedRows = 0;
    if (fs.existsSync(CHECKPOINT_FILE)) {
        try {
            const cp = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8"));
            if (cp.jobId === job.id) {
                processedRows = cp.processedRows;
                console.log(`🔄 Resuming Job ${job.id} from checkpoint: ${processedRows} rows processed.`);
            }
        } catch (e) {
            console.warn("Checkpoint file corrupted, starting fresh.");
        }
    } else if (job.status === "PROCESSING") {
        // Verify from DB if checkpoint missing
        // This acts as a fallback using the database count
        const count = await db.row.count({ where: { tableId } });
        if (count > 0) {
            processedRows = count;
            console.log(`🔄 Resuming based on DB count: ${processedRows} rows.`);
        }
    }

    // Update status to PROCESSING
    await db.ingestionJob.update({
        where: { id: job.id },
        data: { status: "PROCESSING" }
    });

    // 3. Generator & Processing Loop
    const totalNeeded = job.totalRows;
    const pool: Promise<void>[] = [];
    const overallStart = performance.now();

    async function processBatch(offset: number, size: number, batchIndex: number) {
        try {
            // Generate rows (Memory Safe: only exists in this scope)
            const rows: RowData[] = new Array(size);
            for (let i = 0; i < size; i++) {
                const row: RowData = {};
                //@ts-ignore
                columns.forEach((col) => {
                    if (col.type === "NUMBER") {
                        row[col.id] = Math.floor(Math.random() * 10000);
                    } else {
                        row[col.id] = `Job${job!.id}-B${batchIndex}-R${i}`;
                    }
                });
                rows[i] = row;
            }

            const t0 = performance.now();
            await bulkInsertRows(tableId, rows);
            const t1 = performance.now();

            // Update Job Progress
            processedRows += size;
            const progress = (processedRows / totalNeeded) * 100;

            await db.ingestionJob.update({
                where: { id: job!.id },
                data: {
                    progress,
                    updatedAt: new Date()
                }
            });

            // Write Checkpoint
            fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify({
                jobId: job!.id,
                processedRows,
                timestamp: Date.now()
            }));

            const elapsed = (t1 - t0) / 1000;
            const rps = size / elapsed;
            console.log(`✅ Batch ${batchIndex} Done. Inserted: ${processedRows.toLocaleString()} | RPS: ${rps.toFixed(0)} | Progress: ${progress.toFixed(1)}%`);

        } catch (error) {
            console.error(`❌ Batch ${batchIndex} Failed:`, error);
            // In a real system, we might mark job as FAILED or retry. 
            // For now, we log. Ideally, we shouldn't increment processedRows.
            throw error; // Rethrow to stop main loop or handle retry
        }
    }

    // Generator for batch offsets
    async function* batchGenerator() {
        let currentOffset = processedRows;
        let batchIdx = Math.floor(currentOffset / BATCH_SIZE);

        while (currentOffset < totalNeeded) {
            const size = Math.min(BATCH_SIZE, totalNeeded - currentOffset);
            yield { offset: currentOffset, size, batchIdx };
            currentOffset += size;
            batchIdx++;
        }
    }

    try {
        for await (const { offset, size, batchIdx } of batchGenerator()) {
            // Concurrency Control
            while (pool.length >= CONCURRENCY) {
                // Remove finished promises
                await Promise.race(pool);
            }

            const task = processBatch(offset, size, batchIdx).then(() => {
                const idx = pool.indexOf(task);
                if (idx > -1) pool.splice(idx, 1);
            });
            pool.push(task);

            // Small delay to stagger requests initially
            if (pool.length === 1) await new Promise(r => setTimeout(r, 200));
        }

        await Promise.all(pool);

        // Completion
        await db.ingestionJob.update({
            where: { id: job.id },
            data: { status: "COMPLETED", progress: 100 }
        });

        console.log("\n🎉 Job Completed Successfully!");

        // Remove checkpoint
        if (fs.existsSync(CHECKPOINT_FILE)) fs.unlinkSync(CHECKPOINT_FILE);

    } catch (e) {
        console.error("🔥 Critical Job Failure:", e);
        await db.ingestionJob.update({
            where: { id: job.id },
            data: {
                status: "FAILED",
                errorMessage: e instanceof Error ? e.message : "Unknown error"
            }
        });
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
