import type { ArticleContent } from './types';

export const EN: ArticleContent = {
  lang: 'en',
  heroKicker: "O'Reilly Software Architecture Kata · Fall 2020",
  heroTitleA: 'The Farmacy Food case:',
  heroTitleB: 'how real architecture decisions get made',
  heroParagraphs: [
    '<a class="concept-chip" data-concept="kata" role="button" tabindex="0">Architecture Katas</a> are competitions where engineering teams receive a real company\u2019s brief and have a few weeks to design the complete solution architecture, defended before a jury. The fall 2020 edition had a first-class jury: <strong>Mark Richards</strong> and <strong>Neal Ford</strong>, authors of the canonical <em>Fundamentals of Software Architecture</em>, together with invited guest architects.',
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
        { type: 'p', html: 'None of the three is "the correct one". As the first Richards & Ford law the judges themselves repeat in every kata puts it: <em>in architecture there are no right or wrong decisions — everything is a trade-off</em>. What the jury evaluated was the quality of the reasoning: whether every trade-off was identified, justified, and measured against the client\u2019s real constraints.' },
        { type: 'p', html: 'To understand why ArchColider\u2019s reasoning convinced the jury, we need to step back: before drawing a single box, the team set its own rules of the game. That is next.' },
      ],
    },

    /* ───────────────────────── 3 ───────────────────────── */
    {
      id: 'principles',
      phase: 'The decision framework',
      title: 'The rules of the game before the first diagram',
      blocks: [
        { type: 'p', html: 'The winning team\u2019s repository has a revealing peculiarity: during the entire first week there is not a single software diagram. There are business documents: goals, constraints, questions for the client, a vocabulary glossary. Only afterwards does the method that organized all remaining work appear: <strong>Viewpoints and Perspectives</strong>, the Rozanski & Woods framework, an industry standard for describing architecture through multiple views (context, functional, information, deployment…) crossed with quality attributes.' },
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
        { type: 'p', html: 'One more methodological piece remains, and it gives its name to half a dozen files in the repository: the <a class="concept-chip" data-concept="adr" role="button" tabindex="0">ADR</a> (<em>Architecture Decision Record</em>). An ADR is a short document — one page — recording a structural decision in three parts: the <strong>context</strong> (what problem motivated it), the <strong>decision</strong>, and the <strong>consequences</strong> accepted, including the negative ones. The format was popularized by Michael Nygard, and its golden rule is honesty: an ADR that admits no downsides is propaganda, not a decision.' },
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
        { type: 'p', html: 'The repository keeps the full justification in <button class="adr-ref" data-adr="002" type="button">ADR 002</button>, plus two diagrams worth a thousand words: how modules are grouped today, and how any of them gets extracted tomorrow without major surgery.' },
        { type: 'figure', src: '/img/FF_Modularization.PNG', alt: 'Diagram of the monolith modularization', caption: 'The monolith\u2019s modularization: modules with strict boundaries inside a single deployable. (ArchColider original document)' },
        { type: 'figure', src: '/img/FF_ModularizationExtraction.PNG', alt: 'Diagram of future module extraction', caption: 'The evolution path: any module is extracted as an independent service when telemetry justifies it. (ArchColider original document)' },
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
        { type: 'h3', html: 'The metamodel: rules on one side, execution on the other' },
        { type: 'p', html: 'The repository\u2019s least obvious gem is a diagram called the <em>metamodel</em>. It separates two levels that usually tangle into one mess: the <strong>knowledge level</strong> (the rules: which user types exist, which actions each may perform, which promotions apply to which menus) and the <strong>operational level</strong> (day-to-day facts: this order, this menu, this kitchen). It is the same separation as between "the tournament rulebook" and "Sunday\u2019s match".' },
        { type: 'figure', src: '/img/FF_Metamodel_v1.png', alt: 'Conceptual metamodel: knowledge level and operational level', caption: 'The metamodel: business rules (top) separated from operational entities (bottom). The direct answer to the Entity Trap. (ArchColider original document)' },
        { type: 'p', html: 'This cut pays off enormously later: when the business invents a new promotion type or user profile, a rule in the "rulebook" changes without rewriting the "match". The metamodel is designed to absorb scenarios that do not exist yet.' },
      ],
    },

    /* ───────────────────────── 6 ───────────────────────── */
    {
      id: 'concurrency',
      phase: 'The design',
      title: 'The physical world: fridges, money and flaky connections',
      blocks: [
        { type: 'p', html: 'This is where the case stops being theoretical and becomes engineering of reality. Three concrete problems, three elegant solutions.' },
        { type: 'h3', html: 'Problem 1: two people want the last meal' },
        { type: 'p', html: 'The temptation is to lock the database ("nobody touches stock while I buy"). The team did something better using a physical quirk of the business: <strong>a meal cannot jump from one fridge to another</strong>. So each fridge gets its own <a class="concept-chip" data-concept="actor-model" role="button" tabindex="0">actor</a>: a process that handles that fridge\u2019s purchases one at a time, in order. There are never two simultaneous writes to the same stock, so no locks are ever needed. Stock lives in memory, at processor speed.' },
        { type: 'figure', src: '/img/FF_concurency_order_processing.PNG', alt: 'Order processing diagram with actors', caption: 'Orders passing from actor to actor, each with a single responsibility. (ArchColider original document)' },
        { type: 'h3', html: 'Problem 2: the customer disputing a bad charge' },
        { type: 'p', html: 'A business handling food and money will get disputes. The question is what evidence exists when the dispute arrives. The team\u2019s answer was <a class="concept-chip" data-concept="event-sourcing" role="button" tabindex="0">Event Sourcing</a>: recording every order as an immutable sequence of events instead of a state that gets erased and rewritten. And so the "charge this order" message never gets lost or processed twice, they used a <a class="concept-chip" data-concept="message-queue" role="button" tabindex="0">message queue</a> with delivery confirmation and unique identifiers.' },
        { type: 'decision', id: 'event-sourcing' },
        { type: 'decision', id: 'rabbitmq' },
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
      id: 'infrastructure',
      phase: 'The design',
      title: 'Landing the design in the cloud',
      blocks: [
        { type: 'p', html: 'Everything so far is pure logic; at some point servers must be paid for. The team chose AWS for a brief constraint and a practical reason: the region closest to Detroit. The topology is a lesson in well-understood <a class="concept-chip" data-concept="vpc" role="button" tabindex="0">private networking</a>: a private enclosure with the load balancer at the gate, servers inside with no public addresses, everything duplicated across two separate datacenter buildings.' },
        { type: 'figure', src: '/img/infra-vpc.png', alt: 'AWS VPC network topology diagram', caption: 'The VPC: two availability zones, public subnets (load balancers) and private ones (the servers, no public IP). (ArchColider original document)' },
        { type: 'h3', html: 'Checking credentials at the gate' },
        { type: 'p', html: 'The most didactic security detail: instead of every piece of software verifying every visitor\u2019s identity, the <strong>incoming load balancer</strong> does it against AWS\u2019s identity service (Cognito) before traffic reaches the servers. Servers only receive pre-verified visitors. And inside, zero trust: modules also demand authorization from each other, as if they were already separate services — so the day they split apart, security is already done.' },
        { type: 'decision', id: 'edge-auth' },
        { type: 'figure', src: '/img/Authentication.png', alt: 'Authentication flow diagram with Cognito and ALB', caption: 'The authentication flow: the load balancer validates tokens against Cognito at the network edge. (ArchColider original document)' },
        { type: 'figure', src: '/img/services.png', alt: 'Services and virtual hardware overview: servers, queues, streaming and SaaS by subnet', caption: 'The full topology: every server is a t3.medium template; queues, log streaming, and the external SaaS with their roles. (ArchColider original document)' },
        { type: 'h3', html: 'What if the business grows?' },
        { type: 'p', html: 'The scaling strategy is the most honest in the case: first buy a bigger machine ("vertical scale"), and only multiply instances behind load balancers ("horizontal scale") when telemetry — mandatory, guiding principle number three — shows vertical has hit its ceiling. By then, the highest-pressure module is extracted from the monolith, exactly as designed in the style section.' },
        { type: 'p', html: 'And that telemetry has an extra trick worth knowing: besides machine metrics, the system monitors itself with <strong>synthetic scenarios</strong> — a "dummy customer" walks the critical path (pick a meal, pay, pick up) every few minutes and measures whether the result is correct and how long it took. A machine can be "healthy" while business logic is stuck; the phantom customer finds out. Those numbers are also the signal that decides when to split the monolith.' },
        { type: 'decision', id: 'scale-up' },
        { type: 'h3', html: 'The risks, each with a mitigation at hand' },
        { type: 'p', html: 'The team’s analysis ends with something most submissions omit: a risk list where every risk has its mitigation option written next to it. Not all are technical — several are business decisions the team explicitly marked as "to resolve with the owner". A selection:' },
        {
          type: 'list',
          items: [
            '<strong>The payment gateway goes down:</strong> orders are stored and retried for a defined period; meanwhile, a trust policy for known users and subscribers (we already know who they are).',
            '<strong>Review bombing of third-party kitchens:</strong> only someone with a confirmed charge can post a review — reputation is designed too.',
            '<strong>The notification channel fails:</strong> a backup channel; and if the meal already reached the fridge, sometimes the best notification is none.',
            '<strong>Scaling spikes the bill:</strong> a maximum instance cap per service, and above the threshold, human confirmation before anything is turned on.',
            '<strong>A release breaks something:</strong> hot-swap to the previous release as a platform requirement, not a hope.',
          ],
        },
      ],
    },

    /* ───────────────────────── 8 ───────────────────────── */
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
          ],
        },
        { type: 'p', html: 'This is the most transferable habit in the whole cost section: a serious architect sizes <strong>bytes and frequencies before choosing servers</strong>. The table also justifies decisions you\u2019ve already seen — for instance, why download the whole catalog once a day and keep it fresh with 0.1 kb messages, instead of re-fetching it on every screen.' },
        { type: 'figure', src: '/img/traffic_forecst.png', alt: 'Monthly traffic forecast', caption: 'The team\u2019s traffic forecast: ~16.5 GiB monthly in the projected scenario. (ArchColider original spreadsheet)' },
        {
          type: 'stats',
          items: [
            { value: '$12,248', label: 'total year-1 cost in the minimum scenario' },
            { value: '$12,548', label: 'in the projected-growth scenario' },
            { value: '$22,481', label: 'in the rapid-growth scenario (×10)' },
            { value: '~$1,000', label: 'per month to run the whole business in the base scenario' },
          ],
        },
        { type: 'p', html: 'Now, the fact that surprises everyone: the most expensive line of the bill is not the servers. It is <strong>monitoring</strong> (DataDog, $3,336/year) followed by <strong>reporting</strong> (Tableau, $1,440/year): together, about 40% of the yearly budget. Why pay for them? Because the "free" alternative — standing up the open-source tools on your own servers — costs the most expensive thing there is: developer hours from a small team.' },
        { type: 'decision', id: 'datadog' },
        { type: 'figure', src: '/img/1y-min-tco.png', alt: 'Yearly total cost distribution by service', caption: 'The yearly budget distribution: monitoring and reporting outweigh compute. (ArchColider original document)' },
        { type: 'callout', tone: 'amber', title: 'The budget lesson', html: 'Comparing "free" against "paid" by looking only at the monthly bill is the classic mistake. A tool\u2019s real cost includes whoever will maintain it. Sometimes paid software is the cheapest in the world.' },
      ],
    },

    /* ───────────────────────── 9 ───────────────────────── */
    {
      id: 'map',
      phase: 'Economic reality',
      title: 'The complete decision map',
      blocks: [
        { type: 'p', html: 'The repository delivered sixteen ADRs, but they don\u2019t all carry the same weight: some are deep structural decisions, some are operational hygiene, and some are paperwork. We did the curation for you: the decisions that truly define this architecture, grouped into three pillars, each in its essential form — <strong>problem, decision, and the trade-off accepted</strong> — with the link to the original document.' },
        { type: 'decisionMap' },
      ],
    },

    /* ───────────────────────── 10 ───────────────────────── */
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
