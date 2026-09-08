import { signOutAction } from "@/app/(private)/_actions/sign-out.action";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={className ?? "text-xs font-medium text-verde-muted hover:text-verde-escuro transition-colors"}
      >
        Sair
      </button>
    </form>
  );
}