import { NextRequest, NextResponse } from 'next/server'
import { analyzeVision } from '@/lib/ai'
import { insertLog } from '@/lib/db/logs'
import { rateLimit, getRateLimitIdentifier } from '@/lib/middleware/rateLimit'
import { validateUserId, validateImageUrl, validateContent } from '@/lib/middleware/validation'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const identifier = getRateLimitIdentifier(req)
    if (!rateLimit(identifier, { maxRequests: 10, windowMs: 60000 })) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json() as {
      userId: unknown
      imageUrl?: unknown
      imageData?: unknown
      prompt: unknown
    }

    const userId = validateUserId(body.userId)
    const prompt = validateContent(body.prompt)

    let analysis: string

    if (body.imageUrl) {
      const imageUrl = validateImageUrl(body.imageUrl)
      analysis = await analyzeVision({
        imageUrl,
        prompt,
        provider: 'openai',
        userId,
      })
    } else if (body.imageData && typeof body.imageData === 'string') {
      analysis = await analyzeVision({
        imageData: body.imageData,
        prompt,
        provider: 'gemini',
        userId,
      })
    } else {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 })
    }

    await insertLog({
      user_id: userId,
      action: 'vision_analysis',
      metadata: { prompt_length: prompt.length },
    })

    return NextResponse.json({ success: true, data: { analysis } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
