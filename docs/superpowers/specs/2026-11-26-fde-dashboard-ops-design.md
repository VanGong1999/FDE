# FDE 知识库 Dashboard 操作台设计

## 意图

把 FDE 知识库从 Docsify 文档站升级为整站 Dashboard 操作台：用高信息密度界面做快速索引与跳转，Markdown 仍是内容源。

## 目标

- 打开即见深色操作台：力导向知识图谱 + 指标卡 + 列表 + ticker
- 点击节点/卡片在右侧阅读文章，可展宽
- 假实时数据增强“现场感”，不干扰阅读
- GitHub Pages 静态部署

## 非目标

- 不重写课程 Markdown、不迁 MDX
- 不做登录、评论、真实 WebSocket
- 不保留 Docsify 作为生产壳

## 实现方案

采用 **Vite + React + TypeScript** 新建 `web/`：构建时解析 `_sidebar.md` 生成图谱；运行时 fetch Markdown；Pages workflow 构建并上传 `web/dist`。

备选 Docsify 补丁与 Next/MDX 全量迁移已排除：前者达不到整站操作台，后者迁移成本过高。

## 约束

- 部署 base path：`/FDE/`（GitHub project pages）
- 图谱节点控制密度：每轨最多 6 篇进力导向图，其余进列表
- 尊重 `prefers-reduced-motion`
