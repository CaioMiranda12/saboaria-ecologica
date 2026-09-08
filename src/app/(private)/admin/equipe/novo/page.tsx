"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { useCreateTeamMember } from "@/hooks/useTeamMemberMutations";
import type { TeamMemberFormValues } from "@/schemas/team-member.schema";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const createTeamMember = useCreateTeamMember();

  const handleSubmit = (values: TeamMemberFormValues) => {
    createTeamMember.mutate(values, {
      onSuccess: () => {
        toast.success("Membro criado com sucesso");
        router.push("/admin/equipe");
      },
      onError: () => toast.error("Não foi possível criar o membro"),
    });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Novo membro</h1>
      <TeamMemberForm onSubmit={handleSubmit} isSubmitting={createTeamMember.isPending} submitLabel="Criar membro" />
    </div>
  );
}