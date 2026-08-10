import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['out/**', '.next/**', 'node_modules/**', 'archive/**', 'main.js', 'next-env.d.ts'] },
]

export default config
