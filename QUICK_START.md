# 🚀 SurfAI Quick Start Guide

## ✅ What's Ready

- ✅ Backend API deployed at: `https://surf-web-five.vercel.app`
- ✅ Web control panel with Start/Stop buttons
- ✅ Chrome extension built and ready
- ✅ Extension-to-web communication enabled

---

## 📦 Setup (5 minutes)

### Step 1: Load Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select folder: `/workspaces/Surf/extension/dist/`
5. Extension should appear with green checkmark

### Step 2: Open Control Panel
1. Go to: `https://surf-web-five.vercel.app`
2. You should see "✅ Extension Connected" in green

### Step 3: Test the Agent
1. In the task box, enter: `Click the first link on this page`
2. Click "▶️ Start Agent"
3. Watch the AI work!

---

## 🎮 How to Use

### From Web Control Panel
1. **Open** `https://surf-web-five.vercel.app`
2. **Enter task** in the text area (e.g., "Find all images on this page")
3. **Click Start** - Agent will analyze and execute
4. **Click Stop** - Stops the agent immediately

### From Browser Console
Open any webpage, press F12, and run:

```javascript
// Check if extension is loaded
window.surfai

// Execute a task
await window.surfai.executeTask('Click the login button')

// Stop the agent
window.surfai.stop()

// Check if running
window.surfai.isRunning()

// Parse current page
window.surfai.parseDOM()
```

---

## 🧪 Example Tasks to Try

### Basic Actions
- `"Click the first button on this page"`
- `"Type 'hello world' in the search box"`
- `"Scroll down 500 pixels"`

### Advanced Tasks
- `"Find all links and count them"`
- `"Extract all headings from this page"`
- `"Click the login button and wait 2 seconds"`

---

## 🔍 What Happens When You Start

1. **Web sends task** → Backend API generates AI plan
2. **Plan sent to extension** → Extension receives instructions
3. **Extension executes** → AI mouse shows actions
4. **Results displayed** → Status updates in control panel

---

## 🎯 Current Features

| Feature | Status | Description |
|---------|--------|-------------|
| DOM Parsing | ✅ | Extract page structure |
| Click Actions | ✅ | Click any element |
| Type Actions | ✅ | Fill forms and inputs |
| Scroll Actions | ✅ | Navigate pages |
| AI Mouse | ✅ | Visual feedback |
| Web Control | ✅ | Start/stop from website |
| AI Planning | ✅ | Generate action plans |
| Memory | 🚧 | Store past actions |
| Vision | 🚧 | Screenshot analysis |
| MCP Tools | 🚧 | 19 cognitive tools |

---

## 🐛 Troubleshooting

### "Extension Not Found"
- Reload extension in `chrome://extensions/`
- Refresh the webpage
- Check console for errors

### "Agent Not Responding"
- Open browser console (F12)
- Look for error messages
- Verify extension is enabled

### Actions Not Working
- Check if page has target elements
- Try simpler tasks first
- Verify selector syntax

---

## 📊 Architecture

```
User enters task on website
         ↓
Backend generates AI plan (/api/plan)
         ↓
Plan sent to Chrome extension
         ↓
Extension executes on current tab
         ↓
AI mouse shows visual feedback
         ↓
Results sent back to website
```

---

## 🎯 Next Steps

### Milestone 11: MCP Integration
- Install node-typer-MCP server
- Add 19 cognitive tools
- Enable full autonomous mode
- Advanced reasoning capabilities

### Future Features
- Voice commands
- Multi-tab coordination
- Workflow recording
- Custom tool creation

---

## 🔗 Quick Links

- **Control Panel**: https://surf-web-five.vercel.app
- **Extension Path**: `/workspaces/Surf/extension/dist/`
- **API Docs**: Check `/api/plan`, `/api/vision`, `/api/memory`
- **Test Guide**: `EXTENSION_TEST_GUIDE.md`

---

**Status**: ✅ Ready to use!  
**Version**: 3.0.0  
**Last Updated**: 2025-10-29
