import type { EtapaDoProcesso } from "../data/processo";

type Props = { etapa: EtapaDoProcesso; ultima: boolean };

const EtapaTimeline = ({ etapa, ultima }: Props) => {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-0 md:grid-cols-[80px_1fr]">
      {/* Coluna esquerda: número + linha */}
      <div className="flex flex-col items-center">
        <div className="relative flex w-full flex-col items-center pb-6 md:pb-10">
          <div className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-principal font-serif text-lg font-bold text-white md:h-14 md:w-14 md:text-xl">
            {etapa.numero}
          </div>
          {!ultima && (
            <div className="absolute top-11 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-verde-medio/20 md:top-14" />
          )}
        </div>
      </div>

      {/* Coluna direita: card */}
      <div className="pb-6 pl-4 md:pb-10 md:pl-6">
        <div className="rounded-2xl border border-verde-medio/10 bg-white p-5 transition-colors hover:border-verde-medio md:p-7">
          <h3 className="mb-2 text-sm font-medium text-verde-escuro md:text-base">
            {etapa.titulo}
          </h3>
          <p className="mb-4 text-xs leading-relaxed font-light text-verde-muted md:text-sm">
            {etapa.texto}
          </p>
          <div className="flex flex-wrap gap-2">
            {etapa.pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaTimeline;
