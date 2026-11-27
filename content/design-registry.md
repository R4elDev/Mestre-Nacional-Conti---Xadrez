# Registro de design — isabellaconti.com.br (original)
Capturado em 2026-11-26. Somente observacoes confirmadas; o resto e TODO para o time de design (Prisma/Torre).

- Tipografia: corpo `Inter, "Segoe UI", sans-serif`; titulos `"Playfair Display", Georgia, serif`.
- Marca: texto "♟️" na navbar (decoracao/logo textual).
- Navbar: Home, Mentoria, Aula individual, Cursos gravados, Sobre mim.
- Decoracao (nao e conteudo): "✓" nos bullets da mentoria; "🔍 Clique para ampliar" (lightbox) nas imagens.
- TODO: paleta de cores, espacamentos, animacoes, breakpoints (capturar com getComputedStyle/screenshot).

## Confirmado pela Lupa (2026-11-26)
- /aula-individual, card de oferta (ordem visual): kicker "Uma sessão, um próximo passo claro." -> preço R$120 "/ aula" -> h2 "O que você leva da aula" -> 5 bullets (o "60 minutos..." abre a lista) -> botão "Quero organizar meu treino" -> nota "Preencha o formulário..." (no DOM vem depois do botão).
- Lightbox (/mentoria 2 figuras, /aula-individual 1): role=dialog aria-modal, título (id preview-title) = legenda, botão "Fechar modal". BUG do original: Esc fecha mas o foco vai para BODY — no remake devolver foco ao gatilho.
- Links externos: target=_blank rel="noopener noreferrer".
- "✓" dos bullets e "🔍" do "Clique para ampliar" estão no DOM: no remake usar aria-hidden.
- Avatar alt original "Isabella" (verbatim); remake pode melhorar alt só com aprovação do cliente.
- Rota /cursos-avulsos existe no bundle e redireciona para /cursos-gravados (fora do menu).
- Sem rodapé, sem contato/WhatsApp link, sem redes além do YouTube.
