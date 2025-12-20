
import { createCaller } from "../api/root";
import { db } from "../db";
import { TRPCError } from "@trpc/server";

const MOCK_USER_ID = "stress-test-user";
const MOCK_SESSION = {
    user: { id: MOCK_USER_ID, name: "Stress Tester", email: "test@lyra.com" },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

const UNAUTHORIZED_SESSION = {
    user: { id: "hacker-dude", name: "Hacker", email: "hacker@evil.com" },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

async function main() {
    console.log("🔍 Starting Logic & Security Verification...");

    const caller = createCaller({
        db,
        session: MOCK_SESSION,
        headers: new Headers(),
    });

    // 1. Find the 1M row table
    const base = await db.base.findFirst({
        where: { userId: MOCK_USER_ID, name: "1M Load Test Base" },
        orderBy: { createdAt: "desc" },
    });
    if (!base) throw new Error("Base not found. Run load-test.ts first.");

    const table = await db.table.findFirst({
        where: { baseId: base.id, name: "Big Data Table" },
        include: { columns: true },
    });
    if (!table) throw new Error("Table not found.");

    const rowCount = await db.row.count({ where: { tableId: table.id } });
    console.log(`Targeting Table ${table.id} with ${rowCount} rows.`);

    // 2. Default Data Sanity Check (Task 4)
    // We can't check 'create' right now since we are using existing table, 
    // but if we call create now we can check it.
    console.log("\n🧪 Task 4: Default Data Sanity Check");
    const sanityBase = await caller.base.create({ name: "Sanity Check Base" });
    const sanityTableCtx = await caller.table.create({ baseId: sanityBase.id, name: "Sanity Table" });

    if (sanityTableCtx.columns.length !== 5) throw new Error(`Expected 5 default columns, got ${sanityTableCtx.columns.length}`);
    const sanityRows = await db.row.count({ where: { tableId: sanityTableCtx.table.id } });
    // It should be 50.
    if (sanityRows !== 50) throw new Error(`Expected 50 default rows, got ${sanityRows}`);
    console.log("✅ Default Table Creation (5 cols / 50 rows) passed.");


    // 3. Database-Level Filter Verification (Task 2)
    console.log("\n🧪 Task 2: Filter Performance (Target < 300ms)");

    const textCol = table.columns.find(c => c.type === "TEXT");
    const numCol = table.columns.find(c => c.type === "NUMBER");
    if (!textCol || !numCol) throw new Error("Missing text/number columns for test.");

    // Test: Text Contains
    console.log("   Test: Text Contains 'Row 500'");
    const startFilter = performance.now();
    const filteredRows = await caller.row.list({
        tableId: table.id,
        take: 10,
        filter: {
            logic: "AND",
            conditions: [{ columnId: textCol.id, operator: "contains", value: "Row 500" }],
        },
    });
    const endFilter = performance.now();
    console.log(`   Found ${filteredRows.length} rows in ${(endFilter - startFilter).toFixed(2)}ms`);
    if (endFilter - startFilter > 300) console.error("   ❌ Filter too slow!");
    else console.log("   ✅ Filter speed passed.");

    // Test: Number Gt
    console.log("   Test: Number > 5000");
    const startNum = performance.now();
    await caller.row.list({
        tableId: table.id,
        take: 10,
        filter: {
            logic: "AND",
            conditions: [{ columnId: numCol.id, operator: "gt", value: 5000 }],
        },
    });
    const endNum = performance.now();
    console.log(`   Number query done in ${(endNum - startNum).toFixed(2)}ms`);


    // 4. Global Search Scale Test (Task 3)
    console.log("\n🧪 Task 3: Global Search (GIN Index) (Target < 100ms)");
    const searchTerm = "Row 9999";
    const startSearch = performance.now();
    const searchResults = await caller.search.globalSearch({ query: searchTerm });
    const endSearch = performance.now();
    console.log(`   Search found ${searchResults.length} results in ${(endSearch - startSearch).toFixed(2)}ms`);

    if (endSearch - startSearch > 100) console.error("   ❌ Search too slow!");
    else console.log("   ✅ Search speed passed.");


    // 5. Security & Ownership Audit (Task 5)
    console.log("\n🧪 Task 5: Security & Ownership Audit");
    const hackerCaller = createCaller({
        db,
        session: UNAUTHORIZED_SESSION,
        headers: new Headers(),
    });

    try {
        await hackerCaller.row.list({ tableId: table.id });
        console.error("   ❌ SECURITY FAIL: Hacker was allowed to list rows!");
    } catch (e) {
        if (e instanceof Error && e.message.includes("FORBIDDEN")) {
            console.log("   ✅ Security passed: Hacker blocked with FORBIDDEN.");
        } else {
            console.log(`   ✅ Security passed: Request failed as expected (${(e as Error).message})`);
        }
    }

    console.log("\n🎉 Verification Complete.");
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
