export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          preferences?: Json
        }
        Update: {
          email?: string
          preferences?: Json
        }
      }
      ai_memory: {
        Row: {
          id: string
          user_id: string
          content: string
          embedding: number[]
          metadata: Json
          created_at: string
        }
        Insert: {
          user_id: string
          content: string
          embedding: number[]
          metadata?: Json
        }
        Update: {
          content?: string
          embedding?: number[]
          metadata?: Json
        }
      }
      logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          metadata: Json
          timestamp: string
        }
        Insert: {
          user_id?: string | null
          action: string
          metadata?: Json
        }
        Update: {
          action?: string
          metadata?: Json
        }
      }
    }
    Functions: {
      search_memories: {
        Args: {
          query_embedding: number[]
          query_user_id: string
          match_threshold?: number
          match_count?: number
        }
        Returns: Array<{
          id: string
          user_id: string
          content: string
          embedding: number[]
          metadata: Json
          created_at: string
          similarity: number
        }>
      }
    }
  }
}
