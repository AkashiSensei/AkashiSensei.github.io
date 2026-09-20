# ACTIVE_TASK

Status: COMPLETED on 2026-09-20

## Goal

从工作台「知识沉淀」去掉 Evernote，并将 Typora + FlowUS 文案保留为该组最后一条 bullet。

## Issue Reference

- No external issue.
- User request on 2026-09-20: remove Evernote icon/references from knowledge-tools; icon wall must not use it; bullet becomes「Typora、FlowUS 承担快速采集与结构化笔记」, then move that bullet to the end of the group.
- Remote freshness at planning: `main` == `origin/main`.

## Implementation Details

- Remove `evernote` from `workbench.ts` knowledge-tools software list; order Typora before FlowUS, then Obsidian, Zotero, MindNow.
- Update zh/en copy: Typora + FlowUS bullet lives last in the knowledge-tools points list; drop Evernote wording; keep EN third-party Typora mention from duplicating after the move.
- Remove WorkbenchHighlights special-case filters that previously hid Evernote from the icon wall / preview group.
- Delete unused `evernote-512.webp`.
- Align RAW knowledge-tools tool list to Typora instead of Evernote.

## Test Plan

- Non-interactive: `npx tsc -b --pretty false` and `npm run lint` passed.
- User confirmed visual/copy review before archive.

## Focusing Files

- `src/data/workbench.ts`
- `src/content/locales/zh/workbench.json`
- `src/content/locales/en/workbench.json`
- `src/components/WorkbenchHighlights.tsx`
- `public/assets/workbench-icons/evernote-512.webp` (deleted)
- `.context/RAW_REQUIREMENTS.md`

## Technical Context

- Workbench groups are data-driven; homepage Highlights and `/workbench` share the same records.
- Icon wall should follow the software list; no ad-hoc Evernote hide filters.

## Task Checklist

- [x] Remove Evernote from knowledge-tools software data
- [x] Update zh/en Typora + FlowUS bullet and move it to last
- [x] Remove Evernote-specific icon-wall/preview filters
- [x] Remove unused Evernote asset
- [x] Align RAW knowledge-tools tool list
- [x] Quick verify / typecheck
- [x] User review before archive
