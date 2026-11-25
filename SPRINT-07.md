# Sprint 07 — Rascunhos, publicação e histórico

## Novidades

- O botão **Salvar alterações** nos editores de Início, Sobre, Processo, Equipe e Contato grava apenas um rascunho.
- **Publicar página** torna o rascunho visível no site público.
- **Histórico de publicações** lista até 20 versões recentes e permite restaurar uma versão para o rascunho, sem publicar automaticamente.
- A migration copia o conteúdo atual de `cms_sections` para `cms_publications` antes de separar rascunhos e conteúdo publicado.
- Publicação invalida o cache da rota pública correspondente.

## Atualização

1. Faça backup do banco Neon e preserve seu `.env` ou `.env.local`.
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run dev`

**Não rode o seed para sobrescrever edições.** O seed anterior é de criação inicial e não é necessário nesta atualização.

## Teste

1. Entre em `/admin/paginas/inicio`, altere o título e clique em **Salvar alterações**.
2. Verifique que a página `/` continua exibindo a versão anterior.
3. Clique em **Publicar página** e recarregue `/` para conferir a atualização.
4. Abra **Histórico de publicações**, restaure uma versão e confira que ela é um rascunho até publicar.
5. Repita com `/sobre`, `/processo`, `/equipe` e `/contato`.

## Limitações

- Prévia permanece nos próprios formulários, não há rota pública de pré-visualização autenticada.
- Histórico registra versões **publicadas**, não cada salvamento de rascunho.
- A versão restaurada substitui o rascunho atual, após confirmação.
- A verificação do build e a integração real com Neon devem ser realizadas no seu ambiente.
