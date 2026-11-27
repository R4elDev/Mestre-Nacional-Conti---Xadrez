# Partida da Ópera no hero

Inclua `css/chess-game.css` após `warm.css` e `js/chess-game.js` como script clássico com `defer`. No hero da aula individual, coloque o gancho dentro de um contêiner visível para tecnologias assistivas.

```html
<div class="chess-game" data-chess="game" role="img"
     aria-label="Tabuleiro da Partida da Ópera, vencida por Paul Morphy com mate de torre em d8"></div>
```

O script adiciona `.chess-game-frame` ao redor do gancho e insere o botão como irmão do `role="img"` para manter o controle acessível. Use o contêiner externo do hero para posicionar o conjunto no layout. O tabuleiro limita-se à largura disponível e consome `--fw-board-light` e `--fw-board-dark`. Os SVGs são resolvidos em `assets/pieces/` a partir do URL do script.

A reprodução usa 900 ms por lance e 2,1 s na posição de mate antes do reinício. O botão pausa e retoma a reprodução. A partida também pausa fora da viewport e com a aba oculta. Com movimento reduzido, o tabuleiro começa no mate e o botão volta à posição inicial, depois avança um lance imóvel a cada acionamento. O nome do tabuleiro permanece estável e os lances não geram anúncios ao vivo.

A implementação valida os movimentos usados na linha histórica, incluindo roque, capturas e xeque ao próprio rei. O tabuleiro é uma reprodução da partida, sem entrada de jogadas livres. A partir de `site/`, rode `node --test tests/chess-game.test.cjs`.
