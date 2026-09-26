import { useState } from 'react';
import type { TextBlock, PredictOption } from '../content/types';
import { useCourse } from './CourseContext';
import { Lightbulb, AlertTriangle, BookOpen, Check, X, ArrowUpRight, Scale } from 'lucide-react';

const H = ({ html, as: Tag = 'div', className }: { html: string; as?: any; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

function Predict({
  question,
  options,
  chosen,
  onChoose,
}: {
  question: string;
  options: PredictOption[];
  chosen: number | null;
  onChoose: (i: number) => void;
}) {
  return (
    <div className="predict" role="group" aria-label="Pausá y predecí">
      <div className="predict__head">
        <Lightbulb size={16} aria-hidden />
        <span>Pausá y predecí</span>
      </div>
      <p className="predict__q">{question}</p>
      <div className="predict__opts">
        {options.map((o, i) => {
          const picked = chosen === i;
          const state = chosen === null ? '' : o.correct ? 'is-correct' : picked ? 'is-wrong' : 'is-dim';
          return (
            <button
              key={i}
              type="button"
              className={`predict__opt ${state}`}
              aria-pressed={picked}
              onClick={() => onChoose(i)}
            >
              <span className="predict__mark" aria-hidden>
                {chosen !== null && o.correct ? <Check size={14} /> : chosen !== null && picked ? <X size={14} /> : String.fromCharCode(65 + i)}
              </span>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {chosen !== null && (
          <div className={`predict__fb ${options[chosen].correct ? 'ok' : ''}`}>
            <H html={options[chosen].feedback} />
            {!options[chosen].correct && (
              <p className="predict__hint">Probá otra opción, o seguí: la respuesta aparece en el diagrama.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionChip({ id }: { id: string }) {
  const { decisions, open } = useCourse();
  const d = decisions[id];
  if (!d) return null;
  return (
    <button type="button" className="decision-chip" onClick={() => open({ kind: 'decision', id })}>
      <span className="decision-chip__icon" aria-hidden><Scale size={16} /></span>
      <span className="decision-chip__body">
        <span className="decision-chip__label">Decisión registrada · {d.adrs.map((a) => 'ADR ' + a.id).join(' + ')}</span>
        <span className="decision-chip__title">{d.title}</span>
      </span>
      <ArrowUpRight size={16} aria-hidden className="decision-chip__go" />
    </button>
  );
}

export function Blocks({
  blocks,
  chosen,
  onChoose,
}: {
  blocks: TextBlock[];
  chosen: number | null;
  onChoose: (i: number) => void;
}) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <H key={i} as="p" html={b.html} />;
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul';
            return (
              <L key={i}>
                {b.items.map((it, j) => (
                  <H key={j} as="li" html={it} />
                ))}
              </L>
            );
          }
          case 'cards':
            return (
              <div key={i} className="mini-cards">
                {b.cards.map((c, j) => (
                  <div key={j} className="mini-card">
                    <div className="mini-card__top">
                      <strong>{c.title}</strong>
                      {c.tag && <span className="mini-card__tag">{c.tag}</span>}
                    </div>
                    <H html={c.html} className="mini-card__body" />
                  </div>
                ))}
              </div>
            );
          case 'callout': {
            const Icon = b.tone === 'warn' ? AlertTriangle : b.tone === 'info' ? Lightbulb : BookOpen;
            return (
              <aside key={i} className={`callout callout--${b.tone}`}>
                <div className="callout__title">
                  <Icon size={15} aria-hidden />
                  {b.title}
                </div>
                <H html={b.html} />
              </aside>
            );
          }
          case 'predict':
            return <Predict key={i} question={b.question} options={b.options} chosen={chosen} onChoose={onChoose} />;
          case 'decision':
            return <DecisionChip key={i} id={b.id} />;
        }
      })}
    </>
  );
}
