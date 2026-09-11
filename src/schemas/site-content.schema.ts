import { z } from "zod";

export const siteContentFormSchema = z.object({
  mission: z.string().min(10, "Missão muito curta"),
  vision: z.string().min(10, "Visão muito curta"),
  values: z.string().min(10, "Valores muito curtos"),
  description: z.string().min(10, "Descrição muito curta"),
  foundedYear: z.string().min(4, "Informe o ano de fundação"),
  whatsapp: z.string().min(8, "Informe um número válido"),
  instagram: z.string().min(1, "Informe o usuário do Instagram"),
  email: z.string().email("Informe um e-mail válido"),
  linkedin: z.string().min(1, "Informe o identificador do LinkedIn"),
  address: z.string().min(5, "Informe o endereço"),
});

export type SiteContentFormValues = z.infer<typeof siteContentFormSchema>;