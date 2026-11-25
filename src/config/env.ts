import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ADMIN_SEED_PASSWORD: z.string().min(8),
  ADMIN_SEED_EMAIL: z.email(),
});

export const env = envSchema.parse(process.env);
