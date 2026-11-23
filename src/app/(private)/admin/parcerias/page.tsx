"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { partnershipFormSchema, type PartnershipFormValues } from "@/schemas/partnership.schema";
import { usePartnerships } from "@/hooks/usePartnerships";
import {
  useCreatePartnership,
  useUpdatePartnership,
  useDeletePartnership,
} from "@/hooks/usePartnershipMutations";
import { FormField, formInputClass } from "@/components/ui/FormField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminPartnershipsPage() {
  const { data: partnerships, isLoading } = usePartnerships();
  const [search, setSearch] = useState("");
  const visiblePartnerships = (partnerships ?? []).filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).sort((a,b) => a.order - b.order);
  const createPartnership = useCreatePartnership();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: { name: "", order: 0, logoUrl: "" },
  });

  const handleCreate = (values: PartnershipFormValues) => {
    createPartnership.mutate(values, {
      onSuccess: () => {
        toast.success("Parceria adicionada");
        reset();
      },
      onError: () => toast.error("Não foi possível adicionar a parceria"),
    });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Parcerias</h1>

      <form
        onSubmit={handleSubmit(handleCreate)}
        className="flex flex-wrap items-end gap-3 mb-8 admin-panel p-5 max-w-xl"
      >
        <div className="flex-1">
          <FormField label="Nome da parceria" error={errors.name?.message}>
            <input {...register("name")} className={formInputClass} placeholder="Instituto Aço Cearense" />
          </FormField>
        </div>
        <div className="w-24">
          <FormField label="Ordem" error={errors.order?.message}>
            <input type="number" {...register("order")} className={formInputClass} />
          </FormField>
        </div>
        <div className="w-full">
          <FormField label="URL do logotipo (opcional)" error={errors.logoUrl?.message}>
            <input {...register("logoUrl")} className={formInputClass} placeholder="https://..." />
          </FormField>
        </div>
        <button
          type="submit"
          disabled={createPartnership.isPending}
          className="flex items-center gap-2 bg-verde-principal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-verde-escuro transition-colors disabled:opacity-60 h-fit"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </form>

      <input aria-label="Buscar parceria" placeholder="Buscar parceria pelo nome" value={search} onChange={(e) => setSearch(e.target.value)} className="admin-control px-4 py-2.5 text-sm mb-4 w-full max-w-sm" />
      {partnerships && <p className="text-xs text-verde-muted mb-3">{visiblePartnerships.length} de {partnerships.length} parcerias</p>}
      {isLoading && <p className="text-sm text-verde-muted font-light" role="status">Carregando parcerias...</p>}

      {partnerships?.length === 0 && (
        <div className="admin-empty" role="status">Nenhuma parceria cadastrada. Preencha o formulário acima para adicionar.</div>
      )}

      {partnerships && partnerships.length > 0 && visiblePartnerships.length === 0 && <div className="admin-empty" role="status">Nenhuma parceria corresponde à busca.</div>}
      {partnerships && partnerships.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {visiblePartnerships.map((partnership) => (
            <PartnershipTag key={partnership.id} id={partnership.id} name={partnership.name} order={partnership.order} logoUrl={partnership.logoUrl} />
          ))}
        </div>
      )}
    </div>
  );
}

type PartnershipTagProps = {
  id: string;
  name: string;
  order: number;
  logoUrl?: string | null;
};

function PartnershipTag({ id, name, order, logoUrl }: PartnershipTagProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedLogo, setEditedLogo] = useState(logoUrl ?? "");
  const [editedOrder, setEditedOrder] = useState(order);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const updatePartnership = useUpdatePartnership();
  const deletePartnership = useDeletePartnership();

  const handleSave = () => {
    if (!editedName.trim()) {
      return;
    }

    updatePartnership.mutate(
      { id, values: { name: editedName.trim(), order: editedOrder, logoUrl: editedLogo } },
      {
        onSuccess: () => {
          toast.success("Parceria atualizada");
          setIsEditing(false);
        },
        onError: () => toast.error("Não foi possível atualizar"),
      }
    );
  };

  const handleConfirmDelete = () => {
    deletePartnership.mutate(id, {
      onSuccess: () => {
        toast.success("Parceria removida");
        setIsConfirmOpen(false);
      },
      onError: () => toast.error("Não foi possível remover"),
    });
  };

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-2 bg-white border border-verde-principal rounded-xl p-3">
        <input
          value={editedName}
          onChange={(event) => setEditedName(event.target.value)}
          className="text-xs font-medium text-verde-escuro focus:outline-none w-32"
          autoFocus
        />
        <input aria-label="URL do logotipo" placeholder="URL do logotipo" value={editedLogo} onChange={(e) => setEditedLogo(e.target.value)} className="text-xs border rounded-lg p-2 w-48" />
        <input aria-label="Ordem de exibição" type="number" value={editedOrder} onChange={(e) => setEditedOrder(Number(e.target.value))} className="text-xs border rounded-lg p-2 w-16" />
        <button
          onClick={handleSave}
          disabled={updatePartnership.isPending}
          className="p-1 rounded-full text-verde-principal hover:bg-verde-claro transition-colors"
          aria-label="Salvar"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => {
            setEditedName(name);
            setEditedLogo(logoUrl ?? "");
            setEditedOrder(order);
            setIsEditing(false);
          }}
          className="p-1 rounded-full text-verde-muted hover:bg-verde-claro transition-colors"
          aria-label="Cancelar"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-[#edf7e8] to-white border border-[#cfe4c9] rounded-full pl-4 pr-1.5 py-1.5">
      {logoUrl && <img src={logoUrl} alt={`Logo de ${name}`} className="w-8 h-8 object-contain rounded" />}
      <span className="text-xs font-medium text-verde-escuro">{name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 rounded-full text-verde-muted hover:text-verde-principal hover:bg-white transition-colors"
        aria-label="Editar"
      >
        <Pencil size={12} />
      </button>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="p-1.5 rounded-full text-verde-muted hover:text-red-600 hover:bg-white transition-colors"
        aria-label="Remover"
      >
        <Trash2 size={12} />
      </button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Remover parceria"
        description={`Tem certeza que deseja remover "${name}"?`}
        isConfirming={deletePartnership.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}