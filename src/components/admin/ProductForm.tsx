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
        <Field label="Nome principal" error={errors.mainName?.message}>
          <input {...register("mainName")} className={inputClass} />
        </Field>
        <Field label="Complemento" error={errors.complementName?.message}>
          <input {...register("complementName")} className={inputClass} />
        </Field>
      </div>

      <Field label="Descrição curta" error={errors.shortDescription?.message}>
        <textarea {...register("shortDescription")} rows={2} className={inputClass} />
      </Field>

      <Field label="Descrição completa" error={errors.fullDescription?.message}>
        <textarea {...register("fullDescription")} rows={4} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Peso" error={errors.weight?.message}>
          <input {...register("weight")} className={inputClass} placeholder="250g" />
        </Field>
        <Field label="Tipo" error={errors.type?.message}>
          <select {...register("type")} className={inputClass}>
            {productTypeValues.map((value) => (
              <option key={value} value={value}>
                {PRODUCT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Badge" error={errors.badge?.message}>
          <input {...register("badge")} className={inputClass} placeholder="Biodegradável" />
        </Field>
      </div>

      <Field label="Modo de uso" error={errors.usageInstructions?.message}>
        <textarea {...register("usageInstructions")} rows={2} className={inputClass} />
      </Field>

      <Field label="URL da imagem" error={errors.imageUrl?.message}>
        <input {...register("imageUrl")} className={inputClass} placeholder="/produto.jpg" />
      </Field>

      <Field label="Ingredientes (separados por vírgula)">
        <input {...register("ingredientsText")} className={inputClass} placeholder="Óleo vegetal, Hidróxido de sódio, Água" />
      </Field>

      <Field label="Variantes / fragrâncias (separadas por vírgula)">
        <input {...register("variantsText")} className={inputClass} placeholder="Tradicional, Leite de coco" />
      </Field>

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

const inputClass =
  "border border-verde-medio/20 rounded-xl px-4 py-2.5 text-sm text-verde-escuro focus:outline-none focus:border-verde-medio transition-colors w-full";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-verde-escuro">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
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