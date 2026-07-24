# 站点文案（可编辑）

> 本文件只说明内容目录与维护入口。进行开发、内容新增或结构调整前，请先阅读 [项目上下文说明](../../.context/README.md)、[项目规格](../../.context/SPEC.md) 和 [当前任务](../../.context/ACTIVE_TASK.md)；需要追溯原始需求与设计意图时，再查看 [原始需求记录](../../.context/RAW_REQUIREMENTS.md)。项目目标、架构约束、内容与国际化规则、Agent 协作边界及当前任务范围以 `.context/` 中的文档为准。

面向访客的展示文案按语言和领域拆分在：

- `src/content/locales/zh/` — 中文
- `src/content/locales/en/` — 英文

每个语言目录按领域拆分，例如 `common.json`、`nav.json`、`home.json`、`resume.json`、`directions.json`、`workbench.json`、`tools.json`。新增语言时复制同一组文件名，并在 `src/i18n.ts` 注册对应 namespace。

修改后保存即可；开发服务器热更新会重新加载。站点展示名在 `common.json` 的 `site.displayName`（当前为 **Akashi**）；首页标题 `home.title` 通过 i18n 嵌套引用该字段，改一处即可同步到各语言标题。

公开站点**不提供简历下载**；联系方式弹窗属于通用文案，集中在 `common.json` 的 `contactDialog` 中维护。

首页简介 `home.description` 中可使用 `\n\n` 分段；页面使用 `whitespace-pre-line` 渲染换行。简历页文案集中在 `resume.json`，其中 `description` 使用字符串列表，便于逐行修改。

工作台软件组的结构数据在 `src/data/workbench.ts`，标题、说明和要点在各语言的 `workbench.json` 中通过同一个软件组 `id` 对应。

小工具的结构数据在 `src/data/tools.ts`，标题、说明和要点在各语言的 `tools.json` 中通过同一个小工具 `id` 对应。

新增或替换图片时，先将运行时引用的素材转为 WebP（确实不适合 WebP 的动图等例外除外）。添加到 `src/data/projects.ts`、`src/data/course-projects.ts`、`src/data/tools.ts` 或 `src/data/knowledge.ts` 后，还需要检查图片是否过白、过亮；如果是白底面积很大或深色模式下会刺眼的截图，在对应图片对象上添加 `brightness: "high"`，让深色模式自动叠加统一的暗色半透明遮罩。

加载逻辑在 `src/i18n.ts`。
