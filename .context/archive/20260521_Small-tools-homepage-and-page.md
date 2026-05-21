# ACTIVE_TASK

Status: COMPLETED on 2026-05-21

## Goal

按照当前「工作台」风格，在首页和专有页面中添加「小工具」内容模块。

## Issue Reference

- 未提供 GitHub Issue。
- 用户于 2026-05-20 提出：创建「小工具」类别；先通过提权 `gh` 访问仓库，定位候选小工具并与用户确认；确认后再生成初版内容并实现卡片与页面。

## Implementation Details

- 流程中保留了明确的内容确认门禁：
  1. 使用提权 `gh` 检查用户 GitHub 仓库，筛选符合「小工具」定位的候选仓库。
  2. 将候选列表展示给用户并等待确认。
  3. 用户确认后，阅读选定仓库，为每个条目生成初版中文内容：标题、仓库名、描述、小点列表。
  4. 实现数据、i18n、可复用卡片、首页 Highlight 和「小工具」专有页面。
- 已确认并加入的小工具条目：
  - `project-context-meta-skill`
  - `research-skills`
  - `anysearch-skill`（展示上游主仓；用户 PR 已合入，用户为 Contributor）
  - `crater-prompt`（已归档；作为 skill 机制出现前指导智能体工作的工具）
  - `latex-resume`（Doing 中的私有工具；无 GitHub 链接）
- 条目资格遵循 SPEC §6：
  - 包含用户作为 GitHub Contributor 参与的仓库，包括对自己 fork 的有意义贡献。
  - 当 fork 是站点条目的规范链接时，优先使用用户自己的 fork URL。
  - 排除仅 star 或仅使用、没有实际贡献的仓库。
- 卡片设计：
  - 复用「工作台」软件组卡片的视觉语言：毛玻璃面板、简洁标题、描述、小点列表。
  - 支持可选截图；截图位于卡片顶部，距离顶部和左右两侧为 0 margin，由卡片圆角裁切上方两个角。
  - 有图卡片拥有更高高度上限，避免截图挤压文字区域。
  - 支持无 GitHub 链接的私有工具，以「私有工具」副标题显示。
  - 文本顺序为：可选截图、状态/角色标签、标题、仓库名或私有工具副标题、描述、小点列表。
- 首页：
  - 添加「小工具」Highlight 区域，使用策展条目。
  - 首页最多显示 3 个小工具卡片，外加 1 个「查看全部」卡片。
- 专有页面：
  - 创建 `/tools` 页面。
  - 以工作台类似的列式瀑布流展示全部小工具；移动端 1 列、平板 2 列、桌面最多 3 列。
  - 按估算高度将不同高度卡片分配到较短列，兼容长描述和未来截图。
- 本地化：
  - 增加独立 `tools` namespace。
  - 中文为主要可编辑文案，英文为同步草稿。

## Test Plan

- [x] 使用项目现有脚本运行 TypeScript/build 校验。
- [x] 使用项目现有脚本运行 lint 校验。
- [x] 检查外部仓库链接打开逻辑和无链接私有工具渲染逻辑。
- [x] 检查截图字段缺省时卡片正常显示。

## Focusing Files

- `src/data/tools.ts`
- `src/components/SmallToolCard.tsx`
- `src/components/SmallToolGrid.tsx`
- `src/components/SmallToolHighlights.tsx`
- `src/pages/ToolsPage.tsx`
- `src/pages/HomePage.tsx`
- `src/App.tsx`

## Technical Context

- 本项目是静态 React/Vite/TypeScript 站点，部署为 GitHub Pages 用户站；Vite `base` 必须保持 `/`。
- 内容模块应由数据驱动，视图中不能硬编码单个条目。
- 首页 Highlight 必须复用列表页同一批记录，通过 flag/order 策展，不能维护一份仅首页使用的重复条目。
- 「工作台」提供了本次复用的设计模式：data + i18n namespace + 首页横滑 Highlight + 专页列式布局 + 可复用卡片。
- 移动端优先很关键；布局必须在 320px 宽度下避免横向溢出和交互元素被截断。

## Task Checklist

- [x] 请求提权 `gh` 访问，并盘点可能的小工具仓库。
- [x] 向用户展示候选仓库并等待确认。
- [x] 阅读确认后的仓库，生成初版条目文案：标题、仓库名、描述、小点列表。
- [x] 添加小工具数据模型和初始数据集，支持 featured 排序。
- [x] 添加 tools i18n namespace 和界面文案。
- [x] 实现支持可选截图的小工具可复用卡片。
- [x] 添加首页「小工具」Highlight 区域和「查看全部」卡片。
- [x] 添加「小工具」专有页面和路由。
- [x] 根据当前导航密度添加/更新导航入口。
- [x] 完整页改为工作台类似的列式瀑布流，最多 3 列。
- [x] 区分有图/无图卡片高度上限。
- [x] 校验构建与 lint。

## Follow-up Notes

- 文本文案、标签、截图资产后续由用户继续调整。
- 尚未做真实浏览器截图级视觉检查；后续重点看首页横滑、`/tools` 瀑布流、320px 宽度和未来截图卡片。
