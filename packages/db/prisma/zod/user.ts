import * as z from "zod"
import { Completecity, relatedcitySchema, Completereport, relatedreportSchema, Completepickup, relatedpickupSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  cityId: z.string(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completeuser extends z.infer<typeof userSchema> {
  city: Completecity
  reports: Completereport[]
  pickup: Completepickup[]
}

/**
 * relateduserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateduserSchema: z.ZodSchema<Completeuser> = z.lazy(() => userSchema.extend({
  city: relatedcitySchema,
  reports: relatedreportSchema.array(),
  pickup: relatedpickupSchema.array(),
}))
