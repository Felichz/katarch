# DESIGN.md — KatArch article surface

Recorded after the 2026-09 bilingual rebuild, from the built world.

## Direction contract

- **THESIS:** one chronological walkthrough of a single real architecture case (Farmacy Food / ArchColider, O'Reilly Kata Fall 2020). Refuses the category defaults of comparison-table dumps, term-soup heroes, and ADR spoilers before their moment.
- **OWN-WORLD:** dimmed graphite + emerald (GitHub-Dimmed lineage: `#161b22` canvas, `#303849` borders, emerald `rgb(16 185 129)` accents). Plus Jakarta Sans prose, JetBrains Mono for labels/data/ADRs. Original team-repository diagrams as captioned, lightboxed figures.
- **STORY:** the reader follows the winning team's reasoning in order — business → constraints → principles → style → domain → concurrency → infrastructure → cost → decision map → field guide. Every technical concept is a chip opening an in-page modal exactly where it first appears; nothing requires leaving the page.
- **FIRST VIEWPORT:** quiet kicker, two-tone display headline (white + emerald), three prose paragraphs, compact meta row (case / winner / reading time / sources).
- **FORM:** refinement of the incumbent surface (data-driven rebuild). Seed key: n/a (incumbent-world extension, no roll).

## System

- **Palette:** dark-first (light theme kept via `:root:not(.dark)` overrides). Surfaces `rgb(30 41 59 / 0.35)` cards on `#161b22`; borders `rgb(51 65 85 / 0.7)`; accent emerald for section markers, chips, stats, decision cards. Amber reserved for "do the math" callouts; emerald for lesson callouts; slate for neutral.
- **Type scale:** display `clamp(1.9–3.1rem)/800/-0.03em`, section `clamp(1.45–1.9rem)/800`, h3 `1.12rem/700`, body ~0.95rem/1.75, captions `0.75rem` slate. Mono for kickers, tags, ADR ids, stat-adjacent labels.
- **Components:** `BlockRenderer` blocks (p, h3, list, cards 2/3-col, stats panel, callouts, figure+lightbox, context diagram, decision card, decision map). Radii 0.5–0.9rem; one elevation device per element (border or tint, never both plus shadow).
- **Interaction:** native `<dialog>` modals for concepts, decisions, lightbox. Scroll locked while any dialog is open (MutationObserver on `open` — the webview never fires `dialog` `close` events). Focus returns to the trigger. TOC rail (≥72rem) with IntersectionObserver active-section highlight.
- **Content architecture:** `src/data/article/{types,concepts,decision-map,es,en}.ts` drive one renderer (`src/components/article/`) shared by both editions; pages are 12 lines each. Editorial rules live in comments in `concepts.ts` and `decision-map.ts`.
- **Bans held:** no gradient text, no eyebrow-per-heading (phase dividers instead), no section numbers, no monospace-as-costume, no emoji chrome (header globe is SVG; podium medals are editorial content, reviewed as such).
