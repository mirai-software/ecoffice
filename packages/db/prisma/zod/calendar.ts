import * as z from "zod"
import { Weekday } from "@prisma/client"
import { Completecity, relatedcitySchema, CompleteCalendarWasteType, relatedCalendarWasteTypeSchema } from "./index"

export const calendarSchema = z.object({
  id: z.string(),
  day: z.nativeEnum(Weekday),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completecalendar extends z.infer<typeof calendarSchema> {
  city: Completecity
  wasteTypes: CompleteCalendarWasteType[]
}

/**
 * relatedcalendarSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedcalendarSchema: z.ZodSchema<Completecalendar> = z.lazy(() => calendarSchema.extend({
  city: relatedcitySchema,
  wasteTypes: relatedCalendarWasteTypeSchema.array(),
}))
