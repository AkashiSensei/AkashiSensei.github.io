# ROADMAP

(Log of milestones and key architectural decisions.)

## Milestones

- [x] Initial repository setup
- [x] Initial context governance (`.context/`)
- [x] Requirements analysis — RAW ↔ SPEC aligned, ready for implementation
- [x] React project scaffold (Vite, TypeScript, shadcn/ui, Tailwind)
- [ ] Personal homepage MVP (homepage Highlights, first content modules, GitHub Pages deploy)

## History

- 2026-05-22 | Homepage metadata and Akashi subtitle | Updated favicon from local icon asset, added route-specific page titles, and added the fixed Japanese homepage subtitle with localized hover translations.
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
- D4: Homepage shows per-module Highlight strips for each content module (curated via data).
- D5: UI scope is presentation/navigation only in v1—no complex forms or heavy interaction.
- D6: i18n: Chinese source of truth; EN / IT / JA via AI draft + human review before publish.
