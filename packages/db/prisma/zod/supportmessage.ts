import * as z from "zod"
import { CompleteSupportRequest, relatedSupportRequestSchema, Completeuser, relateduserSchema } from "./index"

export const supportMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  supportRequestId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSupportMessage extends z.infer<typeof supportMessageSchema> {
  supportRequest: CompleteSupportRequest
  user: Completeuser
}

/**
 * relatedSupportMessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSupportMessageSchema: z.ZodSchema<CompleteSupportMessage> = z.lazy(() => supportMessageSchema.extend({
  supportRequest: relatedSupportRequestSchema,
  user: relateduserSchema,
}))
