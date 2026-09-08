import { z } from "zod";

export const productTypeValues = ["BAR", "PASTE", "LIQUID", "POWDER", "SOAP"] as const;

export const productFormSchema = z.object({
  mainName: z.string().min(2, "Informe o nome do produto"),
  complementName: z.string().optional(),
  shortDescription: z.string().min(10, "Descrição curta muito curta"),
  fullDescription: z.string().min(10, "Descrição completa muito curta"),
  weight: z.string().optional(),
  type: z.enum(productTypeValues),
  ingredients: z.array(z.string().min(1)).default([]),
  variants: z.array(z.string().min(1)).default([]),
  usageInstructions: z.string().optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().default(false),
  hasFragranceOptions: z.boolean().default(false),
  hasSizeOptions: z.boolean().default(false),
  imageUrl: z.string().url("Informe uma URL válida").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Versão usada só pelo formulário: ingredientes/variantes chegam como texto
// separado por vírgula, mais simples de editar do que uma lista dinâmica de campos.
export const productFormInputSchema = productFormSchema
  .omit({ ingredients: true, variants: true })
  .extend({
    ingredientsText: z.string().optional().default(""),
    variantsText: z.string().optional().default(""),
  });

export type ProductFormInput = z.infer<typeof productFormInputSchema>;