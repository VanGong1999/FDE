# 32 · Agent Harness 开源实践对照（Pi / Hermes / OpenClaw / Codex / Claude Code）

## 一句话直觉

**Harness 不是又一个「Agent 框架 Demo」**——它是把「模型循环 + 工具执行 + 上下文压缩 + 安全边界 + 子代理编排」焊成可运营系统的工程壳。Pi / Hermes / OpenClaw 等开源项目用不同厚度的中间层，回答同一组生产问题。

> 图示已按主题散落到各概念课正文（循环→07、工具→08、窗口→13、多 Agent→09、记忆→11、沙箱→16、可靠性→23），本篇只保留**对照总表与开源研究文字**。资产目录：[`docs/assets/agent-harness/`](../../assets/agent-harness/)。

---

## 直觉讲解：什么是 Agent Harness

每个现代 Agent Harness 大致只有两类工具：

| 类别 | 含义 |
|------|------|
| **预置工具（Prebuilt）** | 随 harness 出厂：读文件、bash、grep、编辑等 |
| **外部工具（External）** | 设计时 / 运行时由用户或 MCP 接入，形态应与预置工具一致 |

工具对模型来说只是「招聘启事」：`name` / `label` / `description` / 参数 schema。真实实现永远在幕布之后。

**核心抽象**：把「执行 bash / 读写文件」收成统一插槽（如 Pi 的 `BashOperations`）。同一套工具定义，可插拔到本地子进程、SSH 远程、OS jail——上层 Agent 循环不用改。

图示与展开：[07-AI-Agent与工具使用](./07-AI-Agent与工具使用.md)（循环）、[08-工具与函数调用](./08-工具与函数调用.md)（招聘启事 / 工具盒 / 三运行位置）。

---

## 必收对照表：子 Agent 实现（Pi / Hermes / Codex / Claude Code）

> **这张表是本笔记的硬交付**：面试与选型时优先背它。配图在 [09-多Agent编排](./09-多Agent编排.md)。

| 对比项 | Pi | Hermes | Codex | Claude Code |
|--------|----|--------|-------|-------------|
| **模型可调用的工具** | `subagent`（单例 / 并行 / 链式） | `delegate_task` | `spawn_agent`、`wait_agent`、`send_message`、`followup_task`、`list_agents`、`interrupt_agent` | `Agent`（旧称 `Task`）+ `SendMessage` / `TaskStop` |
| **是否核心功能** | 否，示例扩展（符号链接引入） | 是 | 是 | 是 |
| **子进程本质** | **独立 OS 进程** | 同进程内 **线程** + `ContextVar` 隔离 | 进程内 **子会话** | 独立上下文的 agent；可选独立 **git worktree** |
| **定义存放位置** | `~/.pi/agent/agents/*.md`、`.pi/agents/*.md` | 无需写文件；`leaf` / `orchestrator` 枚举 | `[agents.<name>]` 配置层 | `.claude/agents/*.md`（大段 frontmatter） |
| **启动时装载** | 空上下文 + 角色提示词 | 空上下文 + 自动生成 brief | 空上下文，或 fork 最近 N 轮 | 空上下文 + `CLAUDE.md` + git 快照 |
| **子级工具是否更少** | 是（角色文件 `tools:`） | 否（继承父级，仅减五工具黑名单） | 否（与父级相同） | 是（`tools` / `disallowedTools`） |
| **并发数** | 同时 4，每次调用最多 8 | 3 | 每会话 4 | 20，每会话最多 200 |
| **嵌套深度** | 该扩展未设上限 | 1 | v1=1；v2 受 slot 限制 | 3 |
| **默认姿态** | **阻塞**父级工具调用 | **后台** | 父级 `wait_agent` 等待 | **后台** |
| **超时** | 无 | 默认无；用心跳过期 | 默认等 30s，最长 1h | 文档未说明 |
| **重启后存活** | 否 | 是（SQLite 投递表） | 是（rollout 重新水化） | 可按 `agentId` 恢复 |
| **如何观察** | 流式进父级 tool card | `tail -f` 子 agent 日志 | 事件转发 | Agent view |

**术语**：leaf / orchestrator；git worktree；rehydrated；slot-bounded。

---

## 开源项目研究笔记

### 1. Pi（coding-agent / pi-mono）

- **定位**：偏薄的编码 Agent harness；核心约 **7 个内置动词**，MCP 以对等插件接入。  
- **循环**：`runLoop` 约 **~120 行**。  
- **上下文**：固定预留 **16,384**；偏「溢出后恢复」；最近约 **20k** 逐词保留。  
- **Token 估算**：服务商精确 usage + 尾部字符/4（故意偏高 → 偏早压缩）。  
- **上下文文件**：`AGENTS.md` / `CLAUDE.md`，全局 + cwd 向上 walk，最近者最后生效。  
- **子代理**：`subagent` **非核心**（示例扩展）；single / parallel / chain。  
- **Checkpoint**：无影子 git / 无 undo。  
- **持久化**：每会话 **JSONL**。  

图示：[08](./08-工具与函数调用.md)、[13](./13-FDE-Agent上下文窗口管理.md)、[09](./09-多Agent编排.md)。

### 2. Hermes

- **定位**：更厚的会话运行时；`run_conversation` 可达数千行。  
- **压缩**：调用前检查预算；微压缩；四廉价步围绕「总结中部」；摘要固定 **11 段**；失败允许、循环禁止。  
- **记忆**：`MEMORY.md` + `USER.md`；回合后后台复盘，不碰提示缓存。  
- **Checkpoint**：影子 Git + `/rollback`。  
- **持久化**：`state.db`；子 agent 可 SQLite 投递表跨重启。  

图示：[13](./13-FDE-Agent上下文窗口管理.md)、[11](./11-Agent记忆.md)。

### 3. OpenClaw

- **定位**：自托管助手网关（MIT）；会话/策略/通道/状态自持；**harness 是可替换插件**。  
- **Harness**：一次已准备 agent turn 的底层执行器（非模型供应商、非 channel）。内置 runtime `openclaw`（历史别名 `pi` 归一）；Codex 等可注册插件 harness。  
- **记忆**：比 Pi/Hermes 更分层（含 daily notes / `DREAMS.md` 等）；代理写 + 后台扫描保留——**最强召回，也最需调优**。  

参考：[openclaw/openclaw](https://github.com/openclaw/openclaw)、[Agent harness plugins](https://docs.openclaw.ai/plugins/sdk-agent-harness)。图示：[11](./11-Agent记忆.md)。

### 4. Codex / Claude Code（对照锚点）

- **Codex**：子会话；压缩偏调用前检查；文件 undo 已移除。  
- **Claude Code**：每提示 checkpoint；bash/子代理编辑常不追踪。  

图示：[09](./09-多Agent编排.md)、[23](./23-Agent框架与失败模式.md)。

---

## 专题导读（图在对应篇里）

| 主题 | 去哪读（含图） |
|------|----------------|
| Agent 循环、SKILL、按需加载 | [07-AI-Agent与工具使用](./07-AI-Agent与工具使用.md) |
| 工具 schema、工具盒、本地/SSH/沙箱槽 | [08-工具与函数调用](./08-工具与函数调用.md) |
| Loop 压缩、token 估算、提示组装 | [13-FDE-Agent上下文窗口管理](./13-FDE-Agent上下文窗口管理.md) |
| 子 Agent / Recipe / fleet | [09-多Agent编排](./09-多Agent编排.md) |
| MEMORY/USER、写入权责、剪枝 | [11-Agent记忆](./11-Agent记忆.md) |
| Gate + Jail + 权限集合 | [16-Agent沙箱与执行隔离](../08-AI安全隐私与治理/16-Agent沙箱与执行隔离.md) |
| coat-check、磁盘持久化 | [23-Agent框架与失败模式](./23-Agent框架与失败模式.md) |

---

## 上下文压缩要点（文字）

```python
effective_window = context_length - (max_tokens or 0)
# Hermes：阈值≈50%，保底64k；小窗≥75%；冲突时85%
```

口条：**压缩留摘要，交接留目标，子代理只留答案。** 展开与图见 [13](./13-FDE-Agent上下文窗口管理.md)。

---

## 安全要点（文字）

| 层 | 职责 |
|----|------|
| Permission Gate | 降低危险事件**概率** |
| OS Jail | 限制漏网**爆炸半径** |
| Path Jail | `realpath` 挡目录穿越 |

口条：网关管放行，沙箱管坏多大。展开与图见 [16](../08-AI安全隐私与治理/16-Agent沙箱与执行隔离.md)。

---

## FDE 现场怎么用

1. **选型**：要 OS 隔离 → Pi 式子进程；要持久后台 → Hermes/Claude；接 OpenClaw 网关 → harness 当插件。  
2. **安全**：Gate + Jail 写进 SOW。  
3. **窗口**：先定留摘要 / 目标 / 答案，再谈阈值。  
4. **多 Agent**：先画 recipe，父进程只收结果。  
5. **可靠性**：tool call 与 result 成对落盘。  

### 面试 60 秒

「Harness 是循环、工具槽、压缩、安全与子代理的工程壳。Pi 薄循环+固定预留+示例 subagent；Hermes 厚中间层+微压缩+影子 checkpoint；OpenClaw 把 harness 当可插拔 runtime。子进程边界决定能访问什么。」

---

## 与本库其他篇的链接

- 见上表「专题导读」  
- 落地：[Agent与工具调用](../../03-AI落地/Agent与工具调用.md) · **[Agent开发工程经验](../../03-AI落地/Agent开发工程经验.md)**（按图意整理的纯文字工程手册）  
- 原始笔记：[`pictures/notes.md`](../../../pictures/notes.md)

---

## 参考与来源

- 用户笔记：`pictures/notes.md`  
- 图示资产：[`docs/assets/agent-harness/`](../../assets/agent-harness/)（`catalog.json` 映射原始文件名）  
- Pi：`BashOperations` / `AGENTS.md`；OpenClaw 官方 harness / runtime 文档  
- 提醒：开源迭代快，表格强调可迁移取舍，不以冻结行数为准
