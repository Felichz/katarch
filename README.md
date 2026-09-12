# KatArch: Software Architecture Kata Analysis (Farmacy Food)

An in-depth pedagogical analysis of the winning solution of the first **O'Reilly Software Architecture Kata** (*Fall 2020: Farmacy Food*), rebuilt as a single chronological walkthrough of how the winning team reasoned — grounded in *Fundamentals of Software Architecture* (Mark Richards & Neal Ford) and *Viewpoints and Perspectives* (Rozanski & Woods).

---

## Overview

The Software Architecture Katas are premier system design competitions organized by O'Reilly. Engineering teams receive the business brief of a realistic company and design its full architecture from scratch, defended before a jury.

This repository is the definitive deep-dive of the **Fall 2020** edition, whose semifinal jury was **Nate Schutta**, **Mark Richards**, **Sarah Taraporewalla** and **Luca Mezzalira** (verified against the judges' own deck in the team's repository). It focuses exclusively on the winner:

- **1st Place:** [ArchColider](https://github.com/TheKataLog/ArchColider) — modular monolith on AWS with event sourcing, actor-per-fridge concurrency, offline PIN pickup, and 16 Nygard ADRs.

The article reconstructs the team's reasoning in its natural order — business → constraints → principles → style → domain → concurrency → infrastructure → cost — using the original documents, diagrams, spreadsheets and ADRs from their public repository. The finalist solutions of Myagis-Forest and Jedis appear only as the podium counterpoint, not as parallel analyses.

---

## Live Demo & Deployment

- **Production URL (English, default):** [https://katarch.vercel.app](https://katarch.vercel.app)
- **Spanish Edition:** [https://katarch.vercel.app/es](https://katarch.vercel.app/es)

---

## Article Structure

Eleven sections in five phases, identical in both languages:

1. **The playing field** — the business, the three physical actors (ghost kitchens, smart fridges, staffed kiosks), the three user types, the pre-existing systems, and the real day-one numbers (2 locations, ~42 meals/day, ~0 requests/second).
2. **The podium's dilemma** — the three opposing answers of the finalists, plus the judges' actual seven-criterion rubric quoted from their semifinal deck.
3. **The rules of the game** — the team's real questions to the client, Rozanski & Woods, the four guiding principles, the ADR format (and the Second Law), and the business-goal → architectural-requirement traceability table.
4. **The big decision** — the Entity Trap, the traffic arithmetic, the team's original whiteboard, and the modular monolith (ADR 002).
5. **Splitting the system** — strategic DDD (core/supporting/generic), the anti-corruption layer around the Menu Catalog, the payment facade (ADR 009), and the knowledge/operational metamodel.
6. **The physical world** — actor per fridge, the venue-aggregation problem, event sourcing, acknowledged queues (and the payment-refused flow), the 30-second inhibition window, offline PIN pickup, the rainy-day journey, and the promotions-in-a-spreadsheet pragmatism.
7. **The subscriber's meal journey** — from the "IDEA!!!" whiteboard to OrderAvailableForPicking: kitchen vocabulary, inventory updates, the materialize-vs-generate trade-off, and post-window refunds.
8. **Landing in the cloud** — VPC topology, authentication at the edge with identity federation (ALB + Cognito), vertical-first scaling with concrete thresholds, the concrete module-extraction case, synthetic health checks, and the curated risk list with per-risk mitigations.
9. **The yearly bill** — message volumetry (including the 4 MB review photo), the three TCO scenarios, the raw spreadsheet's honest assumptions, and why paid monitoring beat self-hosted.
10. **The decision map** — all ten structural decisions in three pillars, each opening a card linked to the original ADR.
11. **Field guide** — the method in four transferable steps.

---

## Web Platform

Built with **Astro** and **Tailwind CSS**, content-driven from typed data files — one renderer, two languages:

- **Bilingual:** English (`/`, default) and Spanish (`/es`) editions from `src/data/article/{es,en}.ts`; legacy `/en` redirects to `/`.
- **Concept deep-dives:** 14 contextual modal chips (kata, ADR, event sourcing, actor model, DDD, VPC, TCO, anti-corruption layer, CQRS projections…) in natural language.
- **Decision map:** the curated three-pillar digest of ten ADR decisions with per-decision modals (figures embedded) and GitHub links.
- **Original artifacts:** 27 images from the ArchColider repository — original diagrams, the 2020 whiteboards, the judges' semifinal deck material, proposal-deck-only diagrams (ACL, extraction case), subscriber lifecycle diagrams, forecasts and TCO charts — rendered full-width with source attribution.
- **Collapsible TOC rail:** dot rail with tooltips by default, expandable to the full index, with active-section tracking.
- **Accessible modals:** native `<dialog>` with scroll lock, focus restore and ESC/backdrop close.
- **Full-width fluid layout:** one normalized container for every element, body type scaling with the viewport, dark/light themes.

---

## Repository Structure

```
katarch/
├── ADR-001-pedagogical-strategy-and-web-platform.md   # Architectural Decision Record for the project
├── DESIGN.md                                          # Visual system of the article surface
├── README.md                                          # Project documentation
├── astro.config.mjs                                   # Astro platform configuration
├── tailwind.config.mjs                                # Tailwind CSS design system configuration
├── vercel.json                                        # Vercel deployment configuration
├── public/img/                                        # Original ArchColider figures and diagrams
└── src/
    ├── components/article/
    │   ├── Article.astro                              # Main renderer: shell, TOC rail, modals
    │   ├── BlockRenderer.astro                        # Typed content blocks (prose, cards, tables, figures…)
    │   ├── ContextDiagram.astro                       # HTML context diagram closing section 1
    │   ├── DecisionCard.astro                         # Inline decision card + map entry
    │   └── DecisionMap.astro                          # Three-pillar curated ADR map
    ├── data/article/
    │   ├── types.ts                                   # Content block type definitions
    │   ├── es.ts / en.ts                              # The full article, both languages
    │   ├── concepts.ts                                # Bilingual concept deep-dives
    │   └── decision-map.ts                            # Curated decision map (3 pillars × 10 decisions)
    ├── layouts/Layout.astro                           # Responsive layout, header, themes, progress bar
    ├── scripts/article-interactions.ts                # Modals, scroll lock, TOC rail
    └── pages/
        ├── index.astro                                # English edition (/) — default
        └── es.astro                                   # Spanish edition (/es)
```

---
