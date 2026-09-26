import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
import type { SceneProps } from './kit';
import type { QuizQuestion } from '../content/types';

export function Quiz({ props }: SceneProps) {
  const qs = (props?.questions ?? []) as QuizQuestion[];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => qs.map(() => null));
  const done = i >= qs.length;
  const score = picked.filter((p, k) => p === qs[k]?.answer).length;

  const choose = (opt: number) => {
    if (picked[i] !== null) return;
    setPicked((p) => p.map((v, k) => (k === i ? opt : v)));
  };

  return (
    <div className="quiz">
      <div className="quiz__bar" aria-hidden>
        {qs.map((_, k) => (
          <span key={k} className={`quiz__seg ${k < i || done ? (picked[k] === qs[k].answer ? 'ok' : 'ko') : k === i ? 'cur' : ''}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={i} className="quiz__card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="quiz__n mono">Pregunta {i + 1} de {qs.length}</p>
            <h2 className="quiz__q">{qs[i].q}</h2>
            <div className="quiz__opts" role="group" aria-label="Opciones">
              {qs[i].options.map((o, k) => {
                const p = picked[i];
                const cls = p === null ? '' : k === qs[i].answer ? 'is-correct' : k === p ? 'is-wrong' : 'is-dim';
                return (
                  <button key={k} type="button" className={`predict__opt ${cls}`} onClick={() => choose(k)} aria-pressed={p === k} disabled={p !== null && k !== p && k !== qs[i].answer}>
                    <span className="predict__mark" aria-hidden>
                      {p !== null && k === qs[i].answer ? <Check size={14} /> : p === k ? <X size={14} /> : String.fromCharCode(65 + k)}
                    </span>
                    <span>{o}</span>
                  </button>
                );
              })}
            </div>
            <div aria-live="polite">
              {picked[i] !== null && (
                <motion.div className={`quiz__why ${picked[i] === qs[i].answer ? 'ok' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <strong>{picked[i] === qs[i].answer ? 'Exacto.' : 'No exactamente.'}</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: qs[i].why }} />
                </motion.div>
              )}
            </div>
            {picked[i] !== null && (
              <button type="button" className="play-btn play-btn--primary quiz__next" onClick={() => setI(i + 1)}>
                {i + 1 < qs.length ? 'Siguiente pregunta' : 'Ver resultado'} <ArrowRight size={15} aria-hidden />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" className="quiz__card quiz__done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <Trophy size={36} aria-hidden />
            <h2 className="quiz__q">
              {score} de {qs.length}
            </h2>
            <p>{score === qs.length ? 'Tenés el capítulo en la cabeza. Seguí adelante.' : 'Repasá los pasos que te hicieron dudar desde el índice del capítulo, o volvé a intentarlo.'}</p>
            <button type="button" className="play-btn" onClick={() => { setPicked(qs.map(() => null)); setI(0); }}>
              <RotateCcw size={15} aria-hidden /> Reintentar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
