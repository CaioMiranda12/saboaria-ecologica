# Sprint 11.1 — Permissões e conteúdo público

Base: Sprint 11. Sem migration, dependências ou variáveis novas.

O layout privado fornece o perfil consultado no servidor ao contexto AdminPermissions. Produtos, equipe e parcerias ocultam exclusão e bloqueiam seus handlers para EDITOR. As APIs DELETE continuam exigindo ADMIN. Edição, publicação, ordenação e remoção de imagens de formulários continuam permitidas conforme as APIs existentes (não são exclusão de registros).

/equipe e /sobre consultam os serviços existentes de equipe e parcerias, respectivamente, em cada requisição. Respeitam a ordem cadastrada, mostram fotos/logotipos quando presentes e exibem estado vazio sem retornar às listas fixas. Os modelos não têm status de publicação: alterações nesses cadastros aparecem diretamente no site. Não há importação automática dos registros estáticos antigos.

Validação local: npm install; npx prisma generate --config prisma7.config.ts; npm run build; npm run dev. Testar ADMIN e EDITOR nas três listas, inclusive DELETE direto como EDITOR (403). Criar/editar/reordenar registros e conferir /equipe e /sobre; testar ausência de imagem e lista vazia em banco de teste. Verificar login e sidebar. Build e integração com Neon não executados neste ambiente.
