# Question wall content and reading polish

Status: COMPLETED on 2026-10-16

## Goal

完成本轮问题墙内容增补、回答配图、折叠标记和退出交互调整，归档并按用户授权提交本地更新。本次未推送或创建 PR。

## Scope and Result

- 任务由用户 2026-10-15 调用 start-task 开启，2026-10-16 调用 archive-task 收尾并要求提交。开始时本地 main 与 origin/main 均为 `38f702b`，工作区干净；本轮提交范围审计时暂存区为空，全部改动属于该任务。
- 新增 4 条双语问答链、5 轮，线程总数 49 → 53。原 49 条正文、标签及项目关联均保留，只为已有 `gpu-memory-hierarchy` 的第一条回答补充概念图；新线程追加到规范数据末尾，索引继续倒序展示。
- `l1-shared-memory-wavefronts`：单轮比较 L1TEX 与 shared memory 的 wavefront、sector 与 bank，保留四条 line 分别访问 sector 0/1/2/3 的例子。使用 CUDA / GPU Architecture / Shared Memory / Nsight Compute。
- `scoreboard-read-write-barriers`：两轮讨论 NCU 的 Long/Short Scoreboard 与 Read/Write Barrier 的对应关系及指令依赖管理层次，保留内部实现的不确定性。使用 CUDA / GPU Architecture / Instruction Scheduling / SASS / Nsight Compute。
- 前两条按用户要求关联《并行程序设计 A》与《虚拟现实综合实验》，依据 CUDA 矩阵乘、AoS/sector、SASS 与 Warp 状态分析维护推断说明；不关联光线追踪渲染器。
- `async-copy-l2-cache`：单轮区分 Ampere 经典 cp.async 仅支持 global → shared、Hopper TMA 支持双向，以及绕过寄存器仍使用 L2、L2 命中不必实际读取 HBM。使用 CUDA / GPU Architecture / Memory Management / Shared Memory，无项目关联。
- `pushbuffer-gpfifo-memory-location`：单轮说明访问要求相近不等于物理存储相同，通过地址和长度关联；保留 UVM 的 `gpfifo_loc` / `pushbuffer_loc` 及 GPFIFO 显存、Push Buffer 系统内存的例子。按用户要求删除 PCIe/BAR、虚拟地址与 Unified Memory 结尾。使用 CUDA / GPU Architecture / Memory Management，无项目关联或配图。
- 全部标签复用既有字典；中文采用用户确认稿且回答不含引用，英文保留含义、代码标识及边界，为已告知用户、待人工审阅的 AI 草稿。GPFIFO 配置依据已核对 NVIDIA 公开 UVM 源码。

## Implementation

- 复用现有 QuestionList、QuestionWall、QuestionThreadDialog、问答气泡及共享主题变量；设计与内容规范同步更新 SPEC 和 src/content/README.md。
- 用户提供的 GPU 概念 PNG 无损转换为 `public/assets/questions/nvidia-gpu-memory-hierarchy.webp`，最终 3200 × 2050、331842 字节。配图标记为 `brightness: high`，双语替代说明注明英文界面下图内仍为中文。
- 新增按轮次配置的 `answerImages`，与 `questionImages` 一同支持项目图库引用或独立资源元数据。问题图保持左侧、问题后回答前；回答补图位于右侧回答之后，复用 ProjectImageGallery 的点击/键盘放大、焦点返回、Escape、自然比例与亮度遮罩。
- 同一 WebP 复用于 async-copy、wavefront 及已有 gpu-memory-hierarchy 三条链的首轮回答，不重复复制资产；存储层级链原有 NCU 问题图保留。概念图作为架构/术语概览，wavefront 的具体 line/sector 示例仍由正文解释。
- 折叠入口统一显示右上数字圈（大于一轮才显示）与右下图片圈（整条链任意轮次的问题/回答有图即显示）。数字圈 32px、图片圈 36px，采用消息回应压在圆角上的效果；图片圈中心比数字圈额外向左/向上内收 2px，图片图标 20px，复用标签外阴影、共享字号、表面与边框。
- 普通气泡预留必要右侧空间，双标记入口最小高度避免重叠；朴素模式保留对应标记与文字留白。动态墙隐藏测量样本与实际气泡共用样式，stage 四周和 clip margin 预留 1.25rem，测量扣除 stage padding，避免外沿裁切。
- 问答退出采用单条 200ms、可见条目之间 35ms 的错峰；入场 500ms / 70ms 和其他弹窗参数保持原值。文字、问题图、回答图及项目摘要共享上移距离，保证高图片不会追上前面的文字；屏幕外条目不占等待槽，也不扫回视口。
- 关闭开始即卸载 Radix 弹窗，释放滚动锁与输入拦截；layout cleanup 仅保留原生 DOM 退出副本，设置 inert、aria-hidden、移除 ID 并禁用全部指针事件，冻结宽高、保存 scrollTop 和当前动画状态。完成/超时清理，重开时移除旧副本；reduced-motion 直接关闭，原焦点返回逻辑保留并避免旧回调抢焦点。

## Validation and Limits

- 问题检查 26/26 通过：双语覆盖、标识符、标签/项目/图片引用、图片尺寸与替代说明、排序、可见错峰、高图片同位移、打断动画、屏幕外隐藏、退出副本隔离/清理和 reduced-motion。
- 类型检查、相关 TS/TSX 文件 ESLint、生产构建和差异检查通过。构建保留既有部分 chunk 超过 500 kB 的提示。
- 归档前程序核对原 49 条正文、标签字典、关系与 UI 文案未被覆盖；本轮总新增四条五轮。最终 WebP 尺寸和格式已读回，其解码像素与源 PNG 完全一致。
- 智能体未启动开发服务器或自动化浏览器检查本站；DOM 动画测试使用节点替身，不能替代真实设备的滚动/视觉测试。用户在反馈图片提前退出后确认修订版“现在看起来已经正常了”。
- 英文草稿尚待人工审阅；没有关联 Issue，本次未创建 PR、推送或部署。

## Completion Checklist

- [x] 核对基线、实时目录、标签和项目关系，按确认稿新增四条五轮。
- [x] 支持独立回答配图，复用 WebP 与共享图片查看器。
- [x] 完成圆角计数/图片标记及各折叠入口、模式、测量边界维护。
- [x] 保留逐个退出并提前释放滚动锁，修正图片错峰观感，用户确认恢复正常。
- [x] 通过内容、类型、相关 lint、构建及差异检查，记录视觉验证和英文限制。
- [x] 按用户授权归档任务、更新 ROADMAP、清空 ACTIVE_TASK，并提交本轮本地更新。
