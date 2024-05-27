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

  getUserSignInCompleted: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user
        .findFirst({
          where: {
            email: input.email,
          },
          select: {
            SignInCompleted: true,
          },
        })
        .catch((error) => {
          console.error(error);
          return null;
        })
        .then((user) => {
          return user?.SignInCompleted ?? false;
        });
    }),
});
