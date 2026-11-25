# Sprint 10.4 — 2FA opcional

Configuração manual TOTP (sem QR Code nesta entrega), SHA-1, 6 dígitos, 30 segundos. Dez códigos de recuperação de uso único. A senha continua necessária. Ativação/desativação revogam sessões. Preserve a chave de criptografia em backup seguro. Não há recuperação administrativa do 2FA nesta versão: perda do autenticador e dos códigos exige intervenção operacional no banco. Redefinir senha não desativa 2FA.

Gere TOTP_ENCRYPTION_KEY com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e configure no .env. Não compartilhe a chave. Faça backup do Neon, npm install, npx prisma migrate deploy --config prisma7.config.ts, npx prisma generate --config prisma7.config.ts, npm run build, npm run dev.

Teste local: ativar em conta de teste, guardar códigos, entrar com senha e código novo, rejeitar código repetido, usar código de recuperação e rejeitar reutilização, desativar com senha e código novo. Verificar auditoria e revogação de sessões. Testes unitários: node --experimental-strip-types --test tests/totp.test.ts (Node 22). Build e integração não verificados neste ambiente. Revisar proteção de login existente e concorrência antes de produção.
