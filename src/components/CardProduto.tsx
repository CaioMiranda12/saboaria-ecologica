import PublicImage from "@/components/PublicImage";
import type { Produto } from "../data/produtos";

// const corPorTipo: Record<Produto['tipo'], string> = {
//   barra: 'from-[#7aab7a] to-[#013e72]',
//   pasta: 'from-[#c4994a] to-[#8c6830]',
//   liquido: 'from-[#5a8a7a] to-[#2d5a4a]',
//   po: 'from-[#6b8a4a] to-[#3d5a2a]',
//   sabonete: "from-[#6b8a4a] to-[#3d5a2a]"
// }

type Props = {
  produto: Produto;
  onVerDetalhes?: () => void;
};

const CardProduto = ({ produto, onVerDetalhes }: Props) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-azul-principal/10 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-azul-principal hover:shadow-lg">
      {onVerDetalhes && (
        <button
          type="button"
          onClick={onVerDetalhes}
          aria-label={`Ver detalhes de ${produto.nomePrincipal}${produto.nomeComplemento ? ` ${produto.nomeComplemento}` : ""}`}
          aria-haspopup="dialog"
          className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-azul-principal"
        />
      )}
      <div
        className={`h-96 bg-linear-to-br ${produto.imagem ? "bg-white" : "from-[#025197] to-azul-escuro"} flex items-center justify-center`}
      >
        {produto.imagem ? (
          <PublicImage
            maxWidth={800}
            src={produto.imagem}
            alt={`${produto.nomePrincipal} ${produto.nomeComplemento}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-xs tracking-widest text-white/70 uppercase">
            {produto.nomePrincipal}
          </span>
        )}
      </div>
      <div className="p-5">
        {produto.tipos && produto.tipos.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {produto.tipos.map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#e8e9f0] px-2.5 py-1 text-[10px] font-medium tracking-wider text-verde-escuro uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className="mb-0.5 text-sm font-medium text-[#2d2f4f]">{produto.nomePrincipal}</h3>
        {produto.nomeComplemento && (
          <p className="mb-2 text-xs font-light text-verde-muted italic">
            {produto.nomeComplemento}
          </p>
        )}
        <p className="mb-4 text-xs leading-relaxed font-light text-verde-muted">
          {produto.descricao}
        </p>
        <div className="flex items-center justify-between">
          {/* <span className="font-serif text-lg font-bold text-[#013e72]">{formatarMoeda(produto.preco)}</span> */}
          <div className="flex items-center gap-2">
            {produto.peso && (
              <span className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-[#2e2d4f]">
                {produto.peso}
              </span>
            )}
            {onVerDetalhes && (
              <span
                aria-hidden="true"
                className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-azul-principal transition-colors group-focus-within:bg-azul-principal group-focus-within:text-white group-hover:bg-azul-principal group-hover:text-white"
              >
                Ver detalhes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduto;
