export const seoPages = [
  {
    path: "/",
    label: "Início",
    title: "Saboaria Ecológica",
    description: "Limpeza que cuida do planeta.",
  },
  {
    path: "/sobre",
    label: "Sobre nós",
    title: "Sobre nós | Saboaria Ecológica",
    description: "Conheça a história e a missão da Saboaria Ecológica.",
  },
  {
    path: "/produtos",
    label: "Produtos",
    title: "Produtos | Saboaria Ecológica",
    description: "Conheça nosso catálogo de produtos ecológicos.",
  },
  {
    path: "/processo",
    label: "Processo",
    title: "Processo | Saboaria Ecológica",
    description: "Conheça nosso processo de produção.",
  },
  {
    path: "/equipe",
    label: "Equipe",
    title: "Equipe | Saboaria Ecológica",
    description: "Conheça a equipe da Saboaria Ecológica.",
  },
  {
    path: "/mapa",
    label: "Mapa",
    title: "Onde estamos | Saboaria Ecológica",
    description: "Conheça as localizações da Saboaria Ecológica.",
  },
  {
    path: "/parcerias",
    label: "Parcerias",
    title: "Parcerias | Saboaria Ecológica",
    description: "Conheça a rede de apoio da Saboaria Ecológica.",
  },
  {
    path: "/contato",
    label: "Contato",
    title: "Contato | Saboaria Ecológica",
    description: "Entre em contato com a Saboaria Ecológica.",
  },
] as const;
export type SeoFields = { title: string; description: string; imageUrl: string };
