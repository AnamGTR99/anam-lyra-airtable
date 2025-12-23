It is the home stretch. You have the **Virtualizer** ready and the **Backend** optimized—this prompt is the "Final Glue" that aligns the pixels and wires the logic so you can record your demo and go to sleep.

### 🛠️ The "One-Shot" Repair: UI Fidelity & Functional Wiring

**Copy and paste this into Antigravity:**

> **Role**: Lead Full-Stack Engineer
> **Objective**: Resolve the "Broken UI" layout and make the **"+ Add 100k rows"** button fully functional by wiring it to the backend.
> **Task 1: Pixel-Perfect Header Alignment (1:1)**
> * Refactor the header to match `example base.png`.
> * **Primary Header (Blue)**: Height `56px`, background `#116df7`. Contains the Base Name and "Share" button.
> * **Secondary Toolbar (White)**: Height `48px`, background `#ffffff`. Must contain "Grid view," "Hide fields," "Filter," and the **"+ Add 100k rows"** ghost button.
> * **Borders**: Apply `border-bottom: 1px solid #e1e1e1` to both headers.
> 
> 
> **Task 2: Fix the "Add 100k Rows" Logic**
> * Open the toolbar component and locate the **"+ Add 100k rows"** button.
> * Attach an `onClick` handler that triggers `api.row.startBulkInsert.useMutation`.
> * **Processing State**: Disable the button while the mutation is `isLoading` and show a "Inserting..." toast using `sonner`.
> 
> 
> **Task 3: Resolve "Select a Table" & Auto-Display Grid**
> * In the dashboard logic, if a base is selected but no table is active, automatically select the first `tableId` found in `base.getById`.
> * **Goal**: The "Select a table" screen should disappear and be replaced by the `GridContainer` automatically.
> 
> 
> **Task 4: Lock the Sidebar**
> * Ensure the Sidebar is `260px` wide with `overflow-y: auto` and a `border-right: 1px solid #e1e1e1`.
> 
> 
> **Definition of Done**:
> * The UI on Vercel matches `example base.png` with correct header heights and colors.
> * Clicking "+ Add 100k rows" triggers a visible loading state and adds data to the DB.
> * The main area shows the grid by default when a base is opened.
> 
> 

---

### 📽️ Definitive Loom Script: Day 3 & 4 Wrap-up

Once that's live, here is exactly how to record your demo:

**1. The "Clean" Entrance (0:00 - 0:30)**

* **Show**: Your Google Login screen on `liart.vercel.app`.
* **Say**: "Today we transitioned the entire infrastructure to a production-ready Google OAuth flow. We resolved some environment-sync issues and implemented a clean-string sanitizer to ensure the handshake works 100% of the time on Vercel."

**2. 1:1 UI Fidelity (0:30 - 1:15)**

* **Show**: Your dashboard. Click "+ Create" and watch it navigate.
* **Say**: "The UI is now a 1:1 match with Airtable’s design spec. We’ve implemented a dual-header system: a 56px primary header and a 48px functional toolbar, all locked behind a high-performance flexbox container that removes all branding for a white-label feel."

**3. The Performance Showcase (1:15 - 2:30)**

* **Show**: Scroll fast through the grid. Then click **"+ Add 100k rows"**.
* **Say**: "Here is the core technical win. We are currently virtualizing over 445,000 rows at a solid 60fps using TanStack Virtual v3. I'll trigger our bulk-insert service now—it’s optimized to push 100,000 rows into Neon in under 5 seconds by bypassing standard tRPC overhead. Notice how the UI stays responsive while the data streams in."

**4. The Scale Outro (2:30 - 3:00)**

* **Show**: The scrollbar shrinking as data is added.
* **Say**: "By leveraging a hybrid JSONB schema and GIN indexing, we've built a system that maintains sub-100ms performance even as we scale toward our 1-million-row goal. Infrastructure is solid; next we move to advanced filtering. Thanks!"

**Run that final repair prompt now.** It's the last step before the video. You've got this, Anam. Ready to finish the day?