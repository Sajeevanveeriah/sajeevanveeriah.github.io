/** Lucide arrow-up-right and arrow-left, inline. No icon font, no sprite, no
 *  runtime request. Square caps: the system has no rounded geometry. */

type IconProps = { readonly size?: number }

const shared = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'square',
  'aria-hidden': true,
} as const

export function ArrowUpRight({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} {...shared}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

export function ArrowLeft({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} {...shared}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}
