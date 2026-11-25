# Sprint 13.2 — refinamentos de usabilidade

Base: Sprint 13.1. Sem migration, dependências ou variáveis de ambiente novas.

- Layout público com altura mínima de viewport dinâmica, conteúdo flexível e fundo creme. Equipe cresce até o rodapé, inclusive sem registros. O cabeçalho fixo permanece como antes.
- Catálogo: botão nativo sobre toda a área do cartão, com nome acessível e abertura do modal existente por clique, toque, Enter ou Espaço. Sem botões aninhados. O cartão na Home permanece informativo.
- Usuários: cadastro e edição em dialog nativo personalizado, foco inicial no nome, retorno ao acionador, rolagem interna, Escape e Cancelar. Sem fechamento ao clicar fora. Erros de gravação aparecem dentro do modal; durante o envio, fechamento e novo envio são bloqueados. Senha digitada é descartada ao cancelar ou salvar. APIs e permissões existentes preservadas.
- Parcerias e mídia permanecem com edição junto do registro; produtos e equipe administrativa têm páginas próprias. SEO mantém formulário dedicado.

## Validação local

`npm run build` e `npm run dev`. Testar equipe vazia/poucos/muitos integrantes em diferentes alturas; clicar imagem, nome e descrição do produto; abrir por teclado e fechar com Escape; verificar Home; cadastrar/editar usuário, cancelar e reabrir, provocar erro de gravação e verificar mensagem dentro do modal, testar foco e scroll no celular, confirmar bloqueio ao editor. Verificar também as demais páginas públicas e rodapé.

Validação no ambiente de entrega: análise sintática TypeScript/TSX e integridade ZIP; build completo e testes no navegador pendentes (dependências não instaladas).
