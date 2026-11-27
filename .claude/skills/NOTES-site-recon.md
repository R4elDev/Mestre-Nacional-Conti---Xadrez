# Recon: isabellaconti.com.br (feito em 2026-11-26 por Lupa)

## 1. Origem do conteúdo
- **SPA Angular 100% client-side (CSR).** HTML bruto tem só `<app-root></app-root>` (12 KB); **zero texto de conteúdo no HTML**. Sem SSR/prerender.
- Hospedagem: GitHub Pages (Fastly). Deep links (`/mentoria`, etc.) respondem **HTTP 404** (página "Page not found" do GitHub) -> no remake, usar HTML estático por página ou hash/`404.html` com fallback; **não depender de JS para o conteúdo** (SEO/AA).
- `<html lang="en">` mas conteúdo é pt-BR -> **bug**: remake deve usar `lang="pt-BR"`. `<title>` único "Treinamento de Xadrez" para todas as rotas; sem meta description/OG; sem robots.txt/sitemap (404).
- Conteúdo extraído do bundle `main-*.js` (300 KB, texto em arrays/templates) — ver seção 5.

## 2. Libs / animações
- Angular (standalone components, Router, HttpClient) + RxJS + zone.js. **Nenhuma** lib de animação (sem GSAP/AOS/Swiper/Lottie/Three).
- Sem `@keyframes`, sem IntersectionObserver, sem scroll-behavior. Só **`transition`/`transform` CSS** (hover/modal) e `backdrop-filter` (4x, header/modal).
- Fontes: Google Fonts auto-hospedadas pelo Angular (woff2 em fonts.gstatic): **Inter 400/500/600/700** e **Playfair Display 600/700**, `font-display:swap`. CSS crítico inline + styles.css carregado com `media=print onload`.
- Pagamentos: links externos **Kiwify**; contato: **Google Forms**; aulas via Google Meet + Lichess (texto).
- Breakpoints: 900px, 768px, 760px (max-width).

## 3. Design tokens (do CSS inline)
bg `#121212`, bg-medium `#1e1e1e`, surface `#161413`, mahogany `#2a1e1c`, texto `#f5f5f0`, muted `#c8c1b8`, gold-muted `#c8aa6e`, **gold `#d4af37`**, gold-hover `#e2bd4b`, borda gold `rgba(212,175,55,.42)`, borda sutil `#3a2e2a`. Container 1120px, gutter 24px, radius card 16 / controle 10. Focus ring `0 0 0 3px rgba(212,175,55,.36)`. Display: Playfair; corpo: Inter.

## 4. A11y / performance — o que EVITAR no remake
Acertos do original (manter): `aria-labelledby` por seção, `aria-label` no nav/menu, `aria-expanded` no hambúrguer, modal com `role=dialog aria-modal aria-labelledby`, botão "Fechar modal", `:focus-visible`, `loading=lazy`, `alt` nas imagens.
Problemas (corrigir):
1. `lang="en"` em conteúdo pt-BR (falha WCAG 3.1.1).
2. Conteúdo só via JS; deep links 404; título/meta iguais em toda rota.
3. **Nenhum `prefers-reduced-motion`** (WCAG 2.3.3/boas práticas) — incluir `@media (prefers-reduced-motion: reduce)`.
4. Imagens pesadas: `plataforma.png` **721 KB**, `cronograma.png` **279 KB**, avatar JPEG 99 KB, sem `width/height` (CLS) -> converter p/ WebP/AVIF, definir dimensões, `srcset`.
5. Elementos `role="button"` + `tabindex=0` em não-botões (6x): usar `<button>` nativo; confirmar Enter/Espaço. Modal: precisa **focus trap, Esc, devolver foco** ao gatilho.
6. Emoji "🔍 Clique para ampliar" lido por leitores de tela -> `aria-hidden` no emoji.
7. Contraste: ouro `#d4af37` sobre `#121212` ≈ 8:1 OK; **`#c8aa6e`/muted sobre `#2a1e1c` verificar** (>=4.5:1 p/ texto normal); texto em botão dourado deve ser escuro, não branco.
8. Links externos Kiwify/Forms: abrir com `rel="noopener noreferrer"`; avisar "abre em nova aba" se `target=_blank`.
9. Alvos de toque >= 44px (WCAG 2.5.8 mínimo 24px); header com `backdrop-filter` precisa fallback de fundo sólido.

## 5. Inventário de conteúdo (paridade)
Rotas: `/` (home), `/about`, `/mentoria`, `/aula-individual`, `/cursos-gravados` (+ `/cursos-avulsos`), `/posts`, `/posts/:slug`.
- **Home:** "Um próximo passo claro para o seu xadrez." / "Escolha entre acompanhamento contínuo, uma aula sob medida ou materiais gravados para estudar no seu ritmo." / "Três formas de estudar com mais direção." / "Cada formato responde a um momento diferente do seu treino." Cards: Mentoria em turma, Aula individual, Cursos gravados (cada um com summary + "fit" + CTA: "Conhecer a mentoria", "Organizar minha aula", "Explorar cursos").
- **About:** "Olá, eu sou Isabella Conti" — "Treinadora e enxadrista focada em desenvolvimento com método e consistência." Olimpíada pelo Brasil 2020 e 2021; campeã brasileira universitária 2023; nº 6 do Brasil; rating FIDE 2021. Foto `assets/images/isabella-avatar.jpeg`. Seção "O que você encontra por aqui" + "Voltar para os treinamentos →".
- **Mentoria (turma):** "Pare de estudar sem direção e comece a treinar de verdade." Itens: diagnóstico individual 15 min; cronograma personalizado; aulas ao vivo semanais de 1h30; grupo exclusivo WhatsApp; área de membros com gravações. Planos: **Mensal R$ 280/mês** (kiwify HrTQS6u), **Semestral R$ 240/mês** (kiwify SPymlHQ). Imagens: cronograma.png ("Exemplo de cronograma da mentoria"), plataforma.png ("Exemplo da plataforma da mentoria") com modal de ampliar.
- **Aula individual:** **R$ 120/aula**; 60 min de conversa, análise e treino; diagnóstico do momento + plano; cronograma; materiais exclusivos; Google Meet + Lichess; acesso 24h. CTA "Quero organizar meu treino" -> Google Forms ("Preencha o formulário para contar um pouco sobre você..."). Seção "Seu estudo organizado e disponível 24h por dia" (Lichess). 4 passos de sessão: conversar sobre rotina/objetivos; observar padrões; escolher o que trabalhar; organizar caminho de estudo.
- **Cursos gravados (4, links Kiwify):** Estratégias com base no livro do Seirawan (TFX8bpV); Gambito da Dama Aceito com MN Conti (gTK6vfU); Ebook de análise de partidas (19ydgQG); 5 segredos para evoluir no xadrez (TBjMKxi). Cada um tem kicker (Estratégia/Abertura/Análise/Treino), benefit, fit, cta.
- **Posts:** ao menos 1 ("5 segredos para evoluir no xadrez"); conteúdo completo dos posts não foi extraído (rodar extração dedicada se necessário).
- Menu: botão "Abrir menu de navegação".

> Ressalva: textos vêm de strings do bundle; renderização visual (ordem exata, microcopy de botões/rodapé) deve ser conferida num browser real. Itens de preço/links acima são os do bundle de 2026-11-26.
