# 仓库开发约定

开始任务前先阅读 [.context/README.md](.context/README.md)，按任务需要查阅 [.context/SPEC.md](.context/SPEC.md) 和 [.context/ACTIVE_TASK.md](.context/ACTIVE_TASK.md)。设计要求以 SPEC 第 3 节为准，以下规则用于指导实现。

## 新功能必须延续现有风格

网站已统一字体、字号层级、主题字重、文字对比度、强调色、标签、链接、阴影和弹窗交互。后续新增页面、模块或功能，必须先参考已有同类内容，尽量保持一致，并优先复用对应组件、样式类和设计变量。

- 开始 UI 实现前，找到最接近的现有页面及组件，核对布局宽度、标题位置、留白、文字层级、控件和交互。在任务记录中简要注明参考对象与复用入口。
- 复用顺序：现有组件 → 共享样式类 / 工具函数 → 设计变量。不要复制一套近似 CSS，也不要给每个新模块单独设计字体、主题色、圆角、阴影或动画。
- 同一语义角色使用同一套样式。需要新变体时，先判断能否扩展现有组件；可复用的新角色应进入共享样式，避免在单个页面硬编码。
- 页面内容不同可以有不同构图，但应保持视觉语言一致。FPV 首页可以保留独特布局、展示字号和场景动画；这不意味着新增按钮、链接或弹窗可以另起一套风格。
- 普通模式与朴素文档模式都属于同一设计体系。新功能必须考虑两种呈现、深浅主题、中英文，以及手机、横屏、竖屏和宽屏布局；朴素模式保留相同的导航、弹窗和图片查看能力。
- 在共享规则与旧页面的局部写法冲突时，遵循共享规则，不把旧的不一致继续复制到新功能中。用户明确指定的局部差异应限定范围。

## 共享样式入口

| 用途 | 优先参考与复用 |
| --- | --- |
| 字体、字号、字重、主题强调色 | `src/styles/design-tokens.css` |
| 五级文字对比度、页面布局、朴素文档样式 | `src/index.css` 与 SPEC §3.6 |
| 页面壳、章节标题与说明 | `src/components/Layout.tsx`、`src/components/SectionHeader.tsx` |
| 卡片与玻璃表面 | `src/components/GlassPanel.tsx`、`src/components/SpotlightCard.tsx` |
| 普通 tag、按钮 | `src/lib/tag-styles.ts`、`src/lib/action-button-styles.ts`、`src/components/ui/button.tsx` |
| 朴素 tag、外链图标 | `src/components/DocumentTag.tsx`、`src/lib/tag-label.ts`、`src/components/ExternalLinkIcon.tsx` |
| bullet 与个人贡献强调 | `src/components/FeaturePointList.tsx`、`src/lib/emphasized-text.tsx` |
| 弹窗、背景遮罩、进退场 | `src/components/ui/dialog.tsx`、`src/components/ui/dialog.css`、`src/lib/dialog-motion.ts` |
| 图片查看 | `src/components/ProjectImageGallery.tsx`、`src/components/SmallToolImageGallery.tsx`、`src/components/PlainImageGallery.tsx` |
| 问题列表与问答链 | `src/components/QuestionList.tsx`、`src/components/QuestionThreadDialog.tsx`、`src/components/questions.css` |
| FPV 场景及可点击浮层 | `src/components/home-fpv/README.md` 和相邻 screen 组件 |

## 已确认的设计约定

- 正文按主题取字重：深色 300、浅色 400，普通与朴素模式一致。使用 `font-body` / `--site-body-weight`，不要按页面再固定为 light 或 normal。标题、tag、按钮和显式强调按各自角色取值；FPV 首页按钮统一为 400。
- 使用共享字号角色及五级文字对比度。Akashi 的展示标题明显大于普通标题；正文、元信息、标题不能混用层级。不要为新组件另选字体或随意增加粗体。
- 蓝色表面与文字强调分开：浅色模式的气泡/选中 tag 用浅蓝，深色模式用深蓝；强调 bullet 的文字和圆点使用反向蓝色。复用对应 token，普通链接保持原文字颜色。
- 普通模式保留现有胶囊 tag 和按钮。朴素 tag 使用 `#CUDA`、`#resource_sharing` 形式，仅显示时把空格替换为下划线，选中或匹配时使用文字背景高亮，不修改规范数据。
- 朴素链接和可点击文字操作使用共享下划线。复合仓库链接只给名称加下划线，不给图标、tag 或统计数字整行加线。
- 阴影复用同类卡片的外阴影，不以外发光代替。风格调整不能顺带更换已有页面背景、玻璃表面或背景动画配色。
- 朴素文档除首页外复用共同的页面宽度与标题后留白；首页和简历顶部已有额外留白。不要在新页面重新定义一套阅读宽度。
- 完整弹窗统一从底部进入、顶部离开，背景复用模糊与反向主题色遮罩：浅色模式深色遮罩 25%，深色模式浅色遮罩 10%。使用共享变量，不在新弹窗复制数值；手机二维码等边缘小浮框保留原交互。遵循 reduced-motion。

## 验证与维护

- 修改共享样式时检查受影响的其他调用方，特别是普通/朴素、深浅主题和移动端覆盖规则，避免只修当前截图。
- 新功能的可编辑文案沿用 `src/content/locales/` 的中英文结构，实体数据与 UI 分离；内容规范见 [src/content/README.md](src/content/README.md)。
- 按改动范围运行 lint、类型检查、构建或必要测试。纯文档或简单文案修改无需启动应用。
- 遵守仓库预览边界：用户未明确要求时，不启动开发服务器、不打开或自动化浏览器。没有视觉实测时如实说明，不将静态检查表述为已验证视觉效果。
- 持久设计规则写入 SPEC，实现与验证记录写入 ACTIVE_TASK；共享样式发生变化时同步更新相关说明，避免提示词与实现长期分歧。
