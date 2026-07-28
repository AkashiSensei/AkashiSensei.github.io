# ACTIVE_TASK

Status: COMPLETED on 2026-07-28

## Goal

在现有「小工具」模块中新增 TypeLift，以公开安全、双语的方式呈现这个不中断当前输入流的 macOS 翻译工具。

## Issue Reference

- 未提供 GitHub Issue。
- 用户于 2026-07-27 要求新增 TypeLift 小工具。
- TypeLift 为私有仓库；用户明确要求公开仓库链接，并通过授权 token 在构建期获取 commit 等统计。

## Implementation Details

- 在统一数据源中新增稳定 id `typelift`，标记为 `author`、`doing`，配置私有仓库名称、链接和 `githubRepo`，复用现有构建期 GitHub 统计链路。
- 将 TypeLift 放在完整小工具列表首位，并作为简历页精选首项。继续保持四项精选上限，建议精选顺序为 TypeLift、PromptSketch、工程上下文元技能、工程调研技能集；AnySearch Skill 退出精选但仍保留在完整列表。
- 中文介绍围绕真实核心体验组织：
  - 全局快捷键唤起靠近当前输入位置的悬浮框；
  - 用户用熟悉的源语言输入，TypeLift 自动处理输入源切换与恢复；
  - 翻译 API 侧重响应效率与成本控制，大模型 API 侧重语境理解与表达能力，不强调具体供应商；
  - 两种方案同时可用时通过 Tab 快速切换，并通过 Enter、Space、数字键和 Escape 完成键盘优先的选择与回填；
  - API 密钥进入 Keychain，源文本、提示词和模型响应不持久化或记录。
- 英文介绍遵循项目既有的 native-facing rewrite 规约，以“translate without breaking your typing flow”为价值主线，不逐句镜像中文；交付时明确提示这是 AI 草稿并邀请用户审阅。
- 用户已提供 TypeLift 界面图片；移除原终端悬浮输入截图后最终展示九张，并将原开发协作截图前移为“终端工作流”。其余图片按视觉内容设置叙事顺序，以论文撰写、代码编辑器等使用场景编写双语短标题，软件自身的设置截图明确标注为配置，转换为 WebP、记录真实宽高，并为大面积白底首图配置高亮度处理，不接入应用图标。
- 复用现有 `/tools`、`/tools/:toolId`、`/resume`、朴素显示模式、画廊和详情页链路；为小工具图片补充可选本地化标题键，并在完整预览与朴素详情中显示标题。
- 不修改 TypeLift 仓库；本任务只在个人站点中增加内容、仓库链接和构建期缓存的公开统计。

## Test Plan

- 数据与内容：
  - 校验 `typelift` 在完整列表、精选列表、详情路由和两种显示模式中复用同一实体。
  - 校验精选总数仍为四项，完整列表顺序与精选顺序符合策展决定。
  - 校验中英文 JSON 均有完整的 title、summary 和 points，且无失效 i18n key。
  - 确认 TypeLift 仓库链接在列表、详情、精选和朴素模式中可用，私有仓库 commit 数来自构建期快照。
  - 搜索确认源码、生成数据和客户端产物中没有 GitHub token、本机路径或其它凭据。
- 素材：
  - 确认九张 TypeLift 运行时图片均为 WebP，尺寸元数据与文件一致，且未接入应用图标。
  - 检查图片不包含凭据或机器专属路径，验证中英文标题、无障碍文本、叙事顺序和首图亮度标记。
- 非交互验证：
  - 运行 `npm run build`。
  - 运行 `npm run lint`。
  - 运行 `git diff --check`。
- 手动/UI 验收：
  - 由用户检查 `/tools`、`/tools/typelift` 与 `/resume` 的桌面和移动端观感；除非用户另行明确授权，本任务不启动开发服务器或进行浏览器自动化检查。

## Focusing Files

- `src/data/tools.ts`
- `src/content/locales/zh/tools.json`
- `src/content/locales/en/tools.json`

## Technical Context

- 站点是 React、Vite、TypeScript 的静态 GitHub Pages 用户站，Vite `base` 必须保持 `/`。
- 小工具实体使用一个规范数据集和稳定 id；列表、详情、简历精选与朴素模式必须引用同一记录。
- 私有仓库链接和用户明确同意公开的构建期统计可以展示，但不得泄露仓库内容、访问能力、token、凭据或机器专属路径。
- 新增 UI/content 图片必须使用 WebP；大面积高亮或白底图片需要 `brightness: "high"` 元数据。
- 中文是内容事实来源；英文条目是面向英文读者的自然改写草稿，发布前需要人工检查。
- 默认不得启动开发服务器或使用浏览器验证；构建、lint 和静态检查是本任务的默认验证方式。

## Task Checklist

- [x] 新增 `typelift` 私有小工具实体并完成完整列表与精选顺序调整。
- [x] 编写以输入流体验、双翻译路径、翻译风格和自定义能力为重点的中文文案，并按用户审阅意见完成调整。
- [x] 按 native-facing rewrite 规约编写英文草稿并请求用户审阅。
- [x] 使用用户提供的 TypeLift 图片，不制作额外截图或接入应用图标。
- [x] 确认列表页、详情页、简历精选和朴素模式无需专用组件即可正确呈现。
- [x] 接入 TypeLift 私有仓库链接，并使用本地 GitHub CLI 与 workflow token 链路更新 commit 等统计。
- [x] 验证公开产物包含预期仓库链接与统计，但不包含 token、本机路径或凭据。
- [x] 仿照项目模块为全部小工具仓库增加公开/私有数据标记，并覆盖完整卡片、详情页、简历精选与朴素模式。
- [x] 转换并接入九张 TypeLift WebP 图片，按视觉内容设置叙事顺序、双语短标题、无障碍文本与亮度元数据。
- [x] 完成 build、lint 与差异检查，并将浏览器视觉验收交给用户。
