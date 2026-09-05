import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const root = resolve('out')
const hubs = ['atlas', 'contact', 'ecosystem', 'employers', 'lab', 'practice', 'skills', 'versatility']
// Live engineering records are excluded so redirects never overwrite pages.
const formerWork = [
  'upzy-supervised-routine-companion', 'modular-education-testing-robot',
  'engineering-mastery-lab', 'veerai-slm', 'adas-can-validation', 'emissions-compliance-testing',
  'iot-monitoring-platform', 'digital-twin-industrial-ai', 'manufacturing-qa-foundation',
  'carbon-revolution-rim-layup', 'idl-canning-line', 'ndcc-website',
  'inventory-scanning-mobile-robot', 'panelogram', 'snail-race',
]
const formerAtlas = [
  'mechatronics-and-systems-engineering', 'mechanical-design-materials-and-thermofluids',
  'electrical-systems-and-power', 'electronics-pcb-and-board-bring-up', 'embedded-systems-and-firmware',
  'control-systems', 'industrial-automation-plc-and-scada', 'robotics-and-autonomy',
  'ai-ml-and-data-science', 'software-engineering-and-devops', 'iot-and-edge-to-cloud-telemetry',
  'automotive-systems-and-validation', 'biomedical-and-clinical-devices',
  'manufacturing-production-and-quality', 'process-pharma-and-regulated-manufacturing',
  'civil-structural-and-infrastructure-awareness',
  'aerospace-space-marine-rail-defence-mining-agriculture-and-energy',
  'safety-reliability-standards-and-cyber-physical-security',
  'project-delivery-commissioning-and-handover',
]
const formerLabs = ['path-planner', 'pid-tuning', 'kalman-filter', 'occupancy-mapping']
const routes = [
  ...hubs.map((hub) => [hub]),
  ...formerWork.map((slug) => ['work', slug]),
  ...formerAtlas.map((slug) => ['atlas', slug]),
  ...formerLabs.map((slug) => ['lab', slug]),
]

function destination(segments) {
  if (segments[0] === 'contact') return '/#contact'
  if (segments[0] === 'work') return '/work/'
  if (['atlas', 'ecosystem', 'lab', 'practice', 'skills', 'versatility'].includes(segments[0])) return '/#practice'
  return '/'
}

for (const segments of routes) {
  const directory = join(root, ...segments)
  const target = destination(segments)
  const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://sajeevanveeriah.github.io${target}"><title>Page moved | Sajeevan Veeriah</title></head><body><main><h1>This material now continues in the concise portfolio.</h1><p><a href="${target}">Continue to the portfolio</a></p></main></body></html>`
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), html)
}

console.log(`Generated ${routes.length} legacy path redirects.`)
