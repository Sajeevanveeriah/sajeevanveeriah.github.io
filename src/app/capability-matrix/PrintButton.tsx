'use client'

import s from './matrix.module.css'

/** Enhancement only: without JavaScript the browser print menu does the same
    job, and the adjacent note says so. */
export function PrintButton() {
  return (
    <button type="button" className={s.printBtn} onClick={() => window.print()}>
      Print this matrix
    </button>
  )
}
