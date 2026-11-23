# Sprint 10.1 — Recuperação de senha

## Funcionalidades
- Solicitação de recuperação com resposta neutra para e-mails existentes e inexistentes.
- Link por e-mail Resend, com token aleatório de 32 bytes, somente hash SHA-256 armazenado, expiração de 30 minutos.
- Uso único transacional, invalidação de tokens pendentes e revogação de sessões via `sessionVersion`.
- Limitação de solicitações por e-mail e IP usando `login_attempts` existente. Não confie em `x-real-ip` sem proxy configurado.
- Tela de recuperação e redefinição responsivas, login com opção de visualizar senha.
- Auditoria de redefinição sem gravar token ou senha.

## Configuração
Defina no `.env` (não inclua credenciais no Git):
```
RESEND_API_KEY=re_...
PASSWORD_RESET_FROM_EMAIL=Saboaria Ecológica <acesso@seudominio.com.br>
APP_URL=https://seudominio.com.br
```
Verifique o domínio remetente no Resend e a URL pública em produção. Sem estas variáveis, a recuperação não envia e-mail.

## Implantação
```
npm install
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run build
npm run dev
```

## Testes
1. Solicitar recuperação para e-mail cadastrado e não cadastrado (mesma resposta).
2. Confirmar recebimento do e-mail e abrir link em até 30 minutos.
3. Trocar a senha, tentar reutilizar o mesmo link e confirmar rejeição.
4. Confirmar que sessão antiga perde acesso e novo login funciona.
5. Verificar erro com token inválido/expirado e proteção de múltiplas solicitações.
6. Verificar interface em telas pequenas e a acessibilidade dos botões de senha.

## Limitações
Não foi testado envio real sem credenciais Resend, nem integração com Neon do usuário. O rate limiter por IP depende da configuração de proxy confiável; `unknown` é um fallback conservador. A rotina de limpeza de tokens expirados fica para manutenção futura.
