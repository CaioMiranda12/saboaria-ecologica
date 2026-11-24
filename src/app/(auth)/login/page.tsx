"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { httpClient } from "@/lib/http";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [secondFactor, setSecondFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await httpClient.post("/auth/login", values);
      if(response.data.requires2FA){setSecondFactor(true);return;}
      router.push("/admin");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? "Não foi possível entrar"
        : "Não foi possível entrar";
      toast.error(message);
    }
  };

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-emerald-950 lg:block" aria-label="Saboaria Ecológica">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-emerald-900/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-16 text-white">
          <Link href="/" className="w-fit rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold tracking-widest backdrop-blur-sm hover:bg-white/20">SABOARIA ECOLÓGICA</Link>
          <div className="max-w-xl">
            <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md">CUIDADO COM AS PESSOAS E COM O PLANETA</span>
            <h2 className="font-serif text-4xl leading-tight xl:text-6xl">Um cuidado que transforma.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/85">Um espaço para cuidar dos conteúdos e das histórias da Saboaria Ecológica.</p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7fbf4] via-[#edf7eb] to-[#e0efdf] px-5 py-12 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 lg:hidden"><Link href="/" className="font-serif text-lg font-bold text-emerald-900">SABOARIA <span className="font-normal text-emerald-700">ecológica</span></Link></div>
          <div className="rounded-[2rem] border border-emerald-200/70 bg-white/80 p-7 shadow-[0_24px_70px_-35px_rgba(18,78,45,.35)] backdrop-blur-xl sm:p-10">
            <div className="mb-8">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">ÁREA RESTRITA</span>
              <h1 className="mt-4 font-serif text-3xl text-emerald-950">Bem-vindo de volta</h1>
              <p className="mt-2 text-sm leading-relaxed text-emerald-900/65">Entre com suas credenciais para acessar o painel administrativo.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-emerald-950">E-mail administrativo</label>
                <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "login-email-error" : undefined} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5 text-sm text-emerald-950 placeholder:text-emerald-900/40 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="seuemail@exemplo.com" />
                {errors.email && <p id="login-email-error" role="alert" className="text-xs text-red-700">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3"><label htmlFor="password" className="text-sm font-semibold text-emerald-950">Senha</label><Link href="/esqueci-senha" className="text-xs font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:underline">Esqueceu sua senha?</Link></div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} aria-describedby={errors.password ? "login-password-error" : undefined} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5 pr-12 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Digite sua senha" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} className="absolute inset-y-0 right-2 flex w-10 items-center justify-center rounded-xl text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600">{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button>
                </div>
                {errors.password && <p id="login-password-error" role="alert" className="text-xs text-red-700">{errors.password.message}</p>}
              </div>
              {secondFactor && <label className="block space-y-2 text-sm font-semibold text-emerald-950">Código do autenticador ou de recuperação<input autoFocus autoComplete="one-time-code" required {...register("code")} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3" /></label>}
              <button type="submit" disabled={isSubmitting} className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:from-emerald-900 hover:to-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Entrando..." : "Entrar no painel"}</button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-emerald-900/60">Acesso exclusivo à equipe autorizada da Saboaria Ecológica.</p>
        </div>
      </section>
    </main>
  );
}
