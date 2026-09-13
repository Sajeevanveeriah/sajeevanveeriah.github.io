import type { BlogPost } from "./blog";

export const careerPosts: BlogPost[] = [
  {
    "category": "Engineering and work",
    "date": "2026-09-13",
    "description": "Years in a role can tell us something. They cannot tell us everything. A case for assessing capability, supporting graduates and rewarding people who keep learning.",
    "image": {
      "alt": "The experience trap: an applicant needs experience to get a role, but needs a role to gain experience. A paid opportunity with supervision provides a route out.",
      "caption": "A conceptual hiring loop, with a practical route out: assess capability and provide supervised, paid work.",
      "height": 720,
      "src": "/assets/blog/20260913-Experience-Trap-Rev00.svg",
      "width": 1200
    },
    "intro": [
      "Two years. Three years. Five years. Eight years. A job advertisement can make those numbers look like a precise measure of competence. I want employers to explain what they actually mean.",
      "Which decisions must this person make independently? What must they already know? What could they learn with a capable colleague and a reasonable induction? If those questions have no clear answers, the number may be doing the thinking that the hiring process should have done.",
      "My concern is the opportunity we lose when time served becomes the default test of ability. A person can have useful, current skills and still be rejected before anyone examines their work."
    ],
    "note": "Opinion by Sajeevan (Saj) Veeriah. Sources checked on 13 September 2026. Historical survey and working-paper findings are labelled by period and version; they do not establish causes across the whole labour market. Diagrams are conceptual proposals, not measured hiring outcomes.",
    "sections": [
      {
        "id": "what-years-measure",
        "paragraphs": [
          "Experience can build judgement. Someone who has investigated a recurring fault, recovered a failed commissioning job or maintained a system through years of changes may recognise trouble that a newcomer has never seen. That is valuable expertise.",
          "But duration alone does not reveal how much someone learnt, how varied the work was or whether their methods still hold up. Familiarity with one software package is useful for that package. It does not automatically establish the ability to solve an unfamiliar problem.",
          "A requirement for two to eight years of experience is not a description of a generation. People with that experience can be young, and graduates can be older or changing careers. Blaming an age group repeats the same mistake: judging capability through a proxy.",
          "I would ask every candidate, including the most senior: what have you learnt recently, what did you change because of it, and how did you check that the change helped?"
        ],
        "title": "What does another year actually prove?"
      },
      {
        "id": "graduate-loop",
        "paragraphs": [
          "The experience loop is easy to describe and difficult to escape. You need a role to gain experience. You need experience to get the role. University projects, independent builds and research may demonstrate real ability, yet a calendar-based filter can discard them before the technical conversation begins.",
          "There is evidence that the transition deserves attention. Australia's 2024 Graduate Outcomes Survey, published in September 2025, reported that 74.0% of domestic undergraduates available for full-time work were in full-time employment, down from 79.0% in 2023. The survey approaches graduates approximately four to six months after completion.",
          "Those figures describe a particular cohort and period. They do not establish that hiring filters caused the decline, and they are not a measure of the whole economy. They do show why a degree should not be treated as the end of the discussion about opportunity.",
          "When employers all expect somebody else to train the next person, who is supposed to create the experienced workforce they want to hire? My concern is the productive work, confidence and development that can be lost while capable people wait for a first chance."
        ],
        "sources": [
          1
        ],
        "title": "The entry route cannot require an earlier entry"
      },
      {
        "id": "ai-and-learning",
        "paragraphs": [
          "Documentation, open-source projects, simulation tools and language models give a motivated learner more ways to investigate a problem. A newcomer may find a useful method that an established team has not tried. The team should be willing to test it.",
          "There is relevant evidence, although it is narrower than a claim that AI makes experience obsolete. The 2023 NBER working-paper version of Generative AI at Work studied 5,179 customer-support agents. It reported a 14% average increase in issues resolved per hour with AI assistance, including a 34% improvement for novice and lower-skilled workers.",
          "That is a result from customer support, not a guarantee for engineering, medicine or every office job. The authors also suggested that the tool helped distribute the practices of more capable workers. Part of the benefit depended on existing expertise becoming easier to access.",
          "Finding an answer is only part of doing the work. Can the person explain it, test it and recognise when it is unsafe or wrong? A language model can help someone learn a control concept. It cannot grant competence to approve a safety function.",
          "Hiring should account for how people learn with the tools available now. The assessment must also show whether they can verify the result."
        ],
        "sources": [
          2
        ],
        "title": "AI changes the learning curve, with limits"
      },
      {
        "id": "protecting-status",
        "paragraphs": [
          "The behaviour I object to is dismissing a proposal because of who suggested it, or defending a process solely because it is familiar. That can happen at any age or level of seniority.",
          "A junior colleague suggesting an improvement should receive a technical response. What problem does it solve? What evidence supports it? What could it break? What would a small, reversible trial cost? Those questions protect the organisation while giving the idea a fair hearing.",
          "The experienced colleague who asks those questions is contributing to growth. The colleague who refuses to discuss the idea because the newcomer has not been there long enough is obstructing it.",
          "The same standard applies to qualifications. A doctorate is not a promise of a commercial invention. Research can contribute through careful measurement, replication or a result that rules out a tempting approach. Equally, a title should never make its holder exempt from explaining their work.",
          "It would be inaccurate to say innovation has stopped. My argument is that organisations can make it harder than necessary for useful ideas to be heard, tested and adopted."
        ],
        "title": "When expertise becomes protection for status"
      },
      {
        "id": "appearance",
        "paragraphs": [
          "Clothing matters when it affects safety, hygiene or a clearly defined requirement of the job. Beyond that, employers should be able to explain why an appearance preference deserves weight in a hiring decision.",
          "A polished interview can conceal weak reasoning. A nervous presentation can obscure strong work. I would rather see an applicant explain a design decision, investigate a fault or respond honestly to something they do not know.",
          "Professionalism should include preparation, respect, reliable communication and responsibility for the result. An outfit cannot demonstrate those things on its own."
        ],
        "title": "Presentation should serve the work"
      },
      {
        "after": [
          "This approach still allows demanding prerequisites where the work requires them. Licences, safety responsibilities and the need to operate independently do not disappear. Employers should explain those requirements clearly instead of expecting an arbitrary number to stand in for them.",
          "Graduates also have responsibilities. Show the work, state its limits and take feedback seriously. Eagerness is a starting point; demonstrated progress is stronger evidence.",
          "A new recruit does not put an organisation on a growth track by default. They need access to useful work, feedback and people who will help them develop. Make mentoring part of the senior role and recognise it as a contribution."
        ],
        "id": "better-assessment",
        "image": {
          "alt": "A proposed hiring assessment examines work samples, learning and verification, then provides supervised responsibility. It retains genuine safety and licensing prerequisites.",
          "caption": "A proposed assessment framework, not a validated scoring model. The table above provides its text equivalent.",
          "height": 720,
          "src": "/assets/blog/20260913-Hiring-Evidence-Rev00.svg",
          "width": 1200
        },
        "paragraphs": [
          "I would begin with the outcomes the role needs to deliver. Separate genuine prerequisites from skills that can be learnt, then use a short, relevant assessment with the same criteria for every candidate.",
          "For an engineering role, that might mean discussing a fault scenario, reviewing a small design or explaining a project the applicant actually built. Provide reasonable adjustments, state whether AI is permitted and ask the candidate to explain and check any assisted work. Substantial work trials should be paid and should not become a source of free production work."
        ],
        "table": {
          "headings": [
            "Instead of relying on",
            "Ask for evidence of"
          ],
          "rows": [
            [
              "A fixed number of years",
              "Decisions made, difficulty handled and results checked"
            ],
            [
              "An exact software match",
              "Relevant fundamentals and a demonstrated ability to learn"
            ],
            [
              "A confident interview",
              "Clear reasoning, honest uncertainty and a useful work sample"
            ],
            [
              "An innovation claim",
              "A testable improvement, constraints and a verification plan"
            ],
            [
              "An entry-level label",
              "A real induction, a named mentor and staged responsibility"
            ]
          ]
        },
        "title": "Replace the vague filter with evidence"
      },
      {
        "id": "make-room",
        "paragraphs": [
          "In his Stanford commencement address on 12 June 2005, Steve Jobs said: \"Don't be trapped by dogma, which is living with the results of other people's thinking.\" His separate passage about making way for the new was about mortality. I would not turn it into a case for pushing older people out of work.",
          "The useful challenge for an organisation is whether its assumptions remain open to examination. Can a newcomer question a method? Can a senior colleague change their mind without losing standing? Can someone earn responsibility by showing sound judgement and learning?",
          "I want experience that keeps developing, and an entry route that lets others develop it too. If an employer asks for five years, it should be able to explain what those five years are meant to prove - and consider another credible way of proving it."
        ],
        "sources": [
          3
        ],
        "title": "Make room for the next useful idea"
      }
    ],
    "slug": "the-experience-trap",
    "sources": [
      {
        "label": "QILT / Social Research Centre: 2024 Graduate Outcomes Survey National Report, September 2025; domestic outcomes and survey timing",
        "url": "https://www.qilt.edu.au/docs/default-source/default-document-library/2024-gos-national-report.pdf?sfvrsn=9f40f76_2"
      },
      {
        "label": "Brynjolfsson, Li and Raymond: Generative AI at Work, NBER Working Paper 31161 (2023); figures refer to the working-paper version",
        "url": "https://www.nber.org/papers/w31161"
      },
      {
        "label": "Stanford University: prepared text of Steve Jobs' commencement address, delivered 12 June 2005",
        "url": "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"
      }
    ],
    "title": "The experience trap: when hiring protects the past"
  }
];
