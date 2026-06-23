# ACTIVE_TASK

Status: COMPLETED on 2026-06-23

## Goal

更新研究生《并行程序设计 A》课设条目的资料，让 `/course-projects/parallel-programming-2026` 更准确地反映最新完成的作业内容。

## Issue Reference

- User request: 2026-06-23 start a new task to revise materials after further completing the graduate Parallel Programming A assignment.
- No external issue link provided.

## Implementation Details

- Target existing course-project entry `parallel-programming-2026`.
- Refresh structured metadata if needed:
  - repository remains `AkashiSensei/BUAA-Parallel-Programming-2026-hw` unless the user provides a different canonical link;
  - confirm whether `lifecycleStatus` / `status` should stay `ongoing` / `active` or move toward completed wording;
  - adjust tags only if the newly completed work introduces important technologies beyond the current `C`, `OpenMP`, `MPI`, and `Parallel Programming`.
- Refresh bilingual content:
  - update Chinese title/summary/points first as the source of truth;
  - update English copy as a human-reviewable AI draft;
  - keep copy concise on summary cards and reserve fuller bullet detail for the detail page, matching the current card-density rule.
- Refresh images only if new visual materials are provided:
  - convert runtime assets to WebP where appropriate;
  - place them under `public/assets/course-projects/parallel-programming-2026/`;
  - add width/height metadata and `brightness: "high"` for white or bright screenshots;
  - add matching zh/en alt text keys.
- Preserve existing route and data-driven architecture:
  - `/course-projects`;
  - `/course-projects/parallel-programming-2026`;
  - resume Course Projects highlight behavior.

## Test Plan

- Run the project static checks available in `package.json`, prioritizing typecheck/build/lint where defined.
- Verify every new or changed image referenced in `src/data/course-projects.ts` exists under `public/assets/course-projects/parallel-programming-2026/`.
- Verify zh/en locale keys match every changed `altKey` and item field.
- Manual visual review is user-owned unless explicitly delegated, per project workflow constraints.

## Focusing Files

- `src/data/course-projects.ts`
- `src/content/locales/zh/course-projects.json`
- `src/content/locales/en/course-projects.json`
- `public/assets/course-projects/parallel-programming-2026/`
- `src/data/generated/github-repo-stats.json` if repository stats need regeneration or snapshot adjustment

## Technical Context

- `.context/SPEC.md` defines `课设` as course projects and reference repositories for juniors/seniors.
- Content entities must live in structured data with stable `id`s; UI views must not hardcode individual entries.
- Per-entity copy should be addressable by stable entity id; current course-project copy uses locale records keyed by `parallel-programming-2026`.
- Summary cards should stay scannable; richer bullet lists, screenshots, metadata, and links belong on detail pages.
- Runtime image assets should be WebP when suitable, with brightness metadata for overly bright screenshots.
- Agent workflow: do not start a dev server or browser verification unless the user explicitly asks.
- Remote freshness: after `git pull --ff-only origin main`, local `main` is aligned with `origin/main`.

## Task Checklist

- [x] Replace the resume Course Projects featured slot for undergraduate thesis with `parallel-programming-2026`.
- [x] Receive or locate the updated Parallel Programming A materials to incorporate.
- [x] Review the current `parallel-programming-2026` data, zh/en copy, and screenshots against the requested resume highlight change.
- [x] Update `src/data/course-projects.ts` featured metadata for the resume highlight change.
- [x] Add converted WebP screenshots from the temporary image folder before existing Parallel Programming A images.
- [x] Keep `ncu_shared_memory_8192` as the first Parallel Programming A image.
- [x] Add a Parallel Programming A bullet for CUDA matrix multiplication and Nsight-based GPU performance analysis.
- [x] Update Chinese course-project image alt text.
- [x] Update English course-project image alt text.
- [x] Run static verification checks for the resume highlight change.
- [x] Run static verification checks for the new Parallel Programming A images.
- [x] Report changed scope and any remaining manual review items.

## Completion Notes

- Resume Course Projects now features the graduate Parallel Programming A assignment instead of the undergraduate thesis entry.
- The Parallel Programming A gallery now starts with the shared-memory NCU memory analysis image, followed by the new Nsight/GEMM analysis screenshots and the existing images.
- The detail bullet now describes naive and shared-memory CUDA matrix multiplication plus Nsight Systems / Nsight Compute performance analysis.
- Verified with `tsc -b --pretty false`, `npm run lint`, and `vite build`.
