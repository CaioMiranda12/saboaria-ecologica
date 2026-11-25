"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Não foi possível processar a solicitação.");
      setDone(true);
    } catch {
      setError("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-5 my-10 w-full max-w-md rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/80 to-lime-50 p-8 shadow-xl shadow-emerald-950/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
        <Mail />
      </div>
      <h1 className="font-serif text-2xl text-emerald-950">Recuperar acesso</h1>
      <p className="mt-2 text-sm text-emerald-900/70">
        Informe o e-mail cadastrado para receber um link de recuperação válido por 30 minutos.
      </p>
      {done ? (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-100/70 p-4 text-sm text-emerald-950"
        >
          <ShieldCheck className="mb-2" />
          Se o e-mail estiver cadastrado, você receberá as instruções para recuperar o acesso.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-emerald-950" htmlFor="recovery-email">
            E-mail administrativo
          </label>
          <input
            id="recovery-email"
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            className="w-full rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-950 disabled:opacity-60"
          >
            {busy ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>
      )}
      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-800 hover:underline"
      >
        <ArrowLeft size={16} /> Voltar ao login
      </Link>
    </main>
  );
}
