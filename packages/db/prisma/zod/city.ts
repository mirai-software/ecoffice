import * as z from "zod"
import { Completecalendar, relatedcalendarSchema, CompletesecondHandProduct, relatedsecondHandProductSchema, Completeuser, relateduserSchema, CompleteSupportRequest, relatedSupportRequestSchema, CompleteStatistic, relatedStatisticSchema, CompleteOpeningHour, relatedOpeningHourSchema, Completereport, relatedreportSchema, Completepickup, relatedpickupSchema } from "./index"

export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  whatsappNumber: z.string().nullish(),
  email: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completecity extends z.infer<typeof citySchema> {
  calendars: Completecalendar[]
  secondHandProduct: CompletesecondHandProduct[]
  user: Completeuser[]
  SupportRequest: CompleteSupportRequest[]
  statistics: CompleteStatistic[]
  openingHours: CompleteOpeningHour[]
  reports: Completereport[]
  pickups: Completepickup[]
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
  SupportRequest: relatedSupportRequestSchema.array(),
  statistics: relatedStatisticSchema.array(),
  openingHours: relatedOpeningHourSchema.array(),
  reports: relatedreportSchema.array(),
  pickups: relatedpickupSchema.array(),
}))
