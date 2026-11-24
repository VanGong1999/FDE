# LLM 与 GenAI 基础（概念课程）

本目录为 **原创中文概念文**，侧重「直觉 + 工作示例 + 取舍 + FDE 现场用法」。与 `docs/09-面试题/1.LLM和AI基础/` 互补：面试题偏答题结构，本课偏概念深度与决策。

| 编号 | 标题 | 文件 |
|------|------|------|
| 01 | Tokenization 与 Token | [01-Tokenization与Token.md](./01-Tokenization与Token.md) |
| 02 | 上下文窗口 | [02-上下文窗口.md](./02-上下文窗口.md) |
| 03 | Embedding 与向量表示 | [03-Embedding与向量表示.md](./03-Embedding与向量表示.md) |
| 04 | Transformer 直觉 | [04-Transformer直觉.md](./04-Transformer直觉.md) |
| 05 | Attention 与 Self-Attention | [05-Attention与Self-Attention.md](./05-Attention与Self-Attention.md) |
| 06 | RoPE 与位置编码 | [06-RoPE与位置编码.md](./06-RoPE与位置编码.md) |
| 07 | Temperature、Top-p 与采样 | [07-Temperature-Top-p与采样.md](./07-Temperature-Top-p与采样.md) |
| 08 | 约束解码 Constrained Decoding | [08-约束解码Constrained-Decoding.md](./08-约束解码Constrained-Decoding.md) |
| 09 | Prompt 工程 | [09-Prompt工程.md](./09-Prompt工程.md) |
| 10 | 思维链 CoT | [10-思维链CoT.md](./10-思维链CoT.md) |
| 11 | LLM 为何幻觉 | [11-LLM为何幻觉.md](./11-LLM为何幻觉.md) |
| 12 | 微调 vs RAG vs Prompt | [12-微调vs-RAG-vs-Prompt.md](./12-微调vs-RAG-vs-Prompt.md) |
| 13 | RLHF 对齐 | [13-RLHF对齐.md](./13-RLHF对齐.md) |
| 14 | 奖励模型 Reward Models | [14-奖励模型Reward-Models.md](./14-奖励模型Reward-Models.md) |
| 15 | Constitutional AI 与 RLAIF | [15-Constitutional-AI与RLAIF.md](./15-Constitutional-AI与RLAIF.md) |
| 16 | KV Cache | [16-KV-Cache.md](./16-KV-Cache.md) |
| 17 | LoRA 与参数高效微调 | [17-LoRA与参数高效微调.md](./17-LoRA与参数高效微调.md) |
| 18 | DPO 直接偏好优化 | [18-DPO直接偏好优化.md](./18-DPO直接偏好优化.md) |
| 19 | PPO 与 GRPO 策略优化 | [19-PPO与GRPO策略优化.md](./19-PPO与GRPO策略优化.md) |
| 20 | MoE 混合专家 | [20-MoE混合专家.md](./20-MoE混合专家.md) |
| 21 | Scaling Laws 缩放律 | [21-Scaling-Laws缩放律.md](./21-Scaling-Laws缩放律.md) |
| 22 | 推理时计算 Inference-Time Compute | [22-推理时计算Inference-Time-Compute.md](./22-推理时计算Inference-Time-Compute.md) |
| 23 | 多模态与 VLM | [23-多模态与VLM.md](./23-多模态与VLM.md) |
| 24 | Diffusion 扩散模型 | [24-Diffusion扩散模型.md](./24-Diffusion扩散模型.md) |
| 25 | 语音与 Voice AI | [25-语音与Voice-AI.md](./25-语音与Voice-AI.md) |
| 26 | 自回归解码 | [26-自回归解码.md](./26-自回归解码.md) |
| 27 | 模型路由与级联 | [27-模型路由与级联.md](./27-模型路由与级联.md) |
| 28 | Prompt 缓存与语义缓存 | [28-Prompt缓存与语义缓存.md](./28-Prompt缓存与语义缓存.md) |
| 29 | 企业部署模型选型 | [29-企业部署模型选型.md](./29-企业部署模型选型.md) |
| 30 | 结构化输出与 Schema 校验 | [30-结构化输出与Schema校验.md](./30-结构化输出与Schema校验.md) |
| 31 | System One 决策模型 Jev | [31-System-One决策模型Jev.md](./31-System-One决策模型Jev.md) |

## 建议阅读顺序

1. **表征与骨架**：01 → 02 → 03 → 04 → 05 → 06  
2. **生成与控制**：07 → 08 → 26 → 30 → 09 → 10  
3. **系统杠杆**：11 → 12 → 16 → 27 → 28 → 29  
4. **对齐与训练**：13 → 14 → 15 → 17 → 18 → 19  
5. **规模与模态**：20 → 21 → 22 → 23 → 24 → 25  
6. **收束决策**：31  

## 与面试题目录

重叠主题（窗口、token、embedding、温度、幻觉、RAG/微调等）请以本课建立概念，再到 `docs/09-面试题/1.LLM和AI基础/` 练习答题结构；各文末已尽量互链。
