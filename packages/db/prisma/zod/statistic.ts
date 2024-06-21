import * as z from "zod"
import { StatisticType } from "@prisma/client"
import { Completecity, relatedcitySchema } from "./index"

export const statisticSchema = z.object({
  id: z.string(),
  name: z.string(),
  data: z.string(),
  type: z.nativeEnum(StatisticType),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteStatistic extends z.infer<typeof statisticSchema> {
  city: Completecity
}

/**
 * relatedStatisticSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedStatisticSchema: z.ZodSchema<CompleteStatistic> = z.lazy(() => statisticSchema.extend({
  city: relatedcitySchema,
}))
