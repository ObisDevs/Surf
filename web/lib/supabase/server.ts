import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../db/types'

export async function createServerSupabaseClient(): Promise<ReturnType<typeof createServerClient<Database>>> {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions): void {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Cookie setting only works in Server Components/Actions
          }
        },
        remove(name: string, options: CookieOptions): void {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Cookie removal only works in Server Components/Actions
          }
        },
      },
    }
  )
}
