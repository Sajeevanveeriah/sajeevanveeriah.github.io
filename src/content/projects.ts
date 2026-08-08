import type { EvidenceState, EvidenceTier } from './tiers'

/**
 * Work records.
 *
 * Every string below was transcribed verbatim from the previous index.html,
 * then recast on 7 August 2026 at the owner's direction into a generic,
 * agentless indicative voice: capability statements with no named person and
 * no personal pronouns. Voice and grammar only: no claim
 * was added, strengthened, weakened or dropped. Where the old site had no
 * copy for a field, the field carries a TODO marker and renders nothing.
 *
 * Source-field mapping from the old nine-field case studies:
 *   Problem                -> problem
 *   Context                -> context
 *   System architecture  \
 *   Engineering decisions / -> approach   (both paragraphs, in order)
 *   Tools and technologies -> toolsNote   (card "Key tools" -> stack)
 *   Validation method      -> validation
 *   Output                 -> outcome
 *   Evidence level         -> proves and doesNotClaim (Phase 0 rewrite)
 *   What it demonstrates   -> demonstrates
 */

export interface ProjectImage {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly caption?: string
  readonly displayMode?: 'contain' | 'cover' | 'full-bleed'
  readonly aspectRatio?: string
  readonly objectPosition?: string
  readonly background?: 'light' | 'dark' | 'neutral'
  readonly sizes?: string
  readonly mobileSrc?: string
  readonly mobileAspectRatio?: string
}

export interface ProjectLink {
  readonly label: string
  readonly url: string
}

export interface Project {
  readonly slug: string
  readonly title: string
  readonly summary: string
  /**
   * Null where Saj has not supplied one.
   *
   * This was a bare `string` carrying the literal `'TODO: Saj to supply.'`.
   * The detail route guarded that placeholder out of the visible page, but
   * `WorkArchive` is a client component, so every field of every discoverable
   * record serialises into the RSC flight payload regardless of what is
   * painted, and the editorial marker shipped inside the public HTML and
   * index.txt. Null cannot leak a sentence, so the type carries the absence
   * instead, exactly as `period` already does.
   */
  readonly role: string | null
  readonly period: string | null
  readonly domain: string
  readonly disciplines: readonly string[]
  readonly stack: readonly string[]
  readonly problem: string
  readonly context: string
  /** System architecture, then Engineering decisions. */
  readonly approach: readonly string[]
  readonly toolsNote: string
  readonly validation: string
  readonly outcome: string
  /** What this record proves, stated plainly in agentless indicative voice (recast on 7 August 2026 at the owner's direction). */
  readonly proves: string
  /**
   * What the record does not claim. Boundaries are stated as facts about
   * publication or environment, never as deficiencies in the work.
   */
  readonly doesNotClaim: string
  readonly demonstrates: string
  readonly evidenceTier: EvidenceTier | null
  /**
   * The precise evidence state for this record, assigned individually.
   * Null only where no state has been assigned; the UI then renders nothing
   * rather than guessing one.
   */
  readonly evidenceState: EvidenceState | null
  /** One sentence naming a disclosure boundary, where one applies. */
  readonly evidenceNote?: string
  readonly category: string
  readonly links?: readonly ProjectLink[]
  readonly images?: readonly ProjectImage[]
  readonly featured: boolean
  /**
   * Withheld from every discovery surface: nav panels, index listings,
   * related-work modules and the sitemap. The route still builds and
   * resolves at its original URL, deliberately, and the page carries
   * `noindex`. Suppression is not deletion: nothing is removed from the
   * record set and no history is rewritten.
   */
  readonly suppressed?: true
  readonly homeExcerpt?: {
    readonly ownership: string
    readonly outcome: string
  }
  /** Extra verbatim fields the old site carried on a single record. */
  readonly deepDives?: readonly ProjectLink[]
}

export const projects: readonly Project[] = [
  {
    /*
     * Completed independent robotics and product engineering work. Saj
     * confirmed on 6 August 2026 that the physical robot and its supporting
     * browser application are deployed and used by end-users. The public record
     * keeps undisclosed implementation details and outcome claims bounded.
     *
     * The live GitHub Pages deployment returned HTTP 200 on 6 August 2026.
     */
    slug: 'upzy-supervised-routine-companion',
    title: 'Upzy: Supervised Educational Routine Companion Robot',
    summary:
      'Completed and deployed Upzy, a supervised, privacy-conscious physical educational routine companion robot for young children, with a supporting browser application used by end-users for adult-defined routines, simple child-facing prompts and adult review while keeping button interactions separate from proof that an activity occurred.',
    role: 'Robotics, mechatronics and application developer',
    period: 'Jun 2026 onward',
    domain: 'Human-centred robotics and product development',
    disciplines: ['Robotics', 'Mechatronics', 'Embedded', 'Software', 'Validation'],
    stack: ['Physical robot platform', 'Mechatronic integration', 'React 19', 'TypeScript', 'Vite', 'Vitest', 'Browser localStorage'],
    problem:
      'Young children can benefit from clear, repeatable routine prompts, but a support concept must avoid surveillance, false completion claims and unnecessary data collection.',
    context:
      'Upzy was completed as an independent robotics and product engineering project, and the physical robot was deployed with its supporting browser application. It is now used by end-users within the supervised routine workflow. The public record does not claim measured educational outcomes or disclose implementation details beyond the supporting application.',
    approach: [
      'Designed and built the physical routine-companion robot and its supporting React and TypeScript single-page application, with a guided routine flow, routine creation and editing, an interaction dashboard and deterministic browser-local state.',
      'Designed the boundaries deliberately: supervised use, no cameras or microphones, no accounts, no analytics, no cloud database, versioned local storage, and explicit wording that Done records an acknowledgement rather than real-world completion.',
    ],
    toolsNote:
      'Physical robot and mechatronic integration, with public software details covering React 19, TypeScript 5.9, Vite 7, Vitest, Testing Library, browser-local versioned storage and static GitHub Pages routing. Detailed hardware and embedded implementation remain unpublished.',
    validation:
      'Validated the supporting application with linting, TypeScript checks, Vitest, production builds and tests for missing, malformed, partial, outdated and deeply invalid stored data. The application restores deterministic sample data instead of trusting invalid state, and the deployed GitHub Pages endpoint was verified to respond successfully. Deployment and active end-user use provide operational evidence for the physical robot and integrated workflow, while detailed hardware test evidence remains unpublished.',
    outcome:
      'Delivered and deployed a working physical routine-companion robot with a supporting browser application, now used by end-users for supervised routine prompts, adult routine configuration and transparent interaction review.',
    proves:
      'Translated a human-centred robotics concept into a completed, deployed and actively used physical robot and supporting interface while preserving clear privacy, supervision and evidence boundaries.',
    doesNotClaim:
      'The public record does not disclose detailed hardware, electronics, embedded software or connectivity architecture. It does not claim independently verified task completion, child monitoring, measured educational or clinical outcomes, commercial product certification or child-safety certification.',
    demonstrates:
      'Combined physical robotics, mechatronics, product definition, accessible interface design, local data handling, privacy boundaries, deployment and validation into a completed routine-companion system.',
    evidenceTier: 'delivered',
    evidenceState: 'Deployed physical system',
    evidenceNote:
      'Detailed hardware, electronics and embedded implementation remain unpublished.',
    category: 'Deployed independent robotics and product engineering',
    links: [
      { label: 'Open deployed app', url: 'https://sajeevanveeriah.github.io/Upzy-Project/' },
      { label: 'View source', url: 'https://github.com/Sajeevanveeriah/Upzy-Project' },
    ],
    images: [
      {
        src: '/assets/image/20260806-Upzy-Supervised-Routine-Companion-Rev00.png',
        alt: 'Concept visual of a small friendly tabletop routine companion with a simple display and physical response controls in a calm supervised home setting.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership:
        'Owned the physical robot and product framing, mechatronic system, interaction model, privacy boundaries, supporting application, deployment and validation.',
      outcome:
        'A completed physical robot and supporting application in active end-user use that keep interaction records separate from claims about real-world completion.',
    },
    featured: true,
  },
  {
    /*
     * Completed client engineering software for Stan Wootton Locksmiths.
     * Saj confirmed on 6 August 2026 that the system is deployed and used by
     * its end-users. The source repository remains private and real business
     * data, credentials and generated operational outputs are not published.
     */
    slug: 'swl-pricing-inventory-control',
    title: 'SWL Pricing and Inventory Control',
    summary:
      'Designed, implemented and deployed a controlled browser and Windows desktop workflow now used by Stan Wootton Locksmiths to compare supplier and ServiceM8 exports, apply a confirmed 30% markup on cost, route exceptions and proposals through operator review, and produce reviewable import, change, exception, rollback and audit outputs.',
    role: 'System architect and full-stack developer',
    period: 'Jun 2026 onward',
    domain: 'Inventory systems and engineering software',
    disciplines: ['Software', 'Automation', 'Validation'],
    stack: ['React', 'TypeScript', 'Vite', 'Tauri 2', 'Node.js', 'Vitest', 'Playwright'],
    problem:
      'Supplier price changes and ServiceM8 inventory records need to be reconciled without silent matching errors, unsafe price calculations or uncontrolled production imports.',
    context:
      'This system was delivered and deployed for Stan Wootton Locksmiths around supplier and ServiceM8 file handoffs. Its operators now use the workflow while every proposed change remains reviewable and reversible and real business data stays protected.',
    approach: [
      'Implemented defensive CSV and XLSX parsing, confirmed column mapping, deterministic identifier matching, decimal-safe pricing, status classification, exception handling, operator approvals and controlled export generation.',
      'Added formula-injection protection, duplicate and ambiguity blocks, rollback and audit outputs, local configuration boundaries, a Windows Tauri shell, and an own-origin Node service for controlled competitor-price searches without transmitting imported business rows.',
    ],
    toolsNote:
      'React, TypeScript, Vite, Tauri 2, Rust, Node.js, ExcelJS, Papa Parse, big.js, Zod, IndexedDB, Vitest, Playwright and axe-core.',
    validation:
      'Validated the system with strict TypeScript checks, linting, unit and integration tests, property-based tests, production builds, Playwright end-to-end and accessibility tests, formula-injection tests and a repository data-safety detector. Deployment and active operator use provide operational evidence of the complete workflow.',
    outcome:
      'Delivered and deployed a working controlled workflow now used for pricing review and inventory preparation, with explicit exceptions, approvals, rollback evidence and operator-reviewed ServiceM8 output.',
    proves:
      'Delivered a real operational pricing and inventory system spanning data ingestion, deterministic business rules, operator review, desktop packaging, deployment and validation.',
    doesNotClaim:
      'The deployed workflow deliberately keeps ServiceM8 updates as operator-reviewed file handoffs and does not make direct writes to ServiceM8 or Xero. No real business exports, generated operational outputs or credentials are published.',
    demonstrates:
      'Integrated operational requirements, data safety, deterministic pricing, exception workflows, product UX, desktop delivery, deployment and automated validation into one controlled system.',
    evidenceTier: 'delivered',
    evidenceState: 'Active client deployment',
    category: 'Deployed client engineering software',
    images: [
      {
        src: '/assets/image/20260806-SWL-Pricing-Inventory-Control-Rev00.png',
        alt: 'Concept visual of local supplier and inventory data moving through controlled comparison, exception review and approved workbook outputs on a clean engineering workstation.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership:
        'Owned the system architecture, data contracts, deterministic business rules, review workflow, desktop boundary and validation strategy.',
      outcome:
        'A deployed application in active operator use that prepares reviewable pricing and inventory outputs without direct external-system writes.',
    },
    featured: true,
  },
  {
    /*
     * Completed and deployed client-facing robotics work. Saj confirmed on
     * 6 August 2026 that the robot is in active end-user use. The public record
     * stays technology-neutral to protect client and implementation details.
     */
    slug: 'inventory-scanning-mobile-robot',
    title: 'Inventory Scanning Mobile Robot',
    summary:
      'Designed, built and deployed an operator-support mobile robot that assists physical inventory scanning and connects captured stock observations to a controlled review workflow. It is in active use by its end-users.',
    role: 'Robotics system designer and developer',
    period: 'Jun 2026 onward',
    domain: 'Mobile robotics and inventory automation',
    disciplines: ['Robotics', 'Embedded', 'Software', 'Automation'],
    stack: [
      'Requirements engineering',
      'System architecture',
      'System integration',
      'Deployment and handover',
    ],
    problem:
      'Physical stock capture is repetitive and error-prone when observations, item identity, location and inventory records are disconnected.',
    context:
      'This system was delivered as client-facing robotics work alongside the SWL inventory workflow. It is deployed and actively used, while detailed hardware, identification and autonomy implementation choices remain unpublished.',
    approach: [
      'Defined and implemented the system boundary across mobility, item identification, location association, inventory data handoff and operator confirmation.',
      'Treated navigation, identification and data integrity as separate verification problems so uncertain observations stop for review instead of silently changing inventory records.',
    ],
    toolsNote:
      'The delivered scope spans requirements, system architecture, mobility, item identification, location association, workflow integration, operator review, deployment and handover. Detailed hardware and software selections remain unpublished.',
    validation:
      'Deployment and active end-user use provide operational evidence that the integrated robot and review workflow are working. Detailed client-site evidence, component choices and quantitative scan, navigation and safety results remain unpublished.',
    outcome:
      'Delivered a completed mobile robot deployed for active end-user use, linking physical stock capture to controlled inventory review while retaining operator authority.',
    proves:
      'Applied mobile robotics and systems-engineering discipline to deliver a working inventory system while preserving operator authority and data-integrity boundaries.',
    doesNotClaim:
      'This record does not claim lights-out warehouse autonomy, replacement of operator review, a publicly disclosed scanner or sensor suite, certified safety or unpublished performance figures.',
    demonstrates:
      'Delivered a cross-domain cyber-physical system across mobility, sensing, data association, workflow integration and verification.',
    evidenceTier: 'delivered',
    evidenceState: 'Active client deployment',
    evidenceNote:
      'Technical implementation remains confidential. The public record describes the workflow and outcome without exposing client architecture.',
    category: 'Deployed client robotics',
    images: [
      {
        src: '/assets/image/20260806-Inventory-Scanning-Mobile-Robot-Rev00.png',
        alt: 'Concept visual of a compact operator-support mobile robot moving beside organised inventory shelving with a non-specific sensor head for stock observation.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership:
        'Owned the delivered system boundary across mobility, item identification, location association, inventory data handoff, operator confirmation and deployment.',
      outcome:
        'A completed mobile robot in active end-user use, linking physical stock capture to controlled inventory review.',
    },
    featured: false,
  },
  {
    /*
     * Completed and deployed client-facing robotics work. Saj confirmed on
     * 6 August 2026 that the platform is in active end-user use. Component and
     * software-stack details remain unpublished to protect implementation
     * boundaries.
     */
    slug: 'modular-education-testing-robot',
    title: 'Modular Education and Testing Robot',
    summary:
      'Designed, built and deployed a modular robot platform for education, engineering experiments and repeatable subsystem testing. It is in active use by end-users, with clear interfaces and observable behaviour supporting supervised operation.',
    role: 'Robotics and mechatronics system designer and developer',
    period: 'Jun 2026 onward',
    domain: 'Educational robotics and engineering test systems',
    disciplines: ['Robotics', 'Mechatronics', 'Embedded', 'Validation'],
    stack: [
      'Modular architecture',
      'Interface definition',
      'System integration',
      'Deployment and validation',
    ],
    problem:
      'Education and early robotics experiments need a platform that exposes how sensing, control and actuation interact without locking every lesson or test into one fixed configuration.',
    context:
      'This was delivered as a reusable robotics platform for supervised learning and engineering experiments. It is deployed and actively used by end-users, while the detailed hardware and software configuration remains unpublished.',
    approach: [
      'Structured and built the platform around replaceable sensing, control and actuation modules with defined interfaces and a stable test boundary.',
      'Prioritised supervised operation, visible system state, repeatable test cases and modular replacement so learning and engineering iteration can use the same platform without hiding failure modes.',
    ],
    toolsNote:
      'The delivered scope covers modular system architecture, interface definition, system integration, supervised-use boundaries, repeatable test workflows, deployment and handover. Component and software-stack details remain unpublished.',
    validation:
      'Deployment and active end-user use provide operational evidence that the integrated platform supports supervised education and repeatable engineering experiments. Component evidence, quantitative performance measurements and learning-outcome data remain unpublished.',
    outcome:
      'Delivered a completed modular robot platform now deployed and used by end-users for education, engineering experiments and repeatable subsystem testing.',
    proves:
      'Applied mechatronic architecture and validation thinking to deliver a reusable robotics learning and test platform.',
    doesNotClaim:
      'This record does not claim certified safety, production-scale manufacturing readiness, measured learning outcomes, a publicly disclosed component set or unpublished performance figures.',
    demonstrates:
      'Delivered a robotics platform designed around modularity, observable behaviour, supervised use and repeatable engineering tests.',
    evidenceTier: 'delivered',
    evidenceState: 'Deployed physical system',
    evidenceNote:
      'Component and software-stack details remain unpublished.',
    category: 'Deployed client robotics',
    images: [
      {
        src: '/assets/image/20260806-Education-Testing-Robot-Rev00.png',
        alt: 'Concept visual of a compact modular education and testing robot on an engineering bench with interchangeable sensing and actuation modules.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    featured: false,
  },
  {
    slug: 'engineering-mastery-lab',
    title: 'Engineering Mastery Lab',
    summary:
      'Built a browser-first engineering workbench that combines input-validated calculators, bounded parametric CAD, eight guided learning labs and evidence-focused project workflows across web and desktop modes.',
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Software and engineering tools',
    disciplines: ['Software', 'Automation'],
    stack: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tauri 2', 'Rust', 'Vitest'],
    problem:
      'Engineering learning, calculation, CAD, simulation, skills tracking and evidence workflows are often fragmented across disconnected tools and notes.',
    context:
      'Developed as a personal open-source engineering application and deployed through GitHub Pages. A shared React and TypeScript interface supports the browser application and an optional Tauri 2 desktop shell.',
    approach: [
      'Built a React and TypeScript frontend with Vite and HashRouter for GitHub Pages, TypeScript calculation and simulation engines, a bounded Three.js parametric CAD layer, browser-local storage, and a controlled Tauri and Rust boundary for authorised local workspaces, external tools and evidence capture.',
      'Kept the browser experience local-first with no required account, backend or telemetry. Exposed governing assumptions and validation warnings instead of hiding engineering limits. Implemented bounded parametric templates rather than presenting a simplified modeller as general CAD. Kept desktop filesystem and process authority behind an allow-listed Rust boundary with workspace containment and deterministic evidence handling.',
    ],
    toolsNote:
      'React 18, TypeScript, Vite 8, React Router 6, Three.js, Vitest, Tauri 2, Rust, GitHub Actions, optional ngspice and KiCad CLI integration.',
    validation:
      'Validated with automated Vitest suites, TypeScript checks, production builds, GitHub Actions gates and rendered inspection of the deployed dashboard, toolbox, CAD and workbench routes. Engineering-standards certification is not claimed.',
    outcome:
      'Delivered a working public web application with a browser-first engineering toolbox, bounded parametric CAD, a guided learning system, an evidence-focused project workflow and a desktop-capable source architecture.',
    proves:
      'Built and tested version 0.2.0 as a functional completion candidate, and both the working application and the source repository are public for inspection.',
    doesNotClaim:
      'This is a personal open-source build, so the record presents a working, tested engineering workbench rather than certified engineering software, and the app itself surfaces its governing assumptions and validation warnings.',
    demonstrates:
      'Integrated engineering logic, simulation, CAD geometry, software architecture, security boundaries, validation and accessible product design into one coherent system.',
    evidenceTier: 'delivered',
    evidenceState: 'Deployed software system',
    category: 'Personal open-source build',
    links: [
      { label: 'Open live app', url: 'https://sajeevanveeriah.github.io/Engineering-Mastery-Lab/' },
      { label: 'View source', url: 'https://github.com/Sajeevanveeriah/Engineering-Mastery-Lab' },
    ],
    images: [
      {
        src: '/assets/image/Engineering_Mastery_Lab_Command_Centre_Rev00.svg',
        alt: 'Engineering Mastery Lab dashboard showing the Parametric CAD Studio, Engineering Toolbox, Project Workbench and PID Control Lab.',
        width: 1435,
        height: 660,
        displayMode: 'contain',
        aspectRatio: '1435 / 660',
        background: 'dark',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership: 'Owned the product architecture across engineering logic, CAD geometry, software, desktop security boundaries and validation.',
      outcome: 'A working public application spanning calculation, bounded parametric CAD, guided learning and evidence workflows.',
    },
    featured: true,
  },
  {
    /**
     * Owner-attested record supplied by Saj as project owner.
     *
     * The case study presents confirmed system-level architecture and avoids
     * unverified model, hardware and performance specifics.
     */
    slug: 'veerai-slm',
    title: 'VeerAI: Local SLM System',
    summary:
      'Designed and built VeerAI as a complete local AI system: an open-weight small language model running entirely on personally owned hardware, wrapped in a governed knowledge pipeline architected end to end, spanning ingestion, retrieval-augmented generation, controlled memory, tools and evaluation.',
    role: 'System architect and sole implementer',
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and local inference',
    disciplines: ['AI/ML', 'Software', 'Validation'],
    stack: [
      'Local open-weight inference',
      'Retrieval-augmented generation',
      'Governed ingestion',
      'Controlled memory',
      'Tool interfaces',
      'Evaluation harness',
    ],
    problem:
      'General-purpose language models do not automatically understand personal and engineering context, preserve source grounding or operate within controlled local data boundaries. VeerAI addresses this through local inference and an explicitly governed knowledge architecture.',
    context:
      'Built VeerAI as a local AI system that runs on personally owned hardware and works with approved personal and engineering knowledge. The project focused on system integration: combining local open-weight inference, governed ingestion, retrieval, memory, tools and evaluation into an architecture controlled end to end.',
    approach: [
      'Built the ingestion layer that normalises and approves source documents, the chunking and embedding stage that makes them retrievable, the retrieval-augmented generation loop that grounds every response in cited approved sources, a controlled memory layer with explicit read and write boundaries, a tool execution interface, and an evaluation harness that scores retrieval relevance and answer faithfulness against a held-out set.',
      'Made deliberate architectural decisions at each layer: local inference to keep the data boundary absolute, modular separation so any component can be replaced without touching the others, and evaluation as a first-class subsystem rather than a final step.',
    ],
    toolsNote:
      'Local open-weight inference, retrieval-augmented generation, governed knowledge ingestion, controlled memory, tool interfaces and evaluation workflows, integrated as independently maintainable parts of one local system.',
    validation:
      'Used the evaluation harness to assess retrieval quality, response grounding, memory and tool boundaries, edge-case handling and runtime resilience across the end-to-end workflow.',
    outcome:
      'Delivered a modular local AI system that grounds responses in approved personal and engineering knowledge while keeping inference, retrieval, memory, tools and evaluation independently maintainable.',
    proves:
      'Architected and implemented a complete compound AI system end to end on personally owned hardware: inference, governed ingestion, retrieval, memory, tools and evaluation, exercised through an evaluation harness built for it.',
    doesNotClaim:
      'The system runs privately on a personally owned machine, so this record documents the architecture rather than hosting a public endpoint. VeerAI runs an open-weight model locally; the engineering claimed is the governed system designed and built around it.',
    demonstrates:
      'Engineered the system across local open-weight inference, retrieval-augmented generation, governed ingestion, modular orchestration, controlled memory, tool integration and evaluation.',
    evidenceTier: 'delivered',
    evidenceState: 'Locally deployed private system',
    category: 'Personal AI/ML build',
    images: [
      {
        src: '/assets/image/20260802-VeerAI-SLM-Project-Visual-Rev00.png',
        alt: 'Conceptual visual of the VeerAI system: scattered approved-knowledge inputs converging on a layered local core, with a smaller ordered set of outputs resolving into a written grounded response.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership:
        'Owned the system architecture, governed knowledge pipeline, retrieval workflow, orchestration layer and validation structure.',
      outcome:
        'A modular local AI foundation that grounds responses in approved knowledge while keeping inference, retrieval, memory, tools and evaluation independently maintainable.',
    },
    featured: true,
  },
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    summary:
      'Built a complete ROS 2 Humble autonomy stack with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion, then validated it in simulation for repeatable obstacle-aware navigation.',
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Robotics and autonomy',
    disciplines: ['Robotics', 'Control', 'Embedded', 'AI/ML'],
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo', 'RViz', 'SLAM', 'Kalman and EKF'],
    problem:
      'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before any of the higher-level behaviour matters.',
    context:
      'Developed as a personal robotics system end to end, using simulation to test decisions before physical implementation.',
    approach: [
      'Structured sensing, LiDAR SLAM, Kalman and EKF state estimation, odometry and IMU fusion, A* and Nav2 planning, motion control, simulation and visualisation as modular ROS 2 nodes.',
      'Built on ROS 2 Humble for a maintained long-term base; kept perception, estimation, planning and control as separate nodes so each layer could be tuned and validated independently; used simulation-first validation before physical trials.',
    ],
    toolsNote:
      'ROS 2 Humble, Nav2, Gazebo, RViz, SLAM toolboxes, A* path planning, Kalman and EKF filters, LiDAR, IMU and odometry fusion, PID tuning.',
    validation:
      'Ran repeated Gazebo simulations and used RViz to inspect maps, transforms and planned paths, checking localisation stability and obstacle avoidance across reruns.',
    outcome:
      'Delivered a working end-to-end autonomy stack with repeatable localisation and obstacle-aware navigation behaviour.',
    proves:
      'Designed, integrated and validated a complete autonomy stack single-handedly: perception, SLAM, state estimation, planning and control running as one ROS 2 system with repeatable behaviour across simulation reruns.',
    doesNotClaim:
      'The stack was validated in Gazebo simulation, where every layer could be exercised and re-run deterministically, so the evidence is repeatable simulated behaviour. The record documents a personal build proven in simulation rather than a fleet deployed in the field.',
    demonstrates:
      'Integrated and validated perception, state estimation, planning and control as one autonomy stack.',
    evidenceTier: 'delivered',
    evidenceState: 'Simulation-validated autonomy stack',
    category: 'Featured, Personal build',
    images: [
      {
        src: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.jpg',
        alt: 'ROS 2 autonomous navigation stack visualised with robot mapping and route planning',
        width: 1448,
        height: 1086,
        displayMode: 'contain',
        aspectRatio: '4 / 3',
        background: 'dark',
      },
    ],
    homeExcerpt: {
      ownership: 'Integrated perception, state estimation, planning and control as independently testable ROS 2 nodes.',
      outcome: 'A repeatable simulation-validated autonomy stack with stable localisation and obstacle-aware navigation.',
    },
    featured: true,
  },
  {
    slug: 'jag-smart-factory',
    title: 'Regulated Smart Factory and iFIX to PVI+ Migration',
    summary:
      'Delivered GMP smart-factory automation, including an iFIX to PVI+ SCADA migration verified against the validated system.',
    role: 'Automation & Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    domain: 'Automation and SCADA',
    disciplines: ['Control', 'Automation', 'Manufacturing'],
    stack: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    problem:
      'Regulated production needs traceability, diagnostics and process visibility without disturbing validated behaviour.',
    context:
      'Delivered as an automation and controls engineer for pharmaceutical, biotech and food clients under GMP, across plants, skids and packaged units. The engineering employer is not named in this public record.',
    approach: [
      'Integrated field devices and instrumentation with control logic, HMI and SCADA, MES and batch execution, and production data flows, including an iFIX to PVI+ migration.',
      'Converted SCADA application content methodically and verified functional behaviour against the existing validated system rather than trusting the conversion; prioritised diagnostics, operator usability and data integrity in every interface decision.',
    ],
    toolsNote:
      'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC logic (IEC 61131-3), MES and batch systems, Modbus and Profinet, GMP and GAMP 5 practice.',
    validation:
      'Executed FAT and SAT activities and produced commissioning, qualification and handover documentation, verifying migrated behaviour against the validated system.',
    outcome:
      'Delivered control, integration and smart-factory engineering with clearer process visibility, trends, alarms and defensible documentation.',
    proves:
      'Delivered regulated automation engineering through to qualification: control integration, an iFIX to PVI+ SCADA migration verified against the validated system, and FAT, SAT and handover documentation the client relies on.',
    doesNotClaim:
      'The work was delivered inside clients\' regulated GMP environments, so this record describes the engineering and the evidence produced rather than naming plants, products or proprietary configurations.',
    demonstrates:
      'Migrated and integrated supervisory systems where validation evidence mattered as much as functional behaviour.',
    evidenceTier: 'delivered',
    evidenceState: 'Hands-on professional integration',
    evidenceNote:
      'Delivered inside a regulated client environment; plants, products and configurations are not named.',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Smart_Factory_Process_Visualisation_Rev00.jpg',
        alt: 'Smart factory process visualisation with HMI, SCADA and production data screens',
        width: 1448,
        height: 1086,
      },
    ],
    featured: true,
  },
  {
    slug: 'adas-can-validation',
    title: 'ADAS and CAN Validation',
    summary:
      'Conducted feature, breadboard and OTA regression testing across the T6 Ranger and Everest programmes, supported by CAN-level fault evidence.',
    role: 'Product Development Test Engineer (Contract)',
    period: 'Oct 2025 to Jan 2026',
    domain: 'Automotive and validation',
    disciplines: ['Embedded', 'Validation'],
    stack: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'instrumentation'],
    problem:
      'Vehicle features must remain stable across variants, running changes and over-the-air software updates, with evidence to prove it.',
    context:
      'Validated vehicle software integration and ADAS features across the T6 Ranger and Everest programmes.',
    approach: [
      'Worked across instrumented test vehicles, CAN and CAN FD networks and the feature software under test, structuring feature-vehicle, breadboard and regression test workflows that fed readiness milestones and sign-off evidence.',
      'Captured bus-level evidence for every observation so defect reports stood on data rather than impressions; used structured drives to make failures reproducible before reporting them.',
    ],
    toolsNote:
      'Vector CANoe and CANalyzer, CAN and CAN FD, vehicle instrumentation, OTA regression testing, structured test procedures.',
    validation:
      'Ran feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates, capturing and analysing CAN traces for fault isolation.',
    outcome:
      'Delivered evidence-based defect reports and sign-off evidence supporting programme readiness decisions.',
    proves:
      'Produced vehicle-level validation evidence that stood on data: reproducible failures, CAN traces backing every defect report, and sign-off evidence feeding programme readiness milestones.',
    doesNotClaim:
      'The programmes and their test data belong to the vehicle manufacturer, so this record describes the test method and evidence discipline rather than publishing programme results.',
    demonstrates:
      'This demonstrates cyber-physical validation skill: reading what a vehicle network is actually doing and turning it into defensible engineering evidence.',
    evidenceTier: 'delivered',
    evidenceState: 'Hands-on professional integration',
    evidenceNote:
      'Programme test data belongs to the vehicle manufacturer and is not published.',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Vehicle_ADAS_CAN_Validation_Rev00.jpg',
        alt: 'Vehicle ADAS and CAN validation with software testing and signal analysis',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'emissions-compliance-testing',
    title: 'ABMARC Emissions and Compliance Testing',
    summary:
      'Conducted repeatable, auditable emissions testing against ADR and EURO standards, supported by instrumentation and QA records.',
    role: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    domain: 'Automotive and compliance',
    disciplines: ['Validation', 'Manufacturing'],
    stack: ['Emissions instrumentation', 'data acquisition', 'ADR and EURO procedures'],
    problem:
      'Compliance testing requires accurate, repeatable and auditable measurements that survive regulatory scrutiny.',
    context:
      'Completed as professional work at ABMARC, conducting vehicle emissions and compliance testing against ADR and EURO standards.',
    approach: [
      'Used test instrumentation and data-acquisition systems, followed controlled procedures, and maintained QA and regulatory documentation for certification and audit work.',
      'Treated calibration discipline and procedure fidelity as first-class engineering tasks, because the defensibility of the final report depends on them; analysed data for deviations and trends before results left the building.',
    ],
    toolsNote:
      'Emissions test equipment, instrumentation, data-acquisition systems, ADR and EURO test procedures, QA records.',
    validation:
      'Followed repeatable standard procedures, calibrated and cross-checked instrumentation, and produced auditable and technically defensible results.',
    outcome:
      'Delivered defensible compliance results and structured reporting supporting certification and audit outcomes.',
    proves:
      'Ran regulated test procedures to the standard the results had to survive: calibrated instrumentation, repeatable execution and auditable QA records against ADR and EURO requirements.',
    doesNotClaim:
      'Client vehicles and certification results are the client\'s to publish, so this record covers the measurement discipline and documentation practice rather than specific test outcomes.',
    demonstrates:
      'Applied measurement discipline, traceable documentation and evidence-based fault interpretation in a regulated testing environment.',
    evidenceTier: 'delivered',
    evidenceState: 'Hands-on professional integration',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Vehicle_Emissions_Compliance_Testing_Rev00.jpg',
        alt: 'Vehicle emissions and compliance testing with instrumentation and reporting',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'iot-monitoring-platform',
    title: 'DuxTel Agricultural Equipment Health and Location Platform',
    summary:
      'Designed and deployed a custom PCB-based field telemetry system combining CAN capture, GPS and equipment condition sensing with MikroTik connectivity and a Linux server, giving operators remote status and maintenance visibility for machinery left across large agricultural sites.',
    role: 'Consultant Engineer, IoT and Projects Administrator',
    period: 'Feb 2024 to Aug 2024',
    domain: 'IoT and telemetry',
    disciplines: ['Embedded', 'Electronics', 'Software', 'AI/ML'],
    stack: [
      'Custom PCB design',
      'CAN capture',
      'GPS or GNSS',
      'sensor interfacing',
      'MikroTik',
      'Linux',
    ],
    problem:
      'Agricultural machinery may be left across large fields, making its location and current condition difficult to confirm before the next visit.',
    context:
      'Designed and deployed as a professional DuxTel Pty Ltd project, which is currently in an active field trial.',
    approach: [
      'Integrated agricultural-equipment CAN capture, a custom PCB, GPS or GNSS positioning, condition sensing, MikroTik edge connectivity and a Linux server for remote status collection.',
      'Consolidated field interfaces on a purpose-built board, preserved traceable CAN and sensor data, used rugged edge connectivity and separated acquisition, transport and server responsibilities.',
    ],
    toolsNote:
      'Custom PCB design, CAN capture and trace, GPS or GNSS, sensor interfacing, MikroTik networking and Linux server integration.',
    validation:
      'Validated the device, CAN, location, sensor, connectivity and server paths end to end during deployment and the ongoing field trial.',
    outcome:
      'Delivered a working trial system that provides available location and condition information to support maintenance preparation before a return to the asset.',
    proves:
      'Owned the full engineering path single-handedly: custom PCB, equipment interfaces, positioning and condition sensing, MikroTik connectivity and Linux server integration, deployed into an active professional field trial.',
    doesNotClaim:
      'The system is a commercial field trial running on a client\'s equipment, so this record describes the architecture and deployment rather than trial data or client specifics.',
    demonstrates:
      'Owned the engineering path from electronics and PCB design through equipment interfaces, communications, Linux integration, deployment and field validation.',
    evidenceTier: 'delivered',
    evidenceState: 'Deployed physical system',
    evidenceNote:
      'Deployed into an active client field trial; trial data and client specifics are not published.',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/20260724-DuxTel-Agricultural-Equipment-Telemetry-Rev00.jpg',
        alt: 'Conceptual visual of agricultural machinery, custom telemetry hardware and data links representing CAN capture, GPS, condition sensing and Linux server monitoring',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'ataxia-assessment-device',
    title: 'ESP32 Clinical Ataxia Assessment Device',
    summary:
      'Developed embedded hardware and firmware for movement assessment support and validated it against clinical references.',
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Embedded and sensing',
    disciplines: ['Embedded', 'Electronics', 'Mechanical'],
    stack: ['ESP32', 'IMU', 'ToF', 'Hall effect', 'magnetometer', 'MATLAB'],
    problem:
      'Movement and coordination assessment benefits from repeatable, sensor-based measurement rather than observation alone.',
    context:
      'Completed as the final-year Honours capstone for the Bachelor of Mechatronics Engineering at Deakin University, a degree awarded with Distinction.',
    approach: [
      'Built ESP32 sensing hardware around IMU, time-of-flight, Hall-effect and magnetometer inputs, with real-time firmware and MATLAB data logging and analysis.',
      'Chose complementary sensor modalities so movement features are captured redundantly; designed the firmware around deterministic real-time acquisition; kept analysis offline in MATLAB where clinical comparison is easier to audit.',
    ],
    toolsNote:
      'ESP32, IMU, ToF, Hall-effect and magnetometer sensing, embedded C and C++, real-time signal acquisition, MATLAB data logging and signal processing.',
    validation:
      'Validated measurements against clinical references, checking that captured motion signals were repeatable and comparable.',
    outcome:
      'Delivered a proof-of-concept measurement platform supporting repeatable motion and coordination assessment.',
    proves:
      'Built embedded sensing hardware and real-time firmware to a clinical validation standard: measurements captured deterministically and checked against clinical references for repeatability and comparability.',
    doesNotClaim:
      'Completed and submitted as an assessed Honours capstone and research-support concept, and the record presents it as exactly that: a validated proof-of-concept measurement platform rather than a certified medical device.',
    demonstrates:
      'Applied embedded hardware, real-time firmware and measurement discipline to a safety-relevant sensing problem, using clinical references as the validation basis.',
    evidenceTier: 'delivered',
    evidenceState: 'Assessed embedded prototype',
    category: 'University capstone',
    images: [
      {
        src: '/assets/image/Embedded_Clinical_Ataxia_Assessment_Rev00.jpg',
        alt: 'Embedded clinical ataxia assessment device with sensors and movement data capture',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'digital-twin-industrial-ai',
    title: 'Digital Twin and Industrial AI',
    summary:
      'Built a real-time factory digital twin concept integrating AI agents, anomaly detection, predictive maintenance and OEE analytics.',
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and automation',
    disciplines: ['AI/ML', 'Automation', 'Manufacturing'],
    stack: ['Python', 'anomaly detection', 'OEE analytics', 'dashboards'],
    problem:
      'Factories benefit from a live, model-based view of equipment so faults are caught early and throughput and quality stay stable.',
    context:
      'Developed as a personal engineering concept to model a production line in software, drawing on prior smart-factory delivery experience.',
    approach: [
      'Modelled process and equipment states, generated simulated telemetry, added analytics and ML for anomaly detection and predictive maintenance, and visualised OEE in a dashboard.',
      'Modelled equipment states explicitly rather than learning them blind, so anomalies map to physical causes; kept the analytics layer separate from the twin so detection logic can be swapped; reported OEE the way production teams actually read it.',
    ],
    toolsNote:
      'Python, anomaly detection and predictive-maintenance logic, AI agents, OEE analytics, dashboard visualisation.',
    validation:
      'Exercised the concept against simulated fault and drift scenarios, checking anomaly detection, maintenance flags and OEE calculations.',
    outcome:
      'Delivered a working demonstration that surfaces anomalies, flags maintenance needs and reports OEE in real time.',
    proves:
      'Built a working digital-twin demonstration end to end: explicit equipment-state models, simulated telemetry, anomaly detection, maintenance flags and OEE reported the way production teams read it.',
    doesNotClaim:
      'The twin runs on simulated telemetry generated for the project, so the record documents a hands-on personal concept at exactly that stage; connecting it to a live plant is a deployment step, and the evidence tier reflects that.',
    demonstrates:
      'Connected plant-floor automation needs with applied AI/ML by defining the physical process and operational signals before modelling them.',
    evidenceTier: 'hands-on',
    evidenceState: 'Concept development',
    category: 'Personal concept',
    images: [
      {
        src: '/assets/image/Digital_Twin_Industrial_AI_Rev00.png',
        alt: 'Real-time factory digital twin concept with AI agents, anomaly detection and OEE analytics dashboards',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'manufacturing-qa-foundation',
    title: 'Manufacturing and QA Foundation',
    summary:
      'Built six years of experience across food and beverage, carbon-fibre and structural-steel production, spanning operations, QA, traceability, robotic automation and commissioning.',
    role: null, // TODO: Saj to supply.
    period: '2018 to 2024',
    domain: 'Manufacturing and quality',
    disciplines: ['Manufacturing', 'Mechanical'],
    stack: ['IDL', 'Carbon Revolution', 'Thornton Engineering'],
    problem:
      'Effective automation, validation and commissioning depend on understanding how production floors, operators and quality systems behave in practice.',
    context:
      'Completed six years of production and quality work from 2018 to 2024 at IDL, Carbon Revolution and Thornton Engineering Australia Pty Ltd, alongside formal engineering study.',
    approach: [
      'Worked across high-throughput beverage lines, carbon-fibre rim layup moving onto KUKA robotic cells, and standards-driven structural-steel and pressure-vessel fabrication.',
      /* "leading lines" removed: it restated the unverified line-lead
         progression that Rev01 and Rev02 both required to stay unpublished.
         Owning quality workflows is Thornton evidence and stays. */
      'Progressed deliberately from operating machines to owning quality workflows; treated changeovers, first-response fixes and inspection evidence as engineering problems, not chores; learned the paperwork that makes production defensible: ITPs, MDRs, traceability records and QA sign-off.',
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, KUKA-based automated rim layup, NDE and mechanical testing exposure, ITP and MDR documentation, drawing review, KPI tracking, Lean practice.',
    validation:
      'Validated the work through daily production KPIs, QA checks, inspection evidence and documented sign-off. This included installation and commissioning support for WestRock and Fibre King equipment during a canning line upgrade, plus hands-on involvement as KUKA-based robotic cells replaced a legacy rim layup machine.',
    outcome:
      'Developed a working production and quality instinct across line recovery, changeover logic, operator empathy and audit-ready documentation.',
    proves:
      'Built six years of floor-level production and quality judgement across three manufacturers, evidenced through daily KPIs, QA checks, inspection records and hands-on commissioning support.',
    doesNotClaim:
      'This record covers production, quality and commissioning-support roles; the design of the lines and robot cells belonged to their vendors, and the claim is the operational and quality capability built working with them.',
    demonstrates:
      'This experience built the operator, troubleshooting and quality perspective that now informs engineering decisions.',
    evidenceTier: 'delivered',
    evidenceState: 'Hands-on professional integration',
    category: 'Professional foundation',
    deepDives: [
      {
        label: 'Carbon Revolution robotic rim layup automation',
        url: '/work/carbon-revolution-rim-layup/',
      },
      { label: 'IDL canning line upgrade and commissioning', url: '/work/idl-canning-line/' },
    ],
    featured: false,
  },
  {
    slug: 'carbon-revolution-rim-layup',
    title: 'Carbon Revolution: Robotic Rim Layup Automation',
    summary:
      'Worked hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
    role: 'Production and quality role',
    period: null, // TODO: Saj to supply.
    domain: 'Advanced manufacturing and robotics',
    disciplines: ['Robotics', 'Manufacturing', 'Mechanical'],
    stack: [
      'KUKA robotic cells',
      'automated rim layup',
      'robotic demoulding',
      'NDE and mechanical testing',
    ],
    problem:
      'Scaling carbon-fibre wheel production means taking repeatable fibre layup, and the handling of hot, heavy, safety-critical tooling, off manual work and onto robots, without losing the quality a structural wheel depends on.',
    context:
      'Worked across production, quality assurance and development support in advanced carbon-fibre automotive wheel manufacturing at Carbon Revolution. The work was hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
    approach: [
      'Worked with KUKA robotic cells used for automated rim layup and demoulding, alongside downstream cure, machining, NDE, mechanical testing and traceability processes.',
      'Treated the change as a systems problem, not a machine swap: moving hot, heavy tooling handling onto robots to take it off operators, and leaning on trials, first-off checks and defect inspection to prove the robotic cell held layup repeatability before the line was allowed to ramp.',
    ],
    toolsNote:
      'KUKA robotic cells, automated rim layup, robotic demoulding, carbon-fibre composite production, NDE and mechanical testing, production quality and defect-inspection systems.',
    validation:
      'Supported trials, first-off and in-process quality checks, defect inspection, changeover and line recovery as the KUKA line was commissioned and ramped into production. The contribution was hands-on involvement and support, not ownership of the robot-cell design or programming.',
    outcome:
      'Developed a hands-on, floor-level understanding of moving a production line onto industrial robotics, including what changes for operators, quality and throughput when robots take over layup and demoulding.',
    proves:
      'Worked hands-on through a live industrial automation transition, supporting trials, first-off checks, defect inspection, changeovers and line recovery as KUKA robotic cells took over layup and demoulding.',
    doesNotClaim:
      'The robot cells were designed and programmed by the automation programme\'s engineers; the claim is the hands-on production and quality work that proved the cells could hold rate and quality through ramp-up.',
    demonstrates:
      'Gained hands-on industrial robotics experience in a production environment where safety, repeatability, quality and ramp-up mattered as much as robot motion.',
    evidenceTier: 'hands-on',
    evidenceState: 'Hands-on professional integration',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'idl-canning-line',
    title: 'IDL: Canning Line Upgrade and Commissioning',
    summary:
      'Supported hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.',
    /* The role line carried an unverified progression title, and the context
       and approach below carried the trade descriptor that goes with it.
       Both trace to third-party aggregator records rather than to anything
       Saj has confirmed, and Rev01 and Rev02 both required them to stay
       unpublished. They were published here anyway. The title is reduced to
       the neutral descriptor `employers.ts` already carries for IDL; see the
       TODO CONFIRM list on that record for exactly what was removed. */
    role: 'Beverage production role',
    period: null, // TODO: Saj to supply.
    domain: 'Manufacturing and packaging automation',
    disciplines: ['Manufacturing', 'Automation'],
    stack: [
      'Canning, bottling and kegging lines',
      'WestRock and Fibre King packaging equipment',
      'changeover and KPI tracking',
    ],
    problem:
      'A high-throughput beverage plant has to lift capacity and reliability across canning, bottling and kegging without long downtime, which means installing and commissioning new packaging automation on a live production site.',
    context:
      'Worked across five food and beverage manufacturing lines at IDL: two canning, two bottling and one kegging. The work included hands-on installation and commissioning support for WestRock and Fibre King packaging equipment during a canning line upgrade.',
    approach: [
      'Worked across high-throughput fillers, seamers and conveyors, and supported the WestRock and Fibre King equipment added during the canning-line upgrade.',
      "Treated changeovers, first-response fixes and run recovery as engineering problems rather than chores, supported install and commissioning so the new equipment held rate and quality, and learned the line from the operator's side to see how a small mechanical or control fault costs throughput.",
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, changeover and KPI tracking, quality checks and first-response machine fixes.',
    validation:
      'Used daily production KPIs, quality checks, first-response fixes and installation and commissioning checks as new equipment was brought up to rate on the canning line.',
    outcome:
      'Developed a packaging-automation and commissioning instinct: install it, prove it, recover it and hold rate on a live, high-throughput line.',
    proves:
      'Supported hands-on installation and commissioning of new packaging equipment on a live, high-throughput site while carrying production and quality responsibilities across five lines.',
    doesNotClaim:
      'The upgrade was an equipment vendor and site project; the claim is the hands-on installation support, commissioning checks and operational recovery work personally carried out within it.',
    demonstrates:
      'Learned how usability, changeover design, line recovery and traceable QA affect automation and commissioning from an operator perspective.',
    evidenceTier: 'delivered',
    evidenceState: 'Hands-on professional integration',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'ndcc-website',
    title: 'Newcomb and District Cricket Club Digital Platform',
    summary:
      'Designed, built and runs the official NDCC digital platform, combining the public club website with committee content, membership, merchandise, gallery, sponsor and administration workflows.',
    role: 'Full-stack developer and platform administrator',
    period: '2026',
    domain: 'Full-stack software and community operations',
    disciplines: ['Software', 'Automation', 'Validation'],
    stack: [
      'Next.js 14',
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Supabase Postgres',
      'PlayHQ API',
      'Resend',
      'Vercel',
    ],
    problem:
      'The club needed one reliable digital platform for current public information and committee workflows, without forcing volunteers to maintain the same content across disconnected pages, files and services.',
    context:
      'Built and operates this production community platform for Newcomb and District Cricket Club. It is live at ndcc.com.au and supports public club information, fixtures, teams, news, events, facilities, membership, merchandise, sponsors, gallery, fantasy cricket and committee administration.',
    approach: [
      'Structured the system as a Next.js App Router application with accessible public routes, protected committee administration and Supabase Postgres as the governed source for mutable club content.',
      'Integrated PlayHQ as the fixture source, Resend-ready transactional email, manual order and payment reconciliation, GitHub-backed single-image publishing, Supabase Storage for bulk gallery media and Vercel deployment. Server-only credentials remain outside the browser, and live CMS reads use dynamic no-store delivery so successful empty results are never replaced with stale seed content.',
    ],
    toolsNote:
      'Next.js 14, TypeScript, React, Tailwind CSS, Supabase Postgres and Storage, custom committee authentication, PlayHQ Public API, Resend, Vercel, GitHub media publishing, route and content smoke tests.',
    validation:
      'The codebase is validated with lint and production builds, route and content smoke tests, public-site audits, asset checks, migration and schema tests, and live inspection. Credential-dependent email, authentication and external-service checks remain separate so an untested integration is never presented as passing.',
    outcome:
      'Delivered and continues to operate a live club platform spanning public information, fixtures, events, news, teams, facilities, membership, merchandise, sponsors, gallery, volunteering, contact, fantasy cricket and committee administration.',
    proves:
      'Delivers and operates a production platform: the site is live at ndcc.com.au, the source repository is public, and the club runs its public information and committee workflows on it.',
    doesNotClaim:
      'Payment and email paths are described at their verified implementation state, and an integration is only claimed as live once it has been tested in the target environment.',
    demonstrates:
      'Translated community operations into a maintained full-stack product covering information architecture, data modelling, authentication, integrations, media, administration, deployment and validation.',
    evidenceTier: 'delivered',
    evidenceState: 'Deployed software system',
    category: 'Community digital platform',
    links: [
      { label: 'Open live website', url: 'https://www.ndcc.com.au/' },
      { label: 'View source', url: 'https://github.com/Sajeevanveeriah/ndcc-website' },
    ],
    images: [
      {
        src: '/assets/image/20260803-NDCC-Website-Platform-Rev00.svg',
        mobileSrc: '/assets/image/20260803-NDCC-Website-Platform-Mobile-Rev00.svg',
        alt: 'Architecture of the NDCC digital platform, connecting the public club website and committee CMS through a Next.js application core to Supabase data and operational integrations.',
        width: 1435,
        height: 660,
        displayMode: 'contain',
        aspectRatio: '1435 / 660',
        mobileAspectRatio: '660 / 960',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    featured: false,
  },] as const

/** Domains present across the record set, for the /work filter. */
export const projectDomains: readonly string[] = Array.from(
  new Set(projects.map((p) => p.domain)),
).sort()

/** Disciplines present across the record set, for the /work filter. */
export const projectDisciplines: readonly string[] = Array.from(
  new Set(projects.flatMap((p) => p.disciplines)),
).sort()

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** A record renders only when it has a published evidence tier. */
export const publishedProjects: readonly Project[] = projects.filter(
  (p) => p.evidenceTier !== null,
)

/**
 * What may be advertised. Suppressed records still build and still resolve
 * at their own URL; they are simply never linked or listed. Every discovery
 * surface reads this list, never `publishedProjects`, so a new surface
 * cannot reintroduce a suppressed record by accident.
 */
export const discoverableProjects: readonly Project[] = publishedProjects.filter(
  (p) => !p.suppressed,
)
