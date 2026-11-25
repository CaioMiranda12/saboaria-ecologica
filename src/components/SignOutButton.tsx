import { type ReactNode } from "react";
import { signOutAction } from "@/app/(private)/_actions/sign-out.action";

type SignOutButtonProps = { className?: string; icon?: ReactNode; collapsed?: boolean };

export function SignOutButton({ className, icon, collapsed = false }: SignOutButtonProps) {
  return (
    <form action={signOutAction} className="w-full">
      <button
        type="submit"
        title="Sair da conta"
        aria-label="Sair da conta"
        className={
          className ??
          "text-xs font-medium text-verde-muted transition-colors hover:text-verde-escuro"
        }
      >
        {icon}
        {collapsed ? <span className="sr-only">Sair da conta</span> : <span>Sair da conta</span>}
      </button>
    </form>
  );
}
