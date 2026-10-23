/**
 * The `sv` Worker. Static assets answer every request except /api/*, which
 * wrangler.jsonc routes here first (assets.run_worker_first).
 *
 * POST /api/contact relays the contact form through Resend, so the inbox
 * address lives only in Worker secrets and never reaches the page or the
 * browser bundle. Delivery needs three values, set with `wrangler secret put`:
 *   RESEND_API_KEY  Resend key with sending access
 *   CONTACT_TO      the inbox that receives enquiries
 *   CONTACT_FROM    a sender on a domain verified in Resend, e.g. "Portfolio <forms@example.com>"
 * Until all three exist the endpoint answers 503 and the form asks the
 * visitor to try again later. No address is ever sent to the browser.
 *
 * GET /api/contact/status reports only whether those values are present and
 * whether the rate limiter is bound, so post-deploy checks can see the relay
 * state without sending an email. Worker previews do not carry the rate limit
 * binding, so only production enforces it.
 */

interface Env {
  readonly ASSETS: { fetch(request: Request): Promise<Response> }
  /** Cloudflare rate limiting binding, keyed by visitor IP (wrangler.jsonc ratelimits). */
  readonly CONTACT_LIMIT?: { limit(options: { key: string }): Promise<{ success: boolean }> }
  readonly RESEND_API_KEY?: string
  readonly CONTACT_TO?: string
  readonly CONTACT_FROM?: string
}

const allowedOrigins = new Set(['https://sv.sajeevanveeriah.workers.dev', 'https://sajeevanveeriah.github.io'])
const topics = new Set(['Engineering role', 'Project or consulting work', 'Research collaboration', 'Something else'])
const limits = { name: 120, email: 200, organisation: 160, message: 4000 } as const

const configured = (env: Env) => Boolean(env.RESEND_API_KEY && env.CONTACT_TO && env.CONTACT_FROM)

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ')

async function contact(request: Request, env: Env) {
  const origin = request.headers.get('origin')
  if (origin && !allowedOrigins.has(origin) && !origin.startsWith('http://localhost') && !origin.startsWith('http://127.0.0.1'))
    return json(403, { ok: false, reason: 'origin' })
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json(415, { ok: false, reason: 'type' })

  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return json(400, { ok: false, reason: 'invalid' })
  }

  // The hidden field is off-screen and never filled by a person; a bot that fills it is told the message was sent.
  if (text(input.leave_blank, 200)) return json(200, { ok: true })

  // Throttle after the honeypot so dropped bot posts and the post-deploy probe never use a visitor's allowance.
  const visitor = request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (env.CONTACT_LIMIT && !(await env.CONTACT_LIMIT.limit({ key: visitor })).success) return json(429, { ok: false, reason: 'limited' })

  const name = oneLine(text(input.name, limits.name))
  const email = oneLine(text(input.email, limits.email))
  const organisation = oneLine(text(input.organisation, limits.organisation))
  const message = text(input.message, limits.message)
  const topic = topics.has(String(input.topic)) ? String(input.topic) : 'Something else'
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false, reason: 'invalid' })

  if (!configured(env)) return json(503, { ok: false, reason: 'unconfigured' })

  const body = [message, '', `Name: ${name}`, `Reply to: ${email}`, organisation && `Organisation: ${organisation}`, `Topic: ${topic}`, 'Sent from the portfolio contact form']
    .filter((line) => line !== '')
    .join('\n')
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email, subject: `${topic} - ${name}`, text: body }),
  }).catch(() => null)
  if (!sent?.ok) return json(502, { ok: false, reason: 'delivery' })
  return json(200, { ok: true })
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/contact/status') return json(200, { configured: configured(env), throttled: Boolean(env.CONTACT_LIMIT) })
    if (pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } })
      return contact(request, env)
    }
    return env.ASSETS.fetch(request)
  },
}

export default worker
