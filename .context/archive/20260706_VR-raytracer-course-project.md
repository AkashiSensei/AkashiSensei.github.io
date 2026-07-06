# ACTIVE_TASK

Status: COMPLETED on 2026-07-06

## Goal

Add the 《虚拟现实综合实验》 ray tracing renderer as a separate newest course-project entry, ordered first by completion time, while preserving the existing VR experiment entry and excluding the new raytracer entry from resume highlights.

## Issue Reference

- User request: update the course-project module for the 《虚拟现实综合实验》 final project.
- Main repository: https://github.com/Sankieqwq/raytracer
- User fork: https://github.com/AkashiSensei/raytracer
- Remote freshness checked: `main` against `origin/main` after `git fetch origin`; result `0 0`, local and remote commits are aligned. Existing unrelated working-tree changes are present and must be preserved.

## Implementation Details

- Preserve existing course-project id `vr-experiments-2026` for the earlier VR experiment/dog animation task. Add the course final project as a separate C++ ray tracing renderer entry.
- Use the public main repository as the project reference and the user fork as the user's repository link. Prefer exposing the fork (`AkashiSensei/raytracer`) as the primary course-project repo, while noting the main team repo (`Sankieqwq/raytracer`) through the multi-link repository metadata if the data model supports it cleanly.
- Keep the raytracer entry public, completed, and non-featured:
  - `lifecycleStatus: "completed"`
  - `status: ["public"]`
  - do not set `featured: true`, so it will not appear on `/resume` course highlights.
- Make it list first on `/course-projects`.
- Draft initial Chinese and English copy from the public repository information:
  - C++17 ray tracing renderer.
  - JSON scene configuration and command-line overrides.
  - PPM/PNG output.
  - CPU rendering path with multi-threading controls.
  - BVH acceleration and mesh support.
  - OBJ/GLB loading, PBR/texture/material support, area lights, tone mapping, and regression/golden-image tests.
  - Render/benchmark/html report scripts and CUDA/Blender integration can be mentioned carefully as repository capabilities.
- Add user-provided personal-work bullets covering topic direction, Blender scenes/plugin/bridge/server support, OIDN denoising with albedo/normal buffers, and Nsight Systems / Nsight Compute CUDA analysis.
- Add converted WebP screenshots under `public/assets/course-projects/vr-raytracer-2026/`.
- Keep `SPEC.md` and `RAW_REQUIREMENTS.md` unchanged: the course-project module, public repo links, listing/detail behavior, and resume-highlight curation are already covered by the current source-of-truth docs.

## Test Plan

- Run `npm run build` after implementation to verify TypeScript, Vite build, i18n JSON, route imports, and generated static output.
- If build fails because GitHub stats fetching is rate-limited or network-blocked, run the repo's available non-network verification path if one exists, or report the blocked build clearly.
- Run `npm run lint` if the implementation touches TypeScript shape, sorting logic, or shared project-card rendering beyond simple data/i18n edits.
- Manual user check after approval: visit `/course-projects` and the course-project detail route, confirm the raytracer entry is first, not shown in `/resume` highlights, and link labels open the intended repositories.

## Focusing Files

- `src/data/course-projects.ts`
- `src/content/locales/zh/course-projects.json`
- `src/content/locales/en/course-projects.json`
- `src/components/CourseProjectHighlights.tsx`
- `src/pages/CourseProjectsPage.tsx`

## Technical Context

- Course projects are data-driven entries; UI should not hardcode individual course-project records.
- Summary cards should stay scannable; richer bullets belong on detail pages.
- Resume highlights are curated with `featured` / `featuredOrder`, not automatic latest entries.
- Existing module routes should stay stable, including `/course-projects`.
- Image assets referenced by data should be WebP unless there is a specific reason otherwise; do not reference missing screenshots.
- Agent workflow constraint: default verification should use build/typecheck/lint, not a dev server or browser inspection unless explicitly requested.

## Completion Notes

- Added a new `vr-raytracer-2026` course-project entry with fork/main repository links, completed/public status, and no resume-highlight flag.
- Restored the existing `vr-experiments-2026` VR experiment/dog animation entry as a separate project.
- Converted six user-provided desktop images to WebP and placed them under the raytracer-specific course-project asset directory.
- Shortened the raytracer title and kept the course name in the summary.
- Marked 《并行程序设计 A》 as completed.
- Updated Chinese and English personal-work copy for the raytracer, Career YIYAN, and Cloud YIYAN entries.
- Verified locale JSON parsing, `npm run build`, and `npm run lint`. Build succeeded, with GitHub stats fetch falling back/skipping some repos due network/API failures.

## Task Checklist

- [x] Restore `vr-experiments-2026` as the earlier VR experiment entry and split the raytracer final project into its own course-project entry.
- [x] Update course-project data for repo links, status, tags, completion state, highlight exclusion, and listing order.
- [x] Rewrite Chinese course-project title, summary, image labels if applicable, project-intro bullets, and initial personal-work bullets.
- [x] Rewrite English copy to match the Chinese source and current i18n structure.
- [x] Remove stale dog animation image references or replace them only with real renderer screenshot assets if provided.
- [x] Verify the entry appears first on `/course-projects` and remains absent from `/resume` course highlights.
- [x] Run non-interactive checks and document any network-related build limitation.
