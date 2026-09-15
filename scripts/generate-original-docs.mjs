// Build-time generator: renders the original ArchColider markdown docs to HTML
// and writes src/data/article/original-docs.ts. Spanish translations live in
// prose/docs-es/<id>.md and are compiled to htmlEs when present.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const ROOT = 'fall-2020-farmacy-food/ArchColider';
const ES_DIR = 'prose/docs-es';
const GH_BLOB = 'https://github.com/TheKataLog/ArchColider/blob/master/';
const GH_RAW = 'https://raw.githubusercontent.com/TheKataLog/ArchColider/master/';

const DOCS = [
  // [repo path, id, title ES, title EN]
  ['1.ProblemBackground/BusinessDrivers.md', 'business-drivers', 'Impulsores de negocio', 'Business drivers'],
  ['1.ProblemBackground/BusinessGoalAndScope.md', 'business-goal', 'Objetivo de negocio y alcance', 'Business goal and scope'],
  ['1.ProblemBackground/Constraints.md', 'constraints', 'Restricciones', 'Constraints'],
  ['1.ProblemBackground/FunctionalRequirements.md', 'functional-reqs', 'Requerimientos funcionales', 'Functional requirements'],
  ['1.ProblemBackground/Stakeholders.md', 'stakeholders', 'Stakeholders', 'Stakeholders'],
  ['2.SolutionBackground/Assumptions.md', 'assumptions', 'Supuestos', 'Assumptions'],
  ['2.SolutionBackground/RisksAndSensitivePoints.md', 'risks', 'Riesgos y puntos sensibles', 'Risks and sensitive points'],
  ['2.SolutionBackground/SolutionOverview.md', 'solution-overview', 'Visión general de la solución', 'Solution overview'],
  ['2.SolutionBackground/SystemAppoach.md', 'system-approach', 'Enfoque del sistema', 'System approach'],
  ['2.SolutionBackground/Tradeoffs.md', 'tradeoffs', 'Trade-offs', 'Trade-offs'],
  ['3.ViewsAndPerspectives/Concurrency.md', 'concurrency', 'Concurrencia', 'Concurrency'],
  ['3.ViewsAndPerspectives/CostAnalysis.md', 'cost-analysis', 'Análisis de costos', 'Cost analysis'],
  ['3.ViewsAndPerspectives/DeploymentView.md', 'deployment', 'Vista de despliegue', 'Deployment view'],
  ['3.ViewsAndPerspectives/InformationModels.md', 'info-models', 'Modelos de información', 'Information models'],
  ['3.ViewsAndPerspectives/Security.md', 'security', 'Seguridad', 'Security'],
  ['3.ViewsAndPerspectives/UserScenariosPerspective.md', 'user-scenarios', 'Escenarios de usuario', 'User scenarios'],
  ['3.ViewsAndPerspectives/infrastructure/Authentication.md', 'authentication', 'Autenticación', 'Authentication'],
  ['3.ViewsAndPerspectives/infrastructure/Infrastructure-services-and-virtual-hardware.md', 'infra-services', 'Servicios de infraestructura y hardware virtual', 'Infrastructure services and virtual hardware'],
  ['3.ViewsAndPerspectives/infrastructure/InfrastructureAndNetworking.md', 'infra-network', 'Infraestructura y redes', 'Infrastructure and networking'],
  ['3.ViewsAndPerspectives/infrastructure/InfrastructureScalingAndBalancing.md', 'infra-scaling', 'Escalado y balanceo', 'Scaling and balancing'],
  ['Questions.md', 'questions', 'Preguntas al cliente', 'Questions to the client'],
  ['Glossary.md', 'glossary', 'Glosario', 'Glossary'],
  ['The Script.md', 'script', 'Guion de la presentación final', 'Final presentation script'],
  // ADRs (note: the double space in 013 and the "Sytem" typo in 003 are the team's own)
  ['4.ADRs/001 We are using ADR (template).md', 'adr-001', 'ADR 001 · Usamos ADR (plantilla)', 'ADR 001 · We are using ADR (template)'],
  ['4.ADRs/002 System approach.md', 'adr-002', 'ADR 002 · Enfoque del sistema', 'ADR 002 · System approach'],
  ['4.ADRs/003 Tracing and Monitoring Sytem.md', 'adr-003', 'ADR 003 · Sistema de trazado y monitoreo', 'ADR 003 · Tracing and Monitoring Sytem'],
  ['4.ADRs/004 Health check endpoints.md', 'adr-004', 'ADR 004 · Endpoints de health-check por servicio', 'ADR 004 · Health check endpoints'],
  ['4.ADRs/005 Service readiness checks.md', 'adr-005', 'ADR 005 · Chequeos de preparación de servicios', 'ADR 005 · Service readiness checks'],
  ['4.ADRs/006 Zero trust architecture.md', 'adr-006', 'ADR 006 · Arquitectura zero trust', 'ADR 006 · Zero trust architecture'],
  ['4.ADRs/007 Event sourcing usage.md', 'adr-007', 'ADR 007 · Uso de event sourcing', 'ADR 007 · Event sourcing usage'],
  ['4.ADRs/008 At least once delivery for ready to pay order.md', 'adr-008', 'ADR 008 · Entrega al menos una vez para la orden lista a pagar', 'ADR 008 · At least once delivery for ready to pay order'],
  ['4.ADRs/009 Rely on payment service provider.md', 'adr-009', 'ADR 009 · Delegar en un proveedor de pagos', 'ADR 009 · Rely on payment service provider'],
  ['4.ADRs/010 Feedback System separation.md', 'adr-010', 'ADR 010 · Separación del sistema de feedback', 'ADR 010 · Feedback System separation'],
  ['4.ADRs/011 Every meal delivery has pick up pin code.md', 'adr-011', 'ADR 011 · Cada entrega lleva un código PIN de retiro', 'ADR 011 · Every meal delivery has pick up pin code'],
  ['4.ADRs/012 Stale data from fridges.md', 'adr-012', 'ADR 012 · Datos desactualizados de las heladeras', 'ADR 012 · Stale data from fridges'],
  ['4.ADRs/013  Cache the meal catalogue.md', 'adr-013', 'ADR 013 · Cachear el catálogo de comidas', 'ADR 013 · Cache the meal catalogue'],
  ['4.ADRs/014 Deployment Strategy.md', 'adr-014', 'ADR 014 · Estrategia de despliegue', 'ADR 014 · Deployment Strategy'],
  ['4.ADRs/015 Integration with Map Providers.md', 'adr-015', 'ADR 015 · Integración con proveedores de mapas', 'ADR 015 · Integration with Map Providers'],
  ['4.ADRs/016 Use of Infrastructure as Code.md', 'adr-016', 'ADR 016 · Uso de infraestructura como código', 'ADR 016 · Use of Infrastructure as Code'],
];

function encodePath(p) {
  // URL-encode each segment (spaces in original repo paths), keep slashes
  return p.split('/').map(encodeURIComponent).join('/');
}

function rewriteLinks(html, docDir) {
  // Resolve a relative link against the doc's folder, then map into the GitHub repo
  const resolve = (href) => {
    const clean = href.split('#')[0];
    if (!clean) return null;
    const joined = posix.normalize(posix.join(docDir, clean));
    return joined;
  };
  // images
  html = html.replace(/(src)="([^"]+)"/g, (m, attr, href) => {
    if (/^(https?:|data:|#)/.test(href)) return m;
    const abs = resolve(href);
    if (!abs) return m;
    return `${attr}="${GH_RAW}${encodePath(abs)}"`;
  });
  // links to repo files (md/images), keep pure anchors and external links
  html = html.replace(/(href)="([^"]+)"/g, (m, attr, href) => {
    if (/^(https?:|data:|mailto:)/.test(href)) return m;
    if (href.startsWith('#')) {
      return `${attr}="#user-content-${href.slice(1)}"`;
    }
    const abs = resolve(href);
    if (!abs) return m;
    return `${attr}="${GH_BLOB}${encodePath(abs)}"`;
  });
  return html;
}

const entries = DOCS.map(([file, id, titleEs, titleEn]) => {
  const md = readFileSync(join(ROOT, file), 'utf8');
  const docDir = posix.dirname(file);
  let html = micromark(md, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
  html = rewriteLinks(html, docDir);
  // Strip the leading H1 (the modal shows its own title) to avoid duplication
  html = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/, '');
  let htmlEs = null;
  const esPath = join(ES_DIR, `${id}.md`);
  if (existsSync(esPath)) {
    const mdEs = readFileSync(esPath, 'utf8');
    let es = micromark(mdEs, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
    es = rewriteLinks(es, docDir);
    es = es.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/, '');
    htmlEs = es;
  } else {
    console.warn(`  ! no Spanish translation for ${id} (${esPath})`);
  }
  return { id, file, titleEs, titleEn, html, htmlEs };
});

const ts = `/**
 * Original ArchColider docs, rendered to HTML at build time from
 * fall-2020-farmacy-food/ArchColider via scripts/generate-original-docs.mjs (micromark + GFM).
 * Relative images/links are rewritten to the TheKataLog GitHub repo.
 * htmlEs is our (unofficial) Spanish translation, from prose/docs-es/<id>.md.
 *
 * GENERATED FILE — regenerate with: node scripts/generate-original-docs.mjs
 */

export interface OriginalDoc {
  id: string;
  file: string;
  titleEs: string;
  titleEn: string;
  html: string;
  htmlEs: string | null;
}

export const GH_BLOB_BASE = '${GH_BLOB}';

export const ORIGINAL_DOCS: OriginalDoc[] = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync('src/data/article/original-docs.ts', ts);
console.log(`Wrote ${entries.length} docs`);
for (const e of entries) {
  console.log(`  ${e.id}: ${e.html.length} chars${e.htmlEs ? ` (es: ${e.htmlEs.length})` : ' (NO ES)'}`);
}
