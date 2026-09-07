export type EtapaDoProcesso = {
  numero: string
  titulo: string
  texto: string
  pills: string[]
}

export const etapasDoProcessoNatural: EtapaDoProcesso[] = [
  {
    numero: '1',
    titulo: 'Coleta do óleo saturado',
    texto:
      'Coletamos óleo de fritura descartado de residências, restaurantes e estabelecimentos parceiros das comunidades locais. Esse resíduo, se jogado no esgoto, contamina até 25 mil litros de água potável.',
    pills: ['Comunidade', 'Economia circular', 'Coleta responsável'],
  },
  {
    numero: '2',
    titulo: 'Filtragem e tratamento',
    texto:
      'O óleo coletado passa por um processo de filtragem para remover impurezas sólidas. Em seguida, é tratado para garantir a qualidade e segurança do produto final, eliminando odores e resíduos indesejados.',
    pills: ['Filtragem natural', 'Controle de qualidade'],
  },
  {
    numero: '3',
    titulo: 'Saponificação artesanal',
    texto:
      'O óleo tratado é misturado com hidróxido de sódio e água em proporções precisas. Essa reação química transforma o óleo em sabão. Essências naturais e ingredientes complementares são adicionados nessa etapa.',
    pills: ['Saponificação', 'Essências naturais', 'Processo artesanal'],
  },
  {
    numero: '4',
    titulo: 'Moldagem e cura',
    texto:
      'A massa de sabão é despejada em moldes e deixada em repouso para solidificar e curar. Esse período é essencial para que o sabão atinja a textura, dureza e eficácia ideais antes de ser cortado e embalado.',
    pills: ['Moldagem manual', 'Tempo de cura'],
  },
  {
    numero: '5',
    titulo: 'Embalagem sustentável',
    texto:
      'Os produtos são embalados com materiais sustentáveis e identificados com rótulos informativos. Cada embalagem reforça nosso compromisso com o meio ambiente, sem plásticos desnecessários.',
    pills: ['Embalagem eco', 'Sem plástico desnecessário', 'Rastreável'],
  },
  {
    numero: '6',
    titulo: 'Distribuição e impacto social',
    texto:
      'Os produtos chegam às mãos dos consumidores, gerando renda para mulheres de comunidades vulneráveis e promovendo educação ambiental. Cada venda fecha o ciclo da economia circular.',
    pills: ['Geração de renda', 'Impacto social', 'Educação ambiental'],
  },
]

export const ingredientesDosProdutos = [
  {
    nome: 'Óleo vegetal saturado',
    descricao: 'Matéria-prima principal, coletado como resíduo doméstico',
  },
  {
    nome: 'Hidróxido de sódio',
    descricao: 'Agente saponificante que transforma óleo em sabão',
  },
  {
    nome: 'Água',
    descricao: 'Base da reação de saponificação',
  },
  {
    nome: 'Essências naturais e/ou químicas',
    descricao: 'Conferem fragrância ao produto final',
  },
  {
    nome: 'Bicarbonato de sódio',
    descricao: 'Presente em alguns produtos para potencializar a limpeza',
  },
]

export const principiosDeProducao = [
  {
    titulo: 'Biodegradabilidade',
    texto:
      'Todos os ingredientes são selecionados para garantir que o produto se decomponha naturalmente sem prejudicar o solo ou a água.',
  },
  {
    titulo: 'Reutilização',
    texto:
      'O óleo de fritura, principal matéria-prima, é um resíduo que seria descartado incorretamente. Transformá-lo é o centro do nosso modelo.',
  },
  {
    titulo: 'Produção coletiva',
    texto:
      'A fabricação envolve mulheres de comunidades vulneráveis, garantindo que o processo produtivo também seja um instrumento de inclusão social.',
  },
]