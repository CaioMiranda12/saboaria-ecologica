import type { EtapaDoProcesso } from "../data/processo";

type Props = { etapa: EtapaDoProcesso; ultima: boolean }

const EtapaTimeline = ({ etapa, ultima }: Props) => {
  return (
    <div className="grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr] gap-0">
      {/* Coluna esquerda: número + linha */}
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col items-center pb-6 md:pb-10 w-full">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-verde-principal text-white font-serif text-lg md:text-xl font-bold flex items-center justify-center z-10 flex-shrink-0">
            {etapa.numero}
          </div>
          {!ultima && (
            <div className="absolute top-11 md:top-14 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-verde-medio/20" />
          )}
        </div>
      </div>

      {/* Coluna direita: card */}
      <div className="pb-6 md:pb-10 pl-4 md:pl-6">
        <div className="bg-white rounded-2xl border border-verde-medio/10 p-5 md:p-7 hover:border-verde-medio transition-colors">
          <h3 className="text-sm md:text-base font-medium text-verde-escuro mb-2">{etapa.titulo}</h3>
          <p className="text-xs md:text-sm text-verde-muted leading-relaxed font-light mb-4">{etapa.texto}</p>
          <div className="flex flex-wrap gap-2">
            {etapa.pills.map((pill) => (
              <span
                key={pill}
                className="bg-verde-claro text-verde-escuro text-xs font-medium px-3 py-1 rounded-full"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EtapaTimeline