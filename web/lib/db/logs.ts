import { createServerSupabaseClient } from '../supabase/server'
import type { ActivityLog, InsertActivityLog } from './schema'

export async function insertLog(data: InsertActivityLog): Promise<ActivityLog> {
  const supabase = await createServerSupabaseClient()
  
  const { data: log, error } = await supabase
    .from('logs')
    .insert(data)
    .select()
    .single()

  if (error || !log) throw new Error(`Failed to insert log: ${error?.message ?? 'Unknown error'}`)
  return log as ActivityLog
}

export async function getUserLogs(
  userId: string,
  limit = 100
): Promise<ActivityLog[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to get logs: ${error.message}`)
  return (data ?? []) as ActivityLog[]
}
