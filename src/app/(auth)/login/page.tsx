"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { httpClient } from "@/lib/http";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await httpClient.post("/auth/login", values);
      router.push("/admin");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? "Não foi possível entrar"
        : "Não foi possível entrar";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-verde-medio/10 p-8 shadow-sm">
      <div className="mb-8 text-center">
        <p className="font-serif text-lg font-bold text-verde-principal tracking-wide">
          SABOARIA <em className="font-normal not-italic text-verde-medio">ecológica</em>
        </p>
        <h1 className="font-serif text-2xl text-verde-escuro mt-4 mb-1">Painel administrativo</h1>
        <p className="text-xs text-verde-muted font-light">Acesso restrito a administradores</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-verde-escuro">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="border border-verde-medio/20 rounded-xl px-4 py-2.5 text-sm text-verde-escuro placeholder:text-verde-muted/60 focus:outline-none focus:border-verde-medio transition-colors"
            placeholder="admin@saboariaecologica.com"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-verde-escuro">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="border border-verde-medio/20 rounded-xl px-4 py-2.5 text-sm text-verde-escuro focus:outline-none focus:border-verde-medio transition-colors"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-verde-principal text-white rounded-full py-3 text-sm font-medium hover:bg-verde-escuro transition-colors mt-2 disabled:opacity-60"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}