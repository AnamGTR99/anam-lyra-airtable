import { db } from "../db";
import { type RowData } from "../../types/db";
import { bulkInsertRows } from "../services/bulkInsertOptimized";
import { createCaller } from "../api/root"; // only used for initial setup if needed

const MOCK_USER_ID = "stress-test-user";
const MOCK_SESSION = {
    user: { id: MOCK_USER_ID, name: "Stress Tester", email: "test@lyra.com" },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

async function main() {
    console.log("🚀 Starting Lyra 1,000,000 Row Load Test (Direct Service Mode)...");

    // 1. Create a Mock User first (Constraint Fix)
    await db.user.upsert({
        where: { id: MOCK_USER_ID },
        update: {},
        create: {
            id: MOCK_USER_ID,
            name: "Stress Tester",
            email: "test@lyra.com",
        },
    });

    // 2. Setup: Create Base and Table using tRPC caller (convenience for setup)
    const caller = createCaller({ db, session: MOCK_SESSION, headers: new Headers() });

    // Create a base for our 1M row test if it doesn't exist
    let base = await db.base.findFirst({ where: { name: "1M Load Test Base", createdById: MOCK_USER_ID } });

    if (!base) {
        console.log("Creating new base...");
        base = await caller.base.create({ name: "1M Load Test Base" });
    }

    console.log("Creating new Table for this run...");
    // Create table
    const { table, columns } = await caller.table.create({
        baseId: base.id,
        name: `Big Data Table ${Date.now()}`,
    });
    console.log(`Created Table: ${table.id} with ${columns.length} columns.`);


    const START_ROW_COUNT = 50;
    const TOTAL_TARGET = 1_000_000;
    const CHUNK_SIZE = 20_000;

    console.log(`\n🚀 Starting Bulk Insert (Direct DB Service)`);
    console.log(`📦 Batch Size: ${CHUNK_SIZE.toLocaleString()}`);

    let insertedCount = 0;
    const totalBatches = Math.ceil((TOTAL_TARGET - START_ROW_COUNT) / CHUNK_SIZE);

    for (let i = 0; i < totalBatches; i++) {
        const currentBatchSize = Math.min(CHUNK_SIZE, TOTAL_TARGET - insertedCount);

        // Generate rows
        const rows = Array.from({ length: currentBatchSize }).map((_, idx) => {
            const row: RowData = {};
            columns.forEach((col, colIdx) => {
                if (col.type === "NUMBER") {
                    row[col.id] = Math.floor(Math.random() * 10000);
                } else {
                    row[col.id] = `Batch ${i} Row ${idx} val ${Math.random().toString(36).slice(2, 8)}`;
                }
            });
            return row;
        });

        const start = performance.now();
        // DIRECT CALL: Skip tRPC router overhead
        await bulkInsertRows(table.id, rows);
        const end = performance.now();

        insertedCount += rows.length;

        const duration = (end - start) / 1000;
        const progress = ((insertedCount / TOTAL_TARGET) * 100).toFixed(1);
        console.log(`⚡️ Batch ${i + 1}/${totalBatches}: ${insertedCount.toLocaleString()} rows. (${duration.toFixed(2)}s) [${progress}%]`);

        // Small pause to prevent connection pool exhaustion if needed
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 50));
    }

    // 6. Verification
    console.log("\n🏁 Insertions Complete. Verifying count...");
    const count = await db.row.count({ where: { tableId: table.id } });
    console.log(`\n🎉 Final Row Count in DB: ${count.toLocaleString()}`);

    if (count >= TOTAL_TARGET) {
        console.log("SUCCESS: 1,000,000 rows achieved! 🚀");
    } else {
        console.error("WARNING: count mismatch.");
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
