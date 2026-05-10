import { z } from "zod";

export const busInputSchema = z.object({
  busNumber: z.string().min(2).max(20),
  operatorName: z.string().min(2).max(80).default("Pothik Fleet"),
  type: z.enum(["AC", "NON_AC", "SLEEPER", "DOUBLE_DECKER", "MINIBUS"]),
  totalSeats: z.number().int().min(1).max(80),
  amenities: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(4.5),
  notes: z.string().max(300).optional(),
});

export const busAssignmentInputSchema = z.object({
  tourPackageId: z.string(),
  busId: z.string(),
  pickupPointIds: z.array(z.string()).min(1),
  notes: z.string().max(300).optional(),
});

export type BusInput = z.infer<typeof busInputSchema>;
export type BusAssignmentInput = z.infer<typeof busAssignmentInputSchema>;
