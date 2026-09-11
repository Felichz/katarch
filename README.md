# KatArch: Software Architecture Kata Analysis (Farmacy Food)

An in-depth pedagogical analysis of the winning solution of the first **O'Reilly Software Architecture Kata** (*Fall 2020: Farmacy Food*), rebuilt as a single chronological walkthrough of how the winning team reasoned — grounded in *Fundamentals of Software Architecture* (Mark Richards & Neal Ford) and *Viewpoints and Perspectives* (Rozanski & Woods).

---

## Overview

The Software Architecture Katas are premier system design competitions organized by O'Reilly. Engineering teams receive the business brief of a realistic company and design its full architecture from scratch, defended before a jury.

This repository is the definitive deep-dive of the **Fall 2020** edition, judged by **Mark Richards**, **Neal Ford**, Sarah Taraporewalla and Luca Mezzalira. It focuses exclusively on the winner:

- **1st Place:** [ArchColider](https://github.com/TheKataLog/ArchColider) — modular monolith on AWS with event sourcing, actor-per-fridge concurrency, offline PIN pickup, and 16 Nygard ADRs.

The article reconstructs the team's reasoning in its natural order — business → constraints → principles → style → domain → concurrency → infrastructure → cost — using the original documents, diagrams, spreadsheets and ADRs from their public repository. The finalist solutions of Myagis-Forest and Jedis appear only as the podium counterpoint, not as parallel analyses.

---

## Live Demo & Deployment

- **Production URL (English, default):** [https://katarch.vercel.app](https://katarch.vercel.app)
- **Spanish Edition:** [https://katarch.vercel.app/es](https://katarch.vercel.app/es)

---

## Article Structure

Ten sections in four phases, identical in both languages:

1. **The playing field** — the business, the three physical actors (ghost kitchens, smart fridges, staffed kiosks), the three user types, the pre-existing systems, and the real day-one numbers (2 locations, ~42 meals/day, ~0 requests/second).
2. **The podium's dilemma** — the three opposing answers of the finalists, in prose.
3. **The rules of the game** — Rozanski & Woods, the four guiding principles, the ADR format, and the business-goal → architectural-requirement traceability table.
4. **The big decision** — the Entity Trap, the traffic arithmetic, and the modular monolith (ADR 002).
5. **Splitting the system** — strategic DDD (core/supporting/generic) and the knowledge/operational metamodel.
6. **The physical world** — actor per fridge, event sourcing, acknowledged queues, the 30-second inhibition window, offline PIN pickup, the rainy-day journey, and the curated risk list.
7. **Landing in the cloud** — VPC topology, authentication at the edge (ALB + Cognito), vertical-first scaling, synthetic health checks.
8. **The yearly bill** — message volumetry, the three TCO scenarios, and why paid monitoring beat self-hosted.
9. **The decision map** — all nine structural decisions in three pillars, each opening a card linked to the original ADR.
10. **Field guide** — the method in four transferable steps.

---

## Web Platform

Built with **Astro** and **Tailwind CSS**, content-driven from typed data files — one renderer, two languages:

- **Bilingual:** English (`/`, default) and Spanish (`/es`) editions from `src/data/article/{es,en}.ts`; legacy `/en` redirects to `/`.
- **Concept deep-dives:** ~10 contextual modal chips (kata, ADR, event sourcing, actor model, DDD, VPC, TCO…) in natural language.
- **Decision map:** the curated three-pillar ADR digest with per-decision modals and GitHub links.
- **Original artifacts:** 13 figures from the ArchColider repository (modularization, metamodel, concurrency, VPC, authentication, TCO, user journeys) with lightbox viewer.
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
├── fall-2020-farmacy-food/                            # Local Kata materials (git-ignored)
├── public/img/                                        # Original ArchColider figures and diagrams
└── src/
    ├── components/article/
    │   ├── Article.astro                              # Main renderer: shell, TOC rail, modals, lightbox
    │   ├── BlockRenderer.astro                        # Typed content blocks (prose, cards, tables, figures…)
    │   ├── ContextDiagram.astro                       # HTML context diagram closing section 1
    │   ├── DecisionCard.astro                         # Inline decision card + map entry
    │   └── DecisionMap.astro                          # Three-pillar curated ADR map
    ├── data/article/
    │   ├── types.ts                                   # Content block type definitions
    │   ├── es.ts / en.ts                              # The full article, both languages
    │   ├── concepts.ts                                # Bilingual concept deep-dives
    │   └── decision-map.ts                            # Curated decision map (3 pillars × 9 decisions)
    ├── layouts/Layout.astro                           # Responsive layout, header, themes, progress bar
    ├── scripts/article-interactions.ts                # Modals, scroll lock, lightbox, TOC rail
    └── pages/
        ├── index.astro                                # English edition (/) — default
        └── es.astro                                   # Spanish edition (/es)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` for the English version (default) or `http://localhost:4321/es` for the Spanish version.

### Building for Production

```bash
# Build static production bundle
npm run build
```

The built static assets will be output to `dist/`.

---

## Deployment (Vercel)

This repository is preconfigured for zero-friction Vercel deployment:
- Framework: `astro`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Deploy directly using the Vercel CLI:

```bash
vercel --prod
```

Or connect the GitHub repository [Felichz/katarch](https://github.com/Felichz/katarch) for automated preview and production deployments on git push.

---

## Primary References
- Official Kata Repository: [TheKataLog](https://github.com/TheKataLog)
- ArchColider 1st Place Submission: [TheKataLog/ArchColider](https://github.com/TheKataLog/ArchColider/tree/master)
- Theoretical Framework: *Fundamentals of Software Architecture* (Mark Richards & Neal Ford, O'Reilly)
- Methodology: *Software Architecture and Design Explained* (Rozanski & Woods)
