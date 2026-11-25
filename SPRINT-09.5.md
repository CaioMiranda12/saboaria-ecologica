# Sprint 9.5 — Logotipos de parcerias e correção de modais

- Cadastro e edição de parcerias: enviar PNG/JPEG/WebP (até 8 MB) do computador, selecionar da biblioteca existente ou colar URL.
- Prévia do logotipo e opção de remover a imagem.
- Upload reutiliza `/api/admin/upload`, que armazena o arquivo no Cloudinary e registra na biblioteca de mídia.
- Correção do `ConfirmDialog`: renderização via portal no `document.body`, evitando conflitos de empilhamento e recorte visual dentro dos cartões.
- Diretiva `"use client"` mantida na primeira linha dos componentes cliente alterados.
- Sem migration. Preserve `.env` e configure Cloudinary como nas sprints anteriores.

## Testes recomendados

1. Criar parceria enviando imagem local; conferir prévia e logotipo salvo.
2. Criar/editar parceria selecionando imagem da biblioteca.
3. Remover/trocar imagem e salvar; validar a URL.
4. Excluir parceria e conferir modal centralizado, foco, Escape, cancelar e confirmação.
5. Conferir em telas pequenas e validar `npm run build`.
