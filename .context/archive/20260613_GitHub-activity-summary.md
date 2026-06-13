# ACTIVE_TASK

Status: COMPLETED on 2026-06-13

## Goal

在 `/resume` 添加过去一年 GitHub 活跃度摘要，展示总贡献数及 commit / review / PR / issue 分类，并标注数据获取时间。

## Issue Reference

无外部 Issue；来自用户 2026-06-12 需求补充。

## Implementation Details

- 复用现有“构建期获取 GitHub 数据并生成静态 JSON”的架构，不在浏览器端调用 GitHub API。
- 新增 GitHub 用户活跃度快照，目标账号为 `AkashiSensei`，时间范围为构建时间向前一年。
- 优先使用 GitHub GraphQL `user(login).contributionsCollection(from, to)` 获取：
  - `contributionCalendar.totalContributions`
  - `totalCommitContributions`
  - `totalPullRequestReviewContributions`
  - `totalPullRequestContributions`
  - `totalIssueContributions`
  - `totalRepositoryContributions`
  - `restrictedContributionsCount`
- 快照包含 `fetchedAt`、`from`、`to`、`login`、各分类计数，以及失败时可用于保留旧数据的结构。
- 构建/部署路径沿用现有每日 GitHub Pages workflow；GitHub API 失败不阻断部署。
- 简历页新增紧凑的 GitHub 活跃度展示区，放在项目模块之下、兴趣模块之上，与现有页面节奏、`text-tone-*` 对比度体系和移动端布局保持一致。
- UI 文案进入 `resume` i18n 命名空间，补齐中文与英文；数据获取时间和统计范围按当前语言格式化。
- 明确降级状态：无数据时显示低干扰的“暂不可用”，不要让空数据看起来像真实的 0。
- 文档明确：除非用户明确要求，Agent 不启动开发服务器，不打开、自动化、截图或检查浏览器页面。

## Test Plan

- Unit / data: 验证生成的 JSON schema 能被 TypeScript helper 正确读取；缺失字段时返回 `undefined` 或降级对象。
- Build/type: 运行 `./node_modules/.bin/tsc -b`，确认 TypeScript 构建通过。
- Whitespace: 运行 `git diff --check`，确认补丁无尾随空白或冲突标记。
- Manual UI: 页面视觉、响应式效果与浏览器观感由用户手动检查；除非用户明确要求，Agent 不启动开发服务器、不打开浏览器。
- Failure path: 无 token 或 API 失败时，脚本保留旧快照或跳过新数据，页面正常渲染。

## Focusing Files

- `scripts/fetch-github-repo-stats.mjs`
- `src/data/generated/github-repo-stats.json`
- `src/lib/github-repo-stats.ts`
- `src/pages/ResumePage.tsx`
- `src/components/GitHubActivityHighlights.tsx`
- `src/content/locales/zh/resume.json` / `src/content/locales/en/resume.json`
- `.github/workflows/pages.yml`
- `.context/README.md`
- `.context/SPEC.md`
- `.context/RAW_REQUIREMENTS.md`

## Technical Context

- 项目是 React + TypeScript + Vite + Tailwind 的纯静态 GitHub Pages 用户站，Vite `base` 固定为 `/`。
- `/resume` 是面向面试官的电子简历/能力展示页；根路径 `/` 保持轻量友好，不承载完整简历模块。
- 现有 GitHub 仓库 Star / commit 数已通过构建期脚本写入 `src/data/generated/github-repo-stats.json`，并由每日 GitHub Pages workflow 刷新。
- SPEC 要求 GitHub 数据不进入客户端实时请求路径，不在客户端 bundle 暴露 token，失败时优雅降级。
- GitHub 活跃度的总贡献数来自 GraphQL contribution calendar；右侧分类包括 commits、reviews、pull requests、issues、repositories 和 restricted/private contributions，合计与总贡献数对齐。
- 当前视觉系统为既有毛玻璃风格；新增 UI 使用现有 layout rhythm、`text-tone-1` 到 `text-tone-5` 和响应式规则。
- 除非用户明确要求，Agent 不启动开发服务器，不打开、自动化、截图或检查浏览器页面；视觉验收由用户手动完成。

## Task Checklist

- [x] 设计用户活跃度静态数据结构和读取 helper。
- [x] 扩展构建期 GitHub 数据脚本，调用 GraphQL contributions API 获取过去一年活动。
- [x] 实现失败保留旧快照 / 优雅降级逻辑。
- [x] 新增简历页 GitHub 活跃度组件，并接入 `/resume`。
- [x] 补充中英文 i18n 文案与数据获取时间格式化。
- [x] 本地构建验证通过；`/resume` HTTP 200 可访问。
- [x] 页面视觉与响应式效果由用户手动检查。
