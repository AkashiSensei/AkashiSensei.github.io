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

## 3. Page Design Requirements

This section is the standing brief for future page design work. When modifying or adding pages, apply these requirements without asking the user to restate them.

### 3.1 Design intent & quality bar

- The site must stay content-first, readable, public-safe, and visually designed rather than template-like. It should feel suitable for friends, open-source peers, and interviewers.
- Mobile quality is not secondary. All page designs must work down to 320px before desktop polish is considered complete.
- The interface should provide strong design character across common screens: phones, ordinary landscape desktops/laptops, and portrait / high-narrow desktop workspaces. Unusual very-wide screens must remain coherent and attractive.
- Avoid generic AI-design fingerprints: purple/blue glow defaults, decorative gradient blobs, excessive glass cards, symmetrical three-card rows, indistinct pill-heavy UI, and visuals that only look good on one desktop viewport.
- Prefer deliberate typography, controlled reading widths, coherent spacing, one consistent accent system, clear hierarchy, and layout decisions that reflect the page's content rather than generic decoration.
- Typography should be restrained by default. Unless the user explicitly asks for emphasis, avoid bold / heavy font weights for ordinary section titles, card titles, descriptions, and metadata. Prefer normal or medium weights with spacing, position, color, and scale providing hierarchy.
- Font sizes should generally be conservative and slightly smaller rather than oversized. Large display type is reserved for true hero moments; section titles, cards, descriptions, tags, metadata, and overlays should use compact, readable sizes that do not dominate the page.
- Border radius should also be conservative. Avoid large, soft, app-store-like rounded cards unless explicitly requested; ordinary cards, image frames, panels, and overlays should prefer modest radii that feel precise and editorial.

### 3.2 Technical UI foundation

- Styling: Tailwind CSS.
- Component approach: **shadcn/ui** copy-in components owned by the project, built on Radix UI primitives. Avoid building complex accessible widgets by hand when shadcn/Radix primitives fit.
- UI scope: presentation and navigation only--cards, tags, buttons, links, layout shell, theme toggle, locale switcher, list/gallery containers. No complex forms or heavy interactive flows in v1.
- Light/dark theme and locale support remain first-class. Visual changes must not break theme, locale, content data, route contracts, or i18n key ownership.
- Image assets used by site UI/content cards should be converted to **WebP** before being referenced from data or components. Keep source screenshots/photos out of runtime paths unless there is a specific reason WebP is unsuitable.
- When adding or replacing image assets, review whether the image is overly white or overly bright, especially screenshots with large white backgrounds. Mark such image metadata with `brightness: "high"` so dark mode applies the standard maximum-brightness overlay. Do not rely on dark mode alone to make bright screenshots comfortable.

### 3.3 Current design evolution

- The current frosted-glass visual system is the only active site style for now. Improve it in place rather than introducing a new style family.
- Do not add user-facing style switching, design-style persistence, or a design-variant registry in the current phase.
- Future design variants may be reconsidered later, but they are explicitly out of scope until the current design is cleaner, more stable, and better adapted to common screen shapes.
- Design work should focus on the existing layout system: typography, spacing, card/list composition, navigation ergonomics, image treatment, section rhythm, and responsive behavior.
- Special visual effects, including `metal-fx`, are not part of the current design direction unless a future task explicitly reintroduces them.

### 3.4 Viewport profiles & responsive composition

- Manage viewport behavior through centralized named profiles that consider both width and orientation / aspect ratio:
  - **Mobile**: 320px-767px. Touch-first, single-column reading, stable bottom-safe controls, generous tap targets, no horizontal overflow.
  - **Standard portrait / tall workspace**: 768px-1599px with portrait or high-narrow proportions. Prioritize readable line lengths, stacked or restrained two-column layouts, and avoid forcing landscape-first compositions into a tall viewport.
  - **Standard landscape**: 768px-1599px with landscape proportions. This is the primary ordinary desktop/laptop/tablet-landscape profile; support richer composition while keeping text widths controlled.
  - **Wide desktop**: 1600px and above, especially large landscape browser windows and high-resolution external displays, including 2400px+ widths. Use additional horizontal space for richer composition, side metadata, image walls, asymmetric grids, and stronger editorial rhythm without stretching text lines.
- Current design revisions must define how each viewport profile changes shell spacing, navigation placement, section rhythm, card/list density, image/gallery treatment, maximum reading width, and full-screen section behavior.
- Full-screen or page-snapping composition is allowed only when width, height, and aspect ratio support it. In portrait / tall workspaces, prefer natural multi-section scrolling over forcing one landscape-composed section to occupy the entire screen.
- Responsive breakpoint semantics for current content-card pages: treat a viewport as "narrow/mobile" when the card grid can only fit one card per row. The canonical narrow-to-wide breakpoint is **768px (`md`)**: below 768px use one-card/mobile behavior; at 768px and above, card grids may fit two cards per row. Do not use `sm` (640px) as the wide-card threshold.
- A page is not visually complete until mobile, standard landscape, and standard portrait / tall workspace profiles feel excellent, and less common large-width / unusual-ratio profiles still remain readable, coherent, and visually intentional.

### 3.5 Content, copy & layout rhythm

- Keep structured data separate from UI presentation. Layout changes should reuse the same content entities and i18n structures rather than duplicating page-specific content.
- When a redesigned layout needs additional text to make hierarchy, rhythm, or composition work, draft realistic placeholder copy rather than using lorem ipsum or empty boxes. Such copy should live in the existing i18n/content structure and be suitable for the user to hand-edit or keep after review.
- Summary cards should stay scannable. Richer narrative, long bullet lists, galleries, metadata, and relations belong on detail pages unless the module explicitly calls for overview bullets, such as 工作台.
- Detail pages should use page-level composition rather than wrapping the entire entry in one oversized card. Prefer an unframed hero/header, constrained narrative sections, metadata/link clusters, and image/gallery bands.

### 3.6 Text contrast scale

Use a centralized five-level text contrast scale for ordinary page typography instead of choosing independent `foreground` opacity values in each component. The user may refer to these levels directly as “一级 / 二级 / 三级 / 四级 / 五级文字对比度”.

| Level | Intended use |
|-------|--------------|
| 1 | Highest contrast. Primary hero text, page titles, key active states, and the most important readable text. |
| 2 | Strong regular text. Section titles, important body copy, prominent links, and card titles. |
| 3 | Secondary text. Supporting descriptions, subtitles, and readable explanatory copy. |
| 4 | Low-emphasis text. Metadata, captions, secondary descriptions, helper text, and de-emphasized labels. |
| 5 | Lowest contrast. Decorative labels, tiny eyebrow text, inactive hints, and ambient metadata only. Do not use for essential body copy. |

- Implementation tokens/classes should be named `text-tone-1` through `text-tone-5`, ordered from highest to lowest contrast. New or edited components should use these classes for normal foreground text instead of ad hoc values such as `text-foreground/70`.
- The scale must be theme-aware. Light and dark modes may use different underlying opacity/lightness values, but level meaning and relative order must stay stable.
- Levels 4 and 5 are not safe defaults for important content, small text on busy images, or text inside low-contrast glass surfaces. Use level 1-3, or a local overlay-specific text system, whenever readability is at risk.
- Image overlays may use local white/black text treatment when needed, but their hierarchy should still map conceptually to the same five levels.

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
- **Entry detail pages**: Content entries that need fuller explanation (especially 项目, 课设, 小工具) should support stable detail routes keyed by entity `id`. Detail pages are the place for full bullet lists, screenshots/galleries, richer narrative, metadata, outbound links, and future relations. Summary cards should navigate to details when a detail page exists.
- **Summary-card density**: Except for 工作台 software-group cards, homepage/resume/listing summary cards should avoid rendering bullet lists directly. Keep cards scannable with title, summary, metadata/tags, links, image preview, and a clear path to the detail page. 工作台 may keep concise bullet points because software groups are already overview entities.
- **Detail-page layout**: Detail pages must use page-level composition rather than wrapping the entire entry in one oversized card. Prefer an unframed hero/header, constrained narrative sections, metadata/link clusters, and image/gallery bands or sections. Cards are acceptable only for repeated/contained subitems, not as a single full-page container.
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
- Persistent project docs and UI copy must not record machine-specific local paths to AI skills, tools, or private workstation resources. Refer to process tools by generic names only when relevant.
- Accessibility: Readable, navigable layouts across common viewport sizes
