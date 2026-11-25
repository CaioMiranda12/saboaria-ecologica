"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  CalendarDays,
  Mail,
  BadgeCheck,
} from "lucide-react";

type Props = {
  initialName: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  createdAt: string;
  updatedAt: string;
};
const inputClass =
  "w-full rounded-xl border border-emerald-200 bg-[#f8fcf7] px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60";
function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    dateStyle: "long",
  }).format(new Date(value));
}

export function AccountSettings({ initialName, email, role, createdAt, updatedAt }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState<"profile" | "password" | null>(null);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMessage("");
    setSaving("profile");
    try {
      const response = await fetch("/api/admin/minha-conta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", name }),
      });
      const result = await response.json();
      setProfileMessage(
        response.ok
          ? "Nome atualizado com sucesso."
          : (result.message ?? "Não foi possível salvar."),
      );
      if (response.ok) {
        setSavedName(result.name);
        router.refresh();
      }
    } catch {
      setProfileMessage("Falha de conexão. Tente novamente.");
    } finally {
      setSaving(null);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 12) {
      setPasswordMessage("Use pelo menos 12 caracteres na nova senha.");
      return;
    }
    setSaving("password");
    try {
      const response = await fetch("/api/admin/minha-conta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setPasswordMessage(result.message ?? "Não foi possível atualizar a senha.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch {
      setPasswordMessage("Falha de conexão. Tente novamente.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-[#174b35] via-[#286c48] to-[#6a9560] p-7 text-white shadow-lg sm:p-9">
        <div className="flex items-center gap-2 text-sm text-emerald-100">
          <CircleUserRound size={18} /> Configurações pessoais
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold">Minha conta</h1>
        <p className="mt-2 max-w-xl text-sm text-emerald-50">
          Atualize seu nome, proteja sua senha e consulte as informações do seu acesso
          administrativo.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white to-[#f1f9ed] p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                <CircleUserRound size={22} />
              </span>
              <div>
                <h2 className="font-semibold text-emerald-950">Dados do perfil</h2>
                <p className="text-xs text-emerald-800/70">
                  O nome pode ser alterado a qualquer momento.
                </p>
              </div>
            </div>
            <form onSubmit={submitProfile} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-emerald-950">Nome de exibição</span>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                  autoComplete="name"
                />
              </label>
              <label className="block space-y-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                  <Mail size={16} /> E-mail cadastrado
                </span>
                <input className={inputClass} value={email} disabled readOnly />
                <span className="block text-xs text-emerald-800/70">
                  Para alterar seu e-mail, solicite a um administrador.
                </span>
              </label>
              {profileMessage && (
                <p role="status" className="rounded-xl bg-emerald-100 p-3 text-sm text-emerald-900">
                  {profileMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={saving !== null || name.trim().length < 2 || name.trim() === savedName}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />
                {saving === "profile" ? "Salvando..." : "Salvar nome"}
              </button>
            </form>
          </section>
          <section className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white to-[#f1f9ed] p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                <LockKeyhole size={22} />
              </span>
              <div>
                <h2 className="font-semibold text-emerald-950">Alterar minha senha</h2>
                <p className="text-xs text-emerald-800/70">
                  Sua senha atual é necessária para confirmar a alteração.
                </p>
              </div>
            </div>
            {passwordSaved ? (
              <div
                role="status"
                className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <p className="font-semibold text-emerald-950">Senha alterada com sucesso.</p>
                <p className="text-sm text-emerald-800">
                  Por segurança, todas as sessões anteriores foram invalidadas. Entre novamente com
                  a nova senha.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    router.replace("/login");
                  }}
                  className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  Ir para o login
                </button>
              </div>
            ) : (
              <form onSubmit={submitPassword} className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-emerald-950">Senha atual</span>
                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-emerald-950">Nova senha</span>
                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                  <span className="block text-xs text-emerald-800/70">
                    Use no mínimo 12 caracteres.
                  </span>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-emerald-950">
                    Confirme a nova senha
                  </span>
                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
                  {showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                </button>
                {passwordMessage && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                  >
                    {passwordMessage}
                  </p>
                )}
                <div>
                  <button
                    type="submit"
                    disabled={saving !== null}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                  >
                    <KeyRound size={17} />
                    {saving === "password" ? "Alterando..." : "Alterar senha"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-[#e8f5e5] to-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-emerald-900">
              <ShieldCheck size={20} />
              <h2 className="font-semibold">Informações de acesso</h2>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-emerald-800/70">Nível de acesso</dt>
                <dd className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">
                  <BadgeCheck size={15} />
                  {role === "ADMIN" ? "Administrador" : "Editor"}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-emerald-800/70">
                  <CalendarDays size={15} /> Conta criada em
                </dt>
                <dd className="mt-1 font-medium text-emerald-950">{formatDate(createdAt)}</dd>
              </div>
              <div>
                <dt className="text-emerald-800/70">Última atualização do cadastro</dt>
                <dd className="mt-1 font-medium text-emerald-950">{formatDate(updatedAt)}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-2xl border border-emerald-200/70 bg-white p-5 text-sm text-emerald-800">
            <h2 className="font-semibold text-emerald-950">Dica de segurança</h2>
            <p className="mt-2 leading-relaxed">
              Não compartilhe sua senha. Se suspeitar de acesso indevido, altere-a para invalidar as
              sessões anteriores.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
