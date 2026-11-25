import { z } from "zod";
export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email())
    .transform((v) => v.toLowerCase()),
  password: z.string().min(12).max(128),
  role: z.enum(["ADMIN", "EDITOR"]),
});
export const userUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.enum(["ADMIN", "EDITOR"]),
  password: z.union([z.literal(""), z.string().min(12).max(128)]).optional(),
});
