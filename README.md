# Akashi · 个人主页

站点展示名为 **Akashi**；仓库仍为 `AkashiSensei.github.io`（GitHub Pages 用户站）。

面向访客的**可编辑文案**集中在 `src/content/locales/`（见该目录下 `README.md`）。

个人主页，用于求职和交友，支持网页端和手机端查看，并提供多语言内容展示。

部署为 GitHub Pages **用户站**：<https://akashisensei.github.io/>（仓库 `AkashiSensei.github.io`，非项目站子路径）。

## 本地开发

依赖：Node.js 20+（推荐 LTS）。

```bash
npm install
npm run dev
```

浏览器打开终端里提示的本地地址（一般为 `http://localhost:5173/`）。生产构建使用 `npm run build`，产物在 `dist/`（后续由 GitHub Actions 部署）。
