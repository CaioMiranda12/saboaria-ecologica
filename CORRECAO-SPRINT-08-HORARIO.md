# Correção da Sprint 8 — horário da auditoria

A página `/admin/auditoria` agora exibe as datas em português brasileiro e no fuso `America/Fortaleza` (UTC−3), sem alterar o armazenamento UTC do PostgreSQL/Neon.

## Instalação

Substitua os arquivos do projeto pela versão deste ZIP, preservando seu `.env`. Não é necessário executar migrations. Rode `npm run build` e `npm run dev` para verificar a alteração.

## Commit sugerido

`fix(auditoria): exibir datas no horario de Brasilia`
