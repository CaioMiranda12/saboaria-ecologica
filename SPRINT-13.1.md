# Sprint 13.1 — Responsividade e experiência do usuário

Base: Sprint 13 hotfix build. Sem migration, dependências ou variáveis novas.

- Navegação pública e administrativa compacta abaixo de 1024px; menus com rolagem e Escape.
- Sidebar usa altura dinâmica; conteúdo administrativo com espaçamento menor e link de salto.
- Tabelas de produtos, usuários e auditoria e gráfico com regiões de rolagem focáveis.
- Biblioteca, confirmação e filtros com altura limitada à viewport; SEO com ações empilhadas em celulares.
- Ajustes de espaçamento nas páginas públicas e quebra de textos longos.
- Nenhuma mudança de autorização ou regras de negócio.

## Validação local

npm install; npx prisma generate --config prisma7.config.ts; npm run build; npm run dev.
Testar 320, 375, 768, 1024 e 1440px, orientação horizontal, teclado, ADMIN/EDITOR, upload e seleção de mídia, tabelas e menus. Verificar ausência de rolagem horizontal da página e rolagem interna das tabelas. Build e testes visuais não executados neste ambiente.
