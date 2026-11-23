type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export const formInputClass =
  "admin-control rounded-xl px-4 py-3 text-sm text-verde-escuro transition-colors w-full";

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-verde-escuro">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}