interface PopupState {
  isActive: boolean
  userId: string | null
}

const state: PopupState = {
  isActive: false,
  userId: null,
}

async function init(): Promise<void> {
  const statusEl = document.getElementById('status')
  const toggleBtn = document.getElementById('toggle')
  const testBtn = document.getElementById('test')

  if (!statusEl || !toggleBtn || !testBtn) return

  const { isActive, userId } = await chrome.storage.local.get(['isActive', 'userId'])
  state.isActive = isActive ?? false
  state.userId = userId ?? null

  updateUI()

  toggleBtn.addEventListener('click', async () => {
    state.isActive = !state.isActive
    await chrome.storage.local.set({ isActive: state.isActive })
    updateUI()
  })

  testBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const surfai = (window as Window & { surfai?: { captureDOM: () => Promise<string> } }).surfai
        if (surfai) {
          surfai.captureDOM().then((html) => {
            console.log('DOM captured:', html.substring(0, 100))
          }).catch(console.error)
        }
      },
    })
  })
}

function updateUI(): void {
  const statusEl = document.getElementById('status')
  const toggleBtn = document.getElementById('toggle')
  const indicator = document.getElementById('indicator')

  if (!statusEl || !toggleBtn || !indicator) return

  statusEl.textContent = state.isActive ? 'Active' : 'Inactive'
  toggleBtn.textContent = state.isActive ? 'Deactivate' : 'Activate'
  
  if (state.isActive) {
    indicator.classList.remove('inactive')
  } else {
    indicator.classList.add('inactive')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch(console.error)
})
