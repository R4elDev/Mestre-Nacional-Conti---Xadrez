# Registro de design (separado do conteúdo)

Arquivo: `content/design-registry.md` (nunca dentro do `content.json`). Serve para o time de design saber o que o original fazia, **sem** poder alterar informações.

Registre por seção (`page#section.id`):
- **Layout:** colunas, ordem em mobile, alinhamento, larguras máximas.
- **Tipografia:** famílias (ex.: Inter para corpo, Playfair Display para títulos), pesos, tamanhos, `line-height`.
- **Cores:** hex/tokens + contraste (AA: 4.5:1 texto normal, 3:1 texto grande/UI).
- **Espaçamento/raios/sombras.**
- **Componentes:** navbar, cards, botões (estados hover/focus), lightbox "clique para ampliar".
- **Movimento:** animações/transições observadas.
- **Observações:** o que é decoração (ex.: "✓", "♟️", "🔍") vs. conteúdo.

Captura: `maestri portal screenshot`, `evaluate` em `getComputedStyle`. Decisões **novas** de design ficam aqui como "proposta", marcadas claramente, e não alteram `content.json`.

Regra: se uma mudança visual exigir mudar texto/link/preço, **pare** e peça confirmação ao cliente (TODO-confirmar).
