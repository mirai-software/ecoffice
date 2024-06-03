import * as z from "zod"
import { Completecalendar, relatedcalendarSchema, CompletewasteType, relatedwasteTypeSchema } from "./index"

export const calendarWasteTypeSchema = z.object({
  calendarId: z.string(),
  wasteTypeId: z.string(),
})

export interface CompleteCalendarWasteType extends z.infer<typeof calendarWasteTypeSchema> {
  calendar: Completecalendar
  wasteType: CompletewasteType
}

/**
 * relatedCalendarWasteTypeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCalendarWasteTypeSchema: z.ZodSchema<CompleteCalendarWasteType> = z.lazy(() => calendarWasteTypeSchema.extend({
  calendar: relatedcalendarSchema,
  wasteType: relatedwasteTypeSchema,
}))
