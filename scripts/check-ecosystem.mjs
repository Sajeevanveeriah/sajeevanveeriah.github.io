#!/usr/bin/env node
/**
 * Ecosystem catalogue gate.
 *
 * Two phases, in this order and deliberately so:
 *
 *   1. Self-test. Run the validator against deliberately defective in-memory
 *      fixtures and confirm each one is caught. A validator nobody has seen
 *      fail is not evidence of anything, so if any fixture passes validation
 *      this script fails before it ever looks at the real data.
 *   2. Validate the real catalogue and report coverage.
 *
 * The content layer is TypeScript, so it is compiled to a scratch directory
 * outside the repository with the TypeScript already in devDependencies. No
 * build artefact is written into the working tree.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = mkdtempSync(join(tmpdir(), 'ecosystem-check-'))

function fail(message) {
  console.error(`\n${message}`)
  rmSync(out, { recursive: true, force: true })
  process.exit(1)
}

// ---- Compile the content layer -----------------------------------------
const tsconfig = join(out, 'tsconfig.check.json')
writeFileSync(
  tsconfig,
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'commonjs',
      moduleResolution: 'node',
      outDir: out,
      rootDir: join(ROOT, 'src'),
      strict: true,
      skipLibCheck: true,
      noEmit: false,
      esModuleInterop: true,
    },
    files: [join(ROOT, 'src/content/ecosystem/index.ts')],
  }),
)

try {
  execFileSync(process.execPath, [join(ROOT, 'node_modules/typescript/bin/tsc'), '-p', tsconfig], {
    stdio: 'pipe',
  })
} catch (error) {
  const detail = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim()
  fail(`Ecosystem content failed to compile:\n${detail}`)
}

const require = createRequire(import.meta.url)
const mod = require(join(out, 'content/ecosystem/index.js'))
const { validateEcosystem, ecosystemData, counts, entities, scopeMappings, REQUIRED_SEARCH_TERMS } = mod

// ---- Phase 1: prove the validator catches defects ------------------------
console.log('--- Validator self-test against defective fixtures ---')

/** A minimal dataset that must validate clean, used as the mutation base. */
function goodFixture() {
  return {
    pillars: [{ id: 'p1', slug: 'p1', name: 'P1', shortName: 'P1', summary: 's', purpose: 'p', order: 1 }],
    domains: [{ id: 'd1', slug: 'd1', name: 'D1', pillarId: 'p1', summary: 's', order: 1 }],
    categories: [{ id: 'c1', name: 'C1' }],
    sources: [
      { id: 's1', title: 'T', url: 'https://example.invalid', sourceType: 'official', reviewedAt: '2026-07-30' },
    ],
    entities: [
      {
        id: 'e1',
        slug: 'e1',
        name: 'Widget',
        aliases: ['W'],
        kind: 'software',
        pillarIds: ['p1'],
        domainIds: ['d1'],
        categoryIds: ['c1'],
        summary: 'A neutral catalogue description of a widget, long enough to pass.',
        useCases: ['Doing widget things'],
        lifecycle: 'current',
        lifecycleAsOf: '2026-07-30',
        officialSourceIds: ['s1'],
        coverageKind: 'ecosystem-reference',
        keywords: ['widget'],
      },
    ],
    scope: [{ suppliedTerm: 'Widget', canonicalEntityId: 'e1', resolution: 'canonical' }],
    requiredTerms: ['Widget'],
  }
}

const baseline = validateEcosystem(goodFixture())
if (baseline.length !== 0) {
  fail(`Self-test base fixture should validate clean but reported:\n${baseline.map((p) => `  ${p.rule}: ${p.detail}`).join('\n')}`)
}
console.log('  PASS  clean fixture validates with zero problems')

const cases = [
  {
    name: 'duplicate ID',
    rule: 'duplicate-id',
    mutate: (d) => {
      d.entities.push({ ...d.entities[0], slug: 'e1-copy' })
    },
  },
  {
    name: 'duplicate slug',
    rule: 'duplicate-slug',
    mutate: (d) => {
      d.entities.push({ ...d.entities[0], id: 'e2' })
    },
  },
  {
    name: 'missing required term',
    rule: 'missing-required-term',
    mutate: (d) => {
      d.requiredTerms = ['Nonexistent Thing']
    },
  },
  {
    name: 'broken domain reference',
    rule: 'unresolved-domain',
    mutate: (d) => {
      d.entities[0].domainIds = ['does-not-exist']
    },
  },
  {
    name: 'profile item without evidence references',
    rule: 'tier-without-evidence',
    mutate: (d) => {
      d.entities[0].coverageKind = 'profile'
      d.entities[0].profile = {
        evidenceTier: 'delivered',
        evidenceRefs: [],
        scopeNote: 'note',
        assignedBySaj: true,
      }
    },
  },
  {
    name: 'profile item without a Saj-assigned tier',
    rule: 'profile-without-tier',
    mutate: (d) => {
      d.entities[0].coverageKind = 'profile'
      d.entities[0].profile = {
        evidenceTier: undefined,
        evidenceRefs: ['/work/example/'],
        scopeNote: 'note',
        assignedBySaj: true,
      }
    },
  },
  {
    name: 'ecosystem entry rendered as a personal claim',
    rule: 'reference-rendered-as-personal-claim',
    mutate: (d) => {
      d.entities[0].summary = 'I use this widget daily and it is central to my expertise on every project.'
    },
  },
  {
    name: 'unverified "latest" wording',
    rule: 'undated-currency-wording',
    mutate: (d) => {
      d.entities[0].summary = 'The latest and greatest widget available anywhere today, bar none.'
      delete d.entities[0].lifecycleAsOf
    },
  },
  {
    name: 'currency claim with no source and no review date',
    rule: 'unsourced-currency-claim',
    mutate: (d) => {
      d.entities[0].officialSourceIds = []
      delete d.entities[0].lifecycleAsOf
    },
  },
  {
    name: 'invalid lifecycle value',
    rule: 'invalid-lifecycle',
    mutate: (d) => {
      d.entities[0].lifecycle = 'brand-new'
    },
  },
  {
    name: 'orphan entity with no pillar',
    rule: 'orphan-entity',
    mutate: (d) => {
      d.entities[0].pillarIds = []
    },
  },
  {
    name: 'empty summary',
    rule: 'empty-summary',
    mutate: (d) => {
      d.entities[0].summary = ''
    },
  },
  {
    name: 'unresolved scope mapping',
    rule: 'unresolved-scope-mapping',
    mutate: (d) => {
      d.scope.push({ suppliedTerm: 'Ghost', canonicalEntityId: 'nope', resolution: 'canonical' })
    },
  },
  {
    name: 'conflicting canonical alias',
    rule: 'conflicting-alias',
    mutate: (d) => {
      d.entities.push({ ...d.entities[0], id: 'e2', slug: 'e2', name: 'Other', aliases: ['Widget'] })
    },
  },
  {
    name: 'standard without edition or owner metadata',
    rule: 'standard-without-edition',
    mutate: (d) => {
      d.entities[0].kind = 'standard'
      d.entities[0].summary = 'A standard with no stated edition or publication year at all.'
    },
  },
  {
    name: 'ecosystem reference carrying a profile block',
    rule: 'ecosystem-reference-with-profile',
    mutate: (d) => {
      d.entities[0].profile = {
        evidenceTier: 'delivered',
        evidenceRefs: ['/work/example/'],
        scopeNote: 'note',
        assignedBySaj: true,
      }
    },
  },
]

let selfTestFailures = 0
for (const testCase of cases) {
  const data = goodFixture()
  testCase.mutate(data)
  const problems = validateEcosystem(data)
  const caught = problems.some((p) => p.rule === testCase.rule)
  if (!caught) {
    selfTestFailures++
    console.log(
      `  FAIL  ${testCase.name}: expected rule "${testCase.rule}", got [${problems.map((p) => p.rule).join(', ') || 'none'}]`,
    )
  } else {
    console.log(`  PASS  ${testCase.name} caught by "${testCase.rule}"`)
  }
}

if (selfTestFailures > 0) {
  fail(`${selfTestFailures} validator self-test(s) failed. The gate is not trustworthy; fix it before trusting the catalogue result.`)
}
console.log(`  ${cases.length + 1}/${cases.length + 1} self-tests passed.\n`)

// ---- Phase 2: validate the real catalogue -------------------------------
console.log('--- Catalogue validation ---')
const problems = validateEcosystem(ecosystemData)

if (problems.length > 0) {
  const grouped = new Map()
  for (const p of problems) grouped.set(p.rule, [...(grouped.get(p.rule) ?? []), p.detail])
  for (const [rule, details] of grouped) {
    console.log(`  ${rule} (${details.length}):`)
    for (const d of details.slice(0, 12)) console.log(`      ${d}`)
    if (details.length > 12) console.log(`      ... and ${details.length - 12} more`)
  }
  fail(`Catalogue validation failed with ${problems.length} problem(s).`)
}
console.log('  No problems.')

// ---- Coverage report -----------------------------------------------------
const resolved = new Set(scopeMappings.map((m) => m.canonicalEntityId))
const unresolved = scopeMappings.filter((m) => !entities.some((e) => e.id === m.canonicalEntityId))
const orphans = entities.filter((e) => e.pillarIds.length === 0 || e.domainIds.length === 0)
const coverage = scopeMappings.length === 0 ? 0 : ((scopeMappings.length - unresolved.length) / scopeMappings.length) * 100

console.log('\n--- Coverage ---')
console.log(`  Entities:                  ${counts.entities}`)
console.log(`  Models and variants:       ${counts.models}`)
console.log(`  Searchable names:          ${counts.searchableNames}`)
console.log(`  Pillars / domains:         ${counts.pillars} / ${counts.domains}`)
console.log(`  Sources:                   ${counts.sources}`)
console.log(`  Supplied terms mapped:     ${scopeMappings.length}`)
console.log(`  Entities referenced:       ${resolved.size}`)
console.log(`  Supplied-scope coverage:   ${coverage.toFixed(1)}%`)
console.log(`  Unresolved supplied terms: ${unresolved.length}`)
console.log(`  Orphan entities:           ${orphans.length}`)
console.log(`  Required search terms:     ${REQUIRED_SEARCH_TERMS.length} (all findable)`)
console.log(`  Coverage by kind:          profile ${counts.byCoverageKind.profile ?? 0}, ecosystem-reference ${counts.byCoverageKind['ecosystem-reference'] ?? 0}`)

console.log('\n  Lifecycle:')
for (const [k, v] of Object.entries(counts.byLifecycle).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${k.padEnd(14)} ${v}`)
}

rmSync(out, { recursive: true, force: true })

if (coverage < 100 || unresolved.length > 0 || orphans.length > 0) {
  console.error('\nCoverage contract not met.')
  process.exit(1)
}
console.log('\nEcosystem catalogue OK.')
