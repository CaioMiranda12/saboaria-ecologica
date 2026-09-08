"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useDeleteTeamMember } from "@/hooks/useTeamMemberMutations";

export default function AdminTeamPage() {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const deleteTeamMember = useDeleteTeamMember();

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(`Remover "${name}" da equipe?`);
    if (!confirmed) return;

    deleteTeamMember.mutate(id, {
      onSuccess: () => toast.success("Membro removido"),
      onError: () => toast.error("Não foi possível remover o membro"),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl text-verde-escuro">Equipe</h1>
        <Link
          href="/admin/equipe/novo"
          className="flex items-center gap-2 bg-verde-principal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors"
        >
          <Plus size={16} />
          Novo membro
        </Link>
      </div>

      {isLoading && <p className="text-sm text-verde-muted font-light">Carregando...</p>}

      {teamMembers?.length === 0 && (
        <p className="text-sm text-verde-muted font-light">Nenhum membro cadastrado ainda.</p>
      )}

      {teamMembers && teamMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white border border-verde-medio/10 rounded-2xl p-5 flex gap-4">
              <div className="w-11 h-11 rounded-full bg-verde-principal flex items-center justify-center text-white text-sm font-bold shrink-0">
                {member.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-verde-escuro">{member.name}</p>
                <p className="text-xs text-verde-principal font-medium mb-2">{member.role}</p>
                <p className="text-xs text-verde-muted font-light leading-relaxed line-clamp-2">{member.bio}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Link
                  href={`/admin/equipe/${member.id}`}
                  className="p-2 rounded-lg text-verde-muted hover:text-verde-principal hover:bg-verde-claro transition-colors"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-2 rounded-lg text-verde-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}