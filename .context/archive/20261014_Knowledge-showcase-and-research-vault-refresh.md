# ACTIVE_TASK

Status: COMPLETED on 2026-10-14

## Final Outcome

- 新增算法刷题记录及四张 WebP 图片，简历第三条精选替换为该条目；AI Builders Digest 保留在完整知识沉淀列表与详情。
- Paper Vault 更新为 Research Vault，仓库链接、统计、双语介绍和标签同步，内部 `paper-vault` id 与详情 URL 保持稳定；图库新增并行笔记和推理笔记，分别位于第一、第三位。
- 简历知识沉淀精选为 Crater 工程洞见、Research Vault、算法刷题记录，手机展示完整三条。卡片顶部对齐、随内容确定高度，图片区取首图自然比例，后续图完整显示；移除查看详情按钮，复用共享卡片文字链接，图片和外链独立。
- 简历卡片最多三条 bullet；算法条目的课程作业第四条保留在完整列表和详情，完整列表普通/朴素模式共用条目级上限。
- 简化三条精选的双语介绍；Research Vault 按论文、知识点/技术点、研究报告排列，算法条目体现实现优化实验、VS Code / 命令行调试和两门课代码作业。
- 移除 TypeLift 和 PromptSketch 的 Doing 状态。仅修改个人站点，未改动源研究或刷题仓库。

## Goal

完善知识沉淀：收录算法刷题记录，并将 Paper Vault 更新为覆盖论文与技术知识的 Research Vault。

## Issue Reference

- 无关联 Issue；来源为用户 2026-10-13 的新任务与后续范围确认。
- 目标仓库：https://github.com/AkashiSensei/oj-solutions
- 用户确认：Paper Vault 的调整稍后补充，当前先新增刷题仓库；随后批准实施，并授权使用桌面四张图片。
- 规划前已重新 fetch origin，`main` 与 `origin/main` 同为 `1907737`，ahead/behind 为 `0/0`，工作区原本干净。

## Implementation Details

- 在知识沉淀规范数据中新增稳定 id `oj-solutions`，仓库链接和 `githubRepo` 均对应公开仓库，更新时间回退值为 `2026-10`。沿用构建时 GitHub 统计与最近更新时间，不新增客户端请求。
- 新条目放在完整知识沉淀列表末尾；用户追加要求在简历中替换 AI Builders Digest，因此设置 `featured: true`、`featuredOrder: 3`，AI Builders Digest 退出精选但保留列表与详情。简历精选顺序为 Crater 工程洞见、Research Vault、算法刷题记录。
- 新增 `practice` 类型，中文“算法练习”、英文“Algorithm Practice”；补齐类型图标与普通/静态详情标签映射。颜色复用共享语义 tag 样式，不增加独立视觉体系；若抽取映射，限制在本模块实际重复入口。
- 标签拟为 `Algorithms`、`LeetCode`、`Codeforces`、`C`、`C++`、`Go`；以最新仓库内容为准。用户补充四张截图，已按解法索引（首图）、LeetCode 提交记录、LLDB 命令行调试、LLDB 分屏调试排序；转为原尺寸 WebP，保存在 `public/assets/knowledge/oj-solutions/`，双语说明随数据引用维护。四张均为深色截图，无需高亮度遮罩。
- 中文标题为“算法刷题记录”，英文标题为“Algorithm Practice”。最终中文简介：“个人算法练习记录，包括 LeetCode、Codeforces 等平台题目与课程题解，保留解题思路、实现与优化实验。”
- 四条要点围绕：用 C、C++、Go 练习算法与数据结构；比较自实现数据结构、STL 与不同实现的时间/空间效果；使用 VS Code 与命令行调试器；收录大一下数据结构与大二上算法分析与设计代码作业。简历仅显示前三条。避免静态题量、竞技能力暗示或把单次判题数据写成稳定性能结论。
- 中文为事实来源；英文按 SPEC §4.1 简洁自然地重写，保留事实，实施后明确说明采用该规范并邀请用户审阅。适当更新模块副标题/列表说明以涵盖算法练习。
- 视觉参考与复用：`KnowledgeCard`、`KnowledgeDetailPage` 和 `PlainKnowledgeIndexPage`；继续使用 `GlassPanel`、`FeaturePointList`、`DocumentTag`、共享链接、语义 tag 样式及现有响应式列分配。不重写页面布局或 CSS。
- 用户已补充 Research Vault 扩展需求，实施记录见下；不修改源研究仓库。ROADMAP 留待显式归档，持久要求与原始意图分别同步 SPEC / RAW_REQUIREMENTS。

## Test Plan

- 静态检查规范数据与 zh/en 的 id、类型翻译、标题、简介和要点对应，链接正确；确认精选名单为 Crater 工程洞见、Research Vault、算法刷题记录，算法四张图与 Research Vault 五张图的尺寸及说明一致。
- 执行 lint 和类型检查；执行生产构建，检查新增详情路由继续通过数据驱动入口解析，构建时统计可发现 `githubRepo`。若构建更新无关生成文件，审查并只保留任务相关变更。
- 通过代码检查普通/静态/朴素模式的类型映射及共享路径，覆盖双语与深浅主题入口。遵守预览边界，不启动服务器或打开浏览器；未经视觉实测不得声称已验证响应式效果。
- 本次为内容与小范围映射扩展，不添加仅镜像数据的专用测试。

## Focusing Files

1. `src/data/knowledge.ts`
2. `src/content/locales/zh/knowledge.json`
3. `src/content/locales/en/knowledge.json`
4. `src/components/KnowledgeCard.tsx`
5. `src/pages/KnowledgeDetailPage.tsx`

## Technical Context

- SPEC §2.2：条目维护单份规范数据，列表、详情和精选共用稳定 id，内容与组件分离。
- SPEC §3 与 §5：沿用共享视觉语言；简历最多三条 bullet，完整列表可使用显式条目例外；图库复用现有列表及详情查看能力；兼顾两种主题、双语和各显示模式。
- SPEC §4.1：英文采用自然重写，明确告知采用该规范，等待用户审阅。
- SPEC §5：简历知识沉淀精选为 Crater 工程洞见、Research Vault、算法刷题记录。
- SPEC §6：仓库统计构建时获取，失败降级；浏览器不带凭据、不请求 GitHub API。
- SPEC §8：未获明确要求时禁止本地预览与浏览器验证。

## Task Checklist

- [x] 核对远端新鲜度、现有实现与内容来源，明确仅新增刷题仓库。
- [x] 只在 `.context` 记录需求和实施计划。
- [x] 用户批准计划并补充四张图片，开始实施。
- [x] 新增规范条目与算法练习类型，补齐现有组件的映射，使用共享 cyan tag 样式与 CodeXml 图标。
- [x] 编写双语标题、简介、三条要点与必要模块说明，按最新要求更新精选名单；接入四张 WebP 图片与双语说明。
- [x] 检查数据引用、执行 lint / 类型检查 / 构建，审查生成文件与最终 diff。
- [x] 记录实施与验证结果，交付时说明未进行视觉实测并邀请审阅英文草稿。


初期验证结果（后续调整见下）：
- `npm run lint` 通过。
- `npm run build --ignore-scripts` 通过（包含 `tsc -b` 和 Vite 生产构建）；仅有既有大 chunk 警告。未运行批量刷新所有仓库统计的 prebuild，以避免无关快照改动；另行执行 `npm run import:blog`，现有 7 篇博客快照校验通过。
- 定向静态检查通过：双语条目/类型/三条要点/四张图片说明齐全，WebP 格式和原始尺寸对应，精选共用同一规范数据，Paper Vault 双语内容保持一致，统计收集规则可识别新仓库。
- 通过 GitHub CLI GraphQL 读取目标仓库实时数据，仅向生成快照追加该仓库（23 commits、0 stars、公开、main）。
- 四张图片约 1.62 MiB，总体保留原尺寸以便查看调试文本；已检查转换后的首图。未进行站点浏览器视觉实测。

2026-10-13 追加实施：按用户要求以算法刷题记录替换简历知识沉淀中的 AI Builders Digest，复用 `KnowledgeHighlights` / `ResumePlainExperience` 对 `featuredKnowledgeEntries` 的既有引用，同步 SPEC 精选要求。

2026-10-13 追加卡片呈现调整：参考 `BlogCard` / `BlogHighlights`，`KnowledgeCard` 复用 `site-card-link-surface` / `site-card-link` / `site-text-link`，移除查看详情与撑高用 flex-1，图片与外链以 z-10 保留独立操作；`KnowledgeHighlights` 移除各断点 min-height、h-full 和手机两条上限，使用 items-start；朴素简历 knowledge 列表同样 items-start。共享组件同时覆盖知识沉淀完整列表，无新增 CSS。验证：`npm run lint`、`npm run build --ignore-scripts`（含类型检查）与 `git diff --check` 均通过；生产构建只有既有大 chunk 警告。已静态核对图片/外链层级与共享焦点样式；未启动浏览器，未做视觉实测。

2026-10-13 图片标题精简：按用户要求将刷题图库标题缩短为「解法索引」「提交记录」「单步调试」「分屏调试」，英文同步为简短词组；图片与顺序不变。双语 JSON 解析与 diff 空白检查通过，纯文案不启动应用。

2026-10-14 小工具状态清理：从 `src/data/tools.ts` 中移除 TypeLift 与 PromptSketch 的 `status: "doing"`，由已有可选状态渲染逻辑自然隐藏，普通/静态/朴素及中英文共用规范数据。保留 Owner、仓库可见性、介绍及其它工具状态。纯元数据调整；已核对仅删除这两个状态字段，`npx tsc -b` 与 `git diff --check` 通过，未启动应用。


2026-10-14 Research Vault 更新：
- 事实来源：GitHub 已更名为 `research-vault`，main 的 README 仍是旧论文库说明；本地当前工作分支已整理为仓库根目录 + `paper-vault/` + `knowledge/`，README 与 inference 笔记尚有未提交修改，parallelism 笔记尚未跟踪。只读这些内容，不修改或提交源仓库。
- 已阅读本地 README、推理知识笔记和并行/状态分片笔记。用户随后确认直接并列论文、知识点与领域研究报告等内容类别，去掉计划措辞。
- 更新规范条目的公开仓库 URL / repoName / githubRepo、Research Vault 标题、researchVault 类型与双语“研究知识库”标签、介绍和三条要点；标签体现 Knowledge Notes / Paper Notes / AI Infrastructure / LLM。保留稳定 id `paper-vault`、现有详情链接和精选第二位。
- 沿用 `KnowledgeCard`、`KnowledgeDetailPage`、朴素模式共享数据与既有绿色类型标签，无布局或样式变动。现有三张图片仍为论文模块配图，缩短为论文导读 / 导读工作流 / 文献索引，不伪造新知识模块截图。
- GitHub CLI 核实 main 默认分支 16 commits、0 stars、公开；同步生成快照及统计脚本离线回退仓库名和数据，不批量更新无关仓库。
- 英文按 SPEC §4.1 自然重写并邀请审阅。验证通过：`npm run lint`、`npm run build --ignore-scripts`（含类型检查）、`git diff --check`，以及仓库链接/双语类型/稳定 id/精选位置/图片路径/统计快照的定向检查。构建只有既有大 chunk 警告；未启动应用或浏览器，未做视觉实测。

2026-10-14 Research Vault 文案修订：按用户最新要求，简介直接概括论文笔记、技术知识点与领域研究报告，第三条要点描述面向具体问题的专题分析，去掉中英文计划措辞并同步 SPEC。英文沿用既定自然重写规范；双语 JSON 解析与 `git diff --check` 通过，纯文案未启动应用。

2026-10-14 Research Vault 图库补充：读取并检查用户提供的两张截图，转为原尺寸 2558×1752 WebP，新增 `parallelism.webp` / `inference.webp`。图库顺序为并行笔记 → 论文导读 → 推理笔记 → 导读工作流 → 文献索引，中英文短标题同步。因白色图示面积较大，两张均设置 `brightness: "high"`，沿用现有查看器与主题遮罩；仅新增站点配图，不修改源研究仓库。验证通过：`npx tsc -b`、`git diff --check`，以及五张图片顺序、新增 WebP 尺寸、双语说明与亮度元数据核对；未启动浏览器，未做视觉实测。

2026-10-14 知识沉淀图片比例与文案精简：参考 `BlogCard` 的 `cardAspectRatioMode="natural"`，简历 compact 知识卡片使用首图自然比例，移除桌面/手机固定比例与媒体查询状态，后续轮播用 contain 完整显示。复用 ProjectImageGallery 自然模式取消内联高度上限；完整列表保留原 bounded 行为。精简 Crater 工程洞见、Research Vault、算法刷题记录的双语简介和各三条要点，保留具体主题、技术名词、工作流和调试方式；规范内容同步用于详情与朴素模式，不另维护简历副本。英文按既定自然重写规范，交付时邀请审阅。验证通过：`npm run lint`、`npm run build --ignore-scripts`（含类型检查）、`git diff --check` 和双语三条要点结构核对；已静态确认首图自然比例路径不设置 maxHeight，构建只有既有大 chunk 警告。未启动浏览器或做视觉实测。

2026-10-14 Research Vault 要点定稿：按论文 → 技术点与知识点 → 研究报告排列三条要点，移除具体技术清单；第二条概括对应论文关联与 Obsidian 内部链接，第三条保留研究报告说明。中文与英文同步，双语 JSON 解析和 `git diff --check` 通过，纯文案不启动应用。

2026-10-14 算法刷题要点修订：第二条概括通过后的解法探索、算法优化及耗时/内存实验比较，第三条单独呈现 VS Code 与命令行调试能力，以断点、单步、变量和调用栈说明具体使用。中英文同步，第一条和简介保留。英文沿用自然重写规范，交付展示中文措辞并供审阅；双语 JSON 解析与 `git diff --check` 通过，纯文案未启动应用。

2026-10-14 算法实验要点修订：第二条改为通过后的算法及实现优化，对比自实现数据结构、STL 与不同实现方式，实测耗时、内存和以空间换时间的效果；英文同步强调检验额外空间是否提高速度，不预设优化必然有效。其余内容保留。双语 JSON 解析与 `git diff --check` 通过。

2026-10-14 精简两条概述：Research Vault 直接概括领域与论文/技术知识点/研究报告；算法练习概括题目、解题思路、实现和优化实验，LC/CF 作为平台举例。中英文同步，要点保持不变；双语 JSON 解析和 `git diff --check` 通过，纯文案不启动应用。

2026-10-14 算法概述补充课程题解：按用户说明，将课程题解纳入双语概述；未新增独立条目或虚构课程名称。双语 JSON 解析与 `git diff --check` 通过，纯文案不启动应用。

2026-10-14 算法条目第四条：新增两门课代码作业说明（大一下数据结构、大二上算法分析与设计），双语同步，不向公开文案加入 Java 或未找到题目的排除说明。原有三条预览上限会隐藏末条，故为该规范记录设置 `listingPointLimit: 4`；共享截取工具增加可选非分节上限，默认三条与项目分节各两条不变，知识卡片、完整列表高度估算及朴素索引复用同一配置。详情仍展示全部，朴素简历保持原来的简介呈现。验证通过：lint、生产构建（含类型检查）、diff 空白检查；定向核对两种语言第四条可见、其他条目默认三条、项目分节各两条与个人贡献索引保持不变。同步 SPEC 与内容维护说明；构建只有既有大 chunk 警告，未启动浏览器。

2026-10-14 简历知识沉淀预览上限：按用户最新要求，`KnowledgeCard` 的 compact 变体使用共享默认三条上限，不读取 `listingPointLimit`；full 变体继续允许完整列表四条，详情与朴素索引保留课程作业说明。同步 SPEC 和内容维护说明。类型检查与 `git diff --check` 通过；静态核对 compact 变体始终使用三条默认上限，full 变体继续读取列表配置。未启动应用。


## Final Verification

- [x] `npm run lint` 通过。
- [x] `npm run build --ignore-scripts` 通过，包含 `tsc -b` 与 Vite 生产构建；仅有既有大 chunk 警告。
- [x] 定向静态核对通过：精选顺序、双语记录与类型、图片说明与 WebP 尺寸、简历三条/列表四条边界，以及项目分节上限与个人贡献索引。
- [x] `git diff --check` 通过；未批量刷新无关仓库快照，统计变更仅涉及两个目标仓库。
- [x] 归档完成并更新 ROADMAP，ACTIVE_TASK 重置为标题。
- 未启动开发服务器或浏览器，未进行视觉实测；英文按既定规范自然重写，已在对话中说明并供用户审阅。
