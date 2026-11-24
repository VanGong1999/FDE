# C.A.S.E. 框架与 Delta 案例集

> 整理自 Awesome FDE「Interview Blackbook & Case Studies」。  
> 与 [Decomposition](./Decomposition拆解面.md)、[LLM 系统设计](./技术方案与LLM系统设计.md)、[行为面](./行为面STAR题库.md) 配合使用。

FDE 面试（Palantir、Google、Scale 等）不只考编码，更考 **Delta**：把产品接到使命的能力。

---

## 1. C.A.S.E. 四步（接到案例先别写码）

| 步 | 英文 | 做什么 |
|----|------|--------|
| **C** | Clarify | 数据量、安全（PII/PHI）、Definition of Done |
| **A** | Architect | 从源系统到用户界面的数据流（可用 GCP 原语叙述） |
| **S** | Solve (Delta) | 产品开箱缺什么，胶水如何补 |
| **E** | Evaluate | 如何证明不幻觉、如何监控 |

评分直觉：

- **Junior**：只谈 Python/脚本  
- **Senior**：安全、成本（FinOps）、干系人买账一并谈  

---

## 2. Delta 案例：医院再入院预测（30 天叙事）

**情景**：医院集团要用软件预测再入院；二十年 on-prem SQL Server；零云；极强 HIPAA。请走第一 30 天。

### 参考「强答」结构（GCP 透镜，可迁移）

| 阶段 | 技术 | 策略 |
|------|------|------|
| Day 1–7 | SQL Server 画像；关键特征 | 与 CMO 定义「再入院」窗口；与感到被威胁的 IT 建信任 |
| Day 8–15 | Landing Zone：对象存储摄入 + 仓存储 | VPC SC + DLP 脱敏以满足 HIPAA |
| Day 16–25 | 检索/Agent 接地病史；**Delta**：Cloud Run 类服务拉实时生命体征更新预测 | 明确胶水边界 |
| Day 26–30 | Pairwise 等评测对照历史结局 | 5 名医生 UAT；行为不变则项目失败 |

---

## 3. 高频题与答法要点

### 数据摄入危机

「5PB on-prem，48 小时进仓做应急演练？」  
→ 带宽是瓶颈；考虑 **Transfer Appliance** 类物理搬运；并行设计分区/schema，使上传即可查。

### 敌意干系人

「对方 Lead 恨我们的产品，不给 VPC？」  
→ 信任问题。一对一听担忧（常怕被替代）；展示平台自动化脏活、让其聚焦架构；共同编写初始部署脚本给所有权。

### 实时延迟 vs LLM

「银行要 <100ms 欺诈检测 + LLM？」  
→ LLM 不宜主路径。双轨：快速判别模型做 100ms 决策；标记交易异步交给 LLM Agent 做分析师可读的深挖解释。

---

## 4. 建议研读的真实案例入口

| 案例 | 链接 | 学什么 |
|------|------|--------|
| Palantir × UK NHS（疫情） | https://www.palantir.com/uk/healthcare/ | 多源整合成「操作系统」 |
| OpenAI × Morgan Stanley | https://openai.com/customer-stories/morgan-stanley | 海量研报助手与合规 |
| Scale × US Army | https://scale.com/blog/scale-ai-dod-expand-army-rd-partnership | 战术边缘、断续网络 |
| Google Cloud × Ford | https://corporate.ford.com/articles/products/ford-and-google-to-accelerate-auto-innovation/ | 制造与供应链 AI |

另读：Palantir [Dev vs Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)。

---

## 5. 第二案例：制造质检视觉 + 产线 MES（练习用）

**情景**：汽车零件厂要用视觉模型抓缺陷；产线 MES 老旧；数据不出厂；质检组长怕误报停线。

按 C.A.S.E. 自练（参考要点，勿背诵）：

| 步 | 要点 |
|----|------|
| C | 缺陷定义、漏检 vs 误报成本、班次、是否气隙、谁有停线权 |
| A | 边缘推理 → 结果进 MES；模型更新 sneakernet；人审工位 |
| S | Delta：标签流程、与 MES 工单闭环、误报熔断（连续 N 次转人工） |
| E | 按缺陷类型的召回；产线 UAT；误报导致的停线分钟数 |

---

## 6. 计时操练法

| 轮次 | 时长 | 做法 |
|------|------|------|
| 热身 | 20min | 只写 C.A.S.E. 提纲，不写码 |
| 标准 | 30min | 提纲 + 架构草图 + 风险 Top3 |
| 加压 | 15min | 只口述；录音回听是否先 Clarify |

搭档追问库：权限？成本？若赞助人下周要全自动？数据只有纸质？

---

## 7. 评分自检（每题后打勾）

- [ ] 开场 60 秒内澄清成功标准与约束  
- [ ] 画出数据/控制流（哪怕方框）  
- [ ] 明确说出 **Delta**（产品缺什么）  
- [ ] 提到安全或合规至少一点  
- [ ] 提到如何证明有效（Eval/UAT/指标）  
- [ ] 提到采用或干系人至少一点  
- [ ] 有意说了「非目标」或分阶段  

缺两项以上 → 重录一版。

---

## 8. 可操作清单

- [ ] 对一题限时 15 分钟走完 C.A.S.E.  
- [ ] 医院案例自己口述一版再对照本文  
- [ ] 制造案例独立写一版提纲  
- [ ] 准备「敌意 IT」与「双轨延迟」各 90 秒答  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE — Interview Blackbook | 整理稿 | 中文整理与案例意译 |
| 上表客户故事 | — | 延伸阅读 |
| 本文 §5–7 | — | 原创操练扩展 |
