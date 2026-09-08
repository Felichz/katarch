# ADR 001: Pedagogical Strategy, Narrative Structure, and Web Platform Design for the Farmacy Food Kata Analysis

- **Date:** 2026-09-08
- **Status:** Accepted
- **Decision Makers:** User & Antigravity (Pair Architecture / Engineering)

---

## 1. Context and Problem Statement

The primary objective of this project is to foster **deep software architecture learning** through a comparative analysis of real-world production designs from the first *O'Reilly Software Architecture Kata* (Fall 2020: Farmacy Food), bridging hands-on trade-offs with the theoretical foundations from *Fundamentals of Software Architecture* (Mark Richards & Neal Ford).

After cloning and auditing the 10 original participant repositories in [fall-2020-farmacy-food/](./fall-2020-farmacy-food/), three structural challenges emerged:
1. Treating all participant proposals symmetrically in flat prose causes **high cognitive overhead**, dilutes the conceptual cohesion of the winning system (ArchColider), and prevents readers from constructing a solid, unified mental model.
2. Segmenting the text into disconnected monolithic blocks (e.g., analyzing ArchColider in isolation first, followed by all other teams at the end) breaks the **immediacy of architectural trade-offs**: by the time alternative approaches (such as Myagis-Forest or Team-Pacman) are discussed, the reader has lost context on the baseline design decisions made earlier.
3. A static, flat Markdown document limits interactive code inspection, diagram exploration, responsive reading navigation, and visual hierarchy between core decisions, podium counterpoints, and tactical insights.

---

## 2. Considered Alternatives

### Option 1: Individual Monographic Chapters ("Team by Team")
- **Description:** A sequential, independent chapter for each of the 8 teams from beginning to end.
- **Verdict:** *Declined.* Highly redundant (repeats the business requirements in every chapter) and passive (forces readers to retain multiple incomplete architectures in memory and reconcile them manually).

### Option 2: Symmetric Phase-by-Phase Comparison in Plain Text
- **Description:** Every phase grants identical narrative weight to all teams in consecutive paragraphs.
- **Verdict:** *Declined.* Induces cognitive fatigue and affords equal pedagogical relevance to complete, battle-tested winning designs versus partial prototypes from runner-up submissions.

### Option 3: Pure Case Study Followed by an Appendix of Alternatives
- **Description:** 100% ArchColider in the first half; a closing catalog of other submissions in the second half.
- **Verdict:** *Declined.* Destroys live dialectical tension and hides trade-offs behind separate appendices.

### Option 4: "Lead Anchor (70/20/10)" Pedagogical Architecture with Interactive Astro Web Platform (Selected)
- **Description:**
  - **ArchColider (1st Place):** Serves as the **central spine and cognitive anchor** (~70% of each architectural dilemma).
  - **Myagis-Forest (2nd Place) & Jedis (3rd Place):** Act as **dialectical podium counterpoints** (~20%), highlighting alternative design paradigms (e.g., Day-1 microservices on Kubernetes vs. Kafka event streaming).
  - **Runner-Up Submissions:** Highlighted as **tactical insights and honorable mentions** (~10%), linked directly to exact GitHub file lines (`#L...`).
  - **Interactive Web Implementation:** Built using **Astro + Tailwind CSS**, featuring bilingual support (ES/EN), interactive diagrams (Mermaid), sticky table of contents, and deep-dive modals for architectural styles.

---

## 3. Decision

We adopt **Option 4**:

1. **Pedagogical and Narrative Structure:**
   - **Cognitive Anchor (ArchColider):** Readers follow a cohesive, end-to-end architecture from Day 1 to scale.
   - **Immediate Dialectic (Myagis-Forest & Jedis):** Competing approaches are debated right when the architectural question is actively explored.
   - **Targeted Runner-Up Highlights (Hananoyama, Pacman, Hey-Dragon, da Vinci):** High-value individual contributions (such as hardware bill of materials, serverless cost breakdowns, or evolutionary migration paths) are isolated and referenced with primary source links.
   - **Architecture Fundamentals Integration:** Concepts from Richards & Ford are woven directly into the text (First and Second Laws of Architecture, Architectural Quanta, Fallacies of Distributed Computing, Conway's Law, CAP theorem, Nygard ADRs).

2. **Technology Platform and Visual Design System:**
   - **Framework:** **Astro** (static generation, zero unnecessary client-side JavaScript, optimal performance).
   - **Styling:** **Tailwind CSS** with typography plugin and dark-mode-first aesthetic (Linear / GitHub Dimmed style).
   - **Modular Interactive Components:**
     - `<PodiumCounterpoint>`: High-contrast card with silver/bronze accent borders for debating 2nd and 3rd place designs.
     - `<RunnerUpInsight>`: Compact dashed card with accent badges and direct GitHub repository deep links.
     - `<TheoryBox>`: Conceptual callout linking real decisions to Richards & Ford's textbook chapters.
     - `<Mermaid>`: Dynamic SVG diagrams for context, sequence flows, and decision trees.
     - Sticky and collapsible table of contents with reading position indicators.
     - Bilingual support with header language switcher (`ES / EN`).

---

## 4. Consequences

### Positive
- **Maximum Pedagogical Effectiveness:** Implements the *Anchor & Delta* learning principle (learn one solid model thoroughly, then evaluate variations).
- **Reduced Cognitive Load:** Visual component hierarchy immediately signals the relative significance of each proposal.
- **Traceability to Primary Sources:** Direct GitHub links (`#L...`) enable readers to verify decisions against the original submission files.
- **Production-Ready Deployment:** The resulting static artifact is self-contained and ready for deployment on Vercel, Netlify, or GitHub Pages.

### Negative / Incurred Overhead
- Requires maintaining a frontend workspace (`web/`) with Node.js build tooling.
- Content changes must remain synchronized between bilingual editions and component props.

---

## 5. References and Evidence
- Cloned participant repositories: `fall-2020-farmacy-food/`
- Official competition repository: [TheKataLog](https://github.com/TheKataLog)
- Theoretical foundation: *Fundamentals of Software Architecture* (O'Reilly) by Mark Richards & Neal Ford.
