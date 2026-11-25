# Sprint 10.6 — Verificação exclusivamente por e-mail

Substitui TOTP por verificação opcional por e-mail. Ativação e desativação exigem senha atual e código recebido. Login exige senha e código quando ativo. Mantém HMAC, validade de cinco minutos, cinco tentativas por código, intervalo de 60 segundos e revogação de sessões na alteração da configuração.

## Antes de migrar

Faça backup e pare a aplicação. Confirme que todas as contas com TOTP ativo conseguem receber e-mail pelo Resend (em modo de teste, apenas o endereço da conta Resend). Consulte `SELECT email FROM admins WHERE "totpSecret" IS NOT NULL;` se a migration 10.4 já foi aplicada. Se algum usuário não puder receber, não aplique a migration até resolver isso. A migration converte essas contas para e-mail, revoga suas sessões e elimina definitivamente os campos TOTP. As migrations anteriores permanecem intactas. Não há recuperação administrativa nesta entrega.

## Ambiente

Preserve DATABASE_URL, JWT_SECRET e demais configurações. Configure RESEND_API_KEY com sua chave real, PASSWORD_RESET_FROM_EMAIL="Saboaria Ecológica <onboarding@resend.dev>" e APP_URL=http://localhost:3000. O remetente de testes exige destinatário autorizado pelo Resend. Após migrar, TOTP_ENCRYPTION_KEY não é necessária.

## Instalação

npm install
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run build
npm run dev

## Validação manual

Teste login sem verificação, ativação com senha e código, login com código, reenvio após 60 segundos, código incorreto/expirado/reutilizado, desativação com senha e código, auditoria e revogação de sessões. Teste também recuperação de senha e falha do Resend. Não use em produção sem validar build, banco e entrega real de e-mail. A verificação por e-mail não equivale a MFA forte.
