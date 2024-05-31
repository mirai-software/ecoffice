import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cityRouter = createTRPCRouter({
  getAllcity: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.city
      .findMany()
      .then((citys) =>
        citys.map((city) => ({ label: city.name, value: city.id }))
      );
  }),

  getCityCalendar: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      // get the user city id
      return await ctx.db.user
        .findUnique({
          where: { email: ctx.session.user.email },
          select: { city: true },
        })
        .then(async (userCity) => {
          if (!userCity || userCity.city === null) {
            throw new Error("City Relation not found");
          } else {
            // get the city calendar and the CalendarWasteType relation
            return await ctx.db.city
              .findUnique({
                where: { id: userCity.city.id },
                include: {
                  calendars: {
                    include: {
                      wasteTypes: {
                        include: {
                          wasteType: true, // Include i dettagli completi di wasteType
                        },
                      },
                    },
                  },
                },
              })
              .then((city) => {
                if (!city) {
                  throw new Error("City not found");
                }
                return city.calendars.map((calendar) => {
                  return {
                    ...calendar,
                    wasteTypes: calendar.wasteTypes.map((wasteTypeRelation) => {
                      return {
                        ...wasteTypeRelation.wasteType, // Usa i dettagli completi di wasteType
                      };
                    }),
                  };
                });
              });
          }
        });
    }),

  getWasteType: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.wasteType.findUnique({
        where: { id: input.id },
      });
    }),
});
