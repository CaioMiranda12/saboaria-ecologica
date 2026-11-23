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
  return <div className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-3xl text-verde-escuro">Usuários administrativos</h1><p className="mt-1 text-sm text-verde-muted">Gerencie quem pode acessar e administrar o site.</p></div><button type="button" onClick={startCreate} className="rounded-full bg-verde-principal px-5 py-3 text-sm font-semibold text-white hover:opacity-90">Adicionar usuário</button></header>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Administrador:</strong> gerencia usuários, auditoria e exclusões. <strong>Editor:</strong> gerencia conteúdo e cadastros, mas não pode excluir produtos, equipe ou parcerias.</div>
    {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice&&<p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
    {showForm&&<section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 text-xl font-semibold text-verde-escuro">{editing?"Editar usuário":"Novo usuário"}</h2><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Nome<input required minLength={2} maxLength={100} className="mt-1 w-full rounded-xl border p-3" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label className="text-sm font-medium">E-mail<input required type="email" disabled={!!editing} className="mt-1 w-full rounded-xl border p-3 disabled:bg-gray-100" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label className="text-sm font-medium">Perfil<select className="mt-1 w-full rounded-xl border p-3" value={form.role} onChange={e=>setForm({...form,role:e.target.value as "ADMIN"|"EDITOR"})}><option value="EDITOR">Editor</option><option value="ADMIN">Administrador</option></select></label>
      <label className="text-sm font-medium">{editing?"Nova senha (opcional)":"Senha inicial"}<input type="password" autoComplete="new-password" minLength={12} required={!editing} className="mt-1 w-full rounded-xl border p-3" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><span className="mt-1 block text-xs font-normal text-gray-500">Mínimo de 12 caracteres. {editing?"Deixe vazio para manter a senha atual.":"Compartilhe a senha por um canal seguro."}</span></label>
      <div className="flex gap-3 sm:col-span-2"><button disabled={busy} type="submit" className="rounded-full bg-verde-principal px-5 py-2 text-white disabled:opacity-60">{busy?"Salvando...":"Salvar"}</button><button disabled={busy} type="button" onClick={()=>setShowForm(false)} className="rounded-full border px-5 py-2">Cancelar</button></div>
    </form></section>}
    <section className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[550px] text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Usuário</th><th className="p-4">Perfil</th><th className="p-4">Ações</th></tr></thead><tbody>{users.map(user=><tr className="border-t" key={user.id}><td className="p-4"><strong className="block">{user.name}</strong><span className="text-gray-500">{user.email}</span></td><td className="p-4">{user.role==="ADMIN"?"Administrador":"Editor"}</td><td className="p-4"><div className="flex gap-3"><button type="button" className="font-medium text-verde-principal underline" onClick={()=>startEdit(user)}>Editar</button><button type="button" className="font-medium text-red-700 underline" onClick={()=>setRemoving(user)}>Excluir</button></div></td></tr>)}</tbody></table>{loading?<p className="p-6 text-gray-500">Carregando usuários...</p>:users.length===0?<p className="p-6 text-gray-500">Nenhum usuário encontrado.</p>:null}</section>
    <ConfirmDialog isOpen={!!removing} title="Excluir usuário?" description={`A conta de ${removing?.name||"este usuário"} perderá acesso ao painel. Esta ação não pode ser desfeita.`} confirmLabel="Sim, excluir" isConfirming={busy} onCancel={()=>setRemoving(null)} onConfirm={()=>void remove()}/>
  </div>;
}
