# Sprint 6 — Biblioteca de mídia

## Novidades

- `/admin/midia`: upload por clique ou arrastar e soltar, busca, visualização, cópia de URL e edição de texto alternativo.
- Upload autenticado, validação de assinatura PNG/JPEG/WebP, limite de 8 MB e armazenamento no Cloudinary.
- Arquivos registrados no Neon em `media_assets` para reutilização.
- Componente de upload existente agora oferece botão **Escolher da biblioteca**, usado nos formulários que já utilizavam `ImageUpload`.
- Sem exclusão de arquivos nesta versão para não quebrar referências públicas.

## Atualização

1. Preserve o `.env` ou `.env.local` e suas credenciais do Neon e Cloudinary.
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run dev`
6. Abra `/admin/midia` e envie uma imagem; em seguida teste a seleção num formulário de produto.

## Observações

- Imagens enviadas antes da Sprint 6 continuam funcionando, mas não aparecem automaticamente na biblioteca: somente novos uploads são registrados.
- Os campos de imagem que ainda são URLs simples serão integrados ao seletor em etapas posteriores.
- O Cloudinary deve ter `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` configurados.
- Teste `npm run build` antes de publicar. O serviço Neon/Cloudinary real não pode ser validado sem credenciais.

## Commit

`feat(media): sprint 06 - biblioteca de imagens`
