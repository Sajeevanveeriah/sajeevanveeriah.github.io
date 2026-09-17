import type { BlogPost } from "./blog";

export const designPosts: BlogPost[] = [
  {
    "slug": "the-second-life-of-a-product",
    "title": "The second life of a product",
    "date": "2026-09-17",
    "description": "What a product reveals about its design when someone needs to open it, find a part and put it back into service.",
    "category": "Design and ownership",
    "intro": [
      "A product has a second audience: the person who opens it after something stops working. They may never meet its designers. What they find inside is the conversation.",
      "A visible screw says where to begin. A connector with room for fingers makes removal less uncertain. A part number gives the search a name. None of these details is likely to lead a launch presentation, but each can matter enormously to someone trying to keep an otherwise useful object."
    ],
    "sections": [
      {
        "id": "opening",
        "title": "An invitation to open it",
        "paragraphs": [
          "Consider two small electronic products with the same failed charging socket. In one, the socket sits on a replaceable board reached through a service cover. In the other, reaching it requires disturbing several unrelated assemblies. The symptom is identical. The repair is a different job.",
          "This is a design comparison, not an instruction to open a particular device. Access has to suit the hazards and the intended repairer. A battery, sealed enclosure or mains supply can impose requirements that a neat exploded drawing doesn't explain.",
          "Still, the route to a likely repair deserves a place in the original design. If a heavily used connector is also difficult to reach, the design has coupled a predictable wear point to an expensive intervention. That consequence exists whether or not the sales page mentions it.",
          "Framework offered a concrete example in its July 2021 account of the original Framework Laptop: visible captive fasteners, labelled modules, QR codes linking to information or parts, and published repair guides. Those were specific choices about access and identification. The dated example shows how repair can influence the physical layout from the start."
        ],
        "sources": [
          1
        ]
      },
      {
        "id": "finding",
        "title": "The part has to exist somewhere",
        "paragraphs": [
          "Opening the case only gets the repairer to the next question. What is this component, which replacement fits, and can it actually be obtained?",
          "A modular assembly with no available replacement can leave its owner in almost the same position as a sealed one. Documentation without revision details can send someone towards a part that looks correct but has a different connector. A low-cost component can become an expensive repair once diagnosis, delivery and reassembly are included.",
          "Repairability therefore extends into catalogues, support decisions and the life of the business. The mechanical engineer can make a board removable. Someone still needs to keep its identity understandable after the product has been revised.",
          "The handover between those responsibilities is where a repair can stall:"
        ],
        "table": {
          "headings": [
            "What the repairer has",
            "What they still need"
          ],
          "rows": [
            [
              "Access to the failed assembly",
              "A safe removal and reassembly procedure."
            ],
            [
              "A readable part number",
              "Compatibility information for the exact revision."
            ],
            [
              "A replacement part",
              "Any required setup and a way to check the result."
            ]
          ]
        }
      },
      {
        "id": "returning",
        "title": "Back on the desk",
        "paragraphs": [
          "The end of a repair is ordinary. The cover fits again. The cable sits where it belongs. The product returns to its usual place and does its usual job. That unremarkable outcome is the point.",
          "Design reviews can make room for this future owner without turning every object into a kit. Take one plausible service task and follow it all the way through: the first symptom, the diagnosis, the replacement and the check after reassembly. Notice where the person would need to guess or disturb something that was still working.",
          "There will be compromises. Extra connectors take space. Service covers need fastening and sealing. A replaceable module may cost more than an integrated assembly. Those costs belong in the decision, alongside the labour and waste that a difficult repair can create.",
          "A well-resolved enclosure can be beautiful on its first day and understandable several years later. The person holding the screwdriver should be able to see that somebody thought about their visit."
        ]
      }
    ],
    "sources": [
      {
        "label": "Nirav Patel, Framework: Preparing to Ship and Respecting your Right to Repair, 9 July 2021",
        "url": "https://frame.work/blog/preparing-to-ship-and-respecting-your-right-to-repair"
      }
    ]
  },
  {
    "slug": "in-praise-of-the-volume-knob",
    "title": "In praise of the volume knob",
    "date": "2026-09-17",
    "description": "A small control raises a larger design question: how much attention should an everyday adjustment demand?",
    "category": "Everyday interfaces",
    "intro": [
      "Someone starts speaking. The music is too loud. A hand reaches for the volume knob and turns it down.",
      "There is very little ceremony in that interaction. The control stays in one place, the movement has an obvious purpose, and the sound tells the person what happened. It is a useful starting point for thinking about interfaces."
    ],
    "sections": [
      {
        "id": "attention",
        "title": "The task is elsewhere",
        "paragraphs": [
          "The person adjusting the volume is usually trying to do something beyond operating the sound system. They want to hear a conversation, concentrate on another task or make the room more comfortable. The adjustment should take only the attention it needs.",
          "Now imagine that adjustment behind a menu. The user has to find the right screen, identify the control and make the change. The product may have gained a cleaner surface while asking for a longer interruption.",
          "That is the interesting design question. How much of the user's attention does this small action deserve? Counting the controls on the front panel won't answer it.",
          "A dedicated control earns its space when its purpose is stable and its use is frequent. A screen earns its space when people need changing labels, detailed information or choices that would be awkward to represent physically. A useful product can give each a job."
        ]
      },
      {
        "id": "feel",
        "title": "What the hand can tell",
        "paragraphs": [
          "A knob has properties beyond its appearance. Its diameter, resistance, grip and position affect how it can be operated. A detent can mark an increment. An end stop can indicate a limit. A raised button can be distinguished from the surface around it.",
          "Those properties need to agree with the behaviour. A dial with an absolute position becomes confusing if software changes the setting while the pointer stays still. An endless encoder avoids that particular mismatch but needs another way to show the value. Even a familiar control involves a choice about what the user should be able to infer.",
          "Physical controls also have costs. A stiff dial can be difficult to turn. Closely packed buttons can be hard to distinguish. A press-and-hold shortcut may remain undiscovered. Replacing glass with plastic doesn't settle accessibility.",
          "The worthwhile comparison is between complete interactions, including the feedback and the person using them."
        ],
        "table": {
          "headings": [
            "Adjustment",
            "Design question"
          ],
          "rows": [
            [
              "Turn something up or down",
              "Can the person make a small change and recognise the result?"
            ],
            [
              "Choose one of several modes",
              "Can they identify both the available choices and the current mode?"
            ],
            [
              "Enter an exact value",
              "Can they reach the required value without repeated fine movements?"
            ]
          ]
        }
      },
      {
        "id": "screen",
        "title": "Give the screen the same courtesy",
        "paragraphs": [
          "A digital control can respect those needs too. Keep frequently used actions in a stable place. Give them enough room. Make the current setting readable. Let people enter a value when dragging to it would be awkward.",
          "W3C's explanation of WCAG 2.2 target sizing describes how size and spacing help people activate a control without hitting its neighbour. Its guidance on dragging calls for a single-pointer alternative, subject to the criterion's exceptions. These are web accessibility requirements and explanations, not dimensions for a physical control panel.",
          "The underlying design lesson travels further: an interface should offer a workable action to the person in front of it. A slider can coexist with a numeric field. A screen can coexist with a dial. There is no need to make every task use the same gesture."
        ],
        "sources": [
          1,
          2
        ]
      },
      {
        "id": "ordinary",
        "title": "A little less negotiation",
        "paragraphs": [
          "Minimalism is easy to judge in a photograph. Living with a product adds movement, distraction, different hands and repeated use. An uncluttered surface is pleasant; so is being able to change one setting without searching.",
          "The volume knob is worth considering because it makes that distinction tangible. It gives a recurring action a permanent home.",
          "When a product gets this right, the adjustment takes its place in the background. The conversation continues."
        ]
      }
    ],
    "sources": [
      {
        "label": "W3C: Understanding WCAG 2.2 SC 2.5.8, Target Size (Minimum)",
        "url": "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
      },
      {
        "label": "W3C: Understanding WCAG 2.2 SC 2.5.7, Dragging Movements, updated 10 August 2026",
        "url": "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
      }
    ]
  }
];
