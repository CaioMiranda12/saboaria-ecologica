# Sprint 10.2 — Login dividido e saída da conta

- Login responsivo em duas colunas: fotografia local `public/hero.jpg` à esquerda em telas grandes e formulário à direita.
- No celular, o formulário ocupa toda a tela, sem imagem decorativa.
- Campos personalizados, mostrar/ocultar senha, recuperação de senha e estados de erro/carregamento.
- Sidebar: botão **Sair da conta** destacado, com ícone e acessibilidade ao recolher o menu.
- Menu móvel: ação de saída destacada.
- Reutiliza a server action de logout existente, que remove o cookie de sessão e redireciona para `/login`.
- Sem migrations e sem novas dependências.

## Verificação

1. `npm install`
2. `npx prisma generate --config prisma7.config.ts`
3. `npm run build`
4. `npm run dev`
5. Conferir `/login` no desktop e celular; login, senha visível, link de recuperação, saída no menu aberto/recolhido e no celular.

Commit: `feat(admin): sprint 10.2 - login dividido e logout no menu`
