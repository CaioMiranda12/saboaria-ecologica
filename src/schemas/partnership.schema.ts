import { z } from "zod";

export const partnershipFormSchema = z.object({
  name: z.string().min(2, "Informe o nome da parceria"),
  order: z.coerce.number().int().default(0),
});

export type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;