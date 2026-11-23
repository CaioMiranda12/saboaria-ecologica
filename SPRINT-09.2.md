# Sprint 9.2 — Auditoria administrativa avançada

## Entregue
- Interface de auditoria com visual verde suave, filtros por busca, ação, área e datas (America/Fortaleza), paginação no servidor e detalhes por evento.
- Exportação CSV dos eventos filtrados (máximo de 5.000 por exportação).
- Migration aditiva para coluna JSONB `audit_events.changes` e índices de consulta.
- Novos eventos de produtos passam a registrar diferenças de campos em lista segura (sem senhas, tokens ou segredos).
- Eventos anteriores permanecem visíveis, porém sem detalhes de diferenças retroativas.

## Instalação
1. Faça backup do Neon e preserve seu `.env`.
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run build` e `npm run dev`
6. Teste `/admin/auditoria` com uma conta ADMIN.

## Testes recomendados
- Buscar por nome, e-mail e ID; filtrar por ação, área e datas; paginar.
- Editar um produto e verificar o modal de detalhes (antes/depois).
- Confirmar que eventos antigos mostram a mensagem de ausência de diferenças.
- Exportar CSV e conferir caracteres acentuados no Excel.
- Confirmar bloqueio da API para usuário EDITOR.

## Limitações conhecidas
- Diferenças por campo foram implementadas inicialmente para produtos; equipe, parcerias e usuários continuam com eventos sem snapshots.
- O histórico de publicação do CMS permanece separado; a unificação exige normalização dos eventos de publicação/restauração.
- A auditoria não é transacional com todas as operações de negócio: uma falha na gravação do evento após a mutação ainda requer tratamento arquitetural.
- A exportação é limitada a 5.000 eventos por requisição de usuário.
- O modal ainda precisa de teste de acessibilidade completo (armadilha de foco).
- Build e testes reais com Neon não foram executados neste ambiente.
