import { z } from "zod";

export const travellerSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().int().min(0).max(120),
  type: z.enum(["ADULT", "CHILD", "INFANT"]),
});

export const createBookingSchema = z.object({
  tourPackageId: z.string(),
  pickupPointId: z.string(),
  adultsCount: z.number().int().min(0).max(20),
  childrenCount: z.number().int().min(0).max(20),
  infantsCount: z.number().int().min(0).max(20),
  travellers: z.array(travellerSchema).min(1).max(40),
  contactName: z.string().min(2).max(100),
  contactPhone: z.string().min(6).max(20),
  contactEmail: z.string().email(),
  specialRequest: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type TravellerInput = z.infer<typeof travellerSchema>;
