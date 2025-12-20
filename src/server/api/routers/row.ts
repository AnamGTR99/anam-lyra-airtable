import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";
import { buildFilterQuery } from "~/server/services/filterBuilder";
import { buildSortQuery } from "~/server/services/sortBuilder";
import { bulkInsertRows } from "~/server/services/bulkInsertOptimized";

export const rowRouter = createTRPCRouter({
    /** List rows with pagination, filtering, and sorting */
    list: protectedProcedure
        .input(
            z.object({
                tableId: z.string().cuid(),
                limit: z.number().int().min(1).max(100).default(20),
                offset: z.number().int().min(0).default(0),
                filter: z.any().optional(), // expects FilterConfig
                sort: z.any().optional(), // expects SortConfig[]
            })
        )
        .query(async ({ ctx, input }) => {
            // Ownership check
            const table = await db.table.findUnique({ where: { id: input.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            // Build where clause
            const where = input.filter ? buildFilterQuery(input.filter) : {};
            // Build order by clause
            const orderBy = input.sort ? buildSortQuery(input.sort) : [{ order: "asc" }];

            const rows = await db.row.findMany({
                where: { ...where, tableId: input.tableId },
                orderBy,
                take: input.limit,
                skip: input.offset,
            });
            return rows;
        }),

    /** Update a single cell in a row */
    updateCell: protectedProcedure
        .input(
            z.object({
                rowId: z.string().cuid(),
                columnId: z.string(),
                value: z.union([z.string(), z.number(), z.null()]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const row = await db.row.findUnique({ where: { id: input.rowId }, select: { tableId: true } });
            if (!row) throw new Error("Row not found");
            const table = await db.table.findUnique({ where: { id: row.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            // Update JSONB field using Prisma's jsonSet (PostgreSQL specific)
            await db.$executeRawUnsafe(
                `UPDATE "Row" SET data = jsonb_set(data, $1, to_jsonb($2), true) WHERE id = $3`,
                `{${input.columnId}}`,
                input.value,
                input.rowId
            );
            return { success: true };
        }),

    /** Bulk insert rows (expects array of RowData) */
    bulkInsert: protectedProcedure
        .input(
            z.object({
                tableId: z.string().cuid(),
                rows: z.array(z.record(z.union([z.string(), z.number(), z.null()]))),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const table = await db.table.findUnique({ where: { id: input.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            // Use bulk insert service
            await bulkInsertRows(input.tableId, input.rows);
            return { success: true };
        }),
});
