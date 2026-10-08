# ACTIVE_TASK

Status: COMPLETED on 2026-10-08

## Goal

更新博客归档仓库与编译器的公开展示信息，并补入一个此前未收录的课设，保持既有内容结构和双语呈现一致。

## Issue Reference

- 无关联 Issue；来源为用户 2026-10-08 的新任务请求。
- 分支检查：已成功执行 `git fetch origin`，`main` 与 `origin/main` 均为 `ca1434037ab2d11365757cb6f82b70a03dca28ab`，ahead/behind 为 0/0。

## Implementation Details

- 编译器修改、新增本科并行程序设计课设和博客仓库更名已获用户逐项授权并实施。
- 博客归档：现有知识沉淀条目 `blob-article`（个人博客文稿存档），2026-10-08 通过 gh 确认仓库已更名为公开的 `AkashiSensei/blog-article`；更新展示名称、外链、GitHub 标识与统计缓存键，以及导入器和七篇现有快照的来源仓库元数据。内部实体 ID、双语键、详情路由和图片路径保持稳定。初次仅更名统计缓存键，收尾时通过 gh GraphQL 定向刷新本次涉及的三个仓库统计；保留其他仓库及用户活跃度原快照。脚本仅迁移文章快照来源字段，不改正文、图片或内容指纹。站内博客仍由独立发布清单与导入管线维护。
- 编译器：现有课设 `compiler`（SysY MIPS 编译器），有双语简介、要点和七张图片。2026-10-08 根据用户要求通过 gh 定位当天新建的公开仓库 `AkashiSensei/BUAA-Compiler-2023`，描述与 Java / SysY / MIPS / 2023 年北航编译课程吻合；已添加共享仓库名称、外链、GitHub 统计标识及公开状态字段，复用现有卡片和详情外链。保留稳定 ID 和已有路由，不预设迁移到项目模块。
- 新增课设：用户确认本科《并行程序设计》课程作业，公开仓库 `AkashiSensei/BUAA-Parallel-Programming-2024`，大三下；README 明确为 2024 年春。沿用 `courseProjectEntries`，稳定 ID 为 `parallel-programming-2024`，状态已完成，标签为「大三下 / 2024春」及 C/C++、MPI、Pthreads、OpenMP、CUDA、Parallel Algorithms；共享排序按学期插入。依据 README 编写双语简介与五条单组 bullet，覆盖 MPI π/MD5、Pthreads 积分/任务队列、OpenMP CYK、CUDA SAXPY/前缀和/重复查找与圆形渲染，明确课程参考代码和 Stanford CS149 框架来源。不添加未核对的图片或性能数字，不将参考示例和近期归档工作计入原创课程成果；现有精选保持不变。
- 文案以用户材料和可核对仓库内容为事实来源，区分项目背景和本人工作，不补写未验证成绩、性能或贡献。英文按 SPEC §4.1 自然改写，并提示用户审阅。
- 编译器文案综合用户提供的简历截图与原站点内容：简介补入独立开发、约 1 万行 Java、LLVM IR、数组/递归/输入输出。用户明确此为个人项目，详情不区分项目简介和个人工作；双语 `points` 使用既有解析器支持的单一数组，整合为五条，覆盖前端、IR、MIPS 后端、基础优化与阶段调试，复用既有「项目与工作」单组渲染。保留原有 SysY 范围、可配置输出、常量传播和强度削弱信息，将「指针常量优化」明确为地址计算优化；不复制简历原句、不增加性能数字。英文采用自然改写并待用户审阅。
- UI 参考：知识归档复用 `KnowledgeCard` / `KnowledgeDetailPage`；编译器和新增课设复用 `ProjectCard` / `CourseProjectsPage` / `ProjectDetailPage`，以及现有普通与朴素图片查看入口。预计仅更新内容，不新增样式或组件。
- 本科并行程序设计图库补充：用户提供五张桌面截图并指定渲染结果正负例作为首图。按「RGB/rand10K 正负例对比 → 圆形渲染分块优化与结果 → 独占前缀和图示 → 相邻重复元素查找图示 → 前缀和与重复查找性能结果」录入；转换为 WebP，保留原图完整内容、比例和尺寸，补齐双语替代文字，白底截图均标记 `brightness: "high"`。图库复用 `ProjectImageGallery` / `PlainImageGallery`，无新增样式或组件；不扩大到报告性能文案更新。
- 已有未提交修改：`src/data/questions.json`、`src/content/locales/zh/questions.json`、`src/content/locales/en/questions.json`；保留其内容。后续用户明确授权筛选本科并行程序设计的问答关联，本轮仅在结构数据中追加对应关联，不改已有问答正文或其它关系。
- 本科并行程序设计问答关联：读取原 SAXPY、scan、圆形渲染 CUDA 实现及课程报告，对照完整问答轮次。实际实践涵盖显存分配/传输、kernel 启动与计时、线程索引、同步、前缀和、共享内存分块筛选、像素顺序与条件分支优化。关联 `simt-branches`（报告讨论分支发散、尝试减少渲染内层分支，源码按场景选择模板 kernel）及 `gpu-memory-hierarchy`（报告专节梳理 global/constant/texture/shared/register/local 存储模型，渲染实际使用 shared memory 缓存相关圆形）。初筛按整链最深追问排除存储链过严；用户追问后复核，关联备注明确本科实践对应开篇，后续 Nsight 延迟分析属于更晚学习。两条关系均作为基础学习背景，不声称完成 SASS/Volta 调度或 Nsight 延迟实验。其它 SASS 特殊寄存器、kernel 参数 ABI、寄存器映射、occupancy、wavefront、Roofline、Tensor Core 等主题无匹配实验深度，不新增关系。保留原 thread/round 顺序、tags 和既有关系，复用详情自动反查。

## Test Plan

- 检查新增 ID 唯一、双语键一致、链接与图片路径有效、图片尺寸及亮度元数据完整；核对已有编译器 ID 与引用仍有效。
- 内容实施后运行 `npm run lint` 和 `npx tsc -b`；涉及新增实体或图片时运行 `npx vite build`，避免无关的 prebuild 导入/远端快照更新。
- 若任务实际触及问答关联或博客发布清单，分别运行 `npm run test:questions` / `npm run test:blog`；否则不扩大测试范围。
- 不启动开发服务器、不打开浏览器；深浅主题、普通/静态/朴素模式、中英文及移动/宽屏视觉效果由用户检查，报告中明确视觉未实测。
- 规划阶段仅修改文档，检查 `.context` 差异和工作区状态，不执行应用测试。
- 2026-10-08 编译器标签修正验证：`npx tsc -b` 与 `git diff --check` 通过；未启动应用或进行浏览器视觉检查。
- 2026-10-08 编译器仓库外链验证：`npx tsc -b`、`npx eslint src/data/course-projects.ts` 与 `git diff --check` 通过；未刷新全站 GitHub 统计快照，未进行浏览器视觉检查。
- 2026-10-08 编译器文案验证：中英文 JSON 解析、编译器简介及 bullet 分组检查、`git diff --check` 通过。仅修改文案，未启动应用或进行浏览器视觉检查。
- 2026-10-08 编译器单组 bullet 调整：确认 `getProjectPointSections` 已支持数组输入，并在详情页按单组展示；双语 JSON 解析与 `git diff --check` 通过，未进行浏览器视觉检查。
- 2026-10-08 本科并行程序设计课设验证：`npm run lint`、`npx tsc -b`、`npx vite build`、双语 JSON 检查与 `git diff --check` 通过；构建有大 chunk 提示。沿用现有动态详情路由、学期排序和无图片卡片路径，未启动开发服务器或浏览器，未刷新无关博客/仓库统计快照。
- 2026-10-08 博客仓库更名验证：七篇快照校验、`npm run test:blog`（24 项）、`npm run lint`、`npx tsc -b` 与 `git diff --check` 全部通过。当前源码、脚本及 SPEC 已无旧 GitHub 仓库名引用；旧 `blob-article` 仅作为稳定内部 ID、图片路径或历史记录保留，未进行浏览器视觉检查。
- 2026-10-08 根据仓库 README 和用户要求，在双语 CUDA 圆形渲染 bullet 中单独注明同样基于 Stanford CS149 Assignment 3 框架；JSON 解析与 `git diff --check` 通过，未进行浏览器视觉检查。
- 2026-10-08 五张课设截图验证：检查原图并复看转换后的首图，确认首图正负例完整保留；五张 WebP 均可解码，尺寸、双语描述键与首图顺序检查通过。`npm run lint`、`npx tsc -b`、`npx vite build` 与 `git diff --check` 通过，构建保留大 chunk 提示；未进行网站浏览器视觉检查。
- 2026-10-08 基础 CUDA 问答关联验证：`npm run test:questions`（22 项）、`npx tsc -b` 与 `git diff --check` 通过；确认仅 `simt-branches` 新增本科并行程序设计关联，未改问答正文或既有关系，未进行浏览器视觉检查。
- 2026-10-08 关联复核补充：新增 `gpu-memory-hierarchy` 的基础开篇关联，备注限定学习阶段；当前共两条。`npm run test:questions`（22 项）、`npx tsc -b` 与 `git diff --check` 再次通过，未改问答正文或既有关系。
- 2026-10-08 收尾检查：补齐编译器 `LLVM IR` 标签；通过 gh GraphQL 定向获取并更新编译器（1 次提交）、本科并行程序设计（3 次提交）和博客归档（12 次提交）的统计，三者当前均为公开、main 分支、0 stars；每条记录保存本次 fetchedAt，其他仓库与用户活跃度不变。核对双语单组 bullet、五图尺寸/说明/首图顺序/构建产物、两条问答关联及七篇博客来源均通过；`npx tsc -b`、修改文件 ESLint 和 `git diff --check` 通过。未发现功能范围遗漏；尚未提交/推送或发布，网站视觉未进行浏览器实测。

## Focusing Files

- `src/data/knowledge.ts`
- `src/content/locales/{zh,en}/knowledge.json`
- `src/data/course-projects.ts`
- `src/content/locales/{zh,en}/course-projects.json`

## Technical Context

- SPEC §2.2：实体单一数据源、稳定 ID、结构数据与展示文案分离；各页面和精选引用同一实体。
- SPEC §3 / §3.5：复用既有设计体系；个人工作强调具体角色、实现、判断与结果；图片运行时使用 WebP，过亮截图标记 `brightness: "high"`。
- SPEC §4.1：英文保持事实与定位，采用自然简洁的改写，告知用户所用文案要求并邀请审阅。
- SPEC §5：课设保持课程作品定位；博客归档继续在知识沉淀列表与详情中提供，站内博客负责文章阅读；精选是明确策展而非自动最新收录。
- SPEC §6 / §8：GitHub 统计沿用静态构建快照，不在浏览器请求 API；默认仅静态检查，浏览器预览需用户明确要求。
- 需求已纳入 RAW_REQUIREMENTS；现有 SPEC 已覆盖这类内容维护，无新增全局规则或架构变更，SPEC 仅纠正当前内容源仓库名称；归档时将本次完成记录加入 ROADMAP。

## Task Checklist

- [x] 阅读上下文与 start-task 要求，确认 main 与 origin/main 同步。
- [x] 定位博客归档、编译器的现有实体与双语维护入口，记录 UI 复用对象。
- [x] 在 RAW_REQUIREMENTS 记录本次范围，重建 ACTIVE_TASK。
- [x] 用户补充三项具体变更与新增课设材料。
- [x] 用户批准编译器学期标签修正：由「大三下 / 2024春」改为「大三上 / 2023秋」，沿用既有英文标签映射。
- [x] 用户授权查找新建编译器仓库并创建外链，已接入公开仓库 `AkashiSensei/BUAA-Compiler-2023`。
- [x] 综合简历截图与原站点信息，更新编译器双语简介，按个人项目整理为一组 bullet。
- [x] 读取指定仓库 README，新增 `parallel-programming-2024` 实体、公开外链、学期标签及双语单组文案。
- [x] 确认博客仓库更名为 `blog-article`，同步外链、统计键、导入来源及当前说明文档，保留内部稳定 ID。
- [x] 对照原 CUDA 实现与报告筛选问题墙，将 `simt-branches` 和 `gpu-memory-hierarchy` 关联到本科并行程序设计，并记录基础实践范围。
- [x] 逐项核对事实并更新规范数据、中文文案与英文草稿。
- [x] 检查现有图片和仓库引用，更名统计缓存键；补入五张本科并行程序设计 WebP 图片及双语说明，渲染正负例为首图。
- [x] 完成相应静态检查，记录验证结果及待用户视觉审阅项。
- [x] 收尾补齐编译器 LLVM IR 标签，以及编译器、本科并行程序设计、博客归档三个仓库的本地统计。

## Completion

- 用户已确认本次调整完成并要求归档。
- 归档仅提交本任务改动；任务开始前已有的问答新增和双语正文继续留在工作区，问答结构仅提交本任务两条关联。
- 样式、组件及交互未修改；网站视觉审阅未委托，未启动浏览器。
