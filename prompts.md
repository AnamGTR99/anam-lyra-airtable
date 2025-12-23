Anam, you are 100% correct. Trying to shove virtualization, infinite scrolling, keyboard navigation, and optimistic editing into a single prompt is how bugs get "baked into" the foundation.

Breaking this into **Three Focused Sprints** ensures the agent handles the complex coordinate math of the virtualizer before we layer on the interaction logic. This is the professional way to build a high-performance engine.

---

### 🗺️ The Grid Implementation Roadmap

| Sub-Phase | Focus | PDF Requirement Addressed |
| --- | --- | --- |
| **4a: The Virtual Foundation** | Coordinate math, 60fps scrolling, 1M row height. | "Scroll down without lag" 

 |
| **4b: The Data Pipeline** | tRPC Infinite Query, bi-directional fetching. | "Virtualized infinite scroll" 

 |
| **4c: The Interaction Layer** | Arrow keys, Tab, Enter, Cell Editing. | "Arrow keys + tab key should move me smoothly" 

 |

---

### 🛠️ Sub-Phase 4a: The Virtualized Foundation (Coordinate Math)

**Copy and paste this into Antigravity:**

> **Role**: Senior Performance Engineer
> **Objective**: Implement the core virtualization shell using **TanStack Virtual v3** to handle the vertical scroll of 445k+ rows.
> **Task 1: The High-Performance Viewport**
> * Create a `GridContainer` component with `overflow: auto` and `position: relative`.
> * Implement `useVirtualizer` targeting this container.
> 
> 
> * **Key Constraint**: Use a **fixed item size of 35px** (matching our `--row-height` design token).
> * Set `count` to the total number of rows in the database (passed from the server-side base query).
> 
> 
> **Task 2: Absolute Row Positioning**
> * Do not use a standard `<table>` tag for the body, as it breaks virtualization.
> * Render rows as `div` elements with `position: absolute`, `top: 0`, and `left: 0`.
> * Use `transform: translateY(${virtualRow.start}px)` for each row to ensure hardware acceleration during scrolling.
> 
> 
> **Task 3: Sticky Header & CSS Grid**
> * Implement a sticky header row that remains at the top.
> * Inside each row, use a **CSS Grid** or **Flexbox** where each cell has a fixed or percentage-based width to align perfectly with the headers.
> * Match the border style `#e1e1e1` from the screenshots.
> 
> 
> **Definition of Done**:
> * On Vercel, I can scroll through a "white-space" viewport that is physically 15.5 million pixels tall (445k * 35px) without crashing the browser.
> * The scrollbar reflects the massive data size, but the DOM only contains the ~30 rows currently visible.
> 
> 

---

### 🚀 Why we start here

By finishing **4a** first, we verify that the **coordinate math** is correct. If the scrollbar doesn't feel right or the height is wrong, we fix it now before adding the complexity of data fetching.

**Fire off 4a now.** Once you can scroll that "infinite" empty grid on Vercel, I will give you **Sub-Phase 4b**, where we start pouring the **445k rows** of data into those virtual slots.

**Ready to see that scrollbar hit the bottom of 445k rows?**