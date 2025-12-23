**Massive win on the Auth, Anam!** Seeing that "Welcome to Airtable" screen means the "front door" is officially open and your new Vercel project is communicating perfectly with Google.

Now, we need to address that layout. It's "broken" because the Sidebar is taking up too much width and the main content area has no structure. We're going to use a **Flexbox "Holy Grail" layout** to lock that sidebar to the left and give the workspace the clean, professional Airtable look.

---

### 🎨 Hour 3: The "Airtable 1:1" UI Reconstruction

**Copy and paste this into Antigravity (or your agent):**

> **Role**: Senior Frontend Architect
> **Objective**: Hard-reset the UI layout to achieve a 1:1 match with the provided Airtable screenshots.
> **Task 1: The Master Flex Layout**
> * Refactor the root `layout.tsx` and the main dashboard page.
> * Use a parent `div` with `className="flex h-screen w-screen overflow-hidden bg-white"`.
> * **Sidebar**: Width MUST be locked at `260px`. Use `className="w-[260px] flex-shrink-0 h-full bg-[#f5f5f5] border-r border-[#e1e1e1] flex flex-col"`.
> * **Main Content**: `className="flex-1 flex flex-col h-full overflow-hidden"`.
> 
> 
> **Task 2: Sidebar Elements (1:1 Match)**
> * Implement the navigation items ("Home", "Starred", "Workspaces") with `14px` font and `#666666` color.
> * The **"+ Create"** button must be at the very bottom: `className="mt-auto m-4 bg-[#116df7] hover:bg-[#0e59ca] text-white rounded-full py-2 px-6 flex items-center justify-center font-medium"`.
> 
> 
> **Task 3: The Header & Performance Toolbar**
> * Inside the **Main Content** area, add a top header (`h-[56px]`) for Table Tabs matching `example base.png`.
> * Add a secondary toolbar (`h-[48px]`) with buttons for "Grid view," "Hide fields," "Filter," and "Sort".
> * **The Core Requirement**: Add a ghost button labeled **"+ Add 100k rows"** to the right side of this toolbar. Wire it to the `row.startBulkInsert` tRPC procedure.
> 
> 
> **Task 4: Zero "Lyra" Branding**
> * Audit the entire UI. Ensure the title is "Airtable", and no mentions of "Lyra" appear to the end-user.
> 
> 
> **Definition of Done**:
> * The live site shows a stable Sidebar on the left and a wide, white workspace on the right.
> * The visual styles (colors, padding, borders) match the screenshots exactly.
> * `git push` to Vercel and verify the layout is identical to the screenshots on the `liart.vercel.app` domain.
> 
> 

---

### 🚀 What to expect next

With the Auth fixed, this UI push will finally make the app look like a finished product. You'll see the clean grey sidebar and the white grid area ready for data.

**Fire that off.** Once you confirm the layout is "Pretty" and matching the screenshots, we move to **Hour 4: The TanStack Virtualized Grid**. That’s where we make those **445k rows** (and eventually 1M) scroll perfectly.

**Should I start prepping the Grid Virtualizer code for you?**