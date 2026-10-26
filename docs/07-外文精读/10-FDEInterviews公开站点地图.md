# 精读：FDEInterviews 公开站点地图（2026）

> 原文语言：English  
> 精读日期：2026-10-05  
> 难度/受众：面试为主；对照本库自练  
> 原文：[fdeinterviews.com](https://fdeinterviews.com/) · 入口页 [essentials](https://fdeinterviews.com/essentials)

**本篇范围（请先读完再往下刷）：**

- **会收录：** 公开首页、Start here、题库主题页、概念轨道目录、课程大纲页上能直接看到的结构、模块名、必刷题**标题**，以及与本库章节的对照。
- **不会收录：** 题解正文、课程课文、概念专页全文、公司指南逐轮原文、Lab 任务逐步操作、Work sample 参考解、付费 PDF。这些仍是原站版权内容；「只给自己看」也不能整页搬进本仓库（本库还有公开 GitHub Pages）。
- **怎么用：** 把下面清单当诊断表，**对着原站开口答**；答完用本库对应篇补框架。数字以原站为准（首页 2026-09-29 更新：约 641+ 题、171 概念、107 家公司指南、4 门课 / 118 课、Lab 30 关）。

## 精华摘要

FDEInterviews 把备面拆成四段：**认角色 → 按课程学工作顺序 → 按主题开口练题 → 用 capstone / 公司指南验收。** 站内三套表面容易混：Questions 是「这题怎么答」，Concepts 是「一个概念一页」，Courses 是「按交付顺序学」。付费墙之外，每条主题轨道都有免费题；课程每门都有免费课。

对转岗者最有用的不是抄答案，而是他们把真实回路压成 **11 条由易到难的轨道**，再用约 **100 道必刷题** 当漏斗：哪题卡口就回哪条轨道。本库已有角色、交付、RAG/Agent/Eval、Decomposition、行为面；本篇补的是「原站公开目录 ↔ 本库该打开哪篇」。

公开首页还强调现场手感：浏览器里的 **FDE Lab**（陌生机器、重复 webhook、分数更好但动作更差、sev1 交接）和 **Work sample**（坏掉的流式助手、看起来合理的错误 SQL）。这些适合在本库 Take-home / 编码轮之后去原站动手，不要把模拟器剧本抄进仓库。

## 重点内容

### 1. 四段旅程（Start here）

| 阶段 | 原站叫法 | 你要产出的东西 | 本库入口 |
|------|----------|----------------|----------|
| 01 定向 | The Guide | 说清岗位、回路测什么 | [什么是 FDE](../01-角色认知/什么是FDE.md)、[面试全景](../04-面试通关/面试全景与公司对照.md) |
| 02 按序学 | Courses | 一条可讲的交付心智 | [DDDR](../02-交付方法论/Discover-Design-Deploy-Review.md)、[客户成果](../02-交付方法论/客户成果方法论.md) |
| 03 开口练 | Questions | 每主题从易到难口述 | [4–6 周计划](../04-面试通关/4-6周备面计划.md) |
| 04 证明 | Capstones + Companies | 一件能辩护的部署 + 目标公司逐轮 | [Take-home](../04-面试通关/Take-home与演示.md) + 各公司指南 |

公开入口：[https://fdeinterviews.com/essentials](https://fdeinterviews.com/essentials) · 题库 [https://fdeinterviews.com/questions](https://fdeinterviews.com/questions) · 课程 [https://fdeinterviews.com/courses](https://fdeinterviews.com/courses) · 概念 [https://fdeinterviews.com/concepts](https://fdeinterviews.com/concepts)

### 2. 按背景从哪段加入（公开分流）

| 你是谁 | 原站建议 | 本库怎么接 |
|--------|----------|------------|
| 后端 / 全栈 | 从 Foundations 学起；补行为与客户题 | [学习路径-转岗者](../00-导读/学习路径-转岗者.md) → 行为面 + Decomposition |
| ML / DS | 跳过建模入门，直攻部署、安全审查、价值证明 | [生产化清单](../03-AI落地/生产化清单.md)、[气隙与边缘](../05-能力补强/气隙与战术边缘部署.md) |
| 解决方案 / 咨询 | 先分清 FDE 与 SE；慢读工程模块；补 Coding | [FDE 与 SWE](../01-角色认知/FDE与SWE对比.md)、[编码与 Learning](../04-面试通关/编码与Learning轮.md) |
| 已在岗 | Hard Deployments + 目标公司回路 + 救援 48h | 反模式、产品化、Hard 部署相关补强 |
| 学生 / 应届 | 读完角色诚实描述 + 一门课做到 capstone | [学习路径-零基础](../00-导读/学习路径-零基础.md) |

### 3. 公开题库：11 条轨道

每条轨道在原站由易到难；**每条开头有免费题**。下面是公开主题页上的轨道说明（意译）+ 本库对照。

| # | 轨道 | 公开页在测什么 | 本库 |
|---|------|----------------|------|
| 1 | LLM & GenAI Fundamentals | Token、窗口、Prompt/RAG/微调、幻觉、Eval、成本延迟 | [09 面试题 · LLM和AI基础](../09-面试题/README.md#1-llm和ai基础) · [架构决策树](../03-AI落地/架构决策树.md) |
| 2 | RAG & Agent System Design | 切块、重排、工具 Agent、护栏、多租户、评测夹具 | [RAG](../03-AI落地/RAG实战精要.md)、[Agent](../03-AI落地/Agent与工具调用.md)、[Eval](../03-AI落地/评测Eval与Guardrails.md) |
| 3 | Coding & DSA | 内存库、限流、解析器 + LeetCode 中等；OpenAI/Anthropic 实操、Palantir/Meta 经典 | [编码与 Learning](../04-面试通关/编码与Learning轮.md) |
| 4 | Machine Learning & Data Science | 经典 ML、embedding、P/R/AUC、实验设计 | 面试口述用本篇 §6 清单 |
| 5 | SQL & Data Engineering | 窗口、gaps-and-islands、Spark、湖仓、幂等、CDC | [数据工程基石](../05-能力补强/数据工程基石课程.md) |
| 6 | System Design & Production Engineering | Decomposition、POC 生产化、事故、可观测、VPC/气隙 | [Decomposition](../04-面试通关/Decomposition拆解面.md)、[POC 到生产](../02-交付方法论/POC到生产.md) |
| 7 | Behavioral & Customer Scenarios | 发现扮演、敌意干系人、demo 翻车、为何做客户面 | [STAR](../04-面试通关/行为面STAR题库.md)、[客户模拟](../04-面试通关/客户模拟操练.md) |
| 8 | MLOps & ML Engineering | 模型 CI/CD、漂移、K8s 推理、特征商店、晋级 | [生产化清单](../03-AI落地/生产化清单.md) |
| 9 | ML Infrastructure & GPUs | 分布式训练、vLLM/KV cache、调度、网关扩容 | [GCP 云架构](../05-能力补强/GCP云架构与基础设施.md) |
| 10 | AI Security, Privacy & Governance | 注入、PII、审计、SOC2/EU AI Act、CISO 场 | [09 面试题 · AI安全隐私与治理](../09-面试题/README.md#8-ai安全隐私与治理) · [概念课 08](../10-概念课程/08-AI安全隐私与治理/README.md) · [OWASP 精读](./07-OWASP-LLM应用风险Top10.md) |
| 11 | ML System Design (Product) | 推荐/信息流/广告/欺诈：召回、特征、离线/在线评测 | [09 面试题 · 生产系统设计](../09-面试题/README.md#4-生产系统设计) · [AI 系统设计课程](../03-AI落地/AI系统设计课程-基础篇.md) |

首页公开样题（RAG 刷新后幻觉）：**先测召回，再动 prompt。** 数据刷新若只重摄入不重嵌入，索引会指向过期向量。本库对应 [RAG 实战精要](../03-AI落地/RAG实战精要.md)。

### 4. 公开课程大纲（四门、按序）

原文目录：[https://fdeinterviews.com/courses](https://fdeinterviews.com/courses)。下列为公开模块名（意译），**不是课文搬运**。

#### Foundations of Forward Deployed Engineering（入门 · 11 模块）

岗位是什么；第一周如何发现真问题、读别人的系统、圈可交付范围、对付钱的人说清楚。

1. 角色  
2. Discovery  
3. 读系统  
4. 能在别人系统里活下来的代码  
5. 会反击的数据  
6. 给他们的世界建模  
7. POC  
8. 第一个 AI 功能  
9. 运维你刚交出去的东西  
10. 怎么说  
11. Capstone  

公开页标注：角色 / 读系统 全免费；Discovery 部分免费。对照本库 01 + 02 全章。

#### The FDE Engagement（进阶 · 11 模块）

买方在场的技术发现 → 能活在对方栈里的集成 → 别人能运维的部署 → 过安审 → Eval 夹具后的生产 AI → 值不值得的价值对话。

1. 技术发现  
2. 企业集成  
3. 对方世界的模型  
4. 部署进对方环境  
5. 安全审查  
6. 生产中的模型  
7. 答案本身就是模型时  
8. 有权限的 Agent  
9. 证明值回票价  
10. 工作周围的手艺  
11. Capstone  

对照：[需求发现](../02-交付方法论/需求发现与问题拆解.md)、[企业集成相关补强](../05-能力补强/README.md)、[评测](../03-AI落地/评测Eval与Guardrails.md)。

#### Production AI Agents for FDEs（中级 · 6 模块）

1. 合同与基线  
2. 证据与上下文  
3. 工具与权限  
4. 可持久的动作  
5. 评测与改进  
6. 发布与所有权  

对照：[Agent](../03-AI落地/Agent与工具调用.md)、[LLM 评测双环](../03-AI落地/LLM评测双环.md)。

#### Hard Deployments（专家 · 10 模块）

别人的硬件、气隙、多租户互不可见、已经着火的项目、决定一切的算术。

1. 在不是你选的硬件上 serving  
2. 气隙  
3. 一套平台、多个客户  
4. 组合上的成本与延迟  
5. 长视野自主性  
6. 救援工程  
7. 组合可靠性  
8. 从现场代码抽出平台  
9. 实践  
10. Capstone  

对照：[气隙](../05-能力补强/气隙与战术边缘部署.md)、[解决方案产品化](../05-能力补强/解决方案产品化.md)、[反模式](../02-交付方法论/反模式与踩坑.md)。

### 5. 公开概念轨道（目录级）

原文：[https://fdeinterviews.com/concepts](https://fdeinterviews.com/concepts)。下列是公开目录上的概念名（中文概括）。**专页讲解请在原站读**；本库**不转载**原站专页全文。

**本库已写成原创概念课（推荐）：** 打开 [docs/10-概念课程](../10-概念课程/README.md)，十条轨道共 **171** 篇，结构为直觉 → 示例 → 面试取舍 → FDE 现场用法。主题清单与公开目录对齐，正文为本库原创综述。

公开目录速览（便于对照原站）：

**LLM 基础：** Token；上下文窗口；Embedding；Transformer 直觉；Attention；RoPE；温度 / top-p；约束解码；Prompt；思维链；幻觉；Prompt / RAG / 微调；RLHF；奖励模型；Constitutional AI / RLAIF；KV cache；LoRA；DPO；PPO / GRPO；MoE；Scaling laws；推理时计算；多模态；Diffusion；语音；自回归解码；路由与级联；Prompt/语义缓存；企业选模型；结构化输出；System-1 决策模型。

**检索与 Agent：** RAG；向量库；混合检索；切块；重排；ANN；Agent 循环；工具调用；多 Agent；护栏；Agent 记忆；TF-IDF / BM25；窗口预算；MCP；工作流 vs Agent；ReAct；轨迹评测；权限感知 RAG；上下文失效模式；自主性刻度；GraphRAG / 带上下文检索；框架不会替你修的失败；Embedding 版本漂移；索引陈旧；A2A；以及 HyDE、ColBERT、AG-UI、AP2、Text-to-SQL、文档解析等。

**评测与 ML：** 信息论四量；校准；LLM-as-judge；RAG 检索/生成分评；A/B / canary / shadow；Bandit；离线 vs 在线；合成数据；Benchmark 局限；灾难性遗忘；损失函数；激活；Batch/Layer norm；不平衡数据；半监督；凸性；视觉任务阶梯；忠实度 vs 相关性。

**生产系统设计：** Demo 到生产；AI 可观测；延迟；VPC / PrivateLink / SSO / 气隙；熔断与背压；Ontology；Walking skeleton；队列语义；依赖故障降级；Palantir 产品词汇；企业 AI 分层清单；以及成本、幂等、限流、K8s、CAP、部署模型、SLO 等。

**MLOps / 推理基建 / 数据 SQL / 安全 / 编码 / 客户面：** 见本库 [10 概念课程](../10-概念课程/README.md) 轨道 05–10 索引；公开站仍可作诊断表，卡口回本库对应篇。

### 6. Start here 公开「必刷约 100 题」标题（口述清单）

原站写明：时间紧就开口答这一组；卡哪题就回哪条轨道。**此处只列公开标题的中文，不含解析。** 完整题干与答案在 [essentials](https://fdeinterviews.com/essentials) / [questions](https://fdeinterviews.com/questions)。

**LLM**

1. 上下文窗口是什么，生产里实际上限在哪 — 本库 [01](../09-面试题/1.LLM和AI基础/1.什么是上下文窗口.md)  
2. 模型为什么会幻觉 — 本库 [09](../09-面试题/1.LLM和AI基础/9.什么是LLM幻觉.md)  
3. 要「懂我们的文档」：Prompt、RAG、微调怎么选 — 本库 [11](../09-面试题/1.LLM和AI基础/11.prompt-rag微调选择.md)  
4. 三个具体幻觉缓解，以及各自成本 — 本库 [14](../09-面试题/1.LLM和AI基础/14.幻觉缓解方案.md)  
5. 必须稳定 JSON 但总破 schema，怎么办 — 本库 [18](../09-面试题/1.LLM和AI基础/18.JSON破坏模式问题.md)  
6. 客户说太慢：五条降延迟杠杆与权衡 — 本库 [20](../09-面试题/1.LLM和AI基础/20.降低延迟和成本方法.md)  
7. 自建开源权重 vs 付 API：真实成本怎么建模  
8. 固定延迟/成本预算下，量化 vs 蒸馏  
9. 长上下文、RAG、prompt cache 各何时用、各怎么静默失败  
10. KV cache 存什么、为何降延迟、显存如何随长度涨  

相关口述：生成循环 / 调用 API 时发生了什么 → 本库 [02](../09-面试题/1.LLM和AI基础/2.大语言模型生成回复时发生什么.md)。完整题表：[09 面试题](../09-面试题/README.md)。  

**RAG / Agent**

11. 文档怎么切块，怎么证明切块够好  
12. 关键词检索 vs 向量检索，RAG 里各自买到什么  
13. 上线前如何评测 RAG  
14. BM25 + 向量 + 重排的混合栈，每级救什么  
15. 客服 Agent（查单/退货）如何既有用又安全  
16. 永不给理财建议、保持语气、不提竞品：护栏怎么分层  
17. 完整 Eval 夹具：离线金标、LLM-judge、在线 A/B、CI 门  
18. 多跳 Agent p95 慢：延迟预算怎么切、如何砍尾延迟  
19. 数据不出 VPC 但又要前沿模型做 RAG  
20. 500 页文档、多轮、200k 窗口：记忆怎么管  

**编码**

21. Two Sum  
22. Top-K 高频元素  
23. O(1) LRU  
24. 岛屿数量  
25. 限流：固定窗 → 滑动窗 → 按客户分档  
26. 从混淆矩阵手算 P/R/F1（含零分母）  
27. 手写 k-means（初始化、空簇、收敛）  
28. 编辑距离  
29. 无重复最长子串  
30. 验证 BST（不是只比孩子）  
31. 停车场 / 电梯 / 棋：低层设计（先操作再名词）  

**ML / 数据科学**

32. P/R/F1，欺诈场景哪个值钱  
33. 偏差-方差在客户现场怎么死  
34. 过拟合：检测与工具箱顺序  
35. 试点 95%、生产 70%，发生了什么  
36. 用工程师听得懂的话讲梯度下降，以及会翻车的点  
37. 表格问题：树集成 / 线性 / 网络怎么选  
38. 何时经典 ML 打赢 LLM  
39. 推荐模型 A/B：跑多久、多少人（功效，不是「两周看看」）  
40. 离线 AUC 0.86、线上随机：训练/服务倾斜  
41. 反向传播直觉 + 深网为何训得动  
42. 排序系统用什么指标、离线 NDCG 涨但线上掉的陷阱  

**SQL / 数据工程**

43. RANK / DENSE_RANK / ROW_NUMBER 何时选错会静默脏数据  
44. 每区域每月收入 Top 3  
45. 连续登录 ≥3 天（gaps-and-islands）  
46. Join 后行数和收入爆炸  
47. 20 亿行查 40 分钟：诊断树  
48. 湖仓 vs 仓，湖上 ACID 到底买什么  
49. ETL vs ELT，何时仍必须先变换再加载  
50. 日更管道：重跑、迟到数据、三年回填也不双计  
51. 一月活跃二月不活跃（三种写法里有一种会得到空集）  

**系统 / 生产**

52. 固定窗 / 滑动窗 / 令牌桶各在哪裂开  
53. 5 万 DAU、每人 10 次 LLM：容量与成本（峰值 QPS 与 TPM）  
54. 客户调你的 API 间歇超时，你看不见他们代码  
55. 负载下 Python 服务把消息处理两遍  
56. 「做个反欺诈」：前十分钟做什么（Decomposition）  
57. 笔记本 demo → 客户 VPC 无出站：什么会断  
58. 再练一遍自建开源 vs API 的成本（CFO 看不见推理团队）  
59. LLM 产品多区域故障转移（含供应商宕机、降级答案预先设计）  
60. 试点很惊艳 → 99.9% SLA + 安全团队：路径怎么排期  
61. 对方工程师能长期用的集成 API：版本、分页、不半夜被呼叫  
62. 城市要降 911 响应时间（最常被报道的 Decomposition；别一上来做路径规划）  

**行为 / 客户**

63. 最模糊的端到端项目：第一周做了什么  
64. 为何做客户面而不是纯工程（飞行风险过滤器）  
65. 对客户说不、后来对方感谢你  
66. 失败项目：谁的责任（怪客户与表演式自责都挂）  
67. 把怀疑者变成冠军（先承认对方怀疑得对）  
68. 扮演：地区银行 VP 要「一个 chatbot」  
69. 试点「差不多好就行」：当场把成功指标谈死  
70. Demo 当场坏了，你在房间里做什么  
71. AI 安全观：什么会拒绝给客户做  
72. 过了 Eval、生产翻车  
73. 九十天采用率 12%，客户怪产品  

**MLOps**

74. MLOps 日常四条平面（别答成「也做点部署」）  
75. 特征商店解决什么：在线 vs 离线  
76. 自动重训：什么触发、如何避免漂移警报引发重训风暴  
77. 漂移统计检验与阈值（KS p 值在大规模下的坑）  
78. 新模型版本：蓝绿还是金丝雀  
79. 推理扩缩容看什么指标、冷启动  
80. 模型 CI/CD：工具、流程、最难的两件事  

**GPU / Serving**

81. 数据 / 张量 / 流水线并行与 3D  
82. KV cache 为何吃光显存；70B 怎么算  
83. 连续批 vs 静态批  
84. FP8 / INT8 / INT4 / GPTQ / AWQ：什么会坏  
85. 70B serving 的张量并行度怎么选  
86. 1000 QPS 要多少 GPU（带宽反推吞吐）  
87. vLLM vs TensorRT-LLM vs TGI  
88. 70B 塞不进单卡 80GB 的三条路  

**安全 / 治理**

89. 直接 vs 间接提示注入  
90. OWASP LLM Top 10：企业 Agent 你优先哪两条  
91. Agent 被注入掏系统提示：如何防守（承诺「永不泄露」和「没办法」都挂）  
92. PII 四道门：输入、检索、工具结果、输出  
93. ISO 42001 / SOC 2 / GDPR / EU AI Act 证据如何去重  
94. 给开发者的安全 API：密钥、范围、限额、滥用  
95. MCP：Agent 接 Salesforce / Slack / HR，如何做安全  

**产品向 ML 系统设计**

96. 个性化信息流排序  
97. 音乐推荐（冷启动、跳过即强负例）  
98. 广告排序的评测框架（拍卖、赢者偏差）  
99. 实时机器人/虚假账号  
100. 支付反欺诈模型  

### 7. 首页公开的 Lab / Work sample / 阅读室（只记名称）

动手请到原站，本库不抄剧本。

| 类型 | 公开名称（意译） | 你练什么 |
|------|------------------|----------|
| Lab 免费 | Day one on the box | 陌生机、日志、真正跑起来的配置、dry-run 证明 |
| Lab 免费 | Webhook 打了两次 | 重复投递、计费写入幂等 |
| Lab 免费 | 分数更高的候选模型 | 更好分数底下更差动作 |
| Lab 压轴（简介公开） | The first 48 hours | 密钥轮换 401、重投、ack 窗口、交接 |
| Work sample | 修客户的流式助手 | 一张工单三个机制 + 隐藏第四个缺陷 |
| Work sample | 财务 SQL 为什么错 | 三个独立缺陷、两个把总数往反方向拉 |
| 阅读室书名 | Systems Engineering for FDEs；Agentic System Design Round；The Case Rounds | 付费 PDF，本库不收录 |

### 8. 与本库其他章节的关系

- 地图级外文对照：本篇 + [Exponent 2026](./01-Exponent-FDE面试2026指南.md) + [Awesome FDE 总览](./08-Awesome-FDE课程体系总览.md)  
- 公司回路仍用本库已译指南（Palantir / OpenAI / Anthropic / Google / 初创），原站「107 家」请在 [原站 Companies](https://fdeinterviews.com/) 打开，不整站搬指南。  
- 刷完必刷清单仍卡口：回到 §3 轨道对应的本库专篇，不要在聊天里要原站题解全文。

## 可操作清单

- [ ] 打开 [essentials](https://fdeinterviews.com/essentials)，按自己背景走三条建议链接（只读书面免费页）  
- [ ] 对 §6 开口过一遍，用「会 / 晃 / 不会」三档标记，至少标出 10 个「不会」  
- [ ] 每个「不会」在本库打开对照篇，写 8 行以内自己的框架（不是抄答案）  
- [ ] 选一门公开课程的免费课，对照本库 01–03 做笔记  
- [ ] 有时间再去原站做 1 个免费 Lab，用本库 [Go-Live 清单](../08-工具箱与清单/生产Go-Live清单.md) 记「我如何证明修了」  
- [ ] 目标公司：本库公司篇 + 原站该公司页（官方链接），不要把付费公司指南贴进 git  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| FDEInterviews 首页 | https://fdeinterviews.com/ | 公开产品结构、Lab/样题名称 |
| Start here | https://fdeinterviews.com/essentials | 四段旅程、背景分流、必刷题标题 |
| Questions | https://fdeinterviews.com/questions | 11 主题轨道 |
| Concepts | https://fdeinterviews.com/concepts | 概念轨道目录名 |
| Courses | https://fdeinterviews.com/courses | 四门课公开模块名 |
| 访问日期 | 2026-10-05 | 数字以原站当时为准 |
| 版权 | FDEInterviews.com | 本篇为目录级精读与本库对照，非全文转载 |
