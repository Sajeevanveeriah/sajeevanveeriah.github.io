/**
 * Concept lab copy.
 *
 * Four deterministic demonstrations Sajeevan wrote to make the techniques
 * his records name legible. Every string the lab routes, the /lab/ index,
 * the record embeds and the readout tables render lives here; the numbers
 * themselves come from the engines in src/lib/labs at render time.
 *
 * Each lab names the record whose text names the technique, and states its
 * own standing plainly: a demonstration written for legibility, alongside
 * the record that documents where he applied the technique.
 */

export interface LabCopy {
  readonly slug: string
  readonly title: string
  readonly kicker: string
  readonly summary: string
  /** Framing paragraphs rendered above the module. */
  readonly paragraphs: readonly string[]
  /** One line under the module naming what the reader is looking at. */
  readonly figureNote: string
  /** Technique treatments from techniques.ts rendered on this lab page. */
  readonly techniques: readonly string[]
  /** Record whose text names this concept; the embed renders there. */
  readonly recordSlug: string
  readonly recordLabel: string
}

export const labsIndex = {
  kicker: 'Lab',
  title: 'Concepts you can operate.',
  lede: 'Sajeevan wrote these four demonstrations to make the core techniques in his records legible: each one is deterministic, runs entirely in the page and shows its real final state before any script loads.',
  note: 'Each demonstration is seeded, so the same inputs give the same numbers on every visit. The records document where Sajeevan applied each technique; these pages isolate the technique itself so its behaviour is visible.',
} as const

export const labs: readonly LabCopy[] = [
  {
    slug: 'path-planner',
    title: 'A* Path Planner',
    kicker: 'Lab 01',
    summary:
      'A* searching a paintable occupancy grid: choose the heuristic, allow diagonals, inflate obstacles, and watch the expansion order and the committed path respond.',
    paragraphs: [
      'Sajeevan wrote this planner so the search itself is visible: every cell A* expands is shown in the order it was expanded, and the committed path renders once the goal closes. Paint obstacles onto the grid, move the start and goal, and the readouts follow: nodes expanded, path cost, path length and whether the heuristic stayed admissible for the movement model.',
      'The admissibility readout is the honest core of the module. Manhattan distance with diagonal movement overestimates the remaining cost, and A* under an inadmissible heuristic still returns confident paths, just silently suboptimal ones. That failure is invisible in a screenshot and obvious here.',
      'In Sajeevan\'s rover this search ran over the occupancy grid LiDAR SLAM produced, documented in the rover record. This page runs the same algorithm on a grid you control, and it runs entirely in the page.',
    ],
    figureNote:
      'Expanded cells render in the order the search touched them; the committed path renders over them. S is the start, G the goal.',
    techniques: ['a-star-search'],
    recordSlug: 'autonomous-navigation-rover',
    recordLabel: 'Autonomous Navigation Rover on ROS 2',
  },
  {
    slug: 'pid-tuning',
    title: 'PID Tuning',
    kicker: 'Lab 02',
    summary:
      'Kp, Ki and Kd against a fixed second-order plant, with the step response, overshoot, rise, settling and steady-state readouts recomputed live.',
    paragraphs: [
      'Sajeevan wrote this loop against a fixed second-order plant with a saturating actuator, because that is the smallest system in which every classic PID behaviour appears. The proportional-only presets show the offset the integral term exists to remove, the derivative presets show damping being bought with response speed, and the windup pair shows the integrator accumulating effort the saturated actuator can never deliver, with and without a clamp.',
      'The presets are starting points, not the module: drag any gain and the response, the actuator trace and every metric recompute immediately. The plant is simulated at a fixed step, so a gain set always produces exactly the same response.',
      'Sajeevan tuned loops like this in two settings the records document: motion control in his rover simulation, and process loops in PLC logic delivered for regulated manufacturing clients, documented in the Engineering Mastery Lab and smart-factory records. This page isolates the tuning behaviour itself.',
    ],
    figureNote:
      'The solid line is the plant response to a unit step; the faint line is the saturated actuator effort driving it.',
    techniques: ['pid-control'],
    recordSlug: 'engineering-mastery-lab',
    recordLabel: 'Engineering Mastery Lab',
  },
  {
    slug: 'kalman-filter',
    title: 'Kalman Filter',
    kicker: 'Lab 03',
    summary:
      'A seeded noisy stream filtered live: tune Q and R, watch the two-sigma band, then switch to the EKF tab and watch linearisation carry and fail.',
    paragraphs: [
      'Sajeevan wrote this estimator around the two dials that matter: Q says how much the model is trusted, R says how much the sensor is trusted, and every slider movement re-balances the Kalman gain between them. The band around the estimate is the filter\'s own two-sigma confidence, so an over-confident filter is visible as a band too tight to contain the truth it is missing.',
      'The EKF tab observes the same state through a nonlinear measurement. The linearisation point and the Jacobian evaluated there are printed beside the plot, and the divergence preset under-states Q with a wrong initial estimate: the filter freezes its own gain, the estimate walks away from the truth, and the band keeps reporting confidence. That signature is the reason EKF tuning is checked against residuals rather than trusted.',
      'In Sajeevan\'s rover, Kalman and EKF estimation fused odometry and IMU data ahead of planning, documented in the rover record. This page runs the same mathematics on a stream you control.',
    ],
    figureNote:
      'Dots are the noisy measurements, the thin line is the truth, the strong line is the estimate and the shaded region is its two-sigma band.',
    techniques: ['kalman-filter', 'extended-kalman-filter'],
    recordSlug: 'autonomous-navigation-rover',
    recordLabel: 'Autonomous Navigation Rover on ROS 2',
  },
  {
    slug: 'occupancy-mapping',
    title: 'Occupancy Mapping',
    kicker: 'Lab 04',
    summary:
      'A simulated LiDAR sweeps a floorplan and builds an occupancy grid by ray casting with log-odds updates, while odometry drift smears the map in front of you.',
    paragraphs: [
      'Sajeevan wrote this module to make the SLAM problem visible before any SLAM is applied. The robot measures true geometry with a noisy simulated LiDAR, but writes the map from its odometry pose. With clean odometry the floorplan accumulates crisply; add drift and the same true geometry lands in the wrong cells, walls double and rooms bend, which is exactly the map a dead-reckoned robot believes in.',
      'Every beam follows the standard inverse sensor model: cells along the ray accumulate free evidence, the endpoint accumulates occupied evidence, both as clamped log-odds. Scan count, angular resolution, range noise and drift are all yours to set, and the run is seeded, so a parameter set always builds the same map.',
      'The drift this module demonstrates is the reason Sajeevan\'s rover ran LiDAR SLAM rather than trusting odometry, documented in the rover record: scan matching and loop closure exist to remove exactly the error this page lets you inject.',
    ],
    figureNote:
      'Dark cells are occupied evidence, white cells free, tinted cells unobserved. The dashed line is the true route; the solid line is the odometry the map was written from.',
    techniques: ['slam', 'sensor-fusion'],
    recordSlug: 'autonomous-navigation-rover',
    recordLabel: 'Autonomous Navigation Rover on ROS 2',
  },
] as const

export function getLab(slug: string): LabCopy | undefined {
  return labs.find((l) => l.slug === slug)
}

/** Labs embedded on each record, keyed by record slug. */
export const projectLabs: Record<string, readonly string[]> = {
  'autonomous-navigation-rover': ['path-planner', 'kalman-filter', 'occupancy-mapping'],
  'engineering-mastery-lab': ['pid-tuning'],
}

export const embedCopy = {
  heading: 'Working demonstrations',
  intro: 'Sajeevan wrote these interactive modules to make the techniques this record names legible. Each one is deterministic, runs entirely in the page, and opens as a full lab.',
  open: 'Open the full lab',
} as const
