import additions from '../content/additions.json';
import Actions from '../components/Actions.jsx';
import Benefits from '../components/Benefits.jsx';
import Card from '../components/Card.jsx';
import { ChessDivider } from '../components/chess/index.js';
import { Heading, Paragraphs } from '../components/Editorial.jsx';
import Gallery from '../components/Gallery.jsx';
import Hero from '../components/Hero.jsx';
import Layout from '../components/Layout.jsx';
import Pricing from '../components/Pricing.jsx';
import Section, { Art } from '../components/Section.jsx';

const transitions = ['circle', 'wipe', 'curtain', 'slide-scale', 'morph'];

function EditorialSection({ item }) {
  const instagram = additions.instagram;
  return (
    <>
      <div className="section-copy">
        {item.heading && <Heading heading={item.heading} id={item.id + '-titulo'} />}
        <Paragraphs items={item.texts} />
        <Benefits items={item.bullets} />
        {item.subsections?.map(sub => (
          <div className="inset" key={sub.heading.text}>
            <Heading heading={sub.heading} />
            <Paragraphs items={sub.texts} />
          </div>
        ))}
        <Actions items={item.ctas} />
        {item.type === 'links' && (
          <a className="social-link" href={instagram.url} target="_blank" rel="noopener noreferrer"
            aria-label={instagram.ariaLabel} aria-describedby="new-tab" data-content-source="client-addition">
            <svg className="social-link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>
            </svg>
            {instagram.label}
          </a>
        )}
      </div>
      {item.cards && <div className="card-grid">{item.cards.map(card => <Card key={card.title} item={card} />)}</div>}
      {item.steps && (
        <ol className="step-grid">
          {item.steps.map(step => (
            <li className="card" key={step.n}>
              <Heading heading={{ level: step.title_level, text: step.title }} />
              <Paragraphs items={[step.text]} />
            </li>
          ))}
        </ol>
      )}
      <Art />
    </>
  );
}

function SectionContent({ item, pageId }) {
  switch (item.type) {
    case 'hero':
    case 'about': return <Hero item={item} pageId={pageId} />;
    case 'pricing': return <Pricing item={item} individual={pageId === 'aula-individual'} />;
    case 'gallery': return <Gallery item={item} />;
    default: return <EditorialSection item={item} />;
  }
}

export default function TrainingPage({ page, focusOnEntry }) {
  return (
    <Layout page={page} focusOnEntry={focusOnEntry}>
      {page.sections.map((item, index) => (
        <PageSection key={item.id} item={item} pageId={page.id} index={index} />
      ))}
    </Layout>
  );
}

function PageSection({ item, pageId, index }) {
  return (
    <>
      {index > 0 && <ChessDivider />}
      <Section item={item} transition={transitions[index]}>
        <SectionContent item={item} pageId={pageId} />
      </Section>
    </>
  );
}