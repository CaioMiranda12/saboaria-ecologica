# Sprint 13 — Desempenho e acessibilidade

- PublicImage usa versões WebP locais (até 1600 px), preservando os originais, e transforma URLs Cloudinary HTTPS versionadas com f_auto,q_auto,c_limit. Outras URLs permanecem intactas. Lazy loading por padrão, prioridade no hero da Home.
- Navegação pública: link de salto, foco visível, aria-current, menu mobile com aria-expanded e Escape. Catálogo: filtros aria-pressed, contador anunciado e diálogo nativo estilizado com foco modal, Escape e retorno de foco. FormField associa labels e erros a campos HTML diretos. Preferência de movimento reduzido e aumento de opacidade de textos claros selecionados.
- CMS: consulta da publicação seleciona somente sections e memoização React por renderização em publicSection. Não adiciona cache persistente nem altera invalidação existente.
- Sem migration, dependências ou variáveis novas. Originais mantidos para compatibilidade. Não é auditoria WCAG completa; contraste, CLS, LCP e INP precisam ser medidos no navegador. Componentes complexos de formulário ainda exigem revisão individual.

## Validar

npm install; npx prisma generate --config prisma7.config.ts; npm run build; npm run dev.
Testar imagens locais e Cloudinary, publicação CMS, teclado Tab/Shift+Tab/Escape, filtros, diálogo, menu móvel e formulários. Usar Lighthouse em build de produção e comparar com Sprint 12.1 nas mesmas condições. Análise sintática TypeScript realizada; build e integração não executados neste ambiente.
