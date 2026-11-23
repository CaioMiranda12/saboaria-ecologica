# Sprint 05 — Melhorias dos cadastros

## Novidades
- Produtos: publicação/ocultação no catálogo, ordem de exibição, busca, filtros de visibilidade, ordenação e tabela com rolagem horizontal no celular.
- Equipe: upload opcional de foto, busca por nome/cargo e ordenação. A foto é exibida no cadastro administrativo; a integração com a apresentação pública da equipe ainda precisa ser feita onde aplicável.
- Parcerias: campo de URL de logotipo, edição do logotipo e da ordem, busca por nome e confirmação antes da exclusão.
- Migração aditiva: mantém produtos existentes publicados por padrão, preservando o catálogo.

## Instalação
1. Faça backup do banco Neon e preserve seu `.env` (não está incluído no ZIP).
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run dev`
6. Teste `/admin/produtos`, `/admin/equipe` e `/admin/parcerias`.

## Verificações sugeridas
- Ocultar um produto e conferir que desaparece de `/produtos`; republicá-lo e conferir que retorna.
- Alterar a ordem e conferir a ordenação na listagem.
- Criar e editar integrante com foto; testar filtro por nome/cargo.
- Criar parceria com logo, editar ordem e conferir busca e confirmação de exclusão.
- Executar `npm run build` no ambiente local antes de publicar.

## Observações
- Não foram implementados controles de publicação para equipe e parcerias nesta sprint.
- A biblioteca de mídia reutilizável será desenvolvida na Sprint 6.
- O fluxo de rascunhos/publicação controlada está planejado para a Sprint 7.
- Não houve teste de conexão com seu Neon neste ambiente.

## Commit
`feat(admin): sprint 05 - melhorias nos cadastros`
