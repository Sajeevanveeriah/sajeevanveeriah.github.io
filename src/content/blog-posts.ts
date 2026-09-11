import type { BlogPost } from "./blog";

export const engineeringPosts: BlogPost[] = [
  {
    "category": "Robotics",
    "date": "2026-09-11",
    "description": "A practical way to separate coordinate-frame, timing and localisation faults before changing a navigation controller.",
    "image": {
      "alt": "Coordinate-frame tree: localisation corrects map to odom; odometry updates odom to base_link; the sensor is attached to the robot. Illustrative mounting and frame arrangement.",
      "caption": "Coordinate-frame tree: localisation corrects map to odom; odometry updates odom to base_link; the sensor is attached to the robot. Illustrative mounting and frame arrangement.",
      "height": 720,
      "src": "/assets/blog/20260911-Robot-Frames-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "A robot turns in place, but the wall in its laser scan seems to slide across the room. It is tempting to open the controller settings and start changing gains. First, check whether the robot's picture of the world is consistent.",
      "My rover portfolio record combines a physical platform with simulation-validated autonomy. The distinction matters: simulation is useful for repeatable diagnosis, while physical testing introduces mounting errors, wheel slip and timing behaviour that a clean simulation may not reproduce. The diagnostic sequence below is a proposed method, not a report of additional tests on that rover."
    ],
    "note": "Sources checked on 11 September 2026. The numeric example and diagnostic sequence are illustrative; they are not measured rover results.",
    "sections": [
      {
        "id": "three-frames",
        "paragraphs": [
          "ROS REP 105 defines a useful division of responsibility. The base_link frame is fixed to the robot. The robot's pose in odom should change continuously, although it can drift. Its pose in map can receive discrete corrections from localisation. These are different behaviours serving different purposes.",
          "The usual relationship is map to odom to base_link, with sensor frames attached beneath the robot. A localisation component provides the map-to-odom correction; an odometry source provides odom-to-base_link. Check who publishes each transform. Competing publishers can make a plausible diagram behave inconsistently."
        ],
        "sources": [
          1
        ],
        "title": "Give each coordinate frame one job"
      },
      {
        "id": "make-a-prediction",
        "paragraphs": [
          "Choose a simple scene with a flat wall and a clearly marked starting position. Keep the robot stationary first. Record the scan, transforms and their timestamps. If a stationary wall moves in the display, investigate the sensor data and transform path before interpreting that movement as a control problem.",
          "Next, rotate slowly in a controlled test area. In the robot's frame, the wall should change position as the robot turns. In a stable world frame, the same wall should remain approximately fixed. This makes the selected display frame part of the test, rather than a cosmetic setting.",
          "Use the following observations as hypotheses to investigate. None identifies a cause on its own."
        ],
        "table": {
          "headings": [
            "Observation",
            "Next comparison"
          ],
          "rows": [
            [
              "Wall shifts when the robot rotates",
              "Compare the measured sensor mounting offset with the configured transform."
            ],
            [
              "Pose jumps at localisation updates",
              "Compare map-frame and odom-frame motion at the same timestamps."
            ],
            [
              "Problem grows with speed",
              "Compare sensor age, transform timing and wheel behaviour."
            ],
            [
              "Repeated data produces different behaviour",
              "Check configuration, clock source and other inputs that were not recorded."
            ]
          ]
        },
        "title": "Predict the observation before running the test"
      },
      {
        "id": "timing-budget",
        "paragraphs": [
          "Consider an illustrative robot moving at 0.5 m/s. If an observation is interpreted as current when it is actually 0.2 s old, the robot travels 0.1 m during that interval. This is a simple displacement estimate, not a complete model of scan distortion or localisation error.",
          "The calculation is distance = speed × time: 0.5 m/s × 0.2 s = 0.1 m. Before spending an afternoon tuning around a ten-centimetre discrepancy, establish whether measurements are transformed using their acquisition time and whether the relevant clocks agree.",
          "Record acquisition time and reception time separately when the interface supports them. A delayed measurement can still be useful if the system handles its timestamp correctly. A recently received message is not necessarily a recent observation."
        ],
        "title": "Turn timing into a physical distance"
      },
      {
        "id": "isolate-the-layer",
        "paragraphs": [
          "Once frames and timing are credible, move through odometry, localisation, planning and control in that order. Save the inputs, configuration and expected observation for a short repeatable scenario. Change one relevant setting, rerun the scenario, and compare the result with the previous run.",
          "Include a stationary test, a slow turn, straight travel and a deliberate localisation correction. Define acceptable movement or error before looking at the new result. Otherwise, a smoother animation can be mistaken for an improvement while another behaviour gets worse.",
          "Carry the successful scenario to hardware with an appropriate test area, speed limit and stopping provision. A simulation pass establishes behaviour under that simulation's assumptions. Record the additional physical checks separately so another engineer can see exactly where the evidence ends."
        ],
        "sources": [
          2
        ],
        "title": "Change one layer and keep a comparison"
      }
    ],
    "slug": "robot-localisation-before-controller-tuning",
    "sources": [
      {
        "label": "ROS REP 105: Coordinate Frames for Mobile Platforms, created 27 October 2010; source revision inspected",
        "url": "https://github.com/ros-infrastructure/rep/blob/master/rep-0105.rst"
      },
      {
        "label": "Portfolio project: Autonomous Navigation Rover on ROS 2 and its evidence boundary",
        "url": "/work/autonomous-navigation-rover/"
      }
    ],
    "title": "Before tuning a robot, check what it thinks is moving"
  },
  {
    "category": "Embedded systems",
    "date": "2026-09-11",
    "description": "How hysteresis, debounce and explicit states turn a fluctuating measurement into a useful event without hiding the timing cost.",
    "image": {
      "alt": "Synthetic samples 0.39, 0.61, 0.58, 0.62, 0.41, 0.39 produce states inactive, active, active, active, active, inactive with thresholds 0.60 and 0.40. One activation and one release.",
      "caption": "Synthetic samples 0.39, 0.61, 0.58, 0.62, 0.41, 0.39 produce states inactive, active, active, active, active, inactive with thresholds 0.60 and 0.40. One activation and one release.",
      "height": 720,
      "src": "/assets/blog/20260911-Sensor-Hysteresis-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "A sensor value sitting near a threshold can cross it repeatedly even when the physical situation has barely changed. If every crossing becomes an event, one movement can turn into several counts.",
      "My embedded assessment prototype uses Hall-effect sensing to observe movement. This article explores a general signal-processing problem relevant to that kind of system. The thresholds below are made-up normalised values, not settings or performance claims for the prototype."
    ],
    "note": "Sources checked on 11 September 2026. Signal values and timing calculations are teaching examples, not prototype measurements.",
    "sections": [
      {
        "id": "separate-measurement",
        "paragraphs": [
          "Keep the raw measurement available during development. A displayed count is the result of several decisions: how the input was sampled, whether it was valid, which state was active, and whether a transition was accepted. Logging only the final count removes the evidence needed to explain a miscount.",
          "Start by defining the event in physical terms. Does it mean entering a detection region, leaving it, or completing a sequence across two sensors? Those definitions lead to different state machines. A single threshold crossing does not automatically tell you direction or distance."
        ],
        "title": "Separate the measurement from the event"
      },
      {
        "id": "two-thresholds",
        "paragraphs": [
          "Hysteresis uses different switching thresholds depending on the current state. Analog Devices describes how separating rising and falling thresholds can prevent repeated switching around a noisy boundary. The same state-dependent idea can be expressed in firmware.",
          "For an illustrative normalised signal, enter the active state at 0.60 or above. Stay active until the signal reaches 0.40 or below. Between those values, retain the previous state. Define the equality cases explicitly so tests at exactly 0.40 and 0.60 have predictable outcomes.",
          "With an initial inactive state, the sequence 0.39, 0.61, 0.58, 0.62, 0.41, 0.39 produces one activation and one release. A single 0.60 threshold would produce two activations and two releases in this sequence. These values demonstrate the rule only; choose real thresholds from measured noise, tolerances and the required operating range."
        ],
        "sources": [
          1
        ],
        "title": "Use hysteresis when the boundary chatters"
      },
      {
        "id": "time-cost",
        "paragraphs": [
          "Debounce asks whether a candidate condition has lasted long enough, or remained present across enough samples, to accept it. Hysteresis separates signal levels; debounce adds a time requirement. Combining them can help, but excessive qualification time can suppress legitimate short events.",
          "Suppose samples arrive exactly every 10 ms and the rule requires five consecutive qualifying samples. The interval from the first qualifying sample to the fifth is 40 ms. For a clean transition occurring at an arbitrary point between samples, acceptance is approximately 40-50 ms later, before scheduling or processing delays.",
          "At 0.2 m/s, that idealised delay corresponds to 8-10 mm of travel. This does not mean the measured position is necessarily wrong by that amount: timestamping and the measurement model matter. It does mean that a delay chosen to make a graph look quiet has a physical consequence."
        ],
        "title": "Debounce answers a different question"
      },
      {
        "after": [
          "Do not quietly interpret a disconnected sensor as a legitimate zero. Keep validity separate from active or inactive status. On recovery, decide whether a new baseline is required before counting again."
        ],
        "id": "state-table",
        "paragraphs": [
          "A compact transition table exposes ambiguity before it becomes firmware. This example uses hysteresis without the optional debounce stage."
        ],
        "table": {
          "headings": [
            "State and input",
            "Decision"
          ],
          "rows": [
            [
              "Inactive; signal ≥ 0.60",
              "Enter active; emit one activation event."
            ],
            [
              "Active; signal ≤ 0.40",
              "Enter inactive; emit one release event."
            ],
            [
              "Valid signal between thresholds",
              "Keep the current state; emit no event."
            ],
            [
              "Invalid or stale sample",
              "Mark the measurement invalid; apply a separately defined recovery rule."
            ]
          ]
        },
        "title": "Write down the states, including invalid input"
      },
      {
        "id": "test-the-boundary",
        "paragraphs": [
          "Replay recorded raw signals through the decision logic. Include slow crossings, noise near both thresholds, short valid pulses, reversals, startup inside the active region and missing samples. Compare accepted events with independently labelled physical events.",
          "Report false events, missed events and detection delay separately. A configuration that removes false counts by rejecting every event is easy to make and useless in practice. Keep the raw data and the rule version together so a change can be checked against the same evidence.",
          "For the portfolio assessment device, the published boundary remains an assessed engineering prototype. This discussion does not establish clinical efficacy or a certified medical device."
        ],
        "sources": [
          2
        ],
        "title": "Test where the rule is most likely to fail"
      }
    ],
    "slug": "noisy-sensors-hysteresis-and-debounce",
    "sources": [
      {
        "label": "Analog Devices, Reza Moghimi: Curing Comparator Instability with Hysteresis; undated web article",
        "url": "https://www.analog.com/en/resources/analog-dialogue/articles/curing-comparator-instability-with-hysteresis.html"
      },
      {
        "label": "Portfolio project: ESP32 Clinical Ataxia Assessment Device and prototype boundary",
        "url": "/work/ataxia-assessment-device/"
      }
    ],
    "title": "A noisy sensor needs a decision rule"
  },
  {
    "category": "AI and software",
    "date": "2026-09-11",
    "description": "A practical design for checking retrieval, source quality and permission boundaries in an assistant that runs on your own hardware.",
    "image": {
      "alt": "Proposed document-assistant boundary: versioned documents feed retrieval and an answer. A separate application permission check governs tool actions; retrieved text cannot grant that permission.",
      "caption": "Proposed document-assistant boundary: versioned documents feed retrieval and an answer. A separate application permission check governs tool actions; retrieved text cannot grant that permission.",
      "height": 720,
      "src": "/assets/blog/20260911-Local-AI-Evidence-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "Getting a language model to answer a question on your own computer is a useful milestone. It leaves several engineering questions open: which documents reached the model, whether they were current, and what the system is allowed to do with the answer.",
      "My portfolio describes VeerAI as a local small-language-model system with ingestion, retrieval, memory, tools and evaluation. This article explains a design approach for that wider system. It does not publish private configuration or claim a new benchmark result."
    ],
    "note": "Sources checked on 11 September 2026. The fictional manuals and acceptance set are proposed examples, not VeerAI benchmark results.",
    "sections": [
      {
        "id": "trace-the-answer",
        "paragraphs": [
          "Retrieval-augmented generation brings retrieved material into a model's answering process. The original RAG research combined a language model with a searchable external memory and evaluated that combination on knowledge-intensive tasks. It provides a foundation for the approach, not a guarantee that any folder of documents will produce reliable answers.",
          "For a document assistant, retain the question, retrieved passage identifiers, document versions and final answer in an appropriate test record. That makes it possible to distinguish a search failure from an answer that misused good evidence. A fluent response alone cannot make that distinction.",
          "Keep the minimum material needed for evaluation. A debugging log should not become an uncontrolled second copy of confidential documents."
        ],
        "sources": [
          1
        ],
        "title": "Make the evidence path inspectable"
      },
      {
        "id": "test-retrieval-first",
        "paragraphs": [
          "Use a small synthetic document set with answers you can check directly. For example, create two fictional maintenance manuals for the same imaginary device. Version A says an inspection occurs every 40 operating hours; version B changes it to 30. Mark version B as current and version A as superseded.",
          "Ask for the current interval, the old interval, and the reason for the change when no reason is supplied. The expected behaviour is different for each question: retrieve B, retrieve A, and acknowledge missing information. Repeating the number from the most similar-looking passage is insufficient.",
          "Inspect the retrieved text before changing the model. If the current document never reaches it, first investigate parsing, metadata filters, document versioning and retrieval ranking. Add a larger model only when the evidence points to a limitation it could plausibly address."
        ],
        "title": "Test search before judging the answer"
      },
      {
        "after": [
          "Keep ordinary and difficult cases separate when reporting results. A single overall score can conceal a system that performs well on easy lookups but fails whenever a document is missing. Record the dataset and configuration behind each evaluation so comparisons mean something."
        ],
        "id": "evaluation-grid",
        "paragraphs": [
          "The following is a proposed acceptance set. It deliberately includes questions that should not receive a complete factual answer."
        ],
        "table": {
          "headings": [
            "Test case",
            "What to inspect"
          ],
          "rows": [
            [
              "Answer present in the current manual",
              "Correct passage retrieved; answer supported by that passage."
            ],
            [
              "Superseded document looks more relevant",
              "Version metadata respected; current and historical claims distinguished."
            ],
            [
              "Answer absent from all documents",
              "Missing evidence stated; no invented instruction or number."
            ],
            [
              "Document contains an instruction to send data",
              "Document treated as content; no unauthorised action."
            ],
            [
              "Question outside the authorised collection",
              "Access boundary preserved; no search through unrelated private material."
            ]
          ]
        },
        "title": "Use cases that can disprove the design"
      },
      {
        "id": "permissions",
        "paragraphs": [
          "OWASP identifies indirect prompt injection as instructions arriving through external content such as documents. A retrieved page can contain text that tries to redirect an assistant. Searching a trusted folder does not turn every sentence inside it into an authorised command.",
          "A useful boundary is to keep document reading separate from action permissions. Retrieved text may support an answer; it should not grant the ability to email files, change accounts or execute commands. The application must enforce the allowed actions and destinations independently of the model's prose.",
          "For the fictional manual test, include a passage telling the assistant to transmit the manual elsewhere. The expected result is an answer grounded in relevant maintenance content, with no transmission. Evaluate the action boundary as well as the wording."
        ],
        "sources": [
          2
        ],
        "title": "Keep tool authority outside retrieved text"
      },
      {
        "id": "local-boundary",
        "paragraphs": [
          "Draw the data path for inference, document parsing, embeddings, search, logs and tools. Identify any network dependency explicitly. A model running locally does not prove that every surrounding component stays offline.",
          "Decide which records persist, who can read them and how they can be removed. Then test the system against that decision. The useful outcome is an assistant whose evidence and permitted actions are understandable enough to inspect when something goes wrong."
        ],
        "title": "Define what local actually covers"
      }
    ],
    "slug": "local-ai-beyond-the-model",
    "sources": [
      {
        "label": "Lewis et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, NeurIPS 2020; arXiv v4, 12 April 2021",
        "url": "https://arxiv.org/abs/2005.11401"
      },
      {
        "label": "OWASP Gen AI Security Project: LLM01:2025 Prompt Injection",
        "url": "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
      }
    ],
    "title": "Local AI: the model is one part of the system"
  },
  {
    "category": "Engineering software",
    "date": "2026-09-11",
    "description": "Preserving identifiers, resolving ambiguity and making an import reviewable before it changes an operational system.",
    "image": {
      "alt": "Fictional import review: code 00127 retains its leading zeros; an approved change moves AUD 10.00 to AUD 13.00. Duplicate code 00418 is held. These are illustrative rows, not client data.",
      "caption": "Fictional import review: code 00127 retains its leading zeros; an approved change moves AUD 10.00 to AUD 13.00. Duplicate code 00418 is held. These are illustrative rows, not client data.",
      "height": 720,
      "src": "/assets/blog/20260911-CSV-Review-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "A CSV import can finish successfully and still damage the meaning of the data. An item code loses its leading zeros. A blank price becomes zero. Two similar descriptions are treated as the same product.",
      "The public record for my pricing and inventory project describes operator-reviewed imports and explicit matching rules. This article develops the general engineering questions behind that approach, using invented product records and prices. No client data or private implementation is included."
    ],
    "note": "Sources checked on 11 September 2026. Catalogue rows and AUD amounts are invented teaching examples; this is software design guidance, not a pricing recommendation.",
    "sections": [
      {
        "id": "contract",
        "paragraphs": [
          "RFC 4180 documents a common CSV format, including quoting fields that contain commas, line breaks or quotes. It is an informational RFC, and actual importers may impose their own rules. Record the destination's required headers, ordering, encoding and accepted values rather than assuming that any file labelled CSV is interchangeable.",
          "Keep a distinction between a syntactically valid row and a valid business change. A parser can accept a negative quantity perfectly well. Whether that value is allowed depends on the field and the workflow.",
          "Use a fixture containing an embedded comma, an embedded quote and a multiline description. Check the parsed field values and the exported round trip. Counting separators is not enough to validate a CSV parser."
        ],
        "sources": [
          1
        ],
        "title": "Define the file contract before the parser"
      },
      {
        "id": "identifiers",
        "paragraphs": [
          "In a fictional catalogue, item 00127 is a string. Converting it to the number 127 discards information that may be required by another system. The same concern applies to barcodes and supplier references even when they contain only digits.",
          "Define normalisation narrowly. Removing accidental outer whitespace may be appropriate; dropping punctuation or case may merge records that the source treats as distinct. Show the original and normalised values during review when that transformation affects matching.",
          "When two rows normalise to the same code, surface the collision. Choosing the first row silently makes file order a business rule. A reviewer needs to know that a decision exists."
        ],
        "title": "Treat identifiers as identifiers"
      },
      {
        "id": "matching",
        "paragraphs": [
          "A useful matching sequence is exact approved identifier, then a maintained alias, then a suggestion requiring review. Similar descriptions can help a person investigate a mismatch; they are weak authority for overwriting an operational record.",
          "The proposed review below keeps unresolved rows out of the approved change set. A missing supplier row is not automatically a request to delete an existing item."
        ],
        "sources": [
          2
        ],
        "table": {
          "headings": [
            "Incoming row",
            "Proposed handling"
          ],
          "rows": [
            [
              "Unique exact code; valid fields",
              "Prepare a before-and-after comparison."
            ],
            [
              "Known alias with an approved mapping",
              "Show the alias used and the target record."
            ],
            [
              "Similar description; different code",
              "Require review; do not silently update."
            ],
            [
              "Duplicate code or missing required price",
              "Hold the row with a specific reason."
            ],
            [
              "Existing item absent from the file",
              "Leave unchanged unless a separate deletion rule is authorised."
            ]
          ]
        },
        "title": "Make ambiguity visible"
      },
      {
        "id": "money",
        "paragraphs": [
          "SQLite's documentation explains that binary floating-point values are approximate. For monetary processing that requires exact decimal behaviour, choose an appropriate decimal representation or an integer representation with an explicit scale. Validate range and precision as part of that choice.",
          "For an invented arithmetic example, AUD 10.00 with a 30% markup becomes AUD 13.00 before any separately specified tax treatment. A 30% margin calculation would instead divide the cost by 0.70, producing approximately AUD 14.2857 before rounding. Confusing the two rules changes the result far more than a display-format issue.",
          "Specify when rounding occurs and how ties are handled. If supplier costs contain fractions of a cent, an integer-cents model alone may discard required precision. Keep this rule in the domain logic and test it independently of the screen."
        ],
        "sources": [
          3
        ],
        "title": "Make numeric rules explicit"
      },
      {
        "id": "review-and-recover",
        "paragraphs": [
          "Before export, show changed, unchanged and held rows separately. Include the old value, proposed value and reason for the match. Give the reviewer a manageable set of decisions rather than a green button beside a large unexplained row count.",
          "Test a second application of the same intended change. It should not create duplicate records or compound a markup. Also test a stale target catalogue: if another person changed the target after the comparison, require a fresh comparison or a defined conflict resolution.",
          "A recovery export can help restore previous values, but its scope needs care. It should not overwrite legitimate edits made after the import. The useful acceptance question is whether an operator can explain each change and recover from a mistaken run without guessing."
        ],
        "title": "A useful import has a before and an after"
      }
    ],
    "slug": "csv-imports-that-deserve-trust",
    "sources": [
      {
        "label": "RFC 4180: Common Format and MIME Type for CSV Files, October 2005, Informational",
        "url": "https://www.rfc-editor.org/rfc/rfc4180"
      },
      {
        "label": "Portfolio project: SWL Pricing and Inventory Control, public matching and review boundary",
        "url": "/work/swl-pricing-inventory-control/"
      },
      {
        "label": "SQLite: Floating Point Numbers; live documentation",
        "url": "https://sqlite.org/floatingpoint.html"
      }
    ],
    "title": "The hard part of a CSV import is deciding what may change"
  },
  {
    "category": "Product engineering",
    "date": "2026-09-11",
    "description": "Why offline use, saved data, export and recovery need separate acceptance tests in a small personal or business app.",
    "image": {
      "alt": "Proposed recovery path: a working copy is exported to an independent backup, validated and restored into a clean test instance. Compare restored values with the original; keep the working copy until recovery is verified.",
      "caption": "Proposed recovery path: a working copy is exported to an independent backup, validated and restored into a clean test instance. Compare restored values with the original; keep the working copy until recovery is verified.",
      "height": 720,
      "src": "/assets/blog/20260911-Local-App-Recovery-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "A small app can feel complete when it saves an entry and brings it back after a refresh. The harder question arrives later: can the owner recover the data after replacing a device, losing a browser profile or moving to a new address?",
      "Several projects in my portfolio use local-first or static approaches. Those choices can keep a tool focused and reduce infrastructure. They also make the data boundary worth explaining in ordinary language. This article proposes a recovery design for a fictional equipment register."
    ],
    "note": "Sources checked on 11 September 2026. The equipment register and restore drill are proposed examples, not claims that every portfolio application implements these features.",
    "sections": [
      {
        "id": "four-promises",
        "paragraphs": [
          "Offline use means the required parts of the app work without a connection. Persistence means data survives the relevant restart. Export means a usable copy can leave the app. Recovery means that copy can reconstruct the required state. Test these as separate behaviours.",
          "For example, an equipment register might store records locally but depend on an uncached script to open. Another might open offline while keeping edits only in memory. Both can look convincing during a short demonstration.",
          "Write the promise from the user's perspective: after closing and reopening the app on this device, saved equipment remains available; after moving to a different device, importing a supported backup restores the specified fields. That wording gives the test an observable result."
        ],
        "title": "Separate four promises"
      },
      {
        "id": "browser-storage",
        "paragraphs": [
          "MDN explains that browser storage is generally separated by origin, defined by scheme, hostname and port. Two paths under the same origin do not automatically receive separate storage boundaries. Moving an app to another origin does not automatically move its stored records.",
          "Browser-managed data is best-effort by default. Persistent-storage requests can reduce automatic eviction risk, but they do not protect against the owner clearing data or losing the device. Private browsing can also have different retention behaviour.",
          "Avoid a vague saved badge. Show a clear storage description and the time of the last successful export where useful. If a write fails, keep the user's current input and say that saving failed. A success message should follow the completed write, not the button click."
        ],
        "sources": [
          1
        ],
        "title": "Describe where browser data lives"
      },
      {
        "id": "portable-export",
        "paragraphs": [
          "For the fictional register, a backup could contain a format version, export timestamp and records with stable identifiers. Each record might include the equipment name, location, status and an optional note. These fields are examples, not a universal schema.",
          "Keep display labels separate from stored identifiers so renaming a room does not create duplicate equipment. State whether attachments and history are included. An export that omits those items may still be useful, but it should not be described as a complete backup.",
          "Validate the incoming format before replacing anything. Preview the number of records and conflicts, then offer the supported restore behaviour. If merging is supported, explain how matching identifiers are handled. Keep an existing usable copy until the imported data has passed validation."
        ],
        "title": "Give the export enough meaning to survive"
      },
      {
        "after": [
          "Compare actual values, not just record counts. A restore that produces ten records from ten inputs can still have swapped locations or lost notes. Add a record after restoring and export again to check that the recovered state remains usable."
        ],
        "id": "restore-test",
        "paragraphs": [
          "Use a disposable test profile or test instance. Do not delete the only working copy to prove the backup feature."
        ],
        "table": {
          "headings": [
            "Test input or event",
            "Expected evidence"
          ],
          "rows": [
            [
              "Record name includes accents and a comma",
              "Text survives export and import unchanged."
            ],
            [
              "Two records share a display name",
              "Stable identifiers keep them distinct."
            ],
            [
              "Backup is truncated or has a future format version",
              "Import stops with a clear reason; existing records remain usable."
            ],
            [
              "Restore into a clean test instance",
              "Required fields, counts and relationships match the export."
            ],
            [
              "Storage write fails",
              "No false saved state; current input remains available."
            ]
          ]
        },
        "title": "Run a restore drill with awkward records"
      },
      {
        "id": "desktop-and-scope",
        "paragraphs": [
          "For a desktop app backed by SQLite, its Online Backup API provides a supported way to copy a live database. That is a more specific operation than assuming that copying an active database file is always sufficient. The right mechanism depends on the database and how it is used.",
          "A backup on the same failing device has a limited recovery role. Decide where an independent copy belongs, how sensitive it is, and who controls it. Do not silently add cloud synchronisation merely to make a local app feel finished.",
          "The handover should let a person answer two questions without the developer present: where is my usable copy, and what exactly does restoring it bring back?"
        ],
        "sources": [
          2
        ],
        "title": "Choose a backup method that matches the store"
      }
    ],
    "slug": "local-first-apps-need-a-restore-path",
    "sources": [
      {
        "label": "MDN: Storage quotas and eviction criteria; live browser storage documentation",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria"
      },
      {
        "label": "SQLite: Online Backup API; live documentation",
        "url": "https://sqlite.org/backup.html"
      }
    ],
    "title": "A local app needs a way back"
  },
  {
    "category": "Automation",
    "date": "2026-09-11",
    "description": "Designing retries, operation records and human review for the uncertain gap between sending a request and seeing its result.",
    "image": {
      "alt": "Illustrative lost-response sequence: request operation A creates one job; the reply is lost. Retrying operation A returns the existing result under an idempotent API contract, rather than creating another job.",
      "caption": "Illustrative lost-response sequence: request operation A creates one job; the reply is lost. Retrying operation A returns the existing result under an idempotent API contract, rather than creating another job.",
      "height": 720,
      "src": "/assets/blog/20260911-Automation-Retry-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "An automation sends a request to create a job. The connection drops before a response arrives. The screen says the request timed out, but the receiving system may already have created the job.",
      "This is an awkward state because both immediate retry and immediate abandonment can be wrong. The following design uses a fictional service-request workflow to explain how to make that uncertainty visible and recoverable. It is not a claim about a particular deployed client system."
    ],
    "note": "Sources checked on 11 September 2026. The job workflow and fault-injection cases are proposed software examples, not measured production results.",
    "sections": [
      {
        "id": "timeout",
        "paragraphs": [
          "There are at least three possibilities: the receiver never got the request, it received the request but did not finish, or it finished and the response was lost. The caller's timeout does not distinguish them.",
          "AWS's discussion of idempotent APIs uses this ambiguity to explain why retrying a request can create duplicate effects. An idempotent operation permits a repeat of the same intended request without repeating its effect. Whether an API provides that contract must be checked in its documentation.",
          "Record an unknown outcome explicitly. If the interface only has success and failure, it encourages someone to turn uncertainty into a guess."
        ],
        "sources": [
          1
        ],
        "title": "A timeout describes what the caller knows"
      },
      {
        "id": "intent",
        "paragraphs": [
          "For the fictional job workflow, assign an operation identifier before the first attempt. Keep it for retries of that same intended action. A genuinely new request gets a new identifier even if its description happens to be identical.",
          "The receiving service needs a defined duplicate-handling contract. Reusing an identifier with changed parameters should produce a conflict or another explicit outcome, not quietly reinterpret the earlier request. Also establish how long duplicate protection lasts.",
          "Disabling the submit button helps prevent some accidental clicks. It does not handle a page reload, a second device, an automatic retry or a lost response. Those cases require the operation's identity to survive beyond one button's state."
        ],
        "sources": [
          1
        ],
        "title": "Give the intended action a stable identity"
      },
      {
        "after": [
          "A status lookup should identify the operation, not merely search for a similar description. Two customers can request the same work. Two requests from one customer can also be legitimate."
        ],
        "id": "outcome-states",
        "paragraphs": [
          "This proposed state model separates preparation, execution and uncertainty. An unknown outcome remains open until authoritative evidence resolves it."
        ],
        "table": {
          "headings": [
            "Recorded state",
            "Permitted next step"
          ],
          "rows": [
            [
              "Prepared",
              "Submit the validated request with its operation identifier."
            ],
            [
              "In progress",
              "Observe or query the existing operation; avoid starting a duplicate."
            ],
            [
              "Succeeded",
              "Display the authoritative result and its reference."
            ],
            [
              "Rejected before effect",
              "Correct the stated input problem under the API's contract."
            ],
            [
              "Outcome unknown",
              "Reconcile by operation identifier or hold for review."
            ]
          ]
        },
        "title": "Use states that tell the next person what to do"
      },
      {
        "id": "transaction-boundary",
        "paragraphs": [
          "SQLite documents atomic commit as all changes within a transaction occurring together or not occurring. That is useful when a local service records an operation and its associated local state change.",
          "It does not make a database transaction and a remote side effect one indivisible event. If a workflow writes a local record and then calls a separate service, a crash can occur between those steps. Treat that boundary explicitly rather than assuming the word transaction covers both systems.",
          "For a remote API with documented idempotency support, reuse its supported request identifier and reconcile its result. If no safe retry or status mechanism exists, a human review state may be the correct recovery path. An uncertain physical action needs a separate hazard assessment; retrying machinery is not equivalent to retrying a database lookup."
        ],
        "sources": [
          2
        ],
        "title": "Know where atomicity stops"
      },
      {
        "id": "failure-test",
        "paragraphs": [
          "In a controlled test double, let the receiver create the fictional job but drop the response. Retry using the same operation identifier. Inspect the receiver's records: exactly one intended job should exist, and the caller should recover its reference.",
          "Next, use the same identifier with changed content. Check that the system reports the defined conflict. Then use a new identifier with identical content and verify that a genuinely new action is possible. These cases distinguish intent from superficial similarity.",
          "Include restart and delayed-response cases. A late response from an old attempt should not overwrite the displayed result of a different operation. Keep attempt numbers separate from operation identity so logs explain both.",
          "The acceptance evidence is the receiving system's resulting state and the caller's recovery behaviour. A log line saying retry successful is useful only when those observations agree."
        ],
        "title": "Test the lost-response case deliberately"
      }
    ],
    "slug": "automation-retries-without-duplicate-actions",
    "sources": [
      {
        "label": "Amazon Builders' Library, Malcolm Featonby: Making retries safe with idempotent APIs; undated web article",
        "url": "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/"
      },
      {
        "label": "SQLite: Atomic Commit In SQLite; live documentation",
        "url": "https://sqlite.org/atomiccommit.html"
      }
    ],
    "title": "When an automation times out, did the action happen?"
  }
];
