# Sprint 12 — SEO

Módulo /admin/seo exclusivo ADMIN, com autorização na página e API PUT. Metadados individuais para seis páginas públicas, valores padrão sem registros, título, descrição, URL HTTPS opcional de imagem, Open Graph e Twitter. Alterações entram em vigor ao salvar e invalidar a rota; não fazem parte dos rascunhos CMS. Auditoria e gravação na mesma transação. Sem novas dependências ou variáveis. Imagem por URL pública, sem upload integrado nesta entrega. Sitemap, robots e canonical ficam para 12.1.

## Instalação
Preserve .env, faça backup, npm install, npx prisma migrate deploy --config prisma7.config.ts, npx prisma generate --config prisma7.config.ts, npm run build, npm run dev.

## Testes manuais
ADMIN salva título/descrição e imagem em cada página; inspecione HTML/metadados públicos após salvar. EDITOR não vê SEO e recebe 403 na API. Teste URL inválida, título vazio, persistência e auditoria. Confirme que páginas sem configuração mantêm os valores padrão. Sem teste de integração com Neon neste ambiente.
