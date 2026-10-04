# ACTIVE_TASK

Status: COMPLETED on 2026-10-04

## Goal

修复简历页小工具区在桌面竖屏／堆叠布局中「查看全部」入口的右对齐，并调整问题墙轮换按钮与说明文字。

## Issue Reference

- 用户于 2026-10-04 提供的小工具区截图；无 GitHub Issue。

## Implementation Details

- 远程检查：已 fetch `origin`；当前 `main` 跟踪 `origin/main`，双方提交差为 `0 / 0`，工作区初始干净。
- 根因：`SmallToolHighlights` 的 `ArchiveSectionHeader` 位于带无条件 `max-w-xl` 的介绍容器中；共享 `.section-heading-row` 的 `justify-between` 只对齐这个受限容器的右侧，而不是整个章节右侧。
- 对照：`CourseProjectHighlights`、`KnowledgeHighlights`、`ProjectHighlights` 和 `WorkbenchHighlights` 的同类标题均占用章节可用宽度，复用 `ArchiveSectionHeader` → `SectionHeader` → `.section-heading-row` / `.section-action`。
- 在小工具标题与列表上下堆叠时，让标题容器占满章节可用宽度；将阅读宽度限制留给说明文字，不让说明文字的限宽约束标题和入口。
- 保留宽屏左右分栏构图，并核对 `xl`（1280px）与竖屏组合下的行为；优先只调整小工具组件的容器约束，必要时才添加限定于该区块的响应式规则。
- 继续复用共享标题、说明、操作链接及留白；保留说明位于副标题下方、tags 上方的顺序。
- 本任务仅修复布局；列表数据、列分配、文案与交互不扩展范围。朴素简历使用独立 `ResumePlainExperience`，静态检查确认不受影响。
- 实施结果：介绍容器使用 `w-full min-w-0`，仅在既有 `xl` 分栏中应用 `max-w-xl`；`SectionNote` 单独保留 `max-w-xl`。共享标题组件及 CSS 无需修改。
- 断点核对：320–767px 保留共享标题自动换行；768–1279px 标题占满堆叠章节宽度；1280px 以上在横屏与竖屏均沿用既有左右分栏，标题填满介绍栏（最大 36rem）。本次不重新定义布局断点。

## Test Plan

- 静态核对 320–767px 手机、768–1279px 桌面堆叠、1280px 以上竖屏／横屏及宽屏的容器宽度与断点。
- 核对中英文长标签的现有换行行为、深浅主题及 full/static/plain 显示路径。
- 实施后运行 `npm run lint` 和 `npm exec -- tsc -b`；运行 `npm exec -- vite build` 验证构建，避免无关的 prebuild 远程统计刷新。
- 不启动开发服务器、不打开浏览器；视觉验收由用户检查，静态检查不等同于视觉实测。
- 验证结果：lint、TypeScript build、Vite 生产构建及 `git diff --check` 均通过；构建提示现有主 bundle 超过 500 kB，未阻断构建。
- 已静态确认 full/static 共用此组件，plain 由独立组件渲染；变更不含主题和语言条件，中英文继续使用共享 `flex-wrap` 标题行。未进行浏览器视觉实测。

## Focusing Files

- `src/components/SmallToolHighlights.tsx`：主要修复点。
- `src/components/SectionHeader.tsx`：共享标题与入口实现，优先直接复用。
- `src/components/CourseProjectHighlights.tsx`：同类全宽标题参考。
- `src/index.css`：共享标题样式与小工具区响应式规则。
- `src/components/ResumePlainExperience.tsx`：朴素模式影响核对。

## Technical Context

- SPEC §3.2.1：复用现有组件、样式角色与设计变量；小工具说明放在副标题之后、tags 之前。
- SPEC §3.4：兼顾手机、桌面竖屏、横屏与宽屏；768px 为窄屏到多栏阈值。
- SPEC §3.6：保持现有文字对比度；不通过调整字号、颜色或主题来掩盖布局问题。
- SPEC §8：未经明确要求不启动本地预览或浏览器；默认使用非交互检查。
- 当前是既有设计约束下的局部修复，无需新增 SPEC 全局规则；用户报告写入 RAW_REQUIREMENTS。

## Task Checklist

- [x] 核对远程最新状态与工作区。
- [x] 对照其它章节标题并定位受限父容器。
- [x] 记录方案、复用入口、范围与验证边界。
- [x] 用户已确认实施。
- [x] 修复堆叠布局的标题容器宽度，核对宽屏及方向断点。
- [x] 检查共享组件调用方与独立朴素模式路径。
- [x] 完成 lint、类型检查与构建，记录结果和视觉验证限制。

## Final Follow-up: 问题墙布局

- 暂停／继续轮换按钮位于轮播墙下方左侧，复用现有按钮、图标和状态交互。
- 普通与朴素简历只保留原副标题，不展示「未必有确定的答案，但有我如何追问、尝试理解的过程」；locale 数据保留供后续使用，独立问题页不变。
- `.question-wall-toolbar` 改为纵向左对齐；两行副标题试调所用的共享组件类型扩展已撤回，`SectionHeader` 无最终差异。
- 最终展示规则已同步到 SPEC；用户原始请求和试调顺序保留在 RAW_REQUIREMENTS。
- [x] 调整轮换按钮位置。
- [x] 按最终要求隐藏第二行副标题。
- [x] 清理试调遗留并完成最终 lint、类型检查与构建。
- [x] 更新 SPEC、归档记录和 ROADMAP，重置 ACTIVE_TASK。

## Verification Limits

- 未启动开发服务器或浏览器，未进行视觉实测。
- 构建仅有现有主 bundle 超过 500 kB 的提示。
