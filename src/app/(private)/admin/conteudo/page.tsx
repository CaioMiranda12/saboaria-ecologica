"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { siteContentFormSchema, type SiteContentFormValues } from "@/schemas/site-content.schema";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useUpdateSiteContent } from "@/hooks/useSiteContentMutation";
import { FormField, formInputClass } from "@/components/ui/FormField";

const emptyValues: SiteContentFormValues = {
  mission: "",
  vision: "",
  values: "",
  description: "",
  foundedYear: "",
  whatsapp: "",
  instagram: "",
  email: "",
  linkedin: "",
  address: "",
};

export default function AdminSiteContentPage() {
  const { data: siteContent, isLoading } = useSiteContent();
  const updateSiteContent = useUpdateSiteContent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteContentFormValues>({
    resolver: zodResolver(siteContentFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (siteContent) {
      reset(siteContent);
    }
  }, [siteContent, reset]);

  const onSubmit = (values: SiteContentFormValues) => {
    updateSiteContent.mutate(values, {
      onSuccess: () => toast.success("Conteúdo atualizado"),
      onError: () => toast.error("Não foi possível salvar"),
    });
  };

  if (isLoading) {
    return <p className="text-sm text-verde-muted font-light">Carregando...</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Conteúdo do site</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-2xl">
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-verde-principal">
            Institucional
          </h2>

          <FormField label="Descrição da marca" error={errors.description?.message}>
            <textarea {...register("description")} rows={3} className={formInputClass} />
          </FormField>

          <FormField label="Missão" error={errors.mission?.message}>
            <textarea {...register("mission")} rows={2} className={formInputClass} />
          </FormField>

          <FormField label="Visão" error={errors.vision?.message}>
            <textarea {...register("vision")} rows={2} className={formInputClass} />
          </FormField>

          <FormField label="Valores" error={errors.values?.message}>
            <textarea {...register("values")} rows={2} className={formInputClass} />
          </FormField>

          <FormField label="Ano de fundação" error={errors.foundedYear?.message}>
            <input {...register("foundedYear")} className={formInputClass} placeholder="2023" />
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-verde-principal">
            Contato
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="WhatsApp" error={errors.whatsapp?.message}>
              <input {...register("whatsapp")} className={formInputClass} placeholder="5585987052241" />
            </FormField>
            <FormField label="Instagram" error={errors.instagram?.message}>
              <input {...register("instagram")} className={formInputClass} placeholder="saboariaecologica" />
            </FormField>
            <FormField label="E-mail" error={errors.email?.message}>
              <input {...register("email")} className={formInputClass} />
            </FormField>
            <FormField label="LinkedIn" error={errors.linkedin?.message}>
              <input {...register("linkedin")} className={formInputClass} />
            </FormField>
          </div>

          <FormField label="Endereço" error={errors.address?.message}>
            <input {...register("address")} className={formInputClass} />
          </FormField>
        </section>

        <button
          type="submit"
          disabled={updateSiteContent.isPending}
          className="self-start bg-verde-principal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors disabled:opacity-60"
        >
          {updateSiteContent.isPending ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}