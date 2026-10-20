# ACTIVE_TASK

Status: COMPLETED on 2026-10-20

## Goal

更新 Knowledge Vault 的名称与仓库引用，收录 Crater 基于 Volcano 的作业接纳与调度文章，并替换简历博客精选首篇。

## Issue Reference

- 无关联 Issue；来自 2026-10-20 的新任务请求。

## Implementation Details

- 已获取远端引用，当前 `main` 与 `origin/main` 均为 `53a5a55`，无领先、落后或分叉；初始化前工作区干净。
- 小修改已明确并要求实施：核实 Research Vault 更名为 Knowledge Vault，更新对应展示与仓库引用。新博客按用户指定，从内容仓库新增原稿中定位。
- 已通过 GitHub CLI 核实正式名称 `AkashiSensei/knowledge-vault`、URL `https://github.com/AkashiSensei/knowledge-vault`，仓库仍为公开。更新 `knowledge.ts` 中三项引用、双语标题及类别显示名，并同步统计快照与离线回退配置中的仓库键；保留旧统计值与采集时间，不当作本次新采集结果。
- 复用既有知识卡片与详情页消费入口，保留 `paper-vault` ID、`/knowledge/paper-vault` 地址、图片、精选顺序和内部 `researchVault` 类型；不重建组件或改变样式。
- 新博客：沿用 `blog-article` 内容来源和 `src/content/blog/publish.json` 的显式发布清单，确认稳定 ID、源目录、分类、标签、双语材料及摘要、封面、原始发布日期和可选外链/项目关联；缺少的信息不自行编造。
- 参考与复用：现有博客清单条目、`scripts/import-blog.mjs` 及共享 `BlogCard` / `BlogArticlePage` 管线。正文和源图经导入生成快照与 WebP，不手改生成文件、不维护第二份独立正文。
- 英文内容按已有规范提供自然表达的草稿并告知用户审阅，不把 AI 草稿标为人工审核通过；正文来源、翻译与改写范围以用户后续指令为准。
- 现已按用户指令实施知识库更名并收录 Crater 接纳控制新文。SPEC 同步更名、发布清单与简历精选，归档时更新 ROADMAP，不新增全局设计约束。

- 新文使用稳定 ID `crater-job-admission-control`，归入云计算与 AI 基础设施，关联 `crater`，保留源稿双语正文与标题，站点维护双语摘要；英文沿用源稿草稿，`reviewed: false`。封面与两种语言的时序图共生成 3 张 WebP，时序图自动标记高亮度。
- 复用 `importArticle` 仅生成新文快照；原有七篇与作者补充不变；精选第一篇后按用户指令替换为该新文，其余顺序不变。源稿为内容仓库未跟踪的新目录，`baseCommit: null` 并保存真实内容哈希，不归因于无关 HEAD。未更改内容源仓库。
- 用户已更正新文知乎发布页为 `https://zhuanlan.zhihu.com/p/2095893160073475357`，已补入发布清单并经 `importArticle` 重生成该篇快照；正文、源材料哈希与旧文外链不变。知乎正文与 API 均无法读取，检索无结果；正式发布日期后由用户确认是今天（2026-10-20），已按此补入发布清单并重新生成该篇快照。

- 简历精选替换：将 `src/data/blog.ts` 中第一项改为 `crater-job-admission-control`，普通/静态与朴素模式继续共用 `featuredBlogArticleIds` 和既有卡片，复用双语标题、摘要、配图及发布信息；旧文保留在完整博客列表。

## Test Plan

- 初始化：检查上下文 diff，不启动应用。
- 小修改按范围检查 JSON、双语一致性、引用或必要的 lint/类型检查；简单文案不新增测试。
- 博客收录后运行现有导入及 `npm run test:blog`，检查发布清单与生成快照、双语内容、图片、封面、日期、关联及既有作者补充锚点。
- 按实际改动执行类型检查、构建等必要验证，区分正文历史结论与本轮实测。
- 未明确要求预览时，不启动开发服务器、不打开或自动化浏览器；未视觉实测则如实说明。

## Focusing Files

- `.context/ACTIVE_TASK.md`：需求细化、实施与验证记录。
- `.context/RAW_REQUIREMENTS.md`：本轮原始需求及后续补充。
- `src/content/blog/publish.json`：新博客发布元数据。
- `scripts/import-blog.mjs`：复用现有导入入口，默认不修改脚本。
- `src/content/blog/generated.json` 与 `public/assets/blog/`：由导入生成的正文快照与图片。
- `src/data/knowledge.ts`、双语 `knowledge.json`、仓库统计快照与 `fetch-github-repo-stats.mjs`：Knowledge Vault 更名、链接和缓存映射。

## Technical Context

- SPEC §2.2：内容与 UI 分离，稳定 ID 与单一规范数据来源。
- SPEC §3：延续现有设计体系，兼顾语言、主题、展示模式与视口。
- SPEC §4：英文为待审阅草稿，保留事实与不确定性。
- SPEC §5 博客：仅发布明确选择的文章；正文及源图来自内容仓库，封面独立配置，摘要由站点维护；日期使用真实原始发布日期，不以导入或编辑时间替代。
- SPEC §8：未经明确要求，不启动本地预览或浏览器验证。

## Task Checklist

- [x] 阅读上下文治理、SPEC 相关要求、ROADMAP 与内容维护入口。
- [x] 获取远端状态，确认 `main` 与 `origin/main` 一致。
- [x] 建立「小修改＋新增博客」任务记录。
- [x] 接收具体修改内容与新博客材料，定位文件并细化方案。
- [x] 按用户指令完成 Knowledge Vault 更名与仓库引用更新。
- [x] 小修改验证：新地址与公开状态经 GitHub 核实；名称/链接、双语显示、稳定 ID、缓存迁移及其他内容不变检查通过；`npx tsc -b`、统计脚本语法和 diff 检查通过。未刷新历史统计或启动浏览器。
- [x] 配置并导入新博客及配图，维护双语发布信息；知乎链接已按用户更正补齐，正式日期已按用户确认设为 `2026-10-20`。
- [x] 验证：`npm run import:blog` 校验 8 篇快照通过；`npm run test:blog` 24 项全通过；`npm --ignore-scripts run build`（类型检查及 Vite 生产构建）通过，仅有既有大 chunk 提示。逐项比对原有七篇对象完全不变，新文双语正文与源稿一致（仅替换图片路径），时序图高亮度遮罩标记与 WebP 校验通过；查看了导入图片，未启动应用或进行浏览器视觉实测。
- [x] 按用户更正补齐新文知乎链接，重导入时断言正文及源材料哈希不变；快照校验与 diff 检查通过。
- [x] 新文正式发布日期设为用户确认的 `2026-10-20`；快照校验及排序检查通过，按既有规则显示在博客列表首位。
- [x] 简历博客精选首篇已换为 Crater 接纳控制新文，其余两篇顺序不变；`npm run test:blog` 24 项、`npx tsc -b` 及 diff 检查通过，未启动浏览器预览。
- [x] 用户确认完成；任务归档，ROADMAP 更新，ACTIVE_TASK 重置；按 commit-helper 提交本次工作。
