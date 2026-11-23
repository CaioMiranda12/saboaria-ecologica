# Sprint 9.7 — Parcerias e biblioteca de mídia

## Alterações
- Reordenação de parcerias por arrastar e soltar e por botões acessíveis (subir/descer). A ordem é persistida no banco em transação e registrada na auditoria.
- Reordenação desabilitada durante a busca para evitar ambiguidades.
- Novas parcerias são adicionadas ao final da lista automaticamente.
- Seletor de mídia com seleção explícita, confirmação, dimensões, tamanho e data.
- Biblioteca de mídia com cartões verdes, metadados e área de upload personalizada.
- Exclusão permanente de imagens permanece indisponível para evitar referências quebradas.

## Instalação
`npm install`
`npx prisma generate --config prisma7.config.ts`
`npm run build`
`npm run dev`

Sem migrations.

## Testes
1. Arrastar uma parceria para outra posição e atualizar a página para verificar persistência.
2. Usar as setas para reorganizar com teclado.
3. Criar parceria e confirmar que aparece no final.
4. Buscar parceria e verificar que a reordenação fica desabilitada.
5. Selecionar imagem na biblioteca e confirmar com “Usar imagem”.
6. Conferir detalhes e responsividade em telas pequenas.

## Observações
Build e integração com Neon devem ser validados localmente.
