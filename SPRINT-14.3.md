# Sprint 14.3 — Segurança da aplicação

Atualização incremental baseada no snapshot enviado antes da migração do Zod, com o hotfix Zod 4 aplicado. Não substitui package.json, lockfile, workflow de CI ou configurações Git.

## Alterações

- Cabeçalhos HTTP: nosniff, DENY contra enquadramento, política de referência e permissões restritas de câmera, microfone e localização; remove X-Powered-By. APIs privadas e de autenticação recebem Cache-Control private, no-store; a página de redefinição recebe no-referrer.
- Proxy: bloqueia mutações em APIs administrativas e de autenticação quando Fetch Metadata indica origem externa (inclusive subdomínio). Sem esse cabeçalho, verifica Origin quando presente. Clientes sem ambos os cabeçalhos continuam sujeitos à autenticação e autorização existentes. Não é uma defesa CSRF universal; não substitui cookies SameSite ou controles nos endpoints.
- JWT: restringe algoritmo HS256, exige expiração, emissão e campos de identidade, verifica tipos e versão de sessão. Sessões válidas já emitidas com esses campos continuam compatíveis.
- Sete endpoints de login, produtos, equipe e parcerias tratam JSON inválido como erro de validação HTTP 400, em vez de exceção não tratada.
- Dez novos casos Vitest em dois arquivos, sem acesso ao Neon, Cloudinary ou Resend.

## Validação

Extraia os arquivos na raiz; execute `npm run format`, `npm run check` e `npx --yes npm@11 audit`. Espera-se 44 testes, se os 34 anteriores estiverem presentes. Confira login, logout, recuperação de senha, publicação CMS, upload e edição de produtos/equipe/parcerias. Verifique também acesso de EDITOR e ADMIN e os cabeçalhos na aba Network do navegador. Não execute migrations nem altere o .env.

## Limites e pendências

Esta é uma revisão focalizada, não um pentest. Upload já possui limite por arquivo e assinatura de PNG/JPEG/WebP, mas o corpo multipart é lido antes dessa validação; limites de requisição e rate limiting de borda precisam ser definidos com a hospedagem. O limitador de login depende da confiança em x-real-ip: revisar a infraestrutura antes do deploy. Verificar concorrência na proteção do último ADMIN e atomicidade da auditoria em uma revisão futura. HSTS e CSP abrangente ficam para a preparação de produção, considerando HTTPS, scripts, mapas e imagens de terceiros. Não foram alteradas as políticas de senha nem a revogação das sessões. O override de Effect permanece temporário.

Não foi possível executar a suíte completa sem as dependências locais. Validar no computador e no CI antes de publicar.
