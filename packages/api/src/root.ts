import { adminRouter } from "./routers/admin";
import { cityRouter } from "./routers/city";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  city: cityRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
