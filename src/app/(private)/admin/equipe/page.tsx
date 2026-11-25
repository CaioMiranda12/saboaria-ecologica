"use client";
import PublicImage from "@/components/PublicImage";

import { useCanDeleteRecords } from "@/components/admin/AdminPermissions";

import Link from "next/link";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useDeleteTeamMember } from "@/hooks/useTeamMemberMutations";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminTeamPage() {
  const canDelete = useCanDeleteRecords();
  const { data: teamMembers, isLoading } = useTeamMembers();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("order");
  const visibleMembers = (teamMembers ?? [])
    .filter((member) =>
      `${member.name} ${member.role}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : a.order - b.order));
  const deleteTeamMember = useDeleteTeamMember();
  const confirmDialog = useConfirmDialog<{ id: string; name: string }>();

  const handleConfirmDelete = () => {
    if (!canDelete) return;
    if (!confirmDialog.target) return;

    deleteTeamMember.mutate(confirmDialog.target.id, {
      onSuccess: () => {
        toast.success("Membro removido");
        confirmDialog.close();
      },
      onError: () => toast.error("Não foi possível remover o membro"),
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-verde-escuro">Equipe</h1>
        <Link
          href="/admin/equipe/novo"
          className="flex items-center gap-2 rounded-full bg-verde-principal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          <Plus size={16} />
          Novo membro
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          aria-label="Buscar integrante"
          placeholder="Buscar por nome ou cargo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-control min-w-48 flex-1 px-4 py-2.5 text-sm"
        />
        <select
          aria-label="Ordenar integrantes"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="admin-control bg-white px-3 py-2.5 text-sm"
        >
          <option value="order">Ordem de exibição</option>
          <option value="name">Nome (A-Z)</option>
        </select>
      </div>
      {teamMembers && (
        <p className="mb-3 text-xs text-verde-muted" aria-live="polite">
          {visibleMembers.length} de {teamMembers.length} integrantes
        </p>
      )}
      {isLoading && (
        <p className="text-sm font-light text-verde-muted" role="status">
          Carregando equipe...
        </p>
      )}

      {teamMembers?.length === 0 && (
        <div className="admin-empty" role="status">
          Ainda não há integrantes. Use “Novo membro” para começar.
        </div>
      )}

      {teamMembers && teamMembers.length > 0 && visibleMembers.length === 0 && (
        <div className="admin-empty" role="status">
          Nenhum integrante corresponde à busca.
        </div>
      )}
      {teamMembers && teamMembers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleMembers.map((member) => (
            <div key={member.id} className="admin-record-card flex gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-principal text-sm font-bold text-white">
                {member.imageUrl ? (
                  <PublicImage
                    src={member.imageUrl}
                    maxWidth={96}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  member.initials
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-verde-escuro">{member.name}</p>
                <p className="mb-2 text-xs font-medium text-verde-principal">{member.role}</p>
                <p className="line-clamp-2 text-xs leading-relaxed font-light text-verde-muted">
                  {member.bio}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Link
                  href={`/admin/equipe/${member.id}`}
                  className="rounded-lg p-2 text-verde-muted transition-colors hover:bg-verde-claro hover:text-verde-principal"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </Link>
                {canDelete && (
                  <button
                    onClick={() => confirmDialog.open({ id: member.id, name: member.name })}
                    className="rounded-lg p-2 text-verde-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={canDelete && confirmDialog.isOpen}
        title="Remover membro da equipe"
        description={`Tem certeza que deseja remover "${confirmDialog.target?.name}"? Essa ação não pode ser desfeita.`}
        isConfirming={deleteTeamMember.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={confirmDialog.close}
      />
    </div>
  );
}
