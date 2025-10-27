# 🧠 AI Browser Agent — Hybrid Vision + MCP-Integrated Autonomous Web Intelligence

> **Version:** 3.0  
> **Author:** ObisDev  
> **Date:** 2025-10-27  
> **Stack:** Chrome Extension (MV3) + Next.js + Supabase + OpenAI + Gemini + node-typer-MCP  

---

## 🚀 Overview

The **AI Browser Agent** is an autonomous Chrome extension with multimodal perception (DOM + Vision), memory, and deep reasoning capabilities.  
It connects to a **Next.js backend** for cognitive processing and integrates with **node-typer-MCP**, a full AGI-grade Model Context Protocol server with 19 powerful AI tools (excluding Stripe).  

This system allows the browser to **see**, **think**, **learn**, and **act** — navigating, coding, automating workflows, and reasoning about any website dynamically.

---

## 🧩 Core Capabilities

| Capability | Description |
|-------------|-------------|
| 🧠 **Cognitive Reasoning** | Uses OpenAI GPT-5 + Gemini 1.5 for real-time planning |
| 👁️ **Hybrid Vision System** | Combines DOM parsing + visual screenshot analysis |
| 💬 **Natural Interaction** | Talk or type to the browser; it executes and learns |
| 🖱️ **AI Mouse UI** | Visual cursor showing actions in real time |
| 🔍 **Web Intelligence** | Understands, summarizes, and navigates web pages |
| 💾 **Memory** | Learns via Supabase + MCP `memory_brain` |
| ⚙️ **Autonomous Operation** | Can fill forms, click, scroll, and write code |
| 🧠 **MCP Integration** | 19 advanced cognitive tools for automation & reasoning |

---

## 🧰 Technologies

| Layer | Tech | Purpose |
|--------|------|----------|
| **Frontend** | Chrome Extension (TypeScript, MV3) | Page automation & DOM control |
| **Backend** | Next.js 15 (App Router) | AI routing, reasoning & MCP bridge |
| **AI Models** | OpenAI GPT-5 + Gemini | Reasoning + fallback cognition |
| **Database** | Supabase (pgvector) | Vector memory and logs |
| **MCP Engine** | `node-typer-MCP` | Advanced AGI layer (19 tools) |
| **Hosting** | Vercel | Serverless deployment |
| **Language** | TypeScript | End-to-end type safety |

---

## 🧠 MCP Integration (19 Tools)

The system integrates directly with `node-typer-MCP`, excluding payment tools.  
It grants the agent **true AGI-level** reasoning through specialized tools.

### 🔧 Utility Tools
- `typewrite` — Simulated human typing  
- `infer_type` — Smart data type detection  
- `cast_type` — Safe type conversion  
- `log_message` — Logging and telemetry  
- `generate_n8n_workflow` — Workflow builder  
- `transform_data` — Convert between data formats  
- `validate_data` — Schema validation  
- `evaluate_expression` — Expression evaluator  
- `manage_secrets` — Secure secret handling  

### 🧠 Brain Intelligence Tools
- `web_intelligence` — Web data analysis  
- `cognitive_search` — Search aggregation + fact-check  
- `analytics_brain` — ML + analytics engine  
- `vision_intelligence` — Image + visual analysis  
- `orchestrator_brain` — Workflow coordinator  
- `system_intelligence` — Terminal/command operations  
- `memory_brain` — Persistent associative memory  
- `database_intelligence` — SQL/NoSQL integration  
- `cognitive_task` — High-level autonomous task execution  
- `self_improvement` — Dynamic tool generation  

> ⚠️ The `stripe_payment_processor` tool is **disabled** for this project.

---

## 🏗️ Project Structure

