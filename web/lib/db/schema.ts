export interface UserProfile {
  id: string
  email: string
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AIMemory {
  id: string
  user_id: string
  content: string
  embedding: number[]
  metadata: Record<string, unknown>
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  metadata: Record<string, unknown>
  timestamp: string
}

export interface InsertAIMemory {
  user_id: string
  content: string
  embedding: number[]
  metadata?: Record<string, unknown>
}

export interface InsertActivityLog {
  user_id?: string
  action: string
  metadata?: Record<string, unknown>
}
