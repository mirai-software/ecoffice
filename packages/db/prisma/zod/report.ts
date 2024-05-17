import * as z from "zod"
import { Completeuser, relateduserSchema } from "./index"

export const reportSchema = z.object({
  id: z.string(),
  address: z.string(),
  type: z.string(),
  status: z.string(),
  images: z.string().array(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completereport extends z.infer<typeof reportSchema> {
  user: Completeuser
}

/**
 * relatedreportSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedreportSchema: z.ZodSchema<Completereport> = z.lazy(() => reportSchema.extend({
  user: relateduserSchema,
}))
