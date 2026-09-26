import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen, Inbox, Heart, MessageSquare, CalendarClock, BarChart3, Bell, CreditCard, ChefHat, Smartphone, Store, ShoppingCart,
  Sparkles, Star, Filter, Refrigerator, ArrowRight, Check, X, RotateCcw, MapPin, Eye, Server, Shield, Layers, Package, Map as MapIcon,
} from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, Stepper, EASE, type SceneProps } from './kit';
import { usePhases } from './usePhases';

type Cls = 'core' | 'sup' | 'gen';
const CAPS: { k: string; t: string; icon: any; team: Cls }[] = [
  { k: 'cat', t: 'Catálogo de comidas', icon: BookOpen, team: 'core' },
  { k: 'ord', t: 'Órdenes', icon: Inbox, team: 'core' },
  { k: 'loy', t: 'Lealtad', icon: Heart, team: 'core' },
  { k: 'fb', t: 'Opiniones', icon: MessageSquare, team: 'sup' },
  { k: 'sch', t: 'Agenda de cocina', icon: CalendarClock, team: 'sup' },
  { k: 'rep', t: 'Reportes', icon: BarChart3, team: 'gen' },
  { k: 'not', t: 'Notificaciones', icon: Bell, team: 'gen' },
  { k: 'pay', t: 'Pagos', icon: CreditCard, team: 'gen' },
];
const CLS: Record<Cls, string> = { core: 'Core', sup: 'Soporte', gen: 'Genérico' };

/* ───────────────────────── sorter: classify like the team ───────────────────────── */
export function Sorter({ reduced }: SceneProps) {
  const [pick, setPick] = useState<Record<string, Cls>>({});
  const [shown, setShown] = useState(false);
  const all = CAPS.every((c) => pick[c.k]);
  const score = CAPS.filter((c) => pick[c.k] === c.team).length;
  return (
    <Frame title="Clasificá cada capacidad" foot={
      <div className="sorter__ctl">
        {!shown ? (
          <button type="button" className="play-btn play-btn--primary" disabled={!all} onClick={() => setShown(true)}>
            {all ? 'Comparar con el equipo' : `Faltan ${CAPS.filter((c) => !pick[c.k]).length}`}
          </button>
        ) : (
          <>
            <span className="sorter__score"><strong className="mono">{score}/{CAPS.length}</strong> como el equipo</span>
            <button type="button" className="play-btn" onClick={() => { setPick({}); setShown(false); }}><RotateCcw size={14} aria-hidden /> Otra vez</button>
          </>
        )}
      </div>
    }>
      <div className="sorter">
        <div className="sorter__qs">
          <span><strong>1.</strong> ¿Esto diferencia a Farmacy Food de su competencia?</span>
          <span><strong>2.</strong> ¿Ya existe hecho y probado en el mercado?</span>
        </div>
        <ul className="sorter__list">
          {CAPS.map((c, i) => {
            const ok = shown && pick[c.k] === c.team;
            const ko = shown && pick[c.k] !== c.team;
            return (
              <motion.li key={c.k} className={`sorter__row ${ok ? 'is-ok' : ''} ${ko ? 'is-ko' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <span className="sorter__cap"><c.icon size={16} aria-hidden /> {c.t}</span>
                <span className="sorter__opts" role="radiogroup" aria-label={`Clasificación de ${c.t}`}>
                  {(['core', 'sup', 'gen'] as Cls[]).map((k) => (
                    <button key={k} type="button" role="radio" aria-checked={pick[c.k] === k} disabled={shown} className={`sorter__opt sorter__opt--${k} ${pick[c.k] === k ? 'is-on' : ''} ${shown && c.team === k ? 'is-team' : ''}`} onClick={() => setPick((p) => ({ ...p, [c.k]: k }))}>
                      {CLS[k]}
                    </button>
                  ))}
                </span>
                <span className="sorter__mark" aria-hidden>{ok ? <Check size={16} /> : ko ? <X size={16} /> : null}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </Frame>
  );
}

/* ───────────────────────── strategic domain map ───────────────────────── */
const DPOS: Record<string, { x: number; y: number }> = {
  fb: { x: 230, y: 165 }, sch: { x: 400, y: 165 },
  loy: { x: 640, y: 120 }, cat: { x: 810, y: 120 }, ord: { x: 810, y: 205 },
  rep: { x: 230, y: 345 }, not: { x: 230, y: 430 }, pay: { x: 400, y: 430 },
};

export function DomainMap({ reduced }: SceneProps) {
  return (
    <Frame title="Mapa estratégico de dominios" legend={<Legend items={[{ tone: 'accent', label: 'Core: construir' }, { tone: 'cmp', label: 'Soporte: adaptar' }, { tone: 'ext', label: 'Genérico: alquilar' }]} />}>
      <Canvas w={960} h={520} label="Mapa de dominios por unicidad y complejidad: Core arriba a la derecha con lealtad, catálogo y órdenes; Soporte arriba a la izquierda con opiniones y agenda; Genérico abajo con reportes, notificaciones y pagos">
        {(ids) => (
          <>
            <Edge points={[[80, 490], [80, 40]]} marker={ids.arrow} />
            <Edge points={[[80, 490], [920, 490]]} marker={ids.arrow} />
            <Label x={70} y={50} anchor="end">unicidad</Label>
            <Label x={910} y={512} anchor="end">complejidad</Label>
            <motion.rect x={120} y={60} width={380} height={200} rx={16} fill="color-mix(in srgb, var(--cmp-soft) 60%, transparent)" stroke="var(--cmp)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x={530} y={60} width={380} height={200} rx={16} fill="color-mix(in srgb, var(--accent-soft) 70%, transparent)" stroke="var(--accent)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
            <motion.rect x={120} y={285} width={380} height={185} rx={16} className="zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
            <Label x={140} y={245} anchor="start" tone="cmp" size={12}>Soporte · adaptar</Label>
            <Label x={550} y={245} anchor="start" tone="accent" size={12}>Core · construir a medida</Label>
            <Label x={490} y={305} anchor="end" size={12}>Genérico · alquilar</Label>
            {CAPS.map((c, i) => (
              <Node key={c.k} x={DPOS[c.k].x} y={DPOS[c.k].y} w={160} h={52} kind={c.team === 'core' ? 'core' : c.team === 'sup' ? 'cmp' : 'ext'} icon={c.icon} label={c.t} delay={reduced ? 0 : 0.3 + i * 0.08} />
            ))}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── anti-corruption layer ───────────────────────── */
const EXT = [
  { k: 'gk', t: 'Ghost Kitchen', icon: ChefHat, y: 170 },
  { k: 'lm', t: 'Loyalty Management', icon: Heart, y: 290 },
  { k: 'fe', t: 'Front End + PoS', icon: Smartphone, y: 410 },
];
const ACLN = [
  { k: 'mo', t: 'Meals Offer', y: 170 },
  { k: 'ly', t: 'Loyalty', y: 290 },
  { k: 'api', t: 'Menu Catalog API', y: 410 },
];
const CONS = [
  { k: 'cart', t: 'Carrito', icon: ShoppingCart, y: 120 },
  { k: 'rec', t: 'Recomendaciones', icon: Sparkles, y: 230 },
  { k: 'rev', t: 'Reviews', icon: Star, y: 340 },
  { k: 'fil', t: 'Filtrado', icon: Filter, y: 450 },
];

export function Acl({ state = 'structure', reduced }: SceneProps) {
  const flow = state === 'flow';
  const fab = state === 'fabricate';
  const D = { x: 600, y: 290 };
  return (
    <Frame title="Menu Catalog · servicio con su aduana" legend={<Legend items={[{ tone: 'ext', label: 'Externo' }, { tone: 'cmd', label: 'Comando' }, { tone: 'evt', label: 'Evento' }, { tone: 'accent', label: 'Dominio' }]} />}>
      <Canvas w={1020} h={560} label="El dominio del catálogo, protegido por una capa anticorrupción con tres piezas de traducción; los externos solo tocan la capa, y los consumidores internos reciben comandos y eventos">
        {(ids) => (
          <>
            <rect x={235} y={50} width={745} height={490} rx={18} className="zone" />
            <Label x={250} y={40} anchor="start">Menu Catalog · servicio</Label>
            <rect x={262} y={110} width={196} height={360} rx={14} fill="color-mix(in srgb, var(--warn-soft) 55%, transparent)" stroke="var(--warn)" strokeDasharray="5 4" />
            <Label x={360} y={100} tone="muted">capa anticorrupción</Label>

            {EXT.map((e, i) => (
              <g key={e.k}>
                <Node x={110} y={e.y} w={180} h={56} kind="ext" icon={e.icon} label={e.t} delay={0.05 * i} />
                <Edge points={[[200, e.y], [270, e.y]]} marker={ids.arrow} />
              </g>
            ))}
            {ACLN.map((a) => (
              <g key={a.k}>
                <Node x={360} y={a.y} w={170} h={56} kind="plain" label={a.t} sub="traduce" highlight={(flow && a.k === 'mo') || (fab && a.k === 'api')} />
                <Edge points={[[445, a.y], [D.x - 88, D.y + (a.y - 290) / 6]]} tone="cmd" dashed marker={ids.arrowCmd} />
              </g>
            ))}
            <Label x={470} y={230} tone="cmd" size={10}>comandos</Label>
            <Node x={D.x} y={D.y} w={170} h={80} kind="core" icon={BookOpen} label="Menu Catalog" sub="el dominio puro" highlight={flow || fab} />
            {CONS.map((cn) => (
              <g key={cn.k}>
                <Edge points={[[D.x + 86, D.y + (cn.y - 290) / 5], [800, cn.y]]} tone="evt" dashed marker={ids.arrowEvt} />
                <Node x={880} y={cn.y} w={160} h={52} kind="cmp" icon={cn.icon} label={cn.t} />
              </g>
            ))}
            <Label x={742} y={200} tone="evt" size={10}>eventos</Label>
            <Edge points={[[960, 120], [1010, 120]]} marker={ids.arrow} />
            <Label x={1000} y={146} anchor="end" size={9}>a Órdenes</Label>

            {flow && (
              <>
                <Packet reduced={reduced} tone="muted" label="40 lasañas (formato ajeno)" points={[[200, 170], [272, 170]]} duration={1.4} repeat repeatDelay={3.2} />
                <Packet reduced={reduced} tone="cmd" label="formato interno" points={[[445, 170], [512, 280]]} duration={1.2} delay={1.4} repeat repeatDelay={3.4} />
                {CONS.map((cn, i) => (
                  <Packet key={cn.k} reduced={reduced} tone="evt" points={[[D.x + 86, D.y + (cn.y - 290) / 5], [800, cn.y]]} duration={1.1} delay={2.7 + i * 0.05} repeat repeatDelay={3.5} w={14} />
                ))}
                <Label x={600} y={360} tone="evt" size={11}>stock actualizado</Label>
              </>
            )}
            <Node x={110} y={515} w={180} h={50} kind="danger" icon={Refrigerator} label="Heladeras Byte" sub="API cruda, sin eventos" show={fab} />
            <Edge points={[[200, 515], [240, 515], [240, 430], [270, 430]]} tone="danger" marker={ids.arrowDanger} show={fab} />
            {fab && (
              <>
                <Packet reduced={reduced} tone="danger" label="datos crudos" points={[[200, 515], [240, 515], [240, 430], [272, 430]]} duration={1.6} repeat repeatDelay={2.6} />
                <Packet reduced={reduced} tone="evt" label="catálogo actualizado" points={[[445, 410], [512, 300]]} duration={1.3} delay={1.6} repeat repeatDelay={2.9} />
                <Label x={360} y={498} tone="evt" size={10}>la capa fabrica el evento</Label>
              </>
            )}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── ACL vs wrapper per third party ───────────────────────── */
export function Wrapper({ reduced }: SceneProps) {
  return (
    <Frame title="Mismo instinto, dos formas" legend={<Legend items={[{ tone: 'ext', label: 'Tercero' }, { tone: 'cmp', label: 'Pieza propia' }]} />}>
      <Canvas w={960} h={500} label="Arriba, ArchColider: una capa de traducción dentro del módulo. Abajo, Myagis-Forest: un microservicio wrapper por cada sistema externo">
        {(ids) => (
          <>
            <Label x={40} y={40} anchor="start" tone="accent" size={12}>ArchColider · una capa dentro del módulo del monolito</Label>
            <rect x={330} y={60} width={560} height={150} rx={16} className="zone zone--accent" />
            <Label x={610} y={228} tone="muted">un módulo del monolito</Label>
            <Node x={130} y={135} w={170} h={52} kind="ext" icon={ChefHat} label="Cocina" delay={0.1} />
            <Edge points={[[215, 135], [360, 135]]} marker={ids.arrow} />
            <Node x={450} y={135} w={170} h={70} kind="plain" icon={Shield} label="Capa de traducción" delay={0.2} />
            <Edge points={[[535, 135], [650, 135]]} tone="cmd" marker={ids.arrowCmd} />
            <Node x={750} y={135} w={170} h={70} kind="core" icon={Layers} label="Dominio" delay={0.3} />

            <Label x={40} y={290} anchor="start" tone="cmp" size={12}>Myagis-Forest · ADR 004 · un wrapper por tercero</Label>
            {[{ t: 'Cocina', y: 340, icon: ChefHat }, { t: 'Heladeras', y: 430, icon: Refrigerator }].map((r, i) => (
              <g key={r.t}>
                <Node x={130} y={r.y} w={170} h={52} kind="ext" icon={r.icon} label={r.t} delay={0.4 + i * 0.1} />
                <Edge points={[[215, r.y], [370, r.y]]} marker={ids.arrow} />
                <Node x={450} y={r.y} w={160} h={60} kind="cmp" icon={Package} label={`Wrapper ${r.t.toLowerCase()}`} sub="microservicio" delay={0.5 + i * 0.1} />
                <Edge points={[[530, r.y], [668, 385]]} tone="cmd" marker={ids.arrowCmd} />
              </g>
            ))}
            <Node x={760} y={385} w={180} h={70} kind="cmp" icon={Server} label="Servicios de negocio" sub="estándar interno" delay={0.7} />
            {!reduced && <Packet reduced={reduced} tone="cmd" points={[[530, 340], [668, 385]]} duration={1.3} repeat repeatDelay={1.5} w={14} />}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── payment facade ───────────────────────── */
export function Facade({ reduced }: SceneProps) {
  const [later, setLater] = useState(false);
  const nets = [
    { t: 'Visa', y: 120 },
    { t: 'Mastercard', y: 250 },
    { t: 'PayPal', y: 380 },
  ];
  return (
    <Frame title="Una sola pieza delante de muchas redes" legend={<Legend items={[{ tone: 'accent', label: 'Fachada propia' }, { tone: 'ext', label: 'Externo' }]} />}
      foot={
        <div className="seg seg--lg" role="group" aria-label="Momento">
          <button type="button" aria-pressed={!later} onClick={() => setLater(false)}>Hoy</button>
          <button type="button" aria-pressed={later} onClick={() => setLater(true)}>Mañana, si la expansión lo exige</button>
        </div>
      }>
      <Canvas w={960} h={500} label={later ? 'La fachada de pagos empieza a hablar directo con una red de tarjetas, paso a paso, sin que el resto del sistema cambie' : 'Los módulos le hablan a una fachada de pagos propia, que hoy delega en un proveedor que conecta con todas las redes'}>
        {(ids) => (
          <>
            <Node x={110} y={180} w={170} h={56} kind="cmp" icon={Inbox} label="Órdenes" />
            <Node x={110} y={320} w={170} h={56} kind="cmp" icon={CalendarClock} label="Suscripciones" />
            <Edge points={[[195, 180], [260, 180], [260, 240], [320, 240]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[195, 320], [260, 320], [260, 270], [320, 270]]} tone="cmd" marker={ids.arrowCmd} />
            <Node x={410} y={255} w={170} h={90} kind="core" icon={CreditCard} label="Payment" sub="fachada · MSG" />
            <Node x={640} y={255} w={160} h={70} kind="ext" icon={Server} label="Proveedor" sub="Stripe o similar" />
            <Edge points={[[495, 255], [558, 255]]} marker={ids.arrow} />
            {nets.map((n) => (
              <g key={n.t}>
                <Node x={870} y={n.y} w={140} h={50} kind="ext" label={n.t} />
                <Edge points={[[722, 255], [760, 255], [760, n.y], [798, n.y]]} marker={ids.arrow} show={!(later && n.t === 'Visa')} />
              </g>
            ))}
            <Edge points={[[495, 225], [520, 225], [520, 100], [798, 100], [798, 115]]} tone="accent" marker={ids.arrowAccent} show={later} />
            <Label x={660} y={90} tone="accent" show={later}>integración directa, de a una red</Label>
            {!later && <Packet reduced={reduced} tone="cmd" label="cobrar" points={[[195, 180], [260, 180], [260, 240], [320, 240], [495, 255], [558, 255]]} duration={2.4} repeat repeatDelay={1} />}
            {later && <Packet reduced={reduced} tone="accent" points={[[495, 225], [520, 225], [520, 100], [798, 100], [798, 113]]} duration={1.8} repeat repeatDelay={1} w={14} />}
            <Label x={300} y={440} tone="text" size={13}>{later ? 'Órdenes y Suscripciones no se enteran del cambio' : 'ningún módulo habla directo con una red de tarjetas'}</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── maps provider (ADR 015) ───────────────────────── */
export function Maps({ reduced }: SceneProps) {
  const ps = [
    { t: 'OpenStreetMap', price: 'Gratis', pro: 'Sin costo, open source' },
    { t: 'TomTom', price: 'Gratis hasta 2.500 pedidos diarios', pro: 'Mejor navegación' },
    { t: 'Mapbox', price: 'Gratis hasta 50.000 pedidos diarios', pro: 'Mapas personalizables' },
    { t: 'Here Maps', price: 'Gratis hasta 250.000 pedidos mensuales', pro: 'Mejores servicios de visualización', pick: true },
  ];
  return (
    <div className="maps">
      <div className="maps__grid">
        {ps.map((p, i) => (
          <motion.div key={p.t} className={`vcard maps__p ${p.pick ? 'is-pick' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <MapIcon size={18} aria-hidden />
            <strong>{p.t}</strong>
            <span className="maps__price">{p.price}</span>
            <span className="maps__pro">{p.pro}</span>
            {p.pick && <span className="maps__badge mono">elegido</span>}
          </motion.div>
        ))}
      </div>
      <motion.div className="maps__gov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Eye size={16} aria-hidden /> <span><strong>Consecuencia aceptada:</strong> vigilar la cantidad de pedidos mes a mes para no empezar a pagar de más sin notarlo.</span>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── metamodel ───────────────────────── */
type MN = { k: string; x: number; y: number; t: string; en: string; lvl: 'k' | 'o'; vals?: string[] };
const MM: MN[] = [
  { k: 'place', x: 250, y: 70, t: 'Lugar', en: 'Place', lvl: 'k', vals: ['App', 'PoS'] },
  { k: 'ordType', x: 560, y: 70, t: 'Tipo de orden', en: 'Order Type', lvl: 'k', vals: ['Instant', 'Reservation', 'Planned'] },
  { k: 'promoRule', x: 760, y: 70, t: 'Regla de promoción', en: 'Promotion Rule', lvl: 'k' },
  { k: 'userType', x: 90, y: 200, t: 'Tipo de usuario', en: 'User Type', lvl: 'k', vals: ['Subscriber', 'Known', 'Occasional', 'PointOfSale'] },
  { k: 'actType', x: 250, y: 200, t: 'Tipo de acción', en: 'Action Type', lvl: 'k', vals: ['Select', 'Pay', 'Grab', 'Schedule', 'List', 'Cancel'] },
  { k: 'ordState', x: 410, y: 200, t: 'Estado de orden', en: 'Order State', lvl: 'k', vals: ['Started', 'Finalized', 'PaymentAwaited', 'Purchased', 'Dispatched', 'Picked', 'Scheduled', 'Canceled'] },
  { k: 'fbType', x: 570, y: 200, t: 'Tipo de feedback', en: 'Feedback Type', lvl: 'k' },
  { k: 'promoType', x: 760, y: 200, t: 'Tipo de promoción', en: 'Promotion Type', lvl: 'k' },
  { k: 'mealType', x: 930, y: 200, t: 'Tipo de comida', en: 'Meal Type', lvl: 'k', vals: ['con jerarquía propia'] },
  { k: 'user', x: 90, y: 400, t: 'Usuario', en: 'User', lvl: 'o' },
  { k: 'act', x: 250, y: 400, t: 'Acción', en: 'Action', lvl: 'o' },
  { k: 'order', x: 410, y: 400, t: 'Orden', en: 'Order', lvl: 'o' },
  { k: 'fb', x: 570, y: 370, t: 'Feedback', en: 'Feedback', lvl: 'o' },
  { k: 'sched', x: 570, y: 470, t: 'Agenda', en: 'Schedule', lvl: 'o' },
  { k: 'promo', x: 760, y: 400, t: 'Promoción', en: 'Promotion/Discount', lvl: 'o' },
  { k: 'menu', x: 410, y: 570, t: 'Menú', en: 'Menu', lvl: 'o' },
  { k: 'gk', x: 170, y: 570, t: 'Ghost Kitchen', en: 'Ghost Kitchen', lvl: 'o' },
  { k: 'meal', x: 930, y: 570, t: 'Comida', en: 'Meal', lvl: 'o' },
];
const P = Object.fromEntries(MM.map((n) => [n.k, n]));
const ME: [string, string, string][] = [
  ['userType', 'actType', 'puede hacer'], ['actType', 'ordState', 'impacta'], ['ordState', 'ordType', 'depende de'],
  ['ordType', 'promoType', 'puede tener'], ['promoRule', 'promoType', 'define'], ['promoType', 'mealType', 'se aplica a'],
  ['place', 'actType', 'sitúa'],
  ['userType', 'user', 'describe'], ['actType', 'act', 'limita'], ['ordState', 'order', 'controla'], ['fbType', 'fb', ''],
  ['promoType', 'promo', 'describe'], ['mealType', 'meal', 'describe'],
  ['user', 'act', 'realiza'], ['act', 'order', 'se aplica a'], ['fb', 'order', 'basado en'], ['order', 'sched', 'se ejecuta según'],
  ['order', 'menu', 'formada por'], ['promo', 'menu', 'aplica a ítems'], ['menu', 'meal', 'formado por'], ['gk', 'menu', 'provee'],
];
const PROMO_PATH = [
  ['promoRule', 'promoType'],
  ['promoType', 'mealType', 'ordType'],
  ['promo', 'menu'],
  [],
];
const PROMO_CAP = [
  'Arriba, una <strong>regla de promoción</strong> define un <strong>tipo de promoción</strong>.',
  'Ese tipo se aplica a <strong>tipos de comida</strong> y se combina con <strong>tipos de orden</strong>: “este descuento, solo para reservas de tal tipo de comida”.',
  'Abajo, una <strong>promoción concreta</strong> aplica esa regla a los ítems de un <strong>menú</strong>, nunca a una comida suelta: así una cocina puede ofrecer su propia promoción sin tocar el resto.',
  '<strong>Cambiar la campaña es tocar arriba.</strong> El partido de abajo no se reescribe.',
];

export function Metamodel({ state = 'levels', reduced }: SceneProps) {
  const promo = state === 'promo';
  const [sel, setSel] = useState<string | null>(null);
  const s = usePhases(4, { interval: 2600, reduced, key: state, auto: promo });
  useEffect(() => setSel(null), [state]);
  const hlSet = new Set<string>(promo ? (s.phase === 3 ? ['promoRule', 'promoType', 'mealType', 'ordType'] : PROMO_PATH[s.phase]) : sel ? [sel, ...ME.filter(([a, b]) => a === sel || b === sel).map(([a, b]) => (a === sel ? b : a))] : []);
  const selN = sel ? P[sel] : null;
  const W = 150, H = 48;
  const center = (k: string) => P[k];
  const edgePts = (a: string, b: string): [number, number][] => {
    const A = center(a), B = center(b);
    if (A.y === B.y) {
      const d = B.x > A.x ? 1 : -1;
      return [[A.x + (d * W) / 2, A.y], [B.x - (d * W) / 2, B.y]];
    }
    if (A.x === B.x) {
      const d = B.y > A.y ? 1 : -1;
      return [[A.x, A.y + (d * H) / 2], [B.x, B.y - (d * H) / 2]];
    }
    // elbow
    const d = B.y > A.y ? 1 : -1;
    return [[A.x, A.y + (d * H) / 2], [A.x, (A.y + B.y) / 2], [B.x, (A.y + B.y) / 2], [B.x, B.y - (d * H) / 2]];
  };
  return (
    <Frame
      title={promo ? 'Seguí una promoción' : 'Metamodelo · reglamento arriba, partido abajo'}
      legend={<Legend items={[{ tone: 'cmd', label: 'Nivel de conocimiento (reglas)' }, { tone: 'cmp', label: 'Nivel operacional (hechos)' }]} />}
      foot={promo ? (
        <Stepper phase={s.phase} count={4} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: PROMO_CAP[s.phase] }} />} />
      ) : (
        <div className="mm-info" aria-live="polite">
          {selN ? (
            <span><strong>{selN.t}</strong> <span className="mono">({selN.en})</span>{selN.vals ? <>: {selN.vals.join(' · ')}</> : null}. {selN.lvl === 'k' ? 'Es una regla: cambiarla no reescribe los hechos de abajo.' : 'Es un hecho del día a día, gobernado por las reglas de arriba.'}</span>
          ) : (
            <span className="eco-info__hint">Tocá una caja para ver sus valores y con qué se conecta.</span>
          )}
        </div>
      )}
    >
      <Canvas w={1020} h={620} label="Metamodelo: arriba el nivel de conocimiento con tipos de usuario, acción, orden, promoción y comida; abajo el nivel operacional con usuario, acción, orden, promoción, menú, comida y ghost kitchen">
        {(ids) => (
          <>
            <line x1={10} x2={1010} y1={300} y2={300} stroke="var(--line-strong)" strokeDasharray="6 6" strokeWidth={1.5} />
            <text x={14} y={290} className="lb lb--cmd lb--masked" style={{ fontSize: 10 }}>nivel de conocimiento</text>
            <text x={14} y={318} className="lb lb--cmp lb--masked" style={{ fontSize: 10 }}>nivel operacional</text>
            {ME.map(([a, b, v]) => {
              const on = hlSet.has(a) && hlSet.has(b);
              const pts = edgePts(a, b);
              const mid = pts.length === 2 ? [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2] : [(pts[1][0] + pts[2][0]) / 2, pts[1][1]];
              return (
                <g key={a + b}>
                  <Edge points={pts} tone={on ? 'accent' : 'muted'} width={on ? 2.2 : 1.4} />
                  {v && <text x={mid[0]} y={mid[1] - 5} textAnchor="middle" className={`lb ${on ? 'lb--accent' : 'lb--muted'}`} style={{ fontSize: 9.5 }}>{v}</text>}
                </g>
              );
            })}
            {MM.map((n, i) => (
              <g key={n.k} onClick={promo ? undefined : () => setSel(sel === n.k ? null : n.k)} onKeyDown={(e) => { if (!promo && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setSel(sel === n.k ? null : n.k); } }} tabIndex={promo ? undefined : 0} role={promo ? undefined : 'button'} aria-label={`${n.t}, ${n.lvl === 'k' ? 'regla' : 'hecho'}`} className="mm-hit">
                <Node x={n.x} y={n.y} w={W} h={H} kind={n.lvl === 'k' ? 'cmd' : 'cmp'} label={n.t} sub={n.en} highlight={hlSet.has(n.k)} dim={hlSet.size > 0 && !hlSet.has(n.k)} delay={reduced ? 0 : i * 0.03} />
              </g>
            ))}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── composition + quality budget ───────────────────────── */
const ZONES = [
  { k: 'fe', t: 'Apps de front-end', x: 30, y: 190, w: 200, h: 240, qa: 'Usabilidad, performance, autonomía', why: 'Tiene que funcionar sin señal. Y un detalle de coherencia: la app del cajero no es otro producto, impersona usuarios y recorre el mismo flujo.' },
  { k: 'cat', t: 'Subsistema de catálogo', x: 270, y: 130, w: 200, h: 390, qa: 'Extensibilidad, mantenibilidad, disponibilidad', why: '“Sin buena disponibilidad no hay flujo de caja.” Con una admisión honesta: disponibilidad resuelta con reinicios y escala vertical; una caída corta sigue siendo posible.' },
  { k: 'ord', t: 'Procesamiento de órdenes', x: 510, y: 220, w: 200, h: 200, qa: 'Confiabilidad, integridad', why: 'La parte que protege el dinero: si una orden se corrompe, hay pérdida directa.' },
  { k: 'pur', t: 'Pasarela de compra', x: 750, y: 250, w: 190, h: 120, qa: 'Seguridad, disponibilidad', why: '“No poder pagar es pérdida directa de plata.”' },
  { k: 'not', t: 'Notificaciones', x: 30, y: 30, w: 200, h: 110, qa: 'Confiabilidad', why: 'Pieza genérica: se alquila y se exige que no pierda avisos.' },
  { k: 'rep', t: 'Reportes', x: 270, y: 20, w: 200, h: 90, qa: 'Confiabilidad', why: 'Pieza genérica, fuera del camino crítico de la venta.' },
];

export function Composition({ reduced }: SceneProps) {
  const [sel, setSel] = useState<string | null>(null);
  const z = ZONES.find((x) => x.k === sel);
  return (
    <Frame title="Composición del sistema y presupuesto de calidad" legend={<Legend items={[{ tone: 'accent', label: 'Centro de gravedad' }, { tone: 'cmp', label: 'Módulo' }, { tone: 'ext', label: 'Externo' }]} />}
      foot={
        <div className="mm-info" aria-live="polite">
          {z ? <span><strong>{z.t}</strong> · <span className="mono">{z.qa}</span>. {z.why}</span> : <span className="eco-info__hint">Tocá un subsistema: ¿qué le pasa al negocio si esa pieza falla?</span>}
        </div>
      }>
      <Canvas w={960} h={620} label="Composición: apps de front-end, subsistema de catálogo, procesamiento de órdenes y pasarela de compra, con notificaciones y reportes arriba y los sistemas externos abajo; catálogo y órdenes son los centros de gravedad">
        {(ids) => (
          <>
            <Edge points={[[230, 310], [270, 310]]} />
            <Edge points={[[470, 320], [510, 320]]} />
            <Edge points={[[710, 310], [750, 310]]} />
            <Edge points={[[845, 370], [845, 440]]} marker={ids.arrow} />
            <Edge points={[[130, 140], [130, 190]]} />
            <Edge points={[[370, 110], [370, 130]]} />
            <Edge points={[[130, 430], [130, 540]]} />
            <Edge points={[[330, 520], [330, 540]]} />
            <Edge points={[[430, 520], [430, 530], [520, 530], [520, 540]]} />
            {ZONES.map((zn) => (
              <g key={zn.k} className="mm-hit" role="button" tabIndex={0} aria-label={`${zn.t}: ${zn.qa}`} onClick={() => setSel(sel === zn.k ? null : zn.k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(sel === zn.k ? null : zn.k); } }}>
                <rect x={zn.x} y={zn.y} width={zn.w} height={zn.h} rx={14} className={`zone ${sel === zn.k ? 'zone--accent' : ''}`} fill={sel === zn.k ? 'color-mix(in srgb, var(--accent-soft) 40%, transparent)' : 'transparent'} style={{ fill: sel === zn.k ? undefined : 'color-mix(in srgb, var(--surface) 40%, transparent)' }} />
                <text x={zn.x + 12} y={zn.y + 20} className="lb lb--muted" style={{ fontSize: 10 }}>{zn.t}</text>
                <text x={zn.x + 12} y={zn.y + zn.h - 10} className="lb lb--cmp" style={{ fontSize: 9, textTransform: 'none', letterSpacing: 0 }}>{zn.qa}</text>
              </g>
            ))}
            <g className="pe-none">
            <Node x={130} y={90} w={170} h={40} kind="cmp" icon={Bell} label="Notificaciones" />
            <Node x={370} y={68} w={170} h={36} kind="cmp" icon={BarChart3} label="Reportes" />
            <Node x={130} y={260} w={170} h={50} kind="cmp" icon={Smartphone} label="App móvil" />
            <Node x={130} y={340} w={170} h={50} kind="cmp" icon={Store} label="Punto de venta" />
            <Node x={370} y={180} w={170} h={46} kind="cmp" icon={MessageSquare} label="Feedback" />
            <Node x={370} y={260} w={170} h={46} kind="cmp" label="Promoción / Descuento" />
            <Node x={370} y={340} w={170} h={54} kind="core" icon={BookOpen} label="Menu Catalog" highlight={!reduced && sel === null} />
            <Node x={370} y={420} w={170} h={46} kind="cmp" label="Retiro de comida" />
            <Node x={610} y={280} w={170} h={50} kind="cmp" icon={CalendarClock} label="Agenda" />
            <Node x={610} y={360} w={170} h={54} kind="core" icon={Inbox} label="Ordering" highlight={!reduced && sel === null} />
            <Node x={845} y={305} w={160} h={50} kind="cmp" icon={CreditCard} label="Compra" />
            <Node x={845} y={470} w={170} h={50} kind="ext" label="Sistemas de pago" />
            <Node x={130} y={570} w={170} h={50} kind="ext" icon={MapPin} label="Proveedor de mapas" />
            <Node x={330} y={570} w={170} h={50} kind="ext" icon={ChefHat} label="Ghost Kitchen" />
            <Node x={530} y={570} w={180} h={50} kind="ext" icon={Refrigerator} label="Gestión de heladeras" />
            </g>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

