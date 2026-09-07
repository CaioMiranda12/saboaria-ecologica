

export type Produto = {
  id: string
  nomePrincipal: string
  nomeComplemento: string
  descricao: string
  descricaoCompleta: string
  peso: string | null
  tipo: 'barra' | 'pasta' | 'liquido' | 'po' | 'sabonete'
  ingredientes?: string[]
  tipos: string[]
  modoDeUso: string
  badge: string
  destaque?: boolean
  consultarFragrancias?: boolean
  consultarTamanhos?: boolean
  imagem?: string | null
}

export const listaDeProdutos: Produto[] = [
  {
    id: 'sabao-barra-multiuso',
    nomePrincipal: 'Sabão em Barra',
    nomeComplemento: 'Barra',
    descricao: 'Ideal para limpeza geral, feito com óleo reutilizado e ingredientes naturais.',
    descricaoCompleta:
      'Ideal para limpeza geral, o Sabão em Barra Multiuso é feito com óleo reutilizado e ingredientes naturais. Limpa com eficiência sem agredir o meio ambiente.',
    peso: '250g',
    tipo: 'barra',
    ingredientes: [
      'Óleo vegetal saturado',
      'Hidróxido de sódio',
      'Água',
      'Essência química e/ou natural',
    ],
    tipos: ['Tradicional', 'Leite de coco', 'Folha de mamão', 'Juá'],
    modoDeUso:
      'Aplique diretamente na superfície ou em uma esponja úmida. Esfregue suavemente e enxágue.',
    badge: 'Biodegradável',
    destaque: true,
    consultarFragrancias: true,
    imagem: '/sabonete-em-barra.jpg'
  },
  {
    id: 'pasta-de-brilho',
    nomePrincipal: 'Pasta de Brilho',
    nomeComplemento: 'Pasta',
    descricao:
      'Remove gordura pesada de fogões, grelhas e inox. Devolve o brilho natural sem danificar.',
    descricaoCompleta:
      'Excelente para remover gordura pesada de fogões, grelhas, formas e assadeiras, podendo ser usada também em azulejos, pias e superfícies de inox. Retira manchas e devolve o brilho natural sem danificar.',
    peso: '250g',
    tipo: 'pasta',
    ingredientes: [
      'Óleo vegetal saturado',
      'Hidróxido de sódio',
      'Água',
      'Essência química e/ou natural',
    ],
    tipos: ['Tradicional'],
    modoDeUso:
      'Aplique uma pequena quantidade da pasta sobre a superfície com uma esponja úmida. Esfregue suavemente e enxágue.',
    badge: 'Biodegradável',
    destaque: false,
    consultarTamanhos: true,
    imagem: '/pasta-de-brilho.jpg',
  },
  {
    id: 'sabao-liquido',
    nomePrincipal: 'Sabão Líquido',
    nomeComplemento: 'Líquido',
    descricao:
      'Para roupas, louças e superfícies. Biodegradável e feito com óleo reutilizado.',
    descricaoCompleta:
      'Produto de limpeza ecológico, ideal para roupas, louças e superfícies. Feito com óleo reutilizado, é biodegradável e eficaz.',
    peso: '5L',
    tipo: 'liquido',
    ingredientes: [
      'Óleo vegetal saturado',
      'Hidróxido de sódio',
      'Água',
      'Essência química e/ou natural',
      'Bicarbonato de sódio',
      'Álcool',
    ],
    tipos: ['Talco', 'Limão', 'Eucalipto'],
    modoDeUso:
      'Aplicar diretamente sobre a superfície ou diluir em água. Enxaguar após o uso.',
    badge: 'Biodegradável',
    destaque: false,
    consultarFragrancias: true,
    imagem: '/sabao-liquido.jpg',
  },
  {
    id: 'detergente',
    nomePrincipal: 'Detergente',
    nomeComplemento: 'Líquido',
    descricao:
      'Detergente ecológico para limpeza de superfícies.',
    descricaoCompleta:
      'Detergente ecológico para limpeza de superfícies, feito com ingredientes naturais e biodegradáveis. Ideal para uso em ambientes domésticos e comerciais.',
    peso: '5L',
    tipo: 'liquido',
    tipos: [''],
    modoDeUso:
      '',
    badge: '',
    destaque: true,
    imagem: '/detergente.jpg',
  },
  {
    id: 'agua-sanitaria',
    nomePrincipal: 'Água Sanitária',
    nomeComplemento: 'Líquido',
    descricao:
      'Água sanitária ecológica para limpeza de superfícies.',
    descricaoCompleta:
      'Água sanitária ecológica para limpeza de superfícies, feito com ingredientes naturais e biodegradáveis. Ideal para uso em ambientes domésticos e comerciais.',
    peso: '5L',
    tipo: 'liquido',
    tipos: [''],
    modoDeUso:
      '',
    badge: '',
    destaque: true,
    imagem: '/agua-sanitaria.jpg',
  },
  {
    id: 'amaciante',
    nomePrincipal: 'Amaciante',
    nomeComplemento: 'Líquido',
    descricao:
      'Amaciante ecológico para lavagem de roupas.',
    descricaoCompleta:
      'Amaciante ecológico para lavagem de roupas, feito com ingredientes naturais e biodegradáveis. Ideal para uso em ambientes domésticos e comerciais.',
    peso: '5L',
    tipo: 'liquido',
    tipos: [''],
    modoDeUso:
      '',
    badge: '',
    destaque: true,
    imagem: '/amaciante.jpg',
  },
  {
    id: 'desinfetante',
    nomePrincipal: 'Desinfetante',
    nomeComplemento: 'Líquido',
    descricao:
      'Desinfetante ecológico para limpeza de superfícies.',
    descricaoCompleta:
      'Desinfetante ecológico para limpeza de superfícies, feito com ingredientes naturais e biodegradáveis. Ideal para uso em ambientes domésticos e comerciais.',
    peso: '5L',
    tipo: 'liquido',
    tipos: [''],
    modoDeUso:
      '',
    badge: '',
    destaque: true,
    imagem: '/desinfetante.jpg',
  },
  {
    id: 'sabao-em-po',
    nomePrincipal: 'Sabão em Pó',
    nomeComplemento: 'Pó',
    descricao:
      'Para lavagem de roupas à mão ou na máquina. Fórmula segura para o meio ambiente.',
    descricaoCompleta:
      'Sabão em pó biodegradável ideal para lavagem de roupas e limpeza geral, com fórmula eficaz e segura para o meio ambiente.',
    peso: '400g',
    tipo: 'po',
    ingredientes: [
      'Óleo vegetal saturado',
      'Hidróxido de sódio',
      'Água',
      'Essência química e/ou natural',
      'Bicarbonato de sódio',
    ],
    tipos: ['Tradicional', 'Coco'],
    modoDeUso:
      'Dissolva 2 colheres de sopa em 5 litros de água para lavagem manual. Para máquina de lavar, utilize a dosagem conforme recomendação do fabricante.',
    badge: 'Biodegradável',
    destaque: false,
    consultarFragrancias: true,
    imagem: '/sabao-em-po.png',
  },
  {
    id: 'sabonete-em-cachos',
    nomePrincipal: 'Sabonete em Cachos',
    nomeComplemento: 'Cachos',
    descricao:
      'Sabonete artesanal à base de glicerina. Hidrata e mantém a umidade natural da pele.',
    descricaoCompleta:
      'Sabonete artesanal à base de glicerina, ideal para uma limpeza suave e delicada, que hidrata e ajuda a manter a umidade natural da pele, deixando-a macia, perfumada e revitalizada. Com formato criativo e encantador, cada peça é feita manualmente com atenção aos detalhes, unindo beleza, cuidado e um toque especial que transforma o banho em uma experiência única, perfeita tanto para o uso diário quanto para presentear.',
    peso: null,
    tipo: 'sabonete',
    ingredientes: ['Base glicerinada', 'Extrato de aveia'],
    tipos: ['Artesanal decorativo'],
    modoDeUso:
      'Aplique sobre a pele úmida, massageando suavemente até formar espuma. Enxágue em seguida.',
    badge: 'Biodegradável',
    destaque: true,
    imagem: '/sabonete-em-cachos.png',
  },

]