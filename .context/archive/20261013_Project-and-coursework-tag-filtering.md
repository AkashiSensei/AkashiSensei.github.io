# ACTIVE_TASK

Status: COMPLETED on 2026-10-13

用户已确认完成项目与课设 tag 筛选；包含课设时间/技术分组、绑定选择、英文时间 URL、共享标签样式与移动端折叠/重置位置调整。

## Goal

为 `/projects` 与 `/course-projects` 添加延续问题列表交互及站内设计体系的 tag 筛选。

## Issue Reference

- 用户于 2026-10-13 通过 start-task 发起；未提供 Issue。
- 远端核对：已执行 `git fetch origin`，当前 `main` 与上游 `origin/main` 均为 `2ea1bac`，ahead/behind 为 `0/0`；任务开始时工作区干净。
- 状态：用户已确认任务完成并要求归档。代码、34 项筛选/问题测试、lint、类型检查及构建已通过；用户在会话中反馈并确认样式，智能体未执行浏览器视觉实测。

## Implementation Details

- 范围：两个独立列表页；不改简历精选、详情页和实体内容。筛选数据从各自 `Project.tags` 派生，不手写另一份标签表。包含课设年级/学期 tag；生命周期、仓库属性等独立元信息不混入本轮筛选。
- 交互参考 `QuestionsPage.tsx`：默认全部高亮、展示所有条目；首次点击选中单项，随后点击切换多选，以 OR 匹配；空选择或全部选中均归一为默认状态。课设时间/技术分组例外见后续记录。只有存在筛选时才显示“取消选择”（桌面标题区、移动筛选开关右侧），不新增结果统计。
- tag 按当前模块命中条目数量降序排列，同数保持数据首次出现顺序；筛选时不重排候选项。列表保留规范数据顺序，交由既有瀑布流重新平衡列高。
- 使用重复 `tag` URL 查询参数保存稳定筛选身份，刷新、分享、切换语言/主题/展示模式保持筛选；去重并忽略当前模块不存在的值，更新时保留无关参数。两个列表的候选与结果分别取自身数据；课设时间标签的 URL 使用英文别名，内部仍使用规范标签值。
- 英文界面中课设时间 tag 复用 `semesterTags` 翻译；普通技术 tag 保留现有名称；空格转下划线仅用于朴素显示，不修改数据或 URL 身份。
- 选中技术 tag 在列表条目中同步高亮；默认全量状态不高亮条目 tag。普通/静态复用胶囊选中表面、边框及前景 token；课设时间 tag 始终保留原语义配色；朴素模式复用 `DocumentTag.highlighted`。
- 样式参考与复用入口：问题页顶部筛选及标题区 reset；项目/课设原有 `Layout`、`SectionHeader`、`ProjectGrid`、`ProjectCard` 与 `PlainProjectIndexPage`；`tag-styles.ts`、`action-button-styles.ts`、`DocumentTag`、`design-tokens.css` 和共享文档间距。
- 抽取小型共享 tag 筛选控件、纯函数及样式角色，供三个列表使用，避免复制 question 专属 CSS 或引入新的视觉体系；问题页原交互与查询参数行为应保持。仅参数化必要的标签、选中值、回调与显示文案，不扩展为通用搜索框架。
- 筛选状态由列表页管理，传递到普通/朴素列表与 tag 展示；朴素列表扩展标题 action、筛选区及空结果入口，保留既有尺寸测量、图片预览、贡献强调与仓库链接。
- 通用筛选、取消选择、空结果文案放入既有 `src/content/locales/zh/en` 结构；复用适当公共 namespace，模块特有文案保留模块归属。
- 使用原生按钮、fieldset/legend、`aria-pressed` 及共享键盘焦点样式；窄屏自动换行、reset 可堆叠，不引入横向滚动或额外装饰动画。

## Test Plan

- 对筛选纯逻辑做必要的定向验证：默认全量、首次单选、OR 多选、取消末项/全选归一、重复/无效 URL tag、模块候选隔离、规范数据顺序不变。
- 如果抽取问题页逻辑，运行既有 `npm run test:questions`，确保原筛选及相关问答行为不回归。
- 运行 `npm run lint`、TypeScript 检查与 Vite 构建；采用 `npx tsc -b` 和 `npx vite build` 可避免无关 prebuild 内容导入/远端统计刷新。若改动涉及这些管线再补全对应检查。
- 静态检查普通/静态/朴素样式作用域、深浅主题 token、zh/en 标签与文案、320px 起换行和 768px 分栏规则、非筛选调用方默认行为。
- 用户视觉验收：两页在各模式/主题/语言及手机、横屏、竖屏、宽屏下的筛选区留白、reset、命中高亮、瀑布流与图片查看。未经明确要求不启动服务器或操作浏览器；静态检查不代表已完成视觉实测。

## Focusing Files

1. `src/pages/ProjectsPage.tsx`、`src/pages/CourseProjectsPage.tsx`：列表状态、候选、URL 和入口。
2. `src/components/PlainProjectIndexPage.tsx`：朴素标题操作、筛选区、结果与命中 tag。
3. `src/components/ProjectGrid.tsx`、`src/components/ProjectCard.tsx`：普通列表传参和 tag 高亮。
4. `src/pages/QuestionsPage.tsx`、`src/lib/questions.ts`、`src/components/questions.css`：现有参考与共享筛选职责提取。
5. 共享筛选组件/工具/样式（实施时命名）及 `src/content/locales/{zh,en}/`：共用角色与本地化。

## Technical Context

- SPEC §2.2：规范实体与 UI 文案分离，使用稳定身份；§5：列表路由稳定，筛选取既有规范数据。
- SPEC §3.2.1、§3.3、§3.6：复用字体/字号/字重与五级文字对比度；浅色浅蓝、深色深蓝选中表面，普通模式胶囊，朴素模式 hashtag 与文字背景高亮；普通模式链接无下划线。
- SPEC §3.4.1：多列按规范顺序放入当前最短列，筛选/语言/尺寸变化重新分配；768px 以下单列。
- SPEC §3.5：保持现有 bullet 预览上限及个人贡献强调；不因筛选改变内容。
- SPEC §8 与 AGENTS.md：未经明确授权不启动预览或操作浏览器；共享角色变化需检查调用方并维护说明。

## Task Checklist

- [x] 阅读上下文、核对远端与工作区、定位现有参考和复用入口。
- [x] 将缺失需求补入 RAW_REQUIREMENTS / SPEC，重建实施计划。
- [x] 用户批准方案后进入代码实施。
- [x] 提取共享 tag 筛选逻辑/控件/样式，保持问题页现有行为。
- [x] 接入两页 URL 状态、模块候选与 OR 筛选，补全 zh/en 文案。
- [x] 接入普通/朴素筛选区、取消选择和条目命中高亮，保留瀑布流及图片交互。
- [x] 完成定向逻辑验证、问题回归、lint/类型检查/构建与调用方审查。
- [x] 更新实现和验证记录，交付用户视觉验收。

实施与验证记录（2026-10-13）：
- `ProjectIndexPage` 统一两页筛选与标题区布局；`TagFilter` / `tag-filter.css` 提取问题页控件、取消选择与选中样式，普通胶囊与朴素 hashtag 使用同一交互。原问题页参数清理、结果顺序与文案保持。
- `tag-filter.ts` 统一规范化、切换、按条目数排序、OR 筛选及 URL 写入；`questions.ts` 保留原导出名称，转发共享实现。项目条目无更改。
- `ProjectGrid` / `ProjectCard` 只增加可选命中标签参数，其他调用方默认无高亮；`PlainProjectIndexPage` 保留尺寸观察和图库入口，增加筛选、reset 与 `DocumentTag.highlighted`。
- 已静态审查 CSS 层级：筛选为 header 后新节点，需要显式复用文档标题后留白及结果间距，并取消原 `section` 顶部 padding；选中胶囊不混入未选时间标签的主题类，避免深色覆盖。
- `npm run test:tags` 6 项通过，覆盖真实两套数据全部标签、OR 顺序、URL 中文/空格/重复/无效值、候选隔离及中英文时间标签；`npm run test:questions` 22 项通过。
- `npm run lint`、`npx tsc -b`、`npx vite build` 与 `git diff --check` 通过。构建保留大 chunk 提示，未扩展到无关拆包工作；未调用 prebuild 以避免刷新无关内容/统计。
- 未启动服务器、未打开浏览器，未宣称已完成视觉或真实键盘交互实测。

课设筛选分组补充（2026-10-13）：
- 用户要求时间标签置于技术标签上方、保留颜色并绑定选择。参考现有 `ProjectCard` 的前两项时间标签及 `getCourseProjectSemesterTagClassName`；在 `CourseProjectTagFilter` 中将它们按规范数据顺序成对排列，技术组继续按频次排序。
- `course-project-filter.ts` 从课设前两项 tags 派生时间对、其余 tags 派生技术组；点击任一时间标签同时切换整对。组内 OR、组间 AND，各组空选择/全选独立归一为不限制；总取消选择清空两组。
- 旧 URL 单独含年级或学期均可恢复为整对；内部保留成对值，更新 URL 写入英文时间别名并保留无关参数。技术组切换保留时间选择，时间切换保留技术选择。
- `TagFilter` 增加可选分组、配色和自定义切换入口，默认行为保持；时间胶囊跳过蓝色选中表面覆盖，通过原色及透明度区分。卡片时间标签保持原色，朴素时间标签沿用文档高亮；两层筛选布局复用原有文档间距。
- 新增 4 项分组验证，`test:tags` 共 10 项通过，`test:questions` 22 项通过；`npm run lint`、`npx tsc -b`、`npx vite build` 与 `git diff --check` 通过，构建仅保留大 chunk 提示。未执行浏览器预览。
- 分组留白调整：按用户反馈，将 `.tag-filter-stack` 的两组间距从 `.75rem` 增加至 `1.5rem`（12px → 24px），普通/静态与朴素模式共用；不调整组内标签间距。
- URL 英文化：`courseTagSearchParams` 将一对时间标签存为一个英文标识，如 `tag=spring-2026` / `tag=fall-2025` / `tag=summer-2024`；技术 tag 原值保持。读取同时支持英文标识及旧中文年级/学期值，页面显示和筛选结果不变；下一次操作筛选会写出英文 URL。
- URL 定向验证覆盖所有现有学期的英文参数、旧链接兼容、绑定恢复、组间交集/组内并集、全选归一和无关参数保留；`test:tags` 共 12 项与问题回归 22 项通过。
- 列表留白调整：项目和课设普通/静态、朴素容器统一使用 `.project-index-page`，筛选区与结果列表间距改为 `clamp(2rem, 4vw, 3rem)`（32–48px），通过共享选择器控制，不影响问题页或课设两组之间的 24px 间距；取消旧筛选底部 padding，避免叠加。
- 移动筛选折叠：`ProjectIndexPage` 统一维护默认关闭的展开状态；768px 以下显示双语展开/收起按钮，普通/静态复用 `Button` 和 `filledPillActionClassName`，朴素复用 `site-text-link`，搭配同一 ChevronDown 图标。`aria-expanded` / `aria-controls` 关联唯一筛选面板，CSS 隐藏时内容不可聚焦；768px 起始终显示同一面板并隐藏开关，无额外尺寸监听或重复控件。
- 折叠只影响显示，保留 URL 条件、时间绑定、组间 AND / 组内 OR 和标题区取消选择；切换主题/语言/展示模式保持展开状态，跨断点保留手机端展开偏好。外层筛选到列表留白继续 32–48px，课设内部分组间距继续 24px；问题页不受影响。
- 移动折叠验证：`npm run lint`、`npx tsc -b`、`npx vite build`、`git diff --check` 通过；构建保留既有大 chunk 提示。未改筛选纯逻辑，未新增镜像实现的测试；未启动浏览器，手机视觉与真实键盘/触摸交互待用户验收。
- 移动端取消选择位置：按用户反馈，将项目/课设的 reset 复用到展开/收起按钮右侧的同一行，筛选收起时也可用；768px 起仅显示标题区 reset。普通/静态胶囊和朴素文字按钮共用响应式布局，窄屏长英文按钮可内部换行，隐藏的一组不参与键盘导航；不改筛选及展开状态。
- 位置调整验证：lint、类型检查、构建、差异检查通过；未执行浏览器视觉实测。

归档记录：已完成所有任务检查项，路线图记录最终能力，ACTIVE_TASK 重置。沿用已通过的检查结果，归档仅修改任务文档，无需重复运行源码检查。
