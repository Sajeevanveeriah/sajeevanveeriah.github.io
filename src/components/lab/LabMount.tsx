'use client'

import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react'

export type LabWidgetId = 'path-planner' | 'pid-tuning' | 'kalman-filter'

/**
 * Progressive-enhancement mount for a lab widget.
 *
 * The server renders `children`: the complete static fallback, computed by
 * the same engine the widget uses. Without JavaScript that fallback simply
 * remains the page. With JavaScript, the widget chunk loads lazily after
 * mount and replaces it, and the fallback stays up during the load so
 * nothing blanks. None of the widget code is in the initial bundle.
 */
const WIDGETS: Record<LabWidgetId, ComponentType<{ compact?: boolean }>> = {
  'path-planner': lazy(() =>
    import('./PathPlannerLab').then((m) => ({ default: m.PathPlannerLab })),
  ),
  'pid-tuning': lazy(() => import('./PidLab').then((m) => ({ default: m.PidLab }))),
  'kalman-filter': lazy(() => import('./KalmanLab').then((m) => ({ default: m.KalmanLab }))),
}

export function LabMount({
  lab,
  compact = false,
  children,
}: {
  lab: LabWidgetId
  compact?: boolean
  children: ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return <>{children}</>

  const Widget = WIDGETS[lab]
  return (
    <Suspense fallback={children}>
      <Widget compact={compact} />
    </Suspense>
  )
}
