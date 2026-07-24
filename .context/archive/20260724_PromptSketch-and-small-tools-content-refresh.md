# ACTIVE_TASK

Status: COMPLETED on 2026-07-24

## Goal

在现有「小工具」模块中新增 PromptSketch，完善其双语介绍与图片展示；同时整理 ToDoDAG 的内容归属、小工具线性顺序，以及可复用于后续内容模块的文案和动态多栏布局规约。

## Issue Reference

- 未提供 GitHub Issue。
- 用户于 2026-07-23 更正最初目标：暂不新增 TypeLift，先新增 PromptSketch。
- PromptSketch 仓库：`https://github.com/AkashiSensei/PromptSketch`。
- PromptSketch 在线版本：`https://akashisensei.github.io/PromptSketch/`。

## Completed Scope

- 在统一的小工具数据源中新增 `prompt-sketch`：
  - 配置公开 GitHub 仓库、author / doing 状态和 featured 顺序。
  - 复用 `/tools`、`/tools/:toolId`、`/resume` Highlight、朴素模式和构建期 GitHub 统计链路。
  - 将用户提供的三张截图转换为 WebP 画廊；为浅色面积较大的图片配置高亮度深色模式处理。
- 完成 PromptSketch 中英文介绍：
  - 中文突出“粘贴—标注—复制”的便利性和 AI 视觉沟通价值。
  - 英文按英文母语读者的阅读习惯重新组织为更短、更自然、以价值为先的表达，并由用户完成文案检查。
- 将长期文案要求写入项目上下文：
  - 英文内容条目采用自然改写而非逐句直译，并要求 Agent 使用该规约时主动告知用户。
  - 内容目录 README 仅说明维护入口，并链接 `.context` 中的项目规格、当前任务和原始需求。
- 将 ToDoDAG 从「项目」迁移到「小工具」：
  - 从项目数据与项目双语文案中移除。
  - 作为 private / draft 小工具加入完整列表，不进入简历页 featured。
  - 为其重写更精炼的中英文摘要和要点。
- 调整完整小工具列表的线性数据顺序：
  1. PromptSketch
  2. 工程上下文元技能
  3. 工程调研技能集
  4. Crater 智能体提示词
  5. AnySearch Skill
  6. LaTeX 简历构建工具
  7. ToDoDAG
- 审核项目中的动态多栏布局，并将高度平衡规则写入 `SPEC.md`：
  - 变高内容按规范数据顺序逐项处理，每一项进入当前累计高度最低的栏目。
  - 禁止奇偶拆分、前后半段拆分、固定轮流分配，以及为了控制几何位置而强制末项进入特定栏目。
  - 明确区分动态瀑布流与具有叙事/语义分组的固定网格。
  - 记录响应式宽度、本地化文案、图片比例、标签、链接和间距等主要高度影响因素。

## Decisions

- PromptSketch 进入四项简历页 featured；LaTeX 简历工具退出 featured，但保留在完整小工具列表。
- 不为单个条目扩张在线体验链接模型；当前卡片继续使用已有公开仓库链接能力。
- ToDoDAG 在规范数据中保持最后一项，但瀑布流不强制它成为几何位置最低的卡片。
- 英文文案允许短于中文并重排表达，只要事实、定位和个人贡献不变。

## Verification

- [x] 运行 `npm run build`，验证 TypeScript、路由、i18n 和静态构建。
- [x] 运行 `npm run lint`。
- [x] 运行 `git diff --check`。
- [x] 确认 PromptSketch 列表页、详情页、简历页 featured 和朴素模式复用同一数据记录。
- [x] 确认 PromptSketch 三张 WebP 图片及亮度元数据正确接入。
- [x] 确认 featured 仍为四项，PromptSketch 进入 featured，LaTeX 简历工具仍保留在完整列表。
- [x] 确认 ToDoDAG 从项目栏目消失，并作为最后一个规范数据条目出现在小工具栏目。
- [x] 在用户明确要求后完成浏览器视觉检查与截图；`/tools` 桌面双栏未发现控制台 warning/error。
- [x] 与用户核对小工具规范顺序、实际分栏和视觉阅读顺序。

## Focusing Files

- `.context/RAW_REQUIREMENTS.md`
- `.context/SPEC.md`
- `src/content/README.md`
- `src/data/tools.ts`
- `src/data/projects.ts`
- `src/content/locales/{zh,en}/tools.json`
- `src/content/locales/{zh,en}/projects.json`
- `src/data/generated/github-repo-stats.json`
- `public/assets/tools/prompt-sketch/`

## Technical Context

- 本项目是静态 React/Vite/TypeScript GitHub Pages 用户站，Vite `base` 保持 `/`。
- 小工具结构数据集中在 `src/data/tools.ts`；中英文实体文案由稳定 id 关联。
- PromptSketch 当前 GitHub 可见性为 public，默认分支为 `main`，未归档、非 fork。
- 公开站点不得暴露 ToDoDAG 私有仓库链接、凭据、私密文本或本机路径。

## Task Checklist

- [x] 新增 PromptSketch 小工具实体、featured 策展和构建期 GitHub 统计。
- [x] 完成经过用户检查的中英文 PromptSketch 文案。
- [x] 转换并接入三张 PromptSketch WebP 截图。
- [x] 将 ToDoDAG 从项目迁移到小工具，并添加 draft 状态与双语文案。
- [x] 调整完整小工具列表的规范线性顺序。
- [x] 将英文内容表达要求写入项目需求与规格。
- [x] 为内容 README 添加通用 `.context` 开发规约入口。
- [x] 将高度平衡的动态多栏布局规则写入项目规格。
- [x] 完成构建、lint、差异和浏览器视觉验证。
