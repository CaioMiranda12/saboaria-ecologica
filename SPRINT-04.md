# Sprint 04 — Editores das páginas institucionais

## Entregas
- Editores em `/admin/paginas/sobre`, `/admin/paginas/processo`, `/admin/paginas/equipe` e `/admin/paginas/contato`.
- Campos organizados por página, avisos de alterações pendentes, descarte e salvamento autenticado.
- Integração de títulos e textos das páginas públicas com o CMS no Neon.
- Contatos e horários editáveis na página de Contato; missão, visão e valores na página Sobre.
- Resumo editável das etapas na página Processo; o componente detalhado de timeline original permanece estático.
- Sem migrations novas. Seed do CMS atualizado para novos bancos; não sobrescreve conteúdo existente.

## Instalação
1. Preserve `.env` ou `.env.local` e nunca compartilhe credenciais.
2. `npm install`
3. `npx prisma generate --config prisma7.config.ts`
4. `npm run db:seed-cms` (se já executou, não sobrescreve seções existentes)
5. `npm run dev`
6. Acesse `/admin/paginas` e teste os quatro editores.

## Limitações conhecidas
- A edição é de campos definidos, não um construtor livre de páginas.
- A prévia mostra os textos principais; para a prévia fiel use o link Ver página.
- Algumas seções complexas da página Sobre, timeline detalhada do Processo, mapa de localizações e cards de integrantes ainda utilizam dados originais; serão tratados em sprints posteriores.
- Salvar publica imediatamente. Rascunhos e versões chegam na Sprint 7.
- Não foi possível validar conexão com seu Neon ou executar o build completo neste ambiente.

## Commit
`feat(pages): sprint 04 - edicao das paginas institucionais`
