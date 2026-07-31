/**
 * Deterministic step-response simulation of a PID controller driving a
 * second-order plant.
 *
 * The plant is a unit-mass spring-damper, x'' = (u - c x' - k x) / m, with
 * m = 1 kg, c = 0.8 N s/m and k = 4 N/m, giving a natural frequency of
 * 2 rad/s and a damping ratio of 0.2: underdamped enough that untuned gains
 * visibly ring. Integration is fixed-step RK4 at 5 ms over 8 s, so the same
 * gains always produce the same trace at build time and in the browser.
 */

export interface PidMetrics {
  /** Peak overshoot above the setpoint, as a percentage of the setpoint. */
  readonly overshootPct: number
  /** Time to stay inside a 2 percent band of the setpoint, in seconds, or null. */
  readonly settlingTime: number | null
  /** 10 to 90 percent rise time in seconds, or null if never reached. */
  readonly riseTime: number | null
  /** Absolute error to the setpoint at the end of the horizon. */
  readonly steadyStateError: number
}

export interface PidResponse {
  /** Sample times in seconds. */
  readonly t: readonly number[]
  /** Plant position at each sample. */
  readonly y: readonly number[]
  readonly metrics: PidMetrics
}

export const PID_HORIZON = 8
export const PID_SETPOINT = 1

const M = 1
const C = 0.8
const K = 4
const DT = 0.005
/** Actuator saturation, so extreme gains behave like a real drive rather than
    an unbounded ideal force. */
const U_MAX = 40

export function simulatePid(kp: number, ki: number, kd: number): PidResponse {
  const steps = Math.round(PID_HORIZON / DT)
  const t: number[] = []
  const y: number[] = []

  let x = 0
  let v = 0
  let integral = 0
  let prevErr = PID_SETPOINT

  for (let i = 0; i <= steps; i += 1) {
    const time = i * DT
    const err = PID_SETPOINT - x

    /* Derivative on error with a first-difference estimate; the integral is
       clamped so windup against the saturated actuator stays bounded. */
    integral += err * DT
    integral = Math.max(-10, Math.min(10, integral))
    const dErr = i === 0 ? 0 : (err - prevErr) / DT
    prevErr = err

    let u = kp * err + ki * integral + kd * dErr
    u = Math.max(-U_MAX, Math.min(U_MAX, u))

    /* Record before stepping so t = 0 shows the initial rest state. */
    if (i % 4 === 0 || i === steps) {
      t.push(Number(time.toFixed(3)))
      y.push(x)
    }

    const accel = (px: number, pv: number) => (u - C * pv - K * px) / M
    const k1v = accel(x, v)
    const k1x = v
    const k2v = accel(x + (k1x * DT) / 2, v + (k1v * DT) / 2)
    const k2x = v + (k1v * DT) / 2
    const k3v = accel(x + (k2x * DT) / 2, v + (k2v * DT) / 2)
    const k3x = v + (k2v * DT) / 2
    const k4v = accel(x + k3x * DT, v + k3v * DT)
    const k4x = v + k3v * DT
    x += ((k1x + 2 * k2x + 2 * k3x + k4x) / 6) * DT
    v += ((k1v + 2 * k2v + 2 * k3v + k4v) / 6) * DT
  }

  return { t, y, metrics: computeMetrics(t, y) }
}

function computeMetrics(t: readonly number[], y: readonly number[]): PidMetrics {
  const sp = PID_SETPOINT
  let peak = -Infinity
  for (const v of y) peak = Math.max(peak, v)
  const overshootPct = Math.max(0, ((peak - sp) / sp) * 100)

  const band = 0.02 * sp
  let settlingTime: number | null = null
  for (let i = y.length - 1; i >= 0; i -= 1) {
    if (Math.abs((y[i] ?? 0) - sp) > band) {
      settlingTime = i + 1 < y.length ? (t[i + 1] ?? null) : null
      break
    }
    if (i === 0) settlingTime = t[0] ?? null
  }
  /* If the response never leaves the band it settled immediately; if the last
     sample is outside the band it never settled inside the horizon. */
  if (Math.abs((y[y.length - 1] ?? 0) - sp) > band) settlingTime = null

  let t10: number | null = null
  let t90: number | null = null
  for (let i = 0; i < y.length; i += 1) {
    if (t10 === null && (y[i] ?? 0) >= 0.1 * sp) t10 = t[i] ?? null
    if (t90 === null && (y[i] ?? 0) >= 0.9 * sp) {
      t90 = t[i] ?? null
      break
    }
  }
  const riseTime = t10 !== null && t90 !== null ? Number((t90 - t10).toFixed(3)) : null

  return {
    overshootPct: Number(overshootPct.toFixed(1)),
    settlingTime: settlingTime === null ? null : Number(settlingTime.toFixed(2)),
    riseTime,
    steadyStateError: Number(Math.abs((y[y.length - 1] ?? 0) - sp).toFixed(4)),
  }
}

/** The gains each slider opens on: deliberately underdamped so the first
    interaction has something visible to improve. */
export const PID_DEFAULTS = { kp: 4, ki: 1, kd: 0.4 } as const
