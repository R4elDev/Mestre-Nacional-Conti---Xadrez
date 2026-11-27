# Movimento de xadrez

Carregue `css/chess-motion.css` após `warm.css` e inclua `js/chess-motion.js` como script clássico com `defer`. Use os caminhos relativos à página. O script localiza os SVGs a partir do próprio URL.

| Gancho | Onde aplicar | Comportamento |
| --- | --- | --- |
| `data-chess="hero"` | Camada decorativa vazia com espaço reservado | Duas peças nos cantos entram e flutuam por dois ciclos quando a camada entra na viewport. |
| `data-chess="divider"` | `<div>` vazio entre seções | As 12 peças alternam clara e escura sobre uma faixa areia. Entram em sequência ao aparecer na viewport. Em telas de até 480 px, distribuem-se em duas fileiras de seis. |
| `data-chess="cta"` | Link ou botão com texto visível | Uma peça decorativa acompanha o texto e se move no hover e no foco por teclado. |

Use `data-chess-pieces="rei-clara cavalo-escura"` para trocar as peças do hero. Para o CTA, passe um nome como `torre-escura`. O divisor tem uma composição fixa com as 12 variantes. Use os nomes dos SVGs sem extensão. Entradas desconhecidas preservam a peça padrão correspondente.

O script insere `.chess-motion--hero`, `.chess-motion--divider` ou `.chess-motion--cta` dentro do gancho e usa `data-chess-ready`, `data-chess-pending` e `data-chess-played` para controlar a montagem e a execução. O CSS consome `--fw-sand`, `--fw-radius`, `--fw-motion-enter`, `--fw-motion-fast` e `--fw-ease`. Com movimento reduzido, a decoração permanece estática. Os elementos inseridos ficam fora da árvore de acessibilidade e não interceptam cliques.
