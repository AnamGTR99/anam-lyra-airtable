This build error is a classic "boilerplate clash." The **T3 Stack** comes with a default "Post" feature, but your **Phase 1 infrastructure** work replaced the underlying schema and likely the router logic to support the **Airtable Base/Table** architecture. Your `src/app/page.tsx` is still trying to fetch a "Post" that no longer exists in your code.

Here is a surgical prompt to give your coding agent to clear these errors and align the frontend with your new architecture.

### The "Build Fix" Master Prompt

> **Role**: Senior TypeScript Engineer
> **Context**: The project build is failing with a `Type error: Property 'getLatest' does not exist on type 'DecorateRouterRecord'`. This is because the boilerplate code in `src/app/page.tsx` is referencing the default T3 'post' router which we have refactored or removed to support our Airtable clone architecture.
> **Task**: Clean up the boilerplate and align the landing page with the new schema.
> **Instructions**:
> 1. **Clean Landing Page**: Open `src/app/page.tsx`. Remove the `void api.post.getLatest.prefetch()` call and any references to `api.post`.
> 2. **Refactor UI**: Update the landing page to be a simple "Lyra Dashboard" starter. If `session` exists, show a "Create New Base" button (referencing your `base.create` mutation) and a list of existing bases (referencing `base.list`).
> 3. **Router Audit**: Check `src/server/api/root.ts` and `src/server/api/routers/`. If the `post.ts` router still exists and isn't being used for the Airtable logic, delete it and remove its reference from the root router to prevent further type confusion.
> 4. **Type Sync**: Ensure all tRPC procedures called in the frontend exist in your new routers (`base`, `table`, etc.) defined in Phase 1.
> 5. **Verify**: Run `npm run build` after changes to ensure all type errors are resolved.
> 
> 
> **Goal**: Achieve a successful build where the landing page correctly initiates the "Airtable Workspace" flow rather than the default "T3 Post" flow.

---

### Why this happened

When you implemented the **Hybrid JSONB schema**, the `Post` model in `prisma/schema.prisma` was likely deleted or renamed. The tRPC hooks are auto-generated based on your server-side routers. Since the `post` router was "to be replaced", the TypeScript compiler is correctly telling you that `getLatest` is now a "ghost" property.

### Quick Manual Check

If you want to verify this yourself before running the prompt:

1. **Check `src/server/api/root.ts**`: See if `post` is still in the `appRouter`.
2. **Check `src/app/page.tsx**`: You'll see a large block of code at the bottom of the file (usually a `CRUD` component) that specifically uses `api.post.create.useMutation` and `api.post.getLatest.useQuery`. **Delete that entire component.**

**If you like, I can draft a "Day 2 Starter" prompt next to help your agent build out the actual Base/Table list UI so you don't just have a blank page.**