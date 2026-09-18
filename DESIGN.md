# DESIGN.md — KatArch article surface

Recorded 2026-09-18 from the built world. Ground truth is the shipped code: tokens, band and colophon live in `src/layouts/Layout.astro` (the direction contract is its body comment); all article CSS lives in `src/components/article/Article.astro`; `BlockRenderer.astro`, `DecisionCard.astro`, `ContextDiagram.astro` and `DecisionMap.astro` are class consumers with no styles of their own; interaction behavior lives in `src/scripts/article-interactions.ts`.

## Direction contract

- **THESIS:** one chronological walkthrough of a real architecture case (Farmacy Food / ArchColider, O'Reilly Software Architecture Kata Fall 2020), formatted as the audience's native document: a numbered engineering memo (RFC lineage). Refuses the docs-template look and the terminal-neon look this category ships.
- **OWN-WORLD:** laid-paper memo. Light is a specification on laid paper (`#f4efe3` family, warm inks, one reference-blue `#1e42a8` accent, amber for errata). Dark is the same memo under a desk lamp (`#161310` family, parchment inks, `#a3b8f3` blue, `#dca75f` amber) — and dark is the default. Courier Prime carries the document apparatus (band, masthead, § numbers, gutter numerals, tags, dt labels, stat values, fig prefixes, colophon); Source Serif 4 carries all reading; hairline rules; 2px paper corners.
- **STORY:** the visitor reads a decision memo where every claim stays traceable: paragraphs numbered in the gutter, doc chips as citation apparatus, decisions as status blocks, callouts as errata, figures as pasted plates captioned "Fig. N —".
- **FIRST VIEWPORT:** slim document band (Courier wordmark, doc id `KATA/2020-FALL`, repos link, ES/EN switch, lamp), memo masthead fields (Documento / Serie / Estado), two-tone ink+blue serif title, body flowing in a numbered gutter column on wide screens.
- **FORM:** replacement world. Roll record: impeccable concept-seed `a0855f1c`, assigned direction 5 of the grounded list, mode Read; the direction decision was served to the user, no answer was received, the assigned direction proceeded unattended (declared).

## System

### Palette

Tokens are CSS variables in `src/layouts/Layout.astro`, defined `:root` (light) and `.dark` (dark). Values below are light / dark.

- **Paper family (surfaces):** `--paper` `#f4efe3` / `#161310` — the desk, page background; `--paper-raised` `#fbf8ee` / `#1f1b15` — sheets: cards, masthead, index card, stat cells, modal sheets; `--paper-deep` `#ede7d6` / `#29241b` — recessed: table heads, code background, reading-guide sheets, diagram nodes, hovers.
- **Ink family:** `--ink` `#241f14` / `#e9e1cb` — reading; `--ink-2` `#6e6651` / `#b1a78d` — secondary reading (captions, dd, values, colophon); `--ink-3` `#7d7460` / `#8d8368` — tertiary apparatus (index dots, separators, close glyph, diagram column titles).
- **Rules:** `--rule` `#d8cfb6` / `#3a3428` — the standard 1px divider and card border; `--hairline` `#c6bb9e` / `#484130` — the crisper edge, reserved for pasted plates, citation chips, modal sheets, and the dashed guide border.
- **Reference blue:** `--accent` `#1e42a8` / `#a3b8f3`; `--accent-strong` `#16307d` / `#c8d4f9` (link hover); `--accent-wash` `#e6e5f2` / `#232733` (text selection, reference errata, active index items, diagram center).
- **Errata amber:** `--amber` `#8a4d08` / `#dca75f` with `--amber-wash` `#f2e6cb` / `#2b2317` — the amber errata tone; the lamp's sun icon is the only amber outside errata.
- **Elevation:** `--shadow-lift` — `0 1px 2px rgb(36 31 20 / 0.08), 0 6px 24px rgb(36 31 20 / 0.07)` light / `0 1px 2px rgb(0 0 0 / 0.4), 0 10px 32px rgb(0 0 0 / 0.35)` dark — modal sheets only.
- Dark is the default: `<html>` ships `class="dark"`; the inline theme script removes it only when `localStorage.theme === 'light'`.

**The One Reference Rule.** Blue is the only accent on any surface — links, § numbers, fig prefixes, tags, stat values, dt labels, active index items, the lens frame, the diagram center. Amber never leaves errata and the lamp icon; no third hue exists.

**The Paper Step Rule.** Depth between surfaces is a step in the paper family (paper → raised → deep) edged by a rule, never a shadow.

**The White Plate Rule.** Figure and document images sit on `#ffffff` pasted plates with a hairline border in both themes; plates never invert in the dark.

### Type scale

Two faces, loaded once in the layout. Courier Prime (400/700, italic 400; fallback Courier New) is document apparatus only; Source Serif 4 (optical-size axis 8–60; 400/600/700/800, italic 400; fallback Georgia) is all reading. Body is Source Serif 4; `.mono`, `code`, `pre` are Courier Prime.

- **Apparatus (Courier):** labels and values sit in a compressed `0.66–0.88rem` band; labeled text is uppercase with `0.12–0.2em` tracking (tags `0.16em`, doc id `0.14em`, phase dividers `0.2em`). Band controls `0.8rem`; field values and colophon `0.82rem`; micro-labels `0.68–0.74rem`; tooltips `0.78rem`; inline code `0.88em`; doc-table heads `0.85em`; gutter numerals `0.68rem`. Sanctioned oversizes: the wordmark (`1.05rem`/700), the § numerals (`0.62em` of their title), and the stat values (`1.45rem`/700) — the memo's measurements.
- **Reading (Source Serif 4):** hero `clamp(2rem, 4.6vw, 3.25rem)`/800/−0.02em at line-height 1.1, capped `44ch`, two-tone (ink line + blue second line); section title `clamp(1.5rem, 3vw, 1.95rem)`/800/−0.02em; h3 `1.16rem`/700; card and status titles `1.02–1.08rem`/700; body `clamp(1.06rem, 0.64rem + 0.36vw, 1.26rem)`/400 at line-height 1.78 in a `46rem` column; secondary reading `0.95–1rem` at `1.45–1.72` in ink-2.

**The Apparatus/Reading Split.** Courier never carries a sentence of reading; Source Serif never labels apparatus. The big type scale lives in the serif article; the mono stays furniture.

### Components

The shell runs `82rem` (band inner and article shell); the reading column caps at `46rem`; sections separate by `3.75rem` with `1.2rem` between blocks and `0.9rem` inside grids. Every surface is a 2px paper corner with a 1px rule border unless noted; no card casts a shadow.

- **Document band** (sticky, `3.4rem` tall): Courier wordmark `1.05rem`/700; doc id `KATA/2020-FALL` at `0.72rem`/`0.14em`; repos link with a 10px stroke arrow; ES/EN switch in a 1px-rule box (active side blue/700); lamp toggle with amber sun icon. At ≤40rem the link label hides and the doc id shrinks.
- **Reading-position rule:** fixed 2px blue bar at the viewport top, width tracking scroll (75ms linear).
- **Memo masthead:** paper-raised box (≤`46rem`), three key/value rows (Documento / Serie / Estado) as Courier `0.68rem` uppercase keys + `0.82rem` values on a `6.5rem` column grid.
- **§-numbered sections:** CSS counter `ksec`; `§N` in Courier 700 at `0.62em`, blue, raised `0.28em` before each serif section title. Phase changes get centered Courier `0.72rem`/`0.2em` labels hung between 1px rules.
- **Numbered gutter** (≥72rem): the article gains a `3.4rem` left gutter; each prose paragraph increments counter `kpara` and shows a right-aligned Courier `0.68rem` numeral in ink-2, turning blue on paragraph hover. Reading-guide prose is excluded — annotations, not memo body.
- **Attachment cards:** rule-bordered paper-raised blocks with Courier uppercase tags; grid 1 column → 3 columns at 48rem (2-column variant), `0.9rem` gaps.
- **Stats (measurements row):** a ruled register — cells on paper-raised separated by 1px rule-colored gaps; value Courier `1.45rem`/700 blue; label serif `0.95rem` ink-2; 2 → 4 columns at 48rem.
- **Errata callouts:** three tones — `reference` (blue border on accent-wash), `amber` (amber border on amber-wash), `note` (rule border on paper-raised, label prefixed with an em dash); label Courier `0.74rem` uppercase.
- **Figures (pasted plates):** counter `kfig`; image on a `#ffffff` plate with hairline border; caption serif `0.95rem` ink-2 prefixed `Fig. N —` in Courier 700 blue; lens magnifier (2px blue frame); reading guide clipped under the plate as a dashed-hairline sheet on paper-deep.
- **Register tables:** bordered box; Courier uppercase caption and heads (heads on paper-deep); serif 600 nowrap row heads; `0.98rem` cells.
- **Decision status blocks:** rule border plus a `3px double` ink-3 top rule on paper-raised; Courier `0.7rem` uppercase blue dt labels; serif dd in ink-2 (strong in ink); ADR citation row under a top rule.
- **Citation chips (doc refs):** inline Courier `0.78em`/700 blue on paper-raised, hairline border, 11px file glyph; hover/focus shifts the border to blue.
- **Glossary chips (concepts):** inline serif 600 with a 1px dotted blue underline; hover/focus turns the term blue. A term, not a button — no box.
- **Memo index (TOC rail, ≥72rem):** sticky; collapsed = `3rem` dot rail (0.5rem square indicators at 1px radius in ink-3; active = blue + 3px accent-wash ring); expanded = `16rem` index (Courier phase + serif 600 title; active blue on accent-wash); ink-on-paper Courier tooltips.
- **Context diagram (plate zero):** ruled sheet; Courier column titles; nodes on paper-deep with hairline borders; center cell with `1.5px` blue border on accent-wash; blue stroke arrows. At ≤40rem it stacks to one column and the arrows rotate 90°.
- **Decision map:** serif pillar heads; entries are full-width rule-bordered rows (serif 600 title + Courier `0.8rem` ADR string) that anchor-jump to the inline status blocks.
- **Modals (paper sheets):** native `<dialog>`; backdrop `rgb(15 13 9 / 0.62)` + 3px blur; sheet = paper-raised, hairline border, 2px corners, `var(--shadow-lift)` — the only shadowed surface. Concept sheets ≤`40rem` wide; original-doc sheets ≤`76rem`; 2rem square close button whose hover border turns blue.
- **Colophon:** centered Courier `0.82rem` ink-2 lines over a top rule.

### Interaction

- **Lamp (theme):** toggle persists to `localStorage`; dark is default; paper and ink cross-fade `0.2s ease`; state is re-applied after ClientRouter swaps so light readers never flash dark. Dark mode tunes the scrollbar (6px, hairline thumb) — browser furniture, not a surface.
- **Modals:** concept and original-doc sheets; page scroll locks while any dialog is open (body overflow + `scrollbar-gutter: stable` + width compensation) and focus returns to the trigger; closing is detected by watching the `open` attribute (MutationObserver) because embedded webviews never fire `dialog` close events; backdrop click closes.
- **Lens:** hover shows a "click to enable the lens" hint; first click arms it, second disarms; renders the image at 1:1 natural pixel scale in a frame at least `max(340px, 50% of the diagram)` wide; lazy images are warmed with `decode()` on mouseenter.
- **Memo index:** IntersectionObserver (`rootMargin: -15% 0px -70% 0px`) highlights the active section in both dots and expanded list; expansion persists in `localStorage`; hover tooltips on the dots.
- **Navigation:** smooth scroll everywhere; sections scroll-margin-top `5rem`, status blocks `2rem`; decision-map entries glide to their inline cards.
- **ES/EN:** ClientRouter swaps the page without reload; the reading position is restored by section id + offset (the editions have different lengths). Original-doc language: the EN edition always shows the original; the ES edition defaults to the translation with a 1-year cookie shared across all doc modals.
- **Keyboard:** glossary chips and citation chips answer Enter/Space; the lens frame carries a 2px blue focus ring (offset 4px).

### Content architecture

- Data-driven: `src/data/article/{types,concepts,decision-map,original-docs,en,es}.ts` drive one renderer (`src/components/article/`), shared by both editions; the pages are 13-line wrappers.
- Two style sources only, both `<style is:global>`: Layout.astro (tokens, band, colophon) and Article.astro (everything in the article). New article surfaces join Article.astro's stylesheet; per-component style blocks would break the single-token world.
- Editorial rules encoded in code: modals never spoil later sections (only concepts and docs actually referenced get dialog shells); every modal locks scroll.
- **Tailwind:** `tailwind.config.mjs` is stripped bare — content globs and `darkMode: 'class'` only. The integration is kept alive but defines no palette vocabulary; the world styles itself through the CSS variables in Layout.astro. New surfaces use those variables, not utility palette classes.

### Bans held

- No gradients anywhere, text or surface (the source is grep-clean).
- One accent only (The One Reference Rule); no second chromatic hue.
- No shadows on cards or resting surfaces; `--shadow-lift` is modal-only. The lens frame's inline shadow belongs to that device and is not an elevation token.
- Radius is 2px paper corners everywhere; the 1px index dots and the pill scrollbar thumb are apparatus exceptions, not surface rules.
- Figure plates never invert in dark mode (The White Plate Rule).
- Courier never carries reading; serif never labels apparatus (The Apparatus/Reading Split).
- No emoji chrome; icons are inline stroke SVGs at 10–16px.
- No eyebrow-per-heading: sections carry § numbers, phases carry dividers; the only kicker-like labels are functional memo apparatus (mast keys, tags, table captions, the reading-guide plate label).
- Nothing in the reading thread navigates away: concepts, ADRs and doc references open in-page modals.

### Accepted limitations

- The gutter apparatus is desktop-only (≥72rem); below it the memo reads without paragraph numerals.
- Paragraph numerals are counters, not anchors — cross-reference anchoring ("see ¶ 12") is future work.
- The memo index (TOC rail) is hidden below 72rem; there is no mobile index.
- The mono apparatus size range is deliberately compressed (document furniture); the big type scale lives in the serif article. The wordmark, § numerals and stat values are the sanctioned oversizes.
