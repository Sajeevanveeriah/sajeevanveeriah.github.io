/**
 * Scalar Kalman filter and EKF demonstration, fully seeded.
 *
 * KF tab: a smooth true signal measured through additive gaussian noise,
 * filtered by a random-walk model whose Q and R are the sliders. The
 * two-sigma band comes from the filter's own covariance, so overconfidence
 * is visible as a band too narrow to contain the truth.
 *
 * EKF tab: the same state observed through the nonlinear measurement
 * z = 8 sin(x / 4) + v, monotonic across the signal's range so the state
 * stays observable everywhere. The filter linearises about the predicted
 * state each step, and the linearisation point and Jacobian
 * H = 2 cos(x / 4) are surfaced as readouts. The divergence preset under-states Q so the filter trusts its
 * model over the data and walks away from the truth while still reporting
 * a tight band.
 */

import { mulberry32, gaussian } from './rand'

export type KalmanMode = 'kf' | 'ekf'

export interface KalmanParams {
  readonly mode: KalmanMode
  readonly q: number
  readonly r: number
  /** Initial estimate; the divergence preset starts it well off the truth. */
  readonly x0: number
}

export interface KalmanResult {
  readonly truth: readonly number[]
  readonly z: readonly number[]
  readonly estimate: readonly number[]
  readonly sigma: readonly number[]
  readonly rmseRaw: number
  readonly rmseFiltered: number
  /** Final-step linearisation point and Jacobian, EKF only. */
  readonly linPoint: number | null
  readonly jacobian: number | null
}

export const KALMAN_N = 120
const DT = 0.1
const R_TRUE = 0.55

export const KALMAN_PRESETS = [
  { id: 'balanced', label: 'Balanced', values: { q: 0.08, r: 0.3, x0: 0 } },
  { id: 'sluggish', label: 'R over-stated', values: { q: 0.02, r: 4, x0: 0 } },
  { id: 'nervous', label: 'Q over-stated', values: { q: 2, r: 0.1, x0: 0 } },
  { id: 'diverge', label: 'Divergence: Q under-stated', values: { q: 0.0004, r: 0.3, x0: 6 } },
] as const

/** The EKF's nonlinear measurement model. */
export function hMeas(x: number): number {
  return 8 * Math.sin(x / 4)
}

function truthAt(k: number): number {
  // Smooth, bounded and deterministic: two incommensurate sinusoids.
  const t = k * DT
  return 4 * Math.sin(0.5 * t) + 1.6 * Math.sin(1.35 * t + 0.7)
}

export function runKalman(p: KalmanParams): KalmanResult {
  const noise = gaussian(mulberry32(42))
  const truth: number[] = []
  const z: number[] = []
  const estimate: number[] = []
  const sigma: number[] = []

  let x = p.x0
  let cov = 1
  let linPoint: number | null = null
  let jacobian: number | null = null

  for (let k = 0; k < KALMAN_N; k++) {
    const xt = truthAt(k)
    truth.push(xt)

    // Predict under a random-walk model: state carried, covariance grows by Q.
    const xPred = x
    const covPred = cov + p.q

    if (p.mode === 'kf') {
      const zk = xt + R_TRUE * noise()
      z.push(zk)
      const K = covPred / (covPred + p.r)
      x = xPred + K * (zk - xPred)
      cov = (1 - K) * covPred
    } else {
      const zk = hMeas(xt) + R_TRUE * noise()
      z.push(zk)
      // Linearise the measurement about the prediction.
      const H = 2 * Math.cos(xPred / 4)
      linPoint = xPred
      jacobian = H
      const S = H * covPred * H + p.r
      const K = (covPred * H) / S
      x = xPred + K * (zk - hMeas(xPred))
      cov = (1 - K * H) * covPred
    }

    estimate.push(x)
    sigma.push(Math.sqrt(Math.max(cov, 0)))
  }

  const rmse = (a: readonly number[], b: readonly number[]) =>
    Math.sqrt(a.reduce((s, v, i) => s + (v - (b[i] ?? 0)) ** 2, 0) / a.length)

  // For the EKF the raw measurement is in z-space, so raw RMSE is taken
  // against the true measurement h(truth); on the KF tab z measures x
  // directly and the comparison is against the truth itself.
  const rmseRaw = p.mode === 'kf' ? rmse(z, truth) : rmse(z, truth.map(hMeas))

  return {
    truth,
    z,
    estimate,
    sigma,
    rmseRaw: Number(rmseRaw.toFixed(3)),
    rmseFiltered: Number(rmse(estimate, truth).toFixed(3)),
    linPoint: linPoint === null ? null : Number(linPoint.toFixed(2)),
    jacobian: jacobian === null ? null : Number(jacobian.toFixed(3)),
  }
}

/** The default the lab opens on: the balanced KF preset. */
export const KALMAN_DEFAULTS: KalmanParams = { mode: 'kf', ...KALMAN_PRESETS[0].values }
