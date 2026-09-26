import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, AlertTriangle, ArrowRight, MessageSquare, Brain, Sprout, Activity, Mail, Users, Target, ScrollText, Layers, Server, Cog, Code2, Network, Database, Workflow } from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, EASE, type SceneProps } from './kit';

/* ───────────────────────── week zero ───────────────────────── */
const WEEK_DOCS = [
  { id: 'business-goal', t: 'Objetivo de negocio' },
  { id: 'constraints', t: 'Restricciones' },
  { id: 'functional-reqs', t: 'Requerimientos, releídos' },
  { id: 'questions', t: 'Preguntas al cliente' },
  { id: 'glossary', t: 'Glosario de vocabulario' },
];

export function WeekZero({ reduced }: SceneProps) {
  return (
    <div className="week">
      <section className="vcard week__docs">
        <p className="week__k mono">Primera semana del repositorio</p>
        <ul>
          {WEEK_DOCS.map((d, i) => (
            <motion.li key={d.id} initial={{ opacity: 0, x: reduced ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
              <button type="button" className="week__doc" data-doc={d.id}>
                <FileText size={16} aria-hidden />
                <span>{d.t}</span>
                <span className="mono week__open">abrir</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </section>
      <motion.section className="week__zero" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5, ease: EASE }}>
        <span className="week__num mono">0</span>
        <span className="week__lbl">diagramas de software</span>
        <span className="week__sub">Primero se lee el negocio. Recién después se dibuja.</span>
      </motion.section>
    </div>
  );
}

/* ───────────────────────── the eight raw requirements ───────────────────────── */
const REQS = [
  { n: 1, raw: 'Integrarse con heladeras de terceros: inventario y compras', out: 'Vago y probablemente fuera de alcance: ya lo resuelve el sistema de gestión de las heladeras. Necesita aclaración.', flag: true },
  { n: 2, raw: 'Las heladeras exponen inventario y compras por una API en la nube', out: 'Contexto del #1: describe el entorno.' },
  { n: 3, raw: 'Integrarse con el punto de venta de los kioscos', out: 'Es la confirmación del vendedor. El efectivo para no suscriptores es un caso válido.' },
  { n: 4, raw: 'El kiosco: espacio subalquilado, un empleado cobra en la caja', out: 'Se agrupa con el #3: acompañar a los ocasionales y soportar pagos en efectivo.' },
  { n: 5, raw: 'Aplicación accesible desde móvil y web', out: 'Acompañar e incentivar a suscriptores y conocidos.' },
  { n: 6, raw: 'Feedback de compras verificadas y encuestas en la app', out: 'Extensible a nuevas formas de engagement: encuestas, reviews, cupones…' },
  { n: 7, raw: 'Aceptar cupones y precios promocionales', out: 'Extensión del #6.' },
  { n: 8, raw: 'Enviar actualizaciones de inventario a la cocina central', out: 'Integración.' },
];

export function Reqs({ reduced }: SceneProps) {
  return (
    <Frame title="Ocho requerimientos crudos → escenarios de uso" legend={<Legend items={[{ tone: 'accent', label: 'Cuestionado' }]} />}>
      <div className="reqs">
        <div className="reqs__head mono">
          <span>Lo que decía el pliego</span>
          <span />
          <span>Cómo lo releyó el equipo</span>
        </div>
        {REQS.map((r, i) => (
          <motion.div key={r.n} className={`reqs__row ${r.flag ? 'is-flag' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.1 + i * 0.09 }}>
            <span className="reqs__raw"><span className="mono reqs__n">#{r.n}</span>{r.raw}</span>
            <ArrowRight size={15} aria-hidden className="reqs__arr" />
            <span className="reqs__out">{r.flag && <AlertTriangle size={14} aria-hidden />}{r.out}</span>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ───────────────────────── questions to the client ───────────────────────── */
const QS = [
  { q: 'Si un suscriptor se enferma y no puede retirar sus comidas durante uno o varios días, ¿qué pasa?' },
  { q: '¿Puede un usuario registrado hacer un pedido por lotes que no entre en una heladera? ¿Y entonces, entrega directa?' },
  { q: '¿La comida que un suscriptor no retiró puede venderse a otros? ¿Después de cuánto tiempo? ¿Cómo se le notifica al suscriptor?', back: 'vuelve en el capítulo 7' },
  { q: 'No sabemos qué datos proveen las heladeras: ¿el total de comidas disponibles o solo el delta del último cambio? Esperamos que sea el total.', back: 'vuelve en el capítulo 6' },
];

export function Questions({ reduced }: SceneProps) {
  return (
    <Frame title="Questions.md · del equipo al cliente">
      <div className="chat">
        <div className="chat__who mono"><Users size={14} aria-hidden /> ArchColider → Farmacy Food</div>
        {QS.map((x, i) => (
          <motion.div key={i} className="chat__msg" initial={{ opacity: 0, y: reduced ? 0 : 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: reduced ? 0 : 0.2 + i * 0.35, duration: 0.35 }}>
            <MessageSquare size={15} aria-hidden />
            <p>“{x.q}”</p>
            {x.back && <span className="chat__back mono">{x.back}</span>}
          </motion.div>
        ))}
        <motion.p className="chat__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 1.8 }}>
          Cada ambigüedad, anotada y enviada al dueño del negocio. Ninguna, inventada.
        </motion.p>
      </div>
    </Frame>
  );
}

/* ───────────────────────── Rozanski & Woods views (team's own view map) ───────────────────────── */
export function Views({ reduced }: SceneProps) {
  return (
    <Frame title="Cómo organizó el equipo sus vistas" legend={<Legend items={[{ tone: 'cmp', label: 'Vista' }, { tone: 'accent', label: 'Estructura del software' }]} />}>
      <Canvas w={960} h={520} label="Mapa de vistas: la vista de despliegue define el despliegue de la estructura del software; la operacional define su operación; la de desarrollo, sus restricciones de implementación; la estructura se compone de las vistas funcional, de información y de concurrencia">
        {(ids) => (
          <>
            <Node x={330} y={80} w={210} h={56} kind="cmp" icon={Server} label="Vista de despliegue" sub="cap. 8" delay={0.1} />
            <Node x={780} y={80} w={210} h={56} kind="cmp" icon={Cog} label="Vista operacional" delay={0.2} />
            <Node x={330} y={250} w={230} h={64} kind="core" icon={Layers} label="Estructura del software" delay={0} />
            <Node x={780} y={250} w={210} h={56} kind="cmp" icon={Code2} label="Vista de desarrollo" delay={0.3} />
            <Node x={130} y={430} w={190} h={56} kind="cmp" icon={Workflow} label="Funcional" sub="cap. 5" delay={0.4} />
            <Node x={330} y={430} w={190} h={56} kind="cmp" icon={Database} label="Información" sub="caps. 6 y 7" delay={0.5} />
            <Node x={530} y={430} w={190} h={56} kind="cmp" icon={Network} label="Concurrencia" sub="cap. 6" delay={0.6} />
            <Edge points={[[675, 80], [437, 80]]} marker={ids.arrow} delay={0.3} />
            <Label x={556} y={70}>define su operación</Label>
            <Edge points={[[330, 108], [330, 216]]} marker={ids.arrow} delay={0.3} />
            <Label x={340} y={166} anchor="start">define su despliegue</Label>
            <Edge points={[[675, 250], [447, 250]]} marker={ids.arrow} delay={0.4} />
            <Label x={560} y={240}>restricciones de implementación</Label>
            <Edge points={[[330, 282], [330, 340], [130, 340], [130, 400]]} delay={0.5} />
            <Edge points={[[330, 340], [330, 400]]} delay={0.5} />
            <Edge points={[[330, 340], [530, 340], [530, 400]]} delay={0.5} />
            <polygon points="330,282 337,290 330,298 323,290" fill="var(--surface)" stroke="var(--text-3)" strokeWidth={1.5} />
            <Label x={700} y={420} anchor="start" tone="accent" show delay={0.7}>+ perspectivas</Label>
            <Label x={700} y={440} anchor="start" tone="text" size={13} show delay={0.7}>seguridad, performance,</Label>
            <Label x={700} y={458} anchor="start" tone="text" size={13} show delay={0.7}>disponibilidad… atraviesan</Label>
            <Label x={700} y={476} anchor="start" tone="text" size={13} show delay={0.7}>todas las vistas</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── principles, distilled from constraints ───────────────────────── */
const PRINC = [
  { t: 'Simplicidad cognitiva', s: 'si no se puede explicar fácil, se descarta', icon: Brain, from: 'Equipo chico, presupuesto mínimo' },
  { t: 'Evolucionabilidad', s: 'módulos fáciles de extraer mañana, no hoy', icon: Sprout, from: 'Meta: de 2 a 68 locaciones' },
  { t: 'Telemetría obligatoria', s: 'escalar con datos, no con ansiedad', icon: Activity, from: 'El costo de escalar a ciegas' },
  { t: 'Mensajes antes que llamadas', s: 'nadie depende de que el otro esté vivo', icon: Mail, from: 'Sistemas externos que no controlan' },
];

export function Principles({ state = 'list' }: SceneProps) {
  const map = state === 'map';
  return (
    <Frame title={map ? 'Cada principio responde a una presión del caso' : 'Cuatro criterios de desempate'} legend={map ? <Legend items={[{ tone: 'danger', label: 'Presión' }, { tone: 'accent', label: 'Principio' }]} /> : undefined}>
      <Canvas w={960} h={500} label="Cuatro principios rectores y las restricciones de las que salen">
        {(ids) => (
          <>
            {PRINC.map((p, i) => {
              const y = 70 + i * 120;
              return (
                <g key={p.t}>
                  <Node x={220} y={y} w={280} h={60} kind="danger" icon={Target} label={p.from} show={map} delay={0.1 + i * 0.12} />
                  <Edge points={[[362, y], [498, y]]} tone="accent" marker={ids.arrowAccent} show={map} delay={0.35 + i * 0.12} />
                  <Node x={map ? 690 : 480} y={y} w={340} h={70} kind="core" icon={p.icon} label={p.t} sub={p.s} delay={i * 0.08} />
                </g>
              );
            })}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── traceability: business drivers → SARs ───────────────────────── */
const BDS = [
  'Convertir ocasionales en conocidos, y conocidos en suscriptores',
  'Programas de lealtad ricos y fáciles de extender',
  'Información de consumo para gestionar las cocinas',
  'Fácil de usar para gente sin experiencia',
  'Uso sostenible del servicio',
  'Sumar especialistas de la salud',
];
const SARS: { t: string; bd: number[]; note?: string }[] = [
  { t: 'Pagos en efectivo y electrónicos', bd: [1] },
  { t: 'Feedback, encuestas y reviews enchufables', bd: [1, 2] },
  { t: 'Reportes de consumo por heladera y tipo de usuario', bd: [3] },
  { t: 'Agenda para suscriptores, sin pedidos repetitivos', bd: [1, 3, 4, 5] },
  { t: 'Comprar sin registrarse antes', bd: [1, 4, 5] },
  { t: 'Notificaciones sobre sus órdenes', bd: [1, 4, 5] },
  { t: 'Notificaciones de lealtad y cupones nuevos', bd: [2, 5] },
  { t: 'Cada comida desglosada por componentes', bd: [1, 5, 6] },
  { t: 'Pagos seguros', bd: [1, 5] },
  { t: 'Maximizar la garantía de retiro de cada comida', bd: [1, 5], note: '→ PIN offline, cap. 6' },
];

export function Trace({ state = 'full', chosen, props }: SceneProps) {
  const predict = state === 'predict';
  const revealed = !predict || (chosen !== null && chosen === props?.correct);
  const [bd, setBd] = useState<number | null>(predict ? 1 : null);
  const [sar, setSar] = useState<number | null>(null);
  const activeSars = bd ? SARS.map((s, i) => (s.bd.includes(bd) ? i : -1)).filter((i) => i >= 0) : sar !== null ? [sar] : [];
  const activeBds = sar !== null ? SARS[sar].bd : bd ? [bd] : [];
  return (
    <Frame title="BusinessDrivers.md · de dónde sale cada requerimiento" foot={<p className="trace__hint">{predict ? 'Impulsor 1 seleccionado.' : 'Tocá un impulsor de negocio o un requerimiento para ver su trazabilidad.'}</p>}>
      <div className={`trace ${revealed ? '' : 'is-hidden'}`}>
        <section>
          <p className="trace__k mono">Impulsores de negocio</p>
          <ol className="trace__list">
            {BDS.map((t, i) => {
              const n = i + 1;
              const on = activeBds.includes(n);
              return (
                <li key={n}>
                  <button type="button" className={`trace__item trace__item--bd ${on ? 'is-on' : ''}`} onClick={() => { setSar(null); setBd(bd === n ? null : n); }} aria-pressed={bd === n} disabled={predict}>
                    <span className="mono trace__n">{n}</span>
                    <span>{t}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
        <section>
          <p className="trace__k mono">Requerimientos arquitectónicamente significativos</p>
          <ol className="trace__list trace__list--sar">
            {SARS.map((s, i) => {
              const on = activeSars.includes(i);
              return (
                <li key={s.t}>
                  <button type="button" className={`trace__item ${on ? 'is-on' : ''} ${(bd || sar !== null) && !on ? 'is-dim' : ''}`} onClick={() => { setBd(null); setSar(sar === i ? null : i); }} aria-pressed={sar === i} disabled={predict}>
                    <span className="mono trace__n">{i + 1}</span>
                    <span className="trace__t">{s.t}</span>
                    {s.note && <span className="mono trace__note">{s.note}</span>}
                    <span className="mono trace__bd">BD {s.bd.join(', ')}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {!revealed && <div className="trace__veil">Respondé a la izquierda para ver qué requerimientos salen del impulsor 1</div>}
        </section>
      </div>
    </Frame>
  );
}

/* ───────────────────────── anatomy of an ADR ───────────────────────── */
export function AdrAnatomy({ reduced }: SceneProps) {
  const parts = [
    { k: 'Contexto', body: 'Necesitamos registrar las decisiones arquitectónicas tomadas en este proyecto.', note: 'Qué problema obliga a decidir.' },
    { k: 'Decisión', body: 'Usaremos Architecture Decision Records, según la descripción de Michael Nygard.', note: 'Qué se decidió, en una frase.' },
    { k: 'Consecuencias', body: 'Positivo: si aplica · Negativo: si aplica · Riesgos: si aplica', note: 'Lo que se gana y lo que se paga. Incluidas las negativas.', hl: true },
  ];
  return (
    <div className="adrx">
      <motion.article className="vcard adrx__doc" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}>
        <header>
          <ScrollText size={18} aria-hidden />
          <div>
            <p className="mono adrx__id">ADR 001 · 2020-11-19 · Aceptado</p>
            <h3>Usamos ADR</h3>
          </div>
          <button type="button" className="doc-ref" data-doc="adr-001">abrir original</button>
        </header>
        {parts.map((p, i) => (
          <motion.div key={p.k} className={`adrx__part ${p.hl ? 'is-hl' : ''}`} initial={{ opacity: 0, x: reduced ? 0 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.2 }}>
            <p className="mono adrx__k">{p.k}</p>
            <p className="adrx__b">{p.body}</p>
            <p className="adrx__note">{p.note}</p>
          </motion.div>
        ))}
      </motion.article>
      <motion.p className="adrx__law" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        Segunda ley: <em>el porqué importa más que el cómo.</em> El código muestra cómo es el sistema; solo el ADR guarda por qué quedó así.
      </motion.p>
    </div>
  );
}

