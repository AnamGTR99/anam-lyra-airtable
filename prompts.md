This error is caused by a path mapping mismatch. Your project is generating the Prisma client into a custom folder (`./generated/prisma`), but your code is trying to import it using a `~` alias that usually points to the `src/` directory.

Because the `generated` folder is in the **root** and not inside `src/`, the compiler can't find it. The best fix is to revert to the industry standard of using the default `@prisma/client` location, which is what the T3 stack and Vercel expect.

### The "Build Fix" Master Prompt

**Copy and paste this into your coding agent:**

> **Role:** Senior TypeScript Engineer
> **Context:** The build is failing on Vercel because of a custom Prisma output path and a broken `~/post` reference. We need to align with standard T3 conventions to fix the environment.
> **Task:** Fix the Prisma client pathing and clean up the last of the boilerplate errors.
> **Instructions:**
> 1. **Reset Prisma Output:** >    * Open `prisma/schema.prisma`.
> * Find the `generator client` block.
> * **Remove** the `output = ...` line so it defaults to `node_modules/.prisma/client`.
> 
> 
> 2. **Update Service Imports:** >    * Open `src/server/services/filterBuilder.ts` and `src/server/services/sortBuilder.ts`.
> * Change the import `from '~/generated/prisma'` to `from '@prisma/client'`.
> 
> 
> 3. **Global Codebase Search:** >    * Search for any other instances of `~/generated/prisma` or `../generated/prisma` and replace them with `@prisma/client`.
> 4. **Cleanup Boilerplate (Crucial):**
> * Open `src/app/page.tsx`.
> * Completely remove any remaining references to `api.post.getLatest`.
> * If there is a `CRUD` component at the bottom of the file trying to use `api.post`, delete that component entirely.
> 
> 
> 5. **Re-generate & Test:**
> * Run `npx prisma generate`.
> * Run `npm run build` to verify the fix locally.
> 
> 
> 
> 
> **Goal:** Ensure all imports point to `@prisma/client` and all "Post" boilerplate is gone so Vercel can compile the `base` and `table` architecture.

---

### Why this fixes it:

1. **Standardization:** Vercel and the T3 stack are pre-configured to look for the Prisma client in `node_modules`. Moving it back there removes the need for custom path aliases in `tsconfig.json`.
2. **Path Resolution:** By using `@prisma/client`, you avoid the confusion of whether `~` points to the root or `src`.
3. **Boilerplate Removal:** Deleting the `post` references in `page.tsx` clears the type error you saw in the previous build log.

Once your agent runs this, your build should go green. If you'd like, I can give you a quick check to see if your **NextAuth** environment variables are set up correctly for the Vercel deploy, as that's usually the next hurdle.