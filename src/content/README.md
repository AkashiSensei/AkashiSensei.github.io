# 站点文案（可编辑）

面向访客的展示文案按语言和领域拆分在：

- `src/content/locales/zh/` — 中文
- `src/content/locales/en/` — 英文

每个语言目录按领域拆分，例如 `common.json`、`nav.json`、`home.json`、`directions.json`、`workbench.json`。新增语言时复制同一组文件名，并在 `src/i18n.ts` 注册对应 namespace。

修改后保存即可；开发服务器热更新会重新加载。站点展示名在 `common.json` 的 `site.displayName`（当前为 **Akashi**）；首页标题 `home.title` 通过 i18n 嵌套引用该字段，改一处即可同步到各语言标题。

公开站点**不提供简历下载**；联系方式仅保留为可公开的渠道（具体链接或邮箱由你自行配置到「联系我」按钮上）。

首页简介 `home.description` 中可使用 `\n\n` 分段；页面使用 `whitespace-pre-line` 渲染换行。

工作台软件组的结构数据在 `src/data/workbench.ts`，标题、说明和要点在各语言的 `workbench.json` 中通过同一个软件组 `id` 对应。

加载逻辑在 `src/i18n.ts`。
