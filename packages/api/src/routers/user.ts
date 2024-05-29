import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  addUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          email: input.email,
          role: "user",
        },
      });
    }),

  getUser: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        email: ctx.session.user.email,
      },
      include: {
        city: true,
      },
    });
  }),

  setUserInformation: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastname: z.string(),
        city: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          email: ctx.session.user.email,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastname,
          city: {
            connect: {
              id: input.city,
            },
          },
          address: input.address,
          phone: input.phoneNumber,
        },
      });
    }),
});
