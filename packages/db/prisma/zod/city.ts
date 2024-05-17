import * as z from "zod"
import { Completecalendar, relatedcalendarSchema, CompletesecondHandProduct, relatedsecondHandProductSchema, Completeuser, relateduserSchema } from "./index"

export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completecity extends z.infer<typeof citySchema> {
  calendars: Completecalendar[]
  secondHandProduct: CompletesecondHandProduct[]
  user: Completeuser[]
}

/**
 * relatedcitySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedcitySchema: z.ZodSchema<Completecity> = z.lazy(() => citySchema.extend({
  calendars: relatedcalendarSchema.array(),
  secondHandProduct: relatedsecondHandProductSchema.array(),
  user: relateduserSchema.array(),
}))
