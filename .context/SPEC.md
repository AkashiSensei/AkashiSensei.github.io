# SPECIFICATION (Source of Truth)
(Focus on REQUIREMENTS and CONSTRAINTS. Avoid implementation details.)

## 1. Project Overview

Personal public site with two distinct presentation surfaces: the root homepage (`/`) is a clean, lightweight page for friends, peers, and casual visitors; the resume route (`/resume`) is the interviewer-oriented electronic resume / career showcase. The site is **public by design**—no private documents (e.g. downloadable resume files) on the site; use safe contact channels only. Goals: community connection, open-source visibility, and job-seeking support through the dedicated resume surface. Pure static frontend deployed to **GitHub Pages user site** (not a project site) via GitHub Actions.

## 2. Core Technical Stack

- UI: React
- Language: TypeScript (preferred for application code)
- Build: Vite
- Routing: React Router for route declarations, route matching, navigation, fallback/404 handling, and future nested/detail routes
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

### 2.2 Content data & localization (single source of truth)

- **Entities**: Each content module keeps **one canonical dataset** (structured files, e.g. JSON). Every entry has a **stable `id`**. Homepage Highlights and module listing/detail pages **must reference the same records**—homepage curation uses flags or ordering (e.g. `highlight`, `featured`, sort index), **not** a duplicate copy of the same entity maintained only for the homepage.
- **Layout**: Keep structured **data separate from UI chrome strings** (e.g. a dedicated tree for entity JSON vs. `locales/` for app copy); do not grow large entity bodies inside React source files.
- **Translations**:
  - **UI chrome** (nav, buttons, generic labels): as copy volume grows, split i18n into **multiple namespaces or files by concern** (e.g. `common`, `nav`, `home`) instead of one monolithic file per language—reduces merge conflicts and clarifies ownership.
  - **Per-entity copy** (titles, summaries, captions, multi-line descriptions): keep it addressable by stable entity `id`. Prefer id-derived translation keys or parallel locale records keyed by the same `id` instead of hand-maintaining per-entry key strings in structured data; **pick one pattern per module** and keep it consistent.

## 3. Design & UI

- Visual: Minimal, content-first; light/dark themes; subtle multi-color gradients; frosted-glass surfaces (glassmorphism)—Liquid Glass–inspired tone only, no literal liquid-glass effects
- Styling: Tailwind CSS
- Component approach: **shadcn/ui**—copy-in components the project owns, built on Radix UI primitives; customize tokens and classes for the glass look. Not a from-scratch design system in v1
- Avoid building complex widgets by hand; use shadcn/Radix for accessibility on used primitives only
- **Scope**: Presentation and navigation only—cards, tags, buttons, links, layout shell, theme toggle, locale switcher, list/gallery containers. **No** complex forms or heavy interactive flows in v1
- Mobile-first: mobile experience **prioritizes** over desktop. **CRITICAL**: Developers must test and verify all layouts on narrow screens (down to 320px) before considering desktop complete. No horizontal overflow or cut-off interactive elements are allowed.
- **Responsive breakpoint semantics for card layouts**: For current content-card pages, treat a viewport as "narrow/mobile" when the card grid can only fit one card per row. The canonical narrow-to-wide breakpoint is **768px (`md`)**: below 768px use one-card/mobile behavior; at 768px and above, the card grid can fit two cards per row and interaction sizing / preview affordances should treat the viewport as "wide". Do not use `sm` (640px) as the wide-card threshold. Do not reserve larger preview surfaces only for traditional desktop breakpoints; image previews should generally use the available viewport width with modest margins and a large max width only to protect ultra-wide displays.
- Image assets used by site UI/content cards should be converted to **WebP** before being referenced from data or components. Keep source screenshots/photos out of runtime paths unless there is a specific reason WebP is unsuitable.

## 4. Internationalization

- Locales: Chinese (source of truth), English, Italian, Japanese
- Non-Chinese copy: AI-generated drafts, **human-reviewed** before publish

## 5. Content Modules

Each module may have a listing page with **list** or **gallery** view modes.

| Module (ZH) | Purpose |
|-------------|---------|
| 项目 | Code work outside coursework |
| 课设 | Course projects; reference repos for juniors/seniors |
| 工作台 | Third-party software, services, and platforms **I use**—stable toolchain; distinct from **方向** (thematic interests / focus), not a narrative “status” page |
| 小工具 | Small tools/repos I **authored or contributed to** (see §6) |
| 知识沉淀 | Blogs, article links, engineering notes, paper reading repos, etc. |
| 工作经历 | Internships and employment |
| 能力 | Cross-cutting strengths (not tool/product entries) |
| 方向 | Thematic **interests** and **active focus areas**—what I explore and prioritize now; structured topics that may link to 项目, 知识沉淀, etc. **Not** the same as 工作台 (stable third-party tools) |
| 信条 | Principles and trade-offs |
| 学术成果 | Placeholder until papers/patents/soft copyrights exist |

**Root homepage and resume route**:

- Root homepage (`/`): simple, clean, friend-facing entry point. It should include a concise personal intro, a clear online-resume CTA, public contact entry, and GitHub/profile link, but should not include the full project/course/workbench/tool showcase by default.
- Resume route (`/resume`): interviewer-facing electronic resume / career showcase. It may reuse the existing homepage highlight sections and richer self-presentation flow: directions, projects, course projects, workbench, small tools, and other content modules as they mature.
- Existing module routes stay stable unless explicitly redesigned: `/projects`, `/course-projects`, `/workbench`, `/tools`.
- **Per-module Highlights on `/resume`**: For each active content module (§5 table), show a curated subset of entries—entries marked in data (e.g. `highlight: true` or `featured` ordering). Typical cap: 1–3 items per module; module title + “view all” link to the module listing page.
- **学术成果** / **方向**（无条目时）: Omit resume Highlight block until at least one entry exists.
- Highlights are editorial curation, not automatic “latest N”; empty modules may show only the section header + link or hide the block.

### 工作台 grouping

- 工作台 entries may be modeled as **software groups**: curated groups of third-party software, services, and platforms used together in a stable workflow.
- Software groups must be reusable across homepage Highlights and the full 工作台 page. Homepage may show a small curated horizontal set plus a “view all” entry; the 工作台 page shows all groups in a more complete top-to-bottom listing.
- Software-group cards should be reusable between homepage and 工作台 page, with layout variants controlled by props or page context rather than duplicating card implementations.

## 6. Entries, Relations & Integrations

### 小工具 eligibility

- Include repos where I am a **GitHub Contributor** (including meaningful work on **my own fork**)
- Prefer listing **my fork URL** when the fork is the canonical link for the site entry
- Exclude entries that are only “starred” or used but not contributed to

### Relations & tags

- Cross-module links on cards (e.g. project → knowledge, 工作台, 小工具, 能力, 方向); desktop hover preview deferred; mobile tap-to-expand; tags navigate to targets
- Static labels allowed (e.g. archived)

### GitHub stars

- For GitHub projects: show star count when available
- **Build-time** fetch in CI into static data; no API tokens in client bundles; degrade gracefully if fetch fails

## 7. Legal & Compliance

- Privacy: No unnecessary tracking; minimize personal data collection
- Accessibility: Readable, navigable layouts across common viewport sizes
