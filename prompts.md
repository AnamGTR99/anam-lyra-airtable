This is the most critical pivot point in the project. You've built a 15-million-pixel tall "ghost" scrollbar, but without wiring the **tRPC data pipeline**, you're just scrolling through empty space.

We are going to skip the "pretty" sidebar polish and focus on the **"Functional Plumbing."** This prompt will turn those dead buttons into triggers and pour your **445k rows** into that virtualized container so you can actually verify the "Airtable-scale" performance.

### 🛠️ The "Functional Wiring" Detour Prompt

**Copy and paste this into Antigravity:**

> **Role**: Lead Full-Stack Engineer
> **Objective**: Bridge the gap between the UI Shell and the High-Performance Backend. Wire the navigation, creation, and data-fetching logic so the 445k-row grid becomes testable.
> **Task 1: The "Auto-Select" Navigation Hook**
> * In `src/app/page.tsx`, implement a logic check using `api.base.list.useQuery`.
> * **Logic**: If the user has bases, automatically use `router.push` to navigate them to the first `baseId` in the list (e.g., `/base/[id]`).
> * **Why**: This bypasses the "Welcome" screen and drops the user directly into the grid for testing.
> 
> 
> **Task 2: Wiring the "+ Create" & Sidebar**
> * Attach the `api.base.create.useMutation` to the Sidebar's **"+ Create"** button.
> * Ensure the sidebar list of bases is clickable, using Next.js `Link` components to change the `baseId` in the URL.
> 
> 
> **Task 3: The Infinite Data Pipe (Phase 4b Integration)**
> * In `src/app/_components/Grid.tsx`, replace the hardcoded "Row Index" labels with real data.
> * Use `api.row.listInfinite.useInfiniteQuery` to fetch rows in batches of 100.
> * **Handshake**: Connect the TanStack Virtualizer's `virtualRows` to the data returned by the infinite query. If a row is currently "fetching," show a skeleton loader row.
> 
> 
> **Task 4: The 100k Row Performance Trigger**
> * Wire the toolbar's **"+ Add 100k rows"** button to `api.row.startBulkInsert.useMutation`.
> * Implement a "Loading Toast" using `sonner` or a simple state variable to show the user that the background job is running.
> 
> 
> **Definition of Done**:
> * Upon login, I am automatically redirected to a base.
> * The grid actually displays data (or skeleton rows) from the Neon DB.
> * I can click "+ Create" and see a new base appear in the sidebar immediately.
> * The app remains at 60fps even as the infinite query fetches the next batch of rows.
> 
> 

---

### 🚀 What this solves for you

1. **Sidebar is no longer "Dead"**: You'll be able to create and switch between bases, which is the only way to test if the table renders correctly for different datasets.
2. **Visual Confirmation**: You'll see the **445k rows** actually appearing in the cells as you scroll.
3. **The "10M Row" Scale**: By wiring the bulk-insert button, you can push the database to 1 million+ rows while you watch the scrollbar get even smaller—proving the system doesn't break under extreme load.

**Run this prompt now.** Once the buttons work and the rows are "real," we will move to the final performance hurdle: **Optimistic Cell Editing** and **Keyboard Navigation**.

**Ready to see your actual data scrolling at 60fps?**