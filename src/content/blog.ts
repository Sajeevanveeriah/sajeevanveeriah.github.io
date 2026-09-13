import { careerPosts } from "./career-posts";
import { engineeringPosts } from "./blog-posts";

export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
  image?: BlogPost["image"];
  table?: { headings: [string, string]; rows: [string, string][] };
  after?: string[];
  steps?: [string, string][];
  sources?: number[];
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
