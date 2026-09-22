# GCP 云架构与基础设施

> 整理自 Awesome FDE 课程 Phase 2。以 **GCP** 为默认透镜（客户环境可能是 AWS/Azure/混合，概念可迁移）。  
> FDE 常被「空降」进复杂云项目：不仅写代码，还要架构代码落地的 Landing Zone。

---

## 1. 网络与安全（VPC）

- **Global VPC / Shared VPC**：多团队共享网络边界时的模式  
- **Cloud Interconnect / Cloud VPN**：把客户机房接到云  
- **Zero-Trust / IAP（Identity-Aware Proxy）**：无 VPN 也能安全访问内网应用  
- **私有集群**：GKE 无公网 IP，满足严苛企业安全  

详见本库白话篇：[企业网络与私有连接](./企业网络与私有连接白话.md)、[SSO 与权限](./企业SSO与权限模型.md)。

---

## 2. Kubernetes（GKE）

| 主题 | FDE 要会的判断 |
|------|----------------|
| Autopilot vs Standard | 何时用运维便利换控制权 |
| Workload Identity | 让 K8s SA 扮演 IAM SA，避免散落 JSON 密钥 |
| Private Cluster | 满足「不能暴露控制面」 |

---

## 3. 数据架构（GCP）

- **BigQuery**：分区 vs 聚簇，面向 TB～PB 分析  
- **Cloud Functions / Cloud Run**：轻量事件驱动管道  
- **Pub/Sub**：客户系统与平台之间的实时「胶水」  

---

## 4. 防数据外泄：VPC Service Controls

金融/政府等高安全场景常见要求：在 Google 托管服务周围划安全边界，阻止数据流到未授权项目。承诺功能前先确认客户是否启用 VPC SC，以及是否需要 perimeter bridge。

---

## 5. Infrastructure as Code（Terraform）

自动化整个「FDE 环境」。若无法用 Terraform 在短时间拉起 GKE + BigQuery 数据集 + IAM 策略，前线部署节奏会卡在人工点控制台。

---

## 6. 推荐资源

| 资源 | 链接 |
|------|------|
| Google Cloud Architecture Framework | https://cloud.google.com/architecture/framework |
| GKE Networking Deep Dive | https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview |
| Terraform Google Provider | https://registry.terraform.io/providers/hashicorp/google/latest/docs |
| Cloud Skills Boost — Data Engineer | https://www.cloudskillsboost.google/paths/16 |
| VPC Service Controls 概述 | https://cloud.google.com/vpc-service-controls/docs/overview |
| Google SRE Workbook（监控与事故） | https://sre.google/workbook/table-of-contents/ |
| BigQuery 性能最佳实践 | https://cloud.google.com/bigquery/docs/best-practices-performance-overview |

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE — Phase 2 Cloud Architecture | 整理稿 | 中文结构化 |
| 上表 GCP 官方文档 | — | 延伸阅读 |
