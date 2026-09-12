import type { ArticleContent } from './types';

export const EN: ArticleContent = {
  lang: 'en',
  heroKicker: "O'Reilly Software Architecture Kata · Fall 2020",
  heroTitleA: 'The Farmacy Food case:',
  heroTitleB: 'how real architecture decisions get made',
  heroParagraphs: [
    '<a class="concept-chip" data-concept="kata" role="button" tabindex="0">Architecture Katas</a> are competitions where engineering teams receive a real company\u2019s brief and have a few weeks to design the complete solution architecture, defended before a jury. The fall 2020 edition\u2019s semifinal jury brought together four first-class architects: <strong>Nate Schutta</strong>, <strong>Mark Richards</strong> —co-author of the canonical <em>Fundamentals of Software Architecture</em>—, <strong>Sarah Taraporewalla</strong> (ThoughtWorks) and <strong>Luca Mezzalira</strong> (VP of Architecture at DAZN).',
    'The case was <strong>Farmacy Food</strong>, a Detroit startup selling healthy meals through smart fridges. This article reconstructs, step by step, how the winning team <strong>ArchColider</strong> analyzed the problem and reached each decision — using the real numbers, diagrams and documents from their public repository, with the finalist solutions of <strong>Myagis-Forest</strong> and <strong>Jedis</strong> as counterpoint.',
    'No architecture background is required: every technical concept is explained exactly when it appears, and everything that needs context can be read without leaving the page.',
  ],
  tocTitle: 'Contents',
  sections: [
    /* ───────────────────────── 1 ───────────────────────── */
    {
      id: 'terrain',
      phase: 'The problem',
      title: 'The playing field',
      blocks: [
        { type: 'p', html: 'Farmacy Food was born with a direct mission: bring healthy, personalized food at affordable prices to urban Detroit communities, where finding fresh food is genuinely hard. Its motto, taken literally, is "let food be thy medicine": meals built around concrete nutritional needs (diabetes, celiac disease, medical diets) sold at fast-food prices.' },
        { type: 'p', html: 'To do it without opening restaurants — the most expensive part of the food business — the company runs a three-piece model that was already operating when the kata began. The <a class="concept-chip" data-concept="rfp" role="button" tabindex="0">client brief</a> described these three pieces of the physical world:' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Ghost kitchens',
              tag: 'Production',
              html: 'Commercial kitchens that cook exclusively for pickup and delivery, with no dining room and no waiters. They already used specialized software called <strong>ChefTec</strong> to cost recipes and manage ingredients. They don\u2019t cook around the clock: production happens in batches, one or two cooking cycles per day.',
            },
            {
              title: 'Smart fridges',
              tag: 'Unattended sales',
              html: 'Self-service fridges supplied by <strong>Byte Technology</strong>: the customer swipes a card on the front, the door unlocks, they take the meals they want and, when the door closes, internal antennas read <strong>RFID</strong> tags — tiny chips stuck to each meal, read over radio — to charge automatically for whatever was taken.',
            },
            {
              title: 'Staffed kiosks',
              tag: 'Assisted sales',
              html: 'Regular fridges in sublet spaces (gyms, clinics, partner cafeterias). Unlike the autonomous ones, a person serves the public here and charges through commercial <strong>Toast POS</strong> terminals, which already had their own API.',
            },
          ],
        },
        { type: 'h3', html: 'Who buys: the three user types' },
        { type: 'p', html: 'The brief also defined precisely who walks into the business. This is not marketing fluff: as you\u2019ll see, <strong>how each user pays creates a different technical problem</strong>.' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Occasional',
              tag: 'Cash, no account',
              html: 'Walks in unregistered, picks a meal by looking at it, and pays cash at the kiosk counter. The business wants to convert them. <strong>Key fact for later:</strong> their cash purchase tells the central system nothing in real time.',
            },
            {
              title: 'Known',
              tag: 'Account + card',
              html: 'Has an account and a linked card, but no subscription. Browses the catalog, reserves and pays in the app. The fridge recognizes them by their card.',
            },
            {
              title: 'Subscriber',
              tag: 'Prepaid weekly menu',
              html: 'The ideal customer: builds their weekly menu in advance, prepayed, picks up daily. Predictable load for the kitchens — and the challenge of managing cancellations and refunds.',
            },
          ],
        },
        { type: 'p', html: 'A fourth figure unites them, one that is often forgotten: the <strong>kiosk cashier</strong>, who serves occasional users and registers their sales in the Toast POS. And the winning team\u2019s analysis went further: it listed <strong>nutritionists</strong> (who need to search meals by nutritional component) and <strong>ingredient suppliers</strong> (who want to forecast purchases) as stakeholders too. An architect always asks: who else cares about this system, besides the users?' },
        { type: 'h3', html: 'What already existed and could not be changed' },
        { type: 'p', html: 'The task was not to invent an ecosystem from scratch, but to build the <strong>Central Ordering Platform</strong>: the bridge between users (web and mobile) and the tools the company had already contracted. An architect does not choose those pieces — they arrive as constraints.' },
        {
          type: 'list',
          items: [
            '<strong>Byte Technology API</strong> — to know which meals remain in each fridge and hear about every charge each time a door closes.',
            '<strong>Toast POS API</strong> — to register the sales cashiers enter at the kiosks.',
            '<strong>ChefTec</strong> — to send kitchens the consolidated list of what to cook.',
            '<strong>Stripe</strong> — the gateway that processes digital payments from the app.',
            '<strong>QuickBooks</strong> — the company\u2019s official accounting system.',
          ],
        },
        { type: 'p', html: 'The brief was also explicit about what was <strong>not</strong> the architect\u2019s problem: the delivery trucks that restock fridges, the fridges\u2019 internal firmware (owned by Byte), and any movement of food that was not a customer purchase. Asking "what do I NOT have to solve?" is an architect\u2019s first tool.' },
        { type: 'h3', html: 'The real numbers: the fact that changes everything' },
        { type: 'p', html: 'Here is the information that separates a serious solution from a fantasy. The brief declared the current volume and the business targets:' },
        {
          type: 'stats',
          items: [
            { value: '2', label: 'pilot locations on day 1, in Detroit' },
            { value: '~300', label: 'meals per week at the start: about 42 per day across the whole city' },
            { value: '68', label: 'locations and 1,000 subscribers as the 12-month target' },
            { value: '~0', label: 'requests per second: fewer than one per minute at peak' },
          ],
        },
        { type: 'callout', tone: 'amber', title: 'Do the math before choosing tools', html: '42 meals a day across two locations means, at worst, one sale every few minutes — and equivalent web traffic: <strong>practically zero</strong>. Even at the annual target (1,500–2,000 weekly meals) the whole system handles under one request per second. Hold on to this number: it explains almost every decision that follows.' },
        { type: 'p', html: 'The brief held two intermediate numbers almost nobody looks at: the immediate growth — from 2 to <strong>8 locations during 2021</strong> — and a subscriber\u2019s estimated consumption: <strong>~10 meals per week</strong>. That silent arithmetic is what sizes the future: 1,000 subscribers mean roughly 10,000 weekly meals — exactly the rapid-growth scenario of the cost spreadsheet you\u2019ll see at the end.' },
        { type: 'p', html: 'With the business, the physical actors and the numbers on the table, everything so far can be summarized in a single drawing — and now every box and arrow should already be familiar:' },
        { type: 'contextDiagram' },
      ],
    },

    /* ───────────────────────── 2 ───────────────────────── */
    {
      id: 'podium',
      phase: 'The problem',
      title: 'The podium\u2019s dilemma',
      blocks: [
        { type: 'p', html: 'When the ten teams received this same brief, the finalist solutions split into three opposing answers to one question: how much machinery do you buy today for a business that today sells 42 meals a day?' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: '🥇 ArchColider',
              tag: 'Modular monolith',
              html: 'They concluded that standing up distributed infrastructure for that volume was throwing away money and time. They proposed a <strong>monolith divided into strictly bounded modules</strong> on a few AWS machines: cheap today, easy to split tomorrow if needed. The jury rewarded that pragmatism.',
            },
            {
              title: '🥈 Myagis-Forest',
              tag: 'Microservices',
              html: 'They argued exactly the opposite: splitting a monolith later means doing the work twice. They stood up <strong>microservices from day one</strong>, with impeccable domain modeling — and a much higher fixed operating cost for a startup still validating its market.',
            },
            {
              title: '🥉 Jedis',
              tag: 'Kafka',
              html: 'They bet on future analytics: a platform centered on an <strong>event bus</strong> recording every stock movement and purchase in real time. It enables live data and recommendations… while sustaining an oversized messaging platform during the first months.',
            },
          ],
        },
        { type: 'p', html: 'None of the three is "the correct one". As the first Richards & Ford law the judges themselves repeat in every kata puts it: <em>in architecture there are no right or wrong decisions — everything is a trade-off</em>. And "quality of reasoning" was not a vague impression: the deck the judges used at the semifinals — also in the repository — puts the rubric in writing. Every proposal was evaluated against seven criteria:' },
        {
          type: 'list',
          items: [
            '<strong>Clarity of narrative, organization, and supporting documentation.</strong> A good architecture that cannot be told, cannot be defended.',
            '<strong>Understanding of the requirements and completeness of solution.</strong> Does it answer the problem posed, or a more comfortable one?',
            '<strong>Identification of supporting architecture characteristics.</strong> Which quality attributes matter, and where?',
            '<strong>Diagrams: types, level of detail, completeness.</strong> The judges quote Neal Ford here: "the goal of a diagram is to convey a clear and shared understanding of the architecture".',
            '<strong>Overall systems architecture.</strong>',
            '<strong>Integration architecture for the required third-party systems.</strong> The business already had fridges, kiosks and a gateway: connecting them well was part of the job.',
            '<strong>ADRs: documentation and justification of decisions.</strong> Here the second law appears: <em>"why is more important than how"</em>.',
          ],
        },
        { type: 'p', html: 'Put differently: the jury did not reward the prettiest diagram but the full traceability — from business to decision, and from decision to cost. It is the same yardstick you can apply to any architecture proposal, inside or outside a contest.' },
        { type: 'p', html: 'To understand why ArchColider\u2019s reasoning convinced the jury, we need to step back: before drawing a single box, the team set its own rules of the game. That is next.' },
      ],
    },

    /* ───────────────────────── 3 ───────────────────────── */
    {
      id: 'principles',
      phase: 'The decision framework',
      title: 'The rules of the game before the first diagram',
      blocks: [
        { type: 'p', html: 'The winning team\u2019s repository has a revealing peculiarity: during the entire first week there is not a single software diagram. There are business documents: goals, constraints, questions for the client, a vocabulary glossary. The brief itself had arrived as eight raw requirements, and the first task was to read it aloud critically: they rewrote it as usage scenarios and flagged the very first one — integrating with the fridges — as <em>"quite vague and probably out of scope: needs clarification"</em>, because that integration was already handled by Byte\u2019s kiosk management system. Questioning the brief before obeying it is an architect\u2019s second tool. And the questions are not generic: the team wrote the client a concrete list covering the edge cases a developer usually discovers — late — in production. Some real ones, quoted from the <em>Questions.md</em> file:' },
        {
          type: 'list',
          items: [
            '<em>"If a subscriber gets sick and can\u2019t grab meals for one or several days, what happens?"</em>',
            '<em>"Can registered users create a batch order that won\u2019t fit in a fridge? What then — direct delivery?"</em>',
            '<em>"Can a meal a subscriber didn\u2019t pick up be sold to others? After what time? How is the subscriber notified?"</em>',
            '<em>"We don\u2019t know what data the fridges provide: the total amount of meals available, or only the delta since the last change? We hope for the total."</em>',
          ],
        },
        { type: 'p', html: 'Notice what the team does here: instead of <strong>inventing</strong> a convenient answer for every ambiguity in the brief, they annotate it, attach a question mark, and send it to the business owner. Each answer that arrives can change the design; inventing one would have buried it.' },
        { type: 'p', html: 'Only afterwards does the method that organized all remaining work appear: <strong>Viewpoints and Perspectives</strong>, the Rozanski & Woods framework, an industry standard for describing architecture through multiple views (context, functional, information, deployment…) crossed with quality attributes.' },
        { type: 'p', html: 'But before applying the framework, the team signed four guiding principles. Their purpose is practical: when two designers deadlock arguing over options, the principles break the tie.' },
        {
          type: 'list',
          items: [
            '<strong>Cognitive simplicity.</strong> If an option cannot be easily explained and reasoned about, it is discarded. Complexity that does not pay for itself is not bought.',
            '<strong>Evolvability over premature optimization.</strong> Design modules that are easy to extract tomorrow, instead of extracting them today with no need.',
            '<strong>Mandatory <a class="concept-chip" data-concept="telemetry" role="button" tabindex="0">telemetry</a>.</strong> Every module must measure itself: scaling decisions are made with data, not anxiety.',
            '<strong>Messages over direct calls.</strong> System parts communicate asynchronously so none depends on another being alive at that exact instant.',
          ],
        },
        { type: 'callout', tone: 'emerald', title: 'Order matters', html: 'These four principles are not slideware decoration: every technical decision in the rest of this article can be traced back to one of them. Fixing tie-breaking criteria <em>before</em> discussing technologies is what keeps the discussion from becoming a war of tastes.' },
        { type: 'h3', html: 'From business goal to architectural requirement' },
        { type: 'p', html: 'The most instructive document in the repository is also the most boring at first glance: a table connecting every business driver to the requirements that will actually shape the architecture — what the team called, as a joke, the <strong>SADs</strong> (<em>Significant Architectural Drivers</em>: "the drivers that make architects sad", because they reveal how much work there is). Translating business to technical is the hardest skill for a senior developer on the path to architect. Some real rows from the team:' },
        {
          type: 'table',
          caption: 'Traceability: business goal → architecturally significant requirement',
          headers: ['If the business wants…', 'the system must guarantee…'],
          rows: [
            ['Converting occasionals to subscribers', 'buying without registering first, and payments in cash and electronic alike'],
            ['Repeat customers (loyalty)', 'coupons, points and promotions combinable in any proportion of a payment'],
            ['Cooking without waste', 'timely consumption reports per point of sale and user type'],
            ['Nobody left without their meal', 'maximizing the pickup guarantee for every paid lunch'],
            ['Growing to more cities', 'notifications and integrations that don\u2019t need rewrites when expanding'],
          ],
        },
        { type: 'p', html: 'Remember the row "nobody left without their meal": it will return in the physical-world section — and will justify one of the most celebrated decisions in the case. That continuity — business goal → requirement → decision → ADR — is what the judges call <strong>requirements traceability</strong>, and it is the backbone of a defensible architecture.' },
        { type: 'h3', html: 'The notebook where decisions get written down' },
        { type: 'p', html: 'One more methodological piece remains, and it gives its name to half a dozen files in the repository: the <a class="concept-chip" data-concept="adr" role="button" tabindex="0">ADR</a> (<em>Architecture Decision Record</em>). An ADR is a short document — one page — recording a structural decision in three parts: the <strong>context</strong> (what problem motivated it), the <strong>decision</strong>, and the <strong>consequences</strong> accepted, including the negative ones. The format was popularized by Michael Nygard with an argument this kata\u2019s official slides elevate to a category: the <strong>second law of software architecture</strong> — <em>"why is more important than how"</em>. Code shows how the system works; only the ADR records why it ended up that way. And its golden rule is honesty: an ADR that admits no downsides is propaganda, not a decision.' },
        { type: 'p', html: 'ArchColider delivered sixteen ADRs. In this article you will find each one at its exact moment — when the problem that motivated it appears in the story — and at the end, in a curated map for later reference. Each opens in its own card and links to the original file on GitHub.' },
      ],
    },

    /* ───────────────────────── 4 ───────────────────────── */
    {
      id: 'style',
      phase: 'The decision framework',
      title: 'The big decision: how much machinery to buy',
      blocks: [
        { type: 'p', html: 'The mother decision of the whole case is the style choice: one piece or many? If you have been hearing microservices talks, it is worth first disarming a trap that — by the judges\u2019 own account — caught several teams in this kata.' },
        { type: 'p', html: 'Richards & Ford\u2019s official slides call it the <a class="concept-chip" data-concept="entity-trap" role="button" tabindex="0">Entity Trap</a>: write down the business nouns (user, menu, order) and create one component per noun. It sounds tidy and it is rotten inside: real life advances by workflows, not by nouns. The winning team dodged it by modeling actor actions, not collections of things.' },
        { type: 'p', html: 'With the trap identified, the style comparison becomes concrete arithmetic. Remember the number from the first section: under one request per second even at the annual target. With that number on the table, the team compared style options against the client\u2019s four hard constraints: small team, fast time-to-market, minimum budget, and AWS as the platform.' },
        { type: 'decision', id: 'monolith' },
        { type: 'p', html: 'The repository keeps the full justification in <button class="adr-ref" data-adr="002" type="button">ADR 002</button> — and it keeps something almost nobody publishes: the intermediate step between the conversation and the polished diagram. This is the team\u2019s real whiteboard from a detailed-design session on October 29, 2020:' },
        { type: 'figure', src: '/img/whiteboard-menu-plugins.png', alt: 'Team whiteboard: the menu as a hub surrounded by plug-ins, with a sticky note about the messaging protocol', caption: 'The "Menu" core surrounded by extensions (nutrition, recommendations, reviews, discounts) — and the sticky note that anticipated everything: "communicates with plug-ins thru messaging protocol (the protocol should be smart enough to decouple later); if the core menu gets congested we can have a cache". Even the raw sizes are there: 4 cores/8 GB for the center, 1 core/2 GB for the scaled-out part. (Original ArchColider whiteboard)' },
        { type: 'p', html: 'Look at the sticky note: the complete philosophy of the modular monolith, hand-written before any formal diagram existed. Designing for future extraction did not come from a book — it came out of a session with markers. Afterwards, that same idea was tidied into the two diagrams that made it into the final documentation:' },
        { type: 'figure', src: '/img/FF_Modularization.PNG', alt: 'Diagram of the monolith modularization', caption: 'The monolith\u2019s modularization: modules with strict boundaries inside a single deployable. (ArchColider original document)' },
        { type: 'figure', src: '/img/FF_ModularizationExtraction.PNG', alt: 'Diagram of future module extraction', caption: 'The evolution path: any module is extracted as an independent service when telemetry justifies it. (ArchColider original document)' },
        { type: 'p', html: 'And in case there is any doubt about the spectrum of options: they rejected the other two extremes as well. The <em>pure</em> monolith ("good for a proof of concept, but here it would be oversimplification") and day-one microservices ("they demand a stable, known domain model that does not exist yet: the effort is wasted and invisible to end users"). The modular monolith is a deliberate middle point, not a blind bet.' },
        { type: 'callout', tone: 'slate', title: 'The transferable lesson', html: 'The question "monolith or microservices?" is badly posed from the start. The right question is: <strong>what real volume do I have, what team do I have, and what does each style cost in that context?</strong> At 42 meals a day, the answer was arithmetic, not ideology.' },
      ],
    },

    /* ───────────────────────── 5 ───────────────────────── */
    {
      id: 'domain',
      phase: 'The design',
      title: 'Splitting the system: what to build and what to rent',
      blocks: [
        { type: 'p', html: 'A modular monolith only works if the modules are cut well. To decide the cuts, the team applied <a class="concept-chip" data-concept="ddd" role="button" tabindex="0">Domain-Driven Design</a> at its strategic level: classify every business capability by whether it is the competitive edge, a support function, or something generic every company needs.' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Core — build in-house',
              tag: 'The competitive edge',
              html: 'The meal catalog (per-fridge availability, ingredients, promotions), ordering (subscriptions, coupons, chained payments) and the loyalty program. This is where the business wins or loses: built in-house, by the best people.',
            },
            {
              title: 'Supporting — adapt',
              tag: 'Important but buyable',
              html: 'The feedback system and kitchen production scheduling. The business needs them, but they don\u2019t differentiate it: adapt existing tools or build them simple.',
            },
            {
              title: 'Generic — rent',
              tag: 'Same for everyone',
              html: 'Reporting, payments, notifications. No company gains an edge by building its own payment processor: integrate existing services (Stripe, reporting tools, messaging services).',
            },
          ],
        },
        { type: 'figure', src: '/img/FF_StrategicDomainDesign.jpg', alt: 'Strategic DDD subdomain map', caption: 'The team\u2019s original strategic map: every domain classified by business uniqueness and complexity. (ArchColider original document)' },
        { type: 'p', html: 'The core/generic cut carries a design consequence the team documented in its final presentation: if the meal catalog is the crown jewel, it must be protected from everyone else\u2019s formats. Around the <strong>Menu Catalog</strong> they drew an <a class="concept-chip" data-concept="acl" role="button" tabindex="0">anti-corruption layer</a>: an internal boundary through which the ghost kitchen, the loyalty program, the app and the kiosks must enter — and out of which the domain only ever speaks in commands and events to the shopping cart, recommendations and reviews. Its worth shows in a delicious detail from the internal documents: if Byte\u2019s fridges don\u2019t publish events, the layer fabricates them — it turns the raw API data into the very same "catalog updated" event the whole system consumes, and everything downstream never knows the difference.' },
        { type: 'figure', src: '/img/menu-catalog-acl.png', alt: 'Menu Catalog service diagram with its anti-corruption layer', caption: 'The Menu Catalog service with its anti-corruption layer (Meals Offer, Loyalty, API): external systems touch the boundary, never the domain. This diagram exists only in the team\u2019s presentation — they never migrated it to the documentation. (ArchColider original document)' },
        { type: 'p', html: 'The same presentation shows how far the pragmatism about the generic goes: payments. On the whiteboard they sketched it with no detours — one single payment block distributing toward Visa, Mastercard or PayPal:' },
        { type: 'figure', src: '/img/whiteboard-payment-facade.png', alt: 'Team whiteboard: payment facade toward Visa, Mastercard and PayPal', caption: 'The payment facade, scribbled: one internal block distributes toward each card network. (Original ArchColider whiteboard)' },
        { type: 'decision', id: 'payment' },
        { type: 'p', html: 'Even the map for finding the fridges was decided by the same yardstick. ADR 015 compared four providers by free tier — OpenStreetMap, TomTom, Mapbox and Here Maps — and picked <strong>Here Maps</strong>: its 250,000 free monthly requests were plenty for the business\u2019s real volume. The accepted consequence is textbook: watch consumption month by month so you don\u2019t silently start paying extra.' },
        { type: 'h3', html: 'The metamodel: rules on one side, execution on the other' },
        { type: 'p', html: 'The repository\u2019s least obvious gem is a diagram called the <em>metamodel</em>. It separates two levels that usually tangle into one mess: the <strong>knowledge level</strong> (the rules: which user types exist, which actions each may perform, which promotions apply to which menus) and the <strong>operational level</strong> (day-to-day facts: this order, this menu, this kitchen). It is the same separation as between "the tournament rulebook" and "Sunday\u2019s match".' },
        { type: 'figure', src: '/img/FF_Metamodel_v1.png', alt: 'Conceptual metamodel: knowledge level and operational level', caption: 'The metamodel: business rules (top) separated from operational entities (bottom). The direct answer to the Entity Trap. (ArchColider original document)' },
        { type: 'p', html: 'This cut pays off enormously later: when the business invents a new promotion type or user profile, a rule in the "rulebook" changes without rewriting the "match". The metamodel is designed to absorb scenarios that do not exist yet. One example from the team\u2019s own document: promotions hang off menus and meal types, never off individual meals — so a specific kitchen can run its own promotion without touching the rest of the platform.' },
        { type: 'h3', html: 'Each subsystem\u2019s quality-attribute budget' },
        { type: 'p', html: 'The design closed with an idea worth stealing: global quality attributes first, then <strong>a budget of its own per subsystem</strong> — because each piece needs different patterns. The app had to be usable, fast and <em>autonomous</em> (work without signal); the catalog, extensible, maintainable and available — with refreshing honesty: "availability should be solved with restarts and vertical scale; a short outage is still possible", because this was a business bet, not a bank. Ordering: reliability and integrity (it is the money vault). The payment gateway: maximum security and availability ("inability to pay is direct money loss"). The diagram also highlights the two <em>gravity centers</em>, plus one elegance: the cashier\u2019s app is not a separate product — it impersonates users and walks the same workflow as the customer app.' },
        { type: 'figure', src: '/img/FF_system_approach.png', alt: 'System composition with gravity centers and per-subsystem quality attributes', caption: 'The final composition with the gravity centers highlighted (Menu Catalog and Ordering) and each piece\u2019s quality-attribute budget. (ArchColider original document)' },
      ],
    },

    /* ───────────────────────── 6 ───────────────────────── */
    {
      id: 'concurrency',
      phase: 'The design',
      title: 'The physical world: fridges, money and flaky connections',
      blocks: [
        { type: 'p', html: 'Here the case stops being theoretical and becomes engineering of reality: two people buying the last meal at the same time, second thoughts with money attached, fridges losing signal. Each problem comes with the solution the team designed for it — and the repeating pattern at the end is the biggest lesson of the whole case.' },
        { type: 'h3', html: 'Problem 1: two people want the last meal' },
        { type: 'p', html: 'The temptation is to lock the database ("nobody touches stock while I buy"). The team did something better using a physical quirk of the business: <strong>a meal cannot jump from one fridge to another</strong>. So each fridge gets its own <a class="concept-chip" data-concept="actor-model" role="button" tabindex="0">actor</a>: a process that handles that fridge\u2019s purchases one at a time, in order. There are never two simultaneous writes to the same stock, so no locks are ever needed. Stock lives in memory, at processor speed.' },
        { type: 'figure', src: '/img/FF_concurency_order_processing.PNG', alt: 'Order processing diagram with actors', caption: 'Orders passing from actor to actor, each with a single responsibility. (ArchColider original document)' },
        { type: 'p', html: 'Looking at the physical world surfaced a problem no generic diagram shows: <strong>one venue can hold several fridges</strong>. If a gym has three, whose stock does the user see — one fridge\u2019s or the whole venue\u2019s? The Byte Technology API did not guarantee that per-venue sum, so the team logged the risk of having to build it themselves — and wrote down the honest question they asked the vendor: does the API report the <em>total</em> of available meals, or only the <em>delta</em> since the last change? When your system depends on an external API you don\u2019t control, those questions get written before the code.' },
        { type: 'h3', html: 'Problem 2: the customer disputing a bad charge' },
        { type: 'p', html: 'A business handling food and money will get disputes. The question is what evidence exists when the dispute arrives. The team\u2019s answer was <a class="concept-chip" data-concept="event-sourcing" role="button" tabindex="0">Event Sourcing</a>: recording every order as an immutable sequence of events instead of a state that gets erased and rewritten. And so the "charge this order" message never gets lost or processed twice, they used a <a class="concept-chip" data-concept="message-queue" role="button" tabindex="0">message queue</a> with delivery confirmation and unique identifiers.' },
        { type: 'decision', id: 'event-sourcing' },
        { type: 'decision', id: 'rabbitmq' },
        { type: 'p', html: 'Two fine details of this same decision, straight from the internal documents: every aggregate in the system carries a <strong>version number</strong>, so two concurrent writes to the same order are detected without locks; and the team also diagrammed side B of the money — if the payment provider refuses the charge or the attempt times out, the reserved stock restocks itself and the user gets the refusal notice. Nothing is left half-done: no orphan charge, no meal vanished from the catalog. And since the order history lives about a month on the device, a refusal turns into a button: the app offers to retry the last order with one tap.' },
        { type: 'p', html: 'Before the tactic, here is the complete flow of a normal purchase — every numbered step is a command (something someone <em>wants</em> to happen) or an event (something that <em>already happened</em>, and everyone listens):' },
        { type: 'figure', src: '/img/IM_meal_purchase.PNG', alt: 'Information model: meal purchase step by step', caption: 'The instant purchase end to end: Start Order and Confirm Order (commands, blue), MealStockReserved and OrderPurchased (events, green). Note how stock reserved and stock deducted are distinct events listened to by catalog and reporting. (ArchColider original document)' },
        { type: 'h3', html: 'The 30 seconds that avoid a refund' },
        { type: 'p', html: 'Inside that same flow there is a delicious tactic, documented in the team\u2019s information diagrams. The case\u2019s own numbers say that <strong>2–5% of orders are cancelled on the spot</strong>: impulse purchases the user regrets before finishing their second coffee. If every one of those cancellations reaches the payment gateway, the business pays a processing fee… and then a refund fee, for the same meal.' },
        { type: 'p', html: 'The solution mirrors a mail client\u2019s "undo send": when an order arrives, the system <strong>holds it for 10 to 30 seconds before invoking the payment</strong>. The cancellation resolves in memory, inside that window, at zero gateway cost. If the window passes without cancellation, only then does charging begin. The user never notices: they are already used to "processing payment" taking a few seconds.' },
        { type: 'figure', src: '/img/IM_cancel_order_by_user.PNG', alt: 'Sequence diagram: order cancellation by the user inside the inhibition window', caption: 'Cancellation inside the inhibition window: resolved in memory, never touching the payment gateway. (ArchColider original document)' },
        { type: 'h3', html: 'Problem 3: the basement fridge with no signal' },
        { type: 'p', html: 'Fridges depend on cellular connectivity. A fridge in a hospital basement can lose signal exactly when a customer arrives to pick up an already-paid lunch.' },
        { type: 'callout', tone: 'slate', title: 'Before reading on', html: 'Your turn: the customer paid, the meal is inside the fridge, and the fridge cannot reach the cloud. <strong>How would you hand them their food without opening the door to fraud?</strong> Think about it for a second — the team’s answer is among the most elegant of the whole case.' },
        { type: 'p', html: 'The team’s solution: PIN codes generated in advance that the fridge validates in its local memory, without talking to the cloud. The documents also record the idea’s evolution: they first considered generic "access codes" and discarded them as cumbersome — the 6-to-8-digit PIN tied to each meal was the final simplification. (Does the traceability row "nobody left without their meal" ring a bell? This is its destination.)' },
        { type: 'decision', id: 'pin-offline' },
        { type: 'p', html: 'The same pragmatism shows up in the app: the catalog lives on the phone (instant, available offline) and real stock is verified only at the moment of payment.' },
        { type: 'decision', id: 'catalog-cache' },
        { type: 'p', html: 'That way of thinking reaches the smallest decisions too. Synchronize promotional campaigns between operators with distributed-consistency algorithms? Unnecessary: promotions rarely change, so they are managed <strong>in a spreadsheet</strong>, and the system only consumes the final result. And the whole data model rests on a physical-world observation: <strong>Detroit kitchens do not offer food in New York City</strong>. Data can be split by city — catalogs, stock, orders — with almost nothing replicated across regions, simplifying access, consistency and costs in one stroke.' },
        { type: 'h3', html: 'The rainy day: when the meal gets stuck' },
        { type: 'p', html: 'Every diagram in this section shows the "sunny day": the user orders, pays, picks up, happy. The team also diagrammed the rainy day: the meal gets <strong>physically stuck</strong> inside the fridge, the user has already paid, and no software can push the tray. That journey exists end to end: the user takes a photo from the app and files the complaint, a human administrator reviews it, and the system issues compensation (a new meal or a coupon).' },
        { type: 'figure', src: '/img/user-journey-error.png', alt: 'User journey when a meal gets stuck in the fridge', caption: 'The error journey: the meal gets stuck, the user documents it with a photo, an admin compensates. Designing the rainy day is architecture too. (ArchColider original document)' },
        { type: 'p', html: 'The lesson: the happy path is half of design. The half that separates a real architecture from a pretty drawing lives in the journeys where hardware fails, signal drops or the user changes their mind — and that half is also diagrammed before writing code.' },
        { type: 'callout', tone: 'emerald', title: 'The repeating pattern', html: 'Every solution in this section does the same thing: <strong>accept physical reality instead of fighting it</strong>. Fridges will lose signal: design for it. Data will arrive late: design for it. Disputes will arrive: keep the evidence. Mature architecture does not eliminate the real world\u2019s problems; it is prepared when they knock.' },
      ],
    },

    /* ───────────────────────── 7 ───────────────────────── */
    {
      id: 'subscriber-journey',
      phase: 'The design',
      title: 'The journey of a subscriber\u2019s meal',
      blocks: [
        { type: 'p', html: 'One loose end remained: the subscriber, the ideal customer the business wanted above all, introduced in the first section and never seen again. How does their food physically arrive? The team worked it end to end, and the repository even preserves the genesis: a scribble titled "IDEA!!!" where the idea is born on the whiteboard — a user with an account, a fridge with available meals, and below it a row of prepaid day slots that also add loyalty points.' },
        { type: 'figure', src: '/img/whiteboard-subscriber-idea.png', alt: '"IDEA!!!" whiteboard: the subscription concept being born', caption: 'The moment the subscription is invented on the whiteboard: a prepaid menu by day (1d, 2d, 3d…) with loyalty points. (Original ArchColider whiteboard)' },
        { type: 'p', html: 'The final version is a small festival of chained events. Kitchens receive their <em>inventory updates</em> each morning — the list of what to produce, formed from the subscribers\u2019 menus — and answer with a four-word vocabulary: <strong>accepted, dispatched, can\u2019t do, delayed</strong>. When they dispatch, the <em>OrderDispatched</em> event is published and the catalog (it frees stock), reporting and the order itself all listen. When the meal physically enters the fridge, the fridge confirms <em>OrderPlacedInFridge</em>, and only then does the order become <em>available for pickup</em> and the user gets their notice with the PIN. The scheduling module never queries the event store directly: it reads <a class="concept-chip" data-concept="cqrs" role="button" tabindex="0">projections</a> — ready-made copies someone else keeps up to date. And a textbook trade-off stayed documented inside the scheduler: materialize all of a subscriber\u2019s future orders at once, or generate them day by day from the menu? Choosing the latter, changing or cancelling the menu never means hunting down and rewriting dozens of already-created orders — the only cost is marking which ones are prepaid.' },
        { type: 'figure', src: '/img/IM_preparing_scheduled_orders.PNG', alt: 'Information model: preparing scheduled subscriber orders', caption: 'From calendar to fridge: PrepareOrders, OrderDispatched, OrderPlacedInFridge and OrderAvailableForPicking — a subscriber meal\u2019s full cycle. (ArchColider original document)' },
        { type: 'p', html: 'What if the subscriber regrets it outside the 30-second window? Then it hurts: the kitchen already bought ingredients, maybe already cooked. The diagrammed flow makes the distinction: cancelling a scheduled order fires a <em>ClaimRefund</em> toward the payment provider, and the <em>RefundSuccessful</em> event confirms to the app that the money is back. Without events, "did we refund it or not?" is exactly the kind of question that keeps a support team up at night. The business fine print is written down too: cancelling a scheduled menu takes effect <em>from the next business day</em> — already-prepared meals are not cancelled, and instead of going to waste they can be released to the common stock.' },
        { type: 'figure', src: '/img/IM_cancel_scheduled_order_by_user.PNG', alt: 'Information model: cancelling a scheduled order with refund', caption: 'Cancellation outside the window: ClaimRefund travels to the gateway and RefundSuccessful returns to the app. (ArchColider original document)' },
        { type: 'p', html: 'Three events and a four-word vocabulary: even the business\u2019s most valuable customer is held together by the same simple pieces as the rest of the system.' },
      ],
    },

    /* ───────────────────────── 8 ───────────────────────── */
    {
      id: 'infrastructure',
      phase: 'The design',
      title: 'Landing the design in the cloud',
      blocks: [
        { type: 'p', html: 'Everything so far is pure logic; at some point servers must be paid for. The team chose AWS for a brief constraint and a practical reason: the region closest to Detroit. The topology is a lesson in well-understood <a class="concept-chip" data-concept="vpc" role="button" tabindex="0">private networking</a>: a private enclosure with the load balancer at the gate, servers inside with no public addresses, everything duplicated across two separate datacenter buildings.' },
        { type: 'figure', src: '/img/infra-vpc.png', alt: 'AWS VPC network topology diagram', caption: 'The VPC: two availability zones, public subnets (load balancers) and private ones (the servers, no public IP). (ArchColider original document)' },
        { type: 'h3', html: 'Checking credentials at the gate' },
        { type: 'p', html: 'The most didactic security detail: instead of every piece of software verifying every visitor\u2019s identity, the <strong>incoming load balancer</strong> does it against AWS\u2019s identity service (Cognito) before traffic reaches the servers. Servers only receive pre-verified visitors. The identity service also allows <strong>federation</strong>: users can sign in with their Google or Facebook account, which the team noted as a product argument — federation "will immediately generate trust in your system with a large portion of potential users". With fine print, though: anyone wary of tech-giant accounts can always create an independent one. And inside, zero trust: modules also demand authorization from each other — attribute-based access control (ABAC) from day one — as if they were already separate services, so the day they split apart, security is already done.' },
        { type: 'decision', id: 'edge-auth' },
        { type: 'figure', src: '/img/Authentication.png', alt: 'Authentication flow diagram with Cognito and ALB', caption: 'The authentication flow: the load balancer validates tokens against Cognito at the network edge. (ArchColider original document)' },
        { type: 'figure', src: '/img/services.png', alt: 'Services and virtual hardware overview: servers, queues, streaming and SaaS by subnet', caption: 'The full topology: every server is a t3.medium template; queues, log streaming, and the external SaaS with their roles. (ArchColider original document)' },
        { type: 'p', html: 'Communication between pieces is not a spider web of direct calls either. The team explicitly named the anti-pattern they wanted to avoid — <em>"spaghetti with meatballs"</em>, every service shouting at every other — and cited their inspiration: Martin Kleppmann\u2019s writing on logs as data infrastructure. The solution: a <strong>log-based stream</strong> over which changes propagate, and every service consumes at its own pace, nobody depending on anybody else being alive. The side benefit is purely economic: relaxing consumers\u2019 availability and performance requirements allows buying them cheaper machines.' },
        { type: 'figure', src: '/img/FF_LogBasedStream.PNG', alt: 'Log-based information propagation diagram', caption: 'Log-based propagation: producers write once; reporting, notifications and any future consumer read at their own pace. (ArchColider original document)' },
        { type: 'p', html: 'The entire infrastructure, moreover, is not clicked by hand: it is defined as <strong>declarative code</strong> (CloudFormation in the ADR, with Terraform left open). The cited benefit goes beyond reproducibility — subnets born as exact copies of each other, derived environments via standard transformations: it lets you run <strong>architecture fitness functions against the specification</strong> before deploying anything, test scenarios without moving a single server, and detect <em>drift</em> when someone changes something by hand outside the code.' },
        { type: 'h3', html: 'What if the business grows?' },
        { type: 'p', html: 'The scaling strategy is the most honest in the case: first buy a bigger machine ("vertical scale"), and only multiply instances behind load balancers ("horizontal scale") when telemetry — mandatory, guiding principle number three — shows vertical has hit its ceiling. The initial thresholds they wrote down are vividly concrete for a business this size: <strong>CPU above 75% or memory above 85%</strong>. And they also noted the inverse trap, a non-obvious sensitive point: cloud scaling technologies allow scaling up <em>for a long time</em>, which can <strong>indefinitely postpone</strong> the decision to scale out — their antidote: evaluating the business-critical path directly in production. At cut time, the highest-pressure module is extracted from the monolith, exactly as designed in the style section.' },
        { type: 'figure', src: '/img/menu-catalog-extraction.png', alt: 'Concrete extraction case: Menu Catalog as a service with its own balancer and replicas', caption: 'The worked extraction case: Menu Catalog already turned into a service, with its own load balancer and N replicas of filtering + cache scaling in parallel. (ArchColider original document)' },
        { type: 'p', html: 'And that telemetry has an extra trick worth knowing: the monolith\u2019s health endpoints expose three levels of information — whether each module is <strong>ready to operate</strong>, internal <strong>business</strong> metrics (how orders are being processed) and <strong>technical</strong> metrics (request rate, failure rate). Besides machine metrics, the system monitors itself with <strong>synthetic scenarios</strong> — the critical paths to watch are identified in a quality-attribute workshop —: a "dummy customer" walks the critical path (pick a meal, pay, pick up) every few minutes and measures whether the result is correct and how long it took. A machine can be "healthy" while business logic is stuck; the phantom customer finds out. Those numbers are also the signal that decides when to split the monolith.' },
        { type: 'decision', id: 'scale-up' },
        { type: 'h3', html: 'The risks, each with a mitigation at hand' },
        { type: 'p', html: 'The team’s analysis ends with something most submissions omit: a risk list where every risk has its mitigation option written next to it. Not all are technical — several are business decisions the team explicitly marked as "to resolve with the owner". A selection:' },
        {
          type: 'list',
          items: [
            '<strong>The payment gateway goes down:</strong> orders are stored and retried for a defined period; meanwhile, a trust policy for known users and subscribers (we already know who they are).',
            '<strong>Review bombing of third-party kitchens:</strong> only someone with a confirmed charge can post a review — reputation is designed too.',
            '<strong>The notification channel fails:</strong> a backup channel; and if the meal already reached the fridge, sometimes the best notification is none.',
            '<strong>A customer reserves but never picks up:</strong> the reservation is prepaid — the cost of forgetting falls on the one who forgot, not on the kitchen that already cooked.',
            '<strong>The fridge physically fills up:</strong> subscribers and known users together can order more food than fits inside a fridge. The authors were brutally honest: there is no technical mitigation — "need decision from the business".',
            '<strong>The order lands outside kitchen hours:</strong> kitchens don\u2019t run 24/7; left open as a point for the owner.',
            '<strong>The ghost kitchen goes down:</strong> keep operating on the ordering system\u2019s internal information; if a dispatch fails, a compensation protocol kicks in.',
            '<strong>A change breaks the message format:</strong> API versioning and negotiated backward compatibility, with end-of-life ("sunset") warnings for consumers.',
            '<strong>Scaling spikes the bill:</strong> a maximum instance cap per service, and above the threshold, human confirmation before anything is turned on.',
            '<strong>A release breaks something:</strong> hot-swap to the previous release as a platform requirement, not a hope.',
          ],
        },
      ],
    },

    /* ───────────────────────── 9 ───────────────────────── */
    {
      id: 'costs',
      phase: 'Economic reality',
      title: 'The yearly bill, to the cent',
      blocks: [
        { type: 'p', html: 'Few architecture deliveries include the total operating cost. The winning team delivered a spreadsheet with the full calculation, under three growth scenarios, starting from the <a class="concept-chip" data-concept="tco" role="button" tabindex="0">TCO</a>: not each piece\u2019s list price, but the yearly cost of keeping everything running.' },
        { type: 'p', html: 'The starting point was sizing load with numbers, not fear: ~1,000 daily requests generate about 30,000 records per month — roughly 4 GB of database and 16.5 GB of monthly traffic. Tiny figures, computed before choosing any machine.' },
        { type: 'h3', html: 'The calculator before the server' },
        { type: 'p', html: 'Where do those figures come from? From something the team called <strong>volumetry</strong>: for every message traveling through the system, they noted how much it weighs and how often it happens. With that table, bandwidth and storage derive themselves — and costs stop being guesswork. The case\u2019s real values:' },
        {
          type: 'table',
          caption: 'System message volumetry (the team\u2019s original document)',
          headers: ['Message / payload', 'Weight', 'Frequency'],
          rows: [
            ['Confirming an order', '0.2 kb', '1–3 per day per user'],
            ['Full catalog (no images)', '500–700 kb', '1 download per day, lives 24 h on the device'],
            ['Stock update for one fridge', '0.1–150 kb', 'with every order and per fridge batch'],
            ['Cancelling an order', '0.1 kb', '2–5% of all orders'],
            ['Daily dispatch to a kitchen', '20–50 kb', '0–2 per day per fridge'],
            ['Review with photo (complaint or rating)', '~4 MB', '10% of users write reviews; 5% report a problem'],
          ],
        },
        { type: 'p', html: 'This is the most transferable habit in the whole cost section: a serious architect sizes <strong>bytes and frequencies before choosing servers</strong>. The table also justifies decisions you\u2019ve already seen — for instance, why download the whole catalog once a day and keep it fresh with 0.1 kb messages, instead of re-fetching it on every screen. And look at the last row: the heaviest message in the entire system is not generated by the business — it is a user complaining with a 4 MB photo. That is why reviews made it into the calculation: the raw spreadsheet shows they are, by far, the biggest consumer of traffic and storage.' },
        { type: 'figure', src: '/img/database_forecast.png', alt: 'Database growth forecast', caption: 'The database forecast: ~3.96 GiB monthly in the 30,000-record projected scenario. (ArchColider original spreadsheet)' },
        { type: 'figure', src: '/img/traffic_forecst.png', alt: 'Monthly traffic forecast', caption: 'The team\u2019s traffic forecast: ~16.5 GiB monthly in the projected scenario. (ArchColider original spreadsheet)' },
        { type: 'p', html: 'The unpolished spreadsheet also leaves its assumptions in plain sight — and that is a compliment, not a flaw. You can read there that the calculation assumes <strong>uniform</strong> traffic ("in reality the number could be up to 60% smaller", they clarify), that <strong>no compression is included</strong> ("with GZIP it would drop significantly"), and that the database was sized for 12-month growth: a fixed 1 TB of DynamoDB costing $3,072 a year — <em>almost the same as all machines combined</em> ($3,115). None of this invalidates the estimate; quite the opposite: an estimate that shows its assumptions can be debated. One that hides them cannot.' },
        {
          type: 'stats',
          items: [
            { value: '$12,248', label: 'total year-1 cost in the minimum scenario' },
            { value: '$12,548', label: 'in the projected-growth scenario' },
            { value: '$22,481', label: 'in the rapid-growth scenario (×10)' },
            { value: '~$1,000', label: 'per month to run the whole business in the base scenario' },
          ],
        },
        { type: 'p', html: 'Now, the fact that surprises everyone: the most expensive line of the bill is not the servers. It is <strong>monitoring</strong> (DataDog, $3,336/year) followed by <strong>reporting</strong> (Tableau, $1,440/year): together, about 40% of the yearly budget. Why pay for them? Because the "free" alternative — standing up the open-source tools on your own servers — costs the most expensive thing there is: developer hours from a small team. And it was not faith: they compared alternatives. For monitoring, Grafana and the ELK stack (rejected for demanding in-house maintenance); for reporting, Tableau against Power BI and KoolReport — Power BI viable only if the owner held a Microsoft subscription.' },
        { type: 'decision', id: 'datadog' },
        { type: 'figure', src: '/img/1y-min-tco.png', alt: 'Yearly total cost distribution by service', caption: 'The yearly budget distribution: monitoring and reporting outweigh compute. (ArchColider original document)' },
        { type: 'callout', tone: 'amber', title: 'The budget lesson', html: 'Comparing "free" against "paid" by looking only at the monthly bill is the classic mistake. A tool\u2019s real cost includes whoever will maintain it. Sometimes paid software is the cheapest in the world.' },
      ],
    },

    /* ───────────────────────── 10 ───────────────────────── */
    {
      id: 'map',
      phase: 'Economic reality',
      title: 'The complete decision map',
      blocks: [
        { type: 'p', html: 'The repository delivered sixteen ADRs, but they don\u2019t all carry the same weight: some are deep structural decisions, some are operational hygiene, and some are paperwork. We did the curation for you: the decisions that truly define this architecture, grouped into three pillars, each in its essential form — <strong>problem, decision, and the trade-off accepted</strong> — with the link to the original document.' },
        { type: 'decisionMap' },
      ],
    },

    /* ───────────────────────── 11 ───────────────────────── */
    {
      id: 'field-guide',
      phase: 'Takeaways',
      title: 'Field guide: the method in four steps',
      blocks: [
        { type: 'p', html: 'Remove the Farmacy Food case and a method applicable to any project remains. The winning team executed it in this order, and the order is part of the method:' },
        {
          type: 'list',
          items: [
            '<strong>1. Understand the business before the software.</strong> One week of questions, numbers and glossary before the first diagram. Knowing how many requests per second the real system — not the imaginary one — handles is the fact that settles everything else.',
            '<strong>2. Set tie-breaking principles before discussing tools.</strong> Cognitive simplicity, evolvability, mandatory telemetry, messages over calls. Without prior criteria, the architecture debate becomes a war of tastes.',
            '<strong>3. Design for the physical reality, not the ideal one.</strong> Fridges lose signal, data arrives late, disputes arrive anyway. Architecture is prepared when problems knock, rather than pretending they don\u2019t exist.',
            '<strong>4. Close with the bill.</strong> An architecture without an estimated yearly cost is incomplete: the client doesn\u2019t deploy diagrams, they deploy invoices. And cost includes the hours of the people maintaining each piece.',
          ],
        },
        { type: 'p', html: 'Every document cited in this article — the winner\u2019s analysis, the original ADRs, the cost spreadsheets and the other finalists\u2019 solutions — lives in the public repositories of <a href="https://github.com/TheKataLog" target="_blank" rel="noopener noreferrer">TheKataLog on GitHub</a>. If you want to see three excellent teams solve the same problem in opposite ways, comparing the repositories is the best continuation of this read.' },
      ],
    },
  ],
  closing: {
    title: 'End of the case analysis',
    paragraphs: [
      'This article is an independent pedagogical analysis of the competition\u2019s public material: the teams\u2019 original documents, diagrams and spreadsheets, cited and linked in every section.',
      'Reference theoretical framework: Fundamentals of Software Architecture (Mark Richards & Neal Ford) and Software Architecture and Design Explained (Rozanski & Woods).',
    ],
  },
};
