import * as z from "zod"
import { Role } from "@prisma/client"
import { Completecity, relatedcitySchema, Completereport, relatedreportSchema, Completepickup, relatedpickupSchema, CompleteSupportRequest, relatedSupportRequestSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  role: z.nativeEnum(Role),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  cityId: z.string().nullish(),
  address: z.string().nullish(),
  SignInCompleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completeuser extends z.infer<typeof userSchema> {
  city?: Completecity | null
  reports: Completereport[]
  pickup: Completepickup[]
  SupportRequest: CompleteSupportRequest[]
}

/**
 * relateduserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateduserSchema: z.ZodSchema<Completeuser> = z.lazy(() => userSchema.extend({
  city: relatedcitySchema.nullish(),
  reports: relatedreportSchema.array(),
  pickup: relatedpickupSchema.array(),
  SupportRequest: relatedSupportRequestSchema.array(),
}))
