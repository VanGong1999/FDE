# LLM 评测双环（开发内环 × 生产外环）

> 整理自 Awesome FDE「LLM Systems Evaluation」。  
> FDE 不对 Agent「凭感觉试」；用双环评测向客户证明可靠性。  
> 与本库 [评测 Eval 与 Guardrails](./评测Eval与Guardrails.md) 互补：本文偏 GCP/ADK 工具链称谓。

---

## 1. 内环：开发期评测

目标：开发中的快速、可交互调试。

- CLI / Web UI 对照 **Golden Dataset** 测执行路径（如 `adk eval` 一类工具）  
- 常见指标直觉：  
  - **工具轨迹分**：是否调用了正确工具  
  - **回答匹配分**：与参考的相似度（如 ROUGE 类）  
  - **基于量规的最终回答质量**  

---

## 2. 外环：生产与 CI 评测

目标：大规模、可自动化，证明「改模型/改提示」在数千用例上可度量变好。

| 能力 | 含义 |
|------|------|
| **Rapid Eval** | 同步、偏开发/测试 |
| **Pipeline Eval** | 异步、大规模数据集 |
| **Pairwise（成对）评测** | Model-as-Judge：优模型按量规比较 A vs B，给胜率与理由（Awesome 称其为 AutoSxS 演进） |
| **Pointwise（单点）** | 对单次输出打维度分 |

### RAG 三角（单点质量维度示例）

- **Groundedness（扎根性）**：是否严格遵循检索上下文（抑幻觉关键）  
- **Fulfillment（遵从）**：是否执行了系统提示指令  
- **Summarization / Coherence**：语言质量与信息密度  

平台文档入口（品牌可能更名，请搜当前控制台）：  
https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/computation-based-eval-pipeline  

---

## 3. Day-2：模型监控

上线后检测 **Prediction Drift**、特征归因变化等，防止客户数据演进导致 Agent 静默劣化。  
概述：https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/model-monitoring/overview  

另可读：Anthropic《Evaluating AI Agents》  
https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents  

---

## 4. 可操作清单

- [ ] 内环：冻结黄金集 + 每次改动回归  
- [ ] 外环：CI 跑 pairwise 或 pointwise 通过线  
- [ ] 线上：漂移告警接到值班人  
- [ ] 对客户汇报用「集 + 量规 + 失败例」，禁止虚荣准确率  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE — LLM Systems Evaluation | 整理稿 | 中文整理 |
| Anthropic Evals for Agents | 见上 | 思维对照 |
| 本库 Eval 专篇 | ./评测Eval与Guardrails.md | 通用方法 |
