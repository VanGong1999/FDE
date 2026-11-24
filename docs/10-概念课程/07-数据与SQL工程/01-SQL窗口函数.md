# SQL 窗口函数

一句话直觉：窗口函数让你在「保留每一行」的同时，看见分区里的排名、累计、前后行与滑动统计——不用先 GROUP BY 把行捏没。

## 直觉讲解

**窗口函数（Window Function）** 对结果集的每一行，在指定「窗口」上做计算，再把结果贴回该行。窗口由三部分定义：

| 子句 | 作用 | 典型用法 |
|------|------|----------|
| `PARTITION BY` | 分组边界 | 按客户、按门店、按会话 |
| `ORDER BY` | 窗口内顺序 | 时间、金额、优先级 |
| `ROWS` / `RANGE` 帧 | 滑动范围 | 当前行及前 6 行；无界累计 |

常见家族：

1. **排名类**：`ROW_NUMBER`、`RANK`、`DENSE_RANK`、`NTILE`  
2. **取值类**：`LAG` / `LEAD`、`FIRST_VALUE` / `LAST_VALUE`  
3. **聚合开窗**：`SUM() OVER`、`AVG() OVER`、`COUNT() OVER`  
4. **分布类**：`PERCENT_RANK`、`CUME_DIST`（分析场景）

与 `GROUP BY` 的核心差别：聚合会**折叠行**；窗口**不折叠**。因此「每个用户最新一条订单」用 `ROW_NUMBER() ... = 1` 过滤，比相关子查询更清晰、也更易被优化器吃透。

```mermaid
flowchart LR
  A[明细行] --> B[PARTITION BY 客户]
  B --> C[ORDER BY 下单时间 DESC]
  C --> D[ROW_NUMBER]
  D --> E[rn=1 即最新]
```

**Gaps and Islands**（连续区间检测）高度依赖窗口：用 `LAG` 找断点，或用「值减去行号」构造岛屿键。本库另有专篇 [14-Gaps-and-Islands](./14-Gaps-and-Islands.md)；本篇先把窗口语法与现场模式打牢。

执行层面注意：大分区 + 复杂帧可能触发排序与内存压力；在仓内（Snowflake/BigQuery/Databricks SQL）要配合分区裁剪与聚簇键，避免对全表开窗。

## 工作示例（数字/场景）

**场景 A：每客户最新订单（FDE 第一周高频）**

```sql
WITH ranked AS (
  SELECT
    customer_id,
    order_id,
    amount,
    ordered_at,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id
      ORDER BY ordered_at DESC, order_id DESC
    ) AS rn
  FROM orders
)
SELECT * FROM ranked WHERE rn = 1;
```

| 坑 | 处理 |
|----|------|
| 同秒多笔 | 加稳定次序键（`order_id`） |
| 时区混用 | 统一到 UTC 再排序 |
| 软删除 | 先过滤 `deleted_at IS NULL` 再开窗 |

**场景 B：7 日滑动 GMV（看板）**

```sql
SELECT
  dt,
  gmv,
  SUM(gmv) OVER (
    ORDER BY dt
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS gmv_7d
FROM daily_gmv;
```

注意 `ROWS`（按行）与 `RANGE`（按值）差异：日期有空洞时，`ROWS` 的「前 6 行」≠「前 6 个自然日」。缺日要先用日历表补零。

**场景 C：会话内事件序号（Agent 轨迹）**

对 `session_id` 分区、按 `event_ts` 排序赋 `ROW_NUMBER`，再配合 `LAG(event_type)` 看「上一步是否工具调用失败」。这是把窗口函数接到 AI 评测流水线的常见桥。

**粗算**：1000 万行订单、100 万客户，若按客户分区且客户订单极不均匀（大客户 10 万单），单分区排序可能成为瓶颈——先抽样验证倾斜键，再考虑预聚合或分桶。

## 面试常问取舍

1. **`ROW_NUMBER` vs `RANK` vs `DENSE_RANK`**  
   - 要「严格唯一一条」用 `ROW_NUMBER`。  
   - 要「并列同名次且跳号」用 `RANK`；「并列不跳号」用 `DENSE_RANK`。  
   - 面试答清业务语义比背语法重要。

2. **窗口 vs 自连接 / 相关子查询**  
   - 窗口通常更可读、一次扫描多指标。  
   - 极简「取最大值对应行」在部分引擎上子查询也可能很好——以 `EXPLAIN` 为准，不教条。

3. **在应用层算 vs 在 SQL 算**  
   - 明细级排名、累计尽量下推 SQL/仓。  
   - 强交互、小结果集可在应用层；但不要把千万行拉回 Python 再 `groupby`。

4. **帧选 `ROWS` 还是 `RANGE`**  
   - 时间序列补齐后用 `ROWS` 更直观；按金额区间用 `RANGE`。  
   - 默认帧因引擎而异，**显式写出帧**可减少「换仓结果变了」。

| 取舍 | 偏简单 | 偏稳妥 |
|------|--------|--------|
| 去重取最新 | `DISTINCT ON`（Postgres） | `ROW_NUMBER` 可移植 |
| 滑动窗口 | 近似引擎函数 | 日历补齐 + 显式帧 |
| 大分区 | 直接开窗 | 预过滤 + 倾斜治理 |

## FDE 现场怎么用

- **数据审计第一周**：用窗口查主键重复（`COUNT(*) OVER (PARTITION BY pk)`）、最新快照、状态机非法跳转（`LAG(status)`）。  
- **备数给 RAG/指标**：Gold 层「当前有效维」常用 `ROW_NUMBER` 取最新 SCD 版本。  
- **排障**：看板「今日和昨日对不上」——检查是否用了 `RANGE` 遇空洞、或分区键含 NULL 导致怪异分组。  
- **与客户对齐口径**：把「最新」定义写成「`ordered_at` 降序，并列取 `order_id`」，写进指标字典。  
- **工程清单**：复杂窗口进 PR 时附一张小样例表（5–10 行）与期望输出，方便评审。

现场口条：「我先用窗口把每个实体的最新真相抽出来，再谈 AI 该读哪张表。」

## 与本库其他篇的链接

- 同轨：[14-Gaps-and-Islands](./14-Gaps-and-Islands.md)、[05-查询优化与执行计划](./05-查询优化与执行计划.md)、[09-维度建模与SCD](./09-维度建模与SCD.md)、[13-去重与LSH](./13-去重与LSH.md)  
- 能力补强：[数据工程基石课程](../../05-能力补强/数据工程基石课程.md)  
- 概念交叉：[04-生产系统设计/04-幂等Idempotency](../04-生产系统设计/04-幂等Idempotency.md)（业务去重键 vs SQL 去重）  
- Text-to-SQL 场景：[02-检索与Agent/30-Text-to-SQL](../02-检索与Agent/30-Text-to-SQL.md)

## 深入：可移植性与性能边界

### 方言差异
`QUALIFY`（BigQuery/Snowflake 等）可省略外层过滤 `rn=1`；Postgres 常用子查询。`IGNORE NULLS` 在 `LAG`/`LAST_VALUE` 上支持不一。跨仓项目以「小样例表 + 期望结果」做方言回归。

### 默认帧陷阱
只写 `ORDER BY` 不写帧时，部分引擎对累计聚合使用「到当前行为止」的默认范围，结果随引擎而变。**显式 `ROWS BETWEEN ...`** 是可移植性保险。

### 与 Gaps/Islands
连续段、会话化、新鲜度空洞都是窗口的进阶题，见 [14-Gaps-and-Islands](./14-Gaps-and-Islands.md)。先掌握取最新与滑动，再攻岛屿。

### 课堂小结
窗口函数是 FDE 数据审计的瑞士军刀：取最新、查重复、算滑动、接 SCD。先定义业务次序键，再写 `OVER`。

## 参考与来源

- 原创综述：面向 FDE 数据审计与备数场景的窗口函数用法（本篇）。  
- SQL:2003 窗口函数标准概念（各仓方言以实现文档为准）。  
- 本库：[数据工程基石课程](../../05-能力补强/数据工程基石课程.md)。  
- 实践提醒：以目标引擎的 `EXPLAIN` / Query Profile 校验排序与溢出，不依赖口诀。
