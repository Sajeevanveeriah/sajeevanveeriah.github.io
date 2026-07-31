/**
 * Tiny deterministic chart helpers shared by the lab widgets and their
 * server-rendered static fallbacks. Pure functions of their inputs, so the
 * build-time render and the client render agree to the pixel.
 */

export interface ChartFrame {
  readonly width: number
  readonly height: number
  readonly padLeft: number
  readonly padRight: number
  readonly padTop: number
  readonly padBottom: number
  readonly xMin: number
  readonly xMax: number
  readonly yMin: number
  readonly yMax: number
}

export function xScale(frame: ChartFrame, x: number): number {
  const inner = frame.width - frame.padLeft - frame.padRight
  return frame.padLeft + ((x - frame.xMin) / (frame.xMax - frame.xMin)) * inner
}

export function yScale(frame: ChartFrame, y: number): number {
  const inner = frame.height - frame.padTop - frame.padBottom
  return frame.height - frame.padBottom - ((y - frame.yMin) / (frame.yMax - frame.yMin)) * inner
}

/** Polyline `points` attribute for a series, rounded to keep markup small. */
export function polyPoints(
  frame: ChartFrame,
  xs: readonly number[],
  ys: readonly number[],
): string {
  const pts: string[] = []
  for (let i = 0; i < xs.length; i += 1) {
    pts.push(
      `${xScale(frame, xs[i] ?? 0).toFixed(1)},${yScale(frame, ys[i] ?? 0).toFixed(1)}`,
    )
  }
  return pts.join(' ')
}

/** Closed polygon for a symmetric band around a centre series. */
export function bandPath(
  frame: ChartFrame,
  xs: readonly number[],
  centre: readonly number[],
  halfWidth: readonly number[],
): string {
  const upper: string[] = []
  const lower: string[] = []
  for (let i = 0; i < xs.length; i += 1) {
    const x = xScale(frame, xs[i] ?? 0).toFixed(1)
    const c = centre[i] ?? 0
    const h = halfWidth[i] ?? 0
    upper.push(`${x},${yScale(frame, c + h).toFixed(1)}`)
    lower.push(`${x},${yScale(frame, c - h).toFixed(1)}`)
  }
  lower.reverse()
  return `${upper.join(' ')} ${lower.join(' ')}`
}
