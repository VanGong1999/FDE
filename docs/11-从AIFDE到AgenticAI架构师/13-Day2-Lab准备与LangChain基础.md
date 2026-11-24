# Day 2 · Lab 准备：Chat Completions、结构化输出与 LangChain create_agent

一句话总结：Day 2 Lab 分四部分（看数据 → 结构化输出调用 → 可选模型/Jev → LangChain agent），先掌握 Chat Completions API、Pydantic 结构化输出、LangChain 三件套。

## Lab 四部分

1. **Examine data**：25 条理赔 + 真实决策标签。
2. **简单 LLM 调用**：用 OpenRouter + **Structured Outputs**（按 JSON spec 输出）。
3. **可选：更多模型 + Jev**：试 GPT-6 Sol 等更强模型、以及新的 Jev 模型。
4. **Agent**：用 **LangChain create_agent** 给 agent 配工具、放进循环完成目标。

Lab 文件：`Week One Day Two.ipynb`（付费模型版）与 `Week One Day Two Free.ipynb`（全免费模型版）。

## Chat Completions API（调用 LLM 的基础）

- OpenAI 发明、现已全网通用的 API。
- 构造一个 **Python 字典列表**，每条含 `role` + `content`：
  ```python
  messages = [
      {"role": "system", "content": "You're a helpful assistant who answers in the style of a pirate."},
      {"role": "user",   "content": "What is the meaning of the universe?"}
  ]
  ```
- `system` = 整体框架（角色、风格、可用工具）；`user` = 要回应的消息。
- 调用：`openrouter.chat.completions.create(model=..., messages=messages)`。
- 取回结果：`response.choices[0].message.content`。
- 演示：GPT-6 Luna 用海盗腔回答「宇宙的意义」（还 cue 了 42）。

## Structured Outputs（结构化输出）

- 要求 LLM 用 **JSON、按特定 schema** 响应。
- 用 **Pydantic**：创建 `BaseModel` 子类定义字段：
  ```python
  class ClaimDecision(BaseModel):
      rationale: str        # 理由
      decision: Literal["approve", "decline", "refer"]  # 决策
      payout: float         # 赔付金额
  ```
- 调用用 **`chat.completions.parse`**（不是 `create`），传入 Pydantic 类型 → 强制 LLM 输出可被解析成该对象。
- 取回：`response.choices[0].message.parsed`（已解析成 Pydantic 对象）。

### 一个 best practice
- **让 `rationale`（理由）排在 `decision` 之前**：LLM 先生成推理，再生成与之自洽的决策——相当于一种「思考痕迹（thinking trace）」。
- 若反过来（decision 在前），LLM 只是在给既定决策「编一个合理的解释」。

## LangChain 三件套（简化昨天的 from-scratch）

昨天（Day 1）要手写 JSON 描述工具 + for/while 循环 + if 判断；LangChain 把这些样板代码抽象掉了。

1. **`ChatOpenAI` 类**：轻量封装，描述用哪个 LLM（model + base_url + api_key）。
2. **`@tool` 装饰器**：加在普通 Python 函数上，自动转成 LLM 可调用的工具（不用手写 JSON）。
3. **`create_agent` + `invoke`**：
   - `create_agent(model, tools, system_prompt)` 创建 agent。
   - `agent.invoke(messages)` 启动。
   - 在 LangChain 里，**`invoke` 是「发起任何动作」的统一入口**（贯穿各处）。

### 幕后细节
- 调 `create_agent` 时，LangChain 内部用 **LangGraph** 构建一个 dependency graph 把多次 agent 调用串起来——但现在无需关心，Week 2 再讲。

## OpenRouter 充值与花钱卫生

- 建议充 **$2**（最低档）跑付费模型；或坚持免费版。
- **不要开启 auto top-up（自动充值）**，除非要上生产。
- 只加最低额度，给 key 设限额，保持 API key 与充值卫生。
