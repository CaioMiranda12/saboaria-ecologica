import { z } from "zod";
import { STATES, validCoordinates } from "@/lib/location-map";

export const locationSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    city: z.string().trim().min(1).max(100),
    state: z.enum(STATES),
    address: z.string().trim().min(1).max(300),
    description: z.string().trim().max(2000),
    latitude: z.number(),
    longitude: z.number(),
    isPublished: z.boolean(),
  })
  .refine((value) => validCoordinates(value.latitude, value.longitude), {
    message: "Selecione coordenadas dentro da área do Brasil.",
    path: ["latitude"],
  });
