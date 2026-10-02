# Unified site design

Status: COMPLETED on 2026-10-02

## Task Objective

统一网站样式并按用户反馈持续微调，包含问题墙英文翻译、共享排版、主题强调色、普通与朴素模式的一致性。

## Implementation

- 普通知识/小工具卡片参考同类项目卡片，在摘要与详情链接之间复用 FeaturePointList，使用与朴素列表相同的 getListingPointSections 显示前三条（不足三条按实际数量）；保留工具强调索引和行内强调。两类 Grid 的高度估算同步包含这些条目，避免新增内容影响分栏平衡。

- 新增根目录 AGENTS.md 作为开发提示词入口，记录设计连续性、现有样式/组件位置和当前字重/强调色/tag/弹窗等约定；README 与 .context/README 关联入口，SPEC 明确新功能先参考同类内容、复用共享样式，并修正过时的固定正文字重说明。本次仅文档变更，校验引用路径和 diff。

- FPV 按钮共用 .fpv-action-pill 的 normal/400 字重（由统一后的 300 整体提高），移除第一屏/联系屏重复声明及第二屏手机端 400 覆盖，使第二屏按钮与其他屏统一；按钮尺寸和外观保留。

- FPV 第二屏按钮修复：透明虚拟屏幕不再接收整屏点击，实际控件显式接收事件，避免挡住 depth=-10 的学业与工程卡片；不可交互/退场对象设为 inert，阻止隐藏控件捕获点击及键盘焦点。study attachment 用独立 React Component（cloneAnchor:false），与参考锚点共用 FieldCard 保持尺寸；保留 /resume 与 GitHub 新窗口链接。Lint、类型和构建检查通过；依仓库约定未打开浏览器验证。

- AI 辅助在三项订阅后增加「DeepSeek API 服务」/「DeepSeek API service」，highlightPointIndexes 扩为 [0, 1, 2, 3]，普通和朴素视图共用内容与强调配置。

- 朴素 Akashi 首页与简历通过专属 main 类增加 --plain-top-offset: clamp(1.5rem, 4svh, 3rem)，在既有顶部 padding 上增加 24–48px，桌面/手机均应用并保留安全区；其他文档页不受影响。

- 工作台图标滚动抽为 SoftwareIconMarquee：ResizeObserver 测量容器与单组图标（含组尾间隔），渲染 ceil(容器宽/组宽)+1 组，动画每轮精确移动一组宽度。少图标/宽卡片不再滚出空白，缩放时自动补足，修正原 50% 加偏移的接缝；保留速度、悬停暂停、reduced-motion 和重复图标的 aria-hidden。Lint、tsc、Vite 构建及 diff 检查通过，未启动浏览器预览。

- 工作台 SoftwareGroupCard 的 bullet 行高由 1.625 收紧为 1.375，保留条目间 gap-2（8px），圆点顶部偏移同步改为 0.5em 以对齐首行。仅作用于工作台卡片（含简历预览），不改其他 FeaturePointList。

- 小工具区的 description 从整个布局底部移到左侧 ArchiveSectionHeader 与 tag 之间，沿用 SectionNote 的字重、字号与水平对齐；各屏幕宽度及中英文共用同一顺序。

- 正文字重按主题共用：`--site-body-weight` 浅色 400、深色 300，`font-body` 工具类供显式正文使用。body、朴素文档及其说明、site-lede、section-subtitle/note、简历段落、问题正文统一使用；标题、tag、控件及强调保留原字重。

- 全站模态层统一：`dialog-motion.ts` 共用 500ms 进入、330ms 退出及问答曲线；`ui/dialog.css` 使居中弹窗从视口底部移入、顶部移出，替代缩放。DialogOverlay 共用反向主题底色遮罩（深色模式用浅色 10%，浅色模式用深色 25%） + 10px blur；问答链继续按分段数量保留退出时长。系统 reduced-motion 禁用动画，full/static/plain 均可打开。
- 个人信息弹窗移除独立 workbench 进入动画及手机端动画禁用，补充可访问标题/说明；二维码等锚定小浮框不变。
- 新增 PlainImageGallery 作为现有 ProjectImageGallery 的朴素入口适配：详情多图、通用列表图、项目/课设/工具及简历单截图均可点击打开，保留当前图、缩略图、方向键和滑动切图；关闭后恢复图片触发器焦点。项目和工具查看器共用新弹窗样式。

- 朴素详情的 RelatedQuestions 根据显示模式使用 document 列表（hashtag、轻字重、下划线问题），问题标题采用 h3；保留翻页与打开问答链。修正侧栏列表额外叠加的间距。详情双栏改为等宽，每列至少 24rem，空间不足时自动堆叠；详情小标题使用朴素轻字重。

- 朴素列表标题后首个内容区统一使用 --plain-index-header-gap（沿用问题墙 1.8–3rem），移除原先叠加的 section 顶部 padding 和分隔线；项目、课设、工作台、知识、小工具及问题墙共用此规则，其他区块间距不变。

- 朴素文档联系方式等页头操作按钮补充共享下划线及 hover/focus 线宽；朴素问题墙取消选择改为原生文字按钮，复用 site-text-link，去掉胶囊边框/背景，保留筛选 tag 的无下划线高亮规则。

- 朴素文档条目副标题使用局部 20–22px 字号与 300 字重，避免继承普通卡片的 24–28px 大字号；正文和说明文字最终按主题使用深色 300 / 浅色 400 字重，显式强调、tag 和主标题层级保持既有规则。

- 问题墙已补齐 39 条问答链、44 轮英文正文，保持技术语义及代码标记；中文来源提示只在实际回退中文时出现。维护说明与语言覆盖测试同步更新。
- 共享样式位于 `src/styles/design-tokens.css`：统一字体栈、300/400/500 字重和字号角色；FPV 保留展示布局与字号。
- 最新字号：页面标题 36–44px，章节标题 30–36px，卡片/项目名称 24–28px，Akashi 展示标题 56–96px。普通页面及朴素标题共用角色。
- 简历正文局部放大：普通 `.resume-section-stack` 与 `.plain-resume-document` 的 text-sm 为 15px、text-base 为 17px；兴趣条目也使用共享正文角色。
- 简历四行简介收紧为 1.45 倍行高，无额外段落 gap，相邻区块间距不变。
- 兴趣标题接入 SectionHeader，仅增加顶部 FIELD；保留星形装饰和轨道布局。
- 气泡和选中 tag 填色：浅色模式 #dbeafe，深色模式 #17365b。bullet 强调文字及标记使用独立反向色：浅色模式 #17365b，深色模式 #dbeafe；蓝底前景色单独定义。
- 链接保持原文字颜色，朴素模式统一下划线；外链图标复用 ExternalLinkIcon。
- 朴素标签复用 DocumentTag，显示为 hashtag，空白转下划线；选中/匹配使用文字背景高亮，不改变原始标签数据。
- 普通模式标签、按钮恢复既有胶囊外形与配色。背景色、玻璃表面及动画参数保持原样；朴素首页移除 Akashi 上方模式说明。
- 项目轮换 bullet 上限：<768px 4 条，768–1199px 1 条，1200–1499px 2 条，≥1500px 中文 5 条/英文 3 条。
- 项目预览至少一半名额留给个人贡献，仅一条名额时优先贡献；保留靠前普通介绍，重映射强调索引并保持原顺序。普通/朴素预览同步；Crater 大屏中文为 2 条普通介绍 + 3 条贡献。强调标记使用 renderEmphasizedText。
- 项目文案在全部宽度测量最长条目高度，保证新增内容不裁剪并稳定轮换布局。
- 普通问题墙采用项目/知识列表的 max-w-7xl、mt-2/sm:mt-4、标题容器 px-2/sm:px-4 与标题后 8/12 间距；接入 SectionHeader，保留筛选重置和关闭问答后的焦点恢复。
- 普通问题墙气泡、内容 tag 和筛选 tag 复用现有 --shadow-sm，中性外阴影，不使用前景色光晕；朴素模式不受影响。
- 问答链展开背景按最新确认使用反向主题背景色遮罩（深色模式 #fbfaf7 / 10%，浅色模式 #120f17 / 25%），保留 10px 模糊与进退场动画，取消 brightness 滤镜。
- 当前反馈针对朴素问题墙顶部筛选 tag：去掉 2rem 最小高度及上下 0.25rem 内边距，沿用 DocumentTag 的 12px/1.6 行高；行间 gap 从 0.35rem 增至 0.5rem。默认字号下相邻行跨度由 37.6px 降至 27.2px。

## Technical Context

- 仓库上下文根目录为 `.context/`；React + TypeScript + Vite + Tailwind CSS。
- 初始化时已 fetch origin，main 与 origin/main 均为 786940a，工作区干净。作为本轮归档提交的变更基线。
- 遵循 SPEC 的主题、语言、路由和数据契约；多列可变高度列表保持按高度平衡。
- 默认只运行非交互验证，不启动本地服务或打开浏览器，除非用户明确委托。
- 验证构建使用 `npx tsc -b && npx vite build`，避免触发 prebuild 的 GitHub 数据更新。
- ROADMAP 已登记本轮归档；需求反馈保留于 RAW_REQUIREMENTS，ACTIVE_TASK 重置为空任务头。

- 最新朴素问题条目微调：tag 到问题的间距从 0.58rem 降至 0.25rem；问题使用深色 300 / 浅色 400 字重与共享文档链接下划线，作用于朴素问题页和简历问题区。

## Verification

- 归档前最终验证：`npm run lint`、`npx tsc -b`、`node --test tests/*.test.mjs`（24 项）、`npx vite build`、`git diff --check` 全部通过。构建保留既有大 chunk 提示，无构建错误。
- 用户在持续截图反馈后明确要求完成并归档本轮任务；按仓库约定未自动运行浏览器，不将静态检查当作视觉或真实点击验证。

- 弹窗统一与朴素图片查看器：lint、TypeScript 通过；问答/项目现有测试 24 项通过，生产构建通过。按项目约束未启动浏览器验证动画。

- 朴素仓库链接的整行 anchor 取消下划线，仅名称 span 保留下划线和 hover/focus 加粗线条；保留 tag、图标和统计数字的整行点击行为。

- 朴素非首页统一使用 7xl（80rem）居中内容容器：简历取消 100% 撑满，问题页取消独立 76rem，404 取消独立窄宽及左对齐；沿用共享响应式外边距，首页的 100ch 和移动端留白不变。

- 问题墙及标签测试此前 22 项通过。
- 项目预览回归测试 `tests/project-points.test.mjs` 2 项通过：中英文 Crater 各档名额、贡献索引、短列表与输入不变性。
- 最新项目预览修改的 lint、类型检查和生产构建通过；构建仅有既存的大 chunk 提示。
- 当前筛选 tag 间距调整完成后检查生产构建与 diff；视觉效果由用户审阅。

## Task Checklist

- [x] 使用 start-task 初始化任务并读取项目上下文。
- [x] 补齐问题墙英文正文与语言覆盖验证。
- [x] 建立共享排版、主题强调色、标签及外链规则。
- [x] 恢复普通模式标签/按钮和原有背景，保留 Akashi 超大标题。
- [x] 按反馈调整标题、正文、项目贡献预览和兴趣标题。
- [x] 统一普通问题墙宽度、标题位置和外阴影。
- [x] 按最新确认实现问答链半透明背景遮罩。
- [x] 收紧朴素问题墙顶部筛选 tag 高度与整体行距。
- [x] 已落实本轮用户反馈，用户明确要求完成并归档。
- [x] 已获得归档授权，迁移任务记录并触发 commit-helper 收尾提交。

## Closure

- Archive: `.context/archive/20261002_Unified-site-design.md`
- Scope: 全站统一样式、问题墙翻译、朴素模式、弹窗与预览、FPV/工作台交互修复及后续开发约定。
- Git: 使用仓库既有 `feat:` 提交约定；生成 PR 描述供审阅，本轮不创建 PR 或推送远端。
