import { z } from "zod";

import {
  createTRPCRouter,
  privilegedProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
export const adminRouter = createTRPCRouter({
  getWasteTypes: privilegedProcedure.query(async ({ ctx }) => {
    return ctx.db.wasteType.findMany();
  }),

  getAdminUsers: privilegedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: {
        role: "admin",
      },
    });
  }),

  setAdminCity: privilegedProcedure
    .input(z.object({ city: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          email: ctx.session.user.email,
        },
        data: {
          city: {
            connect: {
              id: input.city,
            },
          },
        },
      });
    }),
});
