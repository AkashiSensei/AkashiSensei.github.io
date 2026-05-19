# ACTIVE_TASK

## Goal

在首页增加数据驱动的「方向」展示区块，使用 `public/assets/direction-icons/` 下已有 SVG 作为每条目的视觉标识，并与 SPEC 中「方向 vs 工作台」语义一致。

Status: COMPLETED on 2026-05-20

## Issue Reference

（暂无外部 Issue；与 ROADMAP 中「Personal homepage MVP」下的首页模块策展相关。）

## Implementation Details

### 范围与动机

- **对齐 SPEC §5 / §2.2**：「方向」为主题兴趣与当前投入领域；条目来自**单一结构化数据源**（稳定 `id`），首页区块为策展式展示（可先展示全部 4 条或按 `highlight`/`order` 筛选），**不在 React 里逐条硬编码**。
- **图标**：使用已存在的 `/assets/direction-icons/*.svg`（`ai-infra-512`、`agent-512`、`cloud-computing-512`、`full-stack-engineer-512`）。注意仓库中 `full-stack-engineer-512.svg` 当前可能仍为未跟踪文件，实现阶段需纳入版本控制。
- **文案**：区块标题、副文案、「查看全部」等走 `locales`；每条目的标题/短描述建议采用 **`titleKey` / `summaryKey` 指向 i18n**（与 SPEC「每条目一种模式」一致），避免在 JSON 里堆多语言大段文字。若短期内只维护 zh/en，IT/JA 可先复用英文占位并在 SPEC 已述「发布前人工校对」流程中补齐。
- **交互**：v1 可无独立列表路由；「查看全部」可暂时 `href="#"` 或锚点，并在注释或 TODO 标明待 `/directions`（或等价路径）落地，避免过度承诺。
- **视觉**：延续现有毛玻璃卡片 / 圆角 / 浅色深色可读性；**移动优先**（窄屏无横向溢出、可点区域足够），桌面为增强布局。

### 质疑与取舍（供实现前确认）

1. **是否同步做「方向」列表页**：若只做首页一栏，交付更快且符合「先 MVP」；列表页可后续与路由体系一起做。
2. **四条是否全部上首页**：SPEC 建议每模块 Highlight 约 1～3 条；当前仅 4 条且图标齐全，**全部展示**作为「方向总览」也合理。若希望严格 1～3 条，需在数据里用 `highlight` 标记其余为 false，首页只渲染高亮。
3. **与导航**：`Navbar` 当前无「方向」链接；本任务以首页区块为主，**是否加 nav 项**可作为可选小步，避免一次改太多文件。

## Test Plan

- **手动 / UI**：在 320px 宽度、常见手机宽度与桌面宽度下检查布局无横向滚动、文字不换行灾难、图标比例一致。
- **主题**：浅色 / 深色 / 系统切换下对比度与边框可读。
- **i18n**：中/英切换后区块标题与各卡片标题、摘要均切换且无缺失 key 警告。
- **空数据（回归）**：若将来数据为空数组，首页应**不渲染**该区块（符合 SPEC：无条目则省略 Highlight）。

## Focusing Files

- `src/App.tsx`（挂载首页「方向」区块）
- `src/content/locales/zh.json`、`src/content/locales/en.json`（区块与各条目文案 key）
- 新建：`src/content/directions/` 下单一 JSON（或项目约定的 `src/data/` 路径）作为方向条目数据源
- 新建：`src/components/` 下「方向」展示组件（如 `DirectionsSection.tsx`），保持与 `Button`/Dialog 区块风格一致
- （可选）`src/components/Navbar.tsx` — 仅当确认要在导航中加入「方向」时修改

## Technical Context（摘自 SPEC）

- 每个内容模块保持**一份规范数据集**；条目有稳定 `id`；首页策展用标志或排序，**不维护仅首页用的重复副本**。（SPEC §2.2）
- **方向**：主题兴趣与当前聚焦领域；**不等于工作台**（第三方稳定工具链）。（SPEC §5）
- 首页对**方向**：无条目时可省略 Highlight；有条目后展示。（SPEC §5 Homepage）
- 视图不得硬编码单条条目；结构化数据 + 渲染分离。（SPEC §2.2、§5）
- 移动端优先，禁止窄屏横向溢出与交互元素被裁切。（SPEC §3）

## Task Checklist

- [x] 在 `src/content/`（或团队约定目录）新增方向条目 JSON：`id`、`icon`（公开路径如 `/assets/direction-icons/xxx.svg`）、`titleKey`、`summaryKey`、可选 `highlight`/`order`/`href`。
- [x] 为 4 个方向各写 zh/en 的 i18n 字符串（标题 + 一行摘要）；键名与 JSON 字段一致。
- [x] 实现 `DirectionsSection`（或同名）：读取 JSON、`map` 渲染卡片；图标用 `img` 或按需内联 SVG；卡片样式贴近现有 glass 语言。
- [x] 在 `App.tsx` 简介区块下方插入该 section；数据为空数组时不渲染外层 section。
- [x] 自测 320px + dark/light + 语言切换；修正任何 overflow 或可访问性明显问题（如图标 `alt` 来自标题）。
- [x] 确认 `full-stack-engineer-512.svg` 等资产已纳入 git（若此前未跟踪）。
- [x] 添加新增的创业、金融量化、创意设计等图标及多语言配置。
- [x] 响应式样式调优：移动端毛玻璃水印，电脑端列表视图紧凑排版，planned 状态的灰度。

---

**Task completed and archived.**