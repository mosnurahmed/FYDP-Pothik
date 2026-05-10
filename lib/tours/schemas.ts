import { z } from "zod";

/**
 * Single source of truth for tour-related validation.
 * Used by: forms, API routes, server actions, DB writes.
 */

export const tourRegionSchema = z.enum([
  "COASTAL",
  "HILL_TRACTS",
  "HISTORIC",
  "RIVERINE",
  "URBAN",
  "FOREST",
  "TEA_COUNTRY",
]);

export const tourSpotInputSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional().or(z.literal("")),
  dayNumber: z.number().int().min(1).max(30),
  orderIndex: z.number().int().min(0),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM format")
    .optional()
    .or(z.literal("")),
  stayMinutes: z.number().int().min(15).max(720),
  entryFeeIncluded: z.boolean().default(true),
});

export const pickupPointInputSchema = z.object({
  name: z.string().min(2).max(80),
  city: z.string().min(2).max(50),
  address: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),
  pickupTime: z.coerce.date(),
  returnTime: z.coerce.date(),
  orderIndex: z.number().int().min(0).default(0),
});

// Base shape — kept as a plain ZodObject so .partial() and .extend() still work.
// Cross-field rules live in the refined schemas below.
const tourBaseShape = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(20).max(5000),
  highlights: z.array(z.string().min(2).max(100)).max(10).default([]),
  coverImage: z.string().url(),
  gallery: z.array(z.string().url()).max(8).default([]),
  region: tourRegionSchema,
  destinationCity: z.string().min(2).max(50),
  durationDays: z.number().int().min(1).max(30),
  departureDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  adultPrice: z.number().int().min(0).max(1_000_000),
  childPrice: z.number().int().min(0).max(1_000_000),
  capacity: z.number().int().min(1).max(500),
  minTravellers: z.number().int().min(1).max(500).default(10),
  spots: z.array(tourSpotInputSchema).min(1).max(50),
  pickupPoints: z.array(pickupPointInputSchema).min(1).max(20),
});

export const createTourSchema = tourBaseShape
  .refine((d) => d.returnDate >= d.departureDate, {
    message: "Return date must be on or after departure date",
    path: ["returnDate"],
  })
  .refine((d) => d.minTravellers <= d.capacity, {
    message: "Minimum travellers cannot exceed capacity",
    path: ["minTravellers"],
  });

export const updateTourSchema = tourBaseShape.partial().extend({
  id: z.string(),
});

export const tourFiltersSchema = z.object({
  region: tourRegionSchema.optional(),
  durationType: z.enum(["DAY_TRIP", "MULTI_DAY"]).optional(),
  destinationCity: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourFilters = z.infer<typeof tourFiltersSchema>;
export type TourSpotInput = z.infer<typeof tourSpotInputSchema>;
export type PickupPointInput = z.infer<typeof pickupPointInputSchema>;
