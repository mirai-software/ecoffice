import { z } from "zod";

import {
  createTRPCRouter,
  privilegedProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
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

  checkifUserisAdmin: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const check = await ctx.db.user
        .findUnique({
          where: {
            email: input.email,
            role: {
              in: ["admin", "editor"],
            },
          },
        })
        .then((user) => {
          if (!user) {
            return false;
          } else {
            return true;
          }
        });
      return check;
    }),

  addPickupRequest: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        images: z.array(z.string()),
        type: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          if (!user) {
            throw new Error("User not found");
          }

          return ctx.db.pickup.create({
            data: {
              address: input.address,
              images: input.images,
              type: input.type,
              status: "pending",
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        });
    }),

  addReportRequest: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        images: z.array(z.string()),
        type: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          if (!user) {
            throw new Error("User not found");
          }

          return ctx.db.report.create({
            data: {
              address: input.address,
              images: input.images,
              type: input.type,
              status: "pending",
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        });
    }),

  getUserReportRequests: protectedProcedure.query(({ ctx }) => {
    return ctx.db.report.findMany({
      where: {
        user: {
          email: ctx.session.user.email,
        },
      },
    });
  }),

  getUserReportRequest: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.report.findUnique({
        where: {
          user: {
            email: ctx.session.user.email,
          },
          id: input.id,
        },
      });
    }),

  getUserPickupRequest: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.pickup.findUnique({
        where: {
          user: {
            email: ctx.session.user.email,
          },
          id: input.id,
        },
        include: {
          user: true,
        },
      });
    }),

  getUserPickupRequests: protectedProcedure.query(({ ctx }) => {
    return ctx.db.pickup.findMany({
      where: {
        user: {
          email: ctx.session.user.email,
        },
      },
    });
  }),

  getUser: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        email: ctx.session.user.email,
      },
      include: {
        city: {
          include: {
            openingHours: true,
          },
        },
      },
    });
  }),

  getActiveSupportRequest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.supportRequest.findMany({
      where: {
        user: {
          email: ctx.session.user.email,
        },
        status: "open",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: true,
          },
        },
      },
    });
  }),

  closeSupportRequest: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.supportRequest.update({
        where: {
          id: input.id,
        },
        data: {
          status: "closed",
        },
      });
    }),

  CreateSupportRequest: protectedProcedure
    .input(
      z.object({
        messages: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({
          where: {
            email: ctx.session.user.email,
          },
        })
        .then((user) => {
          if (!user) {
            throw new Error("User not found");
          }

          return ctx.db.supportRequest.create({
            data: {
              status: "open",
              user: {
                connect: {
                  id: user.id,
                },
              },
              city: {
                connect: {
                  id: user.cityId!,
                },
              },
              messages: {
                create: {
                  content: input.messages,
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
              },
            },
          });
        });
    }),

  AddMessageToSupportRequest: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.supportRequest
        .findFirst({
          where: {
            user: {
              email: ctx.session.user.email,
            },
            status: "open",
          },
          orderBy: {
            createdAt: "desc",
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

  getAdminCity: privilegedProcedure.query(({ ctx }) => {
    // dalla mail dell'utente ottieni tutti i dati collegati alla città
    return ctx.db.user
      .findUnique({
        where: {
          email: ctx.session.user.email,
        },
        include: {
          city: {
            include: {
              openingHours: true,
              statistics: true,
              SupportRequest: true,
              secondHandProduct: true,
              reports: true,
              pickups: true,
              calendars: {
                include: {
                  wasteTypes: {
                    include: {
                      wasteType: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then((user) => {
        return user?.city;
      });
  }),

  setUserInformation: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastname: z.string(),
        city: z.string(),
        address: z.string().nullable(),
        phoneNumber: z.string().nullable(),
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
          address: input.address ?? undefined,
          phone: input.phoneNumber ?? undefined,
        },
      });
    }),
});
