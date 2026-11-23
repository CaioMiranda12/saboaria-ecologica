"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
type User={id:string;name:string;email:string;role:"ADMIN"|"EDITOR";createdAt:string};
const empty={name:"",email:"",role:"EDITOR" as "ADMIN"|"EDITOR",password:""};
export function UserManager(){
  const [users,setUsers]=useState<User[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [editing,setEditing]=useState<User|null>(null);
  const [form,setForm]=useState(empty);
  const [showForm,setShowForm]=useState(false);
  const [removing,setRemoving]=useState<User|null>(null);
  const [revoking,setRevoking]=useState<User|null>(null);
  const load=useCallback(async()=>{
    try{const response=await fetch("/api/admin/usuarios",{cache:"no-store"});
      if(!response.ok) throw new Error("Não foi possível carregar os usuários.");
      const data=await response.json();setUsers(data.users);
    }catch(e){setError(e instanceof Error?e.message:"Erro inesperado");}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{void load();},[load]);
  function startCreate(){setEditing(null);setForm(empty);setError("");setNotice("");setShowForm(true);}
  function startEdit(user:User){setEditing(user);setForm({name:user.name,email:user.email,role:user.role,password:""});setError("");setNotice("");setShowForm(true);}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError("");setNotice("");
    try{
      const response=await fetch(editing?`/api/admin/usuarios/${editing.id}`:"/api/admin/usuarios",{
        method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(editing?{name:form.name,role:form.role,password:form.password}:form),
      });
      const data=await response.json();if(!response.ok)throw new Error(data.message||"Erro ao salvar.");
      setShowForm(false);setNotice(editing?"Usuário atualizado.":"Usuário cadastrado.");await load();
    }catch(e){setError(e instanceof Error?e.message:"Erro inesperado");}
    finally{setBusy(false);}
  }
  async function remove(){if(!removing)return;setBusy(true);setError("");setNotice("");
    try{const response=await fetch(`/api/admin/usuarios/${removing.id}`,{method:"DELETE"});
      const data=await response.json();if(!response.ok)throw new Error(data.message||"Não foi possível excluir.");
      setRemoving(null);setNotice("Usuário excluído.");await load();
    }catch(e){setError(e instanceof Error?e.message:"Erro inesperado");setRemoving(null);}
    finally{setBusy(false);}
  }
  async function revokeSessions(){if(!revoking)return;setBusy(true);setError("");setNotice("");
    try {const response=await fetch(`/api/admin/usuarios/${revoking.id}/sessoes`,{method:"POST"});
      if(!response.ok)throw new Error("Não foi possível encerrar as sessões.");
      setNotice(`Sessões de ${revoking.name} revogadas.`);setRevoking(null);
    } catch(e){setError(e instanceof Error?e.message:"Erro inesperado");setRevoking(null);}finally{setBusy(false);}
  }
  return <div className="mx-auto max-w-6xl space-y-6">
    <header className="admin-page-heading flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 sm:p-8"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-verde-medio">Acesso e segurança</p><h1 className="font-serif text-3xl text-verde-escuro sm:text-4xl">Usuários administrativos</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-verde-muted">Gerencie quem pode acessar e administrar o site com segurança.</p></div><button type="button" onClick={startCreate} className="rounded-full bg-verde-principal px-5 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-principal">+ Adicionar usuário</button></header>
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-[#edf8e9] to-[#f8fbf4] p-4 text-sm leading-relaxed text-verde-escuro"><strong>Administrador:</strong> gerencia usuários, auditoria e exclusões. <strong>Editor:</strong> gerencia conteúdo e cadastros, mas não pode excluir produtos, equipe ou parcerias.</div>
    {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice&&<p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
    {showForm&&<section className="rounded-2xl border border-emerald-200/80 bg-white/95 p-5 shadow-sm"><h2 className="mb-4 text-xl font-semibold text-verde-escuro">{editing?"Editar usuário":"Novo usuário"}</h2><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Nome<input required minLength={2} maxLength={100} className="mt-1 w-full rounded-xl border border-emerald-200 bg-[#fbfdf9] p-3 outline-none transition focus:border-verde-medio focus:ring-2 focus:ring-emerald-100" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label className="text-sm font-medium">E-mail<input required type="email" disabled={!!editing} className="mt-1 w-full rounded-xl border border-emerald-200 bg-[#fbfdf9] p-3 outline-none transition focus:border-verde-medio focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label className="text-sm font-medium">Perfil<select className="mt-1 w-full rounded-xl border border-emerald-200 bg-[#fbfdf9] p-3 outline-none transition focus:border-verde-medio focus:ring-2 focus:ring-emerald-100" value={form.role} onChange={e=>setForm({...form,role:e.target.value as "ADMIN"|"EDITOR"})}><option value="EDITOR">Editor</option><option value="ADMIN">Administrador</option></select></label>
      <label className="text-sm font-medium">{editing?"Nova senha (opcional)":"Senha inicial"}<input type="password" autoComplete="new-password" minLength={12} required={!editing} className="mt-1 w-full rounded-xl border border-emerald-200 bg-[#fbfdf9] p-3 outline-none transition focus:border-verde-medio focus:ring-2 focus:ring-emerald-100" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><span className="mt-1 block text-xs font-normal text-gray-500">Mínimo de 12 caracteres. {editing?"Deixe vazio para manter a senha atual.":"Compartilhe a senha por um canal seguro."}</span></label>
      <div className="flex gap-3 sm:col-span-2"><button disabled={busy} type="submit" className="rounded-full bg-verde-principal px-5 py-2 text-white disabled:opacity-60">{busy?"Salvando...":"Salvar"}</button><button disabled={busy} type="button" onClick={()=>setShowForm(false)} className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-verde-escuro hover:bg-emerald-50">Cancelar</button></div>
    </form></section>}
    <section aria-label="Lista de usuários administrativos" className="overflow-hidden rounded-3xl border border-[#cce4ce] bg-[#f7fbf5] shadow-[0_12px_35px_-25px_rgba(35,90,45,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/70 bg-gradient-to-r from-[#e8f4e6] to-[#f7fbf5] px-5 py-4">
        <div><h2 className="font-semibold text-verde-escuro">Pessoas com acesso</h2><p className="text-xs text-verde-muted">Contas autorizadas a utilizar o painel</p></div>
        <span className="rounded-full border border-emerald-200 bg-white/85 px-3 py-1 text-xs font-semibold text-verde-escuro">{users.length} {users.length===1?"usuário":"usuários"}</span>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[550px] text-left text-sm"><thead className="bg-[#edf7ea] text-verde-escuro"><tr><th scope="col" className="px-5 py-4 font-semibold">Usuário</th><th scope="col" className="px-5 py-4 font-semibold">Perfil</th><th scope="col" className="px-5 py-4 font-semibold">Ações</th></tr></thead><tbody className="divide-y divide-[#dcebd9]">{users.map((user,index)=><tr className={`transition-colors hover:bg-[#e9f5e6] ${index%2===0?"bg-[#fbfdf9]":"bg-[#f2f9ef]"}`} key={user.id}><td className="px-5 py-4"><strong className="block font-semibold text-verde-escuro">{user.name}</strong><span className="break-all text-verde-muted">{user.email}</span></td><td className="px-5 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${user.role==="ADMIN"?"border-emerald-300 bg-emerald-100 text-emerald-900":"border-lime-200 bg-lime-50 text-lime-900"}`}>{user.role==="ADMIN"?"Administrador":"Editor"}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border border-emerald-200 bg-white px-3 py-2 font-semibold text-verde-principal transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-verde-principal" onClick={()=>startEdit(user)}>Editar</button><button type="button" className="rounded-lg border border-emerald-200 bg-white px-3 py-2 font-semibold text-verde-principal transition hover:bg-emerald-50" onClick={()=>setRevoking(user)}>Encerrar sessões</button><button type="button" className="rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-600" onClick={()=>setRemoving(user)}>Excluir</button></div></td></tr>)}</tbody></table></div>
      {loading?<p role="status" className="p-6 text-verde-muted">Carregando usuários...</p>:users.length===0?<p className="p-6 text-verde-muted">Nenhum usuário encontrado. Use “Adicionar usuário” para começar.</p>:null}
    </section>
    <ConfirmDialog isOpen={!!revoking} title="Encerrar sessões?" description={`Todos os acessos de ${revoking?.name||"este usuário"} serão invalidados. Será necessário entrar novamente.`} confirmLabel="Encerrar sessões" isConfirming={busy} onCancel={()=>setRevoking(null)} onConfirm={()=>void revokeSessions()}/>
    <ConfirmDialog isOpen={!!removing} title="Excluir usuário?" description={`A conta de ${removing?.name||"este usuário"} perderá acesso ao painel. Esta ação não pode ser desfeita.`} confirmLabel="Sim, excluir" isConfirming={busy} onCancel={()=>setRemoving(null)} onConfirm={()=>void remove()}/>
  </div>;
}
