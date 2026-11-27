# Tokens e formas

A [home de Isabella Conti](https://isabellaconti.com.br/) combina títulos serifados amplos, corpo sem serifa, fundo escuro e um CTA dourado. Use essa hierarquia editorial como referência para a paleta morna e a composição geométrica.

A folha [warm.css](../assets/warm.css) é o contrato de integração. O tema segue o sistema por padrão. Para controlar o tema, use `data-theme="light"` ou `data-theme="dark"` no elemento raiz.

Use `--fw-surface`, `--fw-text` e `--fw-muted` para superfícies e texto. Use `--fw-accent` e `--fw-on-accent` em conjunto para ações. Use `--fw-focus` contra a superfície, com contorno de 3 px e afastamento de 4 px. Os tons de decoração podem ficar atrás de elementos gráficos, fora da área do texto.

| Token | Claro | Escuro |
| --- | --- | --- |
| surface | #fff4e3 | #271a14 |
| text | #3b2418 | #fff0d8 |
| muted | #65483a | #dfbfa8 |
| accent | #8f391f | #f0a37c |
| on-accent | #fff4e3 | #321b12 |
| focus | #7a4100 | #ffd285 |
| board-light | #eed3ad | #c89567 |
| board-dark | #946045 | #704331 |

Na skill chess-piece-builder, use `--fw-piece-light` (#fff4e3) ou `--fw-piece-dark` (#382219) para o preenchimento e o token oposto para `--fw-piece-outline`. Em SVG inline, use `data-piece-tone="dark"` para acionar a cor creme no contorno. Preserve os contornos quando as peças ficarem em casas próximas da cor do preenchimento. Identifique peças interativas pelo nome e pela casa.

A biblioteca CSS inclui círculo, semicírculo, arco, quadrado rotacionado e tabuleiro de 8 × 8. Use as classes `fw-circle`, `fw-half`, `fw-arc`, `fw-diamond` e `fw-board` dentro de um plano decorativo `.fw-art[aria-hidden=true]`. Defina `--fw-radius` para ajustar os raios de cartões em conjunto. Para composições SVG, reutilize as mesmas cores via `currentColor` ou tokens e aplique o movimento ao grupo decorativo.