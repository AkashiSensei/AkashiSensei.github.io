# ROADMAP
(Log of milestones and key architectural decisions)

## Milestones

- [x] Initial repository setup
- [x] Initial context governance (`.context/`)
- [x] Requirements analysis — RAW ↔ SPEC aligned, ready for implementation
- [ ] React project scaffold (Vite, TypeScript, shadcn/ui, Tailwind)
- [ ] Personal homepage MVP (homepage Highlights, first content modules, GitHub Pages deploy)

## History

- 2026-05-19 | Context governance + requirements analysis | Established `.context/` (RAW, SPEC, README); aligned SPEC with React + shadcn/ui, nine content modules, per-module homepage Highlights, data-driven entries, GitHub Pages user site (`base: '/'`)

## Decisions

- D1: Use `.context/` as the project-level persistent context and governance layer.
- D2: React + Vite + TypeScript + shadcn/ui (Tailwind, Radix); static GitHub Pages deploy.
- D3: **GitHub Pages user site only** (`AkashiSensei.github.io` → `https://akashisensei.github.io/`, not project site); Vite `base: '/'`.
- D4: Homepage shows per-module Highlight strips for each content module (curated via data).
- D5: UI scope is presentation/navigation only in v1—no complex forms or heavy interaction.
- D6: i18n: Chinese source of truth; EN / IT / JA via AI draft + human review before publish.
