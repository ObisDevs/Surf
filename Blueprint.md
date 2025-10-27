# 🧠 AI Browser Agent — Hybrid Vision + MCP Integration Blueprint

## Overview
The AI Browser Agent is a fully autonomous Chrome Extension connected to a Next.js backend with Supabase vector memory and a Model Context Protocol (MCP) integration.  
It perceives and interacts with webpages visually and structurally, executes reasoning tasks through OpenAI + Gemini, and expands its intelligence using the `node-typer-MCP` system.  

The MCP integration gives the agent access to **19 specialized cognitive tools**, enabling advanced automation, analytics, data processing, web reasoning, and system operations.

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend (Extension)** | Chrome Manifest V3 + TypeScript | Web automation and UI interaction |
| **Backend (Server)** | Next.js 15 (App Router) | API, reasoning, and MCP orchestration |
| **Database** | Supabase (pgvector) | Long-term memory and embeddings |
| **AI Models** | OpenAI GPT-5 (Primary), Gemini 1.5 Pro (Fallback) | Reasoning + multimodal cognition |
| **MCP Engine** | node-typer-MCP (TypeScript server) | Advanced intelligence + 19 tools |
| **Hosting** | Vercel | Serverless deployment |
| **Language** | TypeScript | Full stack consistency |

---

## 🧩 System Architecture

Chrome Extension (DOM + Vision)
│
▼
Next.js Backend (API routes)
│
▼
node-typer-MCP (AGI tools)
│
▼
Supabase Vector Memory

markdown
Copy code

---

## 🔌 Integration Overview

### 1. **Hybrid Vision**
- **DOM Parsing:** Extracts structural elements.
- **Screenshot Vision:** Captures visible tab image.
- **Multimodal Reasoning:** GPT-5/Gemini fuses both for page understanding.

### 2. **MCP Connection**
- The backend communicates with `node-typer-MCP` via REST or local socket.
- The MCP provides 19 tools (Stripe excluded).

### 3. **Memory Synchronization**
- Supabase stores long-term embeddings.
- MCP’s `memory_brain` provides additional cognitive memory.
- Combined for persistent adaptive behavior.

### 4. **Reasoning Flow**
User → Extension → API (/plan) →
OpenAI/Gemini (fast reasoning) →
If complex → MCP Cognitive Task →
Plan → Execute (DOM + AI Mouse)

yaml
Copy code

---

## 🧠 Active MCP Tools (19 Tools)

### 🔧 Core Utility Tools
| Tool | Description | Use Case |
|------|--------------|----------|
| **typewrite** | Simulate human typing | IDE code writing, text entry |
| **infer_type** | Infer data types intelligently | Form field automation |
| **cast_type** | Convert between types safely | Data handling and validation |
| **log_message** | Advanced logging | Step-level telemetry |
| **generate_n8n_workflow** | Generate automation workflows | Build dynamic n8n pipelines |
| **transform_data** | Convert data formats | JSON↔YAML↔CSV↔XML conversions |
| **validate_data** | Schema validation | Form verification and inputs |
| **evaluate_expression** | Evaluate expressions | Logic or computation inside DOM tasks |
| **manage_secrets** | Secure secret management | Credential storage for agents |

### 🧠 Brain Intelligence Tools
| Tool | Description | Use Case |
|------|--------------|----------|
| **web_intelligence** | Web content analysis | Web scraping and reasoning |
| **cognitive_search** | Search engine + fact aggregation | Knowledge retrieval |
| **analytics_brain** | ML + statistics analysis | Chart interpretation, forecasting |
| **vision_intelligence** | Image & visual analysis | Screenshot and OCR integration |
| **orchestrator_brain** | Multi-tool orchestration | Workflow composition |
| **system_intelligence** | System & terminal operations | Remote command execution |
| **memory_brain** | Persistent memory | Knowledge recall & context |
| **database_intelligence** | Multi-DB operation | Query, analysis, optimization |
| **cognitive_task** | High-level autonomous task reasoning | Agent planning and decomposition |
| **self_improvement** | Create new tools dynamically | Adaptive learning and evolution |

🧾 **Excluded Tool:**  
❌ `stripe_payment_processor` (Payment processing disabled)

---

## 🔐 Security Model

- **API Keys:** Stored securely in Vercel + Supabase secrets.
- **MCP Access:** Protected via signed key (JWT or Bearer).
- **Sandboxing:** MCP isolates system tasks and enforces limits.
- **Audit Logging:** Every agent task logged to Supabase `logs`.

---

## 📚 Core APIs

| Route | Purpose |
|--------|----------|
| `/api/plan` | Generate task plan from DOM + screenshot |
| `/api/vision` | Send page vision to multimodal models |
| `/api/memory` | Store/retrieve embeddings |
| `/api/mcp` | Execute MCP tool remotely |
| `/api/feedback` | Log user corrections |

---

## 🧠 Memory Architecture

| Component | Description |
|------------|--------------|
| **Supabase (pgvector)** | Stores embeddings of previous actions, contexts, and pages |
| **MCP memory_brain** | Adds deeper associative recall & pattern learning |
| **Synchronization** | Both connected at reasoning phase to merge context |

---

## 🌐 Web Interaction Pipeline

1. **Observe:** Content script captures DOM and screenshots.
2. **Analyze:** Sent to `/api/plan` → GPT-5 or Gemini.
3. **Delegate:** If complex, `/api/mcp` calls MCP tools (e.g., `cognitive_task`, `web_intelligence`).
4. **Plan:** JSON plan returned (clicks, types, scrolls, etc.).
5. **Execute:** Content script performs actions using synthetic events.
6. **Visual Feedback:** AI mouse dot moves to show progress.
7. **Learn:** Supabase + MCP memory store results for improvement.

---

## 🧩 Supabase Tables

| Table | Purpose |
|--------|----------|
| `ai_memory` | Stores embeddings and results |
| `user_profiles` | Agent preferences & usage |
| `logs` | Activity and audit logging |

---

## 🔍 Example Cognitive Flow

**Task:** “Analyze this webpage and extract all data tables as JSON.”

1. Extension captures DOM + screenshot.  
2. `/api/plan` forwards to MCP → `vision_intelligence` + `transform_data`.  
3. MCP returns structured JSON.  
4. Supabase logs embeddings.  
5. Agent highlights extracted areas in browser.

---

## 🚀 Deployment

| Component | Host | Notes |
|------------|------|-------|
| **Next.js Backend** | Vercel | Auto deploy on push |
| **MCP Server** | Local / Cloud Node Server | Expose via HTTP |
| **Supabase** | Supabase Cloud | Database + Vector Search |
| **Extension** | Chrome Web Store or Local Dev | MV3 build via esbuild |

---

## 🔗 Environment Variables

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
MCP_URL=http://localhost:5050
MCP_API_KEY=securekey
NODE_ENV=production
✅ Deliverables Summary
Component	Status
Chrome Extension (DOM + Vision + AI Mouse)	✅
Next.js Backend (Vercel)	✅
Supabase Vector Memory	✅
MCP Integration (19 Tools)	✅
Cognitive Pipeline (Reasoning → Action)	✅
Stripe Tool Disabled