# Sprint 1 — Painel administrativo

## Entregue

- Dashboard `/admin` com atalhos para as funcionalidades existentes.
- Menu lateral com estado recolhido persistido no navegador.
- Navegação móvel acessível no cabeçalho.
- Hub `/admin/paginas` com links para páginas públicas e editores existentes.
- Acesso rápido a "Visualizar site" em nova aba.
- Identificação do administrador e saída disponíveis em desktop e mobile.
- Layout responsivo e estados visuais de foco.

## Escopo e limites

- Os editores visuais de Home, Sobre e Processo ainda **não** existem: são sprints futuras.
- A edição de Contato nesta etapa utiliza o formulário institucional já existente; a integração completa das páginas públicas será tratada nas sprints seguintes.
- Não há alteração de schema, migrations ou variáveis de ambiente nesta sprint.

## Executar

```bash
npm install
npm run dev
```

Acesse `/login` e, após autenticação, `/admin`.

## Verificar

1. Abrir `/admin` e testar todos os atalhos.
2. Abrir `/admin/paginas` e conferir os links para editores e páginas públicas.
3. Testar o menu móvel em uma janela estreita.
4. Recolher o menu no desktop e recarregar a página.
5. Testar "Visualizar site" e "Sair".
