import type { ExtensionMessage, ExtensionResponse } from '@shared/types'
import { generateRequestId } from '@shared/utils'
import { parseDOMToJSON, type DOMElement } from './dom/parser'
import { executeAction, type Action } from './actions/executor'
import { AIMouse } from './ui/mouse'
import { analyzePageWithVision, type VisionAnalysisResponse } from './vision/analyzer'
import { storeMemory, recallSimilarTasks, type MemoryEntry } from './memory/storage'
import { reasonAndAct, retryWithRecovery, type ReasoningResult } from './reasoning/loop'

const aiMouse = new AIMouse()

function sendSecureMessage<T>(type: ExtensionMessage['type'], data: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const message: ExtensionMessage = {
      type,
      data,
      requestId: generateRequestId(),
    }

    chrome.runtime.sendMessage(message, (response: ExtensionResponse<T>) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }

      if (response.success && response.data !== undefined) {
        resolve(response.data)
      } else {
        reject(new Error(response.error ?? 'Unknown error'))
      }
    })
  })
}

interface ApiCallData {
  endpoint: string
  method: string
  body?: unknown
}

export async function callApi<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
  const data: ApiCallData = { endpoint, method, body }
  return sendSecureMessage<T>('SECURE_API_CALL', data)
}

export async function captureDOM(): Promise<string> {
  return sendSecureMessage<string>('DOM_CAPTURE', {})
}

export async function captureScreenshot(): Promise<string> {
  return sendSecureMessage<string>('SCREENSHOT_CAPTURE', {})
}

export function parseDOM(): DOMElement[] {
  return parseDOMToJSON()
}

export async function executeActions(actions: Action[]): Promise<void> {
  aiMouse.show()
  
  for (const action of actions) {
    if (action.type === 'click' && action.selector) {
      const el = document.querySelector(action.selector)
      if (el) {
        const rect = el.getBoundingClientRect()
        aiMouse.moveTo(rect.left + rect.width / 2, rect.top + rect.height / 2)
        await new Promise((resolve) => setTimeout(resolve, 300))
        aiMouse.pulse()
      }
    }
    
    await executeAction(action)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  
  aiMouse.hide()
}

export async function analyzePageVision(
  userId: string,
  task: string
): Promise<VisionAnalysisResponse> {
  const domElements = parseDOMToJSON()
  const screenshot = await captureScreenshot()
  return analyzePageWithVision(userId, domElements, screenshot, task)
}

export async function executeWithMemory(
  userId: string,
  task: string,
  actions: Action[]
): Promise<boolean> {
  const domContext = parseDOMToJSON()
  let success = false
  
  try {
    await executeActions(actions)
    success = true
  } catch (error) {
    console.error('Action execution failed:', error)
  }
  
  await storeMemory(userId, task, actions, domContext, success)
  return success
}

export async function recallMemory(
  userId: string,
  task: string
): Promise<MemoryEntry[]> {
  return recallSimilarTasks(userId, task)
}

interface SurfAI {
  callApi: typeof callApi
  captureDOM: typeof captureDOM
  captureScreenshot: typeof captureScreenshot
  parseDOM: typeof parseDOM
  executeActions: typeof executeActions
  analyzePageVision: typeof analyzePageVision
  executeWithMemory: typeof executeWithMemory
  recallMemory: typeof recallMemory
  showMouse: () => void
  hideMouse: () => void
  reasonAndAct: typeof reasonAndAct
  retryWithRecovery: typeof retryWithRecovery
}

;(window as Window & { surfai?: SurfAI }).surfai = {
  callApi,
  captureDOM,
  captureScreenshot,
  parseDOM,
  executeActions,
  analyzePageVision,
  executeWithMemory,
  recallMemory,
  showMouse: () => aiMouse.show(),
  hideMouse: () => aiMouse.hide(),
  reasonAndAct,
  retryWithRecovery,
}

console.log('SurfAI content script loaded')
