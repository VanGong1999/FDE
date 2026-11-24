# Day 2 · 介绍 UnderCover：课程项目与理赔 Agent 试点

一句话总结：UnderCover 是一家虚构旅行保险公司，三周围绕它构建一个能自动处理理赔的 AI agent 试点，最终收敛到企业级 capstone。

## 项目定位

- **Undercover**（代号）：三周全程共用的**同一个商业项目**（讲师首次这样设计），最终收敛到大 capstone。
- 为什么一个项目而不是三个：反复 build，把它做成「最扎实、最厚实」的项目。
- 名字是双关：有旅行保险 = you are **under insurance coverage**。

## 业务背景

- Undercover = 虚构的**旅行保险公司**。
- 有一个 **Claims Team（理赔团队）**：查看理赔队列（如「我把狗落在家里所以误机了」），读政策、判断 **approve（批准）/ decline（拒绝）/ escalate（升级）**。
- 现状：**人工流程（manual process）**。

## 试点（Pilot）需求

- 构建一个 **AI agent** 来处理理赔队列，像理赔团队成员一样工作。
- **成功标准**：
  - 赔付 **> $1000** 需要人工审批（human approval）。
  - 赔付 **< $1000** 由 agent 自己处理。

## 方法论：先实验，再写软件

- 任何项目，**动手写软件前先做实验（experimenting）**。
- 今天用 Jupyter notebook 做 Lab：看数据、试不同 LLM 调用、理解质量/成本权衡、**通过实验选定 LLM**。

## 三周路线图（Undercover 视角）

| 周 | 要做的事 |
|----|---------|
| Week 1 | 今天 notebook 实验 → 明天用 **Claude Code** 构建后端 dashboard + 前端 + AI agent → 开源模型 → harness engineering 收口 |
| Week 2 | 工业级：加 evals、observability、agentic RAG、memory、MCP、human-in-the-loop、agent teams、自改进/递归自改进 agent |
| Week 3 | 生产企业级：安全、guardrails、企业上下文层、集成与数据 → 用 **AWS Agent Core** 部署 → 交付客户 |

## 为什么选旅行保险（可迁移性）

1. **具象（tangible）**：人人有经验，都有过「希望当时买了保险」的旅行事故。
2. **通用（generic）**：核心模式是「运营团队基于某种政策框架做类人决策」——几乎所有公司几乎所有部门都有类似场景，**很容易把本项目改造成你自己的业务领域**。

## 给学员的行动选项

- **照做**：一步步复制、跟学，作为学习入口。
- **改进**：加新功能、把安全/护栏/人工检查做得比讲师更好。
- **迁移**：把项目应用到完全不同的业务领域（你熟悉/工作过的领域，或个人痛点）。
- **分享**：提交 PR 到 repo，或发 LinkedIn（tag 讲师，讲师会评论放大曝光）。

## 角色扮演心态

- 全程把自己当作 **AI 解决方案架构师 / FDE**，在与真实客户（旅行保险客户）协作。
- 数据虽是合成数据（讲师用 Claude Code / Opus 5.5 生成），但要**当作真实客户数据**来对待。
