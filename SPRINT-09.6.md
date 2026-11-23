# Sprint 9.6 — Imagens e calendário responsivo

Base: Sprint 9.5.

## Alterações

- Calendário da auditoria: posicionamento calculado a partir do botão e dos limites da janela, com ajuste horizontal e vertical, evitando que o filtro **Até** saia da tela. Recalcula em rolagem e redimensionamento; mantém seleção, limpeza e acessibilidade básica.
- Biblioteca de mídia: interface com gradiente verde, cartões com prévias, busca aprimorada, estados de carregamento/vazio, modal via portal e fechamento por Escape.
- Imagens de produtos e outros formulários que usam `ImageUpload`: área de envio mais personalizada, prévia da imagem selecionada e botão de biblioteca destacado.
- Parcerias: prévia de logotipo ampliada, fundo suave e ações de upload/biblioteca visualmente distintas.
- Corrigida a mensagem inconsistente de limite de upload de 200 KB para 8 MB no componente ImageUpload.
- Diretiva `"use client"` na primeira linha dos arquivos cliente alterados.

## Instalação

```bash
npm install
npx prisma generate --config prisma7.config.ts
npm run build
npm run dev
```

Não há migrations nesta sprint. Preserve o `.env` existente.

## Testes manuais recomendados

1. Em `/admin/auditoria`, abrir os calendários **De** e **Até** em janelas estreitas, especialmente próximo à borda direita; testar rolagem, troca de mês, seleção e limpeza.
2. Em parcerias, enviar logotipo do computador, escolher outro da biblioteca e conferir a prévia.
3. Abrir a biblioteca de mídia, pesquisar, selecionar, fechar por Escape e clicar fora do diálogo.
4. Em produtos, testar upload, prévia, remoção e mensagem de erro para arquivos maiores que 8 MB.
5. Conferir responsividade em celular e desktop.

## Limitações

Não foram realizados testes de build nem testes de integração com o Neon/Cloudinary neste ambiente. O calendário não utiliza biblioteca de terceiros. A ordenação por arrastar e soltar de parcerias permanece como melhoria futura.
