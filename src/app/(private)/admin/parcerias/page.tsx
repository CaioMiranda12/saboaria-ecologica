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
  const createPartnership = useCreatePartnership();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: { name: "", order: 0 },
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
        className="flex items-end gap-3 mb-8 bg-white border border-verde-medio/10 rounded-2xl p-5 max-w-xl"
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
        <button
          type="submit"
          disabled={createPartnership.isPending}
          className="flex items-center gap-2 bg-verde-principal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-verde-escuro transition-colors disabled:opacity-60 h-fit"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </form>

      {isLoading && <p className="text-sm text-verde-muted font-light">Carregando...</p>}

      {partnerships?.length === 0 && (
        <p className="text-sm text-verde-muted font-light">Nenhuma parceria cadastrada ainda.</p>
      )}

      {partnerships && partnerships.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {partnerships.map((partnership) => (
            <PartnershipTag key={partnership.id} id={partnership.id} name={partnership.name} order={partnership.order} />
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
};

function PartnershipTag({ id, name, order }: PartnershipTagProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const updatePartnership = useUpdatePartnership();
  const deletePartnership = useDeletePartnership();

  const handleSave = () => {
    if (!editedName.trim()) {
      return;
    }

    updatePartnership.mutate(
      { id, values: { name: editedName.trim(), order } },
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
      <div className="flex items-center gap-1 bg-white border border-verde-principal rounded-full pl-3 pr-1.5 py-1.5">
        <input
          value={editedName}
          onChange={(event) => setEditedName(event.target.value)}
          className="text-xs font-medium text-verde-escuro focus:outline-none w-32"
          autoFocus
        />
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
    <div className="flex items-center gap-1 bg-verde-claro/50 border border-verde-medio/15 rounded-full pl-4 pr-1.5 py-1.5">
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