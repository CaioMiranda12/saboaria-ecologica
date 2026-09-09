"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberFormSchema, type TeamMemberFormValues } from "@/schemas/team-member.schema";
import { FormField, formInputClass } from "@/components/ui/FormField";

type TeamMemberFormProps = {
  defaultValues?: Partial<TeamMemberFormValues>;
  onSubmit: (values: TeamMemberFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
};

const inputClass =
  "border border-verde-medio/20 rounded-xl px-4 py-2.5 text-sm text-verde-escuro focus:outline-none focus:border-verde-medio transition-colors w-full";

export function TeamMemberForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: TeamMemberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      role: defaultValues?.role ?? "",
      bio: defaultValues?.bio ?? "",
      initials: defaultValues?.initials ?? "",
      order: defaultValues?.order ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nome" error={errors.name?.message}>
          <input {...register("name")} className={formInputClass} />
        </FormField>
        <FormField label="Iniciais" error={errors.initials?.message}>
          <input {...register("initials")} maxLength={3} className={formInputClass} placeholder="LN" />
        </FormField>
      </div>

      <FormField label="Cargo" error={errors.role?.message}>
        <input {...register("role")} className={formInputClass} />
      </FormField>

      <FormField label="Bio" error={errors.bio?.message}>
        <textarea {...register("bio")} rows={4} className={formInputClass} />
      </FormField>

      <FormField label="Ordem de exibição" error={errors.order?.message}>
        <input type="number" {...register("order")} className={formInputClass} />
      </FormField>

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