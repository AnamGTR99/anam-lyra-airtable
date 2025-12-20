import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";
import { bulkInsertRows } from "~/server/services/bulkInsertOptimized";

export const tableRouter = createTRPCRouter({
    /** Create a new Table with default columns and rows */
    create: protectedProcedure
        .input(
            z.object({
                baseId: z.string().cuid(),
                name: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership of the base
            await ensureOwnership(ctx.session.user.id, input.baseId);

            // Create the table
            const table = await db.table.create({
                data: {
                    name: input.name,
                    baseId: input.baseId,
                },
            });

            // Generate 5 default columns
            const columnPromises = Array.from({ length: 5 }).map(() => {
                const colId = `col_${Math.random().toString(36).substring(2, 10)}`;
                return db.column.create({
                    data: {
                        id: colId,
                        name: `col_${Math.random().toString(36).substring(2, 6)}`,
                        type: "TEXT",
                        order: Math.floor(Math.random() * 100),
                        tableId: table.id,
                    },
                });
            });
            const columns = await Promise.all(columnPromises);

            // Prepare 50 default rows as RowData objects
            const rowsData = Array.from({ length: 50 }).map(() => {
                const rowData: Record<string, any> = {};
                columns.forEach((col) => {
                    rowData[col.id] = `sample_${Math.random().toString(36).substring(2, 8)}`;
                });
                return rowData; // RowData
            });

            // Use bulk insert service (expects tableId and array of RowData)
            await bulkInsertRows(table.id, rowsData);

            return { table, columns };
        }),

    /** Get table metadata and its columns */
    getById: protectedProcedure
        .input(z.object({ tableId: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            const table = await db.table.findUnique({
                where: { id: input.tableId },
                include: { columns: true },
            });
            if (!table) {
                throw new Error("Table not found");
            }
            // Ensure the requester owns the base of this table
            const base = await db.base.findUnique({
                where: { id: table.baseId },
                select: { createdById: true },
            });
            if (base?.createdById !== ctx.session.user.id) {
                throw new Error("Forbidden");
            }
            return table;
        }),
});
