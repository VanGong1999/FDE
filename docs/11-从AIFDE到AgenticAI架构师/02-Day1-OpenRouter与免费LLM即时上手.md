# Day 1 · OpenRouter 与免费 LLM 即时上手（Instant Gratification）

一句话总结：不讲 housekeeping，直接用 Google Colab + OpenRouter 免费模型跑通第一个 LLM 调用，建立对「harness（线束）」的直觉。

## 这门课的两个要点（开篇）

1. 这是讲师做过「最重要的一门课」。
2. 内容全是 AI 当下最迷人的东西：harness engineering、local inference、agent fleets & swarms、recursive self-improvement。

## 就业市场数字（开篇强调）

- 该领域目前约 **30,000 个职位空缺**。
- 底薪最高 **$400,000/年**；资深顶级表现者含股权可达 **$100 万+/年**。

## 核心概念：什么是 Harness（线束）

- **Harness / Harness Engineering** 是当下 buzzword，后续会大量覆盖。
- 本实验目的是建立直觉：**当把 LLM 和 AI 放进一个 harness（脚手架）时，发生了什么**。
- Harness = 围绕 LLM 搭建的脚手架，让它从「生成内容」变成「能分析、探索、解决问题、独立工作」的 agent。

## 实验流程（Google Colab + OpenRouter）

### 第一步：创建 OpenRouter 账户
- OpenRouter 是「通过 API 访问众多大模型的统一接口」，`openrouter.ai`。
- 关键优势：**可以免费使用免费模型（free models）**。

### 第二步：开启免费模型（隐私开关）
在 Preferences → Privacy 里，**两个开关都要打开**：
1. `Allow free endpoints that train on request data`（允许用请求数据训练的免费端点）
2. `Allow free endpoints that publish prompts`（允许发布 prompt 的免费端点）

> 因为要用免费模型，这两个必须开（意味着接受数据被用于训练/发布）。

### 第三步：创建 API Key
- API Keys → New Key，命名随意（如 `FDE course`）。
- 可选过期时间（通常 Never）、信用额度（可设 daily cap，如 $5/天上限，或 no limit）。
- 生成的 key 开头必须是 **`sk-or-v1`**（所有 OpenRouter key 的固定前缀）。
- **务必完整复制并妥善保存**；key 会在多处使用（今天末尾和 .env 都会用）。

### 第四步：把 key 加进 Colab 的 Secret
- Colab 侧边栏钥匙按钮 → Add new secret。
- Secret 名必须精确拼写为 **`OPENROUTER_API_KEY`**（全大写 + 下划线，Open Router ≠ Open Rura）。
- Value 粘贴刚复制的 key。
- 粘贴快捷键：Mac `Command+V`，PC `Ctrl+V`。

### 第五步：运行代码
- 在 cell 里点一下，`Shift+Enter` 运行。
- 代码用 **OpenAI Python 客户端库**连接 OpenRouter（传入 OpenRouter 的 URL 和 key），但实际连的是 OpenRouter。
- 校验 cell 会读入 secret 并检查 key 是否以 `sk-or-v1` 开头。
- 第一条消息 `"hi there"` → 模型用 **`openrouter/free`**（含义：让 OpenRouter 自己挑一个免费模型）。
  - 实际回答的免费模型可能是 NVIDIA 的 **Nematron 3.5 Lightning Free**（后文另一次是 Nematron 3 Ultra）。

## 关键认知

- `openrouter/free` 是一种「路由到任意免费模型」的写法。
- 全程**不花一分钱**（免费模型）。
- 本实验 = 用最朴素的 LLM 调用搭建一个带 guardrail 的 mini agent harness 的雏形。
