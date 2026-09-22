# 精读：Anthropic Applied AI / FDE 面试侧重点

> 原文：Reddit r/OfferEngineering 社区长帖 + 公开岗位语境  
> 精读日期：2026-09-22  
> 受众：Anthropic Applied AI / 强调安全评测的 AI 前线岗  
> 注意：社区经验，**非官方**；以招聘官为准  

## 精华摘要

社区对 Anthropic Forward Deployed / Applied AI 类角色的共识是：这**不是**典型后端算法流水线，而更接近软件工程 + 应用 AI + 解决方案架构 + 客户顾问 + 产品反馈的混合。工作实质是把 Claude 带进真实企业环境，理解脏工作流，构建可生产系统，评估是否真的有效，并把一次性部署沉淀为可重复模式。

差异化往往在 **LLM 系统设计**：权限、审计、HITL、监控幻觉/延迟/成本/工具失败；以及「用户喜欢 Demo」远远不够——需要 golden set、量规、失败分析、人工抽检、rollout。行为面强调端到端所有权、模糊项目、客户面技术工作、失败部署、安全可靠问题、对不切实际需求的推回、向非技术干系人解释权衡、把现场学习变产品信号。

## 重点内容

### 能力画像（意译归纳）

强候选人需能展示：用 Claude（或同类）构建 → 评测系统 → 安全部署 → 生产调试 → 客户沟通 → 把现场洞见反馈产品。

### 高频设计题方向（社区列举类）

- 法律合同审阅助手  
- 带 SQL/表格工具的金融分析 Agent  
- 海量企业文档 RAG  
- 安全暴露 CRM 数据的工具/MCP 服务  
- 高风险工具使用的 HITL 工作流  
- 幻觉、延迟、成本、工具失败的监控  

好答案通常含：eval、golden、任务量规、失败分析、人工复核、监控、权限、审计、分阶段推广。

### 开场结构建议

先发现：工作流、用户、数据源、失败模式、监管约束、成功指标、可安全试点的第一刀——再谈架构。

### 行为面主题

端到端所有权、模糊项目、客户面工作、失败部署、安全/可靠性、推回、非技术沟通、一次性→可复用。

### 与官方文档的交叉

企业部署时同步阅读 Anthropic 文档中的安全与提示实践（本库 S21），把「宪法式/安全」叙事落到工程控制（护栏、HITL、审计），避免空谈价值观。

### 与本库关系

- [技术方案与 LLM 系统设计](../04-面试通关/技术方案与LLM系统设计.md)  
- [评测与 Guardrails](../03-AI落地/评测Eval与Guardrails.md)  
- [行为面 STAR](../04-面试通关/行为面STAR题库.md)  
- 案例：[合同审核](../06-行业案例/04-合同单据审核HITL.md)、[流程 Agent](../06-行业案例/05-流程型工单Agent.md)  

## 可操作清单

- [ ] 准备 1 个「受监管场景」完整设计口述（含 eval+HITL+审计）  
- [ ] 写清「Demo 喜欢 ≠ 可上线」的对比表  
- [ ] 准备推回与失败部署各 1 个 STAR  
- [ ] 红队：诱导不安全工具调用的用例  
- [ ] 核对目标 JD 标题（Applied AI vs FDE）与真实轮次  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Reddit — Anthropic FDE Interview Guide 讨论 | https://www.reddit.com/r/OfferEngineering/comments/1uc8ocr/anthropic_forward_deployed_engineer_fde_interview/ | 社区精读 / 要点综述 |
| Anthropic Careers | https://www.anthropic.com/careers | 官方称谓对照 |
| Anthropic Docs | https://docs.anthropic.com/ | 安全与提示实践对照 |
| 访问日期 | 2026-09-22 | |
