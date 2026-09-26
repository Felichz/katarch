import { useId, type ReactNode } from 'react';
import { motion, type Transition } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface SceneProps {
  state?: string;
  props?: Record<string, any>;
  chosen: number | null;
  reduced: boolean;
  onNext: () => void;
}

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const spring: Transition = { type: 'spring', stiffness: 170, damping: 24 };

/** Responsive SVG canvas. Children draw in viewBox units. */
export function Canvas({
  w,
  h,
  label,
  children,
  className = '',
}: {
  w: number;
  h: number;
  label: string;
  children: (ids: { arrow: string; arrowCmd: string; arrowEvt: string; arrowAccent: string; arrowDanger: string }) => ReactNode;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const ids = {
    arrow: `a-${uid}`,
    arrowCmd: `ac-${uid}`,
    arrowEvt: `ae-${uid}`,
    arrowAccent: `aa-${uid}`,
    arrowDanger: `ad-${uid}`,
  };
  const marker = (id: string, color: string) => (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1.5 L8.5 5 L1 8.5" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  );
  return (
    <div className={`dg-wrap ${className}`}>
      <svg className="dg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        <defs>
          {marker(ids.arrow, 'var(--text-3)')}
          {marker(ids.arrowCmd, 'var(--cmd)')}
          {marker(ids.arrowEvt, 'var(--evt)')}
          {marker(ids.arrowAccent, 'var(--accent)')}
          {marker(ids.arrowDanger, 'var(--danger)')}
        </defs>
        {children(ids)}
      </svg>
    </div>
  );
}

export type NodeKind = 'cmp' | 'ext' | 'core' | 'plain' | 'muted' | 'danger' | 'evt' | 'cmd';

/** A box with icon + label, positioned by its CENTER. Animates position/opacity. */
export function Node({
  x,
  y,
  w = 180,
  h = 64,
  kind = 'plain',
  icon: Icon,
  label,
  sub,
  show = true,
  highlight = false,
  dim = false,
  delay = 0,
  crossed = false,
  children,
  onEnter,
  ariaLabel,
  labelTop = false,
}: {
  labelTop?: boolean;
  onEnter?: () => void;
  ariaLabel?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  kind?: NodeKind;
  icon?: LucideIcon;
  label: ReactNode;
  sub?: ReactNode;
  show?: boolean;
  highlight?: boolean;
  dim?: boolean;
  delay?: number;
  crossed?: boolean;
  children?: ReactNode;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ x: x - w / 2, y: y - h / 2, opacity: show ? (dim ? 0.32 : 1) : 0, scale: show ? 1 : 0.92 }}
      transition={{ ...spring, delay: show ? delay : 0, opacity: { duration: 0.35, delay: show ? delay : 0 } }}
      style={{ pointerEvents: show ? 'auto' : 'none', transformBox: 'fill-box', transformOrigin: 'center', cursor: onEnter ? 'pointer' : undefined, outline: 'none' }}
      aria-hidden={!show}
      className={onEnter ? 'nd-hit' : undefined}
      tabIndex={onEnter && show ? 0 : undefined}
      aria-label={onEnter ? ariaLabel : undefined}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
    >
      <rect className={`nd nd--${kind} ${highlight ? 'is-hl' : ''}`} width={w} height={h} rx={12} />
      <foreignObject width={w} height={h}>
        <div className={`nd-in ${Icon ? '' : 'nd-in--noicon'} ${crossed ? 'is-crossed' : ''} ${labelTop ? 'nd-in--top' : ''}`}>
          {Icon && (
            <span className={`nd-ic nd-ic--${kind}`}>
              <Icon size={18} strokeWidth={1.9} />
            </span>
          )}
          <span className="nd-tx">
            <span className="nd-l">{label}</span>
            {sub && <span className="nd-s">{sub}</span>}
          </span>
        </div>
      </foreignObject>
      {children}
    </motion.g>
  );
}

/** A straight or polyline connector that draws itself in. */
export function Edge({
  points,
  show = true,
  tone = 'plain',
  dashed = false,
  marker,
  delay = 0,
  width = 1.8,
  flow = false,
}: {
  points: [number, number][];
  show?: boolean;
  tone?: 'plain' | 'cmd' | 'evt' | 'accent' | 'danger' | 'muted';
  dashed?: boolean;
  marker?: string;
  delay?: number;
  width?: number;
  /** animated marching dashes (continuous flow) */
  flow?: boolean;
}) {
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  if (dashed || flow) {
    // dash patterns and pathLength drawing both use stroke-dasharray: fade instead of draw
    return (
      <motion.path
        d={d}
        className={`eg eg--${tone} ${dashed ? 'is-dashed' : ''} ${flow ? 'is-flow' : ''}`}
        strokeWidth={width}
        fill="none"
        markerEnd={marker ? `url(#${marker})` : undefined}
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.4, delay: show ? delay : 0 }}
      />
    );
  }
  return (
    <motion.path
      d={d}
      className={`eg eg--${tone}`}
      strokeWidth={width}
      fill="none"
      markerEnd={marker ? `url(#${marker})` : undefined}
      initial={false}
      animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ pathLength: { duration: 0.6, ease: EASE, delay: show ? delay : 0 }, opacity: { duration: 0.2, delay: show ? delay : 0 } }}
    />
  );
}

/** A message token (command / event) that travels along a polyline. */
export function Packet({
  points,
  label,
  tone = 'cmd',
  duration = 1.6,
  delay = 0,
  repeat = false,
  repeatDelay = 1.2,
  reduced,
  w,
  hold = false,
}: {
  points: [number, number][];
  label?: string;
  tone?: 'cmd' | 'evt' | 'cmp' | 'accent' | 'danger' | 'muted';
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  reduced: boolean;
  w?: number;
  /** stay visible at the end instead of fading */
  hold?: boolean;
}) {
  const pw = w ?? (label ? Math.max(28, label.length * 7.4 + 18) : 14);
  const ph = label ? 24 : 14;
  const xs = points.map((p) => p[0] - pw / 2);
  const ys = points.map((p) => p[1] - ph / 2);
  const last = points.length - 1;
  if (reduced) {
    return (
      <g transform={`translate(${xs[last]} ${ys[last]})`}>
        <PacketBody pw={pw} ph={ph} label={label} tone={tone} />
      </g>
    );
  }
  const opacity = hold ? points.map((_, i) => (i === 0 ? 0 : 1)) : points.map((_, i) => (i === 0 || i === last ? 0 : 1));
  if (points.length === 2 && !hold) {
    // add in-between keyframes so it is visible mid-flight
    return (
      <Packet points={[points[0], lerp(points[0], points[1], 0.15), lerp(points[0], points[1], 0.85), points[1]]} label={label} tone={tone} duration={duration} delay={delay} repeat={repeat} repeatDelay={repeatDelay} reduced={reduced} w={w} hold={hold} />
    );
  }
  return (
    <motion.g
      initial={{ x: xs[0], y: ys[0], opacity: 0 }}
      animate={{ x: xs, y: ys, opacity }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: repeat ? Infinity : 0,
        repeatDelay,
      }}
    >
      <PacketBody pw={pw} ph={ph} label={label} tone={tone} />
    </motion.g>
  );
}

function PacketBody({ pw, ph, label, tone }: { pw: number; ph: number; label?: string; tone: string }) {
  return (
    <>
      <rect width={pw} height={ph} rx={ph / 2} className={`pk pk--${tone}`} />
      {label && (
        <text x={pw / 2} y={ph / 2 + 4.2} textAnchor="middle" className="pk-t">
          {label}
        </text>
      )}
    </>
  );
}

export const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Small label in the diagram (mono, uppercase) */
export function Label({ x, y, children, anchor = 'middle', tone = 'muted', show = true, delay = 0, size = 11 }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; tone?: 'muted' | 'cmd' | 'evt' | 'accent' | 'danger' | 'cmp' | 'text'; show?: boolean; delay?: number; size?: number }) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`lb lb--${tone}`}
      style={{ fontSize: size }}
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.35, delay: show ? delay : 0 }}
    >
      {children}
    </motion.text>
  );
}

/** HTML legend chip row rendered above the canvas */
export function Legend({ items }: { items: { tone: 'cmd' | 'evt' | 'cmp' | 'ext' | 'accent' | 'danger'; label: string }[] }) {
  return (
    <div className="legend" aria-hidden>
      {items.map((i) => (
        <span key={i.label} className="legend__i">
          <span className={`legend__sw legend__sw--${i.tone}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** Scene frame: legend + caption + canvas */
export function Frame({ title, legend, children, foot }: { title?: string; legend?: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="frame">
      {(title || legend) && (
        <div className="frame__head">
          {title && <span className="frame__title mono">{title}</span>}
          {legend}
        </div>
      )}
      <div className="frame__body">{children}</div>
      {foot && <div className="frame__foot">{foot}</div>}
    </div>
  );
}

/** Playback controls for step-through diagrams. */
export function Stepper({
  phase,
  count,
  playing,
  onPlay,
  onPause,
  onGo,
  caption,
  labels,
}: {
  phase: number;
  count: number;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onGo: (p: number) => void;
  caption?: ReactNode;
  labels?: string[];
}) {
  return (
    <div className="stepper">
      <div className="stepper__caption" aria-live="polite">{caption}</div>
      <div className="stepper__ctl">
        <button type="button" className="icon-btn stepper__b" onClick={() => onGo(phase - 1)} disabled={phase === 0} aria-label="Paso anterior del diagrama">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="stepper__dots">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" className={`stepper__dot ${i === phase ? 'is-cur' : ''} ${i < phase ? 'is-done' : ''}`} onClick={() => onGo(i)} aria-label={labels?.[i] ?? `Paso ${i + 1}`} aria-current={i === phase ? 'step' : undefined} />
          ))}
        </div>
        <button type="button" className="icon-btn stepper__b" onClick={() => onGo(phase + 1)} disabled={phase === count - 1} aria-label="Paso siguiente del diagrama">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <button type="button" className="play-btn" onClick={playing ? onPause : phase === count - 1 ? () => { onGo(0); onPlay(); } : onPlay}>
          {playing ? 'Pausa' : phase === count - 1 ? 'Repetir' : 'Reproducir'}
        </button>
      </div>
    </div>
  );
}
