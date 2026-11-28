# Sprint 15.2 — Ajustes antes do primeiro deploy

O primeiro deploy foi adiado para incorporar as novas funcionalidades. Esta entrega mantém os ajustes da Sprint 15.1 para a Vercel, sem novas dependências.

- `/mapa`: mapa responsivo com rótulos permanentes e cartões com descrições. Os pontos vêm de `src/data/localizacoes.ts`, que já contém dados ilustrativos (mock). Confirme as cidades e descrições reais antes de divulgar o site; a página avisa sobre os dados ilustrativos. O mapa de Contato também usa os novos rótulos e direciona para a página exclusiva.
- `/parcerias`: lista dinâmica do cadastro existente no banco, com logos, fallback e ordem administrativa. Sobre nós mantém uma amostra de até seis parceiros e link para a lista completa.
- As duas rotas entram no menu público, na configuração de SEO e no sitemap, respeitando `ALLOW_INDEXING` e os bloqueios da demonstração.
- Produtos: campo opcional `purchaseUrl` (HTTPS absoluto sem credenciais). ADMIN e EDITOR podem salvar ou limpar no formulário. O botão Comprar abre o endereço em outra aba, ao lado do WhatsApp. URLs vazias não exibem botão; o catálogo é revalidado após salvar. O campo também entra na auditoria de produtos.
- CMS: Restaurar rascunho abre um modal com conteúdo da versão, imagens compatíveis, campos, seções habilitadas/desabilitadas, data e responsável. A prévia é de conteúdo por seção, não uma reprodução integral do site. O GET da versão exige sessão, restringe a versão ao slug solicitado e não grava dados. Só a confirmação chama a restauração existente; publicar continua separado. Se a prévia falhar, o botão fica desabilitado.

## Aplicação local

1. Faça backup do banco Neon e confira a URL do ambiente correto (não compartilhe credenciais).
2. Extraia a atualização sobre o projeto da Sprint 15.1.
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npm run db:generate`
5. `npm run format`
6. `npm run check`
7. `npx --yes npm@11 audit`
8. `npm run dev`

A migration adiciona uma coluna nullable `purchaseUrl` a `products`. Produtos existentes continuam sem botão Comprar. Não execute seeds, reset de banco ou migrations em ambiente de produção sem revisar o destino.

## Testes manuais

- Navegue para Mapa e Parcerias em desktop e mobile; confirme os rótulos e dados.
- Cadastre ou reordene uma parceria no painel, recarregue a página pública e confira o resultado.
- Edite um produto como ADMIN e como EDITOR: salve um link HTTPS válido, abra o modal público e clique em Comprar; limpe o campo e confirme a ocultação. Teste URL inválida.
- Em Páginas, selecione uma versão antiga: confira conteúdo, imagens, seções e autoria; cancele e confirme que nada mudou. Abra novamente, confirme a restauração e confira o rascunho. O site público só muda após publicar. Teste também as restrições existentes para alterações não salvas.
- Confirme `robots.txt` e `sitemap.xml` em modo de demonstração e o CI após o push.

## Commit

`feat: sprint 15.2 - mapa, parcerias, links de compra e previa do historico`

## Limites

Sem novas dependências. A formatação, execução do Vitest, lint, typecheck, migration e build precisam ser validados localmente. O mapa não ganhou um novo editor administrativo, pois isso não foi solicitado. A prévia usa os dados históricos salvos, não a aparência exata de uma antiga versão do código ou imagens que tenham sido removidas do armazenamento.
