# KatArch: Software Architecture Kata Analysis (Farmacy Food)

An in-depth pedagogical analysis of real-world production designs from the first **O'Reilly Software Architecture Kata** (*Fall 2020: Farmacy Food*), bridging practical trade-offs with the theoretical foundations of *Fundamentals of Software Architecture* (Mark Richards & Neal Ford).

---

## Overview

The Software Architecture Katas are premier system design competitions organized by O'Reilly. Engineering teams receive business requirements and operational constraints for a realistic company and design its full architecture from scratch.

This repository analyzes the Fall 2020 edition judged by **Mark Richards**, **Neal Ford**, and **Jacqui Read**, focusing on:
- **1st Place (Winner):** [ArchColider](https://github.com/TheKataLog/ArchColider) &mdash; Modular Monolith in AWS EC2/ECS with single architectural quantum and 16 Nygard ADRs.
- **2nd Place (Runner-Up):** [Myagis-Forest](https://github.com/TheKataLog/Myagis-Forest) &mdash; Microservices on Kubernetes with Hexagonal Architecture and BFF pattern.
- **3rd Place (Runner-Up):** [Jedis](https://github.com/TheKataLog/Jedis) &mdash; Event streaming architecture with Apache Kafka and Event Sourcing.
- **Notable Runner-Up Insights:** Hardware bill of materials (Hananoyama), 100% serverless economics (Team-Pacman), and phased evolutionary migration (Hey-Dragon).

---

## Interactive Web Platform

The project includes an interactive web platform built with **Astro** and **Tailwind CSS**:
- **Bilingual Edition:** Full Spanish and English content with an instant header language switcher.
- **Architectural Style Decision Matrix:** 8 quality attributes evaluated across 4 architectural styles (32 detailed deep-dive modals with glossary terms, mechanics, and real-world scenarios).
- **Interactive Sequence & Context Diagrams:** Rendered dynamically with Mermaid.js.
- **Complete ADR Compendium:** Interactive explorer for all 16 ArchColider decision records with status filters and search.
- **Field Guide:** 8 actionable engineering patterns for senior developers transitioning to software architecture.

---

## Repository Structure

```
katarch/
├── ADR-001-pedagogical-strategy-and-web-platform.md   # Architectural Decision Record for the project
├── README.md                                         # Project documentation
├── vercel.json                                       # Vercel deployment configuration
├── .vercelignore                                     # Deployment optimization ignore rules
├── fall-2020-farmacy-food/                           # Cloned participant repositories from TheKataLog
└── web/                                              # Interactive Astro web application
    ├── src/
    │   ├── components/                               # Reusable UI components
    │   │   ├── ArchColiderAdrs.astro                 # 16 ADRs interactive compendium
    │   │   ├── Mermaid.astro                         # Mermaid diagram renderer
    │   │   ├── PodiumCounterpoint.astro              # 2nd & 3rd place comparative cards
    │   │   ├── RunnerUpInsight.astro                 # Tactical insight badges
    │   │   └── TheoryBox.astro                       # Richards & Ford theory callouts
    │   ├── data/
    │   │   ├── archcolider-adrs.ts                   # 16 ADRs data (ES & EN)
    │   │   └── matrix-deep-dives.ts                  # 32 style matrix deep dives (ES & EN)
    │   ├── layouts/
    │   │   └── Layout.astro                          # Main responsive layout with language toggle
    │   └── pages/
    │       ├── index.astro                           # Spanish edition (/)
    │       └── en.astro                              # English edition (/en)
    └── tailwind.config.mjs                           # Dimmed Pro graphite palette & design system
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Running Locally

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` for the Spanish version or `http://localhost:4321/en` for the English version.

### Building for Production

```bash
# From root or inside web/
npm --prefix web run build
```

The built static assets will be in `web/dist/`.

---

## Deployment (Vercel)

This repository is preconfigured for zero-friction Vercel deployment using `vercel.json`:
- Build Command: `npm --prefix web run build`
- Output Directory: `web/dist`
- Install Command: `npm --prefix web install`

Simply link the repository to Vercel via the CLI or GitHub integration.

---

## Primary References
- Official Kata Repository: [TheKataLog](https://github.com/TheKataLog)
- ArchColider 1st Place Submission: [TheKataLog/ArchColider](https://github.com/TheKataLog/ArchColider/tree/master)
- Myagis-Forest 2nd Place Submission: [TheKataLog/Myagis-Forest](https://github.com/TheKataLog/Myagis-Forest/tree/main)
- Jedis 3rd Place Submission: [TheKataLog/Jedis](https://github.com/TheKataLog/Jedis/tree/main)
- Theoretical Framework: *Fundamentals of Software Architecture* (Mark Richards & Neal Ford, O'Reilly).
