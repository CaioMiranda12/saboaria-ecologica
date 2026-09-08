type AdminTopbarProps = {
  adminEmail: string;
};

export function AdminTopbar({ adminEmail }: AdminTopbarProps) {
  return (
    <header className="h-16 shrink-0 bg-white border-b border-verde-medio/10 px-6 flex items-center justify-between">
      <p className="text-sm text-verde-muted font-light">
        Bem-vindo, <span className="font-medium text-verde-escuro">{adminEmail}</span>
      </p>
    </header>
  );
}