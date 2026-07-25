#!/usr/bin/env node
/**
 * Pre-compress the case-study images to AVIF and WebP.
 *
 * `images: { unoptimized: true }` is mandatory for a static export, which
 * means Next does nothing to these files. They therefore have to be
 * compressed at authoring time or the export ships multi-megabyte PNGs.
 *
 * Originals are retained untouched; the derivatives sit alongside them and
 * are offered through <picture> with the original as the final fallback.
 */
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'image')
const files = (await readdir(dir)).filter((f) => extname(f).toLowerCase() === '.png')

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
let before = 0
let after = 0

for (const file of files) {
  const src = join(dir, file)
  const stem = basename(file, extname(file))
  const original = (await stat(src)).size
  before += original

  const avifPath = join(dir, `${stem}.avif`)
  const webpPath = join(dir, `${stem}.webp`)

  await sharp(src).avif({ quality: 55, effort: 6 }).toFile(avifPath)
  await sharp(src).webp({ quality: 78, effort: 5 }).toFile(webpPath)

  const a = (await stat(avifPath)).size
  const w = (await stat(webpPath)).size
  after += a

  console.log(
    `${stem}\n  png ${kb(original).padStart(9)}  ->  avif ${kb(a).padStart(8)}  webp ${kb(w).padStart(8)}  ` +
      `(avif ${(100 - (a / original) * 100).toFixed(1)}% smaller)`,
  )
}

console.log(
  `\nTotal PNG ${kb(before)}  ->  total AVIF ${kb(after)}  ` +
    `(${(100 - (after / before) * 100).toFixed(1)}% smaller across ${files.length} images)`,
)
