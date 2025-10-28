export interface SupabaseConfig {
  url: string
  anonKey: string
}

export interface AIConfig {
  openaiKey: string
  geminiKey: string
}

export interface MCPConfig {
  url: string
  apiKey: string
}

export interface UserSession {
  userId: string
  email: string
  accessToken: string
}

export interface AIMemory {
  id: string
  userId: string
  content: string
  embedding: number[]
  metadata: Record<string, unknown>
  createdAt: string
}

export interface ActionLog {
  id: string
  userId: string
  action: string
  metadata: Record<string, unknown>
  timestamp: string
}

export type MessageType = 
  | 'SECURE_API_CALL'
  | 'DOM_CAPTURE'
  | 'SCREENSHOT_CAPTURE'
  | 'EXECUTE_ACTION'
  | 'PARSE_DOM'
  | 'ANALYZE_VISION'
  | 'STORE_MEMORY'

export interface ExtensionMessage<T = unknown> {
  type: MessageType
  data: T
  requestId: string
}

export interface ExtensionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  requestId: string
}
