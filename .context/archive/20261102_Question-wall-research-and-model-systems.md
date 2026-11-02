# ACTIVE_TASK

Status: COMPLETED on 2026-11-02

## Goal

开启新一轮问题墙内容更新，接收新的问题素材，整理并在用户确认后录入。

## Issue Reference

- 无关联 Issue；用户于 2026-10-28 明确调用 start-task，要求开始新的问题墙更新任务并准备接收问题。
- 已执行 `git fetch origin`，检查当前 main 的上游 origin/main：均为 `757d7fe`，ahead/behind 为 0/0；任务开始前工作区干净。
- 上轮已归档、rebase 并推送；本轮基线为 61 条问答链、87 组问答。本轮新增链数与问答组数均从 0 开始，不沿用上轮统计。
- 用户已明确要求直接新增“什么算研究、根因分析与实证研究如何判断完成程度”的两轮确认稿；只处理本次素材，不重新处理已完成的问题。
- 用户于 2026-10-30 授权录入已移交待命的 RL 推理引擎两轮确认稿，复用 Model Training 与 LLM Inference 标签；此前的概念讨论不自动录入。
- 用户于 2026-10-31 授权将 CUDA 命令提交与 CUDA Graph 收益的三轮确认稿作为独立新链录入，复用已确认的四个标签，不恢复移交前删除的轮次。
- 用户于 2026-10-31 授权录入 ZeRO-2 梯度分片与计算通信重叠的单轮确认稿，复用已确认的三个标签，不扩展轮次。
- 用户于 2026-11-02 授权录入 FFN 张量并行两轮及 MLA 中变换 Q 复用的单轮确认稿，均复用已有标签，不增加关联项目或轮次。
- 当前状态：本轮已新增 6 条链、11 组问答，总计 67 条链、98 组问答；新增 Research Methodology 标签。已在 origin/main `93208ef` 基础上完成同步与归档，随本次问题墙内容提交，未推送。

## Implementation Details

- 用户已授权直接录入本次确认稿：更新规范数据、中英文正文与任务记录，不改 UI、ROADMAP，不自行提交或推送。
- 整理素材沿用 extract-question-chains：保留真实疑惑和追问顺序，合并无实质推进的确认，不虚构问题或恢复用户删除的内容。区分独立链、既有链补充和回答修订，保持既有稳定 ID 与顺序。
- 分配标签或项目关联前运行技能实时目录脚本，读取相近链与候选项目完整文案。优先复用现有英文标签；只按明确指定或有具体实践支持的关系关联项目，推断需说明依据。
- 中文以确认稿为准；英文按 SPEC §4.1 起草，同步维护轮次和技术限定，交付注明 AI 草稿供审阅。答案默认单段、无引用，不把讨论中的推测写成已验证成果。
- 配图按具体问答需要复用，保留 SVG 原图或按现有规范导入位图，核对实际尺寸、双语描述和亮度标记。同一图可被多条链引用，不为配图强造问题；有中英文图时使用现有 localizedSources 机制。
- 内容呈现参考 QuestionList / QuestionThreadDialog / QuestionImageBubble / ProjectImageGallery，复用既有气泡、标签、放大与主题样式；本轮没有 UI 改造需求。
- 既有 SPEC 已涵盖问题墙内容维护，本轮未新增全局要求或架构约束，不扩写 SPEC/RAW_REQUIREMENTS。完成里程碑时再按用户调用的归档流程更新 ROADMAP。

- 本次录入：新增独立链 research-definition-and-contribution，opening / follow-up-one 两轮，中文逐字保留移交确认稿。已执行技能实时目录脚本，未发现同主题链；Research Methodology 没有同义标签，因此新增 research-methodology，复用 evaluation / Evaluation。无关联项目或配图，不借缓存例子关联现有 CephFS 缓存链。英文按 SPEC §4.1 起草并保留“有依据的认识、贡献与边界、不强求 baseline 或固定样本量”的含义，交付注明 AI 草稿供审阅。
- 2026-10-30 录入：新增独立链 rl-rollout-inference-engines，opening / follow-up-one 两轮，逐字保留移交的中文确认稿，重点保留“原以为每次权重更新都需要重启并加载整个模型”的认识变化。已运行实时目录脚本并读取 training-batch-step-epoch，主题不同，不合并；复用 model-training / Model Training 与 llm-inference / LLM Inference，无关联项目或配图。同步英文 AI 草稿供人工审阅。
- 2026-10-31 录入：新增独立链 cuda-command-submission-and-graphs，opening / follow-up-one / follow-up-two 三轮，中文逐字保留当前定稿，不恢复已删除轮次，不将移交背景另增为问答。已运行实时目录脚本并阅读 pushbuffer-gpfifo-memory-location，保留原链关注的存储位置主题。新链复用 cuda / CUDA、gpu-architecture / GPU Architecture、graph-execution / Graph Execution、performance-analysis / Performance Analysis，无关联项目或配图。英文按 SPEC §4.1 补齐，保留 API 与设备命令无固定映射、代码复用及 Graph 收益取决于启动开销的限定，作为 AI 草稿供审阅。
- 2026-10-31 录入：新增独立单轮链 zero2-gradient-sharding-overlap，中文逐字保留定稿，先肯定逐步归约与释放梯度空间的节省，再区分梯度分片和计算通信重叠。已核对实时目录，无同主题链；复用 model-training / Model Training、memory-management / Memory Management、parallel-computing / Parallel Computing，无关联项目或配图。英文按 SPEC §4.1 补齐，保留每卡仍计算全模型的本地梯度贡献、顺序执行也可省显存及重叠主要提升效率的区别，作为 AI 草稿供审阅。
- 2026-11-02 录入：追加 ffn-tensor-parallel-communication 两轮和 mla-query-transform-reuse 单轮，中文逐字保留移交定稿。前者复用 parallel-computing / Parallel Computing、model-training / Model Training、model-architecture / Model Architecture，保留非线性激活前需要完整标量和 online softmax 的中间状态类比，不加入用户删除的反驳。后者复用 attention / Attention、kv-cache / KV Cache、llm-inference / LLM Inference，保留当前 Q 的变换跨历史 token 复用的解释及原公式。已执行实时目录脚本，未发现同主题首问，无关联项目或配图。英文按 SPEC §4.1 同步，作为 AI 草稿供审阅。

## Test Plan

- 规划阶段只检查任务文档与 Git 差异，不运行应用或内容测试。
- 录入后按改动范围运行 `npm run test:questions` 和 `git diff --check`，验证双语轮次、稳定 ID、标签、项目与图片引用；结构化对比确认无关内容保持原值。
- 修改组件、类型或共享逻辑时，补充必要的行为测试、类型检查、相关 lint 与构建；纯内容改动不重复扩大检查范围。
- 遵守预览边界：未明确要求时，不启动开发服务器或打开/自动化站点浏览器。仅做静态检查时，不声称已验证站点视觉效果。

- 本次录入验证：`npm run test:questions` 27/27、`git diff --check` 通过；JSON 快照对比确认只新增一个标签和一条两轮双语链，原 61 条、顺序、既有标签、项目与图片引用以及 UI 文案保持原值。纯内容更新，未启动站点预览。
- 2026-10-30 录入验证：`npm run test:questions` 27/27、`git diff --check` 通过；与录入前 JSON 快照比较，仅追加 RL 两轮双语链，原有 62 条链、顺序、所有标签、关联与 UI 文案保持原值。总计 63 条链、91 组问答。未启动站点预览，未提交或推送。
- 2026-10-31 录入验证：`npm run test:questions` 27/27、`git diff --check` 通过；JSON 快照比较确认仅追加三轮双语链，原有 63 条链、顺序、标签字典、关联及 UI 文案保持原值，中文与录入确认稿逐字一致。总计 64 条链、94 组问答。未启动站点预览，未提交或推送。
- 2026-10-31 ZeRO-2 录入验证：`npm run test:questions` 27/27、`git diff --check` 通过；JSON 快照比较确认仅追加单轮双语链，中文与确认稿一致，原有 64 条链、顺序、标签、关联及 UI 文案保持原值。总计 65 条链、95 组问答。未启动站点预览，未提交或推送。
- 2026-11-02 录入验证：`npm run test:questions` 27/27、`git diff --check` 通过；JSON 快照比较确认仅追加 FFN 与 MLA 两条双语链、共三轮，中文与确认稿一致，原有 65 条链、顺序、标签、关联及 UI 文案保持原值。总计 67 条链、98 组问答。未启动站点预览，未提交或推送。

## Focusing Files

- src/data/questions.json：稳定链与轮次、标签、项目关联、配图引用。
- src/content/locales/zh/questions.json：确认中文与图片说明。
- src/content/locales/en/questions.json：英文草稿与图片说明。
- tests/questions.test.mjs：复用内容与图片行为检查。
- .context/ACTIVE_TASK.md：本轮素材范围、实施进度和验证记录。

## Technical Context

- SPEC §4.1、问题墙模块及 src/content/README.md：正文与 UI 分离，双语按稳定 ID 对应，新增链追加到 threads 末尾，索引按新到旧展示，旧链修订不改变顺序。
- questionImages / answerImages 以轮次 ID 引用图片；共享资源不隐含项目关联，localizedSources 提供可选语言版本与对应尺寸。
- 保留现有普通/静态/朴素模式、深浅主题、移动端、键盘与 reduced-motion 行为，不新增一套样式。
- 当前不涉及后端、访问者提问、在线编辑、自动生成回答或发布机制。

## Task Checklist

- [x] 刷新远端，确认 main 与 origin/main 同步、工作区干净。
- [x] 阅读上下文治理、SPEC 与 ROADMAP，建立新一轮任务计划和独立统计基线。
- [x] 接收确认素材，核对既有链及标签；用户明确授权直接录入。
- [x] 录入研究定义与贡献的两轮问答，同步英文，无项目关联或配图。
- [x] 完成问题与差异检查、结构化原内容保留验证，记录本轮一条两轮。
- [x] 录入 RL rollout 与推理引擎权重同步的两轮问答，同步英文并复用既有标签。
- [x] 完成 RL 问答的 27 项内容测试与结构化保留检查，本轮累计两条链、四组问答。
- [x] 录入 CUDA 命令提交与 CUDA Graph 的三轮问答，同步英文并复用四个标签。
- [x] 完成 CUDA Graph 问答的 27 项内容测试及原内容保留检查，本轮累计三条链、七组问答。
- [x] 录入 ZeRO-2 单轮问答，同步英文并复用三个既有标签。
- [x] 完成 ZeRO-2 的 27 项内容测试及原内容保留检查，本轮累计四条链、八组问答。
- [x] 录入 FFN 张量并行两轮与 MLA 中变换 Q 复用的单轮问答，同步英文，复用已有标签。
- [x] 完成 FFN 与 MLA 的 27 项内容测试及原内容保留检查，本轮累计六条链、十一组问答。
- [x] 按用户指示更新到远端 main，归档并提交本轮改动；本次未要求推送。

## Finalization

- 2026-11-02 获取 origin/main，远端新增 `93208ef feat: refresh Crater and NPU project copy`，与问题墙内容无重叠。临时保存本轮四个改动文件后执行 `git rebase origin/main`，无冲突，恢复后逐文件核对内容完全一致。
- rebase 后 `npm run test:questions` 27/27 和 `git diff --check` 通过。结构化对比确认仅新增六条双语链、十一轮及 Research Methodology 标签，原有 61 条链、顺序、标签和双语文案保持不变。
- 更新 ROADMAP，归档为本文件，ACTIVE_TASK 重置为仅标题。英文仍为 AI 草稿供人工审阅，未启动浏览器预览。
