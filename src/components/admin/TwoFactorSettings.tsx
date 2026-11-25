"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function TwoFactorSettings({
  emailEnabled,
  emailAvailable,
}: {
  emailEnabled: boolean;
  emailAvailable: boolean;
}) {
  const router = useRouter();
  const [sent, setSent] = useState(false),
    [password, setPassword] = useState(""),
    [code, setCode] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [message, setMessage] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const action = emailEnabled
        ? sent
          ? "emailDisable"
          : "emailDisableSetup"
        : sent
          ? "emailEnable"
          : "emailSetup";
      const r = await fetch("/api/admin/minha-conta/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password, code }),
      });
      const d = await r.json();
      if (!r.ok) {
        setMessage(d.message);
        return;
      }
      if (d.emailSent) {
        setSent(true);
        setMessage("Código enviado ao e-mail cadastrado.");
        return;
      }
      setDone(true);
      setPassword("");
      setCode("");
    } catch {
      setMessage("Falha de conexão. Confira o estado da conta antes de tentar novamente.");
    } finally {
      setBusy(false);
    }
  }
  const input =
    "w-full rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500";
  return (
    <section className="mx-auto mt-6 max-w-5xl space-y-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6">
      <h2 className="text-xl font-semibold text-emerald-950">
        Verificação em duas etapas por e-mail
      </h2>
      <p className="text-sm text-emerald-800">
        {done
          ? "Configuração alterada."
          : emailEnabled
            ? "Ativada — seu login exige um código enviado ao e-mail cadastrado."
            : "Desativada — proteja sua conta com um código por e-mail."}
      </p>
      {done ? (
        <button
          className="rounded-xl bg-emerald-800 px-4 py-3 text-white"
          onClick={() => router.replace("/login")}
        >
          Entrar novamente
        </button>
      ) : !emailAvailable ? (
        <p role="status">
          Envio de e-mail indisponível. Solicite a configuração do serviço ao responsável pelo
          sistema.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            Senha atual
            <input
              className={input}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {sent && (
            <>
              <label className="block space-y-2">
                Código recebido por e-mail
                <input
                  className={input}
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
              <button
                type="button"
                disabled={busy}
                className="text-sm text-emerald-800 underline"
                onClick={() => {
                  setSent(false);
                  setCode("");
                }}
              >
                Solicitar novo código
              </button>
            </>
          )}
          {message && <p role="status">{message}</p>}
          <button
            disabled={busy}
            className="rounded-xl bg-emerald-800 px-4 py-3 text-white disabled:opacity-50"
          >
            {busy
              ? "Aguarde..."
              : sent
                ? emailEnabled
                  ? "Confirmar desativação"
                  : "Confirmar ativação"
                : emailEnabled
                  ? "Enviar código para desativar"
                  : "Enviar código para ativar"}
          </button>
        </form>
      )}
    </section>
  );
}
