import type { BlogPost } from "./blog";

export const engineeringPosts: BlogPost[] = [
  {
    "slug": "machine-vision-starts-with-the-image",
    "title": "Before training the model, do the camera maths",
    "date": "2026-09-13",
    "category": "Machine vision",
    "description": "A worked example of field of view, exposure and motion blur, and how to tell whether an inspection image contains enough evidence.",
    "image": {
      "src": "/assets/blog/20260913-Vision-Exposure-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Calculated motion during exposure at 1000 millimetres per second and 0.1 millimetres per pixel: 100 microseconds gives 1 pixel of travel; 500 microseconds gives 5 pixels. The example feature is 2 pixels wide.",
      "caption": "Illustrative image budget: a 0.2 mm feature spans two pixels at this scale. During a 500 µs exposure, the object travels five pixels. These are geometric calculations, not measured detection results."
    },
    "intro": [
      "A camera looks down at a moving part. The inspection model reports a defect with confidence. On the next batch, apparently similar defects are missed. Before changing the network or collecting thousands more labels, there is a cheaper question to answer: what evidence actually reached the sensor?",
      "Consider a fictional conveyor inspecting a 0.2 mm surface feature at 1 m/s. The requirement sounds like a machine-learning problem. It is also an optics, lighting and timing problem. A few calculations help separate those parts before they become an expensive dataset."
    ],
    "sections": [
      {
        "id": "pixels",
        "title": "Give the feature a pixel budget",
        "paragraphs": [
          "Suppose the camera sees 200 mm across the direction of travel, sampled by 2000 pixels. At the inspection plane, the nominal scale is 200 / 2000 = 0.1 mm per pixel. A 0.2 mm feature therefore spans just two pixels along that axis.",
          "That ratio describes geometric sampling. It does not establish that the feature can be detected, measured or classified reliably. Focus, lens contrast, noise, feature orientation and the position of an edge relative to the pixel grid still matter. Two samples across a feature leave little room to distinguish its shape.",
          "Write down the required decision first. Detecting a dark mark is different from measuring its width or deciding whether it is a crack. Set the required image scale through trials on representative parts and known features. Avoid treating a camera megapixel count as a complete inspection specification."
        ]
      },
      {
        "id": "exposure",
        "title": "The part keeps moving while the shutter is open",
        "paragraphs": [
          "For uniform motion parallel to the image plane, projected travel in pixels is speed × exposure time / object-space millimetres per pixel. The quantities must use consistent units. At 1 m/s, the part moves at 1000 mm/s.",
          "With a 500 µs exposure, it travels 1000 × 0.0005 = 0.5 mm, or five pixels at our chosen scale. The original feature was only two pixels wide. This does not calculate a detection probability; it shows that motion can spread its image across a distance larger than the feature itself.",
          "At 100 µs, the travel is 0.1 mm, or one pixel. Basler recommends, as a general rule for moving objects, keeping movement during exposure to no more than one pixel. That is a useful starting constraint, not an acceptance test for every inspection."
        ],
        "table": {
          "headings": [
            "Exposure",
            "Calculated travel at 1 m/s"
          ],
          "rows": [
            [
              "500 µs",
              "0.5 mm = 5 pixels"
            ],
            [
              "100 µs",
              "0.1 mm = 1 pixel"
            ],
            [
              "50 µs",
              "0.05 mm = 0.5 pixels"
            ]
          ]
        },
        "sources": [
          1
        ]
      },
      {
        "id": "light",
        "title": "Shorter exposure creates a lighting decision",
        "paragraphs": [
          "Reducing exposure from 500 µs to 100 µs cuts the collection time to one fifth. With unchanged illumination and a linear, unsaturated response, the sensor collects approximately one fifth as many signal photons. Maintaining a similar photon count would require approximately five times the irradiance at the sensor, or another change to the optical arrangement.",
          "That is an idealised exposure comparison, not a recommendation to turn a lamp up fivefold. The part may be reflective, the light may have thermal or pulse limits, and the lens aperture also affects focus tolerance. Confirm the actual lighting and camera limits.",
          "Increasing gain makes the output brighter, but Basler notes that it amplifies signal and noise. It does not replace missing optical evidence. A useful lighting trial changes the angle and diffusion as well as intensity, then checks whether the feature remains distinguishable across the expected surface finishes."
        ],
        "sources": [
          1
        ]
      },
      {
        "id": "timing",
        "title": "Frame rate and exposure answer different questions",
        "paragraphs": [
          "A camera delivering 100 frames per second has a nominal 10 ms interval between frames. That number does not say whether each frame was exposed for 50 µs or 5 ms. The first controls sampling cadence; the second controls the duration over which motion is integrated.",
          "Record the effective exposure and trigger behaviour for the selected camera, rather than assuming a requested setting is the complete timing contract. Basler documents model-dependent exposure ranges and cases where effective exposure differs from the set value. No camera model is being selected in this example.",
          "For a triggered conveyor inspection, also check that the intended part is inside the useful field of view when exposure occurs. A sharp picture of the wrong location is still an unusable inspection."
        ],
        "sources": [
          2
        ]
      },
      {
        "id": "experiment",
        "title": "Run a capture experiment before a training experiment",
        "paragraphs": [
          "Use representative acceptable and defective test parts with an independently established reference. Capture them stationary first, then at the intended speeds. Keep the original images and acquisition settings, including any automatic settings, so a later comparison remains meaningful."
        ],
        "table": {
          "headings": [
            "Comparison",
            "Question it answers"
          ],
          "rows": [
            [
              "Stationary versus moving, same settings",
              "Does motion remove useful detail?"
            ],
            [
              "Exposure sweep, lighting recorded",
              "Can the motion limit be met with usable contrast?"
            ],
            [
              "Expected part heights and surface finishes",
              "Does the optical setup tolerate normal variation?"
            ],
            [
              "Repeated passes and separate acquisition sessions",
              "Does performance survive more than one convenient capture?"
            ]
          ]
        },
        "after": [
          "When evaluating a model, keep repeated images of the same physical part together when separating training and test data. Also reserve genuinely separate parts or acquisition sessions appropriate to the deployment question. Otherwise, near-duplicate images can make the evaluation easier than the real task.",
          "Measure missed defects and false rejects against the reference, with their sample counts. Inspect failures alongside the original images. A confidence score alone cannot tell you whether the camera supplied the evidence needed to make the decision.",
          "The useful handover is a capture specification: required field of view, acceptable focus range, exposure and lighting conditions, timing behaviour, and measured inspection performance within those conditions. That gives the model a defined physical problem to solve."
        ]
      }
    ],
    "sources": [
      {
        "label": "Basler AG: Optimizing Image Quality; undated live product documentation",
        "url": "https://docs.baslerweb.com/optimizing-image-quality"
      },
      {
        "label": "Basler AG: Exposure Time; live documentation, settings vary by camera model",
        "url": "https://docs.baslerweb.com/exposure-time"
      }
    ],
    "note": "Sources checked on 13 September 2026. Conveyor dimensions, speeds and test cases are illustrative. Calculations assume uniform projected motion and a constant image scale at the inspection plane; they are not camera qualification or production results."
  },
  {
    "slug": "automation-queues-and-flow-time",
    "title": "The hidden cost of keeping every machine busy",
    "date": "2026-09-13",
    "category": "Systems engineering",
    "description": "What Little's Law and a simple queue model reveal about work in progress, waiting time and where automation can actually help.",
    "image": {
      "src": "/assets/blog/20260913-Queue-Delay-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "M/M/1 model with mean service time of one minute: at 50 percent utilisation, mean waiting is one minute; at 80 percent, four minutes; at 95 percent, nineteen minutes. These are analytical model results, not operational measurements.",
      "caption": "An M/M/1 illustration with a one-minute mean service time. Mean waiting grows from 1 to 4 to 19 minutes as utilisation rises from 50% to 80% to 95%. Service time is excluded from these waiting values."
    },
    "intro": [
      "A machine finishes each operation faster after an upgrade. Orders still take days to get through the workshop. Both observations can be true: the operation improved, but most of the elapsed time may be spent waiting elsewhere.",
      "This is a useful problem to examine before automating another step. The same question applies to a review inbox, a test bench or a software job queue: how much work is inside the process, how quickly does it leave, and where does its time go?"
    ],
    "sections": [
      {
        "id": "boundary",
        "title": "Draw the boundary around the promised result",
        "paragraphs": [
          "For a fictional inspection service, define entry as the moment a job is accepted into the service and exit as the moment its result is released. Everything between those points counts towards the customer's flow time: waiting, processing, holds and any rework before release.",
          "If the dashboard starts its clock only when the test bench becomes free, it measures a different promise. The reported number can improve while the customer's wait remains unchanged.",
          "Choose one population and boundary before calculating. Do not combine the backlog for all jobs with the completion rate for only one easy category. Count cancelled and rejected jobs consistently, and keep their outcomes visible."
        ]
      },
      {
        "id": "little",
        "title": "Turn work in progress into elapsed time",
        "paragraphs": [
          "Little's Law relates average work in progress L, average throughput λ and average time in the system W: L = λW. MIT's supply-chain material presents the same relationship as inventory = throughput rate × flow time.",
          "Suppose the fictional service has a time-average of 12 accepted but unreleased jobs and completes an average of 4 jobs per hour over a representative stable period. Its average flow time is 12 / 4 = 3 hours. That result includes waiting and processing inside the chosen boundary.",
          "If the bench needs only 10 minutes of active work per job, an operation-time chart cannot explain the whole three hours. Investigate the gaps: batching, approvals, unavailable fixtures, rework or a downstream release queue. Those are candidate explanations to measure, not conclusions from the equation.",
          "Use averages from the same population and a period that represents its operation. A one-off backlog snapshot is not a time-average. A rapidly growing backlog also needs a transient analysis; do not present a steady-state calculation as a reliable completion forecast."
        ],
        "sources": [
          1,
          2
        ]
      },
      {
        "id": "utilisation",
        "title": "A simple model explains the steep part",
        "paragraphs": [
          "Consider an M/M/1 queue: one server, independent Poisson arrivals, independent exponentially distributed service times, first-come-first-served handling and an unlimited waiting room. Assume steady state, with the arrival rate below the service rate. This is an analytical illustration, not a description of every factory.",
          "Let the mean service time be one minute, so the mean service rate µ is 60 jobs per hour. Utilisation ρ is arrival rate divided by service rate. For this model, mean waiting before service is Wq = ρ / (1 - ρ) × mean service time."
        ],
        "table": {
          "headings": [
            "Utilisation and arrivals",
            "Modelled mean waiting before service"
          ],
          "rows": [
            [
              "50%; 30 jobs/h",
              "1 minute"
            ],
            [
              "80%; 48 jobs/h",
              "4 minutes"
            ],
            [
              "95%; 57 jobs/h",
              "19 minutes"
            ]
          ]
        },
        "after": [
          "The service itself still averages one minute in every row. Total time in the system is therefore 2, 5 and 20 minutes respectively. As utilisation approaches 100%, this model has less spare capacity to absorb random bursts and long jobs. Its mean wait grows without bound.",
          "Real processes can have bounded buffers, scheduled arrivals, several servers, breakdowns or very different service-time distributions. The numerical curve changes with those assumptions. The lesson to investigate is the effect of variation and spare capacity, not a universal rule that every process must target 80%."
        ],
        "sources": [
          2
        ]
      },
      {
        "id": "automation",
        "title": "Choose the change against the actual constraint",
        "paragraphs": [
          "In a separate simplified serial process, imagine an upstream operation capable of 60 jobs per hour feeding a downstream operation capable of 40. Assume one job follows the same route, both rates already represent usable capacity, and demand is sufficient. Increasing the first operation to 90 cannot by itself raise the downstream limit above 40. Releasing more work can instead build a queue.",
          "That does not mean the upstream upgrade has no value. It might reduce labour, support another product or provide useful recovery capacity. Those benefits need their own evidence. A local speed increase is simply not enough to establish an end-to-end throughput increase.",
          "A work-in-progress limit can make overload visible and prevent unlimited release into a constrained process. It cannot create missing capacity or erase demand. Record work waiting outside the limit as well, so an apparently cleaner internal queue does not conceal a longer customer wait."
        ]
      },
      {
        "id": "measure",
        "title": "Measure one job all the way through",
        "paragraphs": [
          "Capture accepted, ready-for-service, service-start, service-end and released times against a stable job identifier. Add explicit hold and rework events where needed. For physical equipment, collect observations through approved interfaces; this analysis does not require changing machine interlocks or operating limits."
        ],
        "table": {
          "headings": [
            "Measure",
            "Why it belongs in the review"
          ],
          "rows": [
            [
              "Throughput and time-average work in progress",
              "Connect output rate with how much work remains inside."
            ],
            [
              "Waiting and active service time",
              "Show whether faster execution addresses the dominant delay."
            ],
            [
              "Median and high-percentile flow time",
              "Reveal long waits that an average can hide."
            ],
            [
              "Rework, false rejects and cancellations",
              "Check whether apparent speed comes from shifted work or poorer quality."
            ]
          ]
        },
        "after": [
          "Compare a representative baseline with the changed process, using comparable job mix and operating conditions. Track the queue beyond the improved step. If it simply moves downstream, report that movement.",
          "Little's Law is an accounting relationship, not a causal guarantee. Deleting half the visible backlog does not prove that useful flow time has halved; the throughput or system boundary may also have changed.",
          "A worthwhile automation proposal should name the delay it expects to remove and the end-to-end measure that will show whether it did. “This machine is busier” is a useful observation. “The customer receives the correct result sooner” is the outcome to test."
        ]
      }
    ],
    "sources": [
      {
        "label": "MIT OpenCourseWare: D-Lab Supply Chains, Problem Set 2 - Process Analysis, Fall 2014",
        "url": "https://ocw.mit.edu/courses/15-772j-d-lab-supply-chains-fall-2014/f17bfc0d70c0a4009931352e72ad7716_MIT15_772JF14_ProblemSet2.pdf"
      },
      {
        "label": "Cathy Wu, MIT: Queuing models, Transportation: Foundations and Methods, Spring 2026",
        "url": "https://web.mit.edu/1.041/www/lectures/L8-queuing-models-2026sp.pdf"
      }
    ],
    "note": "Sources checked on 13 September 2026. All service, capacity and queue examples are invented teaching cases. The M/M/1 results are calculated steady-state means under the stated assumptions, not measurements, guarantees or a universal utilisation target."
  },
{
  "category": "Industrial data",
  "date": "2026-09-12",
  "description": "Separating connection health, measurement age and validity in an MQTT dashboard, with a practical stale-data test.",
  "image": {
    "alt": "Illustrative timeline: a sample acquired at 10:00:00 reaches the display at 10:00:08. At 10:00:10 its acquisition age is 10 seconds, although it arrived only 2 seconds ago.",
    "caption": "Illustrative timestamps on a shared clock. A recent delivery does not make an old measurement current.",
    "height": 720,
    "src": "/assets/blog/20260912-MQTT-Data-Age-Rev00.svg",
    "width": 1200
  },
  "intro": [
    "The dashboard says connected. The temperature is a plausible 22.4 °C. Nothing is red. But when was that temperature actually measured?",
    "A connection indicator can answer whether part of the communication path is available. It cannot, by itself, establish that the displayed value describes the present. This article proposes a way to keep those questions separate in an MQTT-based monitoring system. The device, numbers and tests are fictional examples."
  ],
  "note": "Sources checked on 12 September 2026. This is a proposed monitoring design with synthetic timestamps and a fictional 5 s limit, not a validated control or safety function.",
  "sections": [
    {
      "id": "three-questions",
      "paragraphs": [
        "Start with connection status, measurement age and measurement validity. They can disagree without any contradiction. A device can remain online while its acquisition task is stuck. A healthy sample can arrive after a network interruption. An invalid sensor reading can arrive promptly.",
        "For a proposed payload, include a value and unit, acquisition timestamp, quality flag, device identifier, boot identifier and sequence number. Keep reception time at the consumer as a separate field. Agree what each field means before building a green status badge around it.",
        "A sequence number helps detect repetition or gaps, but needs a restart rule. Sequence 12 after sequence 800 could mean a reboot rather than an old packet. Pairing the counter with a boot identifier makes that distinction inspectable. A repeated numeric value alone is not evidence of a fault: the measured quantity may genuinely be steady."
      ],
      "title": "Give the display three separate answers"
    },
    {
      "id": "retained-is-not-fresh",
      "paragraphs": [
        "MQTT retained messages let a broker provide a stored message to a later subscriber, subject to the subscription's retain-handling setting. That is useful for showing the last known observation when a dashboard opens. It does not establish when the physical measurement was acquired.",
        "MQTT Keep Alive concerns the exchange of protocol control packets. A working ping exchange is not proof that the sensor acquisition task is advancing. Likewise, a Will message can signal a lost connection, but its timing depends on connection detection and configured delay.",
        "Keep the last known value visible when it helps diagnosis, but label its age and quality. Do not turn a missing measurement into zero, or reset its age merely because the dashboard has reconnected."
      ],
      "sources": [
        1
      ],
      "title": "Treat retained data as a saved observation"
    },
    {
      "id": "two-clocks",
      "paragraphs": [
        "Suppose a sample is acquired at 10:00:00, received at 10:00:08 and viewed at 10:00:10. With synchronised clocks, acquisition age is 10 s. Time since reception is only 2 s. A fictional rule accepting samples up to 5 s old must therefore reject this sample as current.",
        "That arithmetic assumes the timestamps refer to a comparable clock. If the device clock is ahead, subtracting timestamps can produce a negative age. Treat that as a clock-quality problem; silently clamping it to zero would make uncertain data look fresh.",
        "For elapsed time within one running process, use an appropriate monotonic clock. Web performance timing is one documented example of a clock intended to avoid wall-clock adjustments. It does not synchronise a browser with a remote sensor. Cross-device age still needs a defined time reference and an acceptable clock-error bound."
      ],
      "sources": [
        2
      ],
      "title": "Calculate the age you actually care about"
    },
    {
      "after": [
        "Connection status remains separate in every row. Evaluate age periodically, even when no messages arrive. Otherwise the display can remain current indefinitely after the publisher stops. Use text and an icon or shape as well as colour."
      ],
      "id": "state-policy",
      "paragraphs": [
        "This illustrative monitoring policy uses a 5 s age limit. Choose a real limit from how quickly the process changes and what the display is used for."
      ],
      "table": {
        "headings": [
          "Observed condition",
          "Display and decision"
        ],
        "rows": [
          [
            "No accepted sample since startup",
            "Show unknown; do not supply a default measurement."
          ],
          [
            "Valid sample; trustworthy age from 0 to 5 s",
            "Show the value, unit, age and current status."
          ],
          [
            "Valid sample older than 5 s",
            "Keep it as last known; clearly mark stale."
          ],
          [
            "Bad quality or untrustworthy acquisition time",
            "Mark invalid or age unknown; explain the reason."
          ]
        ]
      },
      "title": "Write a freshness rule before choosing colours"
    },
    {
      "id": "expiry-and-tests",
      "paragraphs": [
        "MQTT 5 Message Expiry Interval can prevent onward delivery of messages whose protocol lifetime has elapsed. It does not define physical acquisition time, and it cannot invalidate a value already copied into your application's display state. Retain an application-level freshness check.",
        "In an isolated test system, pause acquisition while leaving the MQTT client connected. The value should become stale. Then reconnect a dashboard to a retained old sample: it should show the original age, not a fresh-start timer.",
        "Test a device restart, duplicate sequence, delayed older message, implausible future timestamp and invalid-quality reading. Check that an older observation cannot silently replace the current one. Finally, deliver a new valid sample and verify the defined recovery transition.",
        "Record the displayed status and the underlying timestamps for each case. A screenshot of a connected badge proves very little about measurement freshness; an explicit age and quality policy gives the next engineer something concrete to test."
      ],
      "sources": [
        1
      ],
      "title": "Test silence, replay and recovery"
    }
  ],
  "slug": "mqtt-connected-does-not-mean-current",
  "sources": [
    {
      "label": "OASIS: MQTT Version 5.0, OASIS Standard, 7 March 2019; Keep Alive, RETAIN, Will Delay and Message Expiry sections",
      "url": "https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html"
    },
    {
      "label": "W3C: High Resolution Time Level 3, Working Draft, 1 September 2026; monotonic clock and time-origin model",
      "url": "https://www.w3.org/TR/2026/WD-hr-time-3-20260901/"
    }
  ],
  "title": "A connected sensor can still be giving you old data"
},
{
  "category": "Robotics",
  "date": "2026-09-12",
  "description": "A focused way to diagnose ROS 2 QoS mismatches, separate discovery from delivery, and test the actual subscriber.",
  "image": {
    "alt": "ROS 2 reliability compatibility: a best-effort publisher is compatible with a best-effort subscriber but not a reliable subscriber. A reliable publisher is compatible with either. Other QoS policies must also be compatible.",
    "caption": "Reliability compatibility from ROS 2 Humble documentation. This matrix checks one policy; the full QoS profile still matters.",
    "height": 720,
    "src": "/assets/blog/20260912-ROS2-QoS-Rev00.svg",
    "width": 1200
  },
  "intro": [
    "The topic name appears in the ROS graph. The message type looks right. The subscriber's callback never runs. Before rewriting the callback, check whether the publisher and subscriber have agreed on how messages may be delivered.",
    "ROS 2 Quality of Service, or QoS, is part of the interface between nodes. This note uses the Humble documentation and a hypothetical sensor stream. It describes a diagnostic method, not a new test result from my rover project."
  ],
  "note": "Humble documentation checked on 12 September 2026. The test sequence is proposed and was not executed on a ROS 2 runtime for this article. Check the effective settings and supported events in your installation.",
  "sections": [
    {
      "id": "discovery-delivery",
      "paragraphs": [
        "Finding a topic establishes that the graph can report it. It does not prove that a particular subscriber receives samples, runs its callback or uses the result. Write down which of those observations is actually missing.",
        "Inspect the topic's full name, message type and each endpoint's effective QoS profile. The ROS 2 topic-information tool offers verbose endpoint details; compare the running system with the intended configuration. Keep the ROS distribution and middleware implementation in the test record, because defaults and available behaviour may differ.",
        "Also check whether the publisher is producing messages now. A discovered but idle publisher is a different case from an active publisher that cannot match a subscriber. Choose a controlled stream with a sequence field so progress is visible without relying on the payload changing."
      ],
      "sources": [
        2
      ],
      "title": "Separate discovery from delivery"
    },
    {
      "after": [
        "Every other policy affecting compatibility must also pass. For example, changing reliability will not repair an incompatible durability requirement. A single green cell is not an end-to-end communication test."
      ],
      "id": "offered-requested",
      "paragraphs": [
        "ROS 2 uses an offered-versus-requested compatibility model. The publisher offers behaviour; the subscriber requests what it will accept. The settings need to be compatible, which does not always mean identical.",
        "For reliability, a best-effort publisher cannot satisfy a subscriber requesting reliable delivery. A reliable publisher can match a subscriber accepting best effort. Treat the following table as a check of reliability alone."
      ],
      "sources": [
        1
      ],
      "table": {
        "headings": [
          "Publisher offer → subscriber request",
          "Reliability compatible?"
        ],
        "rows": [
          [
            "Best effort → best effort",
            "Yes"
          ],
          [
            "Best effort → reliable",
            "No"
          ],
          [
            "Reliable → best effort",
            "Yes"
          ],
          [
            "Reliable → reliable",
            "Yes"
          ]
        ]
      },
      "title": "Read reliability in the right direction"
    },
    {
      "id": "purpose-before-settings",
      "paragraphs": [
        "A live visualisation may value the newest sensor sample more than recovering every missed sample. ROS 2's sensor-data profile reflects that trade-off with best-effort reliability and a smaller queue. That makes it a candidate for some sensor streams, not a universal setting for every topic.",
        "A retained configuration or map has a different use: a late subscriber may need previously published state. Humble documents transient-local durability for this purpose, with compatible publisher and subscriber settings. A volatile subscriber matched to a transient-local publisher receives new messages, without the same historical-data behaviour.",
        "Write the consumer's requirement first: acceptable age, whether loss is tolerable, whether historical samples are useful, and what happens after a restart. Commands with side effects need their own application semantics. A transport setting cannot decide whether replaying a command is appropriate."
      ],
      "sources": [
        1
      ],
      "title": "Choose the policy from the data's purpose"
    },
    {
      "id": "diagnostic-subscriber",
      "paragraphs": [
        "A command-line echo or frequency tool creates another subscriber. Its behaviour is evidence about that observer, not automatically about the application you are diagnosing. Compare its QoS with the target subscriber before interpreting a successful echo as proof that the application must work.",
        "The Humble topic tutorial notes that reported frequency is the tool's received rate and can be affected by resources and QoS. If the tool sees 20 Hz while the application misses callbacks, inspect the application's own reception and callback timing.",
        "Track acquisition, reception and callback execution separately where possible. Once messages are arriving, investigate executor load, callback duration and queue behaviour. Increasing queue depth without measuring age can hide overload behind a growing backlog."
      ],
      "sources": [
        2
      ],
      "title": "Check the observer as well as the application"
    },
    {
      "id": "controlled-test",
      "paragraphs": [
        "Use a simulation or isolated test namespace with no connection to actuators. Create a known best-effort publisher and a reliable subscriber, keeping the remaining policies compatible. Predict no matching delivery. Then change only the subscriber's reliability to best effort and check that samples arrive.",
        "Repeat with a reliable publisher and each subscriber reliability setting. Record matching events, received sequence numbers and timestamps. The compatibility table predicts which pairs may connect; it does not promise zero loss or bounded latency under every runtime condition.",
        "Next, test late joining and restart behaviour separately from the reliability matrix. Confirm whether historical samples should appear and whether the first usable observation meets the consumer's age requirement. Use incompatible-QoS event callbacks where the selected implementation supports them.",
        "Keep the smallest failing configuration and the corrected one together. The useful result is a demonstrable interface contract: which endpoint offers what, which endpoint accepts it, and what the application actually receives."
      ],
      "sources": [
        1
      ],
      "title": "Make the mismatch reproducible"
    }
  ],
  "slug": "ros2-topic-visible-but-no-messages",
  "sources": [
    {
      "label": "ROS 2 Humble documentation: Quality of Service settings, compatibility tables and QoS events; official source",
      "url": "https://github.com/ros2/ros2_documentation/blob/humble/source/Concepts/Intermediate/About-Quality-of-Service-Settings.rst"
    },
    {
      "label": "ROS 2 Humble documentation: Understanding topics, verbose endpoint information and observer-rate limitations; official source",
      "url": "https://github.com/ros2/ros2_documentation/blob/humble/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.rst"
    }
  ],
  "title": "A ROS 2 topic can exist and still deliver nothing"
},
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
