import { contatosDaMarca } from '@/data/marca'

const canaisDeContato = [
  {
    nome: 'WhatsApp',
    valor: '(85) 98705-2241',
    href: `https://wa.me/${contatosDaMarca.whatsapp}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#4a7c59">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.571a.75.75 0 0 0 .921.921l5.699-1.487A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.204-1.431l-.374-.22-3.384.883.897-3.274-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    nome: 'Instagram',
    valor: '@saboariaecologica',
    href: `https://instagram.com/${contatosDaMarca.instagram}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="#4a7c59" />
      </svg>
    ),
  },
  {
    nome: 'E-mail',
    valor: contatosDaMarca.email,
    href: `mailto:${contatosDaMarca.email}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    nome: 'Linkedin',
    valor: 'Saboaria Ecológica',
    href: `https://linkedin.com/in/${contatosDaMarca.linkedin}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

const horarioDeAtendimento = [
  { dia: 'Segunda a Quinta', hora: '09h às 17h' },
  { dia: 'Sexta', hora: '09h às 18h' },
  { dia: 'Sábado e Domingo', hora: 'Fechado' },
]

const Contato = () => {
  return (
    <div className="bg-creme text-[#1a2e1f]">

      {/* Hero */}
      <section className="bg-verde-principal pt-24 md:pt-28 pb-16 md:pb-20 px-5 md:px-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 md:w-96 h-72 md:h-96 rounded-full bg-white/4" />
        <div className="flex justify-between items-center">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-5 w-fit">
              Fale com a gente
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-4">
              Entre em <em className="text-white/50">contato</em>
            </h1>
            <p className="text-white/65 font-light leading-relaxed text-sm md:text-base">
              Tire suas dúvidas, faça seu pedido ou saiba como contribuir com a nossa causa. Estamos prontos para te atender pelos canais abaixo.
            </p>
          </div>
          <img
            src="/logo.png"
            alt="Saboaria Ecológica"
            className="max-w-100 w-1/2 h-full object-contain"
          />
          <div />
        </div>
      </section>

      {/* Canais rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border-b border-verde-medio/10">
        {canaisDeContato.map((canal, i) => (
          <a
            key={canal.nome}
            href={canal.href}
            target="_blank"
            rel="noreferrer"
            className={`flex flex-col items-center text-center px-4 py-6 md:py-8 hover:bg-verde-claro transition-colors no-underline
              ${i % 2 === 0 ? 'border-r border-verde-medio/10' : ''}
              ${i < 2 ? 'border-b md:border-b-0 border-verde-medio/10' : ''}
              md:border-r md:last:border-r-0 md:border-b-0`}
          >
            <div className="w-12 h-12 rounded-full bg-verde-claro flex items-center justify-center mb-3">
              {canal.icone}
            </div>
            <p className="text-xs font-medium text-verde-principal mb-1">{canal.nome}</p>
            <p className="text-xs text-verde-muted font-light">{canal.valor}</p>
          </a>
        ))}
      </div>

      {/* Logo + Info lateral */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-verde-medio/10">
        <div className="flex justify-center items-center">
          <img
            src="/logo-2.png"
            alt="Logo da Saboaria Ecológica"
          />
        </div>

        {/* Info lateral */}
        <div className="bg-verde-principal px-5 md:px-14 py-14 md:py-20 flex flex-col gap-6">
          <div>
            <h3 className="font-serif text-2xl text-white mb-2">Canais de atendimento</h3>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-5">
              Prefere um contato direto? Escolha o canal mais conveniente para você.
            </p>
            <div className="flex flex-col gap-3">
              {canaisDeContato.map((canal) => (
                <a
                  key={canal.nome}
                  href={canal.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.14] transition-colors no-underline"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <div className="[&_svg]:stroke-white/80">{canal.icone}</div>
                  </div>
                  <div>
                    <p className="text-xs text-white/55 font-light mb-0.5">{canal.nome}</p>
                    <p className="text-sm text-white font-medium">{canal.valor}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <a
            href="https://maps.google.com/?q=Av.+Ulisses+Guimarães,+3132,+Iparana"
            target="_blank"
            rel="noreferrer"
            className="block bg-white/6 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors no-underline"
          >
            <div className="h-32 flex flex-col items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm text-white/80 font-medium text-center leading-snug">
                Av. Ulisses Guimarães, 3132<br />
                <span className="text-white/55 text-xs font-light">Iparana · Caucaia, CE</span>
              </p>
              <p className="text-xs text-white/40 font-light">Clique para abrir no mapa</p>
            </div>
          </a>

          {/* Horário */}
          <div className="bg-white/6 rounded-2xl px-5 py-4">
            <p className="text-xs text-white/55 font-light uppercase tracking-widest mb-3">
              Horário de atendimento
            </p>
            <div className="flex flex-col divide-y divide-white/6">
              {horarioDeAtendimento.map((item) => (
                <div key={item.dia} className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-white/70 font-light">{item.dia}</span>
                  <span className="text-sm text-white font-medium">{item.hora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Contato