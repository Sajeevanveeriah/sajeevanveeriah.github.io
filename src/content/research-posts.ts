import type { BlogPost } from "./blog";

const figures = "/assets/blog/20261030-Article-Figures-Rev00";
const scriptLinks = [
  { label: "Download the Python script that produces every figure in this article", url: `${figures}.py` },
  { label: "Download the computed values (JSON)", url: `${figures}.json` },
];

export const researchPosts: BlogPost[] = [
  {
    "slug": "slow-down-to-speed-up-in-engineering",
    "title": "Slow down to speed up: the engineering case for an unhurried start",
    "date": "2026-10-30",
    "category": "Engineering and work",
    "description": "Rushing the first week of a project feels productive and usually costs the most time later. Why I spend longer on the problem before touching the solution, with NASA's cost data behind it.",
    "image": {
      "src": "/assets/blog/20261030-Slow-Down-Cost-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Bar chart on a log scale of the relative cost to fix a requirements error by the phase in which it is found: requirements 1x, design 3x to 4x, build 13x to 16x, test 61x to 78x, operations 157x to 186x.",
      "caption": "Relative cost to fix a requirements error, from Table 8 of Stecklein et al. (2004), NASA Johnson Space Center, total cost breakdown method. Redrawn for this article."
    },
    "intro": [
      "There is a point at the start of every project where the pressure is to show movement. Order the parts, open the CAD, write the first function. Something visible feels like progress.",
      "I have learnt to resist that for a little while. Not for long, and not out of caution for its own sake. The first few days decide what the next few months are spent on, so they are the cheapest place to get things right."
    ],
    "sections": [
      {
        "id": "what-slowing-down-means",
        "title": "What slowing down actually means",
        "paragraphs": [
          "It does not mean writing a long document nobody reads. It means answering a few plain questions before building anything, and writing the answers down where everyone can see them.",
          "What problem are we solving, and for whom? What does done look like, in numbers someone could check? What are we assuming, and which of those assumptions would hurt most if it turned out wrong? What is out of scope?",
          "Most of the time the answers are quick. Occasionally one of them is not, and that is exactly the question that would have surfaced in month three as a redesign."
        ]
      },
      {
        "id": "the-cost-data",
        "title": "The cost of finding it later",
        "paragraphs": [
          "NASA's Johnson Space Center studied how the cost of fixing an error grows with the phase in which it is found. They used three different methods on hardware and software systems similar to a spacecraft or small satellite. All three show the same shape: the same requirements mistake costs a few times more to fix in design, tens of times more in test and over a hundred times more in operation. [1]",
          "The figures below come from their total cost breakdown method. The exact multipliers depend on the project, and a small embedded product is not a satellite. The direction is what matters, and it matches what most engineers see on much smaller jobs."
        ],
        "table": {
          "headings": ["Phase the error is found", "Relative cost to fix"],
          "rows": [
            ["Requirements", "1x"],
            ["Design", "3x to 4x"],
            ["Build", "13x to 16x"],
            ["Test", "61x to 78x"],
            ["Operations", "157x to 186x"]
          ]
        },
        "after": [
          "The reason is not mysterious. An error found on paper costs an edit. Found in a PCB, it costs a respin and a few weeks. Found on site, it costs travel, downtime, a rework plan and some trust."
        ],
        "links": scriptLinks,
        "sources": [1]
      },
      {
        "id": "where-it-pays",
        "title": "Where an unhurried start pays off",
        "paragraphs": [
          "In my own work a few habits do most of the heavy lifting. None of them are new. They just get skipped when a deadline is close."
        ],
        "steps": [
          ["Write the acceptance test first", "Before designing a controller or a board, write how you will know it works. A number, a method and a pass condition."],
          ["List the assumptions", "Supply voltage, ambient temperature, network availability, what the operator will actually do. Mark the ones nobody has confirmed."],
          ["Check interfaces early", "Connectors, protocols, units and data formats between your part and someone else's. Most integration pain lives here."],
          ["Make the system observable", "Logs, status LEDs, timestamps and data age. If you cannot see what it is doing, every fault takes longer to find."],
          ["Separate verified from expected", "Keep a clear line between what has been measured and what is still a design intent. It stops a hopeful number becoming a claim."]
        ]
      },
      {
        "id": "speed-comes-back",
        "title": "The speed comes back later",
        "paragraphs": [
          "The payoff shows up in places that are easy to miss. Fewer design reviews that reopen old decisions. Fewer surprises in commissioning. Faults that take an hour to find instead of a week, because the system was built to be looked at.",
          "Toyota's production system builds the same idea into the line: stop when something is wrong, fix the cause, then carry on. Stopping looks slow in the moment. Over a year it is what makes the line fast. [2]",
          "So when I take a bit longer at the start of a project, that is the reason. It is the fastest way I know to finish."
        ],
        "sources": [2]
      }
    ],
    "sources": [
      {
        "label": "Stecklein, Dabney, Dick, Haskins, Lovell and Moroney, Error Cost Escalation Through the Project Life Cycle, NASA Johnson Space Center, 2004 (NTRS 20100036670). Table 8.",
        "url": "https://ntrs.nasa.gov/citations/20100036670"
      },
      {
        "label": "Toyota Motor Corporation: Toyota Production System, jidoka",
        "url": "https://global.toyota/en/company/vision-and-philosophy/production-system/"
      }
    ],
    "note": "Cost factors are quoted from Table 8 of the cited NASA study and redrawn by the linked script."
  },
  {
    "slug": "odometry-drift-grows-with-distance-squared",
    "title": "Why a rover's position gets worse the further it drives",
    "date": "2026-10-30",
    "category": "Robotics",
    "description": "A 0.1% difference in wheel diameter puts a differential-drive robot 0.17 m off after 10 m and 0.67 m off after 20 m. The maths behind odometry drift and the calibration that fixes most of it.",
    "image": {
      "src": "/assets/blog/20261030-Odometry-Drift-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Line chart of sideways position error against distance driven for a robot with a 0.30 m wheelbase. With a 0.10% wheel diameter mismatch the error reaches 0.17 m at 10 m and 0.67 m at 20 m. A 0.25% mismatch reaches 0.42 m at 10 m and a 0.50% mismatch reaches 0.83 m at 10 m.",
      "caption": "Computed with the model and inputs described below. The script that produced the chart is linked in the article."
    },
    "intro": [
      "Wheel odometry is the first position estimate most mobile robots have. Count encoder ticks on each wheel, convert to distance, integrate. It is cheap, fast and available at every control cycle.",
      "It also drifts, and the way it drifts is worth understanding before you decide how much to trust it. A small, constant error in the robot's geometry does not produce a small, constant position error. It produces one that grows with the square of the distance driven."
    ],
    "sections": [
      {
        "id": "where-drift-comes-from",
        "title": "Two kinds of error",
        "paragraphs": [
          "Borenstein and Feng separated odometry errors into two groups. Systematic errors come from the robot itself: unequal wheel diameters and an effective wheelbase that differs from the nominal value. Non-systematic errors come from the world: slip, bumps and uneven floors. [1]",
          "Systematic errors are the interesting ones for a designer because they stay almost constant over long periods. That makes them measurable, and it makes them correctable in software."
        ],
        "sources": [1]
      },
      {
        "id": "the-maths",
        "title": "Why the error grows with distance squared",
        "paragraphs": [
          "Take a differential-drive robot with wheelbase b. If the right wheel is effectively a fraction e larger than the left, then while the robot believes it is driving straight, the right wheel covers slightly more ground. Over a distance ds the heading changes by e x ds / b.",
          "That heading error accumulates linearly with distance. Sideways position error is the integral of the sine of the heading, so for small angles it accumulates as e x s squared / (2b). Double the distance and the sideways error roughly quadruples.",
          "For a 0.30 m wheelbase and a 0.1% mismatch, the robot's heading has turned by 1.9 degrees after 10 m. The table shows the resulting sideways error, integrated numerically rather than with the small-angle shortcut."
        ],
        "table": {
          "headings": ["Wheel diameter mismatch", "Sideways error at 5 m / 10 m / 20 m"],
          "rows": [
            ["0.10%", "0.04 m / 0.17 m / 0.67 m"],
            ["0.25%", "0.10 m / 0.42 m / 1.66 m"],
            ["0.50%", "0.21 m / 0.83 m / 3.30 m"]
          ]
        },
        "after": [
          "A 0.1% difference on a 100 mm wheel is 0.1 mm. That is within normal manufacturing variation, tyre wear or uneven load on a soft tyre. It is not something you would see by looking at the robot."
        ],
        "links": scriptLinks
      },
      {
        "id": "measuring-it",
        "title": "Measuring it with a square path",
        "paragraphs": [
          "The obvious test is to drive a square and see whether the robot ends up back at the start. The problem is that a wheel mismatch and a wheelbase error can cancel each other on a square driven in one direction, so a robot can pass that test while still being badly calibrated. [1]",
          "UMBmark fixes this by driving a 4 m square five times clockwise and five times anticlockwise, then measuring where the robot actually stops each time. The two directions separate the error types, and the paper gives equations to turn the measured end positions into two correction factors: one for wheel diameter ratio and one for effective wheelbase. [1][2]",
          "The authors reported at least an order of magnitude improvement in systematic odometric accuracy after applying the corrections. A tape measure and some floor tape are enough to run it. [1]"
        ],
        "sources": [1, 2]
      },
      {
        "id": "what-to-do-with-it",
        "title": "What this means for a navigation stack",
        "paragraphs": [
          "Odometry is still useful. Over short distances, between laser scans or camera frames, it is smooth and fast, and that is what a localisation filter needs between absolute corrections. The quadratic growth is the reason it cannot be the only source.",
          "In a ROS 2 stack the usual arrangement is wheel odometry and an IMU fused in an EKF for the continuous estimate, with LiDAR scan matching or visual landmarks correcting it at a lower rate. Calibrating systematic errors first means the filter is correcting noise rather than a steady bias, and the corrections it has to make get smaller.",
          "Run the square-path test before tuning the filter. It is a morning's work, and it removes the error source that grows the fastest."
        ]
      }
    ],
    "sources": [
      {
        "label": "Borenstein and Feng, Measurement and Correction of Systematic Odometry Errors in Mobile Robots, IEEE Transactions on Robotics and Automation, vol. 12, no. 6, 1996",
        "url": "https://ieeexplore.ieee.org/document/544770"
      },
      {
        "label": "Borenstein and Feng, UMBmark: A Benchmark Test for Measuring Odometry Errors in Mobile Robots, SPIE Conference on Mobile Robots, 1995",
        "url": "https://www.cs.columbia.edu/~allen/F19/NOTES/borenstein.pdf"
      }
    ],
    "note": "The drift figures are computed for a 0.30 m wheelbase on a flat floor with no slip. The model and script are linked above, so the numbers can be rerun with your own robot's geometry."
  },
  {
    "slug": "size-the-motor-from-the-motion-profile",
    "title": "Size the motor from the motion profile, not the catalogue",
    "date": "2026-10-30",
    "category": "Mechatronics",
    "description": "A worked ball-screw example: 20 kg moved 200 mm in 0.6 s needs 0.218 N m peak, 0.110 N m RMS and 2,667 rpm. How to get each number and which one actually decides the motor.",
    "image": {
      "src": "/assets/blog/20261030-Motor-Sizing-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Step chart of required motor torque over a 1.0 s cycle: 0.218 N m while accelerating for 0.15 s, 0.017 N m at a constant 2667 rpm for 0.30 s, minus 0.183 N m while decelerating for 0.15 s, then zero during a 0.40 s dwell. The RMS torque over the cycle is 0.110 N m.",
      "caption": "Computed from the inputs in the table below. The script and its output are linked in the article."
    },
    "intro": [
      "A common way to pick a motor is to estimate the load, find something in a catalogue with a bit more torque, and add a safety margin. It often works. When it does not, the axis overshoots, the drive trips on overcurrent, or the motor runs hot after an hour of real duty.",
      "The more reliable route starts from the motion the machine has to make. Once the move is defined, speed, peak torque, RMS torque and inertia ratio all follow from it, and each one checks a different limit of the motor."
    ],
    "sections": [
      {
        "id": "the-example",
        "title": "The example axis",
        "paragraphs": [
          "A horizontal ball-screw axis moves a 20 kg carriage 200 mm. The move takes 0.6 s with 0.15 s to accelerate and 0.15 s to decelerate, followed by a 0.4 s dwell, so one cycle is 1.0 s. The screw is 16 mm in diameter, 500 mm long with a 10 mm lead."
        ],
        "table": {
          "headings": ["Input", "Value"],
          "rows": [
            ["Moving mass", "20 kg"],
            ["Screw lead", "10 mm per revolution"],
            ["Screw diameter and length", "16 mm, 500 mm, steel"],
            ["Screw efficiency", "0.90"],
            ["Guide friction coefficient", "0.05"],
            ["Move profile", "0.15 s accelerate, 0.30 s constant, 0.15 s decelerate, 0.40 s dwell"],
            ["Candidate rotor inertia", "0.26 kg cm squared"]
          ]
        }
      },
      {
        "id": "speed",
        "title": "Step 1: speed",
        "paragraphs": [
          "For a trapezoidal profile the distance is the area under the velocity curve. With equal acceleration and deceleration times, peak velocity is stroke / (accelerate time + constant time) = 0.2 / 0.45 = 0.444 m/s.",
          "Through a 10 mm lead that is 44.4 revolutions per second, or 2,667 rpm. That number alone rules out many small motors and gearmotors before torque is considered."
        ]
      },
      {
        "id": "inertia",
        "title": "Step 2: inertia, and the ratio",
        "paragraphs": [
          "The carriage reflects to the motor shaft as m x (lead / 2 pi) squared, which is 0.51 kg cm squared. The steel screw itself, as a solid cylinder, adds 0.25 kg cm squared. With 90% screw efficiency, the load the motor sees is 0.81 kg cm squared.",
          "Against a 0.26 kg cm squared rotor that is an inertia ratio of 3.1 to 1. Manufacturer guidance treats ratios around 5 to 1 as typical, with lower ratios giving tighter response and much higher ratios workable when performance is less critical. [1][2] The screw is almost a third of the load here, which is easy to forget when you only weigh the carriage."
        ],
        "sources": [1, 2]
      },
      {
        "id": "torque",
        "title": "Step 3: torque in each part of the move",
        "paragraphs": [
          "Angular acceleration is the peak shaft speed divided by the ramp time: 279 rad/s over 0.15 s, or 1,862 rad/s squared. Multiply by total inertia, including the rotor, and add friction torque to get the accelerating torque. Friction on the guide is small here, 0.017 N m at the shaft."
        ],
        "table": {
          "headings": ["Segment", "Torque at the motor shaft"],
          "rows": [
            ["Accelerate", "0.218 N m"],
            ["Constant speed", "0.017 N m"],
            ["Decelerate", "minus 0.183 N m"],
            ["Dwell", "0 N m"],
            ["RMS over the 1.0 s cycle", "0.110 N m"]
          ]
        },
        "after": [
          "Nearly all of the torque goes into accelerating inertia, not overcoming friction. That is typical of fast, short moves, and it is why the acceleration time is the most powerful number to negotiate in a design review."
        ],
        "links": scriptLinks
      },
      {
        "id": "which-number-decides",
        "title": "Which number decides the motor",
        "paragraphs": [
          "Each number checks a different limit. Peak torque at the speed where it occurs has to sit inside the motor's intermittent torque-speed region. RMS torque has to sit inside the continuous region, because that is what decides winding temperature. Top speed has to be reachable at the available bus voltage. The inertia ratio decides how hard the axis will be to tune. [1]",
          "Peak torque at 2,667 rpm is where a lot of first selections fail. A motor's peak torque falls off at high speed, so a catalogue figure quoted near standstill can look comfortable and still be short where the profile needs it.",
          "With the numbers in hand, a margin means something: you know which limit it protects. I usually check the profile again with a shorter acceleration time, because someone will ask for a faster cycle once the machine runs."
        ]
      }
    ],
    "sources": [
      {
        "label": "Yaskawa, Servo Motor Sizing Concepts (reprinted from Design News, June 2009)",
        "url": "https://www.yaskawa.com/delegate/getAttachment?cmd=documents&documentId=PR.DN.01&documentName=PR.DN.01.pdf"
      },
      {
        "label": "Oriental Motor, Technical Reference: Motor Sizing Calculations",
        "url": "https://www.orientalmotor.com/products/pdfs/F_TecRef/TecMtrSiz.pdf"
      }
    ],
    "note": "All values are computed from the inputs listed in the article. Coupling inertia is left out for clarity; add it to the load in a real sizing."
  },
  {
    "slug": "integrator-windup-on-a-saturated-drive",
    "title": "Integrator windup: when a PI loop keeps pushing after the drive has hit its limit",
    "date": "2026-10-30",
    "category": "Control systems",
    "description": "The same PI gains on the same saturated drive overshoot to 98% of full speed without anti-windup and settle at 90% with it. A simulated comparison of no protection, conditional integration and back-calculation.",
    "image": {
      "src": "/assets/blog/20261030-PID-Windup-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Step response of a PI speed loop to a 90% setpoint with the drive limited to 100%. Without anti-windup the speed overshoots to 0.983 and settles to within 2% after 3.1 s. With conditional integration it peaks at 0.900 and settles in 1.8 s. With back-calculation it peaks at 0.900 and settles in 1.6 s.",
      "caption": "Simulated with the plant, gains and limit described below. The script and its output are linked in the article."
    },
    "intro": [
      "Every real actuator has a limit. A PWM duty cycle stops at 100%, a valve is fully open, a motor drive clamps its current. A textbook PI controller does not know that.",
      "When the output saturates, the error stays large for longer than the controller expects, and the integral term keeps growing. By the time the process reaches the setpoint, the integrator holds far more than it should, and the loop overshoots while it unwinds."
    ],
    "sections": [
      {
        "id": "the-setup",
        "title": "The simulated loop",
        "paragraphs": [
          "The plant is a first-order speed response with a 0.5 s time constant, normalised so 1.0 is full speed. A PI controller with Kp = 2 and Ki = 4 per second drives it, and the drive output is clamped between minus 1 and 1. The setpoint steps from 0 to 0.9.",
          "With these gains the controller asks for well over 100% at the start, so the drive saturates. Everything else is identical between the three runs. Only the integrator handling changes."
        ],
        "table": {
          "headings": ["Integrator handling", "Peak speed and 2% settling time"],
          "rows": [
            ["None", "0.983, 3.1 s"],
            ["Conditional integration (clamping)", "0.900, 1.8 s"],
            ["Back-calculation, Tt = 0.25 s", "0.900, 1.6 s"]
          ]
        },
        "after": [
          "The plain PI loop overshoots by 9% and takes almost twice as long to settle, with gains that look perfectly reasonable on paper. On a position axis or a heater, the same mechanism produces larger overshoot because the integral has more time to wind up."
        ],
        "links": scriptLinks
      },
      {
        "id": "two-fixes",
        "title": "Two standard fixes",
        "paragraphs": [
          "Conditional integration stops the integrator accumulating whenever the output is saturated and the error would drive it further into saturation. It is a few lines of code and needs no extra tuning.",
          "Back-calculation feeds the difference between the requested and the actual actuator output back into the integrator through a tracking time constant Tt. When the drive is not saturated the term is zero; when it is, the integrator is pulled back towards a value consistent with what the actuator can actually do. Åström and Murray describe this scheme in their chapter on PID control, with a worked example that removes a large overshoot. [1] Simulink's PID Controller block offers both clamping and back-calculation as built-in options. [2]",
          "In this example both fixes remove the overshoot. Back-calculation settles slightly faster because it keeps the integrator closer to the value it will need at the setpoint."
        ],
        "sources": [1, 2]
      },
      {
        "id": "in-practice",
        "title": "Things to check on real hardware",
        "paragraphs": [
          "The anti-windup logic has to see the real limit. If the firmware clamps duty at 95% for bootstrap reasons but the controller believes the limit is 100%, the integrator still winds up by the difference.",
          "Rate limits count as saturation too. A drive with a ramp limit or a valve with a slew rate holds the output below the request for a while, and the integrator needs to know.",
          "Watch what happens when the loop is switched from manual to automatic, and when a setpoint changes while the output is already at a limit. Both are where windup appears outside a step test. Log the integrator state alongside the output so the cause is visible when it does."
        ]
      }
    ],
    "sources": [
      {
        "label": "Åström and Murray, Feedback Systems: An Introduction for Scientists and Engineers, second edition, chapter 11 (PID Control), section 11.4 Integrator Windup",
        "url": "https://www.cds.caltech.edu/~murray/books/AM08/pdf/fbs-public_15Oct16.pdf"
      },
      {
        "label": "MathWorks, Anti-Windup Control Using PID Controller Block (MATLAB and Simulink documentation)",
        "url": "https://www.mathworks.com/help/simulink/slref/anti-windup-control-using-a-pid-controller.html"
      }
    ],
    "note": "Responses are simulated with a 1 ms Euler step using the plant, gains and limit stated in the article. The script and the computed values are linked above."
  },
  {
    "slug": "test-each-stage-of-a-document-grounded-ai",
    "title": "Testing a document-grounded AI one stage at a time",
    "date": "2026-10-30",
    "category": "AI and machine learning",
    "description": "When a retrieval-augmented system gives a wrong answer, the cause can sit in the index, the retriever, the model's reading or the final answer. How I test each stage separately so the failure points to a fix.",
    "image": {
      "src": "/assets/blog/20261030-Retrieval-Failures-Rev00.svg",
      "width": 1200,
      "height": 720,
      "alt": "Diagram of four stages in sequence. 1 Index: is the right passage in the index at all, failing when missing, split badly or out of date. 2 Retrieve: is it in the top k for this question, failing when ranked below the cut-off. 3 Read: did the model use the passage it got, failing when ignored or outvoted by a wrong passage. 4 Answer: is every claim backed by a cited passage, failing when unsupported detail is added.",
      "caption": "Original diagram. Each stage has its own question and its own failure."
    },
    "intro": [
      "Retrieval-augmented generation pairs a language model with a search over your own documents. The model answers from passages it is given rather than from memory alone. Lewis and colleagues showed the approach in 2020, and it is now the usual way to make a model answer from a specific body of material. [1]",
      "Building one is quick. Knowing whether it is any good takes longer, mostly because a wrong answer at the end tells you very little about where it went wrong."
    ],
    "sections": [
      {
        "id": "four-stages",
        "title": "Four stages, four different failures",
        "paragraphs": [
          "A grounded answer passes through four stages. The document has to be in the index in a usable form. The retriever has to rank the right passage high enough to be passed to the model. The model has to actually use that passage. The final answer has to stay within what the passages support.",
          "Each stage fails differently and has a different fix. Changing the embedding model will not help if the passage was never indexed. A better prompt will not help if the right passage was ranked 40th."
        ]
      },
      {
        "id": "build-the-question-set",
        "title": "Start with a question set you can mark",
        "paragraphs": [
          "The most useful thing I build is a list of real questions, each paired with the passage or passages that answer it. Thirty to fifty is enough to start. Include questions whose answer sits in a table, in a footnote or across two documents, because those are where retrieval tends to struggle.",
          "Also include a few questions the documents cannot answer. A good system should say it does not know. A system that answers them confidently has a stage 4 problem."
        ]
      },
      {
        "id": "measure-each-stage",
        "title": "Measure each stage on its own",
        "paragraphs": [
          "With the question set, each stage gets its own check."
        ],
        "steps": [
          ["Index", "For every expected passage, confirm it exists in the index as a complete chunk. Search for its text directly. Chunk boundaries that split a table or a procedure in half show up here."],
          ["Retrieve", "Run each question through the retriever only and record whether an expected passage appears in the top k. This is recall at k, the fraction of relevant items that were retrieved. [2] Record its rank as well."],
          ["Read", "Give the model the correct passage directly and ask the question. If the answer is still wrong, retrieval is not the problem."],
          ["Answer", "Check each claim in the final answer against the passages that were supplied. Any claim without a supporting passage is a failure, even if it happens to be true."]
        ],
        "after": [
          "This turns one vague score into four specific ones. A low recall at k points to chunking, the embedding model or hybrid keyword search. A stage 3 failure with the right passage in hand points to the prompt, the context order or the model. A stage 4 failure points to stricter citation instructions and refusing when evidence is missing."
        ],
        "sources": [2]
      },
      {
        "id": "keep-it-running",
        "title": "Keep the checks running",
        "paragraphs": [
          "Documents change, and so do models. I keep the question set beside the code and run the stage checks whenever the index is rebuilt, the chunking changes or the model is swapped. A change that improves one stage can quietly break another, and a fixed question set is the cheapest way to notice.",
          "The same approach works for a large deployment or a local model on one machine. It is the habit that matters: test the parts separately, so a wrong answer points to a fix rather than a guess."
        ]
      }
    ],
    "sources": [
      {
        "label": "Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, NeurIPS 2020 (arXiv:2005.11401)",
        "url": "https://arxiv.org/abs/2005.11401"
      },
      {
        "label": "Thakur et al., BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models, NeurIPS 2021 Datasets and Benchmarks (arXiv:2104.08663). Uses nDCG@10 and Recall@100.",
        "url": "https://arxiv.org/abs/2104.08663"
      }
    ]
  }
];
