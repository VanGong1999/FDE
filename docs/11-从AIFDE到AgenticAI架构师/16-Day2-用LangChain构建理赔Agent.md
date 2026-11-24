# Day 2 · 用 LangChain create_agent 与 Tools 构建理赔 Agent

一句话总结：用 LangChain 的 `ChatOpenAI` + `@tool` + `create_agent` + `invoke` 构建理赔 agent，并得出重要结论——**agent 不是永远正确的答案**，只在需要自主性时用。

## 构建步骤

1. **`ChatOpenAI` 对象**：model（GPT-6 Luna）+ base_url（OpenRouter）+ api_key（来自 `.env`）+ low reasoning effort。
2. **两个工具（`@tool` 装饰器）**：
   - `get_policy`：查客户购买的实际保单。
   - `record_decision`：把 LLM 的响应写进 `recorded` 字典（按 claim_id 记录决策）。
3. **`create_agent(model, tools, system_prompt)`**。
4. **`agent.invoke(messages)`** 启动。

## 关键设计差异（vs 昨天的结构化输出）

- 昨天：把**客户保单直接塞进 user prompt**。
- 今天：**不塞保单**，而是把它作为一个工具（`get_policy`）让 agent **自己去检索**——这正是「给 agent 工具 + 自主性」的体现。
- 系统提示：「用你的工具查保单、记录决策」+ 完整政策措辞；用户提示：「这是这条 claim」。

## 运行结果

- 单条演示：agent 调 `get_policy` 拿到保单 → 调 `record_decision` 记录 → 输出 **approve、$420**（正确答案）。
- 25 条全跑：agent **17/25** vs 直接 LLM 调用 **18/25**；agent **更贵、更慢**（多了工具调用）。
  - 讲师认为 17 vs 18 只是**噪声（noise）**，多数时候二者打成平手（dead heat）。

## 核心教训：Agent 不是永远正确的答案

- 学员的质疑很自然：「同样模型，agent 更慢、更贵、这次还略差，那要 agent 干嘛？」
- **答案**：agent 的价值是引入 **自主性（autonomy）**——让 LLM 自己选择用哪个工具、探索数据、跑不同查询、做判断。
- 但在本任务里这是「**假自主**」：工作流是**固定的**（总是先查保单、再记录决策），强行塞进 agent 是「把 agent 功能用错了地方」。
- 结论：**需要额外能力/灵活性时用 agent；固定工作流用简单的「结构化输出 LLM 调用」即可**。复制人类理赔员 ≠ 一定要用 AI agent。

## 为什么还要继续学 agent（前瞻）

- 因为**才刚开始**：从「manual」案例已经看到，某些题需要更多信息。
- 给 agent **更多工具 + 更多自主性**（能自己决定做什么），虽然可能更慢/更贵，但**能做更多事**，最终会得到**更准**的结果——这是后续几天的方向。

## 课后作业（Assignment）

- 在 Lab 里实验不同模型与不同方法（可给 agent 加新工具）。
- 目标：**用 agent 稳定拿到至少 15 条正确**，并找出能做到的**最便宜模型**（尽量低到免费）。
- 完成后：
  1. **提交 PR** 到 repo（你的版本 + 结果，进入 community contributions 文件夹，不改主 Lab）。
  2. 发 **LinkedIn** 分享 takeaways（准确率/速度/成本的权衡发现），tag 讲师，讲师会评论放大曝光。

## 收尾

- 讲师自嘲：原以为 Day 2 比 Day 1 短，结果更长，但「值得」。
- 完成 Week 1 Day 2 = 课程进度 **13%**。
- 预告：**Day 3 = Coding Agents（编码代理）**。
