# ACTIVE_TASK

Status: COMPLETED on 2026-10-28

## Goal

开启新一轮问题墙更新：新增 warp 固定归属、两条 Volcano、四条 Ceph 与长上下文问答链，补充既有寄存器分配链、修订发射槽回答，并维护共享配图。

## Issue Reference

- 无关联 Issue；用户 2026-10-19 调用 start-task，随后明确授权“更新本地，开始任务，然后加入新问题”。
- 基线同步（2026-10-19）：已 fetch 并确认原 main 落后 origin/main 三个提交；用户批准后执行 `git merge --ff-only origin/main`，当时二者均为 `53a5a55`，ahead/behind 为 0/0。开始前工作区干净。
- 基线 53 条线程；上轮四条五轮及阅读交互改动已归档并推送。本轮重新计数，仅接收本轮明确素材，不沿用旧统计。
- 当前状态：本轮新增 warp 一条一轮、Volcano 两条四轮、Ceph 四条六轮、长上下文一条一轮，合计八条十二轮；为 `gpu-register-allocation` 追加两轮，修订 `alu-issue-slots` 回答。总计 61 条线程，双语均已录入；CUDA 共享配图已换 SVG，Ceph 映射链附原 SVG。用户已于 2026-10-28 授权归档并通过 commit-helper 提交这一版；未要求推送。

## Implementation Details

- 当前请求已授权完成文档计划后录入这条问题。只更新任务记录、问题规范数据及中英文正文；不修改 ROADMAP、既有归档、UI 或样式，不自行提交/推送。
- 沿用 extract-question-chains，已读取当前并行仓库的 `warp-scheduler` 链和《并行程序设计 A》完整项目文案。旧链关注发射槽，本条关注 warp 对 SMSP/调度器的归属；独立新增一条单轮链，不覆盖原问答。
- 中文保留移交确认稿，仅这一问，不新增 occupancy、ILP 或其他追问；回答保留“普通执行过程中”的范围，不把结论扩展为抢占、恢复等特殊场景的绝对保证。
- 使用现有 CUDA / GPU Architecture / Instruction Scheduling 三个标签。仅关联 course-projects:parallel-programming-2026，note 明确是对应矩阵乘法 Warp 状态和流水线分析的推断，不表示实验已验证固定归属。
- 使用稳定 ID 追加到 threads 末尾，保持原 53 条内容和顺序。正文与 UI 分离，复用 QuestionList/QuestionThreadDialog 读取流程，不更改组件。
- 英文按 SPEC §4.1 起草，保留事实、正常执行范围与追问语气；交付注明 AI 草稿待人工审阅。答案不含引用，不新增图片。
- 技术依据已核对 NVIDIA Nsight Compute Profiling Guide 的 Hardware Model：warp 分配到 sub partition 后从 launch 驻留至 completion，每周期在自身驻留 warp 池中选择可发射者。参考 https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#metrics-hw-model 。
- 现有 SPEC 已覆盖问题墙内容增补，无新增全局要求或架构约束，不扩写 SPEC/RAW_REQUIREMENTS。
- 用户追加要求：读取“规划科研技术沉淀仓库结构”会话，从寄存器讨论提取补充，并向用户标注已有问答。已读取对应会话的近期及上一页对话，原始二维表疑问与现有前三问重复，保留原文；追加 H100/V100/A100 粒度例子和按 warp 核算的原因两轮。按用户最新修订删除原新增问 6，将两种核算方式数值等价的说明并入答 5，直接使用一个 warp 包含 32 个线程，不保留关于 8 倍的错误想法；答 5 开头直接写“这两种核算方式其实是等价的”，英文同步。
- `gpu-register-allocation` 从三轮扩至五轮，追加 follow-up-three/four，保留既有稳定 ID、前三轮双语正文、配图、标签及两个课设关联。复用 CUDA / GPU Architecture / SASS / Occupancy；已通过技能目录脚本核对现有链及两个课设完整文案。不新增标签、关联、图片或 UI。
- 新增回答限定常规静态寄存器预算，区分 block 入驻时的容量预留、按 warp 的寄存器分配粒度和线程私有值；不由核算公式推断物理二维布局。数值例子核对 NVIDIA Best Practices Guide §11.1.1 及 NVIDIA 工程师关于 256 registers/warp 的说明：https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#calculating-occupancy 、https://forums.developer.nvidia.com/t/what-is-warp-allocation-granulatity-for/365269/5 。站点回答不含引用，交付中说明核对来源。

- 用户确认更新 `alu-issue-slots` 既有单轮链：保留首问，回答区分 ALU 管线活跃与发射机会利用率，明确 V100/A100/H100 每 SM 四个调度器、每调度器每周期最多一条 warp 指令，以及执行与发射无需同步；按用户要求删除草稿从“不过”开始的尾段。同步英文草稿，不改标签、关联、配图或轮次。技术说明已核对 NVIDIA Nsight Compute Hardware Model 与工程师关于 CC 7.0–9.0 single-issue 的说明。

- 用户 2026-10-20 授权录入从“crater 博客”移交的两条确认素材。经对照并按用户判断，试分配事务与插件投票组合分别是独立问题，不并入既有 `volcano-enqueue-admission`；该旧链及其他既有正文保持原样。
- 新增 `volcano-trial-allocation`、`volcano-enqueue-plugin-votes`，各 opening / follow-up-one 两轮，按收到顺序追加到 threads 末尾。中文逐字保留确认稿，不补回删除的候选或追问。新第二条正文仅使用 Volcano Extender 和外部服务，不出现 Crater 名称；两条均按明确素材关联 projects:crater。
- 已运行技能目录脚本核对 Crater 完整项目文案和现有链，复用 Volcano / Scheduling / Gang Scheduling 与 Volcano / Admission Control / Engineering 两组标签，不新建标签或图片。中文确认素材源会话核对版本为 Volcano v1.15.3；记录于任务上下文，不将旧链 v1.13.4 的核对范围改写成新版本。英文按 SPEC §4.1 起草，保留四轮技术含义和实现范围，交付注明 AI 草稿供审阅。

- 用户 2026-10-20 指定用提供的 SVG 替换共享 CUDA 微架构配图。逐字节复制到 `public/assets/questions/nvidia-gpu-memory-hierarchy.svg`，替换 gpu-memory-hierarchy、l1-shared-memory-wavefronts、async-copy-l2-cache 的三处回答配图路径；清理不再引用的 WebP。新旧尺寸均为 3200×2050，保留双语替代文本、high 亮度标记及全部 UI 行为。SVG 为 39,355 字节，XML 可解析且无外部资源引用；源文件路径不写入持久文档。
- 复用 QuestionImageBubble / ProjectImageGallery 的 img 加载与放大，不修改组件或样式。已有图片断言由 WebP 文件头更新为 SVG 命名空间及 viewBox 检查；同时使用本地 SVG 渲染器生成临时预览检查素材，不启动站点或浏览器。

- 用户 2026-10-21 授权录入“查看 Ceph 信息与排查命令”移交的四条六轮确认稿并附图。已独立追加 ceph-storage-mapping（两轮）、cephfs-mds-ranks（单轮）、cephfs-capabilities-locks（两轮）、cephfs-failure-propagation（单轮），不覆盖既有 Ceph 链，不恢复删除的候选。中文保留确认稿；首答不补 S3，故障链保持机制解释，不声称已证实集群整体停服或已修复。
- 已运行目录脚本核对 Crater 完整文案并读取既有 Ceph 问答，使用确认的 Distributed Storage / CephFS / Troubleshooting / Operating Systems 标签组合，全部关联 projects:crater。复用 QuestionThreadDialog / QuestionImageBubble / ProjectImageGallery，在第一条第二答下附原 SVG，复制为站内 public/assets/questions/ceph-storage-mapping.svg，尺寸 1440×2335、亮度 high，配双语替代文本，不改原图或组件样式。英文按 SPEC §4.1 起草，交付注明 AI 草稿待审阅。

- 用户 2026-10-27 授权录入长上下文确认稿，只追加一个问答，不恢复删除的追问。已运行目录脚本并核对相关首问，使用现有 LLM / Attention / Model Training / KV Cache 标签，无关联项目或配图。中文逐字保留确认文案，突出足够长且要求关联远距离信息的训练数据，区分“学会利用”与“运行得起”；英文按 SPEC §4.1 起草。追加稳定 ID llm-long-context-extension，复用既有内容读取与渲染，不改组件。

- 用户 2026-10-28 授权复用博客配图，同图可用于多条链，缺乏直接关联时不强行附图。选取四张中英成对素材用于五条链：Crater 接纳记账时序 → quota-reservations 答 2；跨轮时序 → enqueue-admission 答 3、trial-allocation 答 2（共享资源）；对象关系 → podgroup-job-task 答 1；Extender 边界 → enqueue-plugin-votes 答 1（说明插件与外部服务边界，不作为投票分支图）。不附层级概览、节点部署图，不新造问题或改已确认回答。图按博客 v1.15.3 整理，通过双语替代说明保留版本范围；旧链正文的 v1.13.4 说明保持原文。
- 参考既有 answerImages、QuestionImageBubble、ProjectImageGallery，复用气泡、主题亮度遮罩、预留尺寸和放大交互，无样式变更。将 PNG 无损转换为 question-owned WebP，四组八个文件；跨链复用相同路径。增加独立配图可选 localizedSources.en（src/width/height），共享图片解析函数按当前页面语言选择，缩略图与放大图使用同一解析结果，无变体时保留默认路径。同步 SPEC 和内容约定，补充中英文路径与尺寸切换的必要测试。

- 用户补充 cephfs-mds-ranks 首问开头为“Ceph 的不同 rank 的 MDS 是什么关系？”，英文同步补充 in Ceph；回答与其他内容保持原样。

## Test Plan

- 录入后运行 `npm run test:questions` 和 `git diff --check`，验证双语覆盖、稳定 ID、轮次、标签、项目引用、行内代码与排序。
- 按各次录入前快照比对原内容保留；最终相对 53a5a55 基线只追加确认的八条十二轮、旧寄存器链两轮，以及批准的回答修订和图片说明/引用，不改变原链顺序、标签字典或 UI 文案。
- 纯内容改动不启动应用或重复运行构建；仅在修改类型/组件或遇到相关失败时扩大验证范围。未明确要求时不启动服务器或自动化浏览器检查站点。
- 首条验证（2026-10-19）：`npm run test:questions` 26/26、`git diff --check` 通过；程序确认原 53 条、标签字典、双语实体和界面文案保持原值，只追加一条单轮链。旧 warp-scheduler 的发射槽问题未改动，未新增 occupancy/ILP 追问。无新增图片、标签或 UI 改动；未进行浏览器视觉检查。
- 寄存器补充验证（2026-10-19）：`npm run test:questions` 26/26、`git diff --check` 通过；以本次补充前的 JSON 快照结构化比对，确认仅追加指定两轮双语内容及 rounds ID，原有三轮、其他线程、标签、项目、配图和 UI 文案均保持原值。总线程仍为 54。纯内容更新，未启动站点或进行视觉检查。

- 发射槽回答修订验证（2026-10-19）：`npm run test:questions` 26/26、`git diff --check` 通过；仅更新该链双语回答，未启动站点预览。
- Volcano 两链验证（2026-10-20）：`npm run test:questions` 26/26、`git diff --check` 通过；录入前后 JSON 快照结构化对比确认仅新增两条四轮双语内容，旧链、标签字典、此前本轮改动和其他文案保持原值。总计 56 条线程，未启动站点预览。
- 共享 SVG 替换验证（2026-10-20）：本地 SVG 渲染预览中文和布局完整；`npm run test:questions` 26/26、`git diff --check` 通过。XML 尺寸与三处引用一致性检查通过，旧 WebP 已删除。仅检查独立素材，未进行站点浏览器视觉实测。

- Ceph 四链验证（2026-10-21）：`npm run test:questions` 26/26、`git diff --check` 通过。首轮英文检查发现回答保留中文简称，已改为英文释义后通过复验。JSON 快照对比确认只追加四条六轮和配图元数据，原 56 条、标签、项目关联及界面文案保持原值。站内 SVG 与原文件字节一致、尺寸与 viewBox 一致，本地独立渲染布局完整；未启动站点或进行浏览器视觉实测。

- 长上下文链验证（2026-10-27）：`npm run test:questions` 26/26、`git diff --check` 通过。JSON 快照对比确认仅追加一个单轮双语条目，既有 60 条、标签字典、项目关联和 UI 文案保持原值。总计 61 条线程，未启动站点预览。

- 博客配图复用验证（2026-10-28）：`npm run test:questions` 27/27、`npx tsc -b`、相关三个 TS/TSX 文件 ESLint、`git diff --check` 通过。八张 WebP 与源 PNG 解码后 RGBA 像素逐字节相同；双语所有配图路径、尺寸及说明有效。结构化比对确认五处引用仅使用四组资源，问答正文、61 条顺序、标签、项目和既有配图保持原值。函数测试覆盖 en-US 资源和不同尺寸、默认中文以及无语言变体/项目图片的回退；气泡和放大图传入同一解析结果。沿用既有样式，未启动服务器或进行站点浏览器视觉实测。

## Focusing Files

- src/data/questions.json：规范线程、标签和关联。
- src/content/locales/zh/questions.json：确认的中文问答。
- src/content/locales/en/questions.json：对应英文草稿。
- tests/questions.test.mjs：复用既有内容与行为检查。
- public/assets/questions/：CUDA / Ceph SVG，以及四组复用博客图的中英文 WebP。
- src/data/questions.ts、src/lib/question-images.ts、src/components/QuestionImageBubble.tsx：可选多语言图片来源和共用解析。
- .context/SPEC.md、src/content/README.md：多语言图片与共享资源约定。
- .context/ACTIVE_TASK.md：本轮范围、实施和验证记录。

## Technical Context

- SPEC §2.2、§4.1、§5：规范数据单处维护，双语按稳定 ID 对应，真实学习脉络与可选项目关联。
- 现有问答和新问题的主题相关不构成覆盖授权；关联不把后续学习倒推为课设已验证成果。
- AGENTS 与 context README：延续现有呈现方式，默认仅静态验证；持久文档不写机器私有资源路径。

## Task Checklist

- [x] 刷新远端，讨论落后三个提交，按用户授权快进并确认同步与干净基线。
- [x] 阅读 SPEC/ROADMAP、现有链与课设文案，建立本轮计划；用户已授权录入新问题。
- [x] 新增单轮规范数据、确认中文与英文草稿，复用三个标签和指定推断关联。
- [x] 执行问题检查、差异检查及原有内容保留验证，记录本轮统计。
- [x] 读取指定会话，区分重复疑问与新追问，向既有寄存器链追加两轮双语内容。
- [x] 验证寄存器补充，交付时逐问标注已有与新增。
- [x] 将两条确认的 Volcano 素材独立录入，共两条四轮，复用标签并关联 Crater。
- [x] 验证 Volcano 两链及原内容保留。
- [x] 替换共享 CUDA 配图为原始 SVG 并验证三处引用。
- [x] 独立录入 Ceph 四条六轮并附原 SVG，检查双语覆盖、原内容保留和图片引用。
- [x] 新增长上下文单轮链，复用四标签、无项目关联，验证双语和原内容保留。
- [x] 将四组中英博客配图复用于五条链，接入语言选择并通过内容、类型和 lint 检查。
- [x] 按用户要求结束本轮，完成归档和 ROADMAP，交由 commit-helper 提交；推送不在本次授权范围。

## Final Verification and Handoff

- 最终统计：问题链 53 → 61，问答组 73 → 87；新增八条十二轮，寄存器旧链补充两轮，发射槽旧回答按确认稿修订。标签字典未改，既有稳定 ID、原链顺序和原寄存器前三轮保持原值。
- 配图：CUDA 三处共享图替换为 SVG；Ceph 映射链附原 SVG；四组中英博客图在五条链复用，按当前语言同时选择缩略图/放大图来源和尺寸。全部八张 WebP 与源 PNG 解码像素相同。
- 收尾检查（2026-10-28）：问题测试 27/27、`npx tsc -b`、`npx vite build`、三个受影响 TS/TSX 文件 ESLint、差异空白检查通过。直接运行生产构建，不执行会刷新博客和 GitHub 缓存的 prebuild。构建仍提示超过 500 kB 的 chunk，未将本轮范围扩展为打包优化。
- 已检查 JSON 改动范围、双语引用、图片路径/尺寸和共享关系；未启动开发服务器或进行站点浏览器视觉实测。英文正文与新增图片说明均按站点要求作为 AI 草稿交付，供人工审阅。
- 无关联 Issue；本轮归档并提交，不创建 PR、不推送。
