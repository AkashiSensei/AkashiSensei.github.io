# ACTIVE_TASK

Status: COMPLETED on 2026-10-13

## Goal

补录圆圈骑士历史课设，完善项目技术标签，并同步更新 Crater / NPU 项目表达与简历首屏三条亮点。

## Issue Reference

- 无关联 Issue；来源为本会话 2026-10-13 的需求与逐项确认。
- 已完成的独立小游戏仓库：[BUAA-Summer-Term-2022](https://github.com/AkashiSensei/BUAA-Summer-Term-2022)，用户明确批准后公开。

## Implementation Details

### 历史项目恢复与独立归档

- 圆圈骑士（Circle Knight）为 2022 年大一暑期小学期的自由选题软件项目，使用 Java Swing；课程不限软件类型或实现技术，并非 Java 课程。
- 以提交版为恢复基准，13 个源码文件与最终提交压缩包及最后一次历史 ZIP 一致；顶层另一版的 5 个文件差异已单独备份，未擅自合并。原始材料未修改。
- 原 JAR 因系统默认 Java 8 版本不足而启动失败。使用已有 IntelliJ Java 21 原样编译为 Java 14 字节码，69 张运行图片均通过 Swing 解码，桌面启动成功；用户实际游玩并确认体验与当年版本一致。
- 独立仓库保留原始源码、必需图片，补充构建/运行工具、开发文档文本和恢复记录。PSD、未使用素材、原 Word 文档、原 JAR、另一版源码及构建产物保留在本地，不提交到该仓库。
- 依据原始开始菜单的「CIRCLE KNIGHT / 圆圈骑士」统一对外名称和 CircleKnight.jar 构建产物。README 使用菜单封面与四宫格游玩截图，详细操作指向游戏内教程；第一张截图已替换为用户调整朝向后的最新版本。
- 上述独立仓库工作已另外提交并上传；本次个人主页提交不跨仓库暂存任何文件。

### 个人主页课设收录

- 增加稳定 ID `circle-knight-2022`，详情路由 `/course-projects/circle-knight-2022`，状态为完成、仓库公开，补齐中文与自然改写的英文简介、项目背景及个人工作。
- 时间标签为「大一暑期 / 2022夏」，中英文分别提供显示文案，时间排序明确早于 2022秋，因此圆圈骑士位于课设列表末尾；筛选使用现有 `summer-2022` URL 及年级/学期配对机制。
- 七张 WebP 图片顺序：封面、设置界面、四张实际游玩截图、目标达成图。首张游玩图为最新朝向版本。封面/设置/通关为 1280×720，游玩图为 2784×1664，均保留原比例与双语替代文字。
- 检查原图后未发现需要额外 high brightness 标记的大片白底。图库继续复用共享轮播、预览、朴素模式查看器和弹窗交互。
- 仅更新新仓库的 GitHub 统计快照，包含 5 个提交、0 星及公开状态；未刷新无关仓库或活动统计。后续构建统计工具可从规范数据自动发现新仓库。
- Career YIYAN（career-yiyan）和云易研（cloud-yiyan）追加既有规范技术标签 `CI/CD`，自动进入筛选集合。
- 参考本科并行程序设计及编译器课设，复用 CourseProjectsPage → ProjectIndexPage、ProjectDetailPage、ProjectCard、CourseProjectTagFilter 与现有图库。无共享组件或样式变更，未调整简历精选名单。

### 项目与首屏文案

- Crater 将「工程经验复用」调整为「团队质量保障机制」，强调把个人质控经验通过覆盖开发、审查、文档、发布的全流程 Skills 沉淀为团队可复用机制。
- NPU 第一条改为「实验数据产线」，覆盖实验执行、指标采集、处理分析与批量/重复实验；单列 AI 实验可靠性保障，突出风险识别、拒绝未知配置及生效核验。保留既有技术覆盖、诊断与量化结果。
- 简历首屏 values 更新为「从目标到交付」「钩深致远」「权衡有度」。第一条通过主动学习、判断方案、解决问题与关键节点交流，表达自主推进及开放协作；第二条表达基础与追问相互促进；第三条保留按场景权衡效率/质量和在质量约束下提效两个方面。
- 三条亮点不使用分号。其他首屏简介、标签及朴素标题未改。
- 项目与首屏均同步中英文，沿用共享数据与强调格式。ResumePage 与 ResumePlainExperience 共用 values，因此普通、静态、朴素模式同步更新；英文自然改写已告知用户并邀请审阅。

## Test Plan

- 已通过 `npm run lint`。
- 已通过 `npm run test:tags`，12 项测试全部通过。
- 已通过 `npm run build --ignore-scripts`（TypeScript + Vite），跳过与本任务无关的博客导入及全量 GitHub 统计前置任务；构建有既有大体积 chunk 提示，不阻断产物生成。
- 已额外核对七图顺序、WebP 格式、实际尺寸、双语图片键、时间排序及 `summer-2022 + Java Swing` 筛选组合。
- 已核对双语 JSON 解析、bullet 结构对应、首屏仅 values 变化及无分号约束，`git diff --check` 通过。
- 遵守预览边界，未启动站点开发服务器或浏览器；主题、响应式布局及视觉效果没有做浏览器实测。

## Focusing Files

- `src/data/course-projects.ts`
- `src/content/locales/{zh,en}/course-projects.json`
- `src/content/locales/{zh,en}/projects.json`
- `src/content/locales/{zh,en}/resume.json`
- `public/assets/course-projects/circle-knight-2022/`

## Technical Context

- React + TypeScript + Vite，静态 GitHub Pages；实体与 UI 分离，列表/详情/精选引用同一数据（SPEC §2.2）。
- 沿用既有主题、标签、字体角色及图片查看能力，无新增设计或架构约束，因此不修改 SPEC。
- 项目/课设 bullet 使用短加粗概括加冒号，区分背景与个人工作；英文面向英语读者改写（SPEC §3.5、§4.1）。
- 时间筛选保留规范数据、配对标签与稳定英文 URL；新增条目复用现有夏季回退配色（SPEC §5）。
- 规划开始时 main 与 origin/main 均为 a3916d5，ahead/behind 为 0/0，工作区干净。归档提交仅覆盖本仓库的任务变更。

## Task Checklist

- [x] 读取上下文、核对远端同步状态和复用入口。
- [x] 辨识历史提交版、恢复编译运行并保留原始材料。
- [x] 整理独立游戏仓库、README 与截图，按明确授权公开。
- [x] 新增双语课设实体、七张有序 WebP 图片与仓库统计。
- [x] 补齐 2022夏 时间标签和排序，确认圆圈骑士位于最后。
- [x] 为 Career YIYAN 与云易研添加 CI/CD 标签。
- [x] 更新 Crater / NPU 配套项目文案并同步英文。
- [x] 按最终确认更新三条首屏亮点并同步英文。
- [x] 通过适用检查并记录视觉验证边界。
- [x] 归档任务、更新 ROADMAP 并重置 ACTIVE_TASK。
