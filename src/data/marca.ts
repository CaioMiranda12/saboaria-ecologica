export type MembroDaEquipe = {
  nome: string
  cargo: string
  bio: string
  iniciais: string
}

export const historiaDaMarca = {
  fundacao: '2023',
  ceo: 'Luan Nycollas',
  descricao:
    'Somos a Saboaria Ecológica, um negócio social que nasceu com o propósito de transformar resíduos em soluções sustentáveis.',
  missao: 'Desenvolver o empreendedorismo sustentável em coletivo de mulheres de comunidades vulneráveis.',
  visao: 'Ser referência na área de sustentabilidade socioambiental, agregando valor nas comunidades.',
  valores: 'Preservação, responsabilidade social, integridade e valorização das pessoas.',
}

export const equipe: MembroDaEquipe[] = [
  {
    nome: 'Luan Nycollas',
    cargo: 'CEO e Coordenador Pedagógico',
    bio: 'Pedagogo e estudante de pedagogia Waldorf, atua como educador social e ambiental, agente cultural e captador de recursos. Fundador da Saboaria Ecológica, lidera o desenvolvimento de metodologias educativas e estratégias de impacto socioambiental, com foco na geração de renda e sustentabilidade.',
    iniciais: 'LN',
  },
  {
    nome: 'Lucas Fernandes',
    cargo: 'Químico e Administrativo',
    bio: 'Responsável pelo controle de qualidade e processos químicos da produção de sabão ecológico. Atua também na organização administrativa, garantindo que as atividades operacionais estejam alinhadas às normas e à eficiência do projeto.',
    iniciais: 'LF',
  },
  {
    nome: 'Josely Miranda',
    cargo: 'Assistente Social e Coordenadora de Campo',
    bio: 'Assistente social, atua diretamente no acompanhamento das participantes do projeto. Coordena as atividades em campo, fortalecendo o vínculo com as comunidades e promovendo inclusão social e geração de oportunidades.',
    iniciais: 'JM',
  },
  {
    nome: 'Catarine',
    cargo: 'Marketing e Comunicação',
    bio: 'Responsável pelo posicionamento da marca e estratégias de divulgação. Atua na criação de campanhas, gestão de redes sociais e fortalecimento da identidade da Saboaria Ecológica.',
    iniciais: 'CA',
  },
  {
    nome: 'Patrícia',
    cargo: 'Facilitadora de Oficinas',
    bio: 'Educadora e facilitadora, conduz formações práticas na produção de sabão ecológico. Promove autonomia, geração de renda e conscientização ambiental junto aos participantes.',
    iniciais: 'PA',
  },
  {
    nome: 'Hugo',
    cargo: 'Auxiliar de Produção',
    bio: 'Apoia os processos produtivos e logísticos, contribuindo na organização, produção e suporte das oficinas, garantindo qualidade e eficiência nas atividades.',
    iniciais: 'HU',
  },
]

export const contatosDaMarca = {
  whatsapp: '5585987052241',
  instagram: 'saboariaecologica',
  email: 'saboariaecologica@gmail.com',
  linkedin: 'saboaria-ecol%C3%B3gica-2a8520365',
  endereco: 'Av. Ulisses Guimarães, 3132 - Iparana',
}