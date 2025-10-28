export function validateUserId(userId: unknown): string {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid userId')
  }
  return userId
}

export function validateContent(content: unknown): string {
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Invalid content')
  }
  if (content.length > 50000) {
    throw new Error('Content too long')
  }
  return content
}

export function validateImageUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('Invalid image URL')
  }
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL format')
  }
  return url
}

export function sanitizeMetadata(metadata: unknown): Record<string, unknown> {
  if (metadata === null || metadata === undefined || typeof metadata !== 'object') {
    return {}
  }
  return metadata as Record<string, unknown>
}
