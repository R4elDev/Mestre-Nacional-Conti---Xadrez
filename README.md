# Mestre-Nacional-Monti---Xadrez

Remontagem do site de treinamento de xadrez em React, mantendo o conteúdo do original.

- `app/` — aplicação React (Vite 5, React 18, react-router-dom 6).
- `site/` — versão estática de referência (HTML, CSS e JS).
- `content/` — conteúdo extraído do site original (`content.json`) e registro de design.
- `.claude/skills/` — skills usadas na construção: `frontend-warm-motion`, `chess-piece-builder` e `site-cloner`.

## Rodando o app

```bash
cd app
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ e o 404.html de fallback para hospedagem estática
npm test         # testes do motor da partida de xadrez
```
