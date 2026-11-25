# Sprint 11 — Dashboard e navegação por perfil

Base: Sprint 10.6. Sem alteração de schema, migration, dependências ou variáveis de ambiente.

- Indicadores atuais consultados no Neon a cada carregamento; filtros de 7, 15, 30 e 90 dias afetam atividades e histórico recente, não totais atuais.
- Gráficos em CSS, sem biblioteca adicional; valores diários acessíveis em lista. Dias no horário de Fortaleza.
- Editor vê somente suas atividades; indicadores de contas e segurança consultados apenas para ADMIN. Menus desktop e móvel filtrados pelo perfil consultado no servidor. Rotas e APIs administrativas existentes mantêm seus controles.
- Produtos classificados por publicação; parcerias não possuem campo ativo/inativo. Arquivo legado continua fora da navegação conforme sprint 9.8.
- Pendências de páginas apontam para edição; demais apontam para módulo correspondente. Comparação de conteúdo normaliza chaves JSON.

## Validação local
Preservar .env. Executar npm install, npx prisma generate --config prisma7.config.ts, npm run build, npm run dev. Não há migration nova.
Testar ADMIN e EDITOR, desktop e mobile, acesso direto a /admin/usuarios e /admin/auditoria e APIs correspondentes (403 para editor), contagens, publicação, pendências, filtros e dias sem eventos. Verificar que atividades de outro usuário não aparecem ao editor. Testar banco vazio e falha de consulta.

Validação nesta entrega: transpile sintático dos oito arquivos alterados/criados; build, checagem de tipos com dependências e integração Neon não executados. Não há atualização automática em segundo plano; recarregar ou navegar para consultar dados atuais.
