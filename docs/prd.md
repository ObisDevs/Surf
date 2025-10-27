# Product Requirements Document (PRD) — SurfAI (BMAD‑METHOD)

Status: Draft v0.1
Owner: PM Agent (with Human-in-the-Loop)
Last Updated: 2025-10-28

## 1. Overview

- Purpose: Define scope, users, and requirements to enable Architect/PO to produce Architecture and shard for SM/Dev cycle.
- Context: SurfAI adopts BMAD‑METHOD to produce high‑quality planning artifacts and drive story‑centric development using SM/Dev/QA agents.

## 2. Problem Statement

Modern AI-assisted development often suffers from planning inconsistency and context loss. SurfAI aims to standardize planning and execution using BMAD‑METHOD templates, agents, and workflows to ensure predictable delivery quality.

## 3. Goals and Non-Goals

- Goals
  - G1: Create a clear workflow from ideation → PRD → Architecture → sharded epics/stories → SM/Dev/QA cycle.
  - G2: Provide reusable templates and tasks that work in IDE and Web UI contexts.
  - G3: Establish measurable quality through QA gates and NFRs.

- Non-Goals
  - NG1: Building domain-specific expansion packs in v1.
  - NG2: Complex CI/CD and telemetry integration in v1.

## 4. Users and Personas

- Primary Users
  - Product Owner: Orchestrates planning alignment and sharding.
  - Developer: Implements stories with clear AC and tasks.
  - QA (Test Architect): Provides risk, design, review, and gates.

- Secondary Users
  - Analyst, Architect, and non-technical creators using expansion packs.

## 5. Scope

- In-Scope
  - Install BMAD‑METHOD, generate PRD/Architecture, shard docs, run SM/Dev/QA cycle.
- Out-of-Scope (v1)
  - Expansion packs beyond simple examples; heavy CI; production observability.

## 6. Functional Requirements (FR)

- FR‑1: As a PM/PO, I can generate a PRD and Architecture using BMAD templates.
- FR‑2: As a PO, I can shard PRD and Architecture into epics, stories, and arch shards.
- FR‑3: As an SM, I can draft the next story with full context from sharded docs.
- FR‑4: As a Dev, I can implement stories following acceptance criteria and tasks.
- FR‑5: As QA, I can run risk/test‑design/trace/NFR/review and issue gates.
- FR‑6: As a user, I can update preferences to influence tech recommendations.

## 7. Non-Functional Requirements (NFR)

- NFR‑1: Documentation Leanliness — Artifacts must remain shardable and within LLM context limits.
- NFR‑2: Traceability — Acceptance criteria trace to tests (via QA *trace).
- NFR‑3: Security — No sensitive credentials in repo; secrets managed appropriately.
- NFR‑4: Reliability — All core commands run deterministically; flaky tests disallowed.
- NFR‑5: Maintainability — Coding standards minimized and updated as project matures.
- NFR‑6: Performance — Planning operations and bundling should complete in acceptable time for local workflows.

## 8. Assumptions & Dependencies

- Node.js ≥ 20 and git installed.
- IDE or web LLM platform available for agents.
- Will follow paths in `user-guide.md` for outputs (docs/*).

## 9. Success Metrics

- PRD + Architecture alignment in ≤ 2 iterations.
- ≥ 90% first‑pass QA review approvals on stories (no P0 gaps).
- Median story cycle time ≤ 1 day after SM approval (scope‑dependent).

## 10. Release Plan

- v0 (this repo): Baseline BMAD install, PRD/Architecture generation, initial sharding, 3–5 stories completed.
- v0.1: Technical preferences curated; initial QA gate rules applied.
- v0.2: Optional pilot of a small expansion pack; light CI.

## 11. Epics and Stories (Initial Draft)

- Epic E‑01: BMAD Installation and Planning
  - Story S‑01.01: Install BMAD and scaffold core (`npx bmad-method install`).
    - Acceptance Criteria (AC)
      - AC‑1: Installer completes without errors on Node 20+.
      - AC‑2: Core files present (agents, tasks, templates, data).
      - AC‑3: `AGENTS.md` or IDE integration instructions available.
    - Tasks
      - T‑1: Run installer.
      - T‑2: Commit installed files.
  - Story S‑01.02: Generate PRD and Architecture.
    - AC‑1: `docs/prd.md` created with FRs/NFRs/epics/stories.
    - AC‑2: `docs/architecture.md` created with context, constraints, diagram, components.
    - AC‑3: PO alignment checklist completed.
  - Story S‑01.03: Shard PRD and Architecture for development.
    - AC‑1: `docs/epics/*`, `docs/stories/*`, `docs/architecture/*.md` exist.
    - AC‑2: `core-config.yaml` has `devLoadAlwaysFiles` set.

- Epic E‑02: Core Development Cycle Enablement
  - Story S‑02.01: SM drafts first feature story from shards.
    - AC‑1: Story includes scope, AC, tasks, and references.
    - AC‑2: User approval recorded.
  - Story S‑02.02: Dev implements first feature story.
    - AC‑1: Tests written per QA *design guidance as applicable.
    - AC‑2: Lint/tests pass locally.
  - Story S‑02.03: QA review and gate issuance.
    - AC‑1: QA *review produces PASS/CONCERNS/FAIL.
    - AC‑2: Gate file saved under `docs/qa/gates/`.

- Epic E‑03: Preferences and Standards
  - Story S‑03.01: Create/update technical preferences.
    - AC‑1: `.bmad-core/data/technical-preferences.md` exists with initial content.
    - AC‑2: Preferences referenced in planning and story drafting.

## 12. Open Questions

- Q1: Use v4.x stable vs. pilot v6‑alpha in a branch?
- Q2: Preferred IDE setup and agent activation commands?
- Q3: Initial domain focus for sample expansion pack (if any)?

## 13. Appendix

- References
  - `user-guide.md`, `core-architecture.md`
  - Upstream BMAD‑METHOD repository
