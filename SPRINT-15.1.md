# Sprint 15.1 — Adequação à Vercel

## Alterações

- `vercel.json`: instalação com npm 11 e lockfile; geração do Prisma Client antes do build. Não executa migrations nem seeds.
- Upload: limite uniforme de 4 MiB (4.194.304 bytes), com margem para multipart diante do limite padrão de 4,5 MB da Vercel. Imagens existentes e seleção pela biblioteca permanecem intactas. Arquivos maiores precisam ser redimensionados antes do envio; não há compressão automática no navegador.
- Indexação: `ALLOW_INDEXING=false` por padrão. `true` só habilita o SEO indexável com `APP_URL` HTTPS válido, fora de localhost, de `*.vercel.app` e de previews da Vercel. Sitemap vazio e robots bloqueado quando desabilitado; metadados e cabeçalhos noindex como defesa complementar. Isso não torna o site privado nem garante remoção de URLs já indexadas.
- Segurança: preservados CSRF, cookies seguros em produção, permissões e autenticação. Rotas administrativas e de autenticação recebem noindex também na produção definitiva.
- Cinco casos adicionais de teste para indexação e limite de mídia.

## Validação local

Mantenha seu `.env` atual. Opcionalmente, acrescente `ALLOW_INDEXING="false"`.

```bash
npm run format
npm run check
npx --yes npm@11 audit
```

Teste upload de PNG/JPEG/WebP pequeno e rejeição de imagem maior que 4 MiB nos módulos Mídia, Produtos, Equipe, Parcerias, CMS e SEO. Confira que selecionar imagem já existente funciona. Verifique login, publicação CMS e páginas públicas. Confira `/robots.txt`, `/sitemap.xml` e o cabeçalho `X-Robots-Tag`.

Não há novas dependências nem mudanças no lockfile ou schema Prisma. O CI permanece como antes. A geração do Prisma é feita no build da Vercel; localmente não é necessária se o client já estiver gerado.

## Primeiro deploy (próxima etapa)

- Importar o repositório pelo painel Vercel, framework Next.js, branch `master`, Node.js 22.x. Manter os comandos de instalação e build do `vercel.json` e saída padrão.
- Usar plano permitido para o uso comercial do cliente (Pro trial se elegível; Hobby não é destinado a uso comercial).
- Configurar variáveis de ambiente antes do primeiro deploy: DATABASE_URL, JWT_SECRET (secreto exclusivo e aleatório, mínimo 32 caracteres), ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD (valores exclusivos exigidos pela validação atual, não executam seed), APP_URL (URL HTTPS exata da demonstração), CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, RESEND_API_KEY, PASSWORD_RESET_FROM_EMAIL e ALLOW_INDEXING=false.
- O build lê dados do Neon para páginas estáticas e metadados. A conexão e as migrations existentes precisam estar prontas. Não executar migrations/seed automaticamente. Preferir dados de demonstração sem informações pessoais/reais; não conectar previews ao banco real. Se previews forem necessários, usar banco isolado e credenciais próprias ou restringir a criação deles.
- Manter variáveis de sistema da Vercel disponíveis para reconhecer `VERCEL_ENV`. Usar ambiente Production para o primeiro deploy de demonstração. Se o nome final do endereço mudar, ajustar APP_URL e redeploy.
- Resend com remetente de teste continua restrito aos destinatários autorizados pelo serviço. Não prometer recuperação de senha ou verificação por e-mail para o cliente antes da verificação de domínio.
- O CD por integração Git não garante, sozinho, que o CI terminou com sucesso antes de publicar. Definir a estratégia de proteção/promoção depois do primeiro deploy.

## Produção definitiva

Configurar domínio próprio e HTTPS; ajustar APP_URL; verificar domínio de envio no Resend; validar site e segurança; só então definir ALLOW_INDEXING=true e redeploy. Verificar sitemap e Search Console. O domínio vercel.app continua fora da indexação quando usado como APP_URL; configurar redirecionamento do endereço de demonstração para o definitivo na etapa de domínio.
