# ACTIVE_TASK

Status: COMPLETED on 2026-10-16

## Goal

补充 Crater 个人工作文案，并将 NPU 项目的仓库引用更新为迁移后的 raids-lab 地址。

## Issue Reference

- 无关联 Issue；来自 2026-10-15 的新任务请求。

## Implementation Details

- 仓库已按用户要求快进更新：`main` 从 `277c3cd` 同步至 `38f702b`，与已获取的 `origin/main` 一致；开始任务时工作区干净。
- 用户已明确要求实施：保留 Crater 现有五条个人工作，在末尾追加一条，不将八类工作拆成八条。
- 对照现有内容，CLI 基础框架、Agent 接口、开发与审查 Skills、开发环境镜像制作已有覆盖，不在新增条目重复。
- 新增「平台功能与工程完善」：Dockerfile 生成与提交构建；Jupyter 启动、权限、SSH 与初始化 hooks；账户成员与角色变更；用户作业及节点信息；LDAP/AD 与实验室服务解耦；模板迁移、节点选择与失效 RDMA 配置；CLI 认证、补全、诊断、分发；CI、配置管理与版本追踪。
- 用户追加要求：该条末尾使用「等功能」，英文对应为「among other improvements」，表明列举并非全部。
- 2026-10-16 NPU 仓库迁移：通过已认证的 GitHub CLI 核实正式名称为 `raids-lab/npu_computing_forecast`，URL 为 `https://github.com/raids-lab/npu_computing_forecast`，可见性仍为 PRIVATE。更新 `projects.ts` 的 `repoName` 与 `githubRepo`，保留原有私有仓库呈现及稳定项目 ID。
- 同步将统计快照中该仓库的键迁移到新名称，保留原有统计和采集时间，避免构建无法访问私有仓库时丢失既有缓存；未将旧统计表述为新采集结果。
- 沿用现有双语内容结构及稳定实体 ID；中文确认事实与意图，英文按 SPEC §4.1 自然重写，应用时告知用户并邀请审阅。
- 参考与复用入口：现有 `projects.json` 的 `items.crater.points.personalWork` 与 `ProjectDetailPage.tsx` / `getProjectPointSections` 的完整详情消费入口；继续使用 `**总结**：说明` 结构，无 UI 或样式变更。

## Test Plan

- 初始化：检查分支同步状态与上下文 diff，无需启动应用或运行代码测试。
- 实施后按改动范围检查 JSON 语法、键结构、中英文对应及事实一致性。
- 简单文案修改不新增测试；涉及问答引用、博客导入或类型结构时，运行对应现有检查，必要时执行 lint、类型检查或构建。
- 未获明确预览要求时，不启动开发服务器、不打开浏览器；视觉效果由用户审阅。

## Focusing Files

- `.context/ACTIVE_TASK.md`：范围、方案与验证记录。
- `src/data/projects.ts`：NPU 规范仓库名称与统计引用。
- `src/data/generated/github-repo-stats.json`：迁移后的统计缓存键。
- `src/content/locales/zh/projects.json`：Crater 个人工作。
- `src/content/locales/en/projects.json`：对应英文草稿。

## Technical Context

- SPEC §2.2：规范实体数据与 UI 文案分离，中英文使用相同稳定 ID；不复制首页与详情内容。
- SPEC §3.5：中文单句短文案可省略句末句号，多句说明与正文保留正常标点；贡献描述保持事实归属与证据边界。
- SPEC §4.1：英文避免机械直译，保留事实、突出价值与贡献，AI 草稿需人工审阅。
- SPEC §3 与 §8：沿用现有设计体系和呈现方式，遵守本地预览边界。
- 既有 SPEC 已覆盖本轮文案与仓库引用要求，无需新增全局约束。

## Task Checklist

- [x] 读取上下文治理及 start-task 工作流。
- [x] 获取远端状态，按用户授权更新本地并确认 `main` 与 `origin/main` 一致。
- [x] 查阅 SPEC、ROADMAP 与内容维护规范，建立新任务记录。
- [x] 用户补充修改对象、现有文案或目标表达，并明确要求修改。
- [x] 定位具体文件与使用方，对照八类工作排除已有覆盖项。
- [x] 在既有个人工作末尾追加一条，同步英文。
- [x] 验证双语 JSON 可解析、Crater 个人工作从五条变六条且原五条逐字保留、其他内容与 HEAD 一致；`git diff --check` 通过。纯文案变更，未启动应用或执行视觉检查。
- [x] 核实 NPU 新仓库名称与可见性，更新规范数据与统计缓存引用。
- [x] NPU 仓库引用与缓存一致性检查、`npx tsc -b` 和 `git diff --check` 通过。
