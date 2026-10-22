# ACTIVE_TASK

Status: COMPLETED on 2026-10-22

## Goal

收录 Ceph MON 反复崩溃问题排查与修复的双语博客，沿用现有内容导入和阅读体系。

## Issue Reference

- 用户请求：2026-10-22 使用 `start-task` 开始新任务，新增 Ceph MON 排障博客；最初仅规划；用户随后明确批准收录并要求 SVG 优先，提供知乎链接并确认日期用今天。
- 无站点 Issue。原稿引用 Ceph PR https://github.com/ceph/ceph/pull/70812 ，属于文章背景，不是本仓库待修复问题；原文状态限定为 2026-10-21，本轮未核查其最新状态。

## Implementation Details

- 初始化检查：已成功执行 `git fetch origin`；本地 `main` 与上游 `origin/main` 均为 `74d25c876c62e7023f28a79616f4c7cebc90da3f`，ahead/behind 均为 0；开始时工作区干净。最近上下文根为仓库 `.context/`，上一任务已归档，原 ACTIVE_TASK 仅有标题。
- 原稿来源：逻辑仓库为 `AkashiSensei/blog-article`，本地目录仍名为 `/Users/liuyizhou/develop/blob-article/`。文章子目录 `cloud-and-ai-infra/ceph-mon-election-crash/` 已有 `zh-CN.md`、`en-US.md`、独立封面 `images/0-ceph-mon-cover.png`，以及两组中英文 SVG/PNG 流程图；不导入 `sources/`、材料记录、绘图提示词或未选草稿。
- 稳定文章 ID 使用 `ceph-mon-election-crash`，归入既有 `cloud-and-ai-infra` 分类。沿用原稿双语标题；站点按正文维护对应的双语摘要，标签可从 Ceph、CephFS、Troubleshooting 等主题中选择，不预设项目关联。
- 叙述范围：异常 FSMap 中 rank 状态不一致、`get_info()` / `noexcept` 引发退出、`down true` 与持久化状态造成反复崩溃；保留 `rmfailed` 的历史操作为回忆与源码路径对应的判断，不写成有完整审计证据的事实。区分 MON 管理面恢复、扩容后目录未恢复，以及上游修复防止崩溃的边界，不补写未经验证的恢复命令或结果。
- 已确认元数据：发布日期 `2026-10-22`（用户指定今天），知乎链接 `https://zhuanlan.zhihu.com/p/2096626351285580571`。项目关联暂为空，保留既有三篇简历精选；中文沿用作者原稿，英文 `reviewed: false`。
- 参考对象：最近的既有新增文章 `crater-job-admission-control`，排障类文章 `platform-components-taints-tolerations`。复用 `publish.json`、`scripts/import-blog.mjs`、`BlogCard`、`BlogArticlePage`、共享目录/代码复制/图片画廊/项目摘要，不新增页面组件或样式。
- 已通过 `importArticle` 仅导入新文章，旧八篇快照保持逐项一致。新目录在源仓库未跟踪，`baseCommit: null`；保存正文与选中图片的实际内容哈希，不改源仓库。四张双语图直接保留 SVG 原字节，封面转换 WebP；流程图均标记高亮度，复用共享查看器与深色遮罩。
- 导入器自动优先选择位图旁同名 `.svg`，直接 SVG 引用也保留原格式。尺寸与亮度由 sharp 读取/缩略采样，不将运行时 SVG 转成位图；放宽快照格式校验并新增原字节、去重、哈希更新、路径边界回归测试。逐项扫描原八篇封面和正文图，无同名 SVG 候选，旧图不变。
- 持久 SVG 例外规则及九篇收录范围同步到 SPEC 和内容说明；未修改源内容仓库。用户已确认完成并调用 archive-task；归档实施记录、更新 ROADMAP，并通过 commit-helper 提交本仓库任务范围。

## Test Plan

- 规划：检查上下文 diff 及 Git 状态，确保只改 `.context/` 允许的三份文件；不启动应用。
- 实施：运行 `npm run import:blog` 校验发布快照、`npm run test:blog` 检查双语正文、封面/正文图映射、阅读统计、既有作者补充与精选引用。
- 按实施范围运行 `npm run lint`、`npx tsc -b`、`npx vite build`；直接调用构建工具可避免 `prebuild` 无关的 GitHub 统计更新，记录真实执行结果。
- 检查旧文章、旧图片及作者补充无意外变化；摘要对应原文，英文审阅标记、日期/链接和项目关系有依据。
- 不为纯收录新增镜像实现的测试。遵守预览边界：用户未要求时不启开发服务器、不打开浏览器；普通/静态/朴素、深浅色及移动适配沿用共享组件，无视觉实测需如实说明。代码校验不代表重新验证 Ceph 故障或恢复过程。

## Focusing Files

- `src/content/blog/publish.json`：新文发布映射、双语摘要、分类/标签及确认的元数据。
- `src/content/blog/generated.json`：通过导入器生成新文快照，保留旧文内容。
- `public/assets/blog/ceph-mon-election-crash/`：导入生成的 WebP 封面与四张双语 SVG。
- `scripts/import-blog.mjs`：扩展 SVG 优先导入及快照校验，回归测试见 `tests/blog.test.mjs`。
- `src/content/README.md`：实施后同步收录数量及新文说明。

## Technical Context

- SPEC §2.2：稳定实体 ID，正文数据与 UI 分离，同一实体供列表、详情和关联入口消费。
- SPEC §3：延续共享视觉体系、主题字重、五级对比度、代码块及画廊；本任务无独立 UI 设计需求。
- SPEC §4 与博客约定：双语内容范围对应；AI 翻译不得默认视为人工审阅；不编造缺失元数据。
- SPEC §5 博客：`blog-article` 是正文与图片来源，站点显式选择并导入静态快照；发布日期经确认后参与排序，关联项目按作者明确映射。
- SPEC §8：未获明确要求不启动本地预览或浏览器。持久需求写 SPEC、实施与验证写 ACTIVE_TASK，任务完成后再更新 ROADMAP。

## Task Checklist

- [x] 阅读上下文规则、SPEC、ROADMAP 与现有博客内容规范，确认分支远端同步。
- [x] 定位双语原稿、封面及两组双语配图，确定参考条目、复用路径与叙述边界。
- [x] 将新任务写入 RAW_REQUIREMENTS，更新 SPEC 的待收录范围并重建 ACTIVE_TASK。
- [x] 用户明确批准实施，确认日期与知乎链接；未确认的项目关系留空，英文待审阅。
- [x] 添加显式发布条目和双语摘要，导入新文与 SVG 配图，核对来源指纹及旧文差异。
- [x] 更新内容说明与 SPEC 实际收录状态；九篇快照校验、25 项博客测试、lint、`npx tsc -b`、`npx vite build` 均通过。Vite 提示部分分块超过 500 kB，未阻塞构建。
- [x] 记录实施与验证结果；未启动开发服务器或浏览器，无视觉实测。未重新执行 Ceph 排障操作。
- [x] 用户确认完成并要求归档；任务记录迁移到 archive，ROADMAP 已添加对应里程碑，ACTIVE_TASK 重置为标题。
