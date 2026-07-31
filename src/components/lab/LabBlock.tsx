import { LabMount, type LabWidgetId } from './LabMount'
import { KalmanStatic, PathPlannerStatic, PidStatic } from './StaticFallbacks'

/**
 * One lab, assembled the progressive way round: the server renders the
 * complete computed fallback, and the interactive widget lazily replaces it
 * once JavaScript is up. This is the only component pages and embeds use, so
 * a lab can never ship without its fallback.
 */
export function LabBlock({ lab, compact = false }: { lab: LabWidgetId; compact?: boolean }) {
  const fallback =
    lab === 'path-planner' ? (
      <PathPlannerStatic compact={compact} />
    ) : lab === 'pid-tuning' ? (
      <PidStatic compact={compact} />
    ) : (
      <KalmanStatic compact={compact} />
    )

  return (
    <LabMount lab={lab} compact={compact}>
      {fallback}
    </LabMount>
  )
}
