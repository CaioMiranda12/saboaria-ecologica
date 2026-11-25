import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-creme px-6 text-center">
      <span className="mb-4 font-serif text-8xl font-bold text-verde-medio/20">404</span>
      <h1 className="mb-3 font-serif text-3xl text-verde-escuro">Página não encontrada</h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed font-light text-verde-muted">
        A página que você tentou acessar não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="rounded-full bg-verde-medio px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
      >
        Voltar para o início
      </Link>
    </div>
  );
};

export default NotFoundPage;
