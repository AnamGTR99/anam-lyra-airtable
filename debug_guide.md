# Debug Guide – Repository Overview (concise)

**Purpose**: This document provides a high‑level index of every file in the `anam-lyra-airtable` repository and a short description of its role. It is intended as context for any downstream agent that will design instructions or debug the project.

---

## Top‑Level Files & Directories

| Path | Type | Brief Description |
|------|------|-------------------|
| `.env.example` | file | Template for environment variables (auth secrets, DB URL). |
| `.env.local` | file | Actual local env values (generated `AUTH_SECRET`, Google OAuth IDs, DB URL). |
| `README.md` | file | Project overview, setup instructions, deployment notes. |
| `package.json` | file | npm dependencies, scripts (`dev`, `build`, `lint`). |
| `tsconfig.json` | file | TypeScript compiler configuration. |
| `next.config.js` | file | Next.js configuration (strict mode, SWC minify). |
| `postcss.config.js` | file | PostCSS plugins (Tailwind, autoprefixer). |
| `prisma/` | directory | Prisma schema, migrations, and lock file. |
| `src/` | directory | Main application source code. |
| `public/` | directory | Static assets (favicon, images). |

---

## `prisma/` Directory

| Path | Description |
|------|-------------|
| `schema.prisma` | Defines the hybrid JSONB data model (`Base`, `Table`, `Column`, `Row`, `TableView`) and NextAuth models. |
| `migrations/20231219_init_hybrid_schema/migration.sql` | SQL for creating tables and GIN/composite indexes. |
| `migration_lock.toml` | Prisma migration lock (ensures single migration at a time). |

---

## `src/` Core Sub‑Directories

| Directory | Key Files | Purpose |
|-----------|-----------|---------|
| `app/` | `layout.tsx`, `page.tsx`, `_components/post.tsx`, `api/` (auth & trpc) | Next.js pages, layout, placeholder UI, API routes. |
| `styles/` | `design-system.css`, `globals.css` | Design system (Airtable palette, `--row-height` token) and Tailwind imports. |
| `server/` | `db.ts`, `auth/` (`config.ts`), `api/` (routers, root, trpc), `services/` (filterBuilder, sortBuilder, bulkInsertOptimized), `validators/filters.ts` | Backend: database client, auth config, tRPC router registration, business‑logic services, Zod validation. |
| `types/` | `db.ts` | TypeScript types for `RowData`, filter/sort configs. |
| `state/` | `focusSlice.ts` | Zustand store for keyboard focus & cell selection. |
| `trpc/` | `react.tsx`, `server.ts`, `query-client.ts` | tRPC client & server helpers. |

---

## Important Files (selected for quick reference)

- **`src/server/api/root.ts`** – Aggregates all tRPC routers (`base`, `table`, `column`, `row`, `view`, `search`).
- **`src/server/api/routers/table.ts`** – Implements `create` (default columns & rows), `getById`; uses `bulkInsertRows`.
- **`src/server/api/routers/row.ts`** – Row CRUD (`list`, `updateCell`, `bulkInsert`).
- **`src/server/services/bulkInsertOptimized.ts`** – High‑performance bulk insert using raw SQL VALUES/UNNEST.
- **`src/server/services/filterBuilder.ts`** – Translates filter configs into Prisma JSONB `WHERE` clauses.
- **`src/server/services/sortBuilder.ts`** – Translates sort configs into Prisma `ORDER BY` clauses.
- **`src/server/api/validators/filters.ts`** – Zod schemas for filter and sort payload validation.
- **`src/app/api/auth/[...nextauth]/route.ts`** – NextAuth Google provider configuration, uses env vars.
- **`src/app/api/trpc/[trpc]/route.ts`** – Edge‑runtime tRPC handler.
- **`src/app/_components/post.tsx`** – Placeholder component (now static greeting after API removal).
- **`src/app/page.tsx`** – Home page with static greeting and sign‑in/out link.

---

## How to Use This Guide
1. **Locate a file** – Search the table above for the path you need; the description tells you its role.
2. **Open the file** – Use `view_file` or your IDE to inspect the full content.
3. **Modify / Extend** – When adding new features, start from the relevant section (e.g., add a new tRPC router under `src/server/api/routers/`).
4. **Reference Types** – Use `src/types/db.ts` for consistent `RowData` and filter/sort shapes.
5. **Performance** – For bulk data operations, always call `bulkInsertRows` from the services layer.

---

*This guide is intentionally concise; it serves as a map rather than a full code dump. For deeper inspection, open the individual files.*
