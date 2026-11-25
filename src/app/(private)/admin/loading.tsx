export default function Loading() {
  return (
    <div role="status" aria-label="Carregando painel" className="space-y-5">
      <div className="h-40 animate-pulse rounded-3xl bg-emerald-100" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-emerald-50" />
        ))}
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
