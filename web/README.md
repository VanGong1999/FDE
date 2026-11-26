# FDE OPS Dashboard

FDE 知识库前端操作台（Vite + React）。Markdown 内容仍来自仓库根目录的 `docs/`。

## 本地开发

```bash
npm install
npm run dev
```

`predev` / `prebuild` 会：

1. 从 `../_sidebar.md` 生成 `src/data/knowledge-graph.json` 与 `track-stats.json`
2. 将 `docs/`、`pictures/` 复制到 `public/` 供运行时 fetch

## 生产构建（GitHub Pages）

```bash
GITHUB_PAGES=true npm run build
```

产物在 `dist/`，站点 base 为 `/FDE/`。

## 深链

文章可通过查询参数打开：

```
/?doc=docs/01-角色认知/什么是FDE.md
```
