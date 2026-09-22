# FDE 人设、使命与现代技术栈

> 整理自 Awesome FDE「Persona & Mission / Modern Stack」。补充 [什么是 FDE](./什么是FDE.md)。

---

## 1. 使命一句话

FDE 是总部「完美代码」与客户「脏现实」之间的桥。标准软件撞上损坏 schema、气隙机房、政治阻力时会失败；FDE 不只修 bug，而是做方案、管干系人、写让大合同成立的**胶水代码**。

---

## 2. SWE vs FDE（补充表）

| 维度 | SWE | FDE |
|------|-----|-----|
| 用户 | 海量匿名用户 | 高利害干系人（CTO/CEO/指挥链等） |
| 环境 | 受控、同质云 | 敌意、遗留、气隙或混合 |
| 目标 | 规模与稳定 | 价值速度与解题 |
| 代码重心 | 约 90% 功能 | 约 50% 集成胶水 + 50% 策略对齐 |

传统 SWE 为 persona 构建；FDE 为 **mission** 构建。

---

## 3. 现代 FDE 技术栈（速查）

| 层 | 常见工具 |
|----|----------|
| 语言 | Python（数据/AI）、Go（基础设施）、SQL（无处不在） |
| 数据 | dbt、DuckDB、Spark |
| 云/IaC | Terraform、Helm、GCP（或客户云） |
| 可观测 | Prometheus、Grafana、Loki；云厂商 Trace/Logging |

深度课：[数据工程基石](../05-能力补强/数据工程基石课程.md)、[GCP 架构](../05-能力补强/GCP云架构与基础设施.md)。

## 参考与来源

Awesome FDE — Persona & Mission（中文整理）。
