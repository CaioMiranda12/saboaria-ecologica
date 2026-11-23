// Slugs fixos: nunca aceitar nomes arbitrários de tabelas ou páginas da API.
export const CMS_PAGES = {
  inicio: "Página inicial",
  sobre: "Sobre nós",
  processo: "Nosso processo",
  equipe: "Equipe",
  contato: "Contato",
} as const;

export type CmsPageSlug = keyof typeof CMS_PAGES;
export function isCmsPageSlug(value: string): value is CmsPageSlug {
  return Object.prototype.hasOwnProperty.call(CMS_PAGES, value);
}
