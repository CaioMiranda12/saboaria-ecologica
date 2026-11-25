# Sprint 14 — Qualidade de código

Base: Sprint 13.2. Docker, testes e CI ficam para etapas posteriores.

## Primeira instalação (obrigatória)

Use Node 22 LTS (>=22.12) ou Node 24 LTS. Preserve o `.env` e execute na raiz:

```bash
npm install
npm run db:generate
npm run format
npm run lint:fix
npm run format
npm run check
```

O registry npm não estava acessível no ambiente de preparação desta entrega (EAI_AGAIN). O package.json declara as novas ferramentas, mas o package-lock.json original foi preservado: `npm install` deve regenerá-lo antes de usar `npm ci`. A formatação, lint, typecheck e build ainda não foram executados. Não considere a sprint validada até todos passarem. Não desative regras globalmente para esconder problemas; revise cada diagnóstico. O lint pode emitir avisos sobre imagens HTML nativas usadas intencionalmente no componente PublicImage, que devem ser avaliados no contexto da otimização existente.

## Comandos

- `npm run format`: aplica Prettier, incluindo classes Tailwind.
- `npm run format:check`: verifica formatação sem gravar arquivos.
- `npm run lint`: ESLint com regras Next Core Web Vitals e TypeScript.
- `npm run lint:fix`: aplica correções automáticas disponíveis.
- `npm run typecheck`: gera tipos de rotas do Next e executa TypeScript sem emitir JS.
- `npm run db:generate`: gera Prisma Client (requer DATABASE_URL conforme configuração existente).
- `npm run check`: executa format:check, lint, typecheck e build em sequência.

Revise `git diff` antes de confirmar alterações automáticas. Inclua o lockfile atualizado no commit. Nenhuma migration ou alteração de regra de negócio nesta entrega. O Prettier ignora assets, migrations e arquivos gerados. A política de lint inicialmente utiliza as regras recomendadas do Next sem supressões adicionais.
