import { z } from "zod";

export const teamMemberFormSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  role: z.string().min(2, "Informe o cargo"),
  bio: z.string().min(10, "Bio muito curta"),
  initials: z
    .string()
    .min(1, "Informe as iniciais")
    .max(3, "Máximo 3 caracteres")
    .transform((value) => value.toUpperCase()),
  order: z.coerce.number().int().default(0),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;