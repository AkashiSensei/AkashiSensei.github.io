# ACTIVE_TASK

Status: COMPLETED on 2026-09-19

## Goal

为项目模块中的 `personal-homepage` 条目补充 WebP 画廊，并改写简历向要点。

## Issue Reference

- 未提供 GitHub Issue。
- 用户于 2026-09-19 要求为个人主页项目补充图片、修改描述。
- 远程新鲜度：规划时 `main` 与 `origin/main` 同为 `438301d`（`0` ahead / `0` behind）。

## Completed Scope

- 为 `personal-homepage` 接入 14 张 WebP 画廊，复用现有列表、详情、大图预览和朴素详情链路，不进入简历精选。
- 顺序：公开资料卡（首图）→ 门廊概念 → 谷溪概念 → 滚动首页 → 移动端 → 其余尽量深/浅与中/英穿插。
- 过白/过亮图标记 `brightness: "high"`；深色资料卡、滚动首页、移动端、交流页、工作台不加遮罩。
- 中英文短标题经 `altKey` 接入画廊。
- 一人项目不拆「项目简介 / 个人工作」。四条要点全部写入 `projectIntro`，`personalWork` 留空。摘要未改。
- 英文按 native-facing rewrite 起草，不逐句镜像中文。

## Decisions

- 展示组件与内容分离、AI 规格沉淀、穿越机影像工作流，比双入口信息架构更值得写成简历要点。
- 要点主语隐含作者，不让页面或组件当主语；不写默认低动画等实现细节。
- 穿越机条目强调把生成影像用进产品时处理各类问题的经验，并写明影像只负责空间、文案语言主题仍由网站渲染。

## Verification

- [x] 图片均为 WebP，宽高与文件一致，locale key 与 `altKey` 对齐。
- [x] `personal-homepage` 仍不是 `featured`。
- [x] `npm run lint`。
- [x] 用户检查页面效果后确认归档。

## Focusing Files

- `src/data/projects.ts`
- `src/content/locales/zh/projects.json`
- `src/content/locales/en/projects.json`
- `public/assets/projects/personal-homepage/`
- `.context/RAW_REQUIREMENTS.md`

## Technical Context

- 项目实体只有一份规范数据；列表、详情和朴素模式引用同一 `id`。
- 运行时图片使用 WebP；过亮图使用 `brightness: "high"`。
- 中文是内容事实来源；英文是面向英文读者的改写草稿。

## Task Checklist

- [x] 转换并接入用户提供的站点截图与概念图，含随后补充的移动端拼图。
- [x] 写入中英文图片标题与亮度元数据。
- [x] 将要点收成四条，全部写入 `projectIntro`。
- [x] 按 native-facing rewrite 起草英文并请用户审阅。
- [x] 用户完成视觉检查后归档。
