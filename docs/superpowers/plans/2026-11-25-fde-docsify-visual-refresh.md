# FDE Docsify Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 FDE Markdown 知识库升级为具有完整学习产品感的 Docsify 前端，同时保留现有内容、路由和 GitHub Pages 部署方式。

**Architecture:** 在现有 `index.html` 中加入少量无依赖的 Docsify 生命周期增强脚本；以 `assets/custom.css` 作为完整主题层；用 `_coverpage.md` 和 `README.md` 现有内容承载首页文案与入口。所有课程正文仍由 Markdown 原样提供，页面标题继续由正文第一行一级标题生成。

**Tech Stack:** Docsify 4、原生 JavaScript、CSS、Mermaid 9.3、KaTeX、Prism、GitHub Pages。

**Spec:** `docs/superpowers/specs/2026-11-25-fde-docsify-visual-refresh-design.md`

## Global Constraints

- 不批量改动课程 Markdown 内容。
- 不替换 Docsify，不新增构建服务或后端。
- 保留现有搜索、分页、Mermaid、KaTeX、图片缩放和绝对路径导航。
- 页面主标题以每个 Markdown 正文第一行一级标题为准；不要通过脚本重写标题文本。
- 只修改入口、主题、封面/首页呈现和必要的前端脚本。
- 现有工作区未提交改动属于用户内容，验证和修改时必须保留。

## Review Focus

- Docsify 路由切换后增强脚本是否重复绑定：通过连续打开首页、深层文章、再返回首页验证事件绑定和 UI 不重复。
- 文章没有一级标题或标题含特殊字符时是否仍能正常阅读：通过打开 README、概念课和面试题页面验证标题与锚点不被破坏。
- 移动端侧栏和搜索是否遮挡正文：通过 390px 视口验证菜单、搜索框、内容宽度和按钮可点击。
- 用户选择明暗主题后刷新是否保持：通过浏览器 localStorage 验证主题类名和刷新后的视觉状态。
- Mermaid/KaTeX/代码块/表格等高密度内容是否仍可读：通过至少一个含图表和一个含代码/表格的深层页面验证溢出、颜色和渲染。

## File Map

- Modify: `index.html` — 增加品牌元信息、Docsify 主题配置和无依赖的页面增强逻辑。
- Modify: `assets/custom.css` — 统一颜色变量、布局、组件、动画、主题和响应式规则。
- Modify: `_coverpage.md` — 调整封面文案结构和视觉入口，保留首页/仓库/姊妹库入口。
- Modify: `README.md` — 仅调整首页可视化区块的结构与入口文案，不改变课程正文链接。
- Test: 浏览器手工/自动化检查，不新增仓库测试依赖。

### Task 1: Stabilize the Docsify shell and theme hooks

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces `window.$docsify` configuration consumed by Docsify 4.
- Produces a single `window.FDEUI` initializer that is safe to run on every `app:rendered` event.

- [ ] **Step 1: Add shell metadata and theme hooks**

  Add theme-color, color-scheme, Open Graph image-safe metadata, and stable `data-theme` hooks without changing Markdown routing or CDN plugin order.

- [ ] **Step 2: Implement the idempotent UI initializer**

  In `index.html`, define `FDEUI.init()` and bind it to Docsify `hook.doneEach`/`hook.ready` so it adds only one top bar, one progress indicator, one back-to-top control, one theme toggle, and one homepage enhancement marker per rendered page. Use `document.querySelector` guards instead of duplicate listeners.

- [ ] **Step 3: Add accessible state behavior**

  The initializer must toggle `data-theme="light"|"dark"`, persist the selected value under a namespaced localStorage key, update the toggle's `aria-label`/`title`, and respect `prefers-reduced-motion` through CSS rather than JavaScript animation.

- [ ] **Step 4: Static-check the shell**

  Run `node --check` against the extracted inline script or use a temporary non-repo extraction command; verify the page still contains the existing Docsify, search, pagination, Mermaid, Prism, zoom and KaTeX scripts in loadable order.

### Task 2: Rebuild the visual system and responsive layout

**Files:**
- Modify: `assets/custom.css`

**Interfaces:**
- Consumes the existing Docsify DOM plus the classes emitted by Task 1 (`fde-topbar`, `fde-progress`, `fde-backtop`, `fde-theme-toggle`).
- Produces the shared light/dark tokens, sidebar, content, component, focus and responsive styles used by all routes.

- [ ] **Step 1: Replace the token layer**

  Define semantic CSS custom properties for ink, muted text, canvas, panel, line, accent, accent-strong, warm highlight and code surfaces; set the default to a light editorial canvas with dark ink and teal/green actions.

- [ ] **Step 2: Style the app shell**

  Style body background, top bar, sidebar shell, search, sidebar section headings, active links, main content max-width, article header spacing and footer/pagination as one coherent layout.

- [ ] **Step 3: Style content primitives**

  Add readable hierarchy for `h1`–`h4`, links, blockquotes, lists, tables, code/`pre`, images, Mermaid, KaTeX, task lists, badges, cards and the existing homepage classes (`hero-actions`, `sister-grid`, `sister-card`).

- [ ] **Step 4: Add dark mode and accessibility states**

  Add `[data-theme="dark"]` overrides, visible `:focus-visible` styles, contrast-safe muted text, reduced-motion rules and a print-friendly fallback.

- [ ] **Step 5: Add responsive breakpoints**

  At desktop, keep a comfortable reading column next to the sidebar; at tablet/mobile, collapse the sidebar cleanly, make tables/code horizontally scrollable, stack homepage cards, and keep controls within a 390px viewport.

### Task 3: Refine the cover and homepage information architecture

**Files:**
- Modify: `_coverpage.md`
- Modify: `README.md`

**Interfaces:**
- Consumes the existing Markdown links and content hierarchy.
- Produces visible homepage sections for positioning, primary learning paths, knowledge-base areas, four-week roadmap, interview/toolbox entry points and supporting links.

- [ ] **Step 1: Refine the cover copy and CTA grouping**

  Keep the first-line title as `# FDE 知识库`, make the subtitle outcome-oriented, and group the primary read action, GitHub source and related knowledge bases without adding dead links.

- [ ] **Step 2: Strengthen the README hero**

  Preserve the existing first-line `# FDE 知识库`; keep the existing description and links, but add compact labels/stat blocks and a clearer first-screen action hierarchy using existing `.hero-actions` and new semantic classes only.

- [ ] **Step 3: Make the knowledge map scannable**

  Keep the existing course links and four-week path; add visual grouping for “从这里开始”, core tracks, interview practice, field cases, concept courses and templates through HTML blocks/classes that remain valid Markdown.

- [ ] **Step 4: Keep content semantics intact**

  Verify no existing course URL, anchor target, heading text or donation/support content is removed; the title remains the first line of the relevant Markdown body.

### Task 4: Browser verification and regression pass

**Files:**
- Test: `index.html`, `assets/custom.css`, `_coverpage.md`, `README.md` through a local static server and browser.

**Interfaces:**
- Verifies the production-like static route behavior rather than only source syntax.

- [ ] **Step 1: Start a local static server**

  Serve the repository root with an available static server, then open the root route and a deep route in a real browser.

- [ ] **Step 2: Verify desktop flows**

  Check cover → homepage → deep article → back, sidebar active state, search results, pagination, top progress, back-to-top and theme toggle. Confirm the README first line renders as the page’s main title.

- [ ] **Step 3: Verify content rendering**

  Open one Mermaid/KaTeX page and one code/table-heavy page; confirm no horizontal overflow outside the intended scroll containers and no broken plugin output.

- [ ] **Step 4: Verify mobile flows**

  Use a 390px viewport to verify sidebar open/close, search, card stacking, code/table scrolling, readable title sizes and no clipped controls.

- [ ] **Step 5: Inspect the final diff**

  Run `git diff --stat`, `git diff -- index.html assets/custom.css _coverpage.md README.md`, and `git status --short`; confirm only the intended frontend files plus the design/plan docs changed from this task, while pre-existing user modifications remain untouched.

