import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";

export const searchRouter = createTRPCRouter({
    /** Global search across tables for the authenticated user */
    globalSearch: protectedProcedure
        .input(
            z.object({
                query: z.string().min(1),
                limit: z.number().int().min(1).max(100).default(20),
            })
        )
        .query(async ({ ctx, input }) => {
            // Find bases owned by the user
            const bases = await db.base.findMany({ where: { createdById: ctx.session.user.id } });
            const baseIds = bases.map((b) => b.id);

            // Search tables within those bases where any TEXT column contains the query string
            const tables = await db.table.findMany({ where: { baseId: { in: baseIds } } });
            const tableIds = tables.map((t) => t.id);

            // Simple JSONB contains search across rows' data fields
            const rows = await db.row.findMany({
                where: {
                    tableId: { in: tableIds },
                    data: { string_contains: input.query },
                },
                take: input.limit,
            });
            return rows;
        }),
});
