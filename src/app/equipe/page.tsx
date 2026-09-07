import { equipe } from "@/data/marca";

export default function Equipe() {
  return (
    <section className="px-5 md:px-20 py-14 md:py-20 bg-[#f7f3ec] relative">
      <img
        src='/logo-2.png'
        alt="Saboaria Ecológica"
        className="absolute top-16 right-6 w-24 md:w-32 object-contain z-40"
      />

      <div className="max-w-5xl mx-auto pt-32 md:pt-0">
        <h2 className="font-serif text-3xl md:text-5xl text-[#2d4f38] mb-4">
          Nossa <em className="text-[#396824]">equipe</em>
        </h2>
        <p className="text-[#5a6b5e] font-light leading-relaxed max-w-xl mb-12">
          Pessoas comprometidas com o impacto social e ambiental que move a Saboaria Ecológica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipe.map((membro) => (
            <div
              key={membro.nome}
              className="bg-white border border-[#4a7c59]/10 rounded-2xl p-6 flex gap-4 items-start"
            >
              <div className="w-12 h-12 rounded-full bg-[#396824] flex items-center justify-center font-serif font-bold text-white text-sm shrink-0">
                {membro.iniciais}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2d4f38]">{membro.nome}</p>
                <p className="text-xs text-[#396824] font-medium mb-2">{membro.cargo}</p>
                <p className="text-xs text-[#5a6b5e] font-light leading-relaxed">{membro.bio}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}