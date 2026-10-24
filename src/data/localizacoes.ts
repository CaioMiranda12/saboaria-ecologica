// MOCK: localizações da Saboaria Ecológica exibidas no mapa da página de contato.
// Futuramente estes dados virão do banco e serão editáveis na área admin;
// o formato abaixo já espelha o que um modelo `Location` precisaria ter.

export type Localizacao = {
  id: string;
  cidade: string;
  estado: string; // sigla da UF
  descricao: string;
  latitude: number;
  longitude: number;
  /** Marca a unidade principal (recebe destaque visual no mapa). */
  sede?: boolean;
};

export const localizacoes: Localizacao[] = [
  {
    id: "caucaia-ce",
    cidade: "Caucaia",
    estado: "CE",
    descricao:
      "Nossa sede e fábrica, em Iparana. É daqui que sai toda a produção dos sabões a partir do óleo de cozinha reaproveitado.",
    latitude: -3.7361,
    longitude: -38.6531,
    sede: true,
  },
  {
    id: "recife-pe",
    cidade: "Recife",
    estado: "PE",
    descricao:
      "Ponto de coleta de óleo usado em parceria com associações de bairro, ajudando a manter o óleo longe dos rios.",
    latitude: -8.0476,
    longitude: -34.877,
  },
  {
    id: "salvador-ba",
    cidade: "Salvador",
    estado: "BA",
    descricao:
      "Parceria com cooperativas locais de reciclagem e entrega dos nossos produtos para lojas e feiras da região.",
    latitude: -12.9714,
    longitude: -38.5014,
  },
  {
    id: "brasilia-df",
    cidade: "Brasília",
    estado: "DF",
    descricao:
      "Ponto de distribuição para o Centro-Oeste e espaço de oficinas de educação ambiental e sustentabilidade.",
    latitude: -15.7939,
    longitude: -47.8828,
  },
  {
    id: "sao-paulo-sp",
    cidade: "São Paulo",
    estado: "SP",
    descricao:
      "Centro de distribuição para o Sudeste e parceria com empresas que doam o óleo de suas cozinhas.",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "porto-alegre-rs",
    cidade: "Porto Alegre",
    estado: "RS",
    descricao:
      "Revendedores parceiros no Sul, levando sabão ecológico para quem busca consumo mais consciente.",
    latitude: -30.0346,
    longitude: -51.2177,
  },
];