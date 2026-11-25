# Sprint 12.1 — SEO avançado e mídia
- SEO utiliza upload existente (Cloudinary + media_assets) e MediaPicker. Remover associação não exclui arquivo. Upload é imediato; associação exige salvar SEO. URLs existentes preservadas.
- Sitemap e robots via MetadataRoute, URLs canônicas e Open Graph URL via APP_URL. Sem origem HTTPS pública válida, sitemap vazio e indexação desabilitada. Configure APP_URL com domínio definitivo na produção. Não use domínio de homologação HTTPS como APP_URL se não quiser indexação.
- Sem migration, dependências ou variáveis novas. Preserve .env.
- Teste upload PNG/JPEG/WebP até 8 MB, biblioteca, troca de página, salvar, remoção e persistência; confira /robots.txt, /sitemap.xml e HTML com APP_URL de produção em ambiente controlado. Confirme acesso ADMIN e bloqueio EDITOR.
- Não foi executado build completo nem integração com Neon/Cloudinary.
