# Question wall content expansion

Status: COMPLETED on 2026-10-15


## Completed Scope

本版累计新增十条问答链、二十四轮，规范数据从 39 条增至 49 条；新增九个英文标签，原有线程、标签、双语正文与 UI 文案全部保留。完整录入顺序如下（页面倒序展示，链内追问顺序不变）：

| 线程 ID | 原录入 / 本仓库录入日期 | 轮次 |
| --- | --- | --- |
| `training-batch-step-epoch` | 2026-10-04 / 2026-10-12 交接 | 1 |
| `moe-token-routing-memory` | 2026-10-04 / 2026-10-12 交接 | 3 |
| `volcano-enqueue-admission` | 2026-10-04 / 2026-10-12 交接 | 3 |
| `volcano-podgroup-job-task` | 2026-10-04 / 2026-10-12 交接 | 1 |
| `crater-volcano-quota-reservations` | 2026-10-05 / 2026-10-12 交接 | 2 |
| `crater-volcano-starvation-protection` | 2026-10-05 / 2026-10-12 交接 | 2 |
| `cpp-const-reference` | 2026-10-11 | 3 |
| `cpp-const-cast-storage` | 2026-10-11 | 4 |
| `prefill-decode-disaggregation` | 2026-10-15 | 2 |
| `cpp-integer-literal-types` | 2026-10-15（素材 2026-10-13 转交待命） | 3 |

六条遗留问答此前未独立归档或提交，本归档首次统一承接其来源与历史验证。中英文轮次、项目关联及推断说明均已齐全；英文仍为 AI 草稿，后续人工审阅不阻塞本次用户授权的本地版本归档。本版不涉及 UI 或样式调整，无浏览器视觉验证、推送或发布。

归档前核对：`npm run test:questions` 已在最终内容录入后通过 22/22；本次程序对照提交前 HEAD 再次确认原 39 条及双语正文不变、十条新增共二十四轮、九个新增标签和最终排序。归档文档及 ROADMAP 写入后执行 `git diff --check`。

## Goal

根据用户提供的素材，为现有问题墙新增真实的疑问与追问链，补齐中英文内容、标签及适当的项目关联。

## Issue Reference

- 无关联 Issue；来源为用户 2026-10-11 的“新增问题墙问题”请求。
- 状态：已录入六条遗留问答、三条 C++ 问答及一条 PD 分离问答；当前共 49 条线程，本任务累计新增十条、二十四轮。均已通过问题检查与差异检查，全部英文仍为待人工审阅草稿。本版内容录入与验证已完成；用户明确调用 archive-task，归档记录与内容一并纳入本地提交，未推送或发布。
- 初始化分支检查（2026-10-11）：已获取远端引用，`main` 与上游 `origin/main` 均为 `59b9fbc`，ahead/behind 为 `0/0`；本次交接仅合并指定内容，不同步主仓库的其他改动。

## Implementation Details

- 本任务为现有模块的内容增补，沿用当前结构和呈现；条目数量、主题及具体项目关联随用户素材确定。
- 先核对素材与既有问题是否重复；独立主题新增线程，明确的连续追问按语义顺序归入同一线程。涉及既有线程的补充时，保留其 ID 和原有排序。
- 保留作者原始疑惑、误解和追问，仅修正明显错字；错误前提在回答中解释，不将问题改写成已经理解后的结论。回答简短、单段、通俗，保留不确定性；不虚构作者经历或结论，未回答的内容继续保留探索状态。
- 新线程使用稳定且唯一的线程/轮次 ID，追加到 `src/data/questions.json` 的 `threads` 末尾，让独立问题页按录入顺序倒序展示。
- 正文同步维护 `src/content/locales/zh/questions.json` 与 `src/content/locales/en/questions.json` 的同名主题和轮次；英文简洁自然、技术含义及推理顺序与中文一致，按 SPEC 的英文文案要求告知用户并邀请审阅。
- 标签优先复用统一英文标签字典，必要时新增有清晰区分的标签，避免大小写或同义重复。项目关联仅使用已存在的项目/课设 ID，可为空；不因标签相似强行建立关联。
- 如素材需要配图，优先通过 `questionImages` 引用现有项目图片的 `imageKey`，核对尺寸、双语替代文本与亮度标记；图片引用与项目关联分别判断。
- 呈现参考与复用入口：既有 `QuestionList`、`QuestionThreadDialog`、`QuestionWall` 及其数据读取流程。本次通过数据复用已有页面、气泡、标签和项目反查，无需新增组件或样式。
- SPEC 与 RAW_REQUIREMENTS 已覆盖问题墙及问答录入要求，本次无新增全局规则，暂不调整；ROADMAP 保留给完成后的归档记录。
- 本批已确认内容：`cpp-const-reference`，三轮依次讨论 C++ `const vector<int>&` 的编译行为、取地址后类型检查及 `const_cast` 的合法性边界。中文按用户确认版本录入，英文为待人工审阅草稿；新增 `cpp` → C++、`compilers` → Compilers 标签，项目关联为空，无配图。
- 第二条已确认内容：`cpp-const-cast-storage`，四轮讨论值复制与可写访问、强改局部常量的立即数替换与未定义行为、取地址和栈存储、全局常量/字符串的只读存储与写入失败。保留用户确认的详细中文回答并补齐英文草稿，复用 C++ / Compilers 标签，无项目关联或配图；第一条问答链保持原样。
- 第二条的实测依据：ARM64 Mac、Apple Clang 17、`-O0` / `-O2`，已在独立临时实验中检查运行结果及汇编；全局对象自然落入 `__TEXT,__const`，单独编译的写入函数实际执行写入时均触发 `SIGBUS`，实现可见的 `-O2` 版本消除了写入调用。正文明确这些是具体编译的观察，不是语言保证；实验文件未纳入站点源码。
- 2026-10-15 用户确认录入 `prefill-decode-disaggregation`：两轮依次讨论 prefill/decode 共置的资源互补与干扰、DistServe 语境中的延迟达标请求量（goodput）。中文原样采用源会话 `01a1359b-cdfd-7040-9302-033fcdb1b956` 转交的已审阅稿；英文按 SPEC §4.1 起草，待人工审阅。复用 `llm-inference` / LLM Inference、`resource-sharing` / Resource Sharing、`scheduling` / Scheduling，无新增标签或配图，追加在 C++ 两条之后，录入当时独立问题页倒序展示时排在最前。
- PD 分离链关联 `projects:npu-computing-forecast`，保留推断说明：项目涉及任务共置、资源观测及 TTFT、TPOT 预测，与阶段隔离和延迟权衡相关，不表示已实践 PD 分离。录入前用技能目录脚本核对平行仓库标签、相近首问与项目完整文案。素材来源参考为 DistServe（https://arxiv.org/abs/2401.09670）和 Sarathi-Serve（https://arxiv.org/abs/2403.02310）；本次为素材录入，没有重新开展论文审查。
- 2026-10-15 用户确认将此前待命的 C++ 整数字面量三轮问答录入为 `cpp-integer-literal-types`，中文原样采用源会话 `01a11ebb-38e2-71d2-9f47-4f0e735b9ec6` 的已审阅素材：保留 `-(1LL << 31)`，不使用已删去的最小值表达式；第二轮保留无符号取负的模回绕解释，第三轮区分十进制/十六进制字面量的类型候选规则。复用 `cpp` / C++、`compilers` / Compilers，不新增 Integer Literals 标签，无项目关联或配图；英文按 SPEC §4.1 起草，待人工审阅。按实际录入顺序追加在 PD 分离链之后，当前独立问题页倒序展示时排在最前。

### 遗留问答交接（2026-10-12）

- 用户通过「为简历页添加导航」会话明确要求，将主仓库遗留的六条问答交接至当前新增问题任务，并按真实录入时间排在本轮 C++ 两条之前。源会话 ID：`01a11bea-85ba-7dd1-bdc1-ec588dd3e3c4`。
- 来源为主仓库 `AkashiSensei.github.io`，源 HEAD 为 `c4c7c206c60f4880f70a403ed7269efd5d7c7769`；原始完整记录位于该仓库 `.context/archive/20261008_Bilingual-blog-pages.md` 的「前任务交接：补充问答链」。本次读取冻结包 `question-wall-handoff-20261012/bundle.json` 与 `original-task-record.md`，核对三个源 JSON 的 SHA256 均匹配冻结记录。只修改当前并行仓库，未修改交接源文件。
- 六条在 2026-10-04/05 已录入并验证，但此前未独立归档或提交，只保留在博客任务的前任务交接记录中。本任务正式承接这批遗留范围，不能把它们视为已完成独立归档的历史工作。

| 线程 ID | 录入日期 | 轮次 | 项目关联 |
| --- | --- | --- | --- |
| `training-batch-step-epoch` | 2026-10-04 | 1 | `projects:npu-computing-forecast` |
| `moe-token-routing-memory` | 2026-10-04 | 3 | `projects:npu-computing-forecast` |
| `volcano-enqueue-admission` | 2026-10-04 | 3 | `projects:crater` |
| `volcano-podgroup-job-task` | 2026-10-04 | 1 | `projects:crater` |
| `crater-volcano-quota-reservations` | 2026-10-05 | 2 | `projects:crater` |
| `crater-volcano-starvation-protection` | 2026-10-05 | 2 | `projects:crater` |

- 原样合并六条结构与十二轮双语正文，无配图；英文沿用冻结包的待人工审阅稿，本次未重新翻译。补入七个缺失标签：`model-training` / Model Training、`fine-tuning` / Fine-Tuning、`gradient-accumulation` / Gradient Accumulation、`moe` / MoE、`volcano` / Volcano、`admission-control` / Admission Control、`gang-scheduling` / Gang Scheduling。线程、正文和标签均无同 ID 冲突，也没有同显示名的近重复标签。
- 规范 `threads` 顺序固定为：原有 39 条 → `training-batch-step-epoch` → `moe-token-routing-memory` → `volcano-enqueue-admission` → `volcano-podgroup-job-task` → `crater-volcano-quota-reservations` → `crater-volcano-starvation-protection` → `cpp-const-reference` → `cpp-const-cast-storage`。页面现有倒序逻辑不变；后续本轮新增继续排在这六条之后，保持本轮相对顺序。
- 原记录的技术边界继续保留：Volcano 相关讨论限定 v1.13.4；Crater 状态同步/配额预留/超时保护素材基于 PR #514 的 `064f33eb52f04667b36ee39a73641ea57711b957` 静态源码讨论，不表示实现已合入、部署或完成集群实测。本次只核对交接数据与引用，不重新开展技术事实审查。
- 归档要求：用户要求归档本任务时，归档文档与对应 ROADMAP 完成条目必须一并覆盖这六条遗留内容、本轮 C++ 三条及 PD 分离一条（当前共十条、二十四轮），注明原录入日期与交接/后续录入日期，避免遗留范围再次遗漏。本次已按用户明确调用 archive-task 完成整体归档及 ROADMAP 记录，覆盖全部十条二十四轮，并触发 commit-helper 执行本地提交；未推送或发布。

## Test Plan

- 数据/单元检查：录入完成后运行 `npm run test:questions`，验证双语覆盖、轮次、标签、项目/图片引用与既有筛选、排序规则。
- 内容复核：逐条对照原始素材检查问答对应、追问顺序、结论边界、英文术语、行内代码及关联理由；核对新增 ID 唯一且旧 ID 未变。
- 若改动仅限 JSON 内容，优先使用现有检查；仅在修改类型、组件或发现相关问题时扩大类型检查、lint 与构建范围。
- UI/手动检查：默认不启动开发服务器或打开浏览器；用户需要预览时，再检查新条目在问题页、简历墙及关联项目中的显示。不将数据检查结果表述为视觉验证。
- C++ 两条录入时的验证：第二条录入后重新运行 `npm run test:questions`，22/22 通过；`git diff --check` 通过。当时累计新增两条双语问答链（3 + 4 轮）与两个标签，保留全部既有正文和 ID；未进行浏览器视觉检查。
- 遗留批次原验证（2026-10-04/05）：六条各次均通过问题检查 22/22、类型检查、静态构建和差异空白检查；构建曾提示部分 chunk 超过 500 kB。此为转交记录中的历史验证，不表述为本次重新执行，未进行浏览器视觉验证。
- 交接合并核对（2026-10-12）：合并前保存当前数据快照；程序逐项确认原 39 条、两条 C++ 的线程/轮次/中英文正文、既有标签及 UI 文案全部保持原值。最终 47 条线程，本任务新增八条共十九轮，其中遗留六条十二轮；源仓库与冻结包未改动。合并后重新运行 `npm run test:questions`，22/22 通过；`git diff --check` 通过。再次核对第二条已保留用户要求的详细实验回答，包括 `-O0` 下栈存储与立即数替换并存、`-O2` 的存储消除、取地址及只读区写入表现；未进行浏览器视觉检查。

- PD 分离链录入验证（2026-10-15）：`npm run test:questions` 22/22 通过，`git diff --check` 通过；程序确认仅追加一条两轮双语问答，原 47 条线程、既有标签及全部中英文正文保持原值。累计 48 条线程，本任务九条、二十一轮；未启动服务器或进行浏览器视觉检查。
- C++ 整数字面量链录入验证（2026-10-15）：`npm run test:questions` 22/22 通过，`git diff --check` 通过；程序确认仅追加一条三轮双语问答，原 48 条线程、既有标签及全部中英文正文保持原值，累计 49 条线程、本任务十条二十四轮。未启动服务器或进行浏览器视觉检查。

## Focusing Files

- `src/data/questions.json`：线程、轮次、英文标签字典、项目和图片引用。
- `src/content/locales/zh/questions.json`：中文问题、回答与追问。
- `src/content/locales/en/questions.json`：对应英文内容。
- `tests/questions.test.mjs`：现有问题数据与行为检查入口。
- `src/content/README.md`：问题内容维护规范。

## Technical Context

- SPEC §2.2：实体数据独立于 UI，多语言正文按稳定 ID 对应，所有展示入口共享规范记录。
- SPEC §4：英文表达遵循站点文案要求，保留原始技术含义，主动说明 AI 文案处理并邀请审阅。
- SPEC §5「问题墙」：一条线程支持单轮或有序追问；稳定线程/轮次 ID 用于链接；保留真实学习过程及不确定性。
- SPEC §5「问题墙」：标签使用统一英文标识；项目关联只在规范问题数据中维护一次，反向关联自动推导，允许没有关联项目。
- SPEC §5「问题墙」：新问题优先展示，长讨论保留在共用阅读层；现有主题、显示模式和布局由共享组件处理。
- SPEC §8 与仓库预览边界：未明确要求时不启动本地服务、不操作浏览器，以数据检查为主。

## Task Checklist

- [x] 确认最近的 `.context`、阅读规范与里程碑，确认远端同步状态。
- [x] 明确内容增补范围，建立计划；本轮仅修改任务文档。
- [x] 用户确认计划，提供本批问题或原始对话素材。
- [x] 对照既有问题整理新增主题与追问顺序，确认回答表述及结论边界。
- [x] 录入结构数据与中英文正文，复用标签并核对项目/图片关联。
- [x] 执行问题检查与内容复核，向用户汇报新增条目、关联和验证结果。
- [x] 接收六条遗留问答及七个缺失标签，核对冻结包与源文件校验和，按真实录入顺序插入 C++ 问答之前。
- [x] 保留全部既有内容，补齐交接来源、历史验证、技术边界和本任务归档范围。
- [x] 完成遗留内容合并后的检查：47 条线程、八条新增、十九轮，原 39 条之后为遗留六条，再接 C++ 两条；排序与既有内容保持要求。
- [x] 按用户确认录入 PD 分离两轮链，复用三个标签、保留推断关联、补齐英文草稿并通过检查，累计九条新增、二十一轮。
- [x] 按用户确认录入 C++ 整数字面量三轮链，复用 C++ / Compilers、保留已审阅中文、补齐英文草稿并通过检查，累计十条新增、二十四轮。
- [x] 用户明确调用 archive-task 完成本版：保存归档、更新 ROADMAP、重置 ACTIVE_TASK，并将本任务内容与归档纳入本地提交。
