# Sprint 14.1 — Testes automatizados

Aplicar na raiz da versão local validada da Sprint 14. Este pacote incremental não substitui package.json, package-lock.json ou arquivos de produção.

## Instalação

```bash
npm install -D vitest@^4 @vitest/coverage-v8@^4 jsdom@^26 @testing-library/react@^16 @testing-library/dom@^10
npm pkg set "scripts.test=vitest run" "scripts.test:watch=vitest" "scripts.test:coverage=vitest run --coverage" "scripts.check=npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build"
npm run format
npm run check
npm run test:coverage
```

Vitest e seu provedor de cobertura devem resolver para a mesma versão. Preservar e versionar o lockfile. Não executar migrations nem usar credenciais de produção para os testes. Os mocks locais substituem Prisma, bcrypt e dependências selecionadas; não há testes contra um banco real nesta entrega. A cobertura não tem limiar obrigatório inicial. A pasta coverage já é ignorada pelas configurações da Sprint 14.

## Escopo

- Validações Zod, slugs, imagens, origem de SEO e navegação por perfil.
- Handler DELETE de produtos com dependências simuladas.
- Publicação CMS com transação simulada e histórico.
- Códigos de e-mail e tokens de recuperação com persistência simulada.
- Contexto de permissão React com Testing Library e jsdom.

Não comprova atomicidade real, integração com Neon, Cloudinary ou Resend, nem substitui testes E2E. Os testes foram escritos sobre os arquivos disponíveis da Sprint 14 e seus dois hotfixes; a versão local formatada e o lockfile atualizado não foram disponibilizados. A execução das ferramentas depende da instalação local das novas dependências.

## Commit

`test: sprint 14.1 - testes unitarios e integracao com mocks`
