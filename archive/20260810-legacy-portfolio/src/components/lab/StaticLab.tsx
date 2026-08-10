import type { ReactNode } from 'react'
import { runAstar, astarDefaults } from '@/lib/labs/astar'
import { runPid, PID_DEFAULTS } from '@/lib/labs/pid'
import { runKalman, KALMAN_DEFAULTS } from '@/lib/labs/kalman'
import { runOccupancy, OCC_DEFAULTS } from '@/lib/labs/occupancy'
import {
  AstarStaticFigure,
  astarReadouts,
  PidFigure,
  pidReadouts,
  KalmanFigure,
  kalmanReadouts,
  OccupancyFigure,
  occupancyReadouts,
  ReadoutTable,
  type Readout,
} from './figures'
import s from './lab.module.css'

/**
 * The server-rendered lab: each engine runs at build time on its seeded
 * defaults and the figure shows that computation's real final state. This is
 * the complete no-JavaScript page; LabMount swaps it for the interactive
 * module once that has loaded after mount.
 */
export function StaticLab({ slug }: { slug: string }) {
  let stage: ReactNode
  let rows: Readout[]
  let occ = false

  if (slug === 'path-planner') {
    const params = astarDefaults()
    const result = runAstar(params)
    stage = <AstarStaticFigure params={params} result={result} />
    rows = astarReadouts(result, null)
  } else if (slug === 'pid-tuning') {
    const result = runPid(PID_DEFAULTS)
    stage = <PidFigure result={result} />
    rows = pidReadouts(result)
  } else if (slug === 'kalman-filter') {
    const result = runKalman(KALMAN_DEFAULTS)
    stage = <KalmanFigure params={KALMAN_DEFAULTS} result={result} />
    rows = kalmanReadouts(KALMAN_DEFAULTS, result)
  } else {
    const result = runOccupancy(OCC_DEFAULTS)
    stage = <OccupancyFigure result={result} />
    rows = occupancyReadouts(result, OCC_DEFAULTS.beams)
    occ = true
  }

  return (
    <div className={s.module}>
      <div className={occ ? `${s.stage} ${s.occPlot}` : s.stage}>{stage}</div>
      <div className={s.side}>
        <ReadoutTable rows={rows} caption="Readouts at the seeded default parameters." />
      </div>
    </div>
  )
}
