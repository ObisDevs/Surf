import type { Action } from '../actions/executor'
import type { DOMElement } from '../dom/parser'

export interface MemoryEntry {
  task: string
  actions: Action[]
  domContext: DOMElement[]
  success: boolean
  timestamp: number
}

export async function storeMemory(
  userId: string,
  task: string,
  actions: Action[],
  domContext: DOMElement[],
  success: boolean
): Promise<void> {
  const content = buildMemoryContent(task, actions, success)
  
  await fetch('http://localhost:3000/api/memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      content,
      metadata: {
        task,
        actions,
        domContext: domContext.slice(0, 10),
        success,
        timestamp: Date.now(),
      },
    }),
  })
}

export async function recallSimilarTasks(
  userId: string,
  task: string
): Promise<MemoryEntry[]> {
  const response = await fetch(
    `http://localhost:3000/api/memory?userId=${userId}&query=${encodeURIComponent(task)}`
  )
  
  if (!response.ok) return []
  
  const data = await response.json()
  return data.data?.map((m: { metadata: unknown }) => m.metadata as MemoryEntry) ?? []
}

function buildMemoryContent(task: string, actions: Action[], success: boolean): string {
  const actionSummary = actions
    .map((a) => `${a.type}${a.selector ? ` ${a.selector}` : ''}${a.value ? ` = ${a.value}` : ''}`)
    .join(', ')
  
  return `Task: ${task}\nActions: ${actionSummary}\nResult: ${success ? 'Success' : 'Failed'}`
}
