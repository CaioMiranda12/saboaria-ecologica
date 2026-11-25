# Sprint 13 — Hotfix de build

- React Hook Form: entrada z.input e saída validada nos três formulários, preservando defaults Zod.
- Equipe: normaliza imageUrl nulo ao editar.
- Next.js: proxy substitui middleware com a mesma lógica e matcher; turbopack.root usa diretório de execução (executar npm na raiz).
- tests/totp.test.ts não existe no ZIP base; se sobrou na cópia local, remover manualmente (TOTP descontinuado na Sprint 10.6).
- Sem migration ou dependências novas. Build completo precisa ser executado no ambiente local.
