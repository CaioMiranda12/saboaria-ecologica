# Sprint 9.3 — Experiência administrativa

Base: Sprint 9.2. Sem alterações no schema Prisma e sem migrations.

## Implementado

- Padrões visuais reutilizáveis (`admin-panel`, `admin-table`, `admin-control`, `admin-record-card`, `admin-empty`).
- Tabela de produtos com fundo verde suave, linhas alternadas e hover discreto.
- Cartões da equipe e lista de parcerias com bordas e fundos harmonizados.
- Estados vazios mais orientativos e mensagens de carregamento com `role=status`.
- Breadcrumbs na barra superior para facilitar a navegação.
- Modal de confirmação com fundo suave e borda verde.
- Respeito à preferência por movimento reduzido.

## Validação

Execute `npm install`, `npx prisma generate --config prisma7.config.ts`, `npm run build` e `npm run dev`. Verifique /admin/produtos, /admin/equipe, /admin/parcerias, filtros, exclusões e navegação móvel.

## Limites

Esta é uma etapa incremental de padronização. Não inclui uma prévia lado a lado dos editores, reformulação completa de todos os formulários ou mudanças na lógica de negócio. Não requer migração de banco.
