# ACTIVE_TASK

Status: COMPLETED on 2026-10-13

## Goal
统一全部项目与课设的双语能力条目，结合最新简历修正贡献与预测结果，并完成本次评论和图库补充。

## Issue Reference
- 无 GitHub Issue；按本次对话确认范围实施，参考 resume 仓库最新会话与已确认简历条目。

## Implementation Details
- 全部 6 个项目、15 个课设统一为“**总结**：说明”及英文对应形式，最终共 216 条双语 bullets。个人贡献体现工程、分析与协作能力，背景条目保持团队成果归属。
- Crater 强调真实需求交付、理解后评审、生产问题诊断与经验复用；MOS 明确系统自带 memcpy 和本人讲授视频课程；编译器按核对后的实际优化机制表述；CUDA 保留分析、学习与验证定位。
- Career YIYAN 和云易研各将五条平台功能合并为两条，保留开发流程、个人贡献及原有能力。
- NPU 保持四条个人贡献：实验体系、问题推进、可信观测、资源建模。删除 GNN 尝试与本人不了解的梯度检查点修复案例。
- NPU 建模条目内说明阶段性 Llama 微调资源预测器：1,031 次 1B/3B/8B/70B 运行，43 个运行前特征，20 项 HBM、计算/带宽利用率及功耗统计，206 条按配置组留出记录，20 目标平均 R²=0.976，逐目标总体 R²=0.922–0.992。原报告已通过 GitHub CLI 核对；43 项是外层评价输入，不与 45 项全量重训混用。
- 按用户最后确认，将指标和结果放入同一建模 bullet，直接说明范围、统计与阶段性定位，删除否定式免责声明。
- 英文按站点既有规范独立改写，与中文保持事实一致；复用 FeaturePointList、renderEmphasizedText、PlainRichText，不更改组件和布局。
- 同次任务早期已补充 AI PR Review 双语作者评论（2026-10-12）、NPU 两张数据分布截图和 MOS 两张图片，详见 [前阶段记录](20261012_Content-copy-and-gallery-refresh.md)。四张新增素材为 WebP，三张白底图标记高亮度。
- NPU 桌面原图按用户要求删除，暂存 PNG 已清理；MOS 桌面原图保留。共享 bullet 规范写入 SPEC 与内容维护说明。

## Test Plan
- [x] npm run test:blog：24/24 通过。
- [x] npx tsc -b：通过。
- [x] 全量 JSON 与格式检查：21 个实体、216 条双语 bullets 均具有加粗总结与冒号。
- [x] NPU 9 张、MOS 10 张 WebP 的解码、宽高与双语引用检查通过。
- [x] 作者补充的中英文锚点唯一，新增评论位于结论段后、瑞士奶酪模型前，日期与章节链接保持正确。
- [x] 各次修改范围检查通过，保留非目标字段、图片说明、原有实体结构与其他任务成果。
- [x] git diff --check：通过。
- 未启动开发服务器或浏览器，未进行视觉实测。

## Focusing Files
- src/content/locales/zh/projects.json
- src/content/locales/en/projects.json
- src/content/locales/zh/course-projects.json
- src/content/locales/en/course-projects.json
- src/content/blog/author-notes.json 与项目/课设图片数据入口

## Technical Context
- SPEC §3.5：能力总结、具体贡献、事实归属与最新简历一致，网站保留必要细节。
- SPEC §4.1：英文自然改写；共享强调使用既有 medium 角色，支持普通、静态及朴素模式。
- 原文快照、实体 ID、路由、图片查看机制和既有视觉语言保持不变。

## Task Checklist
- [x] 核对最新简历会话，确认范围与事实边界。
- [x] 完成全部项目和课设中英文条目及局部合并。
- [x] 核对 NPU 报告并按用户确认合并阶段性预测结果。
- [x] 完成评论与图库补充，清理任务暂存素材。
- [x] 完成内容、资产、类型及博客验证。
- [x] 用户确认完成，保存归档、更新路线图并重置 ACTIVE_TASK。
