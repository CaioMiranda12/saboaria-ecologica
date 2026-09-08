"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberFormSchema, type TeamMemberFormValues } from "@/schemas/team-member.schema";

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
        <Field label="Nome" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </Field>
        <Field label="Iniciais" error={errors.initials?.message}>
          <input {...register("initials")} maxLength={3} className={inputClass} placeholder="LN" />
        </Field>
      </div>

      <Field label="Cargo" error={errors.role?.message}>
        <input {...register("role")} className={inputClass} />
      </Field>

      <Field label="Bio" error={errors.bio?.message}>
        <textarea {...register("bio")} rows={4} className={inputClass} />
      </Field>

      <Field label="Ordem de exibição" error={errors.order?.message}>
        <input type="number" {...register("order")} className={inputClass} />
      </Field>

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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-verde-escuro">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}