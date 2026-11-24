# Palantir 平台：Foundry / AIP / Gotham / Apollo

## 直觉

面试与现场常出现的平台拼图（公开信息级）：**Foundry** 偏企业数据操作系统与 Ontology；**AIP** 在其上嵌 AI 能力；**Gotham** 偏政府/国防任务分析语境；**Apollo** 偏持续交付/MLOps 类部署控制平面。理解职责边界，避免名词堆砌。

## 讲解

### 概念分工（教学用）

| 名称 | 理解抓手 |
|------|----------|
| Foundry | 数据+语义+应用构建 |
| AIP | 人机工作流与模型接入 |
| Gotham | 任务向分析与决策支持 |
| Apollo | 发布、配置、环境推进 |

FDE 价值：在客户约束下把对象、权限、行动与评测打穿，而不是背宣传页。具体菜单以当时产品为准。

## 工作示例

口述架构：数据入 Foundry 对象 → 权限边 → AIP 助手只经对象动作创建工单 → Apollo 管配置推进。强调审计链路。

## 面试取舍

忌把四词当成四个可互换盒子。取舍：平台原生能力 vs 外部定制。

## FDE用法

1. 用客户真实对象模型说话。
2. 安全与发布问 Apollo/环境策略类问题。

## 本库链接

- [企业AI落地全景](../../03-AI落地/企业AI落地全景.md)
- 同轨：[10-Ontology语义层](./10-Ontology语义层.md)、[19-企业AI参考架构](./19-企业AI参考架构.md)
- [什么是FDE](../../01-角色认知/什么是FDE.md)

## 参考与来源

- Palantir 公开产品页与投资者/技术博客（事实以官方为准）
- 本库仅作概念地图，不含未公开实现细节

## 易混点

围绕「Palantir 平台：Foundry / AIP / Gotham / Apollo」，现场最常见混淆：

1. **把 Demo 稳定性当成生产稳定性**：单次成功路径不等于可值班、可回滚、可审计。
2. **只优化平均值**：P50 很好时 P99 与错误预算可能已经烧穿。
3. **安全控制后置**：权限、驻留、密钥与网络不是上线前贴纸。
4. **成本与质量拆成两张嘴**：没有单位经济的「更好」不可持续。
5. **缺少明确 owner**：指标无人看，事故无人关。

## 运行手册摘要

落地「Palantir 平台：Foundry / AIP / Gotham / Apollo」时，建议最小 Runbook 条目：

| 项 | 内容 |
|----|------|
| 触发条件 | 何时启用/告警/降级 |
| 首要动作 | 前 5 分钟做什么 |
| 证据 | 看哪些仪表盘与 trace |
| 回滚 | 精确到版本/旗标/路由 |
| 沟通 | 客户侧通知模板 |
| 复盘 | 24h 内写清根因与门禁缺口 |

## 反模式

- 无门禁从 POC 直接全员开放。
- 重试无抖动、无限次，制造重试风暴。
- 限流只限别人，自己批处理打爆依赖。
- 可观测只有日志文件，无线索关联。
- SLO 写成「尽量快尽量准」而不可计算。

## 一周落地节奏（示例）

| 日 | 动作 |
|----|------|
| D1 | 画请求路径与依赖；标出爆炸半径 |
| D2 | 定 SLI/成本/安全基线与告警 |
| D3 | 实现最小硬化（超时/重试/幂等/限流之一组） |
| D4 | 影子或金丝雀验证 |
| D5 | 写 Runbook 与客户沟通材料 |

## 面试 60 秒版本

谈到「Palantir 平台：Foundry / AIP / Gotham / Apollo」，我会先画链路与爆炸半径，再谈控制手段与可观测证据，最后给回滚与单位经济。FDE 的分数来自可运营，而不是只能演示。

## 速查清单

- 成功与失败是否可测、可告警？
- 是否有超时、重试、幂等、限流的明确策略？
- 是否具备 trace/metrics/log 三件套与版本标签？
- 是否定义降级与供应商故障转移？
- 是否写清部署模型与数据驻留？
- 是否有错误预算与发布冻结规则？
- 是否能在 5 分钟内定位「哪一跳」坏了？
- 客户 owner 与升级路径是否点名？

- 补充自检 1：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 2：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 3：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 4：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 5：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 6：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 7：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 8：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 9：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 10：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 11：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 12：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 13：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 14：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？

- 补充自检 15：关于「Palantir 平台：Foundry / AIP / Gotham / Apollo」的假设是否仍被本周事故/近失支持？
