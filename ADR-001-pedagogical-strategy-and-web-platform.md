# ADR 001: Pedagogical Strategy, Narrative Structure, and Web Platform Design for the Farmacy Food Kata Analysis

- **Date:** 2026-09-08
- **Last amended:** 2026-09-10 (full revision to match the shipped article — see §7)
- **Status:** Accepted
- **Decision Makers:** Felix Andersson & ZCode (GLM 5.3) — original draft with Antigravity (Pair Architecture / Engineering)

---

## 1. Context and Problem Statement

The primary objective of this project is to foster **deep software architecture learning** through a chronological reconstruction of the winning production design from the *O'Reilly Software Architecture Kata* (Fall 2020: Farmacy Food), bridging hands-on trade-offs with the theoretical foundations from *Fundamentals of Software Architecture* (Mark Richards & Neal Ford) and *Viewpoints and Perspectives* (Rozanski & Woods).

After cloning and auditing the 10 original participant repositories in [fall-2020-farmacy-food/](./fall-2020-farmacy-food/), three structural challenges emerged:

1. Treating all participant proposals symmetrically in flat prose causes **high cognitive overhead**, dilutes the conceptual cohesion of the winning system (ArchColider), and prevents readers from constructing a solid, unified mental model.
2. The winning solution's value lies in its **reasoning sequence** (business → numbers → principles → style → design → cloud → cost): revealing a decision before its motivating problem appears is a pedagogical spoiler that turns the reconstruction back into a document dump.
3. A static, flat Markdown document cannot gate depth behind reader intent (concept glosses, decision cards), cannot interleave the original repo artifacts (diagrams, whiteboards, spreadsheets, slide decks) at their narrative moment, and limits reading navigation on a viewport-width layout.

A later editorial constraint (2026-09-09/10 review passes) sharpened the scope: the article focuses **exclusively on ArchColider**; the runner-up teams appear only as a one-time podium counterpoint, not as recurring analysis threads.

---

## 2. Considered Alternatives

### Option 1: Individual Monographic Chapters ("Team by Team")
- **Description:** A sequential, independent chapter for each team from beginning to end.
- **Verdict:** *Declined.* Highly redundant (repeats the business requirements in every chapter) and passive (forces readers to retain multiple incomplete architectures in memory and reconcile them manually).

### Option 2: Symmetric Phase-by-Phase Comparison in Plain Text
- **Description:** Every phase grants identical narrative weight to all teams in consecutive paragraphs.
- **Verdict:** *Declined.* Induces cognitive fatigue and affords equal pedagogical relevance to complete, battle-tested winning designs versus partial prototypes from runner-up submissions.

### Option 3: Pure Case Study Followed by an Appendix of Alternatives
- **Description:** 100% ArchColider in the first half; a closing catalog of other submissions in the second half.
- **Verdict:** *Declined.* Destroys live dialectical tension and hides trade-offs behind separate appendices.

### Option 4: "Winning-Spine" Chronological Reconstruction on an Interactive Astro Platform (Selected)

---

## 3. Decision

We adopt **Option 4**, materialized as three layers of decisions.

### 3.1 Pedagogical and Narrative Structure

- **ArchColider as the sole spine.** The article reconstructs how one team reasoned, in their own working order: business ground → podium context → decision principles → architecture style → domain split → physical-world engineering → the subscriber's meal journey → cloud topology → annual cost. Other teams exist only in §2 ("The podium's dilemma") as three position cards (ArchColider / Myagis-Forest / Jedis) framing the same question from opposite answers.
- **No spoilers.** A concept, diagram, or ADR may only appear when the problem that motivated it has appeared in the story. Enforced editorially in the content files.
- **Everything contextualized in natural language.** Physical-world analogies over jargon; no frontend-bias; no library named without its role. The brief (users, systems, numbers, out-of-scope) lives entirely in the main thread, never behind a click.
- **Reader participation.** "Pause and predict" callouts before key reveals (e.g. the offline PIN), and "transferable lesson" callouts after.
- **Primary-source fidelity.** Every fact is verifiable against the original repository. The repo's artifacts are integrated at their narrative moment: original diagrams, the judges' semifinal deck (jury names and the seven-criterion rubric), `Questions.md` client questions, the 2020-10-29 whiteboards, the cost spreadsheet (including its raw assumptions), and the proposal deck's unique diagrams. Claims that cannot be verified against a source are softened or dropped; known internal contradictions (DeploymentView.md vs ADR 014) follow the ADR and are documented.
- **Depth is opt-in.** Concepts and decision details open in modals; the main thread stays readable end-to-end. Bureaucratic ADR statuses are never shown.

### 3.2 Content Architecture (data-driven, one renderer, two languages)

- **Typed content blocks** (`src/data/article/types.ts`): a `Block` union (`p | h3 | list | cards | figure | stats | callout | contextDiagram | table | decisionMap | decision | spacer`). All editorial content is data, not markup.
- **Two language editions as data**: `src/data/article/es.ts` and `src/data/article/en.ts` implement the same `ArticleContent` interface. `src/components/article/BlockRenderer.astro` renders any block; `src/components/article/Article.astro` owns layout, TOC and all modal shells for both editions. Adding content means touching data files only.
- **Concept deep dives** (`src/data/article/concepts.ts`): 14 bilingual entries (`kata, rfp, adr, monolito-modular, entity-trap, event-sourcing, actor-model, message-queue, ddd, vpc, tco, telemetry, acl, cqrs`), embedded inline as `concept-chip` buttons that open a native `<dialog>` with the plain-language explanation. A chip may only appear in the section where the concept first becomes necessary.
- **Curated decision map** (`src/data/article/decision-map.ts`): the 16 original ADRs are **not** dumped on the reader. Ten decisions that actually define the architecture are curated into three pillars, each expressed as problem → decision → trade-off with a link to the original ADR on GitHub. Inline `decision` blocks render a one-line summary card; the full card (including embedded figures) opens in a modal.
- **Figures** are original ArchColider artifacts served from `public/img/` (18 repo originals + 9 artifacts extracted from the repo's whiteboard PDF and proposal PPTX). No lightbox: images render full-width and are self-sufficient.

### 3.3 Platform, Layout and Interaction

- **Framework:** **Astro** (static, zero client framework) at the repository root, styled with **Tailwind CSS 3**, dark-mode-first aesthetic.
- **Language routing:** English is the default at `/` (`src/pages/index.astro`), Spanish at `/es` (`src/pages/es.astro`); `vercel.json` redirects legacy `/en` → `/`. A header switcher (inline SVG globe) links both editions.
- **Layout contract:** the shell uses the **full viewport width** with fixed paddings only (`px-5 sm:px-8 lg:px-10`); one normalized content width for every block; the **TOC is a collapsible rail pinned to the left edge** — a dot rail with tooltips by default, expandable to the full index (state persisted in `localStorage` under `katarch-toc-expanded`), with active-section tracking via `IntersectionObserver`.
- **Typography floor:** all reading text ≥ 1rem; only mono uppercase decorative labels are 0.875rem. Figure captions are dimmed but full-size.
- **Modals and scroll lock:** native `<dialog>` elements. Because some embedded WebViews never fire the dialog `close` event, scroll unlock is driven by a `MutationObserver` on the `open` attribute of every dialog (`src/scripts/article-interactions.ts`). Modal body text renders raw HTML so decision modals can embed figures.
- **Interaction script:** a single delegated script handles modal open/close, concept chips (keyboard included), and TOC behavior. The hero has no meta block (case/winner/reading-time/sources row removed by editorial decision).

---

## 4. Consequences

### Positive
- **Maximum pedagogical effectiveness:** the reader internalizes one coherent architecture and its reasoning order; every later decision has a hook planted earlier (e.g. the traceability row "nobody left without their meal" → the offline PIN).
- **Traceability to primary sources:** every claim and figure links back to the original repo; the judges' own rubric is quoted as the evaluation standard.
- **Low marginal cost of editorial change:** new content is a data edit; both editions share one renderer, one interaction script, one modal system.
- **Production-ready deployment:** Vercel static hosting with `/en` legacy redirects; sub-second loads, no client framework.

### Negative / Incurred Overhead
- Content changes must be hand-synchronized between `es.ts` and `en.ts` (and concepts/decisions in both languages).
- Embedded figures increase page weight (~27 images); accepted because they are the pedagogical evidence, and Astro ships them without JS.
- The modal `set:html` renderer trusts content files as trusted input — safe because they are first-party, but it means decision text is code-adjacent data.

---

## 5. Rejected Ideas Worth Remembering
- **Raw ADR explorer (16 entries, status filters):** superseded by the curated 10-decision map; the full catalog is linked from the closing section instead.
- **Matrix deep-dive glossary (32 trade-off combos):** superseded by the 14 contextual concept chips — depth now appears where the concept is needed, not in a separate matrix.
- **Mermaid-rendered diagrams:** replaced by a semantic-HTML context diagram plus the original repo figures; original artifacts beat re-drawings for evidentiary value.
- **Runner-up insight cards / GitHub line anchors for other teams:** dropped when the article narrowed to the ArchColider spine; the closing section points readers to compare repositories themselves.
- **Image lightbox:** removed — it opened smaller than the already full-width figures.

---

## 6. References and Evidence
- Cloned participant repositories: `fall-2020-farmacy-food/` (kept locally, not tracked in git).
- Official competition repository: [TheKataLog](https://github.com/TheKataLog)
- Theoretical foundation: *Fundamentals of Software Architecture* (Richards & Ford); *Viewpoints and Perspectives* (Rozanski & Woods); Nygard's ADR format.
- Visual system details: [DESIGN.md](./DESIGN.md); public entry points: `/` (EN, default), `/es` (ES).
- Key implementation files: `src/data/article/` (types, es, en, concepts, decision-map), `src/components/article/` (Article, BlockRenderer, DecisionCard, ContextDiagram, DecisionMap), `src/scripts/article-interactions.ts`.

---

## 7. Amendment History
- **2026-09-10 — Full revision.** Original ADR described the pre-rebuild platform in `web/` (Mermaid diagrams, 32 matrix modals, a 16-ADR explorer, Spanish at `/`), which no longer exists. This revision documents the shipped architecture: data-driven bilingual content, curated decision map, concept chips, English-default routing, full-width layout with TOC dot rail, native-dialog modals with observer-based scroll lock, and the 2026-09-09/10 integration of the repo's artifacts (judges' rubric and jury, whiteboards, payment facade, anti-corruption layer, subscriber lifecycle, volumetry extras).
