import Link from 'next/link'
import { historiaDaMarca, contatosDaMarca } from '../../data/marca'

// ─────────────────────────────────────────────────────────────
// Preencha os caminhos das imagens aqui.
// Use caminhos a partir de /src/assets ou URLs externas.
// Deixe como string vazia ('') para ocultar a imagem.
// ─────────────────────────────────────────────────────────────
const imagensDaPagina = {
  /** Hero — foto institucional (equipe, espaço ou fundador). Ideal: 16:9, mín. 800px */
  hero: '/logo.png',

  /** Trajetória — foto da produção ou de uma oficina em andamento. Ideal: 4:3 */
  trajetoria: '/oficina.jpg',

  /** Evolução — foto de mulheres participando de oficina. Ideal: 16:9 */
  oficina: '',

  /** Contribuições — foto dos produtos ou do processo artesanal. Ideal: quadrada */
  produtos: '/secao-produtos.jpg',
}

// ─────────────────────────────────────────────────────────────

const pilaresInstitucionais = [
  {
    titulo: 'Missão',
    texto: historiaDaMarca.missao,
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#396824" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    titulo: 'Visão',
    texto: historiaDaMarca.visao,
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#396824" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    titulo: 'Valores',
    texto: historiaDaMarca.valores,
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#396824" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

const numerosDeImpacto = [
  { numero: '9.543 L', descricao: 'de óleo coletado e reaproveitado entre 2023 e 2025' },
  { numero: '238mi L', descricao: 'de água preservada, evitando contaminação de rios e solos' },
  { numero: '89,23 t', descricao: 'de CO₂ equivalente não emitidos na atmosfera' },
]

const evolucaoAnual = [
  {
    ano: '2023',
    fase: 'Estruturação',
    mulheres: '33',
    oficinas: '3',
    municipios: '2',
    oleo: '1.235 L',
    agua: '30,8 milhões L',
    descricao:
      'O ano de 2023 marcou a fase de estruturação institucional com apoio do Instituto Aço Cearense e a validação do modelo de impacto. Foram estabelecidas as bases operacionais, metodológicas e comunitárias que permitiram a expansão consistente nos anos seguintes, com foco na capacitação inicial e organização produtiva.',
  },
  {
    ano: '2024',
    fase: 'Expansão',
    mulheres: '257',
    oficinas: '23',
    municipios: '4',
    oleo: '3.372 L',
    agua: '84,3 milhões L',
    descricao:
      'Em 2024, a Saboaria Ecológica entrou em uma fase de expansão territorial e fortalecimento das redes locais. O número de mulheres atendidas saltou de 33 para 257, refletindo a consolidação das metodologias formativas e o fortalecimento das parcerias institucionais em 4 municípios.',
  },
  {
    ano: '2025',
    fase: 'Consolidação',
    mulheres: '523',
    oficinas: '35',
    municipios: '3',
    oleo: '4.936 L',
    agua: '123,4 milhões L',
    descricao:
      'O ano de 2025 representa a consolidação institucional com ampliação da escala e reconhecimento público. Destacam-se a parceria com o SENAI, ações do Outubro Rosa com acompanhamento psicológico, e a expansão interestadual com oficinas no Ceará, Tocantins e Marabá (PA).',
  },
]

const contribuicoes = [
  {
    titulo: 'Redução da poluição',
    texto: 'Cada litro de óleo descartado incorretamente pode contaminar até 25.000 litros de água. Ao coletar e reaproveitar esse resíduo, a Saboaria Ecológica interrompe diretamente esse ciclo de poluição hídrica e do solo, protegendo rios, lençóis freáticos e sistemas de abastecimento das comunidades.',
  },
  {
    titulo: 'Educação ambiental',
    texto: 'Mais do que produzir sabão, o projeto forma agentes de mudança. As oficinas incluem conteúdos sobre consumo consciente, descarte correto de resíduos e responsabilidade coletiva. Em 2025, foram realizadas ações em escolas públicas, ampliando a educação ambiental desde a infância.',
  },
  {
    titulo: 'Geração de renda',
    texto: 'O projeto prioriza a geração de trabalho e renda para mulheres em situação de vulnerabilidade, por meio de formações técnicas, organização produtiva e acompanhamento contínuo. Entre 2023 e 2025, foram atendidas diretamente 813 mulheres, promovendo autonomia financeira e fortalecimento de redes locais.',
  },
  {
    titulo: 'Economia circular',
    texto: 'O modelo de negócio da Saboaria Ecológica é estruturado em torno da economia circular: o resíduo de uma cadeia produtiva alimentar se torna matéria-prima de uma cadeia de limpeza sustentável. Esse fechamento de ciclo reduz a dependência de insumos de origem fóssil e valoriza o que seria descartado.',
  },
]

const reconhecimentos = [
  {
    titulo: '2º lugar no Bora Impactar',
    texto: 'Reconhecida entre 40 negócios participantes do programa Bora Impactar, reafirmando o potencial de escala e impacto da iniciativa no ecossistema de negócios sociais.',
  },
  {
    titulo: 'Primeiro edital aprovado',
    texto: 'Captação de R$ 25.000,00 no primeiro edital aprovado, fortalecendo a sustentabilidade financeira e a capacidade operacional do projeto.',
  },
  {
    titulo: 'Presença em grandes eventos',
    texto: 'Participação no Festival Halleluya, na 5ª edição do IAC Social, no II Encontro de Empreendedorismo Socioambiental e no Programa Impulsiona Impacto, em parceria com a Coalizão pelo Impacto.',
  },
  {
    titulo: 'Expansão interestadual',
    texto: 'Em 2025, o projeto ultrapassou as fronteiras do Ceará, com oficinas realizadas no Tocantins e em Marabá (PA), consolidando um modelo replicável de impacto socioambiental.',
  },
]

const parcerias = [
  'Instituto Aço Cearense',
  'Grupo Mulheres do Brasil',
  'Universidade de Fortaleza (UNIFOR)',
  'FBuni',
  'Coalizão pelo Impacto',
  'SENAI',
  'ALECE',
  'Ninna Hub',
  'Feira do Porto do Pecém',
]

const ods = [
  { numero: '6', titulo: 'Água Potável e Saneamento', descricao: 'Prevenção da contaminação hídrica pelo reaproveitamento do óleo de cozinha usado.' },
  { numero: '12', titulo: 'Consumo e Produção Responsáveis', descricao: 'Economia circular aplicada à produção de produtos de limpeza ecológicos.' },
  { numero: '13', titulo: 'Ação Contra a Mudança do Clima', descricao: 'Mitigação de 89,23 toneladas de CO₂ equivalente entre 2023 e 2025.' },
]

const Sobre = () => {
  return (
    <div className="bg-creme text-[#1a2e1f]">

      {/* Hero */}
      <section className="bg-verde-principal pt-28 pb-16 md:pb-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/4" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-6 w-fit">
            Nossa história
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-5">
            Mais do que uma saboaria,<br />
            <em className="text-white/50">um movimento</em>
          </h1>
          <p className="text-white/65 font-light leading-relaxed text-base max-w-lg">
            Fundada em {historiaDaMarca.fundacao} com o propósito de transformar resíduos em soluções sustentáveis, unindo consciência ambiental, empoderamento comunitário e inovação social. Um negócio apoiado pelo Instituto Aço Cearense e alinhado aos princípios ESG.
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          {imagensDaPagina.hero && (
            <div className="rounded-2xl overflow-hidden h-52 md:h-60">
              <img
                src={imagensDaPagina.hero}
                alt="Saboaria Ecológica"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6">
            <h3 className="font-serif text-2xl text-white mb-2">Fundada em {historiaDaMarca.fundacao}</h3>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Um negócio social que nasceu da necessidade de transformar óleo saturado de frituras em produtos de limpeza ecológicos e acessíveis, gerando renda para mulheres de comunidades vulneráveis e preservando recursos naturais.
            </p>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border-t border-verde-principal/10">
        {pilaresInstitucionais.map((pilar, i) => (
          <div key={pilar.titulo} className={`p-8 md:p-10 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-verde-principal/10' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-verde-claro flex items-center justify-center mb-5">
              {pilar.icone}
            </div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-2">{pilar.titulo}</p>
            <p className="text-sm text-verde-muted leading-relaxed font-light">{pilar.texto}</p>
          </div>
        ))}
      </div>

      {/* História + Números */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-t border-verde-principal/10">
        <div className="px-6 md:px-20 py-16 md:py-20 bg-creme flex flex-col gap-5">
          <p className="text-xs font-medium tracking-widest uppercase text-verde-principal">Nossa trajetória</p>
          <h2 className="font-serif text-3xl md:text-4xl text-verde-principal leading-tight">
            Transformar resíduos em <em className="text-verde-principal">soluções reais</em>
          </h2>
          {imagensDaPagina.trajetoria && (
            <div className="rounded-2xl overflow-hidden h-52 md:h-full">
              <img
                src={imagensDaPagina.trajetoria}
                alt="Trajetória da Saboaria Ecológica"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-4 text-verde-muted text-sm leading-relaxed font-light">
            <p>
              A Saboaria Ecológica nasceu da observação de um problema cotidiano e silencioso: o descarte incorreto do óleo de cozinha usado. No Brasil, esse resíduo é frequentemente jogado no esgoto ou no solo, e cada litro descartado dessa forma é capaz de contaminar até 25.000 litros de água potável — um dano ambiental invisível, mas imenso.
            </p>
            <p>
              Diante dessa realidade, o projeto foi estruturado para fechar esse ciclo de forma inteligente e solidária. O óleo é coletado, transformado artesanalmente em produtos de limpeza biodegradáveis e comercializado, gerando uma cadeia produtiva inteiramente sustentável — do resíduo ao produto final.
            </p>
            <p>
              Mas o impacto vai além do ambiental. Ao longo de sua trajetória, a Saboaria Ecológica construiu um modelo que integra geração de renda, formação técnica, cuidado emocional e educação ambiental para mulheres em situação de vulnerabilidade social. Cada barra de sabão produzida representa também uma história de autonomia e recomeço.
            </p>
            <p>
              Entre 2023 e 2025, o projeto consolidou sua atuação, ampliou parcerias estratégicas e aprimorou processos produtivos e de governança, alinhando-se aos princípios ESG e expandindo seu impacto para além do Ceará, chegando ao Tocantins e ao Pará.
            </p>
          </div>
        </div>
        <div className="bg-verde-principal px-6 md:px-16 py-16 md:py-20 flex flex-col justify-center gap-5">
          <p className="text-white/60 text-xs font-medium tracking-widest uppercase">Impacto consolidado 2023–2025</p>
          {numerosDeImpacto.map((item) => (
            <div key={item.numero} className="bg-white/10 border border-white/15 rounded-2xl p-6">
              <p className="font-serif text-3xl font-bold text-white mb-1">{item.numero}</p>
              <p className="text-white/65 text-sm font-light">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evolução anual */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-white border-t border-verde-principal/10">
        <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-3">Crescimento ano a ano</p>
        <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-4">
          Evolução do <em className="text-verde-principal">impacto socioambiental</em>
        </h2>
        <p className="text-verde-muted font-light text-sm leading-relaxed max-w-2xl mb-8">
          Em apenas três anos de atuação, a Saboaria Ecológica multiplicou por mais de quinze vezes o número de mulheres atendidas e quadruplicou o volume de óleo reaproveitado. Cada ano representa uma fase distinta de crescimento, com aprendizados, conquistas e desafios que moldaram o projeto que existe hoje.
        </p>
        {imagensDaPagina.oficina && (
          <div className="rounded-2xl overflow-hidden h-60 md:h-80 mb-10">
            <img
              src={imagensDaPagina.oficina}
              alt="Oficina da Saboaria Ecológica"
              className="w-full h-full"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {evolucaoAnual.map((ano) => (
            <div key={ano.ano} className="border border-verde-principal/15 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-bold text-verde-principal">{ano.ano}</span>
                <span className="text-xs font-medium uppercase tracking-widest bg-verde-claro text-verde-principal px-3 py-1 rounded-full">
                  {ano.fase}
                </span>
              </div>
              <p className="text-xs text-verde-muted font-light leading-relaxed">{ano.descricao}</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-verde-muted">
                <div className="bg-creme rounded-xl p-3">
                  <p className="font-semibold text-verde-escuro text-base">{ano.mulheres}</p>
                  <p className="font-light">mulheres atendidas</p>
                </div>
                <div className="bg-creme rounded-xl p-3">
                  <p className="font-semibold text-verde-escuro text-base">{ano.oficinas}</p>
                  <p className="font-light">oficinas realizadas</p>
                </div>
                <div className="bg-creme rounded-xl p-3">
                  <p className="font-semibold text-verde-escuro text-base">{ano.oleo}</p>
                  <p className="font-light">óleo reaproveitado</p>
                </div>
                <div className="bg-creme rounded-xl p-3">
                  <p className="font-semibold text-verde-escuro text-base">{ano.municipios}</p>
                  <p className="font-light">municípios/estados</p>
                </div>
              </div>
              <div className="bg-verde-claro rounded-xl p-3 text-xs">
                <p className="font-medium text-verde-escuro mb-0.5">Água preservada</p>
                <p className="font-light text-verde-muted">{ano.agua}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contribuições */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-creme border-t border-verde-principal/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-3">Nosso impacto</p>
            <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-4">
              Contribuímos para um <em className="text-verde-principal">futuro melhor</em>
            </h2>
            <p className="text-verde-muted font-light text-sm leading-relaxed mb-8">
              O impacto da Saboaria Ecológica é multidimensional. Cada ação realizada conecta preservação ambiental, desenvolvimento humano e fortalecimento comunitário — porque acreditamos que sustentabilidade verdadeira só existe quando inclui as pessoas.
            </p>
            <div className="flex flex-col gap-5">
              {contribuicoes.map((item) => (
                <div
                  key={item.titulo}
                  className="p-6 rounded-2xl border border-verde-principal/12 hover:border-verde-principal hover:bg-white transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-verde-claro flex items-center justify-center mb-3">
                    <span className="w-2 h-2 rounded-full bg-verde-principal" />
                  </div>
                  <p className="text-sm font-medium text-verde-principal mb-2">{item.titulo}</p>
                  <p className="text-sm text-verde-muted leading-relaxed font-light">{item.texto}</p>
                </div>
              ))}
            </div>
          </div>
          {imagensDaPagina.produtos && (
            <div className="rounded-2xl overflow-hidden md:sticky md:top-28 h-72 md:h-150">
              <img
                src={imagensDaPagina.produtos}
                alt="Produtos da Saboaria Ecológica"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* ODS */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-verde-principal border-t border-white/10">
        <p className="text-xs font-medium tracking-widest uppercase text-white/60 mb-3">Alinhamento global</p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Objetivos de <em className="text-white/50">Desenvolvimento Sustentável</em>
        </h2>
        <p className="text-white/60 font-light text-sm leading-relaxed max-w-2xl mb-10">
          A atuação da Saboaria Ecológica está diretamente alinhada à Agenda 2030 da ONU. Os resultados gerados contribuem de forma mensurável e verificável para três dos Objetivos de Desenvolvimento Sustentável, reforçando a credibilidade institucional do projeto junto a parceiros, investidores e editais públicos e privados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {ods.map((item) => (
            <div key={item.numero} className="bg-white/10 border border-white/15 rounded-2xl p-6 flex-1">
              <span className="font-serif text-3xl font-bold text-white block mb-2">ODS {item.numero}</span>
              <p className="text-white/85 text-sm font-medium mb-1">{item.titulo}</p>
              <p className="text-white/55 text-xs font-light leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reconhecimentos + Parcerias */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-white border-t border-verde-principal/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-3">Conquistas</p>
            <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-4">
              Reconhecimentos e <em className="text-verde-principal">marcos</em>
            </h2>
            <p className="text-verde-muted font-light text-sm leading-relaxed mb-8">
              Ao longo de sua trajetória, a Saboaria Ecológica acumulou reconhecimentos que validam seu modelo de impacto e ampliam sua visibilidade no ecossistema de negócios sociais e sustentabilidade.
            </p>
            <div className="flex flex-col gap-5">
              {reconhecimentos.map((item) => (
                <div key={item.titulo} className="flex gap-4 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-verde-principal mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-verde-escuro mb-1">{item.titulo}</p>
                    <p className="text-xs text-verde-muted font-light leading-relaxed">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-3">Rede de apoio</p>
            <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-4">
              Parcerias e <em className="text-verde-principal">articulações</em>
            </h2>
            <p className="text-verde-muted font-light text-sm leading-relaxed mb-8">
              A força do projeto está também em sua rede. A Saboaria Ecológica atua em articulação com instituições de ensino, organizações do terceiro setor, iniciativa privada e poder público, construindo pontes entre diferentes setores em prol de um objetivo comum: o desenvolvimento sustentável com equidade social.
            </p>
            <div className="flex flex-wrap gap-2">
              {parcerias.map((parceiro) => (
                <span
                  key={parceiro}
                  className="text-xs font-medium bg-creme border border-verde-principal/15 text-verde-escuro px-4 py-2 rounded-full"
                >
                  {parceiro}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-verde-principal flex flex-col items-center text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
          Conheça nossos <em className="text-white/50">produtos</em>
        </h2>
        <p className="text-white/60 font-light mb-8 max-w-md leading-relaxed text-sm">
          Cada compra é um ato de consciência. Veja o que produzimos com responsabilidade e cuidado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/produtos" className="bg-white text-verde-principal px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity text-center">
            Ver produtos
          </Link>
          <a
            href={`https://wa.me/${contatosDaMarca.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="border border-white/30 text-white px-8 py-3 rounded-full text-sm font-light hover:border-white transition-colors text-center"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default Sobre