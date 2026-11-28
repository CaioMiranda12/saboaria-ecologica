# Sprint 15.4.1 — Favicon e gerenciamento seguro de mídia

- Substitui `src/app/favicon.ico` por um ícone derivado de `public/logo-2.png`, com transparência e múltiplas resoluções.
- A biblioteca oferece consulta de uso para ADMIN e EDITOR. ADMIN pode remover e trocar imagens sem referências encontradas.
- A API consulta produtos, equipe, parcerias, SEO, conteúdo legado e CMS (rascunhos, publicações e versões históricas). A correspondência conservadora inclui URL e publicId, inclusive URLs transformadas. Pode bloquear falsos positivos. Não inclui referências externas ao banco, código estático ou formulários ainda não salvos.
- Referências encontradas bloqueiam remoção e troca pela biblioteca. Os links apontam para o painel correspondente; conteúdo legado é somente leitura e restrito ao ADMIN. Históricos não são alterados.
- A remoção verifica novamente no servidor, exige ADMIN e grava auditoria na mesma transação da remoção do registro. O binário NÃO é apagado do Cloudinary: URLs externas ou escolhidas em formulários concorrentes continuam funcionando. A consulta não é uma garantia de ausência absoluta de referências; não é limpeza de armazenamento.
- Troca: envia novo arquivo usando a API existente e tenta remover a entrada anterior. Se a segunda etapa falhar, ambas as imagens podem permanecer. Não substitui referências de conteúdo automaticamente.
- Não há alterações de schema, dependências ou variáveis. Execute `npm run format`, `npm run check`, teste manualmente e confira o CI antes de publicar.

## Testes manuais

1. Conferir favicon em janela anônima após deploy.
2. Enviar uma imagem não utilizada, consultar uso, cancelar remoção e confirmar remoção.
3. Vincular outra imagem a produto, tentar removê-la, abrir o link do produto; testar equipe, parceria, SEO e CMS.
4. Publicar e substituir imagem de CMS; conferir que o histórico mantém o bloqueio.
5. Trocar uma imagem sem uso; verificar a nova entrada e a remoção da anterior.
6. Testar como EDITOR e conferir que DELETE direto recebe 403.
7. Conferir auditoria e confirmar que arquivos originais continuam acessíveis no Cloudinary.
