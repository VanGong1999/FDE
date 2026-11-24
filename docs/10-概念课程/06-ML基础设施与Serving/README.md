# 06 · ML 基础设施与 Serving

面向 FDE 的推理与训练基础设施概念轨道：显存、量化、蒸馏、Serving 引擎、连续批处理、PagedAttention、推测解码、分布式训练（FSDP）、GPU 执行模型，以及多租户吵闹邻居治理。原创中文，强调容量规划与现场取舍；与 `docs/05-能力补强/GCP云架构与基础设施.md`、`docs/03-AI落地/生产化清单.md` 交叉阅读。

## 怎么读

1. **容量底座**：**01 显存** → **09 GPU 架构**——先懂瓶颈。  
2. **变小变快**：**02 量化**、**03 蒸馏**、**07 推测解码**。  
3. **Serving 主链**：**04 引擎** → **05 连续批处理** → **06 PagedAttention** → **10 公平份额**。  
4. **训练侧了解**：**08 FSDP**（微调/全参方案对话用）。

## 主题索引

| # | 文件 | 一句话 |
|---|------|--------|
| 01 | [GPU显存与VRAM](./01-GPU显存与VRAM.md) | 权重+激活+KV 抢桌面 |
| 02 | [量化Quantization](./02-量化Quantization.md) | 少比特换显存带宽 |
| 03 | [知识蒸馏Distillation](./03-知识蒸馏Distillation.md) | 教师教出便宜学生 |
| 04 | [推理Serving-vLLM-TGI](./04-推理Serving-vLLM-TGI.md) | 引擎与网关分层 |
| 05 | [连续批处理Continuous-Batching](./05-连续批处理Continuous-Batching.md) | 迭代级上下船 |
| 06 | [PagedAttention](./06-PagedAttention.md) | KV 像虚拟内存分页 |
| 07 | [推测解码Speculative-Decoding](./07-推测解码Speculative-Decoding.md) | 小稿大核加速解码 |
| 08 | [分布式训练与并行FSDP](./08-分布式训练与并行FSDP.md) | 分片数据并行省显存 |
| 09 | [GPU架构与执行模型](./09-GPU架构与执行模型.md) | 吞吐型与带宽绑定 |
| 10 | [吵闹邻居与KV公平份额](./10-吵闹邻居与KV公平份额.md) | 多租户隔离爆炸半径 |

## 与本库其它文档

- [生产化清单](../../03-AI落地/生产化清单.md)
- [GCP云架构与基础设施](../../05-能力补强/GCP云架构与基础设施.md)
- [05-MLOps与生命周期](../05-MLOps与生命周期/README.md)
- [04-生产系统设计](../04-生产系统设计/README.md)
- [01-LLM与GenAI基础](../01-LLM与GenAI基础/README.md)（KV Cache、选型、路由等）
