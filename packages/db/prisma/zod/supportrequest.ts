import * as z from "zod"
import { Completeuser, relateduserSchema, Completecity, relatedcitySchema, CompleteSupportMessage, relatedSupportMessageSchema } from "./index"

export const supportRequestSchema = z.object({
  id: z.string(),
  status: z.string(),
  userId: z.string(),
  cityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSupportRequest extends z.infer<typeof supportRequestSchema> {
  user: Completeuser
  city: Completecity
  messages: CompleteSupportMessage[]
}

/**
 * relatedSupportRequestSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSupportRequestSchema: z.ZodSchema<CompleteSupportRequest> = z.lazy(() => supportRequestSchema.extend({
  user: relateduserSchema,
  city: relatedcitySchema,
  messages: relatedSupportMessageSchema.array(),
}))
