# FDE 知识库 Dashboard 操作台实现计划（镜像）

> 权威待办与执行状态见会话计划；本文件为仓库内归档。

**目标：** Vite + React 整站 Dashboard 操作台（力导向图 + 信息卡 + Markdown 阅读）。

**规格：** `docs/superpowers/specs/2026-11-26-fde-dashboard-ops-design.md`

**入口：** `web/` · 构建产物 `web/dist` · Pages workflow 上传 dist。

**关键脚本：**

- `web/scripts/generate-graph.mjs`
- `web/scripts/prepare-content.mjs`

**本地：**

```bash
cd web && npm install && npm run dev
```

**生产构建（GitHub Pages base）：**

```bash
cd web && GITHUB_PAGES=true npm run build
```
