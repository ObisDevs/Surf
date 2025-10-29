import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIClient: GoogleGenerativeAI | null = null

function getGemini(): GoogleGenerativeAI {
  if (!genAIClient) {
    genAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  }
  return genAIClient
}

export async function chat(prompt: string, model = 'gemini-1.5-pro'): Promise<string> {
  const genAI = getGemini()
  const gemini = genAI.getGenerativeModel({ model })
  const result = await gemini.generateContent(prompt)
  return result.response.text()
}

export async function analyzeImage(
  imageData: string,
  prompt: string,
  mimeType = 'image/jpeg'
): Promise<string> {
  const genAI = getGemini()
  const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
  
  const result = await gemini.generateContent([
    prompt,
    {
      inlineData: {
        data: imageData,
        mimeType,
      },
    },
  ])

  return result.response.text()
}
