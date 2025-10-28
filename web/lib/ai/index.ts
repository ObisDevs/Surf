import * as openai from './openai'
import * as gemini from './gemini'
import { insertLog } from '../db/logs'

export type AIProvider = 'openai' | 'gemini'

export interface AIRequest {
  prompt: string
  provider?: AIProvider
  userId?: string
}

export interface VisionRequest {
  imageUrl?: string
  imageData?: string
  prompt: string
  provider?: AIProvider
  userId?: string
}

export async function generateResponse(request: AIRequest): Promise<string> {
  const provider = request.provider ?? 'openai'

  try {
    let response: string

    if (provider === 'openai') {
      response = await openai.chat([{ role: 'user', content: request.prompt }])
    } else {
      response = await gemini.chat(request.prompt)
    }

    if (request.userId) {
      await insertLog({
        user_id: request.userId,
        action: 'ai_request',
        metadata: { provider, prompt_length: request.prompt.length },
      })
    }

    return response
  } catch (error) {
    if (provider === 'openai') {
      return gemini.chat(request.prompt)
    }
    throw error
  }
}

export async function analyzeVision(request: VisionRequest): Promise<string> {
  const provider = request.provider ?? 'openai'

  try {
    let response: string

    if (provider === 'openai' && request.imageUrl) {
      response = await openai.analyzeImage(request.imageUrl, request.prompt)
    } else if (provider === 'gemini' && request.imageData) {
      response = await gemini.analyzeImage(request.imageData, request.prompt)
    } else {
      throw new Error('Invalid vision request configuration')
    }

    if (request.userId) {
      await insertLog({
        user_id: request.userId,
        action: 'vision_analysis',
        metadata: { provider },
      })
    }

    return response
  } catch (error) {
    if (provider === 'openai' && request.imageData) {
      return gemini.analyzeImage(request.imageData, request.prompt)
    }
    throw error
  }
}

export { openai, gemini }
