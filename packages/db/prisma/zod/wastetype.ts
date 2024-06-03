import * as z from "zod"
import { CompleteCalendarWasteType, relatedCalendarWasteTypeSchema } from "./index"

export const wasteTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  info: z.string().array(),
  icon: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletewasteType extends z.infer<typeof wasteTypeSchema> {
  calendars: CompleteCalendarWasteType[]
}

/**
 * relatedwasteTypeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedwasteTypeSchema: z.ZodSchema<CompletewasteType> = z.lazy(() => wasteTypeSchema.extend({
  calendars: relatedCalendarWasteTypeSchema.array(),
}))
