import type { DOMElement } from '../dom/parser'

export interface VisionAnalysisRequest {
  userId: string
  domElements: DOMElement[]
  screenshot: string
  task: string
}

export interface VisionAnalysisResponse {
  analysis: string
  suggestedActions: Array<{
    type: string
    selector?: string
    value?: string
    reasoning: string
  }>
}

export async function analyzePageWithVision(
  userId: string,
  domElements: DOMElement[],
  screenshot: string,
  task: string
): Promise<VisionAnalysisResponse> {
  const response = await fetch('http://localhost:3000/api/vision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      imageData: screenshot,
      prompt: buildVisionPrompt(task, domElements),
    }),
  })

  if (!response.ok) {
    throw new Error('Vision analysis failed')
  }

  const data = await response.json()
  return parseVisionResponse(data.data.analysis)
}

function buildVisionPrompt(task: string, elements: DOMElement[]): string {
  const elementSummary = elements
    .slice(0, 20)
    .map((el, i) => `${i + 1}. ${el.tag}${el.id ? `#${el.id}` : ''} - "${el.text?.substring(0, 50) ?? ''}"`)
    .join('\n')

  return `Task: ${task}

Available interactive elements:
${elementSummary}

Analyze this webpage screenshot and provide:
1. What you see on the page
2. Which elements are relevant to the task
3. Suggested actions to complete the task

Format response as JSON with: { analysis: string, suggestedActions: [{ type, selector, value, reasoning }] }`
}

function parseVisionResponse(analysis: string): VisionAnalysisResponse {
  try {
    const parsed = JSON.parse(analysis)
    return parsed as VisionAnalysisResponse
  } catch {
    return {
      analysis,
      suggestedActions: [],
    }
  }
}
