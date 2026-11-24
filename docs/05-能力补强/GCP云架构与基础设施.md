# GCP 云架构与基础设施

> 整理并扩展自 Awesome FDE 课程 Phase 2。以 **GCP** 为默认透镜（客户可能是 AWS/Azure/混合，概念可迁移）。  
> FDE 常被空降进复杂云项目：不仅写代码，还要架构代码落地的 **Landing Zone**。

相关：[企业网络白话](./企业网络与私有连接白话.md)、[SSO](./企业SSO与权限模型.md)、[气隙](./气隙与战术边缘部署.md)。

---

## 1. FDE 在 GCP 上到底干什么

| 工作 | 说明 |
|------|------|
| 读懂现有项目与网络 | Shared VPC、防火墙、已有互联 |
| 设计 AI 落地拓扑 | 应用、数据、模型推理路径 |
| IaC 可重复环境 | Terraform 拉起试点所需最小集 |
| 安全合规模块 | IAM、VPC SC、日志、密钥 |
| 成本与配额 | GPU/BigQuery 槽位、预算告警 |

你不是替代客户云团队，而是**把 AI 交付需求翻译成他们能批的架构与工单**。

---

## 2. 网络与安全（VPC）

| 主题 | 你要会的判断 |
|------|----------------|
| Global / Shared VPC | 多团队如何共享网络边界 |
| Interconnect / Cloud VPN | 机房如何接到 GCP；周期往往以周计 |
| IAP | 无传统 VPN 访问内网应用的零信任思路 |
| Private GKE | 控制面/节点无公网 IP |
| 固定出口 | 客户防火墙白名单场景 |

**承诺 Demo 前**确认：网络工单是否成为关键路径。细节见 [网络白话](./企业网络与私有连接白话.md)。

---

## 3. Kubernetes（GKE）

| 主题 | FDE 判断 |
|------|----------|
| Autopilot vs Standard | 要运维便利还是细粒度控制 |
| Workload Identity | K8s SA → IAM SA，避免 JSON 密钥散落 |
| Private Cluster | 满足严苛暴露面要求 |
| 资源配额 | Agent/推理工作负载别打爆节点 |

很多试点用 **Cloud Run** 比一上来 GKE 更合适——选「够用」的。

---

## 4. 数据与事件（GCP）

| 组件 | 典型用途 |
|------|----------|
| BigQuery | 分析仓；分区 vs 聚簇控成本 |
| Cloud Storage | 原始落地、模型工件、评测集 |
| Pub/Sub | 实时胶水、异步 Agent 任务 |
| Cloud Run / Functions | 轻量 API、Webhook、解析器 |
| Secret Manager / KMS | 密钥与加密 |

BigQuery 性能入口：https://cloud.google.com/bigquery/docs/best-practices-performance-overview  

---

## 5. 防数据外泄：VPC Service Controls

金融/政府常见：在 Google 托管服务周围划安全边界，阻止数据流到未授权项目。

FDE 动作：

1. 问清是否已启用 VPC SC  
2. 新项目/API 是否需要 perimeter bridge  
3. 承诺功能前把「能否调某 API」写成依赖  

概述：https://cloud.google.com/vpc-service-controls/docs/overview  

---

## 6. Infrastructure as Code（Terraform）

自动化「FDE 环境」：GKE 或 Cloud Run、BigQuery 数据集、IAM、密钥、日志槽。

| 级别 | 表现 |
|------|------|
| 弱 | 只会控制台点，环境不可复现 |
| 中 | 有 Terraform，文档写清变量 |
| 强 | 模块化 + 计划/应用流程 + 销毁演练 |

**最低目标**：新同事按文档能在测试项目拉起同等骨架。

---

## 7. AI 落地在 GCP 上的常见组合（示意）

```text
用户 --IAP/SSO--> Cloud Run (编排)
                    -->|检索| Vertex/Agent Search 或自建向量
                    -->|数仓| BigQuery（只读视图）
                    -->|模型| 专有端点或受控出站
                    -->|日志| Cloud Logging + 审计
```

具体产品名随 Gemini Enterprise / Vertex 品牌演进——以客户租户控制台为准。Agent 工具链见 [ADK 专篇](../03-AI落地/Google-ADK与多Agent编排.md)。

---

## 8. 两周微路径（有云基础者）

| 天 | 动作 |
|----|------|
| 1–2 | 建项目、开 API、配账单告警 |
| 3–4 | Cloud Run Hello + Secret Manager |
| 5–6 | BigQuery 数据集 + 分区表示例 |
| 7–8 | Terraform 管理上述资源 |
| 9–10 | 私有网络/IAP 任选一条加深 |
| 11–14 | 写一页「客户 Landing Zone 检查清单」 |

---

## 9. 反模式

- 忽略配额，Demo 当天才发现无 GPU  
- 服务账号密钥进 Git  
- 生产项目里做探索性实验  
- 未确认 VPC SC 就承诺「接好所有 Google API」  
- 用最大集群跑最小 Demo  

---

## 10. 推荐资源

| 资源 | 链接 |
|------|------|
| Architecture Framework | https://cloud.google.com/architecture/framework |
| GKE Networking | https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview |
| Terraform Google Provider | https://registry.terraform.io/providers/hashicorp/google/latest/docs |
| Skills Boost Data Engineer | https://www.cloudskillsboost.google/paths/16 |
| VPC SC 概述 | https://cloud.google.com/vpc-service-controls/docs/overview |
| SRE Workbook | https://sre.google/workbook/table-of-contents/ |

---

## 11. 读完马上做

- [ ] 列出你目标客户可能用到的 5 个 GCP 组件  
- [ ] 写 Landing Zone 检查 10 问（网络/IAM/SC/配额）  
- [ ] 用 Terraform 或等价 IaC 拉起最小可销毁环境  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE — Phase 2 | 整理稿 | 中文扩展 |
| 上表 GCP 文档 | — | 延伸阅读 |
