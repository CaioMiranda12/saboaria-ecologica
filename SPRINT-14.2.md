# Sprint 14.2 — Integração contínua

O workflow `.github/workflows/ci.yml` executa no Linux a cada push para `master`, pull request com destino a `master` e execução manual pela aba Actions.

- Node.js 22.20.0, npm 11 e instalação pelo lockfile (`npm ci`).
- Geração do Prisma Client, Prettier, ESLint, Typecheck e Vitest.
- Auditoria de todas as dependências: falha para vulnerabilidades altas ou críticas. As demais continuam visíveis no relatório.
- Permissão somente de leitura do repositório, sem persistir credenciais no checkout.
- Execuções antigas da mesma referência são canceladas quando uma nova começa.

## Banco e build

A configuração usa valores fictícios de ambiente, incluindo uma URL local sem servidor PostgreSQL. A geração do Prisma Client não exige uma conexão ativa. Os testes existentes utilizam mocks. Não configure segredos do Neon, Cloudinary ou Resend para este workflow.

O build completo fica fora do CI inicial: as páginas estáticas e seus metadados consultam o banco durante `next build`. Portanto, continue executando `npm run check` localmente com seu `.env` antes de cada commit. Não há migrations, seeds, deploy, Docker ou Playwright neste workflow.

## Aplicação

1. Extraia o pacote na raiz do projeto atualizado (incluindo a pasta oculta `.github`).
2. Execute `npm run format` e `npm run check` localmente.
3. Confira `git status --short` e adicione apenas os arquivos da sprint.
4. Faça o commit e envie para `master`.
5. No GitHub, abra Actions > CI > execução mais recente e confira o job Qualidade e testes.

Não é necessário instalar dependências novas nem gerar outro banco. Não envie `.env` ao GitHub.

Commit: `ci: sprint 14.2 - integracao continua com github actions`.

A execução remota precisa ser confirmada no GitHub. A configuração foi preparada sem acesso ao repositório remoto ou ao ambiente de CI do usuário.
