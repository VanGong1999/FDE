# 现场勘察 Site Survey：[客户] - [项目]

**日期：** YYYY-MM-DD | **Lead FDE：**  

## 1. 数据图景（真相）

- **源系统：**（如 on-prem SQL Server、SAP、SharePoint 非结构化）  
- **数据重力：**（体量、增速、驻留区域要求）  
- **已知质量问题：**（如 30% 缺时间戳、CRM 无主键）  

## 2. 技术与安全约束

- **身份：**（如 Okta OIDC → 云 IAM）  
- **连通：**（无私网 / Interconnect / Private Access）  
- **外泄风险：**（VPC SC 是否启用、是否需 perimeter bridge）  

## 3. Delta（缺口）

- **产品缺口：**（开箱不支持的格式/流程）  
- **拟议胶水：**（如自定义解析服务转 Parquet）  

## 4. 本周快速胜利（Week 2 目标）

- （如：在政策数据集上拉起检索，证明 Top 检索命中率）  
