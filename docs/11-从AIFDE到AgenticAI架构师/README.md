# 从 AI FDE 到 Agentic AI 架构师：课程录音整理

本目录是 B 站课程《从 AI FDE 到 Agentic AI 架构师：把智能体真正落地到业务现场》（BV1XYnF6GEjD）Day 1 + Day 2 的录音稿整理笔记。讲师为 **Ed Donner**（Nebula.io 联合创始人兼 CTO，前 JP Morgan 董事总经理，Udemy 百万学员级 AI 课程作者）。

## 课程链接

- **B 站课程**：[从 AI FDE 到 Agentic AI 架构师：把智能体真正落地到业务现场](https://www.bilibili.com/video/BV1XYnF6GEjD/)
- 完整链接（含来源参数）：<https://www.bilibili.com/video/BV1XYnF6GEjD/?spm_id_from=333.337.search-card.all.click&vd_source=c9ff634ae673bbd311926a353b26d3b5>

> 说明：原始录音稿为双语（英文原文 + 机器翻译中文），本笔记已提炼为结构化中文笔记，**保留全部知识点与关键数字**，不逐句照搬。

## 课程主线：三周成为 AI FDE

| 周 | 主题 | 核心内容 | 对应技能 |
|----|------|---------|---------|
| Week 1 | 成为 AI 工程师 | 前沿模型、Agent、Coding Agent、ADLC、开源/本地模型、Harness Engineering | AI Engineering |
| Week 2 | 成为 AI 架构师 | Evals、可观测性、Durable State、Human-in-the-loop、Agentic RAG、MCP、Agent 团队/蜂群/舰队、递归自我改进 | AI Architecture |
| Week 3 | 成为 AI FDE | 解决方案架构、安全护栏、负责任 AI、API 网关、企业上下文层、部署到生产、Capstone | Forward Deployed Engineering |

**一句话理解 FDE**：FDE = 面向客户/现场的 AI 解决方案架构师（AI Solutions Architect 的新叫法），源头是 Palantir（2006-2007 由 CTO 造词），2025-2026 被 OpenAI 重新启用。

## 笔记索引

### Day 1（Week 1 Day 1）

| # | 主题 | 文件 |
|---|------|------|
| 01 | 课程简介与三周总览 | [01-课程简介与三周总览.md](./01-课程简介与三周总览.md) |
| 02 | OpenRouter 与免费 LLM 即时上手（Instant Gratification） | [02-Day1-OpenRouter与免费LLM即时上手.md](./02-Day1-OpenRouter与免费LLM即时上手.md) |
| 03 | 三周路线图：从 AI 工程师到 AI 架构师到 AI FDE | [03-Day1-三周路线图.md](./03-Day1-三周路线图.md) |
| 04 | 什么是 FDE（From Palantir to OpenAI） | [04-Day1-什么是FDE.md](./04-Day1-什么是FDE.md) |
| 05 | 成为 AI FDE 所需的技能、工具与经验 | [05-Day1-FDE所需技能工具与经验.md](./05-Day1-FDE所需技能工具与经验.md) |
| 06 | 环境搭建（VS Code / Git / Node / uv） | [06-Day1-环境搭建.md](./06-Day1-环境搭建.md) |
| 07 | 克隆 UnderCover 仓库、uv sync 与 .env | [07-Day1-克隆仓库与uv-sync.md](./07-Day1-克隆仓库与uv-sync.md) |
| 08 | 本地运行 Maze Agent 与 API 成本规划 | [08-Day1-本地运行Maze-Agent.md](./08-Day1-本地运行Maze-Agent.md) |

### Day 2（Week 1 Day 2）

| # | 主题 | 文件 |
|---|------|------|
| 09 | Day 2 回顾与前沿 LLM 计划 | [09-Day2-回顾与计划.md](./09-Day2-回顾与计划.md) |
| 10 | 从 GPT 到 ChatGPT：6 个技巧、Token、上下文窗口与 API 成本 | [10-Day2-从GPT到ChatGPT的6个技巧.md](./10-Day2-从GPT到ChatGPT的6个技巧.md) |
| 11 | 比较前沿 LLM：Artificial Analysis、帕累托前沿与 METR | [11-Day2-比较前沿LLM与METR.md](./11-Day2-比较前沿LLM与METR.md) |
| 12 | 介绍 UnderCover：课程项目与理赔 Agent 试点 | [12-Day2-介绍UnderCover项目.md](./12-Day2-介绍UnderCover项目.md) |
| 13 | Lab 准备：Chat Completions、结构化输出与 LangChain create_agent | [13-Day2-Lab准备与LangChain基础.md](./13-Day2-Lab准备与LangChain基础.md) |
| 14 | 探索 UnderCover 理赔数据与处理人决策 | [14-Day2-探索理赔数据.md](./14-Day2-探索理赔数据.md) |
| 15 | 测试 GPT-6 Luna / Gemini 3.5 Flash Lite / GPT-6 Sol / Jev | [15-Day2-测试多个模型.md](./15-Day2-测试多个模型.md) |
| 16 | 用 LangChain create_agent 与 Tools 构建理赔 Agent | [16-Day2-用LangChain构建理赔Agent.md](./16-Day2-用LangChain构建理赔Agent.md) |

## 缺失节说明

原始资源缺少两节（编号跳号）：`p03`（Day 1 第 2 节）、`p13`（Day 2 第 12 节）。不影响整体脉络，本文档按现有内容整理。

## 与本库其他目录的关系

- 本目录是**外采课程的录音整理**，偏「实操/工程直觉」，与 `docs/10-概念课程`（原创概念卡片）互补。
- FDE 角色认知、解决方案架构、客户现场手艺可对照 `docs/01-角色认知`、`docs/02-交付方法论`、`docs/10-概念课程/10-客户面手艺`。
- 结构化输出、上下文窗口、Prompt 缓存、推理（RLVR/思维链）等概念，与本库 `docs/10-概念课程/01-LLM与GenAI基础` 系列高度重叠，可交叉阅读。
