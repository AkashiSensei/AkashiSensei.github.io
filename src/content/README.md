# 站点文案（可编辑）

面向访客的展示文案集中在：

- `src/content/locales/zh.json` — 中文
- `src/content/locales/en.json` — 英文

修改后保存即可；开发服务器热更新会重新加载。站点展示名在两条 JSON 里的 `site.displayName`（当前为 **Akashi**）；首页标题 `home.title` 通过 i18n 嵌套引用该字段，改一处即可同步到各语言标题。

公开站点**不提供简历下载**；联系方式仅保留为可公开的渠道（具体链接或邮箱由你自行配置到「联系我」按钮上）。

首页简介 `home.description` 中可使用 `\n\n` 分段；页面使用 `whitespace-pre-line` 渲染换行。

加载逻辑在 `src/i18n.ts`。
