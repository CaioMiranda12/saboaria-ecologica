# Sprint 02 — Estrutura do CMS e integração com Neon

## Entregue

- Tabelas `cms_pages` e `cms_sections` com migration versionada e vínculo por chave estrangeira.
- Seções ordenadas, habilitáveis e com conteúdo JSON; chaves únicas por página.
- Rotas protegidas por sessão: `GET /api/admin/cms/pages`, `GET /api/admin/cms/pages/:slug` e `PUT /api/admin/cms/pages/:slug`.
- Endpoint público `GET /api/cms/pages/:slug` (retorna apenas seções habilitadas).
- Validação de payload e lista fechada de páginas permitidas.
- Seed inicial idempotente com conteúdo baseado nos arquivos estáticos existentes, sem sobrescrever edições posteriores.
- Serviços e repositórios para uso dos editores nas próximas sprints.

## Instalação (na raiz do projeto)

1. Preserve seu `.env` local com `DATABASE_URL`. Nunca publique credenciais no Git.
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run db:seed-cms`
6. `npm run dev`

Caso use apenas `.env.local`, carregue-o no terminal antes de executar os comandos. O Prisma config usa `dotenv/config`, que carrega `.env` por padrão.

## Testes

- Acessar `/api/cms/pages/inicio`: deve retornar as seções iniciais sem exigir login.
- Sem login, `/api/admin/cms/pages` deve responder HTTP 401.
- Com login, `/api/admin/cms/pages` deve listar as páginas.
- `GET /api/admin/cms/pages/inicio` deve mostrar o conteúdo completo.
- `PUT /api/admin/cms/pages/inicio` exige `{ "sections": [...] }` com `key`, `title`, `position`, `enabled` e `content` para cada seção. **O PUT substitui a lista inteira de seções da página**; preserve todas as seções desejadas.
- Execute `npm run db:seed-cms` uma segunda vez: não deve sobrescrever edições.

## Limites desta sprint

- Páginas públicas continuam exibindo o conteúdo estático original. Os editores visuais e a ligação dos componentes públicos com o CMS serão implementados nas Sprints 3 e 4.
- A API de edição é infraestrutura, não interface para uso cotidiano. Evite usá-la manualmente em produção.
- Rascunhos, publicação controlada e histórico ficam para a Sprint 7.
- Não foi possível validar conexão com seu Neon neste ambiente; aplique migration e seed no seu computador.

## Commit

`feat(cms): sprint 02 - estrutura do cms e integracao com neon`
