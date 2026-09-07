import Link from "next/link"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center text-center px-6">
      <span className="font-serif text-8xl font-bold text-verde-medio/20 mb-4">404</span>
      <h1 className="font-serif text-3xl text-verde-escuro mb-3">Página não encontrada</h1>
      <p className="text-sm text-verde-muted font-light max-w-sm leading-relaxed mb-8">
        A página que você tentou acessar não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="bg-verde-medio text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  )
}

export default NotFoundPage