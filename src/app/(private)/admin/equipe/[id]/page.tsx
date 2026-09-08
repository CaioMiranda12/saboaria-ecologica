"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { useTeamMember } from "@/hooks/useTeamMember";
import { useUpdateTeamMember } from "@/hooks/useTeamMemberMutations";
import type { TeamMemberFormValues } from "@/schemas/team-member.schema";

type EditTeamMemberPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: teamMember, isLoading } = useTeamMember(id);
  const updateTeamMember = useUpdateTeamMember(id);

  const handleSubmit = (values: TeamMemberFormValues) => {
    updateTeamMember.mutate(values, {
      onSuccess: () => {
        toast.success("Membro atualizado");
        router.push("/admin/equipe");
      },
      onError: () => toast.error("Não foi possível atualizar o membro"),
    });
  };

  if (isLoading) {
    return <p className="text-sm text-verde-muted font-light">Carregando...</p>;
  }

  if (!teamMember) {
    return <p className="text-sm text-verde-muted font-light">Membro não encontrado.</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Editar membro</h1>
      <TeamMemberForm
        defaultValues={teamMember}
        onSubmit={handleSubmit}
        isSubmitting={updateTeamMember.isPending}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}