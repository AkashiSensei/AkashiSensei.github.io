# ACTIVE_TASK

Status: COMPLETED on 2026-05-21

## Goal
创建「项目」内容模块：包含经确认的 GitHub 项目条目、可复用项目卡片、首页 Highlight，以及独立项目页。

## Issue Reference
暂无 GitHub Issue。用户于 2026-05-20 提出：
- 先通过提权 `gh` 访问用户仓库，定位候选项目仓库。
- 用户会指定部分仓库；项目列表需要先与用户确认。
- 确认后阅读这些仓库，为每个项目生成初版标题、仓库名、描述和小点列表，供用户修改。
- 实现项目卡片；截图可选。如果用户提供截图，需要裁成统一宽高比，并在卡片顶部以 0 margin 展示，图片左右顶到卡片两端，由圆角卡片裁掉图片上方两个角。
- 参考「工作台」软件组卡片和首页区块的方式，把「项目」加入首页，并创建对应专有页面。

## Implementation Details
- 仓库发现与确认：
  - 使用用户批准的提权 `gh` 列出并检查 `AkashiSensei` 相关候选仓库。
  - 合并用户明确指定的仓库后，向用户展示候选项目列表并等待确认。
  - 确认后阅读每个仓库的 README、目录结构、语言/技术栈等信息，生成中文源文案草稿：展示标题、仓库名/副标题、短描述、小点列表。
  - 当前已明确纳入候选的一版项目：`AkashiSensei/npu_computing_forecast`、`raids-lab/crater`、`raids-lab/crater/cli`、本科毕设项目（关联 `AkashiSensei/kernel_analyzer` 与 `AkashiSensei/kernel_data_plotter`）、`AkashiSensei/model-requirements-evaluator-frontend`、`AkashiSensei/ToDoDAG`。
  - `ToDoDAG` 虽然刚起步、尚未正式编码，但作为项目条目保留；展示文案需明确其当前阶段。
- 数据与本地化：
  - 新增项目模块的规范化数据源，每个项目使用稳定 `id`，包含 repo URL、repo name、highlight/order、截图元数据、标签/状态、可选 GitHub stats 占位等字段。
  - 不在 React 页面源码里硬编码项目文案；项目实体文案放入 locale 记录，并以稳定项目 `id` 作为 key。
  - 首页 Highlight 和完整项目页复用同一份项目数据。
- 卡片行为与视觉：
  - 参考工作台卡片方向：毛玻璃卡片、紧凑移动优先布局、描述 + 小点列表，并通过组件 props/page context 控制变体，避免重复实现。
  - 卡片结构：可选截图位于最顶部，卡片内部 0 margin，图片左右顶到卡片边缘，卡片圆角负责裁切图片上方两角。
  - 截图下方依次展示：标题、仓库名/副标题、右上外链箭头、描述、小点列表。
  - 如果没有截图，卡片仍需保持完整、平衡、可读。
- 首页与专页：
  - 在首页新增「项目」Highlight 区块，沿用现有模块模式：标题、简介、移动端横向滑动、精选卡片、「查看全部」入口。
  - 新建 `/projects` 页面，包含返回首页导航和完整项目列表/画廊。
  - 接入当前轻量 pathname router，并补充必要 nav/i18n 文案。
- 收尾调整：
  - 首页模块顺序调整为「方向、项目、工作台、小工具」。
  - 导航菜单保留「项目、工作台、小工具」，移除方向以及尚未落地的占位入口。
  - 项目首页区块最多同屏两张项目卡片，第三张需要横向翻页；「查看完整项目列表」卡片保持类似工作台的窄卡。

## Test Plan
- [x] 运行 `npm run build`，验证 TypeScript 与 Vite 生产构建。
- [x] 运行 `npm run lint`，修复与本任务相关的问题。
- [x] 自动验证 `/projects` 路由可访问性。
- [x] 检查未启动新的本地开发服务。

## Focusing Files
- `src/data/projects.ts`：新增项目规范化元数据。
- `src/content/locales/zh/projects.json` 及同级其它语言文件：项目模块文案与项目实体文案。
- `src/components/ProjectCard.tsx`、`src/components/ProjectHighlights.tsx`：新增可复用项目 UI。
- `src/pages/ProjectsPage.tsx`、`src/pages/HomePage.tsx`：项目专页与首页入口。
- `src/App.tsx`、`src/i18n.ts`、`src/components/Navbar.tsx`：路由、本地化与导航接入。

## Technical Context
- 本站是静态 React + TypeScript + Vite 项目，部署到 GitHub Pages 用户站；Vite `base` 必须保持 `/`。
- 内容实体必须来自结构化数据，并有稳定 `id`；首页 Highlight 和列表/详情页必须引用同一份记录。
- UI chrome 与实体文案分离；实体文案按稳定实体 `id` 编址。
- 设计基调：简约、内容优先、浅/深色主题、轻微多色渐变、毛玻璃表面、Tailwind/shadcn 风格。
- 移动端优先是强约束：需要检查到 320px，无横向溢出、无交互元素裁切。
- v1 范围以展示与导航为主，避免复杂表单或重交互。

## Task Checklist
- [x] 请求提权 `gh` 访问并枚举候选项目仓库。
- [x] 向用户展示候选仓库，并收集确认与补充指定。
- [x] 阅读确认后的仓库，生成初版中文项目文案。
- [x] 等待用户确认或修改项目文案。
- [x] 添加项目规范化数据与项目 locale namespace。
- [x] 实现支持可选顶部截图裁切的复用项目卡片。
- [x] 用共享数据/卡片实现首页项目 Highlight。
- [x] 实现 `/projects` 专页与路由接入。
- [x] 补充或调整导航与本地化模块文案。
- [x] 运行 build/lint，并检查可自动验证的路由可访问性。
