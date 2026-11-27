# Proporções e camadas

Trace a linha de centro em x=50 e mantenha a base comum entre x=23–77 e y=75–89. Use traço de 3 unidades com junções e pontas arredondadas. Desenhe de trás para frente na ordem corpo, topo, colarinho, base. Sobreponha as junções por 2–4 unidades para que o antialiasing não deixe fendas.

| Peça | Topo aproximado | Como traçar |
| --- | --- | --- |
| Rei | y=12 | Cruze dois segmentos arredondados acima de um topo simétrico com dois lobos. Afunile a haste no meio. |
| Rainha | y=11 | Feche uma coroa com três pontas e use um círculo em cada ponta. Faça o centro mais alto. |
| Torre | y=23 | Recorte duas ameias no caminho fechado e use um corpo trapezoidal, largo na base. |
| Bispo | y=15 | Modele uma mitra em gota com curvas quadráticas. Marque a diagonal da mitra com um traço e acrescente um botão no vértice. |
| Cavalo | y=19 | Desenhe um perfil voltado para a esquerda com orelha, focinho em diagonal, olho circular e pescoço curvo. |
| Peão | y=27 | Use uma esfera e uma haste côncava mais curta, com colarinho estreito. |

Desenhe o corpo com um `path` fechado e faça base e colarinho com `rect` arredondados. Coloque todos os detalhes que acompanham a cabeça em `topo`. Confira todas as peças a 32 px nas duas cores do tabuleiro. Use `alt` com nome e cor quando a peça comunica o estado e `alt=""` quando já houver um rótulo equivalente.

Os arquivos avulsos usam preenchimentos sólidos para funcionar em `img`. Em SVG inline, os três canais de cor podem receber variáveis da aplicação conforme [o mapa de integração](movimento.md).
