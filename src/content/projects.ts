export interface Project {
  readonly slug: string
  readonly title: string
  readonly evidence: string
  readonly problem: string
  readonly system: string
  readonly architecture: string
  readonly ownership: string
  readonly decisions: readonly string[]
  readonly verification: string
  readonly readiness: string
  readonly boundary: string
  readonly stack: readonly string[]
  readonly repo: string
  readonly image: { readonly src: string; readonly alt: string; readonly width: number; readonly height: number }
}

/**
 * Every claim below is limited to what the named public repository contains.
 * The images are real screenshots rendered from each repository's own build,
 * captured at 1672x941; they are not mockups and not concept art. Regenerate
 * by building the repository and photographing the served page.
 */
export const projects: readonly [Project, Project, Project] = [
  {
    slug: 'panelogram',
    title: 'Panelogram Retail Shelf Planner',
    evidence: 'Local-first alpha with a published static build',
    problem:
      'Laying out one bay of retail shelving to scale usually means guesswork or a heavyweight planogram suite. A merchandiser needs exact shelf widths, used and free space per shelf, and a printable report grouped by shelf.',
    system:
      'A local-first, single-page planning tool that draws one shelving bay to scale in SVG with millimetre rulers, drag-and-drop product placement, capacity and clearance checks, CSV product import and a printable shelf report. Everything runs in the browser: no server, no account, no network dependency after first load.',
    architecture:
      'A pure TypeScript domain core (geometry rules, document mutations, validating persistence, CSV import, reporting) sits under a thin React shell with snapshot undo and debounced localStorage autosave. All dimensions are integer millimetres and all money is integer cents, formatted only at display time.',
    ownership:
      'Sole engineer across the domain model, geometry rules, interface, persistence, test suite and static publishing path.',
    decisions: [
      'One geometry module is the single source of capacity, clearance, snapping and offset maths; the interface is never allowed to recompute those numbers inline.',
      'Validation fails closed: a broken import is rejected with a reason instead of silently repaired, and an unparseable price is never coerced to zero.',
    ],
    verification:
      '39 unit tests over the domain core exercise every numbered geometry rule, report totals, CSV edge cases and lossless persistence round trips, alongside strict TypeScript and a scripted browser capture check.',
    readiness:
      'A usable alpha, deliberately scoped to one bay in a single browser session, with a committed production bundle and a documented GitHub Pages publishing path. No accounts, sync or collaboration by design.',
    boundary:
      'This record does not claim retail deployment, multi-bay planning, other fixture types or any usage figures. The repository is public but not open-source licensed.',
    stack: ['TypeScript', 'React', 'Vite', 'SVG', 'Vitest', 'GitHub Pages'],
    repo: 'https://github.com/Sajeevanveeriah/Planogram',
    image: {
      src: '/assets/image/20260826-Panelogram-Bay-Layout-Rev00.png',
      alt: 'Screenshot of Panelogram rendering a six-shelf bay to scale with millimetre rulers, per-shelf capacity figures and one shelf flagged as over capacity.',
      width: 1672,
      height: 941,
    },
  },
  {
    slug: 'swl-pricing-inventory-control',
    title: 'SWL Pricing and Inventory Control',
    evidence: 'Client-commissioned system, release 1.2.0',
    problem:
      'Stan Wootton Locksmiths reprices its ServiceM8 materials catalogue from supplier price exports. Doing that by spreadsheet risks damaged item numbers and barcodes, an inconsistent markup and unreviewed price changes reaching the job system.',
    system:
      'A local-first pricing and inventory control application with a Windows desktop surface and a browser surface. It compares an untouched supplier export against the current ServiceM8 materials list, applies the confirmed 30 percent markup on GST-exclusive cost, and produces an operator-reviewed import CSV in ServiceM8\'s exact format, with change, exception, rollback and audit reports.',
    architecture:
      'A shared React and TypeScript interface over pure domain modules for money, pricing, comparison, mapping and output. A typed platform adapter selects the backend: scoped Tauri commands with bundled SQLite on the Rust desktop build, a loopback Node server for local web use, and a session-only store for the static demonstration.',
    ownership:
      'Sole engineer across requirements, domain rules, the desktop and web builds, file-format contracts, test strategy, CI and Windows release packaging.',
    decisions: [
      'Matching is deterministic and fail-closed: exact normalised code, then operator-approved alias, then description similarity as a suggestion only. Items missing from a supplier file are never deleted, and money is never binary floating point.',
      'Imported business rows stay in memory and are never persisted; repository checks and CI enforce a no-production-data and no-secrets rule on every change.',
    ],
    verification:
      'More than 500 automated checks: Vitest unit and property-based tests, Playwright browser tests with axe accessibility runs, WebdriverIO tests against the installed desktop app and Rust unit tests, including a byte-for-byte round trip of the ServiceM8 CSV contract. Typecheck, lint, tests and packaging run in CI.',
    readiness:
      'Release 1.2.0 builds an unsigned Windows installer and a browser demonstration through CI. Production installation, code signing and automatic updates sit outside the current release boundary and are tracked in the repository\'s gap register.',
    boundary:
      'This record does not claim a completed production rollout, live supplier or accounting integrations in use, or outcomes beyond what the public repository shows. The software is proprietary to the client.',
    stack: ['TypeScript', 'React', 'Tauri 2', 'Rust', 'SQLite', 'Node.js', 'Vitest', 'Playwright', 'GitHub Actions'],
    repo: 'https://github.com/Sajeevanveeriah/Inventory-Management-SWL',
    image: {
      src: '/assets/image/20260826-SWL-Pricing-Run-Rev00.png',
      alt: 'Screenshot of the SWL Pricing and Inventory Control new-run screen showing the seven-stage workflow from adding files to a reviewed export, with the current business rules panel.',
      width: 1672,
      height: 941,
    },
  },
  {
    slug: 'snail-race',
    title: 'Snail Race Fundraising Platform',
    evidence: 'Complete event platform, version 3.0.0',
    problem:
      'A cricket club fundraising night needs an entertaining projector stage, live card donations from the room and a ledger that reconciles to the dollar at the end of the night, all run by one moderator on venue hardware.',
    system:
      'A Next.js platform for the Newcomb and District Cricket Club: an animated race stage, a QR donation flow through Stripe Checkout, a parimutuel tote board and a moderator console. Real money exists only as donations with no return; the fun bets use free play chips with no cash payout, which keeps the night a fundraiser rather than a wagering product.',
    architecture:
      'A DOM-free race engine draws the finishing order with a seeded Fisher-Yates shuffle, so every lane wins with probability exactly one in the field size and a printed seed can be replayed to verify any result. Stripe is the ledger and there is no database: the stage polls paid checkout sessions, and cash entries, results and backups live in the moderator\'s localStorage.',
    ownership:
      'Sole engineer across the race engine, broadcast renderer, donation flow, tote and reconciliation model, moderator console and deployment workflow.',
    decisions: [
      'Donations can never influence a result: the draw reads only the seed and the field size, and the tote board shows what the room has backed with deliberately no house margin.',
      'One codebase ships two shapes: a server build with the Stripe routes, and a static GitHub Pages build that strips them and degrades to cash-and-chips with the status shown on stage.',
    ],
    verification:
      'Strict TypeScript and ESLint, a moderator-facing verify-draw panel that replays any printed seed against the recorded finishing order, and a deploy workflow that fails unless the published site responds and actually serves the game.',
    readiness:
      'Version 3.0.0 with working deployment paths for a Node host and for GitHub Pages. Card donations switch on only when a Stripe key is configured in the deployment environment; without one the platform runs cash-and-chips only and says so on screen.',
    boundary:
      'This record does not claim real-money betting, wagering or gambling capability: backing a snail is a donation with no return and play chips have no cash value. No live event, attendance or takings figures are claimed.',
    stack: ['Next.js', 'React', 'TypeScript', 'Stripe Checkout', 'Tailwind CSS', 'Web Audio', 'GitHub Actions'],
    repo: 'https://github.com/Sajeevanveeriah/SnailRace',
    image: {
      src: '/assets/image/20260826-Snail-Race-Stage-Rev00.png',
      alt: 'Screenshot of the Snail Race projector stage before race one, showing the animated track, the race one tote board with equal one-in-six chances and the play-chip fun bets panel.',
      width: 1672,
      height: 941,
    },
  },
] as const

export const featuredProjects = projects


export interface IndexedProject {
  readonly title: string
  readonly summary: string
  readonly evidence: string
  readonly link?: string
}

export interface ProjectGroup {
  readonly group: string
  readonly items: readonly IndexedProject[]
}

/**
 * The complete project index beyond the three flagship records. Every entry
 * is carried over from the previously published portfolio records preserved
 * under archive/20260810-legacy-portfolio/, with client-programme names kept
 * inside the boundaries AGENTS.md sets. Entries link out only where a public
 * repository exists.
 */
export const projectIndex: readonly ProjectGroup[] = [
  {
    group: 'Robotics and physical systems',
    items: [
      {
        title: 'Upzy: Supervised Routine Companion Robot',
        summary: 'A completed, privacy-conscious educational routine companion robot for young children, with a supporting browser application for adult-defined routines and review.',
        evidence: 'Deployed physical system',
        link: 'https://github.com/Sajeevanveeriah/Upzy-Project',
      },
      {
        title: 'Inventory Scanning Mobile Robot',
        summary: 'An operator-support mobile robot that assists physical inventory scanning and connects captured stock observations to a controlled review workflow.',
        evidence: 'Active client deployment',
      },
      {
        title: 'Modular Education and Testing Robot',
        summary: 'A modular robot platform for education, engineering experiments and repeatable subsystem testing, in active supervised use.',
        evidence: 'Deployed physical system',
      },
      {
        title: 'Autonomous Navigation Rover on ROS 2',
        summary: 'A complete ROS 2 Humble autonomy stack with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion, validated in simulation.',
        evidence: 'Simulation-validated autonomy stack',
      },
      {
        title: 'ESP32 Clinical Ataxia Assessment Device',
        summary: 'Embedded hardware and firmware for movement assessment support, validated against clinical reference instruments.',
        evidence: 'Assessed embedded prototype',
        link: 'https://github.com/Sajeevanveeriah/Ataxia-Monitor',
      },
      {
        title: 'DuxTel Agricultural Equipment Telemetry',
        summary: 'A custom PCB-based field telemetry system combining CAN capture, GPS and condition sensing with MikroTik connectivity and a Linux server for remote machinery visibility.',
        evidence: 'Deployed physical system',
      },
    ],
  },
  {
    group: 'Software and AI platforms',
    items: [
      {
        title: 'Engineering Mastery Lab',
        summary: 'A browser-first engineering workbench combining input-validated calculators, bounded parametric CAD, eight guided learning labs and evidence-focused project workflows.',
        evidence: 'Deployed software system',
        link: 'https://github.com/Sajeevanveeriah/Engineering-Mastery-Lab',
      },
      {
        title: 'VeerAI: Local SLM System',
        summary: 'A complete local AI system: an open-weight small language model on personally owned hardware inside a governed pipeline spanning ingestion, retrieval, memory, tools and evaluation.',
        evidence: 'Locally deployed private system',
      },
      {
        title: 'Newcomb and District Cricket Club Platform',
        summary: 'The official NDCC digital platform, combining the public club website with committee content, membership, merchandise, gallery, sponsor and administration workflows.',
        evidence: 'Deployed software system',
        link: 'https://github.com/Sajeevanveeriah/ndcc-website',
      },
      {
        title: 'Digital Twin and Industrial AI',
        summary: 'A real-time factory digital twin concept integrating AI agents, anomaly detection, predictive maintenance and OEE analytics.',
        evidence: 'Concept development',
      },
    ],
  },
  {
    group: 'Industrial and automotive delivery',
    items: [
      {
        title: 'Regulated Smart Factory and SCADA Migration',
        summary: 'GMP smart-factory automation delivery, including an iFIX to PVI+ SCADA migration verified against the validated system.',
        evidence: 'Hands-on professional integration',
      },
      {
        title: 'ADAS and CAN Validation',
        summary: 'Feature, breadboard and OTA regression testing across vehicle development programmes for a global automotive OEM, supported by CAN-level fault evidence.',
        evidence: 'Hands-on professional integration',
      },
      {
        title: 'ABMARC Emissions and Compliance Testing',
        summary: 'Repeatable, auditable emissions testing against ADR and EURO standards, supported by calibrated instrumentation and QA records.',
        evidence: 'Hands-on professional integration',
      },
      {
        title: 'Carbon Revolution: Robotic Rim Layup Automation',
        summary: 'Hands-on work through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
        evidence: 'Hands-on professional integration',
      },
      {
        title: 'IDL: Canning Line Upgrade and Commissioning',
        summary: 'Hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.',
        evidence: 'Hands-on professional integration',
      },
      {
        title: 'Manufacturing and QA Foundation',
        summary: 'Six years across food and beverage, carbon-fibre and structural-steel production, spanning operations, QA, traceability, robotic automation and commissioning.',
        evidence: 'Hands-on professional integration',
      },
    ],
  },
] as const

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
