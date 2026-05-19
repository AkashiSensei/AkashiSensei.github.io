# SPECIFICATION (Source of Truth)
(Focus on REQUIREMENTS and CONSTRAINTS. Avoid implementation details.)

## 1. Project Overview

Personal homepage (resume extension) for job-seeking, with secondary goals of community connection and peer sharing. Primary audience: interviewers; secondary: open-source peers and students. Pure static frontend deployed to **GitHub Pages user site** (not a project site) via GitHub Actions.

## 2. Core Technical Stack

- UI: React
- Language: TypeScript (preferred for application code)
- Build: Vite
- Deployment: GitHub Actions → GitHub Pages (user site; see §2.1)
- Content: Structured data files (JSON or equivalent); views must not hardcode individual entries

### 2.1 GitHub Pages: user site (fixed)

**Deployment type: GitHub Pages user site** — repository name must be `{username}.github.io`; this is **not** a project site (`username.github.io/repo-name/`).

| Item | Value |
|------|--------|
| Repository | `AkashiSensei/AkashiSensei.github.io` |
| Site URL (production) | `https://akashisensei.github.io/` |
| Pages type | **User site** (root-hosted) |
| Vite `base` | **`/`** always for this repo |
| Do **not** use | `base: '/AkashiSensei.github.io/'` or other project-site prefixes |

- React Router paths are from site root (e.g. `/projects`); hash routing not required unless explicitly changed
- Changing to a project-site layout would be out of scope unless repository/hosting model changes; then update `base`, router basename, and this section together

## 3. Design & UI

- Visual: Minimal, content-first; light/dark themes; subtle multi-color gradients; frosted-glass surfaces (glassmorphism)—Liquid Glass–inspired tone only, no literal liquid-glass effects
- Styling: Tailwind CSS
- Component approach: **shadcn/ui**—copy-in components the project owns, built on Radix UI primitives; customize tokens and classes for the glass look. Not a from-scratch design system in v1
- Avoid building complex widgets by hand; use shadcn/Radix for accessibility on used primitives only
- **Scope**: Presentation and navigation only—cards, tags, buttons, links, layout shell, theme toggle, locale switcher, list/gallery containers. **No** complex forms or heavy interactive flows in v1
- Mobile-first: mobile experience **prioritizes** over desktop

## 4. Internationalization

- Locales: Chinese (source of truth), English, Italian, Japanese
- Non-Chinese copy: AI-generated drafts, **human-reviewed** before publish

## 5. Content Modules

Each module may have a listing page with **list** or **gallery** view modes.

| Module (ZH) | Purpose |
|-------------|---------|
| 项目 | Code work outside coursework |
| 课设 | Course projects; reference repos for juniors/seniors |
| 工作台 | Third-party software, services, and platforms **I use**—stable toolchain, not homepage “now” |
| 小工具 | Small tools/repos I **authored or contributed to** (see §6) |
| 知识沉淀 | Blogs, article links, engineering notes, paper reading repos, etc. |
| 工作经历 | Internships and employment |
| 能力 | Cross-cutting strengths (not tool/product entries) |
| 信条 | Principles and trade-offs |
| 学术成果 | Placeholder until papers/patents/soft copyrights exist |

**Homepage**:

- Intro, current focus, resume PDF, contact; link out to GitHub Profile for more activity
- **Per-module Highlights**: For each active content module (§5 table), show a curated subset of entries on the homepage—entries marked in data (e.g. `highlight: true` or `featured` ordering). Typical cap: 1–3 items per module; module title + “view all” link to the module listing page
- **学术成果**: Omit homepage Highlight block until entries exist
- Highlights are editorial curation, not automatic “latest N”; empty modules may show only the section header + link or hide the block

## 6. Entries, Relations & Integrations

### 小工具 eligibility

- Include repos where I am a **GitHub Contributor** (including meaningful work on **my own fork**)
- Prefer listing **my fork URL** when the fork is the canonical link for the site entry
- Exclude entries that are only “starred” or used but not contributed to

### Relations & tags

- Cross-module links on cards (e.g. project → knowledge, 工作台, 小工具, 能力); desktop hover preview deferred; mobile tap-to-expand; tags navigate to targets
- Static labels allowed (e.g. archived)

### GitHub stars

- For GitHub projects: show star count when available
- **Build-time** fetch in CI into static data; no API tokens in client bundles; degrade gracefully if fetch fails

## 7. Legal & Compliance

- Privacy: No unnecessary tracking; minimize personal data collection
- Accessibility: Readable, navigable layouts across common viewport sizes
