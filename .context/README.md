# Context Management System (CMS)

This directory serves as the persistent memory and governance layer for AI-native engineering.

## Directory Index & Responsibilities

- **README.md**: (This file) Governance rules, directory standards, and onboarding for AI agents.
- **RAW_REQUIREMENTS.md**:
  - *Role*: User's raw ideas, drafts, and feature requests.
  - *Write*: User primarily. AI writes upon explicit request or when capturing unrecorded requirements. Avoid proactive edits otherwise.
  - *Standard*: Allow noise and fragments; prioritize capturing intent.
- **SPEC.md**:
  - *Role*: Technical Source of Truth (Requirements & Constraints).
  - *Write*: AI-refined; updated via `sync-spec` or major architectural changes.
  - *Standard*: **Strict What & Why**. Avoid implementation details (How). Highly structured.
- **ROADMAP.md**:
  - *Role*: Chronological log of milestones and major decisions.
  - *Write*: AI only upon task completion or decision finalization.
  - *Standard*: One-liner entries with links to archived tasks.
- **ACTIVE_TASK.md**:
  - *Role*: Current execution focus and runtime cache.
  - *Write*: AI frequently during implementation.
  - *Standard*: **Strict How**. Includes implementation details, test plans, and task-specific logic.

## Usage Guidelines for AI Agents

1. **Proximity Rule**: Always look for the **nearest** `.context/` directory relative to the current file.
2. **Read Protocol**: Read `README.md` first to understand the boundaries. Access other files on an as-needed basis to minimize token noise.
3. **Write Protocol**:
   - Respect the boundary between SPEC (What) and ACTIVE_TASK (How).
   - Never modify `ROADMAP.md` until a task is fully complete.
   - Maintain high information density; zero fluff.
4. **Consistency**: Ensure any new tasks or requirements are reflected in `SPEC.md` or `RAW_REQUIREMENTS.md` before execution begins.
5. **Local Preview Boundary**: Unless the user explicitly asks, do not start a local development server and do not open, automate, screenshot, or otherwise inspect the site in a browser. Prefer build/type/lint checks and leave visual review to the user.
