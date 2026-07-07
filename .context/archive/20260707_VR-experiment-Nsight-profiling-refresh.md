# ACTIVE_TASK

Status: COMPLETED on 2026-07-07

## Goal

Supplement the existing `vr-experiments-2026` course-project entry after the user provides the new virtual-reality experiment assignment content.

## Issue Reference

- User request: prepare for adding content to the virtual reality experiment assignment.
- Target entry inferred from current data: `vr-experiments-2026` (`AkashiSensei/BUAA-VR-Experiments-2026-hw`).
- Related but separate entry: `vr-raytracer-2026` is the completed ray tracing final project and should not be merged back into the experiment assignment.
- Remote freshness checked on 2026-07-06: current branch `main` against upstream `origin/main` after `git fetch origin`; result `0 ahead / 0 behind`, local and remote commits are aligned.
- Existing unrelated working-tree changes are present and must be preserved.

## Implementation Details

- Await the user's specific materials before implementation: experiment names, repository/file changes, screenshots or GIFs, personal contribution notes, completion state, and any intended highlight behavior.
- Keep the work scoped to the course-project module unless the provided content introduces a wider site requirement.
- Update the existing `vr-experiments-2026` record rather than creating a new course-project entry, unless the new material is clearly a separate assignment with its own repo, media, and lifecycle.
- Preserve the already separate `vr-raytracer-2026` entry for the course final ray tracing renderer.
- For this personal-assignment entry, keep all bullets in `projectIntro` and leave `personalWork` empty so the detail page does not render a separate personal-work section.
- Add or replace media only with real user-provided assets. Convert runtime screenshots/photos to WebP where suitable; GIF may remain when animation is the point.
- Keep Chinese as the source copy and draft matching English copy in the existing i18n namespace.
- Do not update `SPEC.md` or `RAW_REQUIREMENTS.md` for this task unless the user-provided content changes global requirements or architecture.

## Test Plan

- Validate edited JSON by running the repository's build or a targeted JSON parse check.
- Run `npm run build` after implementation to verify TypeScript, Vite, i18n imports, route data, and static asset references.
- Run `npm run lint` if TypeScript data shape, shared rendering, sorting, or component behavior changes beyond content-only edits.
- Manual user check after implementation: review `/course-projects` and `/course-projects/vr-experiments-2026` to confirm copy, media order, repository links, status tags, and mobile readability.

## Focusing Files

- `src/data/course-projects.ts`
- `src/content/locales/zh/course-projects.json`
- `src/content/locales/en/course-projects.json`
- `public/assets/course-projects/vr-experiments-2026/`
- `src/components/ProjectHighlights.tsx`
- `scripts/fetch-github-repo-stats.mjs`
- `src/data/generated/github-repo-stats.json`

## Technical Context

- Course projects are data-driven entries; views must not hardcode individual records.
- Existing module routes stay stable, including `/course-projects` and `/course-projects/:projectId`.
- Summary cards should stay scannable; richer assignment details and bullets belong on the detail page.
- Resume-facing course/detail bullets should emphasize the author's role, decisions, implementation work, trade-offs, and impact rather than only describing the assignment.
- Runtime image assets should generally be WebP; overly bright screenshots should be marked with `brightness: "high"` in metadata.
- Default verification should use non-interactive checks. Do not start a dev server or inspect the site in a browser unless the user explicitly asks.

## Completion Notes

- Read the updated public repository README and experiment subdirectory docs/reports for `BUAA-VR-Experiments-2026-hw`.
- Updated `vr-experiments-2026` from ongoing/active to completed/public.
- Rewrote Chinese and English summary plus `projectIntro` bullets to de-emphasize the assignment mechanics and foreground Nsight Systems / Nsight Compute profiling, roofline analysis, memory-sector efficiency, warp stalls, occupancy constraints, and multi-GPU synchronization/data movement.
- Kept the four experiment-summary bullets concise for Blender animation, OpenGL/GLSL viewers, virtual-surgery soft-tissue deformation, and CUDA cloth/SPH simulation with shared memory and multi-GPU execution.
- Adjusted `vr-experiments-2026` to use project-introduction bullets only, because this is a personal assignment and should not render a separate personal-work section.
- Added 18 user-provided local images from the temporary image folder, converted them to WebP, placed profiling/analysis screenshots first, placed effect previews after them, and kept the existing dog animation/model images last.
- Added `Profiling`, `Nsight Systems`, and `Nsight Compute` tags to the VR experiment task, the ray tracing renderer, and Parallel Programming A.
- Moved `vr-experiments-2026` to the front of the course-project data order.
- Added fallback GitHub stats for both raytracer repositories so build-time stats and GitHub Actions refresh can cover `AkashiSensei/raytracer` and `Sankieqwq/raytracer`.
- Set the raytracer main repository (`Sankieqwq/raytracer`) before the fork (`AkashiSensei/raytracer`) in both top-level metadata and link order.
- Verified locale JSON parsing, `npm run fetch:github-repo-stats`, `npm run lint`, and `npm run build`. Build succeeded; GitHub stats fetch used fallback/previous data for many repos due fetch failures.

## Task Checklist

- [x] Receive the user-provided content and identify whether it belongs to `vr-experiments-2026` or a new course-project entry.
- [x] Decide lifecycle/status/highlight treatment based on the provided material.
- [x] Convert user-provided local images to WebP and add them before the existing dog animation/model images.
- [x] Update `src/data/course-projects.ts` for repo metadata, tags, status, media list, dimensions, and brightness metadata as needed.
- [x] Preserve the Chinese title wording and rewrite summary/project-intro/personal-work copy.
- [x] Move all `vr-experiments-2026` bullets into `projectIntro` and keep `personalWork` empty.
- [x] Draft matching English title/summary/image labels/project-intro/personal-work copy.
- [x] Run non-interactive verification and report any build/lint/network limitations.
- [x] Stop for user review before archiving or updating `ROADMAP.md`.
