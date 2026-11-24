# 数据与 SQL 工程（概念课程）

本目录为 **原创中文概念文**，面向 FDE 现场的数据审计、备数、管道与仓内分析。与 [数据工程基石课程](../../05-能力补强/数据工程基石课程.md) 互补：基石偏能力地图与第一周动作，本课偏单点概念深度与取舍。

覆盖 map：Data Quality、Idempotent Pipelines、ETL vs ELT、Query Optimization、CDC、Lakehouse/Delta/Medallion、Batch vs Streaming、Dimensional Modeling/SCD、Orchestration、Spark、SQL vs NoSQL、Deduplication/LSH、SQL Window Functions、Gaps and Islands（共 14 篇）。

| 编号 | 标题 | 文件 |
|------|------|------|
| 01 | SQL 窗口函数 | [01-SQL窗口函数.md](./01-SQL窗口函数.md) |
| 02 | 数据质量与校验 | [02-数据质量与校验.md](./02-数据质量与校验.md) |
| 03 | 幂等数据管道 | [03-幂等数据管道.md](./03-幂等数据管道.md) |
| 04 | ETL vs ELT | [04-ETL-vs-ELT.md](./04-ETL-vs-ELT.md) |
| 05 | 查询优化与执行计划 | [05-查询优化与执行计划.md](./05-查询优化与执行计划.md) |
| 06 | CDC 变更数据捕获 | [06-CDC变更数据捕获.md](./06-CDC变更数据捕获.md) |
| 07 | 湖仓、Delta 与勋章架构 | [07-湖仓Delta与勋章架构.md](./07-湖仓Delta与勋章架构.md) |
| 08 | 批处理 vs 流处理 | [08-批处理vs流处理.md](./08-批处理vs流处理.md) |
| 09 | 维度建模与 SCD | [09-维度建模与SCD.md](./09-维度建模与SCD.md) |
| 10 | 编排：DAG、重试与回填 | [10-编排DAG重试回填.md](./10-编排DAG重试回填.md) |
| 11 | Spark 内部与性能 | [11-Spark内部与性能.md](./11-Spark内部与性能.md) |
| 12 | SQL vs NoSQL 选型 | [12-SQL-vs-NoSQL选型.md](./12-SQL-vs-NoSQL选型.md) |
| 13 | 去重与 LSH | [13-去重与LSH.md](./13-去重与LSH.md) |
| 14 | Gaps and Islands | [14-Gaps-and-Islands.md](./14-Gaps-and-Islands.md) |

## 建议阅读顺序

1. **SQL 刀法**：01 → 14 → 05  
2. **管道语义**：03 → 04 → 06 → 08 → 10  
3. **建模与质量**：09 → 02 → 07 → 13  
4. **引擎与选型**：11 → 12  

## 结构说明

各篇统一七段：一句话直觉 → 直觉讲解 → 工作示例 → 面试常问取舍 → FDE 现场怎么用 → 与本库其他篇的链接 → 参考与来源。
