# Content copy and gallery refresh

## Goal
补充 AI PR Review 作者评论，调整 NPU 项目介绍并为 NPU、MOS 各新增两张图片。

## Changes
- AI PR Review：在引言结论段后、瑞士奶酪模型前新增双语作者补充，日期为 `2026-10-12`。复用现有作者补充管线，保留文章首次发布日期、正文快照、阅读统计与章节 ID。
- NPU：删除双语介绍末句中的 GNN 尝试表述；在首张预测器截图后加入训练配置/资源三维分布及模型/NPU 卡数组合覆盖、微调方法分布截图。
- MOS (`os2023`)：在既有八张图片后追加 memcpy 问题说明及与任课老师合影。
- 四张新增图片均为 WebP，记录真实宽高与双语替代文本；三张白底图标记高亮度，合影使用普通亮度。沿用现有图库及查看器。
- NPU 桌面原图已按用户要求删除；转换和验证完成后清理本任务暂存 PNG、空暂存目录及 TypeScript 增量检查缓存。MOS 桌面原文件保留。

## Validation
- `npm run test:blog`：24/24 通过。
- `npx tsc -b`：通过。
- 校验 NPU 9 张、MOS 10 张 WebP 的解码、实际宽高和双语图片引用；NPU 中英文均无 GNN 表述。
- 直接检查新增评论在中英文结论段之后、瑞士奶酪模型之前，日期准确且章节 ID 不变。
- `git diff --check`：通过。遵守预览边界，未启动服务器或进行浏览器视觉实测。

## Maintenance
- 正文补充入口为 `src/content/blog/author-notes.json`；图片数据入口为 `src/data/projects.ts` 与 `src/data/course-projects.ts`；说明在双语 locale 中维护。
- 本次不引入新的设计或架构约束，SPEC 无需调整。
