import { createServerSupabaseClient } from '../supabase/server'
import type { AIMemory, InsertAIMemory } from './schema'

export async function insertMemory(data: InsertAIMemory): Promise<AIMemory> {
  const supabase = await createServerSupabaseClient()
  
  const { data: memory, error } = await supabase
    .from('ai_memory')
    .insert(data)
    .select()
    .single()

  if (error || !memory) throw new Error(`Failed to insert memory: ${error?.message ?? 'Unknown error'}`)
  return memory as AIMemory
}

export async function searchSimilarMemories(
  userId: string,
  embedding: number[],
  limit = 10,
  threshold = 0.8
): Promise<AIMemory[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.rpc('search_memories', {
    query_embedding: embedding,
    query_user_id: userId,
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) throw new Error(`Failed to search memories: ${error.message}`)
  return (data ?? []) as AIMemory[]
}

export async function getUserMemories(
  userId: string,
  limit = 50
): Promise<AIMemory[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('ai_memory')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to get memories: ${error.message}`)
  return (data ?? []) as AIMemory[]
}
