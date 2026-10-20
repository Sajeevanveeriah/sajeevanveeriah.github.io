/**
 * The Voltwyn horizontal lockup from the brand kit
 * (20261017-Voltwyn-Logo-Horizontal-Rev00.svg), inline so the wordmark takes
 * the current text colour. The geometry is the kit's own: Night Navy tile,
 * Volt Amber mark, and wordmark strokes clipped flat at the cap and base
 * lines. The dark theme hides the tile, which gives the kit's reverse lockup.
 */
export function VoltwynLockup({ width = 240 }: { readonly width?: number }) {
  return (
    <svg className="lockup" viewBox="0 0 2010 560" width={width} height={Math.round((width * 560) / 2010)} role="img" aria-label="Voltwyn" focusable="false">
      <title>Voltwyn</title>
      <rect className="lockup-tile" x="80" y="80" width="400" height="400" rx="88" fill="#0f1e33" />
      <mask id="voltwyn-notch" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
        <rect width="200" height="200" fill="#fff" />
        <path d="M118,24 L96,92 L112,92 L84,180" fill="none" stroke="#000" strokeWidth="11" strokeLinejoin="miter" strokeMiterlimit="10" />
      </mask>
      <clipPath id="voltwyn-wordmark">
        <rect x="-20" y="0" width="790" height="100" />
      </clipPath>
      <g transform="translate(80,80) scale(2)">
        <polygon points="36,40 80,40 100,98 120,40 164,40 117,164 83,164" fill="#f5b700" mask="url(#voltwyn-notch)" />
      </g>
      <g transform="translate(580,190) scale(1.8)">
        <g clipPath="url(#voltwyn-wordmark)" fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="miter" strokeMiterlimit="10">
          <path d="M0,-12 L42,96 L84,-12" />
          <path d="M50,7 A43,43 0 1 1 49.99,7 Z" transform="translate(104,0)" />
          <path d="M7,-12 L7,93 L74,93" transform="translate(224,0)" />
          <path d="M-10,7 L94,7 M42,7 L42,112" transform="translate(318,0)" />
          <path d="M0,-12 L28,96 L59,22 L90,96 L118,-12" transform="translate(422,0)" />
          <path d="M0,-12 L42,52 L84,-12 M42,52 L42,112" transform="translate(560,0)" />
          <path d="M7,112 L7,7 L79,93 L79,-12" transform="translate(664,0)" />
        </g>
      </g>
    </svg>
  )
}
