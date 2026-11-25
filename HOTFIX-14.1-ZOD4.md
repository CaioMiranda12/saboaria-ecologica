# Sprint 14.1 — Migração Zod 4

Pacote incremental sobre o arquivo atualizado enviado. Não substitui package.json nem package-lock.json.

1. Extraia na raiz do projeto, sobrescrevendo os arquivos correspondentes.
2. Execute `npx --yes npm@11 install --save-exact zod@4.6.7`.
3. Execute `npm run format`, `npm run lint`, `npm run typecheck`, `npm run build`. Interrompa em caso de falha.
4. Execute `npx --yes npm@11 audit` e `npx --yes npm@11 audit --omit=dev`.
5. Após validação, configure os scripts Vitest e execute a suíte.

Mantém o override effect, Next.js e Prisma atualizados. Sem alterações no banco ou dependências além de Zod. Cinco testes adicionais de regressão; não executados neste ambiente. Registro npm inacessível (EAI_AGAIN); lockfile deverá ser atualizado pelo comando de instalação local.
