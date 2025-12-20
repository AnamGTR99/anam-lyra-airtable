This is the final hurdle for the **Headless Engine**. Since your `current_progress.md` shows Phase 2 routers are registered, we need to prove they aren't just "present" but actually **production-ready at 1,000,000 rows**.

We are hitting the **"Ultimate Goal"** requirement from the PDF: *"If there are 1m rows, it can still load without an issue!"*.

### 🚀 Phase 2: Stress Test & Verification Master Prompt

**Copy and paste this into your coding agent (Claude Code / Cursor / Antigravity):**

> **Role:** Senior Performance Engineer / Database Architect
> **Objective:** Conduct a rigorous stress test and verification of the Phase 2 Core Data Engine to ensure 100% compliance with the Lyra performance requirements (1M rows, sub-100ms search).
> **Task 1: The 1,000,000 Row "Ultimate Goal" Test**
> * Create a script `src/server/scripts/load-test.ts` to push the database to the limit.
> * **Action:** Use the `row.bulkInsert` procedure to reach exactly **1,000,000 rows** in a single test table.
> * **Monitoring:** Measure the time for the final 100k chunk. It must complete in **<5 seconds** using the optimized UNNEST service.
> 
> 
> **Task 2: Database-Level Filter Verification**
> * Write a verification script `src/server/scripts/verify-logic.ts` to test the `filterBuilder.ts` and `sortBuilder.ts` services against the 1M row dataset.
> * **Verify Text Operators:** Test `contains`, `is empty`, and `equals`. Ensure these execute as SQL `ILIKE` or `IS NULL` queries, NOT JavaScript filters.
> 
> 
> * **Verify Number Operators:** Test `greater than` and `smaller than`. Ensure the JSONB values are correctly cast to numbers in the SQL `WHERE` clause.
> * **Benchmark:** All filter operations must return the first page of results in **<300ms** at 1M row scale.
> 
> 
> **Task 3: Global Search Scale Test**
> * Call the `search.globalSearch` procedure on the 1M row table.
> * **Action:** Search for a random string.
> * **Requirement:** Verify the **GIN index** is being used by checking query timing. **Target: <100ms**.
> 
> 
> 
> 
> **Task 4: Default Data Sanity Check**
> * Programmatically call `table.create`.
> * **Verify:** Ensure the newly created table immediately contains **5 columns** and **50 rows** of Faker.js data as required by the spec.
> 
> 
> 
> 
> **Task 5: Security & Ownership Audit**
> * Attempt to call `row.list` or `row.updateCell` using a different `userId` than the base creator.
> * **Requirement:** Confirm the `ensureOwnership` middleware correctly throws a `FORBIDDEN` TRPCError.
> 
> 
> **Output Requirement:** > 1. Provide a markdown table of the **Actual vs. Target** millisecond timings for 1M row operations.
> 2. Confirm the exact count of rows in the test table (`SELECT count(*) FROM "Row"`).
> 3. Update `IMPLEMENTATION_STATUS.md` with a "Verified at Scale" badge for Phase 2.

---

### What this accomplishes:

* 
**Requirement Hit**: Proves the **1M row** handling capability.


* 
**Requirement Hit**: Verifies **Search/Filter/Sort** happen at the **Database level**.


* 
**Requirement Hit**: Confirms **Default Rows/Columns** on creation.


* **Requirement Hit**: Validates the **Ownership model**.

Once your agent runs this and you see those sub-100ms logs on a million rows, you have officially finished the hardest part of the project. **The engine is scale-proof.** **Ready to fire this off?** After this, we move to the **Airtable 1:1 UI** (Phase 3).