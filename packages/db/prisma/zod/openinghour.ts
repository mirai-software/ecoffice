import * as z from "zod"
import { Weekday } from "@prisma/client"
import { Completecity, relatedcitySchema } from "./index"

export const openingHourSchema = z.object({
  id: z.string(),
  day: z.nativeEnum(Weekday),
  openTime1: z.string(),
  closeTime1: z.string(),
  openTime2: z.string().nullish(),
  closeTime2: z.string().nullish(),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteOpeningHour extends z.infer<typeof openingHourSchema> {
  city: Completecity
}

/**
 * relatedOpeningHourSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOpeningHourSchema: z.ZodSchema<CompleteOpeningHour> = z.lazy(() => openingHourSchema.extend({
  city: relatedcitySchema,
}))
