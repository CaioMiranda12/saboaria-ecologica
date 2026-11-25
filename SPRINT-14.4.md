# Sprint 14.4 — Preparação para produção

Esta entrega prepara a operação do site sem alterar o código de produção, as dependências, o CI ou o banco de dados. A hospedagem e o domínio ainda precisam ser definidos. Docker e Playwright continuam adiados.

## Instalação reproduzível

Use Node 22.20.0, conforme o CI, e o lockfile versionado. Em uma instalação nova, copie `env.example` para `.env` e preencha os valores. Não substitua um `.env` funcional.

```bash
npx --yes npm@11 ci
npm run db:generate
npm run check
npx --yes npm@11 audit
npm run dev
```

O CI valida formatação, lint, tipos, testes e auditoria. O build continua local porque algumas páginas consultam o banco durante a compilação. Nenhum segredo real deve ser disponibilizado ao CI atual.

## Variáveis de ambiente

| Variável                    | Uso em produção                                                     |
| --------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`              | Conexão Neon do ambiente correto; TLS habilitado                    |
| `JWT_SECRET`                | Chave aleatória exclusiva do ambiente, com pelo menos 32 caracteres |
| `ADMIN_SEED_EMAIL`          | E-mail válido exigido pelo schema atual                             |
| `ADMIN_SEED_PASSWORD`       | Senha forte exigida pelo schema atual; usada pelo seed inicial      |
| `APP_URL`                   | Origem pública HTTPS, sem caminho, query ou fragmento               |
| `CLOUDINARY_CLOUD_NAME`     | Nome da conta de mídia                                              |
| `CLOUDINARY_API_KEY`        | Chave da API de mídia                                               |
| `CLOUDINARY_API_SECRET`     | Segredo da API de mídia                                             |
| `RESEND_API_KEY`            | Chave de envio de e-mails                                           |
| `PASSWORD_RESET_FROM_EMAIL` | Remetente de domínio verificado no Resend                           |

Gere uma chave JWT localmente com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Guarde o resultado em um gerenciador de segredos. Trocar a chave invalida sessões e códigos de verificação pendentes. Não use os exemplos como credenciais reais. Não inclua segredos em variáveis `NEXT_PUBLIC_*`.

O arquivo `env.example` é intencionalmente um modelo sem credenciais reais, separado de `.env`, que permanece ignorado pelo Git. A aplicação ainda exige os dois campos de seed em sua validação de ambiente, mesmo quando não se executa o seed. Não reutilize senhas reais nesses campos se o administrador já existir. O TOTP não é necessário para a autenticação atual por e-mail.

## Banco e recuperação

- Confirme a branch e o banco de destino antes de qualquer operação. Não use `migrate reset`, `db push --force-reset` ou seed de conteúdo em um banco com dados reais.
- Consulte o período de recuperação disponível no plano do Neon e configure a retenção adequada. Como ponto de partida, proponha backup semanal e antes de migrations, com retenção de quatro semanas, ajustada à frequência de alterações.
- Faça uma exportação lógica com `pg_dump` (cliente PostgreSQL instalado, conexão direta, credenciais armazenadas de modo seguro). Exemplo: configure `PGHOST`, `PGUSER`, `PGDATABASE`, `PGSSLMODE=require` e autenticação segura via arquivo de senha protegido, então execute `pg_dump -Fc -f saboaria-backup.dump`. Não coloque senhas no histórico do terminal. Guarde o arquivo criptografado fora do repositório.
- Teste a recuperação em um banco separado e vazio, nunca sobre a produção. Verifique registros, relacionamentos, usuários e acesso ao CMS. Os arquivos de mídia ficam no Cloudinary: o dump contém referências, não as imagens.
- Antes de um deploy com migrations, confira `npx prisma migrate status --config prisma7.config.ts`. Se houver migrations aprovadas pendentes, após backup e conferência do destino, execute `npx prisma migrate deploy --config prisma7.config.ts` uma vez. O deploy normal não deve executar seeds. Em banco novo, inicialize somente os dados necessários após as migrations, revisando os scripts.

Referência: https://neon.com/blog/database-recovery-strategies-to-help-you-sleep-at-night

## Hospedagem e upload

O site usa Next.js com páginas dinâmicas, APIs e autenticação. Não é adequado publicar somente arquivos estáticos. Uma hospedagem Node gerenciada ou Vercel Pro são opções; não há decisão de contratação nesta sprint.

O upload atual recebe multipart na API e aceita PNG, JPEG e WebP de até 8 MiB. A Vercel tem limite padrão de 4,5 MB para o corpo de Functions; há opções de limites maiores em condições específicas. Se escolhida, resolver antes do deploy por compressão/limite coerente na interface e servidor ou upload direto assinado ao Cloudinary. Não depender de uma opção beta sem validar disponibilidade. O Hobby é restrito a uso pessoal não comercial. Para projeto de cliente, avaliar plano comercial. Em hospedagem Node, conferir limites do proxy e do runtime. Não reduzir o limite de upload sem decidir a plataforma.

Referências: https://vercel.com/docs/functions/limitations e https://vercel.com/docs/plans/hobby

## Domínio, e-mail e mídia

- Escolha domínio canônico e configure HTTPS e redirecionamento da variante alternativa. Defina `APP_URL` com a origem definitiva. Não publique ambientes de preview com o domínio canônico de produção sem avaliar indexação e links de e-mail.
- No Resend, verifique domínio/subdomínio de envio usando os registros DNS fornecidos (SPF e DKIM), configure DMARC conforme a política do domínio e substitua o remetente de teste `onboarding@resend.dev` por um endereço verificado. Teste recuperação e código por e-mail com destinatários autorizados.
- No Cloudinary, preserve os assets existentes ou planeje sua migração; a biblioteca grava URLs e identificadores no banco. Não habilite upload não assinado desnecessariamente. Confira cotas, credenciais e política de retenção. Revise backups/exportação de mídia separadamente.

Referência: https://resend.com/docs/dashboard/domains/introduction

## Segurança e operação

Os cookies de autenticação já usam HttpOnly, SameSite Strict e Secure em produção. Verifique esses atributos pelo navegador após o deploy HTTPS. HSTS, CSP, confiança nos cabeçalhos de IP e limites de requisições serão ajustados depois de escolher a plataforma. Não exponha logs com tokens ou credenciais.

Use inicialmente logs de execução, alertas de consumo e painel de disponibilidade da hospedagem e dos serviços. Revise periodicamente a auditoria npm e o override temporário de Effect quando houver uma atualização compatível do Prisma. Defina responsável por renovação de domínio, recuperação de conta e backups.

## Checklist antes de publicar

- [ ] `npm run check` aprovado e GitHub Actions verde.
- [ ] Auditoria npm revisada e build local aprovado.
- [ ] Hospedagem, plano e domínio escolhidos.
- [ ] Variáveis reais cadastradas somente no ambiente privado da hospedagem.
- [ ] Banco de destino conferido, backup realizado e recuperação testada.
- [ ] Migrations pendentes avaliadas; nenhum seed em dados existentes.
- [ ] Upload testado dentro dos limites da plataforma.
- [ ] HTTPS, login, logout, permissões, CMS e e-mails validados no domínio final.
- [ ] Sitemap, robots, canonical e metadados conferidos após definir `APP_URL`.
- [ ] Logs, consumo e recuperação operacional conferidos.

A Sprint 15 fará o deploy, a configuração de domínio, o CD e a validação real. Esta sprint não realiza operações em serviços externos.
