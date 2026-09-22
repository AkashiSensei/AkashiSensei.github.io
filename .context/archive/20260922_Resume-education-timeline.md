# ACTIVE_TASK

Status: COMPLETED on 2026-09-22

## Goal

在 `/resume` 增加一屏本硕教育经历：公开字段为学校、年份、专业、核心荣誉；视觉落在现有简历系统内。

## Issue Reference

无外部 Issue。来自 2026-09-21 用户请求。

## Implementation Details

- 范围只在 `/resume`：视觉模式一屏 + 朴素文档对应区块。不进根首页，不新建 `/education`，不改导航。
- 位置：项目精选之后、GitHub 活跃度之前。横屏整屏分页自动吃到新的 `.resume-rhythm-section`。
- 设计：年份时间轴。桌面横屏为横线连接本科与硕士；手机与竖排为左侧竖线、上下排列。已完成实心点，在读空心点。时间轴按年份正序；朴素文档按倒序，不复刻时间轴和水印。
- 公开字段：学校、年份、学位与专业、学院、核心条目。不放官网、详情卡片或毕设链接。
- 数据：`src/data/education.ts`，稳定 id。文案进 `resume` i18n。
- 北航校徽作为两段经历的半透明背景，左侧探出文字区，两边顶部对齐、高度固定。深色不透明度高于浅色。软件学院与可靠性学院院徽在学院名左侧，固定槽宽对齐。
- 本科：2020 — 2025，软件学院与可靠性与系统工程学院。条目含均分排名、国奖、推免、市级优秀毕业生、降级转专业、助教与学生工作。
- 硕士：2025 — 至今，软件学院。条目含 ACT RAIDS-Lab、云计算｜AI Infra、校级三好生、操作系统开源创新大赛、文体部部长。
- 英文为面向英文读者的改写草稿，待人工审阅。

## Test Plan

- [x] `npx tsc -b` 与 `npm run lint` 在实现过程中通过。
- [x] 用户手工检查并调整横屏时间轴、竖排时间轴、校徽位置与深色不透明度。
- 未做浏览器自动化。

## Focusing Files

- `src/pages/ResumePage.tsx`
- `src/components/ResumePlainExperience.tsx`
- `src/components/EducationHighlights.tsx`
- `src/data/education.ts`
- `src/content/locales/zh/resume.json`
- `src/content/locales/en/resume.json`
- `src/index.css`
- `public/assets/education/buaa-logo.webp`
- `public/assets/education/se-logo.webp`
- `public/assets/education/rse-logo.webp`

## Technical Context

- `/resume` 横屏：`.resume-hero-section` / `.resume-rhythm-section` 为 `100svh`。
- 朴素 `/resume` 走 `ResumePlainExperience`，无整屏概念。
- 内容数据驱动、稳定 id。站点公开安全。
- Agent 默认不做浏览器验证。

## Task Checklist

- [x] 确认年份时间轴，并写入用户提供的年份与核心条目。
- [x] 新增 education 数据结构与中英草稿文案。
- [x] 视觉 `/resume`：项目之后插入教育经历 rhythm section。
- [x] 朴素 `/resume`：同一相对位置插入对应文档区块。
- [x] 接入校徽水印与学院院徽，并按用户调整竖排与深色不透明度。
- [x] 跑 typecheck / lint；不启动浏览器。
- [x] 用户确认这一屏可以收尾。
