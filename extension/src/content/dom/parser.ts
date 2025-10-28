export interface DOMElement {
  tag: string
  id?: string
  class?: string
  text?: string
  attributes: Record<string, string>
  xpath: string
  selector: string
  isInteractive: boolean
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export function parseDOMToJSON(maxElements = 100): DOMElement[] {
  const elements: DOMElement[] = []
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea']
  
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        const el = node as Element
        return interactiveTags.includes(el.tagName.toLowerCase()) ||
               el.hasAttribute('onclick') ||
               el.hasAttribute('role')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
      },
    }
  )

  let count = 0
  while (walker.nextNode() && count < maxElements) {
    const el = walker.currentNode as Element
    const rect = el.getBoundingClientRect()
    
    if (rect.width === 0 || rect.height === 0) continue

    elements.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || undefined,
      class: el.className || undefined,
      text: el.textContent?.trim().substring(0, 100) || undefined,
      attributes: getAttributes(el),
      xpath: getXPath(el),
      selector: getSelector(el),
      isInteractive: true,
      boundingBox: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
    })
    count++
  }

  return elements
}

function getAttributes(el: Element): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i]
    if (attr) {
      attrs[attr.name] = attr.value
    }
  }
  return attrs
}

function getXPath(el: Element): string {
  if (el.id) return `//*[@id="${el.id}"]`
  
  const parts: string[] = []
  let current: Element | null = el

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 0
    let sibling = current.previousSibling

    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
        index++
      }
      sibling = sibling.previousSibling
    }

    const tagName = current.nodeName.toLowerCase()
    const part = index > 0 ? `${tagName}[${index + 1}]` : tagName
    parts.unshift(part)

    current = current.parentElement
  }

  return `/${parts.join('/')}`
}

function getSelector(el: Element): string {
  if (el.id) return `#${el.id}`
  if (el.className) return `.${el.className.split(' ')[0]}`
  return el.tagName.toLowerCase()
}
