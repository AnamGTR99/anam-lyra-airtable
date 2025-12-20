import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
    /** Create a new column in a table */
    create: protectedProcedure
        .input(
            z.object({
                tableId: z.string().cuid(),
                name: z.string().min(1),
                type: z.enum(["TEXT", "NUMBER"]),
                order: z.number().int().min(0),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership of the base via the table
            const table = await db.table.findUnique({
                where: { id: input.tableId },
                select: { baseId: true },
            });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            const column = await db.column.create({
                data: {
                    id: `col_${Math.random().toString(36).substring(2, 10)}`,
                    name: input.name,
                    type: input.type,
                    order: input.order,
                    tableId: input.tableId,
                },
            });
            return column;
        }),

    /** Update column name or type */
    update: protectedProcedure
        .input(
            z.object({
                columnId: z.string().cuid(),
                name: z.string().min(1).optional(),
                type: z.enum(["TEXT", "NUMBER"]).optional(),
                order: z.number().int().min(0).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const column = await db.column.findUnique({
                where: { id: input.columnId },
                select: { tableId: true },
            });
            if (!column) throw new Error("Column not found");
            const table = await db.table.findUnique({
                where: { id: column.tableId },
                select: { baseId: true },
            });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            const updated = await db.column.update({
                where: { id: input.columnId },
                data: {
                    ...(input.name && { name: input.name }),
                    ...(input.type && { type: input.type }),
                    ...(input.order !== undefined && { order: input.order }),
                },
            });
            return updated;
        }),

    /** Delete a column and remove its key from all rows */
    delete: protectedProcedure
        .input(z.object({ columnId: z.string().cuid() }))
        .mutation(async ({ ctx, input }) => {
            const column = await db.column.findUnique({
                where: { id: input.columnId },
                select: { tableId: true, id: true },
            });
            if (!column) throw new Error("Column not found");
            const table = await db.table.findUnique({
                where: { id: column.tableId },
                select: { baseId: true },
            });
            if (!table) throw new Error("Table not found");
            await ensureOwnership(ctx.session.user.id, table.baseId);

            // Remove column key from all rows JSONB data
            await db.$executeRawUnsafe(
                `UPDATE "Row" SET data = data - $1 WHERE "tableId" = $2`,
                column.id,
                column.tableId
            );

            // Delete the column record
            await db.column.delete({ where: { id: input.columnId } });
            return { success: true };
        }),
});
