import { NextRequest, NextResponse } from 'next/server'
import { insertLog } from '@/lib/db/logs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, action, metadata } = await req.json() as {
      userId?: string
      action: string
      metadata?: Record<string, unknown>
    }

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    const log = await insertLog({ user_id: userId, action, metadata })

    return NextResponse.json({ success: true, data: log })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
