import { signOutAction } from "@/app/(private)/_actions/sign-out.action";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-xs font-medium text-verde-muted hover:text-verde-escuro transition-colors"
      >
        Sair
      </button>
    </form>
  );
}