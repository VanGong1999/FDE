# Day 1 · 本地运行 Maze Agent 与 API 成本规划

一句话总结：在 VS Code 本地跑通与 Colab 相同的迷宫实验，从零用朴素 LLM 调用搭出 mini agent harness（含 guardrail），并规划课程 API 预算。

## 运行 Lab（setup/setup.ipynb）

1. 打开 `setup/setup.ipynb`。
2. **选 kernel**：点 Select Kernel → Python environments → 选带星标的 **`undercover 3.12.12`**（即 `.venv` 里的 Python 3.12.12）。右上角显示 `undercover 3.12.12` 才算选对。
3. cell 里 `Shift+Enter` 运行；出现 import error 通常是 **kernel 选错**。
4. 出现 **NameError**（`something isn't defined`）= 没按顺序跑完前面的 cell。**执行顺序比 cell 在文件里的位置更重要**。

## 核心代码结构（从零搭 mini agent）

### 1. `read_web_page(url)` + guardrail
- 读取 URL 内容。
- 带一个类似 guardrail 的校验：**只允许读 `maze.edwarddonner.com`** 的页面，其它 URL 一律拒绝（`"this tool can only be used to read pages in the maze"`）。

### 2. 工具调用（Tool Calling）三步
- 把函数用 **JSON 描述成 tool** 提供给 LLM。
- 写 `handle_tool_call` 处理 LLM 的工具调用请求。
- LLM 看到「read maze.edwarddonner.com」时会返回一个 function tool call（调用 `read_web_page`），我们再带着结果二次调用 LLM。

### 3. `run_agent` 循环
- 系统提示：「You are an agent solving a puzzle. Look at this web page...」
- 在 **最多 25 次**的循环里调用免费 LLM，逐步穿越迷宫（每个链接是迷宫的一个位置，碰到死胡同会回溯）。
- 最终到达出口，收到消息：「Welcome to the start of the course. Prepare for three intensive weeks ahead.」

## 本次 Lab 的意义

- 证明环境搭好、OpenRouter key 可用。
- 演示**只用 vanilla LLM 调用（不用 agent 框架）+ 一个 guardrail** 就能从零搭出一个 mini agent harness。
- 惊叹点：**LLM 仅靠聪明的 prompt 就能变成 agent**。

## 学完后如何定位自己

- **完全懵/跟丢** → 建议先修前置课程 1、2。
- **还行但想真正搞懂工具调用原理** → 看课程 4（AI Engineer Core Track）或 Agentic Track。
- **轻松/很简单** → 可倍速，后面几天是速成复习。

## API 成本规划（高频问题）

| 档位 | 花费 | 说明 |
|------|------|------|
| 典型 | **~$10** | 对前沿模型做常规 API 调用获得好结果 |
| 免费 | **$0** | 全程有 free options（`openrouter/free`），从不强制花钱 |
| 进阶 | **$20+** | 跑大批实验、在 AWS 上做较大部署、试用大量模型 |

- 讲师强调「**不需要花一分钱**」，有疑问可发 Udemy 问他，保证给免费替代方案。
- 三周里第一周 Day 1 最长，后面会短。

## 互动

- 有问题随时 Udemy / 邮件（讲师本人回，不是 agent）。
- LinkedIn 建议 connect/follow（直接消息可能收不到，用邮件/Udemy 更稳）。
- 可在 LinkedIn 发学习日记、晒成果并 tag 讲师，讲师会评论放大曝光。

> 完成 Week 1 Day 1 = 课程进度 **7%**。
