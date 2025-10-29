# 🧪 SurfAI Extension Testing Guide

## ✅ Current Status
- **Backend**: Deployed at `https://surf-web-five.vercel.app`
- **Extension**: Built and ready to test
- **Milestones Complete**: 1-10 (Core functionality ready)
- **Next**: Milestone 11 (MCP Integration)

---

## 🚀 Quick Start - Load Extension

### 1. Open Chrome Extensions Page
```
chrome://extensions/
```

### 2. Enable Developer Mode
- Toggle "Developer mode" in top-right corner

### 3. Load Unpacked Extension
- Click "Load unpacked"
- Navigate to: `/workspaces/Surf/extension/dist/`
- Click "Select"

### 4. Verify Installation
- You should see "SurfAI - AI Browser Agent v3.0.0"
- Extension icon appears in toolbar

---

## 🧪 Test the Extension

### Test 1: DOM Parsing
1. Open any webpage (e.g., `https://example.com`)
2. Open browser console (F12)
3. Run:
```javascript
chrome.runtime.sendMessage({ type: 'PARSE_DOM' }, (response) => {
  console.log('DOM parsed:', response)
})
```

**Expected**: JSON structure of page elements

### Test 2: Click Action
1. On any page with a button
2. In console:
```javascript
chrome.runtime.sendMessage({ 
  type: 'EXECUTE_ACTION',
  action: { 
    type: 'click', 
    selector: 'button' // or any CSS selector
  }
}, (response) => {
  console.log('Action result:', response)
})
```

**Expected**: Button clicks, response shows success

### Test 3: Type Action
1. On a page with an input field
2. In console:
```javascript
chrome.runtime.sendMessage({ 
  type: 'EXECUTE_ACTION',
  action: { 
    type: 'type', 
    selector: 'input',
    value: 'Hello from SurfAI!'
  }
}, (response) => {
  console.log('Typed:', response)
})
```

**Expected**: Text appears in input field

### Test 4: AI Mouse Indicator
1. Execute any action
2. Watch for visual feedback dot showing where AI is interacting

---

## 🔧 Current Capabilities (Milestones 1-10)

### ✅ Working Features
- **DOM Parsing**: Extract page structure
- **Action Execution**: Click, type, scroll, wait
- **AI Mouse**: Visual feedback indicator
- **Background Worker**: Message handling
- **Content Script**: Page interaction
- **API Integration**: Ready to connect to backend

### 🚧 Not Yet Implemented
- **AI Reasoning**: Needs backend API calls (Milestone 11)
- **Vision Analysis**: Screenshot + AI analysis
- **Memory**: Store and recall actions
- **Autonomous Mode**: Full AI-driven browsing
- **MCP Tools**: 19 cognitive tools

---

## 🔌 Connect to Backend API

The extension needs to call your Vercel backend. Update the API URL:

### Option 1: Environment Variable (Recommended)
Create `/extension/.env`:
```
NEXT_PUBLIC_API_URL=https://surf-web-five.vercel.app
```

### Option 2: Hardcode (Quick Test)
Edit `/extension/src/content/index.ts`:
```typescript
const API_URL = 'https://surf-web-five.vercel.app'
```

Then rebuild:
```bash
cd extension
npm run build
```

Reload extension in Chrome.

---

## 🧠 Test AI Features (Requires API Connection)

### Test AI Planning
```javascript
// This will call your Vercel backend
fetch('https://surf-web-five.vercel.app/api/plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test-user',
    domContext: document.body.innerText.slice(0, 1000),
    task: 'Find and click the login button'
  })
})
.then(r => r.json())
.then(data => console.log('AI Plan:', data))
```

### Test Vision Analysis
```javascript
fetch('https://surf-web-five.vercel.app/api/vision', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test-user',
    imageUrl: 'https://example.com/image.jpg',
    prompt: 'Describe this page'
  })
})
.then(r => r.json())
.then(data => console.log('Vision Analysis:', data))
```

---

## 🐛 Troubleshooting

### Extension Not Loading
- Check console for errors
- Verify `/extension/dist/` has files
- Rebuild: `cd extension && npm run build`

### Actions Not Working
- Check page has target elements
- Verify selectors are correct
- Open console to see error messages

### API Calls Failing
- Verify Vercel deployment is live
- Check CORS headers in Vercel
- Ensure environment variables set in Vercel dashboard

---

## 📊 What's Working vs What's Next

### ✅ Milestone 1-10 Complete
- Project setup
- Supabase memory tables
- AI services (OpenAI + Gemini)
- API routes (/plan, /vision, /memory, /feedback)
- Chrome extension base
- DOM interaction + AI mouse
- Production deployment

### 🎯 Next: Milestone 11 - MCP Integration
- Install node-typer-MCP
- Create `/api/mcp` endpoint
- Enable 19 cognitive tools
- Full autonomous reasoning

---

## 🎮 Example Use Cases to Test

1. **Navigate to a website**: "Go to example.com"
2. **Fill a form**: "Fill the search box with 'AI agents'"
3. **Click elements**: "Click the submit button"
4. **Extract data**: "Get all links on this page"
5. **Scroll**: "Scroll down 500 pixels"

---

## 📝 Notes

- Extension currently works in **manual mode** (you send commands)
- **Autonomous mode** requires Milestone 11 (MCP integration)
- Backend API is live and ready for AI calls
- All core infrastructure is in place

**Status**: ✅ Ready for manual testing and Milestone 11 development
