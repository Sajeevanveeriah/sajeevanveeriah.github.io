import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['out/**', '.next/**', 'node_modules/**', 'archive/**', 'main.js', 'next-env.d.ts'] },
  {
    files: ['desktop/**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['public/open-industrial-automation/app.js'],
    rules: {
      '@next/next/no-assign-module-variable': 'off',
    },
  },
]

export default config
