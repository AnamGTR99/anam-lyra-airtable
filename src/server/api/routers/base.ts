import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { ensureOwnership } from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
    /** Create a new Base */
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const base = await db.base.create({
                data: {
                    name: input.name,
                    createdById: ctx.session.user.id,
                },
            });
            return base;
        }),

    /** List all Bases owned by the current user */
    list: protectedProcedure.query(async ({ ctx }) => {
        const bases = await db.base.findMany({
            where: { createdById: ctx.session.user.id },
        });
        return bases;
    }),

    /** Delete a Base (cascades tables & rows) */
    delete: protectedProcedure
        .input(z.object({ baseId: z.string().cuid() }))
        .mutation(async ({ ctx, input }) => {
            await ensureOwnership(ctx.session.user.id, input.baseId);
            await db.base.delete({ where: { id: input.baseId } });
            return { success: true };
        }),
});
