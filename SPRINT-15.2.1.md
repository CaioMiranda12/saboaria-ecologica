# Sprint 15.2.1 — Sedes e mapa interativo

Atualização incremental sobre a Sprint 15.2 (inclusive correção TS7006 do `CmsVersionPreview`). Não substitua o projeto completo, nem o `.env` real.

## Instalação

1. Extraia o ZIP na raiz da cópia já atualizada com a Sprint 15.2.
2. Instale as dependências e gere o lockfile localmente (registro npm indisponível na preparação deste pacote):

   ```bash
   npx --yes npm@11 install --save-exact leaflet@1.9.4
   npx --yes npm@11 install --save-dev --save-exact @types/leaflet@1.9.21
   ```

3. Faça backup do banco Neon e confirme `DATABASE_URL`. Aplique as migrations e gere o client:

   ```bash
   npx prisma migrate deploy --config prisma7.config.ts
   npm run db:generate
   npm run format
   npm run check
   npx --yes npm@11 audit
   ```

4. Inicie com `npm run dev` e teste `/admin/localizacoes`, `/mapa` e `/contato`.
5. Confira o diff, inclusive package.json e package-lock.json, antes de commitar a Sprint 15.2 e 15.2.1 juntas.

## Cadastro

ADMIN e EDITOR podem criar e editar quantas sedes forem necessárias. Apenas ADMIN pode excluir. As operações são auditadas na mesma transação da alteração. O registro começa oculto por padrão. Não existem tipos nem sede principal. A tabela inicialmente está vazia: os dados ilustrativos antigos não são importados. Confirme endereço, cidade, UF e coordenadas reais; habilite a visibilidade pública somente após conferir.

Selecione o ponto no mapa Leaflet, amplie com os controles e arraste o marcador se necessário. Para buscar endereço, use o link que abre Google Maps em outra aba. No desktop, clique com o botão direito na posição desejada, copie as coordenadas no formato `-3.7319, -38.5267`, cole no campo e clique em Usar coordenadas. O mapa centraliza a posição. Coordenadas são validadas por limites aproximados da área brasileira, não por fronteiras geográficas exatas. O endereço é informado pelo usuário; não existe geocodificação automática nem verificação da correspondência entre endereço e ponto.

Não foi integrada a API pública do Nominatim, em razão de suas restrições de uso. A busca ocorre no Google Maps externo. Não há chave paga. Os tiles padrão são servidos pelo OpenStreetMap, com atribuição, cache normal do navegador e sem pré-carregamento offline. Consulte https://operations.osmfoundation.org/policies/tiles/ e https://operations.osmfoundation.org/policies/nominatim/. O serviço público de tiles não oferece SLA; para produção, monitore o uso e considere um provedor adequado caso o tráfego cresça. É possível alterar `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` (conforme termos do provedor), seguido de novo build. O visitante do mapa interativo carrega tiles de um serviço externo; considere isso na política de privacidade.

## Mapa público

- `/mapa`: zoom, marcadores e agrupamento por proximidade em pixels; hover mostra o nome, clique/toque abre detalhes em modal. Grupos abrem uma lista das sedes próximas, incluindo pontos coincidentes; ao ampliar, grupos são recalculados. A lista pública permite abrir qualquer sede sem depender do mapa.
- `/contato`: SVG estilizado com os mesmos registros publicados; grupos abrem modal. Não há mais endereço fixo separado. Sem registros publicados, há estado vazio.
- Não há rótulos permanentes. O link Google Maps usa as coordenadas armazenadas. Nenhuma sede oculta é enviada ao site público.
- As páginas são dinâmicas, com revalidação após operações administrativas, sem novo deploy para cada cadastro.

## Validação manual

- Criar duas sedes próximas e uma distante; confirmar que permanecem distintas no cadastro e agrupadas quando apropriado no mapa.
- Criar uma sede nas mesmas coordenadas; conferir se ambas aparecem no modal do grupo.
- Conferir posição por seleção direta e por coordenadas copiadas, testar zoom e arrastar.
- Ocultar uma sede e confirmar que não consta nas duas páginas públicas, mesmo após recarregar.
- Editar endereço e coordenadas e conferir o botão Google Maps.
- Entrar como EDITOR, cadastrar e editar, confirmar que não pode excluir. Entrar como ADMIN, excluir registro de teste e conferir auditoria.
- Testar desktop, celular, navegação por teclado e modal; testar ausência de tiles externos e uso da lista/coordenadas.
- Conferir o modal de histórico do CMS e o restante da Sprint 15.2.

## Limites da validação da entrega

Análise sintática dos arquivos TS/TSX afetados e verificações isoladas de coordenadas/agrupamento concluídas. Não foi possível instalar as dependências por falha DNS do npm (`EAI_AGAIN`); ESLint, Typecheck, Vitest, build, migration, comportamento Leaflet no navegador e CI precisam ser executados localmente. Package.json e package-lock.json foram preservados no ZIP para que a instalação local gere ambos de forma consistente.
