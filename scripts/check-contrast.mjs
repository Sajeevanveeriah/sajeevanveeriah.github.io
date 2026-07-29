#!/usr/bin/env node
import { readFileSync } from 'node:fs'
const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
const token = n => { const m = css.match(new RegExp(`--${n}:\\s*(#[0-9a-f]{6})`, 'i')); if (!m) throw new Error(`token --${n} not found`); return m[1] }
const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4)
const lum = h => { const [r,g,b]=rgb(h); return .2126*r+.7152*g+.0722*b }
const ratio = (a,b) => { const x=lum(token(a)),y=lum(token(b)); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05) }
const checks = [['text','bg',4.5],['text-muted','bg',4.5],['text','surface',4.5],['text-muted','surface',4.5],['accent-text','bg',4.5],['accent-text','surface',4.5],['on-accent','accent-fill',4.5],['focus-ring','surface',3]]
let failures=0
for (const [a,b,min] of checks) { const r=ratio(a,b); const pass=r>=min; if(!pass) failures++; console.log(`${a} on ${b}: ${r.toFixed(2)}:1, need ${min}: ${pass?'PASS':'FAIL'}`) }
console.log(`Gated pairs failing: ${failures}`)
process.exit(failures?1:0)
