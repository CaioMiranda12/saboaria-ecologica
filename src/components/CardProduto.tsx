import type { Produto } from "../data/produtos"

// const corPorTipo: Record<Produto['tipo'], string> = {
//   barra: 'from-[#7aab7a] to-[#013e72]',
//   pasta: 'from-[#c4994a] to-[#8c6830]',
//   liquido: 'from-[#5a8a7a] to-[#2d5a4a]',
//   po: 'from-[#6b8a4a] to-[#3d5a2a]',
//   sabonete: "from-[#6b8a4a] to-[#3d5a2a]"
// }

type Props = {
  produto: Produto
  onVerDetalhes?: () => void
}

const CardProduto = ({ produto, onVerDetalhes }: Props) => {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-azul-principal/10 hover:-translate-y-1 hover:shadow-lg hover:border-azul-principal transition-all duration-200 cursor-pointer"
      onClick={onVerDetalhes}
    >
      <div className={`h-96 bg-linear-to-br ${produto.imagem ? 'bg-white' : "from-[#025197] to-azul-escuro"} flex items-center justify-center`}>
        {produto.imagem ? (
          <img
            src={produto.imagem}
            alt={`${produto.nomePrincipal} ${produto.nomeComplemento}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-white/70 text-xs tracking-widest uppercase">{produto.nomePrincipal}</span>
        )}
      </div>
      <div className="p-5">
        {produto.tipos && produto.tipos.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {produto.tipos.map((t) => (
              <span key={t} className="text-[10px] font-medium uppercase tracking-wider bg-[#e8e9f0] text-verde-escuro px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-sm font-medium text-[#2d2f4f] mb-0.5">{produto.nomePrincipal}</h3>
        {produto.nomeComplemento && (
          <p className="text-xs italic text-verde-muted font-light mb-2">{produto.nomeComplemento}</p>
        )}
        <p className="text-xs text-verde-muted leading-relaxed font-light mb-4">{produto.descricao}</p>
        <div className="flex justify-between items-center">
          {/* <span className="font-serif text-lg font-bold text-[#013e72]">{formatarMoeda(produto.preco)}</span> */}
          <div className="flex items-center gap-2">
            {produto.peso && (
              <span className="text-xs font-medium bg-verde-claro text-[#2e2d4f] px-3 py-1 rounded-full">
                {produto.peso}
              </span>
            )}
            {onVerDetalhes && (
              <button
                onClick={onVerDetalhes}
                className="text-xs font-medium text-azul-principal bg-verde-claro px-3 py-1 rounded-full hover:bg-azul-principal hover:text-white transition-colors"
              >
                Ver detalhes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardProduto