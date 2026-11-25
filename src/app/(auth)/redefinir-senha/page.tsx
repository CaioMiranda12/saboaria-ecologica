"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const valid =
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    password === confirm;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!valid) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Não foi possível alterar a senha.");
      setDone(true);
      setPassword("");
      setConfirm("");
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao redefinir senha.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-5 my-10 w-full max-w-md rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-lime-50 p-8 shadow-xl shadow-emerald-950/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
        <LockKeyhole />
      </div>
      <h1 className="font-serif text-2xl text-emerald-950">Criar nova senha</h1>
      <p className="mt-2 text-sm text-emerald-900/70">
        Escolha uma senha forte. As sessões anteriores serão encerradas.
      </p>
      {message && (
        <p
          role="status"
          className={`mt-4 rounded-xl p-3 text-sm ${done ? "bg-emerald-100 text-emerald-900" : "bg-red-50 text-red-800"}`}
        >
          {message}
        </p>
      )}
      {!done &&
        (token ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm font-medium text-emerald-950"
              >
                Nova senha
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  required
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
                />
                <button
                  type="button"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShow(!show)}
                  className="absolute top-3 right-3 text-emerald-800"
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-sm font-medium text-emerald-950"
              >
                Confirmar senha
              </label>
              <input
                id="confirm-password"
                required
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
              />
            </div>
            <p className="text-xs text-emerald-900/70">
              Mínimo de 12 caracteres, com letras maiúsculas, minúsculas e números. As senhas devem
              coincidir.
            </p>
            <button
              disabled={!valid || busy}
              className="w-full rounded-full bg-emerald-800 py-3 text-sm font-semibold text-white hover:bg-emerald-950 disabled:opacity-50"
            >
              {busy ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-red-700">
            Link inválido. Solicite um novo link de recuperação.
          </p>
        ))}
      <Link
        href={done ? "/login" : "/esqueci-senha"}
        className="mt-6 inline-block text-sm font-medium text-emerald-800 hover:underline"
      >
        {done ? "Ir para o login" : "Solicitar novo link"}
      </Link>
    </main>
  );
}
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ResetForm />
    </Suspense>
  );
}
