# Transições

O atributo `data-transition` aceita um efeito em cada seção. Declare-o também no contêiner para aplicar um único efeito a todas as seções filhas, com precedência sobre escolhas locais quando o valor for válido. Valores desconhecidos deixam a escolha local em vigor. Use `none` para suprimir o efeito. Limite a animação ao plano decorativo `.fw-art`, com `.fw-curtain` e `.fw-marquee` para as variantes correspondentes.

| Valor | Efeito | Propriedades |
| --- | --- | --- |
| circle | Revelação circular | clip-path |
| wipe | Revelação em diagonal | clip-path |
| curtain | Duas formas abrem a cortina | transform, opacity |
| parallax | Formas deslocam-se com a rolagem | transform |
| slide-scale | Deslize com mudança de escala | transform, opacity |
| marquee | Uma passagem do divisor geométrico | transform |
| morph | Moldura recortada muda de perfil | clip-path |

[O controlador](../assets/warm.js) anima uma vez quando pelo menos 25% do plano decorativo entra em tela. O IntersectionObserver acompanha o plano e o CSS encerra a animação, sem depender de eventos de outras animações na seção. A variante parallax usa uma timeline CSS quando o navegador suporta `view()` e `animation-range`. Caso contrário, usa uma entrada curta com o observer. Sem observer, o plano permanece estático. Com movimento reduzido, todos os planos permanecem estáticos e a mudança da preferência cancela animações correntes.

Use `--fw-motion-fast: 160ms`, `--fw-motion-enter: 560ms` e `--fw-ease: cubic-bezier(.2,.7,.25,1)`. Para `morph`, mantenha o mesmo número e ordem de vértices. Para `marquee`, faça uma passagem breve. Evite loops, animar dimensões ou deslocar os pontos de clique.