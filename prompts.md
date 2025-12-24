Below is a **surgical “Phase 0 reset” prompt** you can paste into Codex. It is designed to **delete everything not required for Phase 0**, while **preserving** your working Google auth, your T3 stack wiring, and your existing env-var contract.

It assumes you already have:

* T3 stack scaffold
* Google login working (NextAuth)
* Deployable baseline

---

## Prompt: Phase 0 Cleanup — Keep Auth, Strip Everything Else

**Role:** Senior T3 Engineer / Repo Surgeon
**Goal:** Reduce the repo to **Phase 0 only**: working auth + minimal UI scaffold. Remove anything not essential yet, without breaking existing env vars or auth flow.

### Context

We are restarting the project implementation from a clean baseline. Phase 0 includes:

* T3 stack intact (Next.js + tRPC + Prisma + NextAuth)
* Google OAuth sign-in remains fully working
* Minimal UI scaffold (home page + login/out + protected route)
* Environment variables and deployment assumptions remain unchanged

Anything beyond Phase 0 is **out of scope** and should be removed or stubbed.

---

## Hard Requirements (Do Not Break)

1. **Auth must still work exactly as-is**

   * Google sign-in button works
   * Session persists
   * Protected page still protected
   * Sign-out works
2. **Environment variables must remain unchanged**

   * Do not rename env vars
   * Do not add new required env vars
   * Preserve `.env.example` and any Vercel env usage patterns
3. **Build must pass**

   * `npm run lint`
   * `npm run typecheck` (or `tsc`)
   * `npm run build`
4. **Prisma remains installed and functional**

   * Do not remove Prisma
   * But you may simplify schema to minimum needed for auth only

---

## What to Delete / Remove (Aggressively)

Remove any code related to:

* Airtable UI / table rendering
* virtualization
* load-test scripts, ingestion worker, copy engine
* faker seeding scripts
* views, filters, sorting logic
* complex services or “phase” docs not needed for Phase 0

This includes deleting directories/files if present:

* `ingestion-worker/`
* `airtable UI/` or any UI experiments
* any `load-test*.ts`, `verify-logic.ts`, bulk insert services
* any large “plan” markdown files unrelated to Phase 0
* any leftover scripts for Neon/Supabase benchmarking

If unsure, keep only what is necessary to:

* sign in with Google
* show minimal pages
* prove session protection

---

## What to Keep (Minimal Phase 0 Scope)

### Backend

* NextAuth configuration and callbacks
* Prisma adapter (if you use it)
* Prisma schema necessary for auth tables only
* tRPC scaffolding can remain, but **remove routers unrelated to auth**:

  * Keep `health` or `example` router only if it’s minimal and used

### Frontend

* `Home` page:

  * shows sign-in state
  * if signed out: “Sign in with Google”
  * if signed in: show user email/name + sign out
  * a link/button to a protected page

* `Protected` page:

  * only accessible when signed in
  * displays session details

### UI/Styling

* Keep whichever styling stack you already have (Tailwind, shadcn, etc.)
* But remove unused components and routes

---

## Concrete Refactor Steps (Codex should execute)

1. **Inventory current routes and routers**

   * List pages/routes in `src/pages` or `src/app`
   * List tRPC routers in `src/server/api/routers`
   * Identify what is not Phase 0

2. **Delete non-Phase-0 folders and scripts**

   * Remove ingestion worker and load test infrastructure
   * Remove unused services (bulk insert, verification scripts, etc.)
   * Remove dead UI experiments and unrelated components

3. **Simplify Prisma schema**

   * Keep only tables required for NextAuth + Prisma adapter
   * Run `prisma generate`
   * Ensure migrations still consistent (if using migrations, do not delete history—only adjust schema safely)

4. **Simplify tRPC**

   * Keep `api/root.ts` structure intact
   * Remove routers not used
   * Ensure `src/utils/api` still works

5. **Minimal UI scaffold**

   * Ensure home page has sign-in/out and protected link
   * Ensure protected route is guarded
   * No other pages

6. **Verify env contract**

   * Do not modify `.env`, `.env.local`, `.env.example` naming or keys
   * Ensure no new env vars required to boot

7. **Run and confirm**

   * `npm run lint`
   * `npm run typecheck` (or equivalent)
   * `npm run build`
   * `npm run dev` sanity check: login/out works

---

## Acceptance Criteria

* Repo contains only Phase 0 functionality
* Auth works unchanged
* Minimal UI scaffold exists (home + protected)
* No ingestion/load-test/bulk-insert code remains
* Build + lint + typecheck all pass
* Env vars remain identical (keys unchanged)

---

## Output Required from Codex

At the end, provide:

1. A list of deleted files/folders
2. A list of remaining routes/pages
3. A list of remaining routers
4. Confirmation that build/lint/typecheck passed

---

If you paste this prompt into Codex, it should reliably “trim the repo to Phase 0” without accidentally ripping out auth or env wiring.
