export interface PlanRequest {
  userId: string
  domContext: string
  task: string
}

export interface PlanResponse {
  success: boolean
  data?: { plan: string }
  error?: string
}

export interface VisionRequest {
  userId: string
  imageUrl?: string
  imageData?: string
  prompt: string
}

export interface VisionResponse {
  success: boolean
  data?: { analysis: string }
  error?: string
}

export interface MemoryRequest {
  userId: string
  content: string
  metadata?: Record<string, unknown>
}

export interface MemorySearchRequest {
  userId: string
  query: string
}

export interface MemoryResponse {
  success: boolean
  data?: unknown
  error?: string
}

export interface FeedbackRequest {
  userId?: string
  action: string
  metadata?: Record<string, unknown>
}

export interface FeedbackResponse {
  success: boolean
  data?: unknown
  error?: string
}
