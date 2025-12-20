import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";

export const viewRouter = createTRPCRouter({
    /** Create a new view for a table */
    create: protectedProcedure
        .input(
            z.object({
                tableId: z.string().cuid(),
                name: z.string().min(1),
                filterConfig: z.any().optional(),
                sortConfig: z.any().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership of the base via the table
            const table = await db.table.findUnique({ where: { id: input.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            const view = await db.tableView.create({
                data: {
                    name: input.name,
                    tableId: input.tableId,
                    filterConfig: input.filterConfig ?? {},
                    sortConfig: input.sortConfig ?? [],
                },
            });
            return view;
        }),

    /** Update an existing view */
    update: protectedProcedure
        .input(
            z.object({
                viewId: z.string().cuid(),
                name: z.string().min(1).optional(),
                filterConfig: z.any().optional(),
                sortConfig: z.any().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const view = await db.tableView.findUnique({ where: { id: input.viewId }, select: { tableId: true } });
            if (!view) throw new Error("View not found");
            const table = await db.table.findUnique({ where: { id: view.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            const updated = await db.tableView.update({
                where: { id: input.viewId },
                data: {
                    ...(input.name && { name: input.name }),
                    ...(input.filterConfig && { filterConfig: input.filterConfig }),
                    ...(input.sortConfig && { sortConfig: input.sortConfig }),
                },
            });
            return updated;
        }),

    /** List all views for a table */
    list: protectedProcedure
        .input(z.object({ tableId: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            const table = await db.table.findUnique({ where: { id: input.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            const views = await db.tableView.findMany({ where: { tableId: input.tableId } });
            return views;
        }),

    /** Get a single view by ID */
    getById: protectedProcedure
        .input(z.object({ viewId: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            const view = await db.tableView.findUnique({ where: { id: input.viewId } });
            if (!view) throw new Error("View not found");
            const table = await db.table.findUnique({ where: { id: view.tableId }, select: { baseId: true } });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);
            return view;
        }),
});
