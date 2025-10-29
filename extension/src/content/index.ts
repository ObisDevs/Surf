// Minimal content script for web control
const aiMouse = { 
  show: () => console.log('AI Mouse shown'),
  hide: () => console.log('AI Mouse hidden')
}

// Simplified API functions
async function callApi<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`https://surf-web-five.vercel.app${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  return response.json()
}

function parseDOM() {
  return document.body.innerText.slice(0, 1000)
}

let isRunning = false

async function executeTask(task: string): Promise<void> {
  if (isRunning) {
    throw new Error('Agent is already running')
  }
  
  isRunning = true
  console.log('SurfAI: Starting task:', task)
  aiMouse.show()
  
  try {
    const result = await callApi('/api/plan', 'POST', {
      userId: 'web-user',
      domContext: parseDOM(),
      task
    })
    console.log('SurfAI: Plan received:', result)
    console.log('SurfAI: Task completed')
  } catch (error) {
    console.error('SurfAI: Task failed:', error)
    throw error
  } finally {
    isRunning = false
    aiMouse.hide()
  }
}

function stop(): void {
  isRunning = false
  aiMouse.hide()
  console.log('SurfAI: Stopped')
}

interface SurfAI {
  executeTask: typeof executeTask
  stop: typeof stop
  isRunning: () => boolean
  parseDOM: typeof parseDOM
}

;(window as Window & { surfai?: SurfAI }).surfai = {
  executeTask,
  stop,
  isRunning: () => isRunning,
  parseDOM,
}

console.log('SurfAI content script loaded')
