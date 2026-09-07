import { SignOutButton } from "@/components/SignOutButton";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-2">
        <h1 className="font-serif text-2xl text-verde-escuro">Painel administrativo</h1>
        <SignOutButton />
      </div>
      <p className="text-sm text-verde-muted font-light">
        Bem-vindo. O conteúdo de gerenciamento entra aqui nos próximos passos.
      </p>
    </div>
  );
}