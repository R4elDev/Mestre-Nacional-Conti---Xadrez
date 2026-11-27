# Playbook de inventário e extração

## 1. Inventário
1. `curl -sL URL` — se o HTML tem `<app-root>` vazio / bundles `main-*.js`, é SPA (JS).
2. Liste o menu (`a[href]` do `nav`), âncoras (`#...`), `robots.txt`, `sitemap.xml`, `favicon`.
3. Para SPA em hospedagem estática (GitHub Pages), teste acesso direto a uma rota: se der **404**, a navegação só funciona clicando (client-side). Registre isso em `site.render`.
4. Registre cada rota em `pages[]` antes de extrair.

## 2. Extração (por rota)
```
maestri portal create https://site "Fonte"
maestri portal evaluate "Fonte" "$(cat scripts/extract-page.js)" > raw/home.json
maestri portal evaluate "Fonte" "document.querySelector('a[href=\"/rota\"]').click()"
maestri portal evaluate "Fonte" "$(cat scripts/extract-page.js)" > raw/rota.json
```
- Salve os brutos fora do repo (ou em `content/raw/`) para a Lupa conferir.
- Monte cada `section` na **ordem do DOM**. Use `headings` + `text` do bruto; copie texto sem editar.
- Interações: abra abas/accordions/lightboxes e reextraia. Role a página (lazy-load).
- Valide visualmente com `maestri portal screenshot` quando a ordem de um bloco for duvidosa → TODO-confirmar.

## 3. Contatos e redes
Procure `tel:`, `mailto:`, `wa.me`/`api.whatsapp.com`, Instagram/YouTube etc. (o `extract-page.js` já lista). Menção textual a "WhatsApp" sem link **não** é contato: `contacts.whatsapp = null` + TODO.

## 4. SEO
`title`, `meta[name=description]`, `og:*`, `canonical`, `lang`, JSON-LD, favicon. Não preencher o que não existe.

## 5. Assets
`download-assets.mjs` em diretório novo; confira `manifest.json` (sha256, bytes). Nunca abra/execute o que foi baixado a partir da pasta baixada. SVGs: sanitizar.

## 6. Autoavaliação antes de entregar
Rode `verify-parity.mjs` do conteúdo extraído contra o **próprio site** (dump): deve dar 0 falhas — prova que o `content.json` está completo.
