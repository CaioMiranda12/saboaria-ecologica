# Sprint 03 — Editor da página inicial

## Entregas

- `/admin/paginas/inicio`: edição guiada do banner principal e da seção Quem somos.
- Campos de texto, botões, imagens por URL, visibilidade, pré-visualização local, aviso de alterações não salvas e confirmação de salvamento.
- `/` lê essas duas seções diretamente do Neon por meio do CMS da Sprint 02, mantendo conteúdo padrão se a página ainda não tiver sido inicializada.
- Link do editor habilitado na central `/admin/paginas`.
- Validação adicional dos campos de conteúdo da página inicial na API administrativa.

## Instalação

1. Preserve seu `.env`/`.env.local` local (não está incluído no ZIP).
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run db:seed-cms` (idempotente, não sobrescreve textos editados).
6. `npm run dev`
7. Abra `/admin/paginas/inicio`.

## Observações

- Não há migration nova nesta sprint. O deploy acima apenas garante que as migrations anteriores estejam aplicadas.
- Salvar publica imediatamente. Rascunhos e publicação separada estão previstos para a Sprint 07.
- Pré-visualização é uma representação da seção dentro do editor, não uma reprodução exata da página.
- Imagens são informadas por URL ou caminho público. A biblioteca de mídia será criada na Sprint 06.
- Os destaques de produtos e a ordem das seções continuam estáticos nesta entrega; essas melhorias serão retomadas nas próximas sprints.
- Não foi possível executar o build completo neste ambiente por falta de dependências instaladas. Execute `npm run build` localmente antes de publicar.

## Commit

`feat(home): sprint 03 - editor da pagina inicial`
