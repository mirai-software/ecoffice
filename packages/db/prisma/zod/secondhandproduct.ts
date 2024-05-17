import * as z from "zod"
import { Completecity, relatedcitySchema } from "./index"

export const secondHandProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.string().array(),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletesecondHandProduct extends z.infer<typeof secondHandProductSchema> {
  city: Completecity
}

/**
 * relatedsecondHandProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedsecondHandProductSchema: z.ZodSchema<CompletesecondHandProduct> = z.lazy(() => secondHandProductSchema.extend({
  city: relatedcitySchema,
}))
