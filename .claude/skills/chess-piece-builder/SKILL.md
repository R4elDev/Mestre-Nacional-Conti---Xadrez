---
name: chess-piece-builder
description: Modele peças de xadrez reconhecíveis em SVG, monte tabuleiros 8×8 e anime peças ou transições temáticas com a paleta de frontend-warm-motion. Use ao criar, editar, validar ou animar peças e tabuleiros do remake.
---

# Peças de xadrez

Use os 12 SVGs de [assets/pieces](assets/pieces/) como ponto de partida. Para criar ou editar silhuetas, siga [proporções e camadas](references/modelagem.md). Para movimento e integração de tokens, use [receitas de animação](references/movimento.md) com a skill irmã `../frontend-warm-motion/SKILL.md`.

- Preserve `viewBox="0 0 100 100"` e os grupos `base`, `corpo`, `colarinho` e `topo`. As duas variantes compartilham a geometria.
- Use SVG externo em `img` para mover a peça inteira. Para animar partes, incorpore o SVG, prefixe os IDs por instância e preserve o papel de cada grupo em `data-parte`.
- Abra [assets/demo.html](assets/demo.html) diretamente no navegador. Reuse [board.css](assets/board.css) e [board.js](assets/board.js) para o tabuleiro.
- Rode `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-pieces.ps1` a partir desta pasta; sem `-ExecutionPolicy Bypass` o Windows com política padrão bloqueia o script. Em PowerShell 7, use `pwsh` com as mesmas opções.
