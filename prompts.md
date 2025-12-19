It is engineered to ensure the agent doesn't just "build a table," but builds the high-performance engine you’ve architected.

Part 1: The Day 1 Master Prompt
Copy and paste this into your coding agent:

Role: High-Performance Full-Stack Engineer / Lead Architect.

Project Context: I am building a high-agency Airtable clone ("Lyra") using the T3 Stack. The core engineering challenge is maintaining 60fps performance and sub-100ms database operations at a scale of 1 Million rows.

Task: Initialize the project infrastructure and the Hybrid JSONB/Relational Schema.

Instructions:

Scaffold Project: Initialize a T3 Stack app in the current directory (npm create t3-app@latest). Select: TypeScript, Prisma, Tailwind, tRPC, and NextAuth (Google Provider).

Directory Structure: Create the following directory tree as defined in my lyra-complete-plan.md:

src/server/api/validators/ (for Zod filters/sorts)

src/server/services/ (for bulk insert and query builders)

src/state/ (for Zustand focus/grid state)

src/styles/ (for design tokens)

Prisma Schema (Hybrid JSONB): Implement the schema from the Ultra-Refined Plan.

IMPORTANT: Do NOT create a 'Cells' table. Use a Row model with a data Json column to avoid the "Join Explosion."

Define Base, Table, Column (with ColumnType enum: TEXT, NUMBER), and TableView (storing filterConfig and sortConfig as JSON).

Database Migration:

Run npx prisma migrate dev --name init_hybrid_schema.

Post-Migration Step: Create a raw SQL migration to add a GIN index on Row.data and a composite index on (tableId, order).

Design System: Create src/styles/design-system.css. Initialize it with the Airtable color palette and a fixed 35px row height variable (--row-height: 35px;).

Type-Safety: Ensure that RowData and FilterCondition types are globally available in src/types/.

Definition of Done: The project is scaffolded, the database is migrated with the correct indexes, and the folder structure matches the plan. Report back with the completed file tree.