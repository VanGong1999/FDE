# Google ADK 与多 Agent 编排

> 整理自 Awesome FDE「Multi-Agent Orchestration with Google ADK」。  
> 产品名与控制台品牌会演进（文中保留原文常见称谓并注明 formerly）；以官方文档为准。

FDE 是「前沿研究」与「生产级部署」的桥梁。Google **Agent Development Kit（ADK）** 是开源、代码优先的多 Agent 框架，把 Agent 开发当**软件工程**：模块化、层级、可确定性控制。

---

## 1. ADK 核心原语

| 概念 | 含义 |
|------|------|
| **按设计的多 Agent** | 层级组合专职 Agent（如 Manager 委派 Researcher / Coder） |
| **A2A（Agent2Agent）协议** | 开放标准，Agent 间经一致 HTTP 接口发现与通信 |
| **模型无关** | 优化 Gemini，亦可经 LiteLLM 接 GPT / Claude / Mistral 等 |
| **部署** | 与 Gemini Enterprise Agent Platform / Agent Runtime（原 Vertex AI Agent Engine 等）集成，托管扩缩 |

仓库与文档：https://github.com/google/adk-docs 、https://github.com/google/adk-python  

生产默认可参考本库原则：能固定工作流就少给无限自主——见 [Agent 与工具调用](./Agent与工具调用.md)。

---

## 2. Agents CLI（生命周期工具）

Awesome 稿记载：Google Cloud Next '26（约 2026-04-22）发布的 **Agents CLI**（Alpha），面向 ADK 在 GCP 上的脚手架 → 评测 → 部署 → 发布 → 可观测。

它**不是**替代 Cursor/Claude Code 等编码工具，而是一套 **skills**，让编码 Agent 自动发现并成为「ADK 专家」；也可独立在终端运行。

| Skill（概念名） | 覆盖 |
|-----------------|------|
| workflow | 生命周期编排、保代码规则、模型选择 |
| scaffold | create/enhance/upgrade；DESIGN_SPEC、测试与 eval 集 |
| adk-code | Agent、工具、回调、状态、编排 API 模式 |
| eval | 数据集、LLM-as-judge、工具轨迹评分 |
| deploy | Agent Runtime / Cloud Run / GKE；账号、密钥、回滚 |
| publish | 注册到 Gemini Enterprise / Agent Registry |
| observability | Cloud Trace、提示日志、BigQuery 分析、第三方 APM |

**对 FDE 的价值**：填补「本地原型 → 云上生产」曾靠手拼 `gcloud` + Terraform + CI 的鸿沟。

示例命令（以官方 Getting Started 为准，版本会变）：

```bash
uvx google-agents-cli setup
agents-cli create finance-agent -y --deployment-target agent_runtime
cd finance-agent
agents-cli eval run
agents-cli deploy
agents-cli publish gemini-enterprise
```

要求直觉：Python 3.11+、`uv`、Node（装 skills）；部署可选 gcloud / Terraform；平台 macOS/Linux/WSL2。

文档入口：

- https://google.github.io/agents-cli/guide/getting-started/  
- https://github.com/google/agents-cli  
- 发布博文（Awesome 引用）：https://developers.googleblog.com/agents-cli-in-agent-platform-create-to-production-in-one-cli/  

---

## 3. 企业 RAG 蓝图（GCP 透镜）

1. **Ingestion**：复杂 PDF/表格可用 LlamaParse 等解析  
2. **Grounding / 托管检索**：Agent Search 等托管 RAG（原 Vertex AI Search 等产品线）  
3. **向量索引**：平台 Vector Search  
4. **混合检索**：向量 + BM25，照顾行业专有名词  

通用方法论仍以本库 [RAG 实战精要](./RAG实战精要.md) 为准（权限、引用、拒答）。

---

## 4. 关键资源速查

| 资源 | 链接 |
|------|------|
| ADK Python | https://github.com/google/adk-python |
| Agent Starter Pack | https://github.com/GoogleCloudPlatform/agent-starter-pack |
| Pinecone RAG Learning Center | https://www.pinecone.io/learn/series/rag/ |
| Codelab：Agents CLI → Production | https://codelabs.developers.google.com/agents-cli-agent-platform/agents-cli-agent-platform |

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE — ADK / Agents CLI / RAG | 整理稿 | 中文整理 |
| Google ADK / Agents CLI 官方 | 见上 | 权威细节 |
