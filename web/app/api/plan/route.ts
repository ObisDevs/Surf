import { NextRequest, NextResponse } from 'next/server'
import { generateResponse } from '@/lib/ai'
import { insertLog } from '@/lib/db/logs'
import { rateLimit, getRateLimitIdentifier } from '@/lib/middleware/rateLimit'
import { validateUserId, validateContent } from '@/lib/middleware/validation'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const identifier = getRateLimitIdentifier(req)
    if (!rateLimit(identifier, { maxRequests: 20, windowMs: 60000 })) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json() as {
      userId: unknown
      domContext: unknown
      task: unknown
    }

    const userId = validateUserId(body.userId)
    const domContext = validateContent(body.domContext)
    const task = validateContent(body.task)

    const prompt = `Task: ${task}\n\nDOM Context:\n${domContext}\n\nGenerate a JSON action plan with steps to complete this task.`

    const plan = await generateResponse({
      prompt,
      provider: 'openai',
      userId,
    })

    await insertLog({
      user_id: userId,
      action: 'plan_generated',
      metadata: { task_length: task.length },
    })

    return NextResponse.json({ success: true, data: { plan } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
