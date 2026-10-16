# 33 · Agent Harness 图册（全量）

> 本页收录 Agent Harness 全部 **62** 张图，存放于 [`docs/assets/agent-harness/`](../../assets/agent-harness/)（URL 安全 slug）。
> 原始中文文件名见各图下方标注，以及同目录 [`catalog.json`](../../assets/agent-harness/catalog.json)。

配套正文：[32-Agent-Harness开源实践对照.md](./32-Agent-Harness开源实践对照.md)

---

## 一、Agent 循环与消息记忆

### gen-03-hermes-compression-failure.png

**Hermes 压缩失败处理：允许失败，绝不允许循环**

![Hermes 压缩失败处理：允许失败，绝不允许循环](../../assets/agent-harness/gen-03-hermes-compression-failure.png)

<small>原始文件名：`生成图片及翻译 (3).png`</small>

---

### gen-08-pi-estimate-no-usage.png

**Pi 如何估算没有用量数据的消息（字符/4、工具、图片4800）**

![Pi 如何估算没有用量数据的消息（字符/4、工具、图片4800）](../../assets/agent-harness/gen-08-pi-estimate-no-usage.png)

<small>原始文件名：`生成图片及翻译 (8).png`</small>

---

### gen-36.png

**同一个循环四种名字：Pi runLoop / Hermes run_conversation / Codex run_turn / Claude query**

![同一个循环四种名字：Pi runLoop / Hermes run_conversation / Codex run_turn / Claude query](../../assets/agent-harness/gen-36.png)

<small>原始文件名：`生成图片及翻译 (36).png`</small>

---

### gen-38.png

**RunLoop 的一圈：stream → tool calls → execute → append → repeat**

![RunLoop 的一圈：stream → tool calls → execute → append → repeat](../../assets/agent-harness/gen-38.png)

<small>原始文件名：`生成图片及翻译 (38).png`</small>

---

### draw-00-agent-loop-reasoning.png

**循环的推导过程：调用模型 → 工具？→ 执行 → 追加 → 再循环**

![循环的推导过程：调用模型 → 工具？→ 执行 → 追加 → 再循环](../../assets/agent-harness/draw-00-agent-loop-reasoning.png)

<small>原始文件名：`绘制图片.png`</small>

---

### draw-02-three-roles-growing-list.png

**三种角色，一张不断增长的列表 = 智能体全部记忆**

![三种角色，一张不断增长的列表 = 智能体全部记忆](../../assets/agent-harness/draw-02-three-roles-growing-list.png)

<small>原始文件名：`绘制图片 (2).png`</small>

---

### draw-03-call-exec-append-quadratic.png

**一回合=调用+执行+追加；第N回合重放前史 → 成本二次增长**

![一回合=调用+执行+追加；第N回合重放前史 → 成本二次增长](../../assets/agent-harness/draw-03-call-exec-append-quadratic.png)

<small>原始文件名：`绘制图片 (3).png`</small>

---

### draw-04-pi-native-toolbox.png

**Pi 原生工具盒：七个内置动词 + MCP 对等接入**

![Pi 原生工具盒：七个内置动词 + MCP 对等接入](../../assets/agent-harness/draw-04-pi-native-toolbox.png)

<small>原始文件名：`绘制图片 (4).png`</small>

---

### draw-05-tool-as-job-posting.png

**工具就是招聘启事：模型只看 schema，代码在幕布之后**

![工具就是招聘启事：模型只看 schema，代码在幕布之后](../../assets/agent-harness/draw-05-tool-as-job-posting.png)

<small>原始文件名：`绘制图片 (5).png`</small>

---

### draw-09-permission-gate-in-loop.png

**接入循环的许可门：安全工具自由跑，危险工具先敲门**

![接入循环的许可门：安全工具自由跑，危险工具先敲门](../../assets/agent-harness/draw-09-permission-gate-in-loop.png)

<small>原始文件名：`绘制图片 (9).png`</small>

---

### draw-21.png

**关于同一条消息的两个问题：可否截断 vs 是否开启轮次**

![关于同一条消息的两个问题：可否截断 vs 是否开启轮次](../../assets/agent-harness/draw-21.png)

<small>原始文件名：`绘制图片 (21).png`</small>

---

## 二、上下文 Loop 压缩

### gen-01-hermes-summary-11-sections.png

**Hermes 摘要始终包含的 11 个固定部分**

![Hermes 摘要始终包含的 11 个固定部分](../../assets/agent-harness/gen-01-hermes-summary-11-sections.png)

<small>原始文件名：`生成图片及翻译 (1).png`</small>

---

### gen-00-hermes-e2e-compression.png

**Hermes 端到端压缩：四个廉价步骤围绕一个昂贵步骤**

![Hermes 端到端压缩：四个廉价步骤围绕一个昂贵步骤](../../assets/agent-harness/gen-00-hermes-e2e-compression.png)

<small>原始文件名：`生成图片及翻译.png`</small>

---

### gen-02-micro-compression-cursor.png

**单次微压缩：滚动摘要 + 光标，账单分期而非一次大额停顿**

![单次微压缩：滚动摘要 + 光标，账单分期而非一次大额停顿](../../assets/agent-harness/gen-02-micro-compression-cursor.png)

<small>原始文件名：`生成图片及翻译 (2).png`</small>

---

### gen-04-pi-vs-hermes-reserve.png

**两种决策时机：Pi 固定保留 16384；Hermes 按比例保留**

![两种决策时机：Pi 固定保留 16384；Hermes 按比例保留](../../assets/agent-harness/gen-04-pi-vs-hermes-reserve.png)

<small>原始文件名：`生成图片及翻译 (4).png`</small>

---

### gen-06-two-rhythms.png

**两种节奏：一次长暂停 vs 多次短暂停（微压缩）**

![两种节奏：一次长暂停 vs 多次短暂停（微压缩）](../../assets/agent-harness/gen-06-two-rhythms.png)

<small>原始文件名：`生成图片及翻译 (6).png`</small>

---

### gen-07-hermes-trust-provider-tokens.png

**Hermes 更信任服务商返回的真实 token，而非自身猜测**

![Hermes 更信任服务商返回的真实 token，而非自身猜测](../../assets/agent-harness/gen-07-hermes-trust-provider-tokens.png)

<small>原始文件名：`生成图片及翻译 (7).png`</small>

---

### gen-09-pi-token-sources.png

**Pi 从哪里获取 token：精确值 + 尾部估算**

![Pi 从哪里获取 token：精确值 + 尾部估算](../../assets/agent-harness/gen-09-pi-token-sources.png)

<small>原始文件名：`生成图片及翻译 (9).png`</small>

---

### gen-32.png

**有限上下文三种答案：压缩保留摘要 / 交接保留目标 / 子代理仅保留答案**

![有限上下文三种答案：压缩保留摘要 / 交接保留目标 / 子代理仅保留答案](../../assets/agent-harness/gen-32.png)

<small>原始文件名：`生成图片及翻译 (32).png`</small>

---

### gen-37.png

**压缩时机：Hermes/Codex 调用前检查 vs Pi 溢出后恢复**

![压缩时机：Hermes/Codex 调用前检查 vs Pi 溢出后恢复](../../assets/agent-harness/gen-37.png)

<small>原始文件名：`生成图片及翻译 (37).png`</small>

---

### draw-19.png

**Pi 何时压缩：contextTokens > window - 16384**

![Pi 何时压缩：contextTokens > window - 16384](../../assets/agent-harness/draw-19.png)

<small>原始文件名：`绘制图片 (19).png`</small>

---

### draw-20.png

**反向查找截断点：从最新回溯累加至 keepRecentTokens=20000**

![反向查找截断点：从最新回溯累加至 keepRecentTokens=20000](../../assets/agent-harness/draw-20.png)

<small>原始文件名：`绘制图片 (20).png`</small>

---

### draw-22.png

**头中尾压缩：保护头尾，只总结中部；尾部约占触发内容 20%**

![头中尾压缩：保护头尾，只总结中部；尾部约占触发内容 20%](../../assets/agent-harness/draw-22.png)

<small>原始文件名：`绘制图片 (22).png`</small>

---

## 三、记忆形态：Pi / Hermes / OpenClaw

### gen-05-two-memory-forms.png

**两种记忆形态：Pi 6 部分 vs Hermes 11 部分**

![两种记忆形态：Pi 6 部分 vs Hermes 11 部分](../../assets/agent-harness/gen-05-two-memory-forms.png)

<small>原始文件名：`生成图片及翻译 (5).png`</small>

---

### gen-10-hermes-memory-user-files.png

**Hermes 两个由代理写入的存储文件：MEMORY.md 与 USER.md**

![Hermes 两个由代理写入的存储文件：MEMORY.md 与 USER.md](../../assets/agent-harness/gen-10-hermes-memory-user-files.png)

<small>原始文件名：`生成图片及翻译 (10).png`</small>

---

### gen-11-memory-tool-crud.png

**记忆工具三件事：添加 / 替换 / 删除（短子串匹配）**

![记忆工具三件事：添加 / 替换 / 删除（短子串匹配）](../../assets/agent-harness/gen-11-memory-tool-crud.png)

<small>原始文件名：`生成图片及翻译 (11).png`</small>

---

### gen-12-hermes-post-turn-review.png

**Hermes 复盘自己的回合：后台 fork，不碰对话缓存**

![Hermes 复盘自己的回合：后台 fork，不碰对话缓存](../../assets/agent-harness/gen-12-hermes-post-turn-review.png)

<small>原始文件名：`生成图片及翻译 (12).png`</small>

---

### gen-13.png

**将刚发生的事转化为技能：/learn → 新 SKILL.md（描述≤60字符）**

![将刚发生的事转化为技能：/learn → 新 SKILL.md（描述≤60字符）](../../assets/agent-harness/gen-13.png)

<small>原始文件名：`生成图片及翻译 (13).png`</small>

---

### gen-15-notes-lifecycle-prune.png

**旧笔记定期整理：7天复盘 / 30天陈旧 / 90天归档**

![旧笔记定期整理：7天复盘 / 30天陈旧 / 90天归档](../../assets/agent-harness/gen-15-notes-lifecycle-prune.png)

<small>原始文件名：`生成图片及翻译 (15).png`</small>

---

### gen-16.png

**谁负责写入记忆：Pi 手动 / Hermes 自动复盘 / OpenClaw 后台扫描**

![谁负责写入记忆：Pi 手动 / Hermes 自动复盘 / OpenClaw 后台扫描](../../assets/agent-harness/gen-16.png)

<small>原始文件名：`生成图片及翻译 (16).png`</small>

---

### gen-17.png

**同一思路三层级：Pi→Hermes→OpenClaw（召回↑，复杂度↑）**

![同一思路三层级：Pi→Hermes→OpenClaw（召回↑，复杂度↑）](../../assets/agent-harness/gen-17.png)

<small>原始文件名：`生成图片及翻译 (17).png`</small>

---

### gen-18-three-memory-shapes.png

**记忆的三种形态：Pi / Hermes / OpenClaw**

![记忆的三种形态：Pi / Hermes / OpenClaw](../../assets/agent-harness/gen-18-three-memory-shapes.png)

<small>原始文件名：`生成图片及翻译 (18).png`</small>

---

## 四、子 Agent 编排与对照

### gen-19.png

**任务过大时三种答案：子代理 / 接力 / 编排器 fleet**

![任务过大时三种答案：子代理 / 接力 / 编排器 fleet](../../assets/agent-harness/gen-19.png)

<small>原始文件名：`生成图片及翻译 (19).png`</small>

---

### gen-20-where-subagents-run.png

**子进程运行在哪里：Pi/Hermes/Codex/Claude Code 隔离边界**

![子进程运行在哪里：Pi/Hermes/Codex/Claude Code 隔离边界](../../assets/agent-harness/gen-20-where-subagents-run.png)

<small>原始文件名：`生成图片及翻译 (20).png`</small>

---

### gen-21.png

**子代理工具三种模式：single / parallel / chain**

![子代理工具三种模式：single / parallel / chain](../../assets/agent-harness/gen-21.png)

<small>原始文件名：`生成图片及翻译 (21).png`</small>

---

### gen-22.png

**子代理工具三种模式（与 gen-21 同主题变体）**

![子代理工具三种模式（与 gen-21 同主题变体）](../../assets/agent-harness/gen-22.png)

<small>原始文件名：`生成图片及翻译 (22).png`</small>

---

### gen-23.png

**角色文件成为隔离子进程：父进程只收结果**

![角色文件成为隔离子进程：父进程只收结果](../../assets/agent-harness/gen-23.png)

<small>原始文件名：`生成图片及翻译 (23).png`</small>

---

### gen-24.png

**implement 预设：侦察→规划→执行（独立进程，{previous} 传递）**

![implement 预设：侦察→规划→执行（独立进程，{previous} 传递）](../../assets/agent-harness/gen-24.png)

<small>原始文件名：`生成图片及翻译 (24).png`</small>

---

### gen-25.png

**子进程运行在哪里（与 gen-20 同主题变体）**

![子进程运行在哪里（与 gen-20 同主题变体）](../../assets/agent-harness/gen-25.png)

<small>原始文件名：`生成图片及翻译 (25).png`</small>

---

### gen-26.png

**子进程定义存放位置：Pi YAML / Hermes 枚举 / Codex 配置层 / Claude 大 frontmatter**

![子进程定义存放位置：Pi YAML / Hermes 枚举 / Codex 配置层 / Claude 大 frontmatter](../../assets/agent-harness/gen-26.png)

<small>原始文件名：`生成图片及翻译 (26).png`</small>

---

### gen-27.png

**阻塞还是后台：Pi/Codex 阻塞等待 vs Hermes/Claude Code 后台**

![阻塞还是后台：Pi/Codex 阻塞等待 vs Hermes/Claude Code 后台](../../assets/agent-harness/gen-27.png)

<small>原始文件名：`生成图片及翻译 (27).png`</small>

---

### gen-28.png

**阻塞还是后台（与 gen-27 同主题变体）**

![阻塞还是后台（与 gen-27 同主题变体）](../../assets/agent-harness/gen-28.png)

<small>原始文件名：`生成图片及翻译 (28).png`</small>

---

### gen-29.png

**Pi 将委托能力排除在核心之外：subagent 仅为示例扩展**

![Pi 将委托能力排除在核心之外：subagent 仅为示例扩展](../../assets/agent-harness/gen-29.png)

<small>原始文件名：`生成图片及翻译 (29).png`</small>

---

### gen-30.png

**答案回传的接缝：子代理输出→父上下文的守卫边界**

![答案回传的接缝：子代理输出→父上下文的守卫边界](../../assets/agent-harness/gen-30.png)

<small>原始文件名：`生成图片及翻译 (30).png`</small>

---

### gen-31.png

**编排器驱动 N 个 Pi 实例（实验性）：1 编排器对 N 目标**

![编排器驱动 N 个 Pi 实例（实验性）：1 编排器对 N 目标](../../assets/agent-harness/gen-31.png)

<small>原始文件名：`生成图片及翻译 (31).png`</small>

---

### gen-33.png

**任务过大三种规模答案：子进程 / 交接 / 编排器集群**

![任务过大三种规模答案：子进程 / 交接 / 编排器集群](../../assets/agent-harness/gen-33.png)

<small>原始文件名：`生成图片及翻译 (33).png`</small>

---

## 五、许可门、沙箱与权限集合

### gen-39.png

**四套集合交叉才允许工具调用：用户权限×能力清单×策略×ACL**

![四套集合交叉才允许工具调用：用户权限×能力清单×策略×ACL](../../assets/agent-harness/gen-39.png)

<small>原始文件名：`生成图片及翻译 (39).png`</small>

---

### draw-06.png

**许可门：Allow / Ask / Deny 三结果**

![许可门：Allow / Ask / Deny 三结果](../../assets/agent-harness/draw-06.png)

<small>原始文件名：`绘制图片 (6).png`</small>

---

### draw-07.png

**相同工具三个运行位置：本地 / SSH / 沙箱（操作槽抽象）**

![相同工具三个运行位置：本地 / SSH / 沙箱（操作槽抽象）](../../assets/agent-harness/draw-07.png)

<small>原始文件名：`绘制图片 (7).png`</small>

---

### draw-08.png

**两层防御：许可门降低出事概率 + 沙箱限制破坏程度**

![两层防御：许可门降低出事概率 + 沙箱限制破坏程度](../../assets/agent-harness/draw-08.png)

<small>原始文件名：`绘制图片 (8).png`</small>

---

### draw-13.png

**给予多少自由度：窄桥精确脚本 vs 旷野给目标**

![给予多少自由度：窄桥精确脚本 vs 旷野给目标](../../assets/agent-harness/draw-13.png)

<small>原始文件名：`绘制图片 (13).png`</small>

---

## 六、SKILL、提示组装与校验闭环

### gen-14.png

**将刚发生的事转化为技能（与 gen-13 同主题变体）**

![将刚发生的事转化为技能（与 gen-13 同主题变体）](../../assets/agent-harness/gen-14.png)

<small>原始文件名：`生成图片及翻译 (14).png`</small>

---

### draw-10.png

**buildSystemPrompt() 按序组装五段内容**

![buildSystemPrompt() 按序组装五段内容](../../assets/agent-harness/draw-10.png)

<small>原始文件名：`绘制图片 (10).png`</small>

---

### draw-11.png

**AGENTS.md 向上查找：global first，最近者最后生效**

![AGENTS.md 向上查找：global first，最近者最后生效](../../assets/agent-harness/draw-11.png)

<small>原始文件名：`绘制图片 (11).png`</small>

---

### draw-12.png

**技能分三批付费：名称描述常驻 → 正文触发时 → 附属文件打开时**

![技能分三批付费：名称描述常驻 → 正文触发时 → 附属文件打开时](../../assets/agent-harness/draw-12.png)

<small>原始文件名：`绘制图片 (12).png`</small>

---

### draw-14.png

**让技能检查自身输出：修改→验证→修复，通过才继续**

![让技能检查自身输出：修改→验证→修复，通过才继续](../../assets/agent-harness/draw-14.png)

<small>原始文件名：`绘制图片 (14).png`</small>

---

### draw-15-what-is-skill-file.png

**技能文件是什么：frontmatter 常驻加载，正文按需加载**

![技能文件是什么：frontmatter 常驻加载，正文按需加载](../../assets/agent-harness/draw-15-what-is-skill-file.png)

<small>原始文件名：`绘制图片 (15).png`</small>

---

### draw-16.png

**相同模板三种组装结果：日期/上下文/技能会变**

![相同模板三种组装结果：日期/上下文/技能会变](../../assets/agent-harness/draw-16.png)

<small>原始文件名：`绘制图片 (16).png`</small>

---

### draw-17.png

**组装生成而非硬编码：极小固定身份 + 动态 AGENTS.md/日期/cwd**

![组装生成而非硬编码：极小固定身份 + 动态 AGENTS.md/日期/cwd](../../assets/agent-harness/draw-17.png)

<small>原始文件名：`绘制图片 (17).png`</small>

---

### draw-18.png

**组装生成而非硬编码（与 draw-17 同主题变体）**

![组装生成而非硬编码（与 draw-17 同主题变体）](../../assets/agent-harness/draw-18.png)

<small>原始文件名：`绘制图片 (18).png`</small>

---

## 七、持久化、回滚与可靠性

### gen-34.png

**进程结束时磁盘留下什么：Pi JSONL / Hermes state.db / Codex 文件+缓存 / Claude JSONL**

![进程结束时磁盘留下什么：Pi JSONL / Hermes state.db / Codex 文件+缓存 / Claude JSONL](../../assets/agent-harness/gen-34.png)

<small>原始文件名：`生成图片及翻译 (34).png`</small>

---

### gen-35.png

**无人兑现的票据：外套寄存式崩溃留下非法会话**

![无人兑现的票据：外套寄存式崩溃留下非法会话](../../assets/agent-harness/gen-35.png)

<small>原始文件名：`生成图片及翻译 (35).png`</small>

---
