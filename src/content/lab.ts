/**
 * Copy and structure for the concept lab.
 *
 * Framing is binding: every lab is an interactive demonstration of a concept,
 * written for this site, and is never presented as production code from any
 * project or employer. Where a lab relates to a work record, the relation is
 * that the record's own text already names the concept (A* planning, Kalman
 * and EKF estimation and PID tuning all appear verbatim in existing records),
 * and the lab only illustrates the idea.
 */

export interface LabEntry {
  readonly slug: string
  readonly title: string
  readonly kicker: string
  /** One-line summary for the index and metadata. */
  readonly summary: string
  /** Plain-text explanation of what the demonstration shows. */
  readonly explanation: readonly string[]
  /** What to try first, as a short instruction. */
  readonly tryThis: string
  /** The record whose existing text names this concept, if any. */
  readonly relatedRecord: { readonly slug: string; readonly title: string } | null
}

export const LAB_FRAMING =
  'These are small interactive demonstrations of engineering concepts, built for this site. They are not production code from any project or employer.'

export const labs: readonly LabEntry[] = [
  {
    slug: 'path-planner',
    title: 'Path Planner Lab',
    kicker: 'Concept lab / Planning',
    summary:
      'Paint obstacles on an occupancy grid, set the start and goal, and watch A* explore the space and commit a shortest path.',
    explanation: [
      'A* is a graph search that balances two quantities for every cell it considers: the cost already paid to reach that cell, and an admissible estimate of the cost still to go. Expanding the cell with the lowest combined score steers the search toward the goal without giving up the guarantee of a shortest path.',
      'The shaded cells show the order the search actually expanded, so a wall between start and goal visibly forces the frontier to spill around it. The committed path is drawn once the goal is reached, with the expansion count and path cost read out beside it.',
      'This demonstration runs a 4-connected grid with unit step costs and a Manhattan-distance heuristic, and it is deterministic: the same grid always explores in the same order.',
    ],
    tryThis:
      'Draw a wall across the corridor between start and goal, then run the search again and compare the expansion count.',
    relatedRecord: {
      slug: 'autonomous-navigation-rover',
      title: 'Autonomous Navigation Rover on ROS 2',
    },
  },
  {
    slug: 'pid-tuning',
    title: 'PID Tuning Lab',
    kicker: 'Concept lab / Control',
    summary:
      'Tune proportional, integral and derivative gains against a second-order plant and read the overshoot and settling time off the live step response.',
    explanation: [
      'A PID controller drives a plant with three terms: the proportional term reacts to the present error, the integral term accumulates past error until offset is gone, and the derivative term anticipates where the error is heading and damps the approach.',
      'The plant here is a unit-mass spring-damper with a natural frequency of 2 rad/s and a damping ratio of 0.2, underdamped enough that a proportional-only controller visibly rings. The chart redraws the full 8 s step response for every gain change, with overshoot, rise time, settling time and steady-state error computed from the trace.',
      'Integration is fixed-step Runge-Kutta with a saturated actuator, so the response is repeatable and extreme gains behave like a real drive rather than an unbounded ideal force.',
    ],
    tryThis:
      'Raise the proportional gain alone and watch the overshoot grow, then add derivative gain and watch the same rise settle cleanly.',
    relatedRecord: {
      slug: 'autonomous-navigation-rover',
      title: 'Autonomous Navigation Rover on ROS 2',
    },
  },
  {
    slug: 'kalman-filter',
    title: 'Kalman Filter Lab',
    kicker: 'Concept lab / Estimation',
    summary:
      'A noisy one-dimensional sensor stream with a Kalman estimate overlaid: adjust the process and measurement noise and watch the filter re-balance trust.',
    explanation: [
      'A Kalman filter maintains a running estimate of a hidden state and a measure of its own uncertainty. Each cycle it predicts how the state should have moved, then corrects that prediction with the new measurement, weighted by how much it currently trusts the sensor against the model.',
      'The chart shows the hidden truth, the raw measurements the filter actually sees, and the filtered estimate with its two-sigma confidence band. The root-mean-square error of the raw and filtered signals is read out side by side, so the improvement is measured rather than asserted.',
      'The noise sequence is seeded and fixed: moving a slider re-weights the same disturbances rather than rolling new ones, which is what makes the raw and filtered traces honestly comparable.',
    ],
    tryThis:
      'Lower the process noise until the estimate goes stiff and lags the step, then raise it and watch the filter chase the measurements instead.',
    relatedRecord: {
      slug: 'autonomous-navigation-rover',
      title: 'Autonomous Navigation Rover on ROS 2',
    },
  },
] as const

export function getLab(slug: string): LabEntry | undefined {
  return labs.find((l) => l.slug === slug)
}

/**
 * Which labs embed, compact, on which work records. The mapping follows the
 * records' own existing text: the rover record names A* planning, Kalman and
 * EKF estimation and PID tuning; the Engineering Mastery Lab record describes
 * guided learning labs and simulation engines, so the PID demonstration sits
 * there as the closest concept.
 */
export const labEmbeds: Record<string, readonly string[]> = {
  'autonomous-navigation-rover': ['path-planner', 'kalman-filter'],
  'engineering-mastery-lab': ['pid-tuning'],
}

export const labIndexCopy = {
  kicker: 'Concept lab',
  title: 'Interactive demonstrations of the ideas behind the work.',
  lede: 'Three small, self-contained engineering demonstrations: search, control and estimation. Each runs entirely in the browser, is deterministic, and degrades to a complete static readout without JavaScript.',
} as const
