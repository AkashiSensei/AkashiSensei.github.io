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

问题墙的结构数据集中在 `src/data/questions.json`：每个主题有稳定内部标识、有序轮次、英文标签引用和可为空的项目关联。问题与回答正文在 `src/content/locales/zh/questions.json` 的 `items` 中按主题和轮次对应；原始中文正文先保留，英文正文未录入时显示中文，并在英文阅读界面提示。`en/questions.json` 当前提供英文界面文案。支持正文中的反引号代码、双星号强调及换行，不执行原始 HTML。

新增问答链追加到 `threads` 末尾，以录入顺序作为新旧顺序；独立问题页倒序展示，标签筛选后仍保持从新到旧，桌面双栏按问题气泡与标签的实际高度进行瀑布流排列，按新到旧依次接到较短的一栏，保持新问题优先出现在上方；窄屏按原顺序单栏显示。修改既有问答不改变其顺序。简历动态墙随机展示并轮换，简洁模式每次挂载随机抽取最多 8 条，浏览期间保持稳定。

主题、轮次的内部标识用于分享链接，编辑标题或调整顺序时应保持不变；作者维护的素材表不需要 ID 列。`tagIds` 对应结构文件中统一英文标签字典。`relatedProjects` 可以为空；有值时使用 `module`（`projects` 或 `course-projects`）与既有项目 `id`，项目详情的「相关问题与思考」自动反查，不维护第二份关联清单。关系的 `note` 保留素材中的推断或对照说明，显示在项目链接提示中。

问题可在结构数据中配置 `questionImages`，以轮次 ID 为键，值为图片引用数组，例如 `"opening": [{ "module": "course-projects", "id": "parallel-programming-2026", "imageKey": "ncuSharedMemory8192" }]`。图片通过项目 `images` 中对应的 `altKey` 解析，复用原图路径、尺寸、多语言替代文本和亮度标记；引用图片不自动增加关联项目。每张图片在阅读层的对应问题下方显示为独立气泡，单独参与错峰进出动画，简历墙和问题索引仍只展示问题文本。

简历问题墙位于工作台与知识沉淀之间；`/questions` 支持标签、项目范围和分批阅读。各入口共用问答弹窗，`question` 与 `round` 查询参数可以定位具体问答。执行 `npm run test:questions` 可检查数据引用、筛选及轮换边界。
