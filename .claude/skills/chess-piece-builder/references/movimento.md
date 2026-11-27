# Receitas de animação

Use [a demo](../assets/demo.html) como implementação executável. Separe a posição da peça no invólucro `.chess-token` e a rotação ou escala no SVG ou na imagem interna. Assim os dois efeitos podem coexistir.

| Efeito | Gatilho | Implementação |
| --- | --- | --- |
| Entrada ao rolar | IntersectionObserver com limiar 0,2 | Ao entrar, adicione `.enter` para ir de `translateY(1rem)` e opacidade inicial zero ao estado natural. Pare de observar depois da entrada. |
| Flutuação | Hover ou evento pontual | Faça `translateY(0 → -.35rem → 0)` em 700 ms. Para repetir indefinidamente, forneça controle de pausa. |
| Rotação | Hover ou jogada | Faça `rotate(0 → -16deg → 0)` no invólucro interno. Para girar só o topo inline, aplique `transform-box: fill-box` e `transform-origin: center bottom` ao grupo. |
| Cavalo em L | Jogada a partir de índices de 0 a 7 | Verifique se as distâncias absolutas são 1 e 2 em qualquer ordem. Anime de b1 `[1,7]` para `[1,5]` e c3 `[2,5]`, então persista o destino com `place`. |
| Captura | Cavalo alcança a casa ocupada | Após o movimento, anime opacidade 1 → 0 e escala 1 → .55 da peça capturada. Remova-a e anuncie a jogada em uma região de status. |
| Promoção | Peão alcança a última fileira | Troque a imagem e seu texto alternativo, preservando a posição. Revele a nova peça com escala e opacidade. Para um jogo, aplique a escolha do jogador antes da troca. |
| Rei em xeque | Mudança para estado de xeque | No elemento interno alterne ângulos pequenos até zero em 300 ms. Mantenha o aviso textual com movimento reduzido. |
| Entre seções | Navegação ou botão de revelar | Defina um `clipPath` inline com a silhueta normalizada de uma peça e `clipPathUnits="objectBoundingBox"`. Use `clip-path: url(#reveal-pawn)` como fotograma inicial discreto, depois revele a nova seção com `circle(0%) → circle(100%)`. Para uma máscara, use a silhueta branca sobre transparência e alterne a opacidade da camada mascarada. |

Anime apenas `transform`, `opacity` e `clip-path`. Em CSS, declare efeitos sob `@media (prefers-reduced-motion: no-preference)`. Em JS, teste `matchMedia('(prefers-reduced-motion: reduce)')` e aplique diretamente o destino quando necessário. Preserve posição final, promoções, remoções e avisos nos dois modos.

Para incorporar SVGs repetidos, clone cada grupo, copie seu ID original para `data-parte` e use um prefixo único por instância. Para SVG inline informativo, inclua um nome acessível com `role="img"` e `aria-labelledby` apontando para um `title` com ID único. Para ilustração decorativa use `aria-hidden="true"`.

## Tokens da skill irmã

Leia `../../frontend-warm-motion/SKILL.md` a partir desta pasta. Aplique os tokens semânticos da aplicação sobre `--chess-paper`, `--chess-ink`, `--chess-accent`, `--chess-square-light`, `--chess-square-dark`, `--chess-duration` e `--chess-ease`. Os valores do demo são fallbacks para execução offline. Em um SVG inline, vincule creme/terracota ao preenchimento do corpo, âmbar/dourado ao acabamento e café ao contorno. Os SVGs externos podem receber os equivalentes sólidos na exportação.
