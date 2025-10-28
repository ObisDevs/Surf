export interface Action {
  type: 'click' | 'type' | 'scroll' | 'wait'
  selector?: string
  xpath?: string
  value?: string
  x?: number
  y?: number
}

export async function executeAction(action: Action): Promise<void> {
  switch (action.type) {
    case 'click':
      await executeClick(action)
      break
    case 'type':
      await executeType(action)
      break
    case 'scroll':
      await executeScroll(action)
      break
    case 'wait':
      await executeWait(action)
      break
  }
}

async function executeClick(action: Action): Promise<void> {
  const element = findElement(action)
  if (!element) throw new Error('Element not found')

  const rect = element.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }))
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }))
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }))

  if (element instanceof HTMLElement) {
    element.focus()
  }
}

async function executeType(action: Action): Promise<void> {
  const element = findElement(action)
  if (!element || !(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    throw new Error('Input element not found')
  }

  element.focus()
  element.value = action.value ?? ''
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
}

async function executeScroll(action: Action): Promise<void> {
  if (action.x !== undefined || action.y !== undefined) {
    window.scrollTo({
      left: action.x ?? window.scrollX,
      top: action.y ?? window.scrollY,
      behavior: 'smooth',
    })
  } else {
    const element = findElement(action)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

async function executeWait(action: Action): Promise<void> {
  const ms = parseInt(action.value ?? '1000', 10)
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function findElement(action: Action): Element | null {
  if (action.selector) {
    return document.querySelector(action.selector)
  }
  if (action.xpath) {
    const result = document.evaluate(
      action.xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue as Element | null
  }
  return null
}
