"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, X, Handshake, Search, Image as ImageIcon, ArrowUpDown } from "lucide-react";
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
  const [showCreate, setShowCreate] = useState(false);
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
        setShowCreate(false);
      },
      onError: () => toast.error("Não foi possível adicionar a parceria"),
    });
  };

  return (
    <div>
      <header className="admin-page-heading mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6"><div className="flex items-center gap-3"><span className="rounded-2xl bg-emerald-100 p-3 text-emerald-800"><Handshake size={25}/></span><div><h1 className="font-serif text-3xl text-verde-escuro">Parcerias</h1><p className="mt-1 text-sm text-verde-muted">Organize as instituições parceiras e seus logotipos.</p></div></div><button type="button" onClick={()=>setShowCreate(v=>!v)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-900"><Plus size={17}/>{showCreate?"Fechar cadastro":"Adicionar parceria"}</button></header>
      <div className="mb-5 grid gap-3 sm:grid-cols-2"><div className="admin-panel p-4"><p className="text-xs font-medium text-emerald-800">Parcerias cadastradas</p><p className="mt-1 text-3xl font-bold text-emerald-950">{partnerships?.length ?? "—"}</p></div><div className="admin-panel p-4"><p className="text-xs font-medium text-emerald-800">Com logotipo</p><p className="mt-1 text-3xl font-bold text-emerald-950">{partnerships?.filter(p=>Boolean(p.logoUrl)).length ?? "—"}</p></div></div>
      {showCreate && <form onSubmit={handleSubmit(handleCreate)} className="admin-panel mb-6 space-y-4 p-5 sm:p-6" aria-label="Cadastrar parceria"><div><h2 className="font-semibold text-emerald-950">Nova parceria</h2><p className="text-sm text-verde-muted">Preencha o nome e, se disponível, o endereço do logotipo. A ordem define a posição no site.</p></div><div className="grid gap-4 sm:grid-cols-[1fr_110px]"><FormField label="Nome da instituição" error={errors.name?.message}><input {...register("name")} className={formInputClass} placeholder="Ex.: Instituto parceiro" /></FormField><FormField label="Ordem" error={errors.order?.message}><input type="number" {...register("order")} className={formInputClass}/></FormField></div><FormField label="Endereço do logotipo (opcional)" error={errors.logoUrl?.message}><input {...register("logoUrl")} className={formInputClass} placeholder="https://..." /></FormField><div className="flex justify-end gap-2"><button type="button" onClick={()=>setShowCreate(false)} className="rounded-xl border border-emerald-200 px-4 py-2 text-sm text-emerald-900">Cancelar</button><button type="submit" disabled={createPartnership.isPending} className="rounded-xl bg-emerald-800 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{createPartnership.isPending?"Salvando...":"Cadastrar parceria"}</button></div></form>}
      <div className="admin-panel mb-5 flex flex-wrap items-center justify-between gap-3 p-4"><label className="relative w-full max-w-md"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700"/><input aria-label="Buscar parceria" placeholder="Buscar pelo nome da instituição" value={search} onChange={e=>setSearch(e.target.value)} className="admin-control w-full py-3 pl-10 pr-4 text-sm" /></label><span className="flex items-center gap-1 text-xs text-emerald-800"><ArrowUpDown size={15}/> Ordenadas pela posição</span></div>
      {partnerships && <p className="text-xs text-verde-muted mb-3">{visiblePartnerships.length} de {partnerships.length} parcerias</p>}
      {isLoading && <p className="text-sm text-verde-muted font-light" role="status">Carregando parcerias...</p>}

      {partnerships?.length === 0 && (
        <div className="admin-empty" role="status">Nenhuma parceria cadastrada. Clique em “Adicionar parceria” para começar.</div>
      )}

      {partnerships && partnerships.length > 0 && visiblePartnerships.length === 0 && <div className="admin-empty" role="status">Nenhuma parceria corresponde à busca.</div>}
      {partnerships && partnerships.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

  return <article className="admin-record-card flex flex-col gap-3 p-4 sm:p-5">
    <div className="flex items-start gap-3"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-white">{logoUrl?<img src={logoUrl} alt={`Logotipo de ${name}`} className="h-full w-full object-contain p-2"/>:<ImageIcon size={24} className="text-emerald-300"/>}</div><div className="min-w-0 flex-1"><h3 className="break-words font-semibold text-emerald-950">{name}</h3><p className="mt-1 text-xs text-emerald-700">Posição no site: {order}</p><p className="mt-1 text-xs text-emerald-700">{logoUrl?"Logotipo cadastrado":"Sem logotipo"}</p></div></div>
    {isEditing?<div className="space-y-3 border-t border-emerald-100 pt-3"><label className="block text-xs font-semibold text-emerald-900">Nome<input value={editedName} onChange={e=>setEditedName(e.target.value)} className="admin-control mt-1 w-full p-2.5 text-sm" autoFocus/></label><label className="block text-xs font-semibold text-emerald-900">URL do logotipo<input value={editedLogo} onChange={e=>setEditedLogo(e.target.value)} className="admin-control mt-1 w-full p-2.5 text-sm" placeholder="https://..."/></label><label className="block text-xs font-semibold text-emerald-900">Posição<input type="number" value={editedOrder} onChange={e=>setEditedOrder(Number(e.target.value))} className="admin-control mt-1 w-full p-2.5 text-sm"/></label><div className="flex gap-2"><button type="button" onClick={handleSave} disabled={updatePartnership.isPending||!editedName.trim()} className="flex items-center gap-1 rounded-xl bg-emerald-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Check size={15}/> Salvar</button><button type="button" onClick={()=>{setEditedName(name);setEditedLogo(logoUrl??"");setEditedOrder(order);setIsEditing(false)}} className="flex items-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 text-xs text-emerald-900"><X size={15}/> Cancelar</button></div></div>:<div className="mt-auto flex gap-2 border-t border-emerald-100 pt-3"><button type="button" onClick={()=>setIsEditing(true)} className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50"><Pencil size={14}/> Editar</button><button type="button" onClick={()=>setIsConfirmOpen(true)} className="flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs text-rose-800 hover:bg-rose-50"><Trash2 size={14}/> Excluir</button></div>}
    <ConfirmDialog isOpen={isConfirmOpen} title="Remover parceria" description={`Tem certeza que deseja remover "${name}"?`} isConfirming={deletePartnership.isPending} onConfirm={handleConfirmDelete} onCancel={()=>setIsConfirmOpen(false)}/>
  </article>;
}
