import { z } from "zod";

import { createTRPCRouter, privilegedProcedure } from "../trpc";

enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const ItalianToEnglishWeekday = {
  Lunedì: Weekday.Monday,
  Martedì: Weekday.Tuesday,
  Mercoledì: Weekday.Wednesday,
  Giovedì: Weekday.Thursday,
  Venerdì: Weekday.Friday,
  Sabato: Weekday.Saturday,
  Domenica: Weekday.Sunday,
};

export const adminRouter = createTRPCRouter({
  getWasteTypes: privilegedProcedure.query(async ({ ctx }) => {
    return ctx.db.wasteType.findMany();
  }),

  getAdminUsers: privilegedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: {
        role: "admin",
      },
      include: {
        city: true,
      },
    });
  }),

  getCitySecondHandProducts: privilegedProcedure.query(async ({ ctx }) => {
    const { cityId } = await ctx.db.user
      .findFirst({
        where: {
          email: ctx.session.user.email,
        },
      })
      .then((user) => {
        return (
          user ?? {
            cityId: null,
          }
        );
      });

    if (!cityId) {
      throw new Error("City not found");
    }

    return ctx.db.city.findFirst({
      where: {
        id: cityId,
      },
      select: {
        secondHandProduct: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            status: true,
          },
        },
      },
    });
  }),

  getCityPickRequests: privilegedProcedure.query(async ({ ctx }) => {
    const { cityId } = await ctx.db.user
      .findFirst({
        where: {
          email: ctx.session.user.email,
        },
      })
      .then((user) => {
        return (
          user ?? {
            cityId: null,
          }
        );
      });

    if (!cityId) {
      return null;
    }

    return ctx.db.city
      .findFirst({
        where: {
          id: cityId,
        },
        select: {
          pickups: {
            select: {
              user: {
                select: {
                  phone: true,
                  id: true,
                },
              },
              id: true,
              address: true,
              images: true,
              type: true,
            },
          },
        },
      })
      .then((city) => {
        // put the user phone in the pickup object
        return city?.pickups.map((pickup) => {
          return {
            ...pickup,
            phone: pickup.user.phone,
            userId: pickup.user.id,
          };
        });
      });
  }),

  getCityReports: privilegedProcedure.query(async ({ ctx }) => {
    const { cityId } = await ctx.db.user
      .findFirst({
        where: {
          email: ctx.session.user.email,
        },
      })
      .then((user) => {
        return (
          user ?? {
            cityId: null,
          }
        );
      });

    if (!cityId) {
      return null;
    }

    return ctx.db.city
      .findFirst({
        where: {
          id: cityId,
        },
        select: {
          reports: {
            select: {
              user: {
                select: {
                  phone: true,
                  id: true,
                },
              },
              id: true,
              address: true,
              images: true,
              type: true,
            },
          },
        },
      })
      .then((city) => {
        return city?.reports.map((report) => {
          return {
            ...report,
            phone: report.user.phone,
          };
        });
      });
  }),

  setAdminHours: privilegedProcedure
    .input(
      z.object({
        hours: z.array(
          z.object({
            name: z.string(),
            open: z.boolean(),
            openTime1: z.string(),
            closeTime1: z.string(),
            openTime2: z.string(),
            closeTime2: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId } = await ctx.db.user
        .findFirst({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          return (
            user ?? {
              cityId: null,
            }
          );
        });

      if (!cityId) {
        return null;
      }

      const city = await ctx.db.city.findFirst({
        where: {
          id: cityId,
        },
        select: {
          openingHours: true,
        },
      });

      if (city) {
        for (const day of input.hours) {
          const englishDay =
            ItalianToEnglishWeekday[
              day.name as keyof typeof ItalianToEnglishWeekday
            ];
          const existingHour = city.openingHours.find(
            (hour) => hour.day === englishDay
          );

          if (existingHour) {
            await ctx.db.openingHour.update({
              where: {
                id: existingHour.id,
              },
              data: {
                openTime1: day.openTime1,
                closeTime1: day.closeTime1,
                openTime2: day.openTime2,
                closeTime2: day.closeTime2,
                isOpen: day.open,
              },
            });
          } else {
            await ctx.db.openingHour.create({
              data: {
                cityId: cityId,
                day: englishDay,
                openTime1: day.openTime1,
                closeTime1: day.closeTime1,
                openTime2: day.openTime2,
                closeTime2: day.closeTime2,
                isOpen: day.open,
              },
            });
          }
        }
      }
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

  setCityStatistics: privilegedProcedure
    .input(
      z.object({
        indicators: z.array(
          z.object({
            // CAN Be string or number depending on the indicator type
            id: z.any(),
            name: z.string(),
            data: z.string(),
            type: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId } = await ctx.db.user
        .findFirst({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          return (
            user ?? {
              cityId: null,
            }
          );
        });

      if (!cityId) {
        return null;
      }

      await ctx.db.statistic.deleteMany({
        where: {
          cityId: cityId,
        },
      });

      for (const indicator of input.indicators) {
        await ctx.db.statistic.create({
          data: {
            city: {
              connect: {
                id: cityId,
              },
            },
            type: indicator.type as "ProductionIndicator" | "SpecificIndicator",
            name: indicator.name,
            data: indicator.data,
          },
        });
      }
    }),

  setWasteTypes: privilegedProcedure
    .input(
      z.object({
        wasteTypes: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
            category: z.any(),
            info: z.array(z.string()),
            icon: z.string(),
            selected: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      for (const wasteType of input.wasteTypes) {
        await ctx.db.wasteType.update({
          where: {
            id: wasteType.id,
          },
          data: {
            name: wasteType.name,
            color: wasteType.color,
            category: wasteType.category,
            info: wasteType.info,
            icon: wasteType.icon,
          },
        });
      }
    }),

  setSecondHandProduct: privilegedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        images: z.array(z.string()),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.secondHandProduct.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          images: input.images,
          status: input.status,
        },
      });
    }),

  getSupportRequestfromId: privilegedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.supportRequest.findFirst({
        where: {
          id: input.id,
        },
        select: {
          user: true,
          messages: {
            select: {
              content: true,
              user: true,
              createdAt: true,
            },
          },
          id: true,
        },
      });
    }),

  getCitySupportRequests: privilegedProcedure.query(async ({ ctx }) => {
    const { cityId } = await ctx.db.user
      .findFirst({
        where: {
          email: ctx.session.user.email,
        },
      })
      .then((user) => {
        return (
          user ?? {
            cityId: null,
          }
        );
      });

    if (!cityId) {
      return null;
    }

    return ctx.db.city
      .findFirst({
        where: {
          id: cityId,
        },
        select: {
          SupportRequest: {
            select: {
              id: true,
              status: true,
              user: true,
              messages: {
                select: {
                  content: true,
                  user: true,
                  createdAt: true,
                },
              },
              updatedAt: true,
            },
          },
        },
      })
      .then((city) => {
        // ho bisogno che ritorni tutto + un parametro che per ogni messaggio mi permetta di capire se è stato inviato da un admin o da un utente
        return city?.SupportRequest.map((request) => {
          return {
            ...request,
            isAdmin: request.user.role === "admin",
          };
        });
      });
  }),

  AddMessageToCitySupportRequest: privilegedProcedure
    .input(
      z.object({
        requestId: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.supportRequest
        .findFirst({
          where: {
            id: input.requestId,
          },
        })
        .then((supportRequest) => {
          if (!supportRequest) {
            throw new Error("Support request not found");
          }
          return ctx.db.supportMessage.create({
            data: {
              content: input.message,
              supportRequest: {
                connect: {
                  id: supportRequest.id,
                },
              },
              user: {
                connect: {
                  email: ctx.session.user.email,
                },
              },
            },
          });
        });
    }),

  createSecondHandProduct: privilegedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        images: z.array(z.string()),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId } = await ctx.db.user
        .findFirst({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          return (
            user ?? {
              cityId: null,
            }
          );
        });

      if (!cityId) {
        return null;
      }

      await ctx.db.secondHandProduct.create({
        data: {
          id: input.id,
          name: input.name,
          description: input.description,
          price: input.price,
          images: input.images,
          status: input.status,
          city: {
            connect: {
              id: cityId,
            },
          },
        },
      });
    }),

  setCityCalendar: privilegedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          day: z.string(),
          cityId: z.string(),
          wasteTypes: z.array(z.any()),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const { cityId } = await ctx.db.user
        .findFirst({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          return (
            user ?? {
              cityId: null,
            }
          );
        });

      if (!cityId) {
        throw new Error("City not found");
      }

      // ottieni tutti i calendari per la città
      await ctx.db.calendar
        .findMany({
          where: {
            cityId: cityId,
          },
        })
        .then(async (calendars) => {
          // elimina tutti i waste type associati ai calendari della città
          for (const calendar of calendars) {
            await ctx.db.calendarWasteType.deleteMany({
              where: {
                calendarId: calendar.id,
              },
            });
          }
        })
        .then(async () => {
          //per ogni calendario accedi a wasteTypes e crea un nuovo calendarWasteType
          for (const calendar of input) {
            for (const wasteType of calendar.wasteTypes) {
              // ottieni l'id del calendario della città al giorno specifico
              const calendarIstance = await ctx.db.calendar
                .findFirst({
                  where: {
                    cityId: cityId,
                    day: calendar.day,
                  },
                })
                .then((calendar) => {
                  return (
                    calendar ?? {
                      id: null,
                    }
                  );
                });

              await ctx.db.calendarWasteType.create({
                data: {
                  calendar: {
                    connect: {
                      id: calendarIstance.id as string,
                    },
                  },
                  wasteType: {
                    connect: {
                      id: wasteType.wasteType.id,
                    },
                  },
                },
              });
            }
          }
        });
    }),

  setCityContact: privilegedProcedure
    .input(
      z.object({
        email: z.string(),
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId } = await ctx.db.user
        .findFirst({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          return (
            user ?? {
              cityId: null,
            }
          );
        });

      if (!cityId) {
        return null;
      }

      await ctx.db.city.update({
        where: {
          id: cityId,
        },
        data: {
          email: input.email,
          whatsappNumber: input.phone,
        },
      });
    }),
});
