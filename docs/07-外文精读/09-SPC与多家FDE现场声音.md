# 精读：SPC 等多家 FDE 现场声音（专题讨论 + 部署工程演讲）

> 原文语言：English（YouTube）  
> 精读日期：2026-09-30  
> 难度/受众：角色认知 / 交付 / 产品化  

本篇是**索引型精读**：多家公开讨论的要点已**追加进既有中文专篇**，此处只留精华摘要与跳转，避免重复维护两份全文。

---

## 精华摘要

1. **模型越强，FDE 越像解锁器**：异质劳动力问题远多于标准 SaaS；管道代码变便宜后，瓶颈是用例理解与结果证明（SPC / OpenAI Colin）。
2. **同一标题、不同使命**：RAMP=赢企业的剑与盾；Nominal=客户成功+路线图反馈；Dataland=异质智能体生命线；OpenAI=广泛采用+啃难行业；Factory/Cognition=产品矛尖，拒纯专业服务。
3. **咨询 vs 软件经济**：看经常性价值是否以固定成本交付；警惕服务收入毒品与客户对「人在场」上瘾。
4. **产品化纪律**：共同障碍进平台；可泛化地「向左拉」路线图；FDE 是平台第一用户；问「能否只是 Codex/平台原语？」。
5. **术语可死、责任活着**（Sierra）：FDE 定义通胀，但「对客户结果负责」是连续性；席位→用量→结果定价。
6. **Agent 就绪 / 软件工厂**（Factory）：确定性验证环密度决定 agent 能走多远；部署目标是自动组装而非人天迁移。
7. **六阶段工作流**与 **Juice Shop 练习**：Discover→Scale 映射 DDDR；低成本 RAG+Docker 可当 Take-home。

---

## 重点内容

### 关键框架（已入库位置）

| 主题 | 跳转到 |
|------|--------|
| 模型强了为何还要 FDE | [什么是 FDE §9](../01-角色认知/什么是FDE.md) |
| 多公司使命 / Echo 变体 / FDE 年份 | [公司图谱 §10–12](../01-角色认知/公司图谱与岗位差异.md) |
| 招聘特质 / 写代码≈20% | [人设 §10](../01-角色认知/FDE人设使命与技术栈.md)、[能力模型 §7](../01-角色认知/能力模型与成长路径.md) |
| 是否适合 / 头衔会变 | [适合谁 §8](../01-角色认知/适合谁不适合谁.md) |
| 六阶段 ↔ DDDR | [DDDR §8](../02-交付方法论/Discover-Design-Deploy-Review.md) |
| 上瘾 / ROI / token maxing | [反模式 §8](../02-交付方法论/反模式与踩坑.md) |
| 结果定价 / 传话游戏 / Venn | [客户成果 §8](../02-交付方法论/客户成果方法论.md) |
| 低成本 POC | [POC 到生产 §9](../02-交付方法论/POC到生产.md) |
| Agent 就绪 / 软件工厂 | [Agent §10](../03-AI落地/Agent与工具调用.md) |
| RAG 卡点 | [RAG §9](../03-AI落地/RAG实战精要.md) |
| 产品化纪律 | [解决方案产品化 §11](../05-能力补强/解决方案产品化.md) |
| 周末练习 | [Take-home §10](../04-面试通关/Take-home与演示.md) |

### 与本库其他章节的关系

- 与已有 OpenAI 访谈精读（S32）互补：S32 偏单人深访；本批偏**多公司对照**与**部署工程哲学**。
- 行业数字（70k 通话/天、82% 时间线等）为演讲口述，**不以本库为统计权威**；用其学叙事结构即可。

---

## 可操作清单

- [ ] 用「使命句」写出你目标公司的 FDE 定义，对照 [公司图谱 §10](../01-角色认知/公司图谱与岗位差异.md)
- [ ] 检查当前项目：价值载体是系统还是「人在场」？（[反模式 §8](../02-交付方法论/反模式与踩坑.md)）
- [ ] 评估一块代码库的 Agent 就绪度（确定性验证环）
- [ ] 可选：完成 [Take-home §10](../04-面试通关/Take-home与演示.md) 周末练习

---

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| South Park Commons — FDE 专题讨论 | https://www.youtube.com/watch?v=hWuoH-ODDNc | 多公司定义 / ROI / 招聘 / 结构 |
| Cognition — 部署工程（Gia） | https://www.youtube.com/watch?v=RVxym6mmIns | PMF Venn / 结果 vs token |
| Factory — Deployed Engineering（Eno Reyes） | https://www.youtube.com/watch?v=wpOA-UXynoM | 软件工厂 / Agent 就绪 |
| Sierra — Natalie Mirror | https://www.youtube.com/watch?v=Byv311hdoHE | FDE 历史与「术语已死」 |
| FDE 六阶段工作流讲解 | https://www.youtube.com/watch?v=7jbyXygn9h0 | Discover→Scale |
| Juice Shop AI 助手实战 | https://www.youtube.com/watch?v=miHREcaScRY | 低成本端到端练习 |
| 入库 ID | S33–S38 | 见 [sources.md](../../references/sources.md) |
