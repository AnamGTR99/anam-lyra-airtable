The current deployment blockers are a result of the "T3 Boilerplate" clashing with the **Prisma v6 upgrade** and your **custom architectural changes**. Your `fix_deployment.md`  is an excellent internal log, but we need to give your AI agent a consolidated, high-precision instruction to clear all three errors (Prisma pathing, "Post" boilerplate, and Auth type mismatch) in a single pass.

Here is the master prompt to get your Vercel build to green.

### Master Build-Fix Prompt

> **Role:** Senior Full-Stack Engineer / DevOps Architect
> **Objective:** Resolve all Vercel deployment blockers caused by Prisma v6 type mismatches and boilerplate leftovers to achieve a successful production build.
> **Task List:**
> 1. **Resolve Auth/Prisma v6 Type Clash:**
> * Open `src/server/auth/config.ts`.
> * Locate the `adapter: PrismaAdapter(db)` line.
> * Change it to: `adapter: PrismaAdapter(db as any),`
> * **Rationale:** This resolves the "Index signature for type 'string' is missing" error caused by Prisma v6's stricter client types not perfectly aligning with the current `@auth/prisma-adapter`.
> 
> 
> 2. **Standardize Prisma Client Pathing:**
> * Open `prisma/schema.prisma`. Ensure there is **no** `output` line in the `generator client` block. It must default to `node_modules/@prisma/client` for Vercel compatibility.
> * Search the entire codebase for `~/generated/prisma` or `../generated/prisma`.
> * Replace all instances with `@prisma/client`. Check specifically `src/server/services/filterBuilder.ts` and `src/server/services/sortBuilder.ts`.
> 
> 
> 3. **Deep Cleanup of Default Boilerplate:**
> * Open `src/app/page.tsx`. Completely remove the `void api.post.getLatest.prefetch()` line and any code referencing the `api.post` router.
> * Replace the landing page UI with a simple placeholder: "Lyra Workspace - Initializing...".
> * Open `src/server/api/routers/post.ts`. Delete all procedures except for a basic `hello` query to avoid breaking the `appRouter` type during this transition.
> 
> 
> 4. **Validate Environment Mapping:**
> * Open `src/env.js`. Ensure that `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are the required keys, and any old `DISCORD` variables are removed to prevent build-time validation errors.
> 
> 
> 5. **Execution & Verification:**
> * Run `npx prisma generate`.
> * Run `npm run build` locally.
> * Only if the local build succeeds, commit and push: `git add . && git commit -m "fix: production build blockers (Prisma v6 pathing & auth types)" && git push origin main`.
> 
> 
> 
> 
> **Definition of Done:** The project compiles successfully on Vercel with zero TypeScript or pathing errors.

---

### Why this is the final fix:

* **The `as any` Cast:** In Prisma v6, the client is configured with specific logging and extensions that change its internal type signature. The `PrismaAdapter` expects a generic client. Casting to `any` is the industry-standard "hotfix" to unblock Vercel while waiting for an official adapter update.
* **Pathing:** Vercel’s build pipeline is optimized to find Prisma in `node_modules`. Custom paths often fail during the "Serverless Function" bundling phase.
* **Boilerplate:** The `getLatest` error in `page.tsx` is the compiler looking for a "Post" model that you successfully deleted in Phase 1.

**Next Step:**
Once you run this and get a successful deploy link, you can record a quick "Phase 1: Success" Loom or move straight into the **Phase 2: Core Data Management** prompt to build the actual Base/Table dashboard. Do you want me to prep that Phase 2 prompt now?