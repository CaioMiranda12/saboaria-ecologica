import { z } from "zod";

// Estrutura genérica e limitada; editores específicos terão validações por seção.
const jsonValue = z.unknown();
export const cmsSectionSchema = z
  .object({
    key: z.string().regex(/^[a-z][a-z0-9_-]{0,63}$/),
    title: z.string().trim().min(1).max(120),
    position: z.number().int().min(0).max(1000),
    enabled: z.boolean(),
    content: z
      .record(z.string(), jsonValue)
      .refine((v) => JSON.stringify(v).length <= 50000, "Conteúdo muito extenso"),
  })
  .strict();

export const cmsPageUpdateSchema = z
  .object({
    sections: z
      .array(cmsSectionSchema)
      .max(40)
      .refine(
        (sections) => new Set(sections.map((section) => section.key)).size === sections.length,
        "As chaves das seções devem ser únicas",
      ),
  })
  .strict();
