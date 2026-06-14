# ROADMAP

(Log of milestones and key architectural decisions.)

## Milestones

- [x] Initial repository setup
- [x] Initial context governance (`.context/`)
- [x] Requirements analysis — RAW ↔ SPEC aligned, ready for implementation
- [x] React project scaffold (Vite, TypeScript, shadcn/ui, Tailwind)
- [ ] Personal homepage MVP (homepage Highlights, first content modules, GitHub Pages deploy)
  - [x] Add per-image titles and descriptions for project galleries, and show them in the large image preview.

## History

- 2026-06-14 | [Archived: Light visual polish](archive/20260614_Light-visual-polish.md) | Removed the noisy fixed background direction, retained frosted glass with lightweight Spotlight hover, polished homepage CTAs/contact copy, and fixed desktop QR panel alignment, spacing, and Spotlight positioning.
- 2026-06-13 | [Archived: GitHub activity summary](archive/20260613_GitHub-activity-summary.md) | Added a build-time GitHub yearly contribution snapshot and resume activity section with categorized totals, private/restricted and repository counts, proportional distribution, bilingual copy, and no-browser agent workflow guidance.
- 2026-06-11 | [Archived: View on phone QR and contact copy](archive/20260611_View-on-phone-QR-and-contact-copy.md) | Added a desktop current-page QR panel for phone handoff, dynamic production/local URL encoding, and copy-to-clipboard email contact behavior.
- 2026-06-11 | [Archived: Existing design responsive polish](archive/20260611_Existing-design-responsive-polish.md) | Systematically polished the existing frosted-glass resume experience across mobile, narrow/tall desktop, wide desktop, detail pages, navigation, project media, workbench previews, and section rhythm.
- 2026-06-05 | [Archived: Knowledge module](archive/20260605_Knowledge-module.md) | Added the Knowledge module with curated repo-backed entries, listing/detail routes, WebP galleries, resume highlights, build-time GitHub stats, dynamic update months, and unified detail tag styling.
- 2026-06-04 | [Archived: Entry detail pages and card density](archive/20260604_Entry-detail-pages-and-card-density.md) | Added project/course/tool detail routes, moved non-workbench bullets into detail pages, and polished responsive detail layouts with desktop image walls and large-image previews.
- 2026-06-03 | [Archived: Image preview thumbnail sync](archive/20260603_Image-preview-thumbnail-sync.md) | Added synchronized large-image thumbnail previews for projects, course projects, and tools; tuned preview/card layout, compact homepage cards, image assets, bilingual copy, and responsive breakpoint guidance.
- 2026-06-03 | [Archived: Route homepage/resume React Router](archive/20260603_Route-homepage-resume-react-router.md) | Split friend-facing `/` from interviewer-facing `/resume`, migrated routing to React Router, added history-aware module back buttons, and polished homepage/resume copy.
- 2026-06-02 | Browser language default selection | Updated i18n startup to show Chinese for `zh*` browser/system languages and English for all other languages, while keeping manual language switching and syncing the document `lang` attribute.
- 2026-06-02 | [Archived: Course projects module](archive/20260602_Course-projects-module.md) | Added a first-class Course Projects module with curated homepage cards, `/course-projects`, media galleries, semester tags, stats handling, and bilingual copy.
- 2026-05-23 | Nightly GitHub repo stats refresh | Scheduled the GitHub Pages deployment workflow to rebuild daily at 03:00 Asia/Shanghai so commit and star counts refresh in the deployed static site without creating automated commits.
- 2026-05-22 | GitHub Pages workflow deployment | Added Actions-based Vite build/deploy flow for GitHub Pages, PR build validation, and CI token passthrough for build-time GitHub stats.
- 2026-05-22 | [Archived: Small tools copy and gallery polish](archive/20260522_Small-tools-copy-and-gallery-polish.md) | Refined bilingual Small Tools copy, added tool screenshot galleries, aligned Small Tools and Workbench homepage rails with Projects, and matched `/tools` to the two-column project layout.
- 2026-05-22 | Homepage metadata and Akashi subtitle | Updated favicon from local icon asset, added route-specific page titles, and added the fixed Japanese homepage subtitle with localized hover translations.
- 2026-05-22 | [Archived: Card tag gallery content refresh](archive/20260522_Card-tag-gallery-content-refresh.md) | Unified card point/tag rendering, added project galleries and GitHub stats, refreshed bilingual project copy/assets, and polished project layouts/status badges.
- 2026-05-21 | [Archived: Projects homepage and page](archive/20260521_Projects-homepage-and-page.md) | Added data-driven 项目 module with curated GitHub project entries, homepage highlights, `/projects` page, card variants, zh/en copy, and route/nav integration.
- 2026-05-21 | [Archived: Small tools homepage and page](archive/20260521_Small-tools-homepage-and-page.md) | Added data-driven 小工具 module with homepage highlights, `/tools` masonry page, optional screenshot/private-link card support, and zh/en copy.
- 2026-05-20 | Direction icons theme fix | Converted direction icons from external SVG images to inline React SVG components driven by app `dark:` classes; removed unreferenced public SVG files.
- 2026-05-20 | [Archived: Workbench homepage and page](archive/20260520_Workbench-homepage-and-page.md) | i18n namespace split; eight software groups with icons; homepage highlights + `/workbench` masonry page; client routing for GitHub Pages.
- 2026-05-20 | [Archived: Homepage directions](archive/20260520_Homepage-directions.md) | Added directions section to homepage with data-driven SVGs, responsive frosted glass cards.
- 2026-05-19 | [Archived: Homepage glass shell, i18n, contact](archive/20260519_Homepage-glass-nav-i18n-contact.md) | Homepage intro + zh/en locales; glass nav (mobile bottom / desktop top); theme + contact Dialog; SPEC/RAW updates; Vite LAN `host`; workbench icons excluded from commit.
- 2026-05-19 | [Archived: React scaffold + shadcn baseline](archive/20260519_React-Vite-shadcn-scaffold.md) | Landed Vite/React/TS/Tailwind v4 with shadcn/ui (Nova/Radix): `base: '/'`, `@/` alias, Hello World + sample Button, Geist variable font; local build verified; ACTIVE_TASK snapshot at link.
- 2026-05-19 | Context governance + requirements analysis | Established `.context/` (RAW, SPEC, README); aligned SPEC with React + shadcn/ui, nine content modules, per-module homepage Highlights, data-driven entries, GitHub Pages user site (`base: '/'`).

## Decisions

- D1: Use `.context/` as the project-level persistent context and governance layer.
- D2: React + Vite + TypeScript + shadcn/ui (Tailwind, Radix); static GitHub Pages deploy.
- D3: **GitHub Pages user site only** (`AkashiSensei.github.io` → `https://akashisensei.github.io/`, not project site); Vite `base: '/'`.
- D4: Resume page (`/resume`) shows per-module Highlight strips for each content module (curated via data); root homepage (`/`) stays lightweight and friend-facing.
- D5: UI scope is presentation/navigation only in v1—no complex forms or heavy interaction.
- D6: i18n: Chinese source of truth; EN / IT / JA via AI draft + human review before publish.
- D7: Use React Router for client-side route declarations, navigation, fallback handling, and future nested/detail routes.
