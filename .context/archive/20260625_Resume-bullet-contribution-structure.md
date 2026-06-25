# ACTIVE_TASK

Status: COMPLETED on 2026-06-25

## Goal
Revise project and course-project bullet copy so resume-facing details emphasize my personal role, technical work, decisions, and impact rather than mostly describing the projects themselves.

## Issue Reference
No external issue. User request on 2026-06-25.

Remote freshness checked before planning: current branch `main`, upstream `origin/main`, after `git fetch origin`; `git rev-list --left-right --count main...origin/main` returned `0 0`, so local `main` was current with `origin/main`.

## Implementation Details
- Added a locale-driven `points.projectIntro` / `points.personalWork` structure for project and course-project bullets so contribution categories can be edited directly beside translated copy.
- Preserved compatibility for older array-shaped bullet data through a shared parser while converting project/course locale entries to the new structure.
- Rendered personal-work bullets with the existing emphasized bullet treatment on project/course cards.
- Split project/course detail pages into separate `Project Overview` / `Personal Work` sections, while keeping detail-page personal-work bullets visually neutral.
- Removed the bottom `View details` button from full project/course listing cards now that those cards show all bullets; title links still navigate to detail pages.
- Kept summaries as project context and moved personal role/contribution language into `personalWork` where appropriate for team projects.
- Polished follow-up copy issues: Chinese punctuation, Chinese ellipses, and `Elasticsearch` naming.

## Test Plan
- [x] JSON validity: parsed project/course locale files after structural and copy changes.
- [x] Type/build check: ran `npm run lint`, `./node_modules/.bin/tsc -b`, and `./node_modules/.bin/vite build`.
- [x] Manual content review: checked contribution-section counts and sampled bilingual project/course entries.
- [x] Translation review: compared zh/en project/course point section counts for parity.

## Focusing Files
- `src/content/locales/zh/projects.json`
- `src/content/locales/zh/course-projects.json`
- `src/content/locales/en/projects.json`
- `src/content/locales/en/course-projects.json`
- `src/lib/project-points.ts`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectHighlights.tsx`
- `src/pages/ProjectDetailPage.tsx`

## Technical Context
- SPEC requires content entities to live in structured data / locale files, not React source.
- Chinese is the source of truth; non-Chinese copy is AI-generated draft and should be human-reviewed before publish.
- Summary cards should stay scannable; richer bullet lists belong on detail pages.
- New standing requirement: resume-facing project/course/detail bullets should prioritize the author's concrete role, decisions, implementation work, trade-offs, and measurable impact; brief context is acceptable, but bullets must not mostly hide the author's contribution behind product/function description.
- Agent workflow: do not start a dev server or browser verification unless explicitly requested; use build/typecheck/lint/script checks by default.

## Task Checklist
- [x] Audit current `projects.json` and `course-projects.json` bullet lists; mark bullets that are mostly project/function description.
- [x] Establish a rewrite style for contribution-first bullets: action verb + personal scope + technical object + result/evidence.
- [x] Revise high-priority project entries first: Crater, Crater CLI, NPU computing forecast, model requirements evaluator, personal homepage.
- [x] Revise high-priority course-project entries next: OS, parallel programming, parallel architecture, graduation thesis, software engineering team projects.
- [x] Keep weaker/older/smaller entries honest: state individual implementation/learning contribution without inflating scope.
- [x] Synchronize English locale copy after the Chinese source is stable.
- [x] Run JSON/build verification and report any remaining content-review items.
