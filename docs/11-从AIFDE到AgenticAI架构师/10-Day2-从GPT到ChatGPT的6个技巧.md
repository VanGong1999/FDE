# Day 2 · 从 GPT 到 ChatGPT：6 个技巧、Token、上下文窗口与 API 成本

一句话总结：AI 产品 = 三层栈；从底层「统计 token 预测器」到「类人的 ChatGPT」靠 6 个技巧；理解 token/窗口/成本后，**先求准确、再谈效率**。

## AI 产品的三层结构

| 层 | 是什么 | 例子 |
|----|--------|------|
| 底层：大语言模型 | 统计模式匹配器（statistical pattern matcher），「打了激素的预测文本」（predictive text on steroids） | GPT、Claude、Gemini |
| 中层：推理软件（inference） | 反复运行 LLM 生成类人输出的软件 | OpenAI API（chat completions / responses）、AWS Bedrock、OpenRouter |
| 顶层：产品 | 利用推理技术向消费者/企业提供服务的端到端应用 | ChatGPT、Claude Code、Atlassian Rovo、Duolingo Premium |

> 关键观点：大多数人讲 LLM 只盯着底层（self-attention、向量嵌入…），但**理解如何应用 LLM 解决商业问题，最重要的是理解「软件层 + 产品层」带来的额外价值**——这正是从 GPT 到 ChatGPT 的跨越。

## 从 GPT 到 ChatGPT 的 6 个技巧

1. **Auto-regression（自回归）**
   - LLM 只做一件事：给定输入序列，预测下一个最可能的 token（或给出全词表概率分布），选最可能的/采样一个，再带着它重跑。
   - 在 tight loop 里反复调用 → 逐 token 输出 → 就是 ChatGPT 的「打字机动画」。
   - LLM 只生成「下一个 token」，但放进循环就能生成一页页内容。

2. **Chat（聊天）**
   - 训练方式：在预训练后用 `user / assistant` 交替结构的对话数据再训练，配合 **RLHF**（Reinforcement Learning from Human Feedback）。
   - 突破点（约 2022 年末 → ChatGPT 诞生）：之前 GPT-3 你问「法国首都是哪？」它会接着「预测」出另一个问题（因为它只预测最可能的后续文本），而不是回答。
   - Chat 训练后，问「法国首都是哪？」→ 直接回答「巴黎」。

3. **Reasoning（推理）**
   - 起源：早期发现「在 prompt 末尾加 *please think step by step*」会让模型先生成中间推理 token，再给最终答案，**结果更准**。
   - 训练手段：**RLVR**（Reinforcement Learning with Verifiable Rewards，带可验证奖励的强化学习），区别于第 2 条的 RLHF。
   - 始于 **o1（2024 年末）**，此后越来越好。
   - 现代模型可选 **reasoning level（推理档位）**，越高越准。
   - 讲师感慨：本质仍是「预测最可能的下一个 token」，却能因此大幅变准，非常反直觉。

4. **Illusion of Memory（记忆错觉）**
   - LLM **完全无状态**（stateless），不知道你是谁，只是个 token 预测计算器。
   - 每次调用都**把整段历史传进去**（自我介绍 + 回答 + 你最喜欢的水果 + 回答…），于是它能「回忆」起你的名字和喜好——纯属把戏。

5. **Context（上下文）**
   - 输入里不止放对话历史，还可放入数据库查出的背景信息（常用 **RAG**）。
   - 效果：让 LLM「看起来有知识和经验」，因为你把知识/经验塞进了输入 prompt。

6. **Tool Calling（工具调用）**
   - 给「只会预测 token 的计算器」额外能力：搜索、跑代码、查数据库。
   - 是 agentic AI 的核心；具体机制后面细讲。

## 关键定义

| 术语 | 定义 |
|------|------|
| **Token** | 把语言送入 LLM 的粒度单位，一次几个字母（有时整词/多词）。~**1000 token ≈ 750 词**（英文散文均值） |
| **Input tokens（输入 token）** | 送入 LLM 的全部输入 = system prompt（定角色/风格/可用工具）+ 对话历史 + user prompt（要回应的消息）+ 相关 context |
| **Output tokens（输出 token）** | LLM 逐 token 生成的输出（每次先给概率分布，由推理逻辑挑选） |
| **Context window（上下文窗口）** | 单次能处理的「输入 + 输出」token 上限，超了直接失败 |
| **Compacting（压缩）** | 产品（如 Claude Code）在历史太长时自动把对话改写成更简洁形式以腾出空间 |

## Token 演进（补充）

- 曾逐字母送入 → 效果差；逐词（配词典/vocab）→ 也差；现在用「几个字母一块」的 token 效果最好。

## API 成本与常见误解

### 计费方式
- 通常按 **input token 与 output token 分开计费**，output 一般更贵。

### Prompt Caching（提示缓存）
- 短时间内**连续调用且输入前缀相同**时，第二次起对公共前缀收费更低（常 **4 倍便宜**）。
- 对 Claude Code 这类反复追加调用的场景很划算。
- 约 **1 小时**不调用会重置缓存，恢复全额计费。

### 成本优化的正确顺序（重要）
- **先求准确（accuracy），再谈效率（efficiency）**。
- 引用 Donald Knuth 名言：**「过早优化是万恶之源」（Premature optimization is the root of all evil）**。
- 若先纠结省 prompt，可能错失「换更便宜模型」这种对价格影响大得多的机会。
- 始终以**商业目标（commercial objective）**为第一优先级。

### 误区：「开源模型 = 免费」
- **不是**。开源模型通常很大，涉及数万亿次计算，有人要付电费；在 OpenRouter 上除免费模型外开源模型也要收费。
- 免费模型 = 较小模型 + **你的数据会被用于训练**（以此「赞助」电费）。
- 本地跑开源模型也不免费：付电费 + 电脑硬件成本（能跑大模型的电脑很贵）。
- 结论：**没有免费的午餐**，做数万亿次计算总得有人付钱。
