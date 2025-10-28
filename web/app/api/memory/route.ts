import { NextRequest, NextResponse } from 'next/server'
import { insertMemory, searchSimilarMemories } from '@/lib/db/memory'
import { generateEmbedding } from '@/lib/ai/embeddings'
import { insertLog } from '@/lib/db/logs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, content, metadata } = await req.json() as {
      userId: string
      content: string
      metadata?: Record<string, unknown>
    }

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const embedding = await generateEmbedding(content)
    const memory = await insertMemory({ user_id: userId, content, embedding, metadata })

    await insertLog({
      user_id: userId,
      action: 'memory_created',
      metadata: { memory_id: memory.id },
    })

    return NextResponse.json({ success: true, data: memory })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const query = searchParams.get('query')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (query) {
      const embedding = await generateEmbedding(query)
      const memories = await searchSimilarMemories(userId, embedding)
      return NextResponse.json({ success: true, data: memories })
    }

    return NextResponse.json({ success: true, data: [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
