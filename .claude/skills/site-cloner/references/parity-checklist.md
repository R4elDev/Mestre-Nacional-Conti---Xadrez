# Checklist de paridade (clone x content.json)

Automático: `node scripts/verify-parity.mjs --content content/content.json --dump clone-dump.json` → 0 falhas.

## Conteúdo
- [ ] Todas as rotas/páginas do `content.json` existem no clone, com o mesmo `path`.
- [ ] Todo texto (títulos, parágrafos, bullets, legendas, selos) idêntico, sem reescrita.
- [ ] Ordem das sections igual à do original.
- [ ] Preços e condições idênticos (ex.: valor mensal, semestral, por aula).
- [ ] Nenhum texto novo/inventado (aviso de "+25% texto" investigado).
- [ ] Depoimentos, FAQ e rodapé: iguais ao original (ou ausentes se o original não tem).

## Links e contatos
- [ ] Todos os CTAs com a URL exata (query strings incluídas); externos com `target="_blank"` + `rel="noopener noreferrer"`.
- [ ] Menu e âncoras (`#training-paths`) funcionam.
- [ ] WhatsApp, e-mail, telefone e redes preservados (ou null conforme original).
- [ ] Teste manual: clicar cada CTA (checkout Kiwify, formulário Google, YouTube).

## Mídia
- [ ] Imagens com mesmo `src` lógico e **alt verbatim**; vídeos/embeds presentes.
- [ ] Pesos razoáveis (imagem > 500 KB: otimizar sem trocar o conteúdo; ex.: plataforma.png ~720 KB).

## SEO / idioma
- [ ] `<title>` igual; description/OG só se existirem (ou aprovados pelo cliente).
- [ ] `<html lang="pt-BR">` (decisão registrada, original = `en`).
- [ ] Favicon.

## Acessibilidade AA (revisão técnica)
- [ ] Contraste ≥ 4.5:1 (texto) / 3:1 (UI, texto grande).
- [ ] Um único `h1` por página, hierarquia h1>h2>h3 igual à original.
- [ ] Foco visível, navegação por teclado, links com nome acessível.
- [ ] Emojis decorativos (`♟️`, `✓`) com `aria-hidden` quando não são conteúdo.
- [ ] Lightbox acessível (Esc fecha, foco preso, botão com rótulo).
- [ ] `prefers-reduced-motion` respeitado.

## Pendências
- [ ] Lista de `TODO-confirmar` entregue ao cliente.
