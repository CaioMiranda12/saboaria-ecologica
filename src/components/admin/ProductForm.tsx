"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  productFormInputSchema,
  productTypeValues,
  type ProductFormValues,
  type ProductFormInput,
} from "@/schemas/product.schema";
import { PRODUCT_TYPE_LABELS } from "@/constants/product";
import { FormField, formInputClass } from "@/components/ui/FormField";

type ProductFormProps = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
};

function splitCommaList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function ProductForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormInputSchema),
    defaultValues: {
      mainName: defaultValues?.mainName ?? "",
      complementName: defaultValues?.complementName ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      fullDescription: defaultValues?.fullDescription ?? "",
      weight: defaultValues?.weight ?? "",
      type: defaultValues?.type ?? "BAR",
      usageInstructions: defaultValues?.usageInstructions ?? "",
      badge: defaultValues?.badge ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      hasFragranceOptions: defaultValues?.hasFragranceOptions ?? false,
      hasSizeOptions: defaultValues?.hasSizeOptions ?? false,
      ingredientsText: defaultValues?.ingredients?.join(", ") ?? "",
      variantsText: defaultValues?.variants?.join(", ") ?? "",
    },
  });

  const handleFormSubmit = (input: ProductFormInput) => {
    const { ingredientsText, variantsText, ...rest } = input;

    const finalValues: ProductFormValues = productFormSchema.parse({
      ...rest,
      ingredients: splitCommaList(ingredientsText),
      variants: splitCommaList(variantsText),
    });

    onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nome principal" error={errors.mainName?.message}>
          <input {...register("mainName")} className={formInputClass} />
        </FormField>
        <FormField label="Complemento" error={errors.complementName?.message}>
          <input {...register("complementName")} className={formInputClass} />
        </FormField>
      </div>

      <FormField label="Descrição curta" error={errors.shortDescription?.message}>
        <textarea {...register("shortDescription")} rows={2} className={formInputClass} />
      </FormField>

      <FormField label="Descrição completa" error={errors.fullDescription?.message}>
        <textarea {...register("fullDescription")} rows={4} className={formInputClass} />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Peso" error={errors.weight?.message}>
          <input {...register("weight")} className={formInputClass} placeholder="250g" />
        </FormField>
        <FormField label="Tipo" error={errors.type?.message}>
          <select {...register("type")} className={formInputClass}>
            {productTypeValues.map((value) => (
              <option key={value} value={value}>
                {PRODUCT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Badge" error={errors.badge?.message}>
          <input {...register("badge")} className={formInputClass} placeholder="Biodegradável" />
        </FormField>
      </div>

      <FormField label="Modo de uso" error={errors.usageInstructions?.message}>
        <textarea {...register("usageInstructions")} rows={2} className={formInputClass} />
      </FormField>

      <FormField label="URL da imagem" error={errors.imageUrl?.message}>
        <input {...register("imageUrl")} className={formInputClass} placeholder="/produto.jpg" />
      </FormField>

      <FormField label="Ingredientes (separados por vírgula)">
        <input {...register("ingredientsText")} className={formInputClass} placeholder="Óleo vegetal, Hidróxido de sódio, Água" />
      </FormField>

      <FormField label="Variantes / fragrâncias (separadas por vírgula)">
        <input {...register("variantsText")} className={formInputClass} placeholder="Tradicional, Leite de coco" />
      </FormField>

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Produto em destaque" {...register("isFeatured")} />
        <Checkbox label="Permite consultar fragrâncias" {...register("hasFragranceOptions")} />
        <Checkbox label="Permite consultar tamanhos" {...register("hasSizeOptions")} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start bg-verde-principal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-verde-escuro">
      <input type="checkbox" {...props} className="accent-verde-principal" />
      {label}
    </label>
  );
}