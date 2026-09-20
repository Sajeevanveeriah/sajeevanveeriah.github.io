import type { BlogPost } from "./blog";

export const developmentPosts: BlogPost[] = [
  {
    "slug": "gendio-control-board-and-radar-positioning",
    "title": "Inside the Gendio control board: power, protocols and radar positioning",
    "date": "2026-09-20",
    "category": "Electronics / embedded systems / instrumentation",
    "description": "A detailed design study of the ESP32-S3 controller, its power and protocol boundaries, and a radar-based positioning extension that preserves the existing PCB.",
    "image": {
      "src": "/assets/blog/20260920-engineering/Gendio-Controller.webp",
      "alt": "Isometric CAD render of the Gendio controller, with the ESP32 module, Ethernet connector, power converters, diagnostic LEDs and panel connector.",
      "caption": "Actual project PCB CAD render from the 18 September package. Nominal component models; no assembled-hardware test is implied.",
      "width": 2184,
      "height": 1544
    },
    "intro": [
      "The difficult part of a weighbridge scoreboard is deciding what a displayed value is allowed to mean. A serial port can receive bytes while the weight is invalid. A network link can remain active while its data is stale. A vehicle can produce a steady distance reading without being correctly positioned on the deck.",
      "My Gendio design treats these as separate engineering questions. The controller receives and checks an existing indicator's weight messages, then drives a selected display. The V2 extension adds a measured-position advisory through industrial radar and a gateway, without changing the controller PCB. This article follows the design from power conversion and CAD to packet freshness and experimental acceptance.",
      "The evidence is a manufacturing-oriented board package and a later development release for vehicle positioning. It includes native designs, compiled firmware and recorded software checks. Physical board operation, vehicle trials and environmental qualification remain unverified."
    ],
    "sections": [
      {
        "id": "scope",
        "title": "1. Define the claim before choosing the circuit",
        "paragraphs": [
          "The weighing indicator remains the measurement instrument. Gendio does not excite load cells or independently measure mass. It interprets an indicator's message, tracks its validity and presents the result. This boundary avoids confusing a display-controller project with a certified weighing system.",
          "The base design accepts one selected input: RS232, RS485, Wi-Fi TCP, Wi-Fi UDP or Ethernet UDP. Bluetooth LE is a service interface. The matrix connector carries logic and ground; the display needs its own power supply. A separate serial adapter supports a remote serial display. Each path has a distinct interface and acceptance test."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "Board supply",
              "24 V DC nominal, with an 18-30 V design input range. Cabinet and supply qualification are still required."
            ],
            [
              "Compute",
              "ESP32-S3-WROOM-1-N8R8; 8 MB flash and 8 MB octal PSRAM in the documented build target."
            ],
            [
              "Display",
              "Candidate 128 × 32 matrix with 1/16 scan; actual panel pinout and timing require commissioning."
            ],
            [
              "V2 position",
              "Driver/operator information only; no brake, barrier or traffic-light control."
            ]
          ]
        }
      },
      {
        "id": "power",
        "title": "2. Power capacity belongs to the whole conversion chain",
        "paragraphs": [
          "The board uses an LM5164 to generate 5 V, followed by a TPS62902 for a nominal 3.35 V shared logic rail. The schematic retains the +3V3 net name, so reviewers must read the numerical contract as well as the label. The downstream converter's 2 A capability does not increase the upstream converter's 1 A output capacity.",
          "The documented allocation is 0.812 A on the shared rail and 0.138 A directly at 5 V. A conservative corner uses 3.41424 V at the shared rail, 4.85 V into the second converter and 80% assumed conversion efficiency. The resulting upstream current is I5 = (3.41424 × 0.812)/(4.85 × 0.80) + 0.138 = 0.8525 A. Including the documented startup charging allowance raises the screen to about 0.9234 A.",
          "These numbers are allocations, not oscilloscope or current-probe measurements. They expose the narrow margin that must be investigated under radio bursts, Ethernet activity, adapter loading and startup. A part's headline rating cannot replace a simultaneous-load test.",
          "The rail corner screen is 3.2864-3.4142 V before dynamics. Adding the allocated ±150 mV transient, ripple and distribution envelope gives 3.1364-3.5642 V. That allowance is a requirement on the physical implementation, not a demonstrated waveform."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Gendio-Top.png",
          "alt": "Top-down Gendio CAD view showing the distribution of connectors, power conversion and logic circuitry.",
          "caption": "Board placement view. The logic rail, upstream current limit and component thermal paths must be assessed together.",
          "width": 1992,
          "height": 1376
        },
        "sources": [
          1,
          2
        ]
      },
      {
        "id": "transients",
        "title": "3. Use a model to identify the measurement that matters",
        "paragraphs": [
          "For a load step whose converter current recovers linearly, a first-order charge-deficit estimate is ΔV = ΔI × tr/(2Ceff) + ΔI × ESR. Here ΔI is the additional load current, tr the assumed recovery interval and Ceff the capacitance after the chosen bias and tolerance reductions.",
          "For example, ΔI = 0.5 A, tr = 10 µs, Ceff = 30.294 µF and ESR = 10 mΩ produce about 87.5 mV of predicted droop. Doubling the recovery interval increases it to about 170.1 mV, beyond the 150 mV allocation. This is an illustrative recalculation of the package's sensitivity model, not a simulation of the TPS62902 control loop.",
          "The package contains LM5164-related LTspice studies, but the encrypted TPS62902 vendor model was not executed there. Treating every spreadsheet or transient study as a validated converter model would hide that difference.",
          "Thermal screening is equally conditional. At approximately 0.693 W estimated loss, a 60 °C ambient and a 125 °C junction target require a thermal resistance below roughly 94 K/W. Board copper, enclosure conditions and airflow determine whether the assembled product meets that requirement. The correct next step is a measured worst-case thermal test, including the inductor and connector temperatures."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Gendio-Transient-Sensitivity.png",
          "alt": "Calculated droop rises with recovery time and load-step size; the 0.5 A case exceeds the 150 mV allocation near 18 microseconds.",
          "caption": "Recomputed analytical sensitivity. All curves depend on the stated assumptions; they are not physical test results.",
          "width": 1440,
          "height": 840
        }
      },
      {
        "id": "cad",
        "title": "4. CAD joins electrical intent to assembly",
        "paragraphs": [
          "The native KiCad projects are the board fabrication authority. Mechanical STEP assemblies, mounting drawings and nominal component bodies support enclosure review and access planning. Converted EasyEDA projects need comparison with that authority before another manufacturing release.",
          "I use the mechanical view to ask practical questions: can the programming header be reached, does the panel ribbon clear adjacent parts, can the Ethernet lead bend without loading the socket, and will cabinet metal obstruct the module antenna? A successful STEP export answers none of those questions by itself.",
          "The controller and serial adapter remain separate assemblies. Their short internal harness has its own pin and load contract. That modularity makes the output interface explicit and keeps a field-system BOM distinct from a board assembly BOM."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Gendio-Mounting.png",
          "alt": "Controller mounting drawing from the supplied Gendio CAD package.",
          "caption": "Supplied mounting reference. Assembly models use nominal library bodies and must be checked against the final enclosure and purchased parts.",
          "width": 1800,
          "height": 1476
        },
        "links": [
          {
            "label": "Controller assembly CAD (STEP, nominal model)",
            "url": "/assets/blog/20260920-engineering/Gendio-Controller.step"
          },
          {
            "label": "Serial adapter CAD (STEP, nominal model)",
            "url": "/assets/blog/20260920-engineering/Gendio-Adapter.step"
          }
        ]
      },
      {
        "id": "firmware",
        "title": "5. A byte received is not a value accepted",
        "paragraphs": [
          "The firmware separates input acquisition, protocol parsing, receiver state, display formatting and matrix scanning. Configuration and update handling have their own inhibition rules. Restart begins with outputs disabled; changes to relevant settings disarm outputs.",
          "The package records 31 parser profiles. That means 31 implemented formats exercised with synthetic fixtures, not certification for every product sold by the manufacturers named in the registry. Commissioning needs captured frames from the actual indicator, including sign, decimal position, unit, status and malformed traffic.",
          "The diagnostic lamps deliberately expose different observations. A serial lamp reports recent bytes on the selected input; the Ethernet lamp reports PHY link; the data lamp requires a live receiver and no update inhibit. This makes it possible to investigate a connected-but-invalid system without pretending that every green indication means the same thing.",
          "The local management interface uses authentication and guarded writes, while the documented implementation has neither HTTPS nor signed-release enforcement. It belongs on an access-controlled equipment network. A checksum validates accidental corruption; it does not establish who sent the data."
        ]
      },
      {
        "id": "radar",
        "title": "6. Extend the system without silently changing the PCB",
        "paragraphs": [
          "The V2 candidate chain is Banner T30R-1515-KIQ radar, a 250 Ω shunt, an Advantech ADAM-6017-D input, a Python gateway and the existing controller Ethernet interface. The gateway is necessary: the controller's bounded IPv4/UDP implementation does not become a general Modbus/TCP or REST client merely because an industrial I/O module is connected.",
          "The radar's 4-20 mA output is configured over a project span of 1-10 m. Across 250 Ω it becomes 1-5 V; the input module is set to 0-10 V so low-signal and overrange conditions remain observable. The gateway rejects an invalid range or read, rather than turning a fault into a plausible stopping distance.",
          "The architecture below leaves the weighing input separate. V2 adds a position line to the candidate matrix and a dashboard card. Existing serial Ranger output remains weight-only. A serial-only installation therefore needs a separately supported advisory display."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Gendio-V2-Architecture.png",
          "alt": "Radar feeds an industrial analogue input and Python gateway, which sends UDP position packets to the unchanged controller and matrix scoreboard. Weight reception stays separate.",
          "caption": "V2 architecture from the supplied design. The external gateway is required and the position function is advisory.",
          "width": 1400,
          "height": 760
        },
        "sources": [
          3,
          4
        ]
      },
      {
        "id": "measurement",
        "title": "7. Resolution, accuracy and target selection are different",
        "paragraphs": [
          "For the configured span, dmm = 1000 + (ImA - 4) × 9000/16. At 3000 mm, the expected signal is 7.5556 mA, or 1.8889 V across the shunt. With the package's 16-bit 0-10 V mapping, one count represents about 0.3433 mm. This is conversion granularity, not end-to-end distance accuracy.",
          "A measurement budget must include radar behaviour, target geometry, alignment, input-module error, shunt tolerance and temperature. At the 3 m example, a 0.1% shunt error alone corresponds to approximately 4.25 mm when the nominal conversion is used, before the other contributors. Correlated errors should not be hidden inside a root-sum-square calculation without justification.",
          "A geometric screen for a nominal 15° beam is W = 2d tan(7.5°): about 0.79 m at 3 m and 2.63 m at 10 m. The sensor can encounter rails, bullbars or another vehicle within a broad region. The beam sketch is not a hard detection boundary. Target trials must precede a fixed teaching distance.",
          "The package uses a 3000 mm centre and ±250 mm window as commissioning examples. They are not a universal stop location. The bracket drawing likewise represents a mounting concept, with its height and orientation still dependent on the fleet and site survey."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Gendio-Site-Layout.png",
          "alt": "Plan-view concept of a scoreboard-mounted radar looking towards a vehicle on a weighbridge, with an example taught position.",
          "caption": "Illustrative site layout. Example distances must be replaced by surveyed installation values.",
          "width": 1400,
          "height": 760
        },
        "sources": [
          3
        ],
        "links": [
          {
            "label": "Sensor bracket concept CAD (STEP)",
            "url": "/assets/blog/20260920-engineering/Gendio-Sensor-Mount.step"
          }
        ]
      },
      {
        "id": "freshness",
        "title": "8. A fresh packet can still contain an old physical observation",
        "paragraphs": [
          "The GVP2 payload is 20 bytes: a four-byte identifier followed by 32-bit sequence, distance, validity and CRC fields. The receiver checks the network envelope and rejects repeated or backwards sequences. A 750 ms receive timeout withdraws the position indication; recovery requires a new settling period.",
          "That timer is only one part of the observation chain. Banner documents a two-second delay before its configured analogue loss-of-signal output changes. The project's conservative budget adds 450 ms for a gateway cycle, 750 ms for packet timeout and 50 ms for rendering, giving 3.25 s. These terms need not all occur together, and the budget has not been measured on installed hardware.",
          "A gateway can keep sending new sequence numbers for a frozen but plausible analogue value. The freshness mechanism cannot establish that the physical target changed or that the sensor is healthy. This is an observability limit of the single-channel design.",
          "POSITION OK requires readings inside the taught window with no more than 40 mm total excursion over 3 s. A monotonic creep of about 13.3 mm/s can satisfy that initial interval. The state therefore means a stable measured target within the chosen criterion, not zero velocity, correct axle placement or permission to move."
        ],
        "sources": [
          3
        ]
      },
      {
        "id": "evidence",
        "title": "9. Verification needs a claim-by-claim structure",
        "paragraphs": [
          "The supplied September records report successful firmware compilation, host protocol/state tests, gateway tests and mocked dashboard checks. I am reporting those recorded runs; publishing this article does not rerun the embedded toolchain or turn mocked responses into equipment measurements."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "Recorded software evidence",
              "V2 compilation plus synthetic packet/state tests and six gateway tests, including loopback HTTP and redirect rejection."
            ],
            [
              "Recorded board evidence",
              "Native board checks and manufacturing exports belong to the retained baseline. V2 introduces no new PCB geometry."
            ],
            [
              "Physical evidence",
              "No assembled-board, radar/ADAM integration or vehicle acceptance results are supplied."
            ],
            [
              "Publication review",
              "CAD figures, source references and worked calculations were reviewed for this article; that review is not hardware qualification."
            ]
          ]
        },
        "after": [
          "A defensible experiment would log reference distance, raw voltage, gateway value, packet arrival and displayed state against one timebase. Test stationary and moving targets separately, then inject power loss, network loss, wrong range settings, duplicate packets and an in-range frozen signal. Measure withdrawal latency from the physical event, not just the last packet.",
          "The proposed site trial starts with representative vehicle classes and at least 30 approaches per class. Include difficult frontal geometry, empty-lane clutter, wrong stopping positions and slow creep. This is a coverage plan, not a statistical reliability claim; zero observed failures in a small trial cannot establish a safety integrity level."
        ]
      },
      {
        "id": "open-design",
        "title": "10. Keep the design space open",
        "paragraphs": [
          "When an engineering project is not locked too early into a fixed budget, inherited geometry or assumed design constraints, the possibilities for innovation can feel vast and endless. That freedom is most useful at the exploration stage: it lets me ask whether the architecture itself should change, instead of merely optimising the first answer.",
          "The eventual product still needs limits that can be defended. Physics, safety and evidence do not disappear when a budget expands. I want to keep the imagination open while making each claim precise enough to test.",
          "“Stay Hungry; Stay Foolish” - Steve Jobs. Jobs used the words “Stay hungry. Stay foolish.” in his 2005 Stanford address, recalling the farewell message of the Whole Earth Catalog."
        ],
        "sources": [
          5
        ]
      }
    ],
    "sources": [
      {
        "label": "Texas Instruments: LM5164 product documentation; Rev. D datasheet listed 19 February 2026",
        "url": "https://www.ti.com/product/LM5164"
      },
      {
        "label": "Texas Instruments: TPS62902 converter documentation",
        "url": "https://www.ti.com/product/TPS62902"
      },
      {
        "label": "Banner T30R manual, 217048 Rev. H, 4 June 2025; analogue loss-of-signal behaviour",
        "url": "https://info.bannerengineering.com/cs/groups/public/documents/literature/217048.pdf"
      },
      {
        "label": "Advantech ADAM-6000 manual, Edition 12, November 2022; retained copy reviewed in the project package",
        "url": "https://advdownload.advantech.com/productfile/Downloadfile4/1-2B6FKTG/ADAM-6000_User_Manaul_Ed.12-FINAL.pdf"
      },
      {
        "label": "Stanford: Steve Jobs commencement address, 12 June 2005",
        "url": "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"
      }
    ],
    "note": "Project evidence: 20260918-Gendio-Control-Board-Rev00 and 20260920-Gendio-Scoreboard-Position-V2-Rev00, including engineering references, design contracts and verification records. Primary vendor pages checked 20 September 2026; the Advantech reference was inspected from the retained manual. This is an engineering design study, not a peer-reviewed paper or a field-performance report. CAD downloads are review models, not a complete fabrication release."
  },
  {
    "slug": "solar-panel-cleaning-robot-design-study",
    "title": "Designing a waterless solar-panel cleaning robot",
    "date": "2026-09-20",
    "category": "Robotics / mechatronics / design study",
    "description": "CAD, traction and energy calculations, conservative coverage planning and an experimental roadmap for a modular dry-cleaning crawler.",
    "image": {
      "src": "/assets/blog/20260920-engineering/Cleaner-Cutaway.png",
      "alt": "Cover-off CAD view of a tracked solar-panel cleaner with a front roller, central battery envelope and rear electronics tray.",
      "caption": "Actual development CAD from SPC-001 Rev00. The 27-solid assembly contains nominal allocation envelopes, not a manufactured or qualified robot.",
      "width": 1600,
      "height": 1100
    },
    "intro": [
      "A solar-panel cleaner must remove contamination while protecting the surface that produces the energy. Adding a brush to a mobile platform leaves most of that problem unresolved: contact force, embedded grit, wheel slip, edge detection and power-loss retention all interact.",
      "My new design explores a waterless crawler with replaceable track pods, a 420 mm roller and separate docking and loading modules. The goal is a system that can adapt within a qualified installation class. It cannot responsibly mean driving onto any unfamiliar panel and learning its safety limits by trial and error.",
      "This is a development design study. The package contains FreeCAD and STEP models, first-pass calculations, an interface schematic, a tested host-side supervisor and an offline rectangular coverage planner. It does not contain a production-ready robot, a completed electrical safety circuit or evidence of physical cleaning performance."
    ],
    "sections": [
      {
        "id": "question",
        "title": "1. Frame the research question around useful cleaning",
        "paragraphs": [
          "My research question is how a lightweight dry-cleaning platform could remove loose contamination while maintaining traction, staying within a known surface and limiting contact damage. Cleaning effectiveness, coverage and surface preservation must be measured separately.",
          "A useful hypothesis would be that a specified roller material and normal force can remove a defined soil load without exceeding a pre-agreed optical or surface-damage limit. A second hypothesis concerns repeatable motion under that same contamination. Neither has been experimentally established for this design.",
          "This changes component selection. More brush force may improve removal while reducing track loading and increasing drag. A wider head may improve nominal area rate while worsening access near frames. A heavier battery may extend energy capacity while increasing glass and mounting loads. These are coupled decisions, not independent catalogue choices."
        ]
      },
      {
        "id": "mechanics",
        "title": "2. What the CAD actually defines",
        "paragraphs": [
          "The cleaner model contains 27 named solids within a recorded 438 × 458 × 171 mm bounding box. A 380 × 300 × 3 mm chassis plate carries the battery and electronics allocations, with separate side track pods and the front cleaning roller. The cover is a nominal 3 mm shell.",
          "The geometric model communicates arrangement, access and modularity. Bearings, tensioners, shaft retention, fasteners, transmission details, a compliant brush lift, cable routing, sealing and thermal paths still need detailed design. The four nominal chassis mounting holes do not make the assembly build-ready.",
          "A valid solid and a matching STEP volume establish geometry consistency. They do not prove that a selected battery fits, the chassis will remain sufficiently stiff, or the contact system will avoid damaging a module. The source receipt records successful native/STEP reopening; this publication does not claim a new FreeCAD structural analysis."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Cleaner-Enclosed.png",
          "alt": "Enclosed CAD model of the crawler showing its cover, track pods and front dry-cleaning roller.",
          "caption": "Enclosure development geometry. No sealing, ingress-protection rating or assembly tolerance is established.",
          "width": 1600,
          "height": 1100
        },
        "links": [
          {
            "label": "Cleaner assembly (editable FreeCAD)",
            "url": "/assets/blog/20260920-engineering/Cleaner-Assembly.FCStd"
          },
          {
            "label": "Cleaner assembly (STEP)",
            "url": "/assets/blog/20260920-engineering/Cleaner-Assembly.step"
          }
        ]
      },
      {
        "id": "forces",
        "title": "3. Start with force balance, then challenge the assumptions",
        "paragraphs": [
          "The sizing model assumes m = 5 kg, a 15° calculation slope, a 6 N brush normal preload, 3 N brush drag and a rolling-resistance coefficient of 0.04. None is a measured operating rating. With g = 9.80665 m/s², the normal load on the tracks is Nt = mg cos θ - Fb = 41.36 N.",
          "The required uphill force is F = mg sin θ + Crr Nt + Fdrag = 12.69 + 1.65 + 3.00 = 17.35 N. With an assumed traction coefficient µ = 0.5, available traction is µNt = 20.68 N. The ratio of available to required force is only 1.19.",
          "That ratio makes friction testing a priority. If µ falls to 0.3, the available force becomes 12.41 N and the same design cannot sustain the modelled uphill motion. A larger motor does not resolve this shortage of contact friction.",
          "The model also neglects load transfer, uneven brush contact, wind, tether force, track scrub and panel flexure. It is deliberately simple enough to expose the assumptions. A test programme must replace those assumptions before assigning a slope rating."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "Assumed slope",
              "15° for calculation only; no qualified maximum slope."
            ],
            [
              "Assumed mass",
              "5 kg design budget; no measured assembled mass."
            ],
            [
              "Required traction coefficient",
              "Approximately 0.419 under the stated straight-line model."
            ],
            [
              "Brush interaction",
              "A 6 N preload subtracts from track normal force while the assumed 3 N drag adds to drive demand."
            ],
            [
              "Gap crossing",
              "Default permitted direct gap crossing is zero; a bridge requires its own engineered interface."
            ]
          ]
        },
        "image": {
          "src": "/assets/blog/20260920-engineering/Cleaner-Traction-Sensitivity.png",
          "alt": "Calculated traction margin falls as slope increases. At 15 degrees, assumed friction 0.5 gives a margin of 1.19, while friction 0.3 is insufficient.",
          "caption": "Recomputed analytical sensitivity. All curves depend on the stated assumptions; they are not physical test results.",
          "width": 1440,
          "height": 840
        }
      },
      {
        "id": "drive",
        "title": "4. Motor torque is only one selection gate",
        "paragraphs": [
          "With an effective traction radius r = 0.04 m, two motors and an assumed drive efficiency η = 0.8, torque per motor is τ = Fr/(2η) = 0.434 N m. Applying the chosen factor of two gives 0.867 N m per motor.",
          "The candidate Pololu 4756 documentation gives a recommended continuous gearbox load ceiling equivalent to approximately 0.981 N m. Being below that ceiling is a screening result. It does not establish winding temperature, duty cycle, startup capability or service life at the actual load.",
          "At 0.05 m/s, the required output speed is about 11.94 rpm for the assumed radius. That low operating point needs encoder feedback and a measured motor/gearbox map. Open-loop PWM percentage is not a speed guarantee, particularly as brush load and battery voltage change.",
          "For a nominal 12 V motor and a possible 14.6 V pack voltage, 12/14.6 gives an average-voltage PWM ceiling of about 82.2%. This simple limit does not remove ripple-current, stall or thermal requirements. The final controller must enforce measured current and temperature limits appropriate to the selected motor."
        ],
        "sources": [
          1
        ]
      },
      {
        "id": "energy",
        "title": "5. Energy and area rate are planning calculations",
        "paragraphs": [
          "The candidate 12.8 V, 6 Ah pack represents 76.8 Wh nominal. Reserving 20% and assuming 90% delivery efficiency leaves Euse = 12.8 × 6 × 0.8 × 0.9 = 55.296 Wh. Runtime is then t = Euse/P: about 73.7 minutes at 45 W or 47.4 minutes at 70 W.",
          "The 45 W allocation includes 12 W for each drive, 12 W for the brush, 5 W for control and sensing, and 4 W of auxiliary allowance. These are budgets, not sampled electrical loads. Battery capacity, discharge limits, ageing, temperature and the actual return-to-dock requirement remain open.",
          "The straight-line area rate is Q = (b - o)v, where b is brush width, o lane overlap and v speed. With b = 0.42 m, o = 0.04 m and v = 0.05 m/s, Q is 68.4 m²/h. Applying an assumed utilisation of 55% gives 37.6 m²/h for planning.",
          "A robot can traverse an area without cleaning it adequately. These rates exclude unresolved boundary coverage and cannot support a claimed energy-yield improvement. That would require matched electrical measurements and controlled environmental conditions."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "45 W case",
              "73.7 min calculated runtime; no prototype discharge test."
            ],
            [
              "70 W case",
              "47.4 min calculated runtime; demonstrates load sensitivity."
            ],
            [
              "Straight-line rate",
              "68.4 m²/h from width, overlap and speed."
            ],
            [
              "Planning rate",
              "37.6 m²/h after an assumed utilisation factor; not a measured cleaning rate."
            ]
          ]
        }
      },
      {
        "id": "coverage",
        "title": "6. A conservative path exposes a perimeter problem",
        "paragraphs": [
          "The delivered planner produces alternating lanes inside a known, connected rectangle. It does not discover an array, localise the robot, cross gaps, avoid arbitrary obstacles or implement physical turns. A route drawn on a panel is not yet a navigation system.",
          "Its centre-path margin is sqrt(0.245² + 0.229²) + 0.09 = approximately 0.425 m. The first term contains the furthest modelled corner during rotation; the additional 90 mm is an unqualified edge reserve. This is more conservative than keeping only the robot's centre inside the panel boundary.",
          "Because half the brush width is 0.21 m, the model reports at least about 0.215 m of lateral boundary remaining outside that nominal cleaning reach. Safe geometric containment and full-panel cleaning conflict in this configuration. An offset cleaning head, controlled edge-following mechanism or a constrained rail architecture would need a separate assessment.",
          "The 90 mm reserve includes 5 mm of reaction travel and 6.25 mm of ideal braking distance at the assumed 0.05 m/s and 0.2 m/s² deceleration, plus uncertainty allowances. It is not a measured stopping distance. Removing power can allow downhill motion, so restraint must remain effective when electronics cannot help."
        ]
      },
      {
        "id": "sensing",
        "title": "7. Geometry sensing cannot certify the surface",
        "paragraphs": [
          "The candidate sensing approach includes time-of-flight ranging, encoders and an IMU, with diverse edge sensing and independently engineered retention still required. A range sensor may see the roof below a gap; a plausible return is not evidence of continuous support.",
          "Pololu's VL53L1X carrier documentation makes the electrical and optical integration constraints explicit, including its unshifted XSHUT input. Range performance must be tested under the intended sunlight, surface and mounting conditions. Encoder rotation and IMU tilt alone cannot reliably establish ground-relative slip.",
          "A qualified installation profile needs the module family, permitted contact system, surface condition, slope, restraint and verification evidence. Unknown surfaces must inhibit operation. Neither vision nor ranging can establish coating abrasion resistance, hidden cell damage, panel load capacity or anchor strength.",
          "The future perception system should carry uncertainty into motion decisions. Lost returns, disagreements, stuck-plausible values and movement without expected displacement need explicit handling. An AI classifier would require an appropriate dataset and evaluation; no trained model or autonomous visual perception is supplied here."
        ],
        "sources": [
          3
        ]
      },
      {
        "id": "electrical",
        "title": "8. Default-off software needs compatible hardware",
        "paragraphs": [
          "The proposed electrical route uses purchased controller and motor-driver modules during development. The current KiCad drawing is an interface schematic, not a completed circuit or PCB. Its record contains 66 matched interface ports and 18 unresolved isolated pin-label findings. These are open design work, not waived manufacturing checks.",
          "The Pololu 2991 candidate driver's current md31c version pulls SLP high by default, enabling the driver. A design that expects inactivity during boot needs a hardware circuit that forces inhibition through reset and faults. Its default current limit is also inappropriate as protection for the small candidate gearmotor without adjustment and verification.",
          "The selected motor's encoder supply starts above 3.3 V. With a 5 V supply, its output levels need a suitable interface before reaching an ESP32 input. A named translation block on a drawing does not establish component selection, pin protection or verified timing.",
          "The electrical development gates include fused power, DC isolation, independent stop/heartbeat handling, motor-bus interruption, a matched charge path and power-loss retention. A motor-driver fault pin cannot replace the complete protection design."
        ],
        "sources": [
          1,
          2
        ]
      },
      {
        "id": "states",
        "title": "9. The supervisor is implemented; the robot is not yet autonomous",
        "paragraphs": [
          "The host-side control logic defines Disarmed, Ready, Cleaning, Docked and Fault states. It checks profile bounds, sample freshness, interlocks, edge agreement, driver condition, tilt, battery, current and temperature. Faults latch, and removing the cause does not automatically restart motion.",
          "Arming, starting and resetting are separate transitions. A reset returns to Disarmed, while dock or charger indications inhibit outputs. The tests include timestamp wraparound, stale samples and non-finite values. These cases matter because an apparently reasonable default can become an unintended restart.",
          "The package records 40,184 supervisor assertions and 870 offline coverage assertions. Repeated assertions establish behaviour for exercised inputs, not a probability of safe field operation. The Arduino adapter deliberately keeps motion inhibited; sensor drivers, real actuator control, speed loops, hardware watchdog integration and a linked target firmware build remain outstanding."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "Host supervisor",
              "Implemented and tested with synthetic inputs in the supplied record."
            ],
            [
              "Coverage planner",
              "Offline rectangle geometry only; turn execution and perimeter cleaning unresolved."
            ],
            [
              "Embedded integration",
              "Diagnostic adapter only; no autonomous hardware operation established."
            ],
            [
              "Physical validation",
              "No cleaning, abrasion, traction, braking, docking or rooftop trial performed."
            ]
          ]
        }
      },
      {
        "id": "dock",
        "title": "10. Treat docking as a second machine",
        "paragraphs": [
          "The dock model allocates a 750 × 520 mm platform with guide rails, a stop and a charger housing. Positive parking retention, de-energised charging contacts, interlocks and fault recovery still need engineering. A recognisable dock in CAD does not establish a functioning automatic return system.",
          "The separate 1 m guided ramp at an assumed 15° gives a nominal rise of sin(15°) × 1 m = 0.259 m. It represents transfer from an adjacent supported platform. It is not a way to climb from ground level onto a roof."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Cleaner-Dock.png",
          "alt": "Nominal dock CAD showing a rectangular platform, guide rails, end stop and charger allocation.",
          "caption": "Dock allocation model. Parking latch, charging interlocks and automated approach remain future design work.",
          "width": 1600,
          "height": 1100
        },
        "links": [
          {
            "label": "Dock concept CAD (STEP)",
            "url": "/assets/blog/20260920-engineering/Cleaner-Dock.step"
          }
        ]
      },
      {
        "id": "loading",
        "title": "11. Loading and recovery need their own acceptance tests",
        "paragraphs": [
          "A loading interface must remain supported through the transfer, limit rollback, avoid catching the cleaning head and retain the robot after power loss. Site anchorage, wind, transfer gaps and recovery access are installation decisions that cannot be finalised from the crawler model alone.",
          "The guided ramp concept gives those questions a visible geometry. The next design iteration needs tolerance stacks, mechanical captures and a test fixture that makes a failed transfer recoverable without putting a person below the robot."
        ],
        "image": {
          "src": "/assets/blog/20260920-engineering/Cleaner-Ramp.png",
          "alt": "Guided inclined loading-ramp concept with side rails.",
          "caption": "Loading concept only. The model does not establish anchorage, load capacity or automatic transfer.",
          "width": 1600,
          "height": 1100
        },
        "links": [
          {
            "label": "Loading-ramp concept CAD (STEP)",
            "url": "/assets/blog/20260920-engineering/Cleaner-Ramp.step"
          }
        ]
      },
      {
        "id": "experiment",
        "title": "12. An experimental programme that can reject the design",
        "paragraphs": [
          "I would begin with restrained ground-level fixtures and representative test surfaces. Before testing, define cleaning, damage, traction and retention acceptance limits with the module supplier and installation owner. The robot must be allowed to fail those criteria without redefining success afterwards."
        ],
        "table": {
          "headings": [
            "Design item",
            "Engineering interpretation"
          ],
          "rows": [
            [
              "Cleaning and abrasion",
              "Control soil type and loading; compare untreated and cleaned specimens; record optical change and surface damage across repeated cycles."
            ],
            [
              "Traction and brush load",
              "Measure friction and drag across slope, dust, humidity and contact force. Include turning scrub and repeated starts."
            ],
            [
              "Edge and fault behaviour",
              "Inject missing, saturated, disagreeing and stuck sensor signals; measure physical travel and retention after each fault."
            ],
            [
              "Energy and thermal",
              "Log current, voltage and temperature through cleaning, turns, stalls, return and charging; compare with the budget."
            ],
            [
              "Dock and loader",
              "Test misalignment, interruption, failed latching, power loss and recovery on a restrained fixture."
            ]
          ]
        },
        "after": [
          "Trials should include repeated runs, documented instruments, raw data and uncertainty estimates. Randomising test order can reduce drift bias. Pairing before/after observations helps distinguish a cleaning effect from differences between specimens. A change in irradiance or module temperature must not be misreported as recovered generation.",
          "The current design is useful because its unresolved questions are concrete: friction may be insufficient, the brush may damage a coating, the planner leaves boundary strips, and the electrical integration is incomplete. Each finding can redirect the architecture before production tooling commits the project to it."
        ]
      },
      {
        "id": "open-design",
        "title": "13. Exploration before premature limits",
        "paragraphs": [
          "When an engineering project is not locked too early into a fixed budget, inherited geometry or assumed design constraints, the possibilities for innovation can feel vast and endless. That freedom is most useful at the exploration stage: it lets me ask whether the architecture itself should change, instead of merely optimising the first answer.",
          "The eventual product still needs limits that can be defended. Physics, safety and evidence do not disappear when a budget expands. I want to keep the imagination open while making each claim precise enough to test.",
          "“Stay Hungry; Stay Foolish” - Steve Jobs. Jobs used the words “Stay hungry. Stay foolish.” in his 2005 Stanford address, recalling the farewell message of the Whole Earth Catalog."
        ],
        "sources": [
          4
        ]
      }
    ],
    "sources": [
      {
        "label": "Pololu 4756: motor, encoder and gearbox loading documentation",
        "url": "https://www.pololu.com/product/4756"
      },
      {
        "label": "Pololu 2991: G2 driver; md31c sleep-input defaults and current limiting",
        "url": "https://www.pololu.com/product/2991"
      },
      {
        "label": "Pololu 3415: VL53L1X carrier and interface constraints",
        "url": "https://www.pololu.com/product/3415"
      },
      {
        "label": "Stanford: Steve Jobs commencement address, 12 June 2005",
        "url": "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"
      }
    ],
    "note": "Project evidence: 20260920-Solar-Panel-Cleaner-Rev00, Design-Contract.json, Calculate.py, coverage.py, engineering reference and verification receipts. Calculations were independently recomputed for publication. Vendor references checked 20 September 2026. All operating figures are assumptions or calculated scenarios; no physical performance or production readiness is claimed. The downloadable models are development CAD, not fabrication instructions."
  }
];
