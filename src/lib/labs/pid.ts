/**
 * PID against a fixed second-order plant, simulated with a fixed-step
 * integrator so the response is deterministic for a given gain set.
 *
 * Plant: m x'' + c x' + k x = u, with m = 1, c = 1.2, k = 1. The actuator
 * saturates at +-3, which is what makes integral windup demonstrable, and
 * the derivative term acts on the measurement so a setpoint step does not
 * kick it.
 */

export interface PidParams {
  readonly kp: number
  readonly ki: number
  readonly kd: number
  /** Integrator clamp on or off; off is the windup demonstration. */
  readonly clamp: boolean
}

export interface PidResult {
  /** Sampled response y(t), one point per DT step. */
  readonly y: readonly number[]
  /** Saturated actuator effort u(t), same sampling. */
  readonly u: readonly number[]
  readonly overshoot: number
  readonly riseTime: number | null
  readonly settlingTime: number | null
  readonly steadyStateError: number
}

export const PID_DT = 0.01
export const PID_T = 8
export const U_MAX = 3

export const PID_PRESETS = [
  { id: 'under', label: 'Under-damped', values: { kp: 16, ki: 0, kd: 0.4, clamp: true } },
  { id: 'critical', label: 'Critically damped', values: { kp: 16, ki: 0, kd: 6, clamp: true } },
  { id: 'over', label: 'Over-damped', values: { kp: 16, ki: 0, kd: 16, clamp: true } },
  { id: 'windup', label: 'Windup, no clamp', values: { kp: 6, ki: 14, kd: 1.5, clamp: false } },
  { id: 'clamped', label: 'Windup, clamped', values: { kp: 6, ki: 14, kd: 1.5, clamp: true } },
] as const

export function runPid(p: PidParams): PidResult {
  const n = Math.round(PID_T / PID_DT)
  const y: number[] = new Array(n)
  const u: number[] = new Array(n)
  const target = 1

  let x = 0
  let v = 0
  let integral = 0
  let prevY = 0

  for (let i = 0; i < n; i++) {
    const err = target - x
    integral += err * PID_DT
    if (p.clamp) {
      // Clamp the integrator so its stored effort can never exceed what the
      // saturated actuator could deliver on its own.
      const lim = p.ki > 0 ? U_MAX / p.ki : 0
      integral = Math.max(-lim, Math.min(lim, integral))
    }
    const dMeas = (x - prevY) / PID_DT
    prevY = x
    const raw = p.kp * err + p.ki * integral - p.kd * dMeas
    const eff = Math.max(-U_MAX, Math.min(U_MAX, raw))

    // Semi-implicit Euler on the fixed plant, stable at this step size.
    const acc = eff - 1.2 * v - 1 * x
    v += acc * PID_DT
    x += v * PID_DT

    y[i] = x
    u[i] = eff
  }

  // Metrics, all against the unit step target.
  const peak = Math.max(...y)
  const overshoot = Math.max(0, ((peak - target) / target) * 100)

  const t10 = y.findIndex((v0) => v0 >= 0.1 * target)
  const t90 = y.findIndex((v0) => v0 >= 0.9 * target)
  const riseTime = t10 >= 0 && t90 >= 0 ? (t90 - t10) * PID_DT : null

  let settlingTime: number | null = null
  for (let i = n - 1; i >= 0; i--) {
    if (Math.abs((y[i] ?? 0) - target) > 0.02 * target) {
      settlingTime = i + 1 < n ? (i + 1) * PID_DT : null
      break
    }
    if (i === 0) settlingTime = 0
  }

  const tail = y.slice(n - Math.round(0.5 / PID_DT))
  const steadyStateError = Math.abs(target - tail.reduce((a, b) => a + b, 0) / tail.length)

  return {
    y,
    u,
    overshoot: Number(overshoot.toFixed(1)),
    riseTime: riseTime === null ? null : Number(riseTime.toFixed(2)),
    settlingTime: settlingTime === null ? null : Number(settlingTime.toFixed(2)),
    steadyStateError: Number(steadyStateError.toFixed(3)),
  }
}

/** The default gain set the lab opens on: the under-damped preset. */
export const PID_DEFAULTS: PidParams = PID_PRESETS[0].values
