---
name: frontend-warm-motion
description: Cria front-ends vanilla de xadrez com paleta morna clara e escura, geometria reutilizável e transições acessíveis entre seções. Use ao montar ou revisar páginas, temas e animações do remake.
---

# Front-end de xadrez com movimento

Monte páginas em HTML semântico com `lang="pt-BR"`, CSS mobile-first e JavaScript vanilla. Preserve a leitura, os links e o foco com JavaScript desativado ou movimento reduzido.

- Para cores, formas e peças, consulte [Tokens e formas](references/design.md).
- Para configurar transições e seus fallbacks, consulte [Movimento](references/motion.md).
- Abra [a demonstração](assets/example.html) para testar os sete efeitos em três seções e aplicar um efeito comum pelo atributo `data-transition`.

Use `site-cloner` (Escriba) para extrair e validar conteúdo e `chess-piece-builder` (Torre) para integrar as peças. No projeto Monti, use `content/content.json` como fonte editorial e dê URLs reais às cinco rotas. Valide a paridade das páginas implementadas com `node .claude/skills/site-cloner/scripts/verify-parity.mjs --content content/content.json --dump clone-dump.json`, usando `.claude/skills/site-cloner/scripts/extract-page.js` em cada rota para montar o dump. Confira as notas da Lupa em `.claude/skills/NOTES-site-recon.md`.

Valide contraste AA em ambos os temas, navegação por teclado, largura de 320 px e movimento reduzido. Otimize imagens de conteúdo e declare suas dimensões. Em lightboxes, mova o foco ao abrir, permita fechar com Escape e devolva o foco ao gatilho. Marque decorações e marcas redundantes com `aria-hidden="true"`.