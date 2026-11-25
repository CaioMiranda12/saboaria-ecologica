import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  code: z.string().max(64).optional(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
