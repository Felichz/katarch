import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronDown, Image as ImageIcon, Shapes, AlignLeft, Map, Clock, Footprints } from 'lucide-react';
import type { Chapter } from '../content/types';
import { Ctx, type ConceptData, type DecisionData, type DocData, type DrawerState } from './CourseContext';
import { Blocks } from './Blocks';
import { Drawer } from './Drawer';
import { ThemeToggle } from './ThemeToggle';
import { SCENES } from '../visuals';
import { saveProgress } from '../lib/progress';

interface Props {
  chapter: Chapter;
  concepts: Record<string, ConceptData>;
  docs: Record<string, DocData>;
  decisions: Record<string, DecisionData>;
  next?: { id: string; title: string; available: boolean } | null;
  base: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function readHash(n: number) {
  if (typeof window === 'undefined') return 0;
  const m = window.location.hash.match(/paso-(\d+)/);
  const i = m ? parseInt(m[1], 10) - 1 : 0;
  return Math.min(Math.max(i, 0), n - 1);
}

export default function Player({ chapter, concepts, docs, decisions, next, base }: Props) {
  const steps = chapter.steps;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [evidence, setEvidence] = useState(false);
  const [asText, setAsText] = useState(false);
  const [chosen, setChosen] = useState<Record<string, number | null>>({});
  const [announce, setAnnounce] = useState('');
  const reduced = !!useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const step = steps[index];
  const layout = step.layout ?? 'split';

  // hydrate from URL hash
  useEffect(() => {
    setIndex(readHash(steps.length));
    const onHash = () => setIndex(readHash(steps.length));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [steps.length]);

  const firstRun = useRef(true);
  useEffect(() => {
    const h = `#paso-${index + 1}`;
    // skip the very first run: the hash may still be about to set a later step
    if (firstRun.current) firstRun.current = false;
    else if (window.location.hash !== h) history.replaceState(null, '', h);
    saveProgress(chapter.id, index, steps.length);
    setEvidence(false);
    setAsText(false);
    panelRef.current?.scrollTo({ top: 0 });
    setAnnounce(`Paso ${index + 1} de ${steps.length}: ${step.title}`);
  }, [index]);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= steps.length) return;
      setDir(i > index ? 1 : -1);
      setIndex(i);
    },
    [index, steps.length],
  );
  const prev = () => go(index - 1);
  const nextStep = () => go(index + 1);
  const isLast = index === steps.length - 1;

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (drawer || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable || t.getAttribute('role') === 'slider')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Home') {
        go(0);
      } else if (e.key === 'End') {
        go(steps.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, drawer, steps.length]);

  // touch swipe
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!touch.current || e.pointerType !== 'touch') return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) dx < 0 ? nextStep() : prev();
  };

  // delegate clicks on concept chips / doc refs inside rendered html
  const onContentClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-concept],[data-doc]');
    if (!el) return;
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (el.dataset.concept) setDrawer({ kind: 'concept', id: el.dataset.concept });
    else if (el.dataset.doc) setDrawer({ kind: 'doc', id: el.dataset.doc });
  };

  const ctx = useMemo(() => ({ concepts, docs, decisions, open: setDrawer }), [concepts, docs, decisions]);

  const Scene = step.visual ? SCENES[step.visual.scene] : null;
  const sceneKey = step.visual?.scene ?? 'none';

  // group steps by kicker for the progress rail
  const slide = {
    enter: (d: number) => ({ x: reduced ? 0 : d * 48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduced ? 0 : d * -48, opacity: 0 }),
  };

  return (
    <Ctx.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div className={`app app--${layout}`} onClick={onContentClick} onKeyDown={onContentClick}>
          <header className="topbar">
            <a className="brand" href={base} aria-label="KatArch, mapa del curso">
              <span className="brand__mark" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 20V4h4v6l6-6h5l-7.5 7.5L20 20h-5l-5.5-6L8 16v4z" fill="currentColor" /></svg>
              </span>
              <span className="brand__name">KatArch</span>
            </a>
            <button type="button" className="chapter-btn" onClick={() => setDrawer({ kind: 'steps' })} aria-haspopup="dialog">
              <span className="chapter-btn__n mono">Cap. {pad(chapter.number)}</span>
              <span className="chapter-btn__t">{chapter.title}</span>
              <ChevronDown size={16} aria-hidden />
            </button>
            <div className="rail" aria-hidden>
              {steps.map((s, i) => (
                <span key={s.id} className={`rail__seg ${i < index ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`} />
              ))}
            </div>
            <ThemeToggle />
          </header>

          <main className="main" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            {layout === 'cover' ? (
              <Cover chapter={chapter} onStart={() => go(1)} go={go} />
            ) : (
              <>
                <section className="panel" ref={panelRef} aria-labelledby="step-title">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step.id}
                      className="panel__inner"
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {step.kicker && <p className="panel__kicker mono">{step.kicker}</p>}
                      <h1 id="step-title" className="panel__title">{step.title}</h1>
                      <div className="prose panel__body">
                        <Blocks
                          blocks={step.blocks}
                          chosen={chosen[step.id] ?? null}
                          onChoose={(i) => setChosen((c) => ({ ...c, [step.id]: i }))}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>

                <section className="stage" aria-label="Diagrama">
                  {(step.evidence || step.describe) && (
                    <div className="stage__tools">
                      {step.describe && (
                        <button type="button" className="stage__tool" aria-pressed={asText} onClick={() => { setAsText((v) => !v); setEvidence(false); }}>
                          <AlignLeft size={14} aria-hidden /> {asText ? 'Ver diagrama' : 'Leer como texto'}
                        </button>
                      )}
                      {step.evidence && (
                        <button type="button" className="stage__tool" aria-pressed={evidence} onClick={() => { setEvidence((v) => !v); setAsText(false); }}>
                          {evidence ? <Shapes size={14} aria-hidden /> : <ImageIcon size={14} aria-hidden />}
                          {evidence ? 'Volver al diagrama interactivo' : 'Ver el original del equipo'}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="stage__canvas">
                    <AnimatePresence mode="wait" initial={false}>
                      {evidence && step.evidence ? (
                        <motion.figure key="evidence" className="evidence" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                          <a className="evidence__plate" href={step.evidence.src} target="_blank" rel="noopener noreferrer" title="Abrir en tamaño completo">
                            <img src={step.evidence.src} alt={step.evidence.alt} />
                          </a>
                          <figcaption>{step.evidence.caption}</figcaption>
                        </motion.figure>
                      ) : asText && step.describe ? (
                        <motion.div key="text" className="as-text prose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} dangerouslySetInnerHTML={{ __html: step.describe }} />
                      ) : Scene ? (
                        <motion.div key={sceneKey} className="scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                          <Scene
                            state={step.visual?.state}
                            props={step.visual?.props}
                            chosen={chosen[step.id] ?? null}
                            reduced={reduced}
                            onNext={nextStep}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </section>
              </>
            )}
          </main>

          <footer className="bottombar">
            <button type="button" className="btn" onClick={prev} disabled={index === 0} aria-label="Paso anterior">
              <ArrowLeft size={16} aria-hidden /> <span className="hide-sm">Anterior</span>
            </button>
            <button type="button" className="counter" onClick={() => setDrawer({ kind: 'steps' })}>
              <span className="mono">{pad(index + 1)}<span className="counter__of"> / {pad(steps.length)}</span></span>
              <span className="counter__t hide-sm">{step.kicker ?? chapter.title}</span>
              <span className="counter__keys hide-sm" aria-hidden><kbd>←</kbd><kbd>→</kbd></span>
            </button>
            {isLast ? (
              next?.available ? (
                <a className="btn btn--primary" href={`${base}${next.id}/`}>
                  <span className="hide-sm">Capítulo siguiente</span> <ArrowRight size={16} aria-hidden />
                </a>
              ) : (
                <a className="btn btn--primary" href={base}>
                  <Map size={16} aria-hidden /> <span className="hide-sm">Volver al mapa</span>
                </a>
              )
            ) : (
              <button type="button" className="btn btn--primary" onClick={nextStep} aria-label="Paso siguiente">
                <span className="hide-sm">{index === 0 ? 'Empezar' : 'Siguiente'}</span> <ArrowRight size={16} aria-hidden />
              </button>
            )}
          </footer>

          <div className="sr-only" aria-live="polite">{announce}</div>
          <Drawer state={drawer} onClose={() => setDrawer(null)} chapter={chapter} index={index} go={go} />
        </div>
      </MotionConfig>
    </Ctx.Provider>
  );
}

function Cover({ chapter, onStart, go }: { chapter: Chapter; onStart: () => void; go: (i: number) => void }) {
  const cover = chapter.steps[0];
  // chapter route: group steps by kicker
  const groups: { label: string; first: number; count: number }[] = [];
  chapter.steps.slice(1).forEach((s, k) => {
    const label = s.kicker ?? s.title;
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.count++;
    else groups.push({ label, first: k + 1, count: 1 });
  });
  return (
    <div className="cover">
      <motion.div className="cover__main" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <p className="cover__phase mono">{chapter.phase}</p>
        <div className="cover__num mono" aria-hidden>{pad(chapter.number)}</div>
        <h1 className="cover__title">{chapter.title}</h1>
        <p className="cover__sub">{chapter.subtitle}</p>
        <div className="cover__meta">
          <span><Clock size={15} aria-hidden /> {chapter.minutes} min</span>
          <span><Footprints size={15} aria-hidden /> {chapter.steps.length - 1} pasos</span>
        </div>
        {cover.blocks.length > 0 && (
          <div className="prose cover__intro">
            <Blocks blocks={cover.blocks} chosen={null} onChoose={() => {}} />
          </div>
        )}
        <button type="button" className="btn btn--primary cover__cta" onClick={onStart}>
          Empezar el capítulo <ArrowRight size={16} aria-hidden />
        </button>
      </motion.div>
      <motion.aside className="cover__side" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
        <h2 className="cover__side-title mono">Al terminar vas a poder</h2>
        <ul className="cover__learn">
          {chapter.learn.map((l, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </ul>
        <h2 className="cover__side-title mono">Recorrido</h2>
        <ol className="cover__route">
          {groups.map((g) => (
            <li key={g.first}>
              <button type="button" onClick={() => go(g.first)}>
                <span className="cover__route-dot" aria-hidden />
                <span>{g.label}</span>
                {g.count > 1 && <span className="cover__route-n mono">{g.count}</span>}
              </button>
            </li>
          ))}
        </ol>
      </motion.aside>
    </div>
  );
}
