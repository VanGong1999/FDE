# 精读总览：Awesome FDE 课程体系

> 原文形态：Awesome Forward Deployment Engineering 课程/资源清单  
> 精读日期：2026-09-23  
> 受众：转岗与在职 FDE；偏 GCP / Agent / 气隙补充  

## 精华摘要

该资源把 FDE 定义为 **软件工程师 × AI/数据架构师 × 战略顾问** 的混合体——「技术特种作战」，补上核心产品与客户脏现实之间的 **Delta（差距）**。

课程骨架分三阶段：**数据工程基石 → 云架构（GCP）→ 咨询心智**；另有应用 AI 手册（ADK、双环 Eval、企业 RAG）、**气隙/战术边缘** 专章、软技能栈、面试 Blackbook（C.A.S.E. + Delta 案例）、可复制产物模板，以及阅读清单与术语表。

本库已将其 **拆分翻译** 进对应目录（见下表），避免单文件 600+ 行难导航；本篇作地图与署名。

## 重点内容

### 已落入本库的位置

| 原章节 | 本库文档 |
|--------|----------|
| Persona / SWE vs FDE | 见下「角色补充」+ [什么是 FDE](../01-角色认知/什么是FDE.md) |
| Phase 1 数据工程 | [数据工程基石课程](../05-能力补强/数据工程基石课程.md) |
| Phase 2 GCP | [GCP 云架构与基础设施](../05-能力补强/GCP云架构与基础设施.md) |
| Phase 3 / Soft Stack | [咨询思维与软技能栈](../02-交付方法论/咨询思维与软技能栈.md) |
| ADK / Agents CLI / RAG | [Google ADK 与多 Agent](../03-AI落地/Google-ADK与多Agent编排.md) |
| Eval 双环 | [LLM 评测双环](../03-AI落地/LLM评测双环.md) |
| Air-Gap | [气隙与战术边缘部署](../05-能力补强/气隙与战术边缘部署.md) |
| Interview Blackbook | [C.A.S.E. 与 Delta 案例](../04-面试通关/CASE框架与Delta案例.md) |
| Templates | [现场勘察与范围文档](../08-工具箱与清单/现场勘察与范围文档.md) |
| Reading List | [扩展阅读清单](../00-导读/扩展阅读清单.md) |
| Glossary | 已并入 [术语表](../00-导读/术语表.md) |

### 角色一句（意译）

传统 SWE 为「用户画像」而建；FDE 为 **使命（mission）** 而建。代码比例常接近「一半集成胶水、一半策略与对齐」。

### 原作者寄语（意译）

> FDE 的目标是在客户现场让自己变得多余——因为你建的系统足够好，能自行运转。

## 可操作清单

- [ ] 按上表把缺口章节排进学习周历  
- [ ] 若做政府/国防向：优先读气隙篇  
- [ ] 若目标 GCP/Agent 岗：ADK + 评测双环 + GCP 架构  
- [ ] 面试前：C.A.S.E. 案例口述  

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| Awesome FDE 整理稿（用户入库） | 原 `需要整理进这个仓库.md` | 全文拆分翻译之总览 |
| 策展人 Pier Paolo Ippolito | https://www.linkedin.com/in/pierpaolo28/ | 署名 |
| 策展人 Paolo Perrone | https://www.linkedin.com/in/paoloperrone/ | 署名 |
| Palantir Dev vs Delta | https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87 | Delta 源头对照 |
