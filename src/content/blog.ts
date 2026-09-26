import { developmentPosts } from "./development-posts";
import { designPosts } from "./design-posts";
import { careerPosts } from "./career-posts";
import { engineeringPosts } from "./blog-posts";
import { caseStudyPosts } from "./case-study-posts";

export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
  image?: BlogPost["image"];
  table?: { headings: [string, string]; rows: [string, string][] };
  after?: string[];
  steps?: [string, string][];
  sources?: number[];
  links?: { label: string; url: string }[];
};
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  image?: { src: string; alt: string; caption: string; width: number; height: number };
  intro: string[];
  sections: BlogSection[];
  sources: { label: string; url: string }[];
  note?: string;
};

// Add a post here to publish its page, index entry and sitemap URL together.
export const posts: BlogPost[] = [
{
  "slug": "size-the-thermistor-divider-for-the-heat",
  "title": "A thermistor divider only works across the range it was sized for",
  "date": "2026-09-26",
  "category": "Sensing and signal processing",
  "description": "Why a 100 kΩ NTC paired with a 100 kΩ resistor leaves the ESP32's suggested ADC range near 106 °C, and how I would size the divider for a hot process.",
  "image": {
    "src": "/assets/blog/20260926-Thermistor-Divider-Rev00.svg",
    "width": 1200,
    "height": 720,
    "alt": "Calculated divider output against temperature for a 100 kilohm NTC thermistor with B of 4267 kelvin on a 3.3 volt supply. With a 100 kilohm fixed resistor the output stays inside the ESP32 suggested range of 150 to 2450 millivolts from about 5 to 106 degrees Celsius. With 4.7 kilohms it stays inside from about 74 to 247 degrees. With 1 kilohm it stays inside from about 124 to 368 degrees. A marker shows the 104GT-2 listed use limit of 300 degrees.",
    "caption": "Calculated from the B-parameter model with B = 4267 K and 100 kΩ at 25 °C. The shaded band is the ESP32 suggested input range at 11 dB attenuation. These are not measurements."
  },
  "intro": [
    "One of my unfinished projects is an ESP32 controller for fusing recycled plastic strips with a heating element. The element could reach about 350 °C, and I never had usable temperature readings from its NTC thermistor. I have not confirmed the cause, so this is not a repair report.",
    "Looking back at the design, the first question I would ask is not about the firmware. It is whether the thermistor circuit could represent the temperatures the heater reaches at all."
  ],
  "sections": [
    {
      "id": "matched-at-room-temperature",
      "title": "A divider matched at 25 °C",
      "paragraphs": [
        "A common starting point pairs a 100 kΩ NTC thermistor with a 100 kΩ fixed resistor. From a 3.3 V supply that gives 1.65 V at 25 °C, right in the middle of the range. For a room-temperature sensor it is a sensible choice.",
        "As the thermistor heats, its resistance falls quickly. Using the B-parameter model with B = 4267 K, it is about 5.6 kΩ at 100 °C and about 212 Ω at 250 °C. With the thermistor on the low side of the divider, the output falls to 176 mV at 100 °C and 7 mV at 250 °C.",
        "Espressif's ESP32 documentation lists 150 to 2450 mV as the suggested input range at 11 dB attenuation and states that the most accurate results are obtained within it. This divider leaves that range at about 106 °C."
      ],
      "sources": [
        1
      ],
      "table": {
        "headings": [
          "Temperature",
          "Calculated output and change per degree"
        ],
        "rows": [
          [
            "25 °C",
            "1650 mV, falling 39.5 mV per °C"
          ],
          [
            "100 °C",
            "176 mV, falling 5.0 mV per °C"
          ],
          [
            "150 °C",
            "47 mV, falling 1.1 mV per °C"
          ],
          [
            "250 °C",
            "7 mV, falling 0.11 mV per °C"
          ]
        ]
      },
      "after": [
        "A 12-bit converter spanning 2.45 V resolves about 0.6 mV per count. At 250 °C a one-degree change moves this divider by less than a fifth of a count, before any noise is considered."
      ]
    },
    {
      "id": "size-for-the-process",
      "title": "Size the divider for the temperatures that matter",
      "paragraphs": [
        "The divider output changes fastest where the thermistor's resistance is close to the fixed resistor. Choosing the fixed resistor near the thermistor's resistance in the control band moves the useful window to where the process operates.",
        "With the same thermistor and supply, a 4.7 kΩ resistor keeps the calculated output inside the suggested range from about 74 °C to about 247 °C. A 1 kΩ resistor moves the window to about 124 °C to 368 °C. At 250 °C the 1 kΩ divider changes by 7.4 mV per °C, compared with 0.11 mV per °C for the 100 kΩ divider."
      ],
      "table": {
        "headings": [
          "Fixed resistor",
          "Calculated temperatures inside 150 to 2450 mV"
        ],
        "rows": [
          [
            "100 kΩ",
            "About 5 to 106 °C"
          ],
          [
            "4.7 kΩ",
            "About 74 to 247 °C"
          ],
          [
            "1 kΩ",
            "About 124 to 368 °C"
          ]
        ]
      },
      "after": [
        "A calculated window above 300 °C does not extend what the sensor itself is rated for. The rating is covered below."
      ]
    },
    {
      "id": "self-heating",
      "title": "Account for the current through the thermistor",
      "paragraphs": [
        "A smaller fixed resistor passes more current. The power dissipated in the thermistor is greatest when its resistance equals the fixed resistor, where it is V² / (4R). From 3.3 V that is 2.72 mW with a 1 kΩ resistor, at about 167 °C in this model, and 0.58 mW with 4.7 kΩ.",
        "Whether that shifts the reading depends on the thermistor's dissipation constant and how it is mounted and coupled to the heated part. I would check both against the datasheet and the installation rather than assume the effect is negligible. Powering the divider only while sampling is another option worth evaluating."
      ]
    },
    {
      "id": "sensor-rating",
      "title": "Check the sensor before the arithmetic",
      "paragraphs": [
        "A distributor listing for the widely used ATC Semitec 104GT-2 glass thermistor gives 100 kΩ, a B value of 4267 K, 3% tolerance and suitability for use up to 300 °C. I do not have a record of the exact thermistor fitted to my controller. If it was a part like this, a heater that reaches about 350 °C can take the sensor beyond its listed range.",
        "A single B value is also an approximation away from the temperatures it was characterised at. For a real controller I would use the manufacturer's resistance-temperature data across the operating range and compare readings with a reference thermometer before relying on them."
      ],
      "sources": [
        2
      ]
    },
    {
      "id": "esp32-details",
      "title": "ESP32 details that affect the reading",
      "paragraphs": [
        "The same Espressif page notes that the ADC reference voltage varies between chips, from 1000 mV to 1200 mV around the 1100 mV design value, and provides calibration APIs to correct for it. It also describes the ADC as sensitive to noise and suggests a bypass capacitor, such as 100 nF, at the input pad and multisampling.",
        "ADC2 is shared with Wi-Fi, so ADC2 readings can be blocked while Wi-Fi is active. For a connected controller I would put the thermistor on an ADC1 pin."
      ],
      "sources": [
        1
      ]
    },
    {
      "id": "protection",
      "title": "Do not let the reading be the only protection",
      "paragraphs": [
        "An open, shorted or detached thermistor can still produce a number. In firmware I would treat readings at either end of the valid window as faults and switch the heater off, rather than clamping them to a plausible temperature.",
        "My controller also showed why the output side needs the same scrutiny: the element was reported to stay powered while the displayed PWM value was zero. A displayed control output is an instruction, not evidence that the element is off. For a heater that can exceed its sensor's rating, I would want an independent over-temperature cut-out that does not rely on the microcontroller, specified and rated for that element."
      ]
    }
  ],
  "sources": [
    {
      "label": "Espressif: ESP-IDF Programming Guide v4.4, Analog to Digital Converter (ADC), ESP32 (2021 documentation release)",
      "url": "https://docs.espressif.com/projects/esp-idf/en/v4.4/esp32/api-reference/peripherals/adc.html"
    },
    {
      "label": "Rapid Electronics: ATC Semitec 104GT-2 GT thermistor 100k 3% product listing (undated; product marked discontinued)",
      "url": "https://www.rapidonline.com/atc-semitec-104gt-2-gt-thermistor-100k-3-61-0452"
    }
  ],
  "note": "Sources checked on 26 September 2026. Divider values are calculated from the B-parameter model with B = 4267 K and 100 kΩ at 25 °C. They are not measurements from my controller, and this is not a validated heater design or a completed repair."
},
{
  "slug": "test-a-robot-when-the-data-stops",
  "title": "Test the robot when the data stops",
  "date": "2026-09-23",
  "category": "Robotics",
  "description": "A practical ROS 2 fault-injection plan for stale observations, delayed commands and controlled recovery, with an illustrative stopping-distance calculation.",
  "intro": [
    "A robot completes its route. The map looks sensible, the controller tracks the path and the demonstration ends where it should. What happens if the next sensor update never arrives?",
    "That is the test I would add before spending another afternoon tuning the happy path. A useful autonomy test should make the information unreliable on purpose, then show what the machine does with the uncertainty."
  ],
  "sections": [
    {
      "id": "define-the-fault",
      "title": "Give each failure a different test",
      "paragraphs": [
        "A silent publisher, a frozen measurement and a delayed callback are different faults. The first stops producing messages. The second can keep producing apparently healthy traffic while repeating an old observation. The third can leave good data waiting while the application is busy.",
        "For a proposed ROS 2 simulation, I would inject these faults separately and retain the original acquisition time, message sequence, receive time and time of use. A timestamp added by a relay should not silently replace the time the sensor actually observed the scene."
      ],
      "table": {
        "headings": [
          "Injected fault",
          "Evidence to inspect"
        ],
        "rows": [
          [
            "Stop the sensor publisher",
            "Time from the last valid observation to the commanded response"
          ],
          [
            "Replay old observations at the normal rate",
            "Whether acquisition age or sequence checks detect the replay"
          ],
          [
            "Delay processing under CPU load",
            "Age of the observation when the controller actually uses it"
          ],
          [
            "Interrupt the command stream",
            "Whether the drive-side timeout produces the specified response"
          ],
          [
            "Restore data after the fault",
            "Whether motion stays inhibited until the recovery conditions are met"
          ]
        ]
      },
      "after": [
        "These are proposed test cases, not results from a robot I have validated. The response and acceptable delay must be specified for the particular machine."
      ]
    },
    {
      "id": "timing-budget",
      "title": "Turn delay into distance",
      "paragraphs": [
        "Consider an illustrative mobile robot travelling at 0.8 m/s. Assume it continues at that speed for 0.25 s after a fault, then decelerates uniformly at 1.0 m/s² on a level surface.",
        "During the delay it travels v × t = 0.8 × 0.25 = 0.20 m. The ideal braking distance is v² / (2a) = 0.8² / (2 × 1.0) = 0.32 m. Total travel from fault onset to rest is therefore 0.52 m under these assumptions.",
        "If the total delay grows to 0.50 s, the travel becomes 0.40 + 0.32 = 0.72 m. An extra 250 ms has added 200 mm before the robot stops."
      ],
      "table": {
        "headings": [
          "Assumed total delay",
          "Calculated travel to rest"
        ],
        "rows": [
          [
            "100 ms",
            "0.40 m"
          ],
          [
            "250 ms",
            "0.52 m"
          ],
          [
            "500 ms",
            "0.72 m"
          ]
        ]
      },
      "after": [
        "The delay budget must include fault detection, scheduling, transport and actuator response without double-counting overlapping stages. This calculation excludes wheel slip, slopes, braking variation, footprint and obstacle motion. It is an illustration of timing consequences, not a protective separation distance or a validated safety limit."
      ]
    },
    {
      "id": "qos-boundary",
      "title": "A middleware event is only part of the evidence",
      "paragraphs": [
        "The ROS 2 design document for deadline, liveliness and lifespan distinguishes message timing, publisher liveliness and message expiry. Its deadline discussion explicitly places monitoring at the middleware abstraction layer, rather than at completion of the application's work.",
        "That boundary matters when designing a test: a message reaching middleware does not demonstrate that the controller used a fresh observation in time. I would measure the application path as well, and check the actual behaviour of the chosen ROS distribution and middleware implementation."
      ],
      "sources": [
        1
      ],
      "after": [
        "Use a consistent clock basis when comparing timestamps. In simulation, record whether time is simulated or wall time, and define what a pause or clock reset means for the watchdog. For elapsed-time watchdogs, a clock that can jump needs explicit handling."
      ]
    },
    {
      "id": "command-path",
      "title": "Trace the command all the way to the drive",
      "paragraphs": [
        "Nav2's Humble Collision Monitor documentation describes a node that filters controller velocity commands using sensor-defined zones. Depending on the triggered behaviour, it can reduce or stop the commanded motion. The documentation also states that it does not provide hard real-time safety certification.",
        "For a proposed integration, I would check every command source, including teleoperation and recovery behaviours, against the intended final command path. Then I would verify what the drive does if that path itself stops updating. A zero-velocity message is an instruction; measured motion is the evidence of the response."
      ],
      "sources": [
        2
      ],
      "after": [
        "Software collision monitoring does not establish the safety rating of the whole machine. Any required safety functions need their own system design and validation. Start fault injection in simulation; physical trials need a controlled test arrangement appropriate to the robot."
      ]
    },
    {
      "id": "recovery",
      "title": "Make recovery an explicit transition",
      "paragraphs": [
        "A returning data stream should not automatically count as permission to move. In a proposed state machine, I would distinguish normal operation, fault response, motion inhibited and ready for a deliberate restart.",
        "Specify what clears the fault: for example, valid observations over a defined interval, acceptable localisation, a healthy command path and a fresh task command. The required checks and any operator acknowledgement depend on the application; a fixed number of good messages is not a universal rule.",
        "Test the awkward sequence too: stop the stream, let a command queue build, restore the connection, then inspect whether old commands are discarded or executed. Include process restarts and clock resets as separate cases."
      ]
    },
    {
      "id": "acceptance",
      "title": "Keep a fault-to-response record",
      "paragraphs": [
        "For each run, retain the software versions, middleware, configuration, injected fault and load conditions. Record fault onset, detection, command change and measured motion on a common timeline. Keep failed runs alongside successful ones.",
        "Before running the experiment, define maximum permitted response time, the required motion state and the conditions for resuming. In simulation, distinguish commanded velocity from simulated physical velocity. On hardware, use suitable independent measurement where the claim requires it.",
        "The useful question at the end is specific: when this input failed under these conditions, did the robot enter the required state within the agreed bound, and did it remain there until recovery was authorised?"
      ]
    }
  ],
  "sources": [
    {
      "label": "ROS 2 design: Deadline, Liveliness, and Lifespan, Nick Burek, September 2019 (design rationale)",
      "url": "https://design.ros2.org/articles/qos_deadline_liveliness_lifespan.html"
    },
    {
      "label": "Nav2 Humble API documentation: Collision Monitor (undated)",
      "url": "https://api.nav2.org/nav2-humble/html/md_nav2_collision_monitor_README.html"
    }
  ],
  "note": "Sources checked on 23 September 2026. This is a proposed verification approach with illustrative calculations, not a report of completed testing or a safety certification.",
  "image": {
    "src": "/assets/blog/20260923-Robot-Fault-Response-Rev00.svg",
    "width": 1200,
    "height": 720,
    "alt": "Illustrative travel at 0.8 metres per second with constant braking deceleration of 1 metre per second squared: 100, 250 and 500 milliseconds of delay give total travel of 0.40, 0.52 and 0.72 metres. Braking contributes 0.32 metres in every case.",
    "caption": "Calculated travel during the assumed delay plus ideal braking distance. Values and assumptions are explained below; these are not safety limits."
  }
},
  ...developmentPosts,
  ...caseStudyPosts,
  ...designPosts,
  ...careerPosts,
  ...engineeringPosts,
  {
    "slug": "ai-without-the-jargon",
    "title": "AI without the jargon: a practical starting point",
    "date": "2026-09-10",
    "description": "A plain-English guide to trying AI, protecting your information and checking the answers.",
    "intro": [
      "You don't need to be good with computers to try AI. You need somewhere to start, a clear idea of what you want help with, and a few habits that protect your information.",
      "I want to make that first step easier. There are useful things these tools can do, but understanding their limits matters just as much."
    ],
    "sections": [
      {
        "id": "what-is-ai",
        "title": "What is AI actually doing?",
        "paragraphs": [
          "AI is a broad name for computer systems that perform tasks such as recognising patterns or generating content. This article is about chat tools that respond to everyday language.",
          "You type a question or request, and the tool generates a response using patterns it has learnt. Some tools can also search the web or work with files when those features are available.",
          "The response can sound convincing and still be wrong. A confident answer is not proof that something has been checked."
        ],
        "sources": [
          1
        ]
      },
      {
        "id": "start-small",
        "title": "Start with one ordinary task",
        "paragraphs": [
          "Try something small that you can judge for yourself:"
        ],
        "table": {
          "headings": [
            "You want help with",
            "You could ask"
          ],
          "rows": [
            [
              "Writing a message",
              "“Make this clearer and friendlier. Keep my meaning.”"
            ],
            [
              "Understanding a term",
              "“Explain this in everyday language, with one example.”"
            ],
            [
              "Organising your week",
              "“Turn this list into a realistic plan with breaks.”"
            ],
            [
              "Learning something",
              "“Explain one step at a time, then check my understanding.”"
            ]
          ]
        },
        "after": [
          "You don't need a special formula. Say what you need, give relevant background, and explain how you want the answer.",
          "For example: “Help me write a polite message asking to change an appointment. Keep it under 80 words. Don't invent a reason.”",
          "If the answer is confusing, say: “Use simpler words.” If it misses the point, explain what it missed. Read the final version before using it."
        ]
      },
      {
        "id": "personal-information",
        "title": "Before sharing anything personal",
        "paragraphs": [
          "My suggested starting rule is to use made-up examples or remove identifying details.",
          "Leave out passwords, security codes, bank details, identity documents and confidential work information. Think about other people's privacy too.",
          "Instead of uploading a whole bill, type the part you need explained and remove names, addresses and account numbers. Removing a name alone may not be enough if the remaining details identify someone.",
          "At work, check which tools your organisation permits before sharing work material."
        ],
        "sources": [
          2
        ]
      },
      {
        "id": "privacy-settings",
        "title": "Privacy settings: four different questions",
        "paragraphs": [
          "“Private” can mean several things. Check these separately:"
        ],
        "table": {
          "headings": [
            "Setting",
            "What to find out"
          ],
          "rows": [
            [
              "Chat history",
              "Will the conversation stay in your account?"
            ],
            [
              "Memory or personalisation",
              "Can information from it affect later answers?"
            ],
            [
              "Model training",
              "Can the provider use it to improve its AI?"
            ],
            [
              "Connected apps",
              "Can another service receive information or access your files?"
            ]
          ]
        },
        "after": [
          "Switching off one setting does not necessarily switch off the others. Avoid treating any single switch as a promise that nothing is stored.",
          "For a concrete example, OpenAI's current instructions for signed-in ChatGPT on the web are: open your profile, choose Settings, then Data Controls, and switch off “Improve the model for everyone” if you don't want new conversations used for training. Chats can still remain in your history.",
          "ChatGPT's Temporary Chat is another option. While a chat remains temporary, it is not used for training. OpenAI says a copy may still be kept for up to 30 days for safety. Saving it changes it into a regular chat with your account's settings.",
          "Other services have different controls. Check the provider's current help page, especially before uploading files or connecting an account."
        ],
        "sources": [
          3,
          4
        ]
      },
      {
        "id": "check-the-answer",
        "title": "Check the answer before acting",
        "paragraphs": [
          "For a draft message, check that it says what you mean and hasn't added facts.",
          "For factual questions, ask for sources, open them, and check that they support the answer. If it explains a government process, compare it with the agency's own website.",
          "For decisions about health, money, legal matters or physical safety, get qualified advice rather than relying on the chat alone.",
          "My suggested routine is:"
        ],
        "steps": [
          [
            "Ask",
            "Give it one clear task."
          ],
          [
            "Protect",
            "Share only what the task needs."
          ],
          [
            "Check",
            "Verify the important details."
          ],
          [
            "Decide",
            "Make the final choice yourself."
          ]
        ],
        "sources": [
          2
        ]
      },
      {
        "id": "take-your-time",
        "title": "You can take your time",
        "paragraphs": [
          "You don't have to connect your email, upload your documents or automate your life to get started.",
          "Try one small task. Keep the useful parts, question anything doubtful, and stop if you're uncomfortable. My aim is to help people make informed choices about these tools, at their own pace."
        ]
      }
    ],
    "sources": [
      {
        "label": "NIST: Generative Artificial Intelligence Profile",
        "url": "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
      },
      {
        "label": "OVIC: Before you rely on AI",
        "url": "https://ovic.vic.gov.au/privacy/for-the-public/before-you-rely-on-ai-what-to-know/"
      },
      {
        "label": "OpenAI: Data Controls FAQ",
        "url": "https://help.openai.com/en/articles/7730893-data-controls-faq"
      },
      {
        "label": "OpenAI: Temporary Chat FAQ",
        "url": "https://help.openai.com/en/articles/8914046-temporary-chat-faq"
      }
    ],
    "note": "Provider settings checked on 10 September 2026. They may change."
  }
];

export function publishedPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Melbourne",
  }).format(new Date(date + "T00:00:00Z"));
}

export function readingMinutes(post: BlogPost) {
  const words = [...post.intro, ...post.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.after ?? []), ...(section.table?.rows.flat() ?? []), ...(section.steps?.flat() ?? [])])].join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Reader-facing topics. Post categories stay descriptive; topics keep the filter short. */
export const blogTopics = ["Case studies", "Robotics and embedded", "AI and software", "Design and careers"] as const;
export type BlogTopic = (typeof blogTopics)[number];
const topicByCategory: Record<string, BlogTopic> = {
  "Engineering case study": "Case studies",
  "Electronics / embedded systems / instrumentation": "Case studies",
  "Robotics / mechatronics / design study": "Case studies",
  "Robotics": "Robotics and embedded",
  "Embedded systems": "Robotics and embedded",
  "Sensing and signal processing": "Robotics and embedded",
  "Machine vision": "Robotics and embedded",
  "Industrial data": "Robotics and embedded",
  "Design and ownership": "Design and careers",
  "Everyday interfaces": "Design and careers",
  "Engineering and work": "Design and careers",
};
export function postCategory(post: BlogPost) {
  return post.category ?? "Everyday AI";
}
export function postTopic(post: BlogPost): BlogTopic {
  return topicByCategory[postCategory(post)] ?? "AI and software";
}
