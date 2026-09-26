import type { Chapter } from '../content/types';
import { CONCEPTS } from '../content/concepts';
import { ORIGINAL_DOCS } from '../content/original-docs';
import { DECISIONS } from '../content/decision-map';

/** Collect only the concepts, docs and decisions a chapter actually references. */
export function chapterRefs(ch: Chapter) {
  const json = JSON.stringify(ch);
  const conceptIds = new Set([...json.matchAll(/data-concept=\\"([\w-]+)\\"/g)].map((m) => m[1]));
  const docIds = new Set([...json.matchAll(/data-doc=\\"([\w-]+)\\"/g)].map((m) => m[1]));
  (ch.extraDocs ?? []).forEach((d) => docIds.add(d));
  const decisionIds = new Set<string>();
  for (const s of ch.steps) {
    for (const b of s.blocks) if (b.t === 'decision') decisionIds.add(b.id);
    if (s.visual?.scene === 'decision' && s.visual.props?.id) decisionIds.add(String(s.visual.props.id));
  }

  const decisions: Record<string, any> = {};
  for (const d of DECISIONS) {
    if (!decisionIds.has(d.id)) continue;
    decisions[d.id] = { title: d.title.es, problem: d.problem.es, decision: d.decision.es, tradeoff: d.tradeoff.es, adrs: d.adrs };
    d.adrs.forEach((a) => docIds.add('adr-' + a.id));
    for (const m of d.decision.es.matchAll(/data-concept="([\w-]+)"/g)) conceptIds.add(m[1]);
  }
  const concepts: Record<string, any> = {};
  for (const id of conceptIds) if (CONCEPTS[id]) concepts[id] = { title: CONCEPTS[id].title.es, body: CONCEPTS[id].body.es };
  const docs: Record<string, any> = {};
  for (const d of ORIGINAL_DOCS) if (docIds.has(d.id)) docs[d.id] = { title: d.titleEs, file: d.file, html: d.html, htmlEs: d.htmlEs };
  return { concepts, docs, decisions };
}
