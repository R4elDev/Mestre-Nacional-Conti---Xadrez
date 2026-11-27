# Esquema do content.json (v1.0)

Chaves com prefixo `_` (`_todo`, `_aviso`) são notas e não são conteúdo. Campo ausente no site = `null` (ou `[]`) + `TODO-confirmar`.

## Raiz
| campo | tipo | nota |
|---|---|---|
| `$schema_version` | string | "1.0" |
| `site` | obj | `url`, `captured_at`, `render` (estático/spa), `lang_declared`, `lang_content`, `brand{name,logo_text,logo_href}` |
| `seo` | obj | `title`, `meta_description`, `og{}`, `canonical`, `favicon`, `robots`, `jsonld[]`, `_todo[]` |
| `nav` | array | `{label, href, page}` na ordem do menu |
| `pages` | array | ver abaixo |
| `contacts` | obj | `whatsapp`, `email`, `phone`, `address` (strings exatas ou null) |
| `social` | array | `{network,label,url}` |
| `testimonials` | array | `{quote, author, role, image}` verbatim |
| `faq` | array | `{question, answer}` verbatim |
| `footer` | obj/null | `{texts[], links[], copyright}` |
| `external_links` | array | todas as URLs externas (usado pelo verificador) |
| `assets` | array | `{src,url,kind,local,sha256}` |
| `todo` | array | pendências globais |

## page
`{ id, path, title, sections[] }` — `path` exatamente como no site (`/`, `/about`).

## section
`{ id, order, type, heading{level,text}, texts[], bullets[], ctas[], cards[], steps[], images[], videos[], subsections[], price{}, items[], _todo[] }`
- `order`: posição na página (1..n), igual à ordem visual.
- `type` livre mas padronizado: `hero | cards | pricing | steps | gallery | text | list | cta-band | about | links | faq | testimonials | footer`.
- `texts[]`: parágrafos verbatim, em ordem. `bullets[]`: itens de lista (sem marcador decorativo).
- `ctas[]`: `{label, url, external, target}`; URL exata (query strings inclusas).
- `cards[]`: `{tag?, title, title_level, text, for_you?, cta}`.
- `steps[]`: `{n, title, title_level, text}`.
- `images[]`: `{src, alt, caption?, zoomable?}` — `alt` verbatim (mesmo curto; sugestão de melhoria vai em `_todo`).
- `videos[]`: `{src, provider, title, poster}`.
- `price`: `{display (verbatim), currency, amount, period_display}`.
- `subsections[]`: `{heading{level,text}, texts[]}`.

## Verbatim
Preservar acentos, pontuação, maiúsculas, emojis e símbolos (`→`, `🔍`). Não "corrigir" ortografia: se achar erro, anote em `_todo`.
