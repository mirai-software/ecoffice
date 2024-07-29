import * as z from "zod"
import { Completeuser, relateduserSchema, Completecity, relatedcitySchema } from "./index"

export const pickupSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  address: z.string(),
  type: z.string(),
  otherSpecs: z.string().nullish(),
  status: z.string(),
  images: z.string().array(),
  userId: z.string(),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completepickup extends z.infer<typeof pickupSchema> {
  user: Completeuser
  city: Completecity
}

/**
 * relatedpickupSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedpickupSchema: z.ZodSchema<Completepickup> = z.lazy(() => pickupSchema.extend({
  user: relateduserSchema,
  city: relatedcitySchema,
}))
