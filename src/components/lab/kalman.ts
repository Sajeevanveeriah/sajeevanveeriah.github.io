/**
 * Deterministic one-dimensional Kalman filter demonstration.
 *
 * A fixed, seeded noise sequence is generated once and scaled by the chosen
 * measurement noise, so moving a slider re-weights the same disturbances
 * rather than rolling new ones. The same run therefore renders identically
 * at build time, on reload and on both ends of a slider sweep, which is what
 * lets the raw and filtered traces be compared honestly.
 */

export interface KalmanRun {
  /** Sample times in seconds. */
  readonly t: readonly number[]
  /** True state, hidden from the filter. */
  readonly truth: readonly number[]
  /** Noisy measurements the filter actually sees. */
  readonly z: readonly number[]
  /** Kalman estimate after each update. */
  readonly xhat: readonly number[]
  /** Two-sigma bound of the estimate, for the confidence band. */
  readonly bound: readonly number[]
  /** Root-mean-square error of the raw measurements against truth. */
  readonly rmseRaw: number
  /** Root-mean-square error of the estimate against truth. */
  readonly rmseFiltered: number
}

export const KALMAN_SAMPLES = 140
const DT = 0.1

/** mulberry32: a small deterministic PRNG. The seed is fixed on purpose. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller transform over the seeded PRNG: unit-variance gaussian draws. */
function gaussianSequence(n: number, seed: number): number[] {
  const rand = mulberry32(seed)
  const out: number[] = []
  while (out.length < n) {
    const u1 = Math.max(rand(), 1e-12)
    const u2 = rand()
    const r = Math.sqrt(-2 * Math.log(u1))
    out.push(r * Math.cos(2 * Math.PI * u2))
    if (out.length < n) out.push(r * Math.sin(2 * Math.PI * u2))
  }
  return out
}

/* One unit-noise sequence for the whole module, shared by every run. */
const UNIT_NOISE = gaussianSequence(KALMAN_SAMPLES, 20260731)

/** The hidden truth: a slow approach that steps to a new level mid-run, the
    shape a position sensor sees when a platform moves station to station. */
function truthAt(time: number): number {
  const settle = 1.6 * (1 - Math.exp(-time / 1.8))
  const step = time >= 7 ? 1.1 * (1 - Math.exp(-(time - 7) / 0.9)) : 0
  return settle + step
}

/**
 * Scalar Kalman filter with a random-walk process model.
 *
 * @param q process noise variance, how much the filter lets the state drift
 * @param r measurement noise variance, how little it trusts each sample
 */
export function runKalman(q: number, r: number): KalmanRun {
  const t: number[] = []
  const truth: number[] = []
  const z: number[] = []
  const xhat: number[] = []
  const bound: number[] = []

  const sigma = Math.sqrt(r)
  let x = 0
  let p = 1

  let sumSqRaw = 0
  let sumSqFil = 0

  for (let k = 0; k < KALMAN_SAMPLES; k += 1) {
    const time = k * DT
    const truthK = truthAt(time)
    const zk = truthK + sigma * (UNIT_NOISE[k] ?? 0)

    /* Predict: random walk, so the state carries over and uncertainty grows. */
    p += q

    /* Update. */
    const kGain = p / (p + r)
    x = x + kGain * (zk - x)
    p = (1 - kGain) * p

    t.push(Number(time.toFixed(2)))
    truth.push(truthK)
    z.push(zk)
    xhat.push(x)
    bound.push(2 * Math.sqrt(p))

    sumSqRaw += (zk - truthK) ** 2
    sumSqFil += (x - truthK) ** 2
  }

  return {
    t,
    truth,
    z,
    xhat,
    bound,
    rmseRaw: Number(Math.sqrt(sumSqRaw / KALMAN_SAMPLES).toFixed(3)),
    rmseFiltered: Number(Math.sqrt(sumSqFil / KALMAN_SAMPLES).toFixed(3)),
  }
}

export const KALMAN_DEFAULTS = { q: 0.01, r: 0.36 } as const
