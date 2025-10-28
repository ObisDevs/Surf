import type {
  PlanRequest,
  PlanResponse,
  VisionRequest,
  VisionResponse,
  MemoryRequest,
  MemorySearchRequest,
  MemoryResponse,
  FeedbackRequest,
  FeedbackResponse,
} from '@shared/types/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error ?? 'Request failed')
  }

  return response.json()
}

export async function generatePlan(request: PlanRequest): Promise<PlanResponse> {
  return fetchAPI<PlanResponse>('/api/plan', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function analyzeVision(request: VisionRequest): Promise<VisionResponse> {
  return fetchAPI<VisionResponse>('/api/vision', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function storeMemory(request: MemoryRequest): Promise<MemoryResponse> {
  return fetchAPI<MemoryResponse>('/api/memory', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function searchMemory(request: MemorySearchRequest): Promise<MemoryResponse> {
  const params = new URLSearchParams({
    userId: request.userId,
    query: request.query,
  })
  return fetchAPI<MemoryResponse>(`/api/memory?${params.toString()}`)
}

export async function sendFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  return fetchAPI<FeedbackResponse>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
