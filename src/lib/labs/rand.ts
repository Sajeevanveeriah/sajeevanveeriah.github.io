/**
 * Deterministic PRNG for the concept labs.
 *
 * Every lab is seeded, so identical inputs produce identical output on every
 * load. mulberry32 is small, well distributed for this purpose and has no
 * dependency; gaussian() draws via Box-Muller so noise streams are normal.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function gaussian(rand: () => number): () => number {
  return () => {
    // Box-Muller; u is kept away from zero so log(u) stays finite.
    const u = Math.max(rand(), 1e-12)
    const v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
}
