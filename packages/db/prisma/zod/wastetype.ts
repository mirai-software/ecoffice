import * as z from "zod"
import { Completecalendar, relatedcalendarSchema } from "./index"

export const wasteTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  calendarId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletewasteType extends z.infer<typeof wasteTypeSchema> {
  calendar?: Completecalendar | null
}

/**
 * relatedwasteTypeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedwasteTypeSchema: z.ZodSchema<CompletewasteType> = z.lazy(() => wasteTypeSchema.extend({
  calendar: relatedcalendarSchema.nullish(),
}))
