import type { ExtensionMessage, ExtensionResponse } from '@shared/types'

const API_BASE = 'http://localhost:3000'

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtensionResponse) => void
  ): boolean => {
    handleMessage(message, sender)
      .then((data) => {
        sendResponse({
          success: true,
          data,
          requestId: message.requestId,
        })
      })
      .catch((error: Error) => {
        sendResponse({
          success: false,
          error: error.message,
          requestId: message.requestId,
        })
      })

    return true
  }
)

async function handleMessage(
  message: ExtensionMessage,
  sender: chrome.runtime.MessageSender
): Promise<unknown> {
  if (!isValidOrigin(sender)) {
    throw new Error('Invalid message origin')
  }

  switch (message.type) {
    case 'SECURE_API_CALL':
      return handleSecureApiCall(message.data)
    case 'DOM_CAPTURE':
      return handleDomCapture(sender.tab?.id)
    case 'SCREENSHOT_CAPTURE':
      return handleScreenshotCapture(sender.tab?.id)
    case 'PARSE_DOM':
      return handleParseDom(sender.tab?.id)
    case 'EXECUTE_ACTION':
      return handleExecuteAction(sender.tab?.id, message.data)
    case 'ANALYZE_VISION':
      return handleAnalyzeVision(sender.tab?.id, message.data)
    default:
      throw new Error(`Unknown message type: ${message.type}`)
  }
}

function isValidOrigin(sender: chrome.runtime.MessageSender): boolean {
  return sender.id === chrome.runtime.id
}

async function handleSecureApiCall(data: unknown): Promise<unknown> {
  const { endpoint, method, body } = data as {
    endpoint: string
    method: string
    body?: unknown
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}

async function handleDomCapture(tabId?: number): Promise<string> {
  if (!tabId) throw new Error('No tab ID')

  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.documentElement.outerHTML,
  })

  if (!result?.result) throw new Error('Failed to capture DOM')
  return result.result
}

async function handleScreenshotCapture(tabId?: number): Promise<string> {
  if (!tabId) throw new Error('No tab ID')

  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve(dataUrl)
      }
    })
  })
}

async function handleParseDom(tabId?: number): Promise<unknown> {
  if (!tabId) throw new Error('No tab ID')

  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const surfai = (window as Window & { surfai?: { parseDOM: () => unknown } }).surfai
      return surfai?.parseDOM() ?? []
    },
  })

  return result?.result ?? []
}

async function handleExecuteAction(tabId: number | undefined, data: unknown): Promise<void> {
  if (!tabId) throw new Error('No tab ID')

  await chrome.scripting.executeScript({
    target: { tabId },
    func: (actions) => {
      const surfai = (window as Window & { surfai?: { executeActions: (a: unknown) => Promise<void> } }).surfai
      if (surfai) {
        surfai.executeActions(actions).catch(console.error)
      }
    },
    args: [data],
  })
}

async function handleAnalyzeVision(tabId: number | undefined, data: unknown): Promise<unknown> {
  if (!tabId) throw new Error('No tab ID')

  const { userId, task } = data as { userId: string; task: string }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (uid, tsk) => {
      const surfai = (window as Window & { surfai?: { analyzePageVision: (u: string, t: string) => Promise<unknown> } }).surfai
      return surfai?.analyzePageVision(uid, tsk)
    },
    args: [userId, task],
  })

  return result?.result ?? {}
}

console.log('SurfAI background service worker loaded')
