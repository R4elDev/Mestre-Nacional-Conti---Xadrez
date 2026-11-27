const headingTails = {
  'Um próximo passo claro para o seu xadrez.': 'seu xadrez.',
  'Pare de estudar sem direção e comece a treinar de verdade.': 'de verdade.',
  'Treino guiado com rotina, direção e acompanhamento.': 'e acompanhamento.',
  'Escolha um tema e avance no seu próximo treino.': 'próximo treino.',
};

export function Heading({ heading, id }) {
  const { level, text } = heading;
  const Tag = 'h' + level;
  let body = text;
  const tail = headingTails[text];
  if (tail) {
    body = <>{text.slice(0, -tail.length)}<span className="heading-tail">{tail}</span></>;
  } else if (text === 'Diagnóstico completo, cronograma e plano de estudos individualizado.') {
    const cuts = [0, text.indexOf('cronograma'), text.indexOf('estudos'), text.length];
    body = cuts.slice(0, -1).map((offset, index) => (
      <span key={offset}>{text.slice(offset, cuts[index + 1])}</span>
    ));
  }
  return <Tag id={id} tabIndex={level === 1 ? -1 : undefined}>{body}</Tag>;
}

export function Paragraphs({ items = [] }) {
  return items.map(text => (
    <p key={text}>
      {text.startsWith('🔍 ') ? <><span aria-hidden="true">🔍</span>{text.slice('🔍'.length)}</> : text}
    </p>
  ));
}