import { z } from "zod";

export const productTypeValues = ["BAR", "PASTE", "LIQUID", "POWDER", "SOAP"] as const;

/** Aceita vazio, caminho local (/foto.jpg), URL http(s) e data URL de imagens já salvas. */
function isValidImageUrl(value: string) {
  if (value === "" || value.startsWith("/")) return true;

  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" || protocol === "data:";
  } catch {
    return false;
  }
}

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
  imageUrl: z.string().refine(isValidImageUrl, "Informe uma URL válida").optional(),
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