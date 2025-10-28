interface RateLimitStore {
  [key: string]: { count: number; resetAt: number }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const record = store[identifier]

  if (!record || now > record.resetAt) {
    store[identifier] = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    return true
  }

  if (record.count >= config.maxRequests) {
    return false
  }

  record.count++
  return true
}

export function getRateLimitIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] ?? 'unknown'
  return ip
}
