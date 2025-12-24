Below is a strategic, end-to-end implementation plan for a **fresh rebuild** that meets the Lyra requirements in the PDF—especially the “**Add 100k rows**” button and the hard throughput target: **1,000,000 rows in 20–25 seconds**. 

---

## Product goals and constraints distilled from the PDF

You need: T3 stack, Vercel deploy, TanStack Table UI that matches Airtable, Google login, bases → tables, dynamic columns (Text/Number), smooth keyboard navigation, virtualized infinite scroll via tRPC hooks + TanStack Virtualizer, DB-level search/filter/sort, saved “views”, loading states, and “ultimate goal: 1M rows can still load without an issue.” 

The critical non-negotiable performance requirements are:

* Button adds **100k rows** on demand 
* Should support **1M rows** smoothly (read path) 
* Insertion throughput for demo target: **1M in 20–25 seconds** (write path)

---

## Architecture decisions to hit 1M rows in 20–25 seconds

### 1) Split “read path” and “write path”

* **Read path (Vercel)**: standard tRPC + Prisma (safe pooling). Optimized queries, pagination, indexes.
* **Write path (bulk ingest worker)**: a dedicated **long-lived ingestion service** (Fly.io / Render / Railway) using **direct Postgres socket + COPY FROM STDIN**. Vercel serverless should never do bulk inserts.

Reason: serverless timeouts + pooled connections + proxy layers are hostile to COPY throughput.

### 2) Database choice and connection strategy

* Use Postgres where **direct TCP** is available for bulk COPY and indexing is controllable.
* Connections:

  * Vercel/Prisma → **pooler** URL (safe for serverless)
  * ingestion-worker → **direct** URL (required for COPY)

### 3) Data model strategy that scales to 1M rows

Avoid “one JSONB per cell” explosion. Keep it simple and indexable:

**Option A (recommended for this take-home):**

* `Row` has:

  * `id`, `tableId`, `order` (sortable), `createdAt`, `updatedAt`
  * `data jsonb` where keys are `columnId` and values are primitives
* `Column` has:

  * `id`, `tableId`, `name`, `type` (“text” | “number”), `order`
* `View` stores config:

  * visible columns, sorts, filters, search string, etc.

This matches “dynamic columns” while allowing fast row fetches and DB-level filtering/search. 

---

## Implementation phases (fresh rebuild)

### Phase 0 — Rebuild baseline (T3) and keep working Google auth

1. Bootstrap with `create.t3.gg` (Next.js + tRPC + Prisma + NextAuth).
2. Implement Google OAuth sign-in and persist user.
3. Add “Base” creation + list (minimal UI scaffold).
4. Deploy early to Vercel to lock env-var patterns.

Deliverable: “Login with Google → create base” working end-to-end. 

---

### Phase 1 — Schema and core APIs (bases/tables/columns/rows)

**Prisma schema (core)**

* `User`
* `Base` (belongs to user)
* `Table` (belongs to base)
* `Column` (belongs to table)
* `Row` (belongs to table; contains `order` and `data` JSONB)
* `View` (belongs to table; stores JSON config)

**tRPC routers**

* `base.create`, `base.list`
* `table.create`, `table.list`
* `column.add`, `column.rename`, `column.list`, `column.reorder`
* `row.page` (cursor pagination), `row.updateCell`
* `view.create`, `view.update`, `view.list`, `view.apply`

Deliverable: Database-level CRUD, stable IDs, deterministic ordering.

---

### Phase 2 — Table UI (Airtable-like) + keyboard nav

1. **TanStack Table** for rendering, column sizing, headers.
2. **TanStack Virtual** for row virtualization + infinite scrolling. 
3. Cell editor behavior:

   * click-to-edit, enter-to-edit
   * arrow keys + tab move across cells smoothly 
4. Loading skeletons/spinners for:

   * initial page load
   * fetching next page
   * applying a view/search/filter

Deliverable: “Feels like Airtable” interaction loop.

---

### Phase 3 — DB-level search/filter/sort + Views (saved configuration)

Requirement: all search/filter/sort in DB. 

**Query approach**

* Row fetch endpoint accepts:

  * `search` (string)
  * `filters[]` (columnId, op, value)
  * `sort[]` (columnId, direction)
  * `visibleColumnIds[]` (projection hint; can reduce payload)

**SQL strategy**

* Sort/filter on JSONB fields:

  * Text: `(data ->> 'colId')`
  * Number: `((data ->> 'colId')::numeric)`
* Search across all cells:

  * Practical approach: maintain a derived `search_text` column per row containing concatenated values, or use a GIN index on `data` with `jsonb_path_ops` plus a constrained search expression.
  * For take-home scope, `search_text` is simpler and fast with `GIN(to_tsvector('simple', search_text))` or `pg_trgm` depending on desired behavior.

**Views**

* A `View` record persists:

  * filters
  * sorts
  * search term
  * visible/hidden columns 

Deliverable: “Saved view” reproduces the same DB query deterministically.

---

## Phase 4 — Bulk ingestion design (Add 100k button + 1M in 20–25s)

This is the pivotal phase.

### 4.1 Ingestion worker service (separate from Next.js)

* Create `/ingestion-worker` as a standalone Node app.
* Runs on **Fly.io** (or equivalent) specifically because you can guarantee IPv6 + stable long-lived process.
* Exposes an HTTP API:

  * `POST /ingest` with `{ tableId, count }`
  * returns `{ jobId }` immediately (so UI doesn’t block)
* Provides `GET /jobs/:jobId` for progress polling.

### 4.2 COPY implementation (how to hit 1M/25s)

* Use `pg` Client + `pg-copy-streams`.
* Use **COPY ... FROM STDIN (FORMAT text)**.
* Stream rows from a generator (faker) → transform to tab-separated lines → pipe to COPY.
* Ensure no intermediate buffering; backpressure must flow from socket → generator.

**Performance levers**

* `SET synchronous_commit = OFF` for ingestion session.
* Drop/recreate non-essential indexes around the load (or create after load).
* Batch strategy:

  * One big COPY for 1M is usually optimal; if you need checkpointing, do chunks (e.g., 200k) with job progress.
* Consider `UNLOGGED` table for demo loads if acceptable, then switch back (optional).

### 4.3 UI contract for “Add 100k rows”

Requirement explicitly asks for a button. 

Implementation:

* Button triggers `POST /ingest { tableId, count: 100000 }`.
* UI immediately shows:

  * “Ingesting…” progress
  * allows user to continue interacting
* Once job completes:

  * invalidate row query cache and refresh virtual list window

### 4.4 1M rows in 20–25 seconds: feasibility gating

You will only hit this if:

* Worker is deployed near DB region (same region)
* Using direct DB connection (no pooler/proxy)
* COPY is single-stream, no per-row INSERTs
* Index maintenance is minimized during load

Deliverable: Repeatable benchmark script producing: time, rows/sec, plus verification that the table UI can still scroll/search.

---

## Phase 5 — “1M rows load without issue” (read path hardening)

Requirement: “ultimate goal… 1m rows can still load without an issue.” 

### Read performance strategy

* Cursor-based pagination keyed by `(tableId, order, id)` with composite index:

  * `CREATE INDEX ON "Row"(tableId, "order", id)`
* Keep row payload lean:

  * optionally compress or omit large unused keys
  * only fetch columns visible in view (if implementing projection)
* Ensure virtualizer window is stable and query page size is tuned (e.g., 200–500 rows per page).

---

## Phase 6 — Operational polish

* Add seed script for “new table creates default rows and columns using fakerjs” 
* Daily progress logs (you can keep this as a `current_progress.md` convention).
* Basic observability:

  * ingestion worker logs rows/sec
  * job progress stored in Postgres or in-memory + persisted checkpoint file (for demo)

---

## What to change vs your current approach

If you restart from scratch, keep:

* Your working Google auth flow
* Your TanStack table patterns if you already nailed keyboard nav
* Your ingestion worker COPY engine concept (it is the correct approach)

Change:

* Make bulk ingest **never run inside Vercel**
* Make schema migrations a first-class step (Supabase DB must match your Prisma schema)
* Decide search implementation early (either `search_text` + index, or JSONB search strategy)

---

## Suggested build order (fastest path to a working demo)

1. Auth + Base/Table CRUD (deployed)
2. Table UI + virtualization (reads only)
3. Cell editing + keyboard nav
4. DB-level search/sort/filter + Views
5. Ingestion worker + Add 100k button
6. 1M ingest benchmark + read-path validation

This aligns directly with the PDF priorities while de-risking the performance requirement early. 

---

If you want, I can also draft a “definition of done” checklist and a minimal schema (Prisma models + indexes) tailored specifically to hitting 1M/25s with COPY, but the plan above is the strategic blueprint.
