# 精读：Palantir FDSE 面试指南

> 原文：The Forward Deployed — Palantir FDSE Interview Guide  
> 精读日期：2026-09-22  
> 受众：目标 Palantir / 强拆解+编码型前线岗  

## 精华摘要

该指南基于公开候选人报告整理（文内标明约 2026-07，**随团队变化，以招聘官为准**）。Palantir FDSE 回路在前线岗中文档化程度较高：Recruiter → 较长技术筛（HackerRank 或 CodePair）→ Onsite 多轮（Decomposition、Learning、Coding、Re-engineering 等组合）→ Hiring Manager。

与标准 SWE 的差异：**Decomposition 与 Learning 近乎必考**；经典超大规模系统设计相对少见（拆解即其设计轮）；客户模拟线程可能穿插在技术或 HM 中——理解业务、有理由推回、把技术译成运营价值/风险。评分画像：模糊下的结构、可叙述推理、实用可读代码、学习速度、客户判断、以及**具体诚实的 Why Palantir**。

## 重点内容

### 回路一览（意译）

| 阶段 | 形式 | 测什么 |
|------|------|--------|
| Recruiter ~30m | 电话 | 背景、动机、文化；极看重「为何是 Palantir」 |
| Technical screen ~105–120m | HackerRank 或 live | 偏图的实用编码、小数据汇总、偶发 SQL；正确可读是门槛 |
| Onsite ~1h×最多四轮 | Decomposition / Learning / Coding / Re-engineering 等 | 拆解、代码流利、适应性 |
| HM ~60m | 视频 | 使命、ownership、开放问题 |

候选人常报总共约 3–5 场面，周期约 4–6 周；每轮技术面末段常留 15–20 分钟聊动机与协作。

### Decomposition（签名轮）

模糊真实世界问题，无范围无现成解。代表形态：陌生域编目追踪；从事件日志为现象建模；物流卡点等。算法刷题 alone 扛不住。五步同 Decomposition 专文。

**示例对照（紧急呼叫路由）**：弱开场直接 Dashboard+分类器；强开场先定调度员与「正确响应者尽快到达」、误派是硬点（代价是延误救护车）、低置信失败安全转人。

### Learning / Re-engineering

- **Learning**：陌生系统/API/语言特性，少文档，一小时内理解并扩展且不破坏旧行为——日常前线现实。  
- **Re-engineering**（部分回路）：读烂代码/甚至不熟语言，找 bug 改进。  
方法：先复现 → 追踪一条端到端路径 → 假设位置 → 最小改动验证 → 全程叙述。

### Coding

筛题常偏图（邻接表、拓扑、多源 BFS）、多部分递进、小数据集 rollup；语言灵活。Onsite 更推实现与需求变更。

### Why Palantir

通用热情失败。要落到具体客户域/问题观感，连到你建造过或在乎的事，诚实谈取舍。官方也强调理解其业务并真实。

### 两周备面（原文建议 → 压缩）

- Week1：过编码筛地板 + Decomposition 计时出声到开场自动化  
- Week2：Learning/客户模拟轮换 + 一个设计案例 + 真实失败故事与 Why  

### 与本库关系

- [编码与 Learning 轮](../04-面试通关/编码与Learning轮.md)  
- [Decomposition](../04-面试通关/Decomposition拆解面.md)  
- [公司图谱](../01-角色认知/公司图谱与岗位差异.md)  

## 可操作清单

- [ ] 向招聘官确认你的真实轮次组合  
- [ ] 图算法 + SQL 限时模拟每周 ≥2  
- [ ] Learning：每周 1 次陌生库 60 分钟扩展  
- [ ] 写一版非空泛的 Why Palantir（或你的目标司）  
- [ ] 准备「真失败」而非伪装成功故事  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| The Forward Deployed — Palantir FDSE Interview Guide | https://www.theforwarddeployed.io/interviews/palantir | 精读 / 翻译要点 |
| Reviewed | July 13, 2026 | |
| Palantir Careers / 官方面试建议 | https://www.palantir.com/careers/ | 对照 |
