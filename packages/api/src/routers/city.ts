import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const cityRouter = createTRPCRouter({
  getAllcity: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.city
      .findMany()
      .then((citys) =>
        citys.map((city) => ({ label: city.name, value: city.id }))
      );
  }),
});
