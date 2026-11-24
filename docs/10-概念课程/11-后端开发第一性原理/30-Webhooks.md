# 30 · Webhooks

一句话直觉：Webhook 是「对方服务器在事件发生时主动 POST 回调你」——通信方向反过来了；你不再轮询，但必须自己处理验签、超时、重试与幂等。

## 本课要解决什么问题

本课之前的默认模型是：**客户端发起连接，服务器再响应**。实时系统课里，服务器可以「推」数据给客户端，但前提仍是：客户端先建立连接，之后服务器才能往这条连接上写。

Webhook 打破的是另一层前提：

- 不是浏览器 ↔ 服务器，而是 **服务 ↔ 服务**（两个后端）
- **没有人类、没有浏览器长连接**参与
- 事件发生在对方系统里（如 Stripe 支付成功），你的系统必须可靠地知道这件事

典型痛点（以付费任务板为例）：

1. 用户付款走 Stripe，成功发生在 **Stripe 的系统**，不在你这边
2. 你不能指望「浏览器收到成功页再告诉后端」——用户网络抖、关标签、机器崩溃都会丢信号；且客户端信号可被伪造，**不能当支付真相源**
3. 若用轮询：延迟（间隔一半）、大量空请求、对方会限流 → 信号更慢

本课要回答：

- Webhook 是什么？和 API 调用、实时推送差在哪？
- 一次投递长什么样？超时与成功判定？
- 如何证明「真是提供商发来的」？如何防重放、防伪造？
- 「至少一次」投递下如何幂等？顺序乱了怎么办？
- 接收端如何扛住尖峰？自己当提供商时如何用 Outbox 发 Webhook？
- 何时该用 Webhook，何时不该用它来「同步整份数据」？

---

## 核心概念详解

### 1. Webhook = 反向的 API 调用（服务器回调你）

**定义**：某服务在事件发生后，按你事先登记的 URL，发一条普通的 **HTTP POST**（常见是 JSON body），把事件数据推给你。

| 角色 | 含义 |
|------|------|
| **Provider / Sender** | 事件真实发生的一方（Stripe、GitHub…） |
| **Consumer / Receiver** | 你：暴露 endpoint，收 POST |
| **Endpoint** | 你登记并监听的 URL |
| **Event** | 预定义事件类型（支付成功、`push`、任务移动…） |
| **Delivery** | **一次**把该事件送到 endpoint 的尝试；**同一事件可有多次 delivery** |
| **Subscription** | 登记：URL + 关心哪些 event 类型（常还有 secret） |

历史直觉（了解即可）：2007 Jeff Lindsay 提出类似 Unix pipe 的「事件发生就推输出」的 Web 原语，称 webhooks（用户定义的 HTTP POST 回调）。两年后 Google 在博客订阅上做了 PubSubHubbub。各家文档术语略有出入，但上表结构通用。

**和「客户端发起」的对比**：

| | 普通 API | Webhook |
|--|----------|---------|
| 谁主动 | 你调对方 | **对方调你** |
| 时机 | 你需要时问 | **事件发生时告** |
| 典型用途 | 查状态、下单 | 支付结果、CI 触发、解锁套餐 |

**和实时系统课的区别**：

| | 实时（WS / SSE / 长轮询） | Webhook |
|--|---------------------------|---------|
| 参与方 | 浏览器/客户端 ↔ 你的服务器 | **后端 ↔ 后端** |
| 连接 | 客户端先建连，再推 | 无常驻浏览器流；对方发完即止 |
| 可靠性诉求 | 体验延迟 | **业务真相**（钱、权限），不能丢、不能信客户端 |

Webhook 本身不炫技：就是一条 POST。难的是周边：验签、超时、重试、幂等、顺序、SSRF。

---

### 2. 为何不用轮询？（推 vs 拉）

暴力方案：付款后自己每秒调 Stripe「查状态」。

问题：

1. **延迟**：轮询间隔 1s → 平均延迟约 0.5s（实时课同一公式）
2. **浪费**：pending 期间每次请求都白打
3. **对方负载**：若上万商户都每秒轮询 → 提供商数千～上万 RPS → **严限流** → 你只能拉长间隔（如 60s）→ 平均延迟约 30s

正确方向：**翻转通信方向**——信任提供商在结果确定后主动告诉你。这就是 Webhook。

---

### 3. 一次投递的解剖（以 GitHub 为例）

典型请求包含：

- `POST` 到你登记的 URL
- `Content-Type: application/json`
- 事件类型头（如 `X-GitHub-Event`）
- **Delivery ID** 头（如 `X-GitHub-Delivery`）——幂等关键
- **签名**头（如 `X-Hub-Signature-256`）
- Body：事件 JSON

**成功判定**（提供商视角）：

1. **状态码**：通常 **2xx**（200 / 202 等）算成功；3xx / 4xx / 5xx 算失败
2. **时间窗**：必须在时限内返回。例：GitHub ~10s、Shopify ~5s、Slack / Microsoft Graph ~3s —— **务必读各家文档**

提供商常保留「recent deliveries」：请求头、payload、你的响应，便于排障。

**Handler 典型骨架**：

1. 读 **原始 body（字节）**
2. **验签**
3. 记录 delivery ID（并与业务副作用同事务）
4. 尽快回 2xx
5. 重活交给后台 worker（见后）

本地开发：笔记本在家用路由后，**公网进不来 localhost**。用 **ngrok / Cloudflare Tunnel** 等隧道：临时 HTTPS URL → 转到本地端口，再把该 URL 登记为 webhook。

**多提供商**：每个提供商单独路径，如 `/hooks/github`、`/hooks/stripe`，**不要**共用 `/hooks/callback`。原因：头格式、签名算法、重试策略、握手方式都不同，handler 必须分开。

---

### 4. 握手（Handshake）与为何需要

部分提供商在正式推事件前先「验活」：

| 提供商 | 握手大致行为 |
|--------|----------------|
| Microsoft Graph | 要你原样返回 validation token（明文） |
| Discord | ping → 你回 pong |
| Amazon SNS | 订阅确认消息 + 需访问确认 URL |

**为何加这一步**：无握手时，攻击者可把**受害者 URL**登记到提供商，订阅大量事件 → 把提供商变成 DDoS 炮台打受害者。握手证明「你控制该 URL」。

---

### 5. 信任问题：公开 URL 上的 POST 不能信

Webhook URL 往往可猜（`/hooks`、`/webhooks`、`/callback`）。攻击者伪造「支付成功」JSON → 白嫖解锁套餐。

**HTTPS 不够**：HTTPS 防的是**传输中窃听/篡改**，不证明「谁写了这份 body」。必须证明：**数据来自共享密钥/公钥体系下的提供商**。

#### 五种常见证明方式

| # | 方式 | 说明 |
|---|------|------|
| 1 | URL 里塞 secret | 弱：URL 进日志（本机、CloudWatch、ES…）易泄漏 |
| 2 | IP allowlist | 防火墙只放行提供商公布的出口 IP；更好，但**不够单独用** |
| 3 | mTLS | 提供商发客户端证书 |
| 4 | **HMAC 签名**（主流，约 65–80%） | 共享 secret，对 body（或约定字符串）算签名放 header |
| 5 | 公钥验签 | 提供商私钥签，你用公钥验（如 Discord） |

本课主讲第 4 种：**HMAC（Hash-based Message Authentication Code）**，常用 HMAC-SHA256。

流程直觉：

1. 提供商用共享 secret 对约定内容算指纹 → 放进 header
2. 你对收到的**同一字节序列**用同一 secret 再算一遍
3. **常量时间比较**两边签名；一致才处理

#### 「签了什么」因提供商而异

| 提供商/规范 | 签名内容（示意） |
|-------------|------------------|
| GitHub | 仅 body |
| Stripe | `timestamp.body`（时间戳进签名 → 防重放） |
| Standard Webhooks | `id.timestamp.body` |
| Twilio | 完整 URL + 排序后的 form 字段（SHA-1）等 |

**必须查文档**，不要假设「都只签 body」。

#### Raw body 陷阱（极常见）

签名算在**精确字节**上。若 Express 等先 `json()` 解析再 `JSON.stringify` 回去再验签：空格/键序不同 → 字节不同 → HMAC 永远对不上。

**铁律：先读 raw bytes → 验签 → 再 parse。禁止 parse → 再 encode → 再验。**

#### 重放（Replay）与时间戳

攻击者截获一次合法投递，一小时后再 POST 同一包（或刷 1000 次）：签名仍真 → 验签通过。

对策：把**时间戳纳入签名内容**（如 Stripe）；库侧拒绝过旧请求（Stripe 示例约 5 分钟）。时间戳被改会破坏签名。

#### 常量时间比较

普通 `==`：第一个不同字节就提前返回 → 耗时泄露 → 攻击者可逐字节猜签名。

用语言提供的常量时间比较：

- Go：`hmac.Equal`
- Node：`crypto.timingSafeEqual`
- Python：`hmac.compare_digest`

---

### 6. 提供商侧危险：SSRF

你登记 URL 时，提供商从**自己的内网**去 POST 该 URL。攻击者可登记指向云元数据服务（如 `169.254.169.254`）或内网管理地址的 URL → **服务端请求伪造（SSRF）**，偷凭证、打内网。

仅「注册时检查 URL」不够：DNS 可先解析到公网再改成内网，或 302 跳到内网。

提供商侧正确防御（你自己发 Webhook 时也要学）：

1. **每次发送前**自行解析 DNS，对照固定的私网地址黑名单
2. **绝不跟随 HTTP 重定向**（3xx）
3. 仅把 **2xx** 当成功（这也解释了为何 webhook 生态里非 2xx 一律失败）
4. 尽量从隔离网络经 **egress proxy** 出站（Stripe 开源过 Smokescreen 一类思路）

---

### 7. 至少一次（At-least-once）、幂等与顺序

#### 为何一定是「至少一次」、从不是「恰好一次」

你已处理完并回了 200，但响应在网络/LB 重启中丢失 → 提供商认为失败 → **用相同 payload 再投递**。你已做过副作用，却会再收到同一事件。

文档常写 **at least once**：保证至少到一次，**可能多次**；**exactly once 在这套模型里不可得**（ACK 可能丢）。

#### 幂等做法

提供商给稳定 **delivery / event ID**（GitHub：`X-GitHub-Delivery`；Stripe：body 里 event id；Standard Webhooks：webhook id）。**同一事件的多次重试，该 ID 不变。**

实践：

1. 表存已处理的 delivery ID，**唯一约束**
2. **插入 delivery ID 与业务副作用放在同一 DB 事务**

| 错误顺序 | 后果 |
|----------|------|
| 先做事，后记 ID，中间崩溃 | 重试时以为没做过 → **重复副作用** |
| 先记 ID，后做事失败 | 重试时以为做过 → **永久漏做** |
| 同事务两者一起 | 要么都成功，要么都回滚 → 安全 |

**幂等**：同一请求调多少次，可观察效果只发生一次（由 handler 设计保证）。

#### 顺序问题（Stripe 2017 案例直觉）

对同一对象：先 `created` 再 `deleted`。`created` 因部署失败延后重试；`deleted` 先成功。你先收到 delete、后收到 create → 库里可能留下「已删除对象」的脏行。

Stripe 文档明确：**事件不保证顺序**；秒级时间戳在 1 秒内碰撞时也无法靠时间戳排序。

对策：

1. **把 webhook 当信号，不当真相**：收到后调提供商 API 拉**当前状态**再决策（多一次 API，但顺序无关）
2. 对象带 `version` / `updated_at`，只应用「比本地新」的更新（同事务）
3. 缓冲等待更早事件——难预测，少用
4. 少数提供商卖「严格顺序」——额外收费

---

### 8. 重试、退避与「瘦接收端」

失败（非 2xx、超时、无响应）→ 提供商按**自家时间表**重试：

| 提供商 | 重试直觉 |
|--------|----------|
| Stripe | 指数退避，可长达约 3 天；仍失败则禁用 endpoint 并邮件通知 |
| Svix（Webhook 即服务） | 立即 → 5s → 5min → 30min → 2h → 5h → 10h… |
| GitHub | **默认不重试**；需手动 Redeliver 或脚本调 API 拉失败再投 |

超时窗口很短（3–10s）+ 重试叠加 + 月初账单批量续费 / 营销工具百万级回执等尖峰 → 若 handler 里同步：验签 + 改多表 + 调外部 API，极易超时 → **更多重试 → 雪崩**。

**理想接收路径（瘦 handler）**：

1. 读 body  
2. 验签  
3. 落库/入队 delivery  
4. **立刻 2xx**  
5. **停** —— 业务副作用由 **队列 + 后台 worker** 异步做（呼应任务队列课）

---

### 9. 自己当提供商：Outbox + Dispatcher

场景：任务板 `task.moved`，客户登记 URL，你发事件。

**天真做法**：move handler 里直接 `http.Post` 客户 URL —— 三个坑：

1. 客户慢/挂 → **你的 API 延迟被拖死**
2. 库已更新，发 webhook 前进程挂了 → **有状态无通知**
3. 先发 webhook 再写库，写库失败 → **告诉客户已发生，实际未发生**

**Outbox 模式**（同库一张表，类似 WAL 思想用在事件上）：

1. 同一事务：`UPDATE tasks` + `INSERT outbox`（完整事件）  
2. 提交  
3. 独立 dispatcher / worker 读 outbox，异步投递  

Dispatcher 要点：

- 按 endpoint secret 签名（如 Standard Webhooks：`id.timestamp.body`）
- POST，常见超时约 **10s**
- 记录每次 attempt（状态码、响应前 2KB、时间）
- 成功 → delivered；失败 → **指数退避 + jitter** 排下次；尊重对方 `Retry-After`
- 连续失败达阈值 → 标记 exhausted，可禁用 endpoint 并通知主人
- **每 endpoint 一队列**：一家坏 URL 不堵死其他客户
- **每次发送前**做 SSRF 防护（不仅注册时）

指数退避：间隔拉长（5s → 5min → 15min → 1h…）。  
**Jitter**：再加随机秒数，避免千家客户同一秒齐射。

实现 Webhook 投递系统很重（安全 + 重试 + 边缘情况）→ 许多公司用 **Svix** 等「Webhook as a Service」外包这块。

---

### 10. 何时该用 / 不该用 Webhook

**适合（当通知）**：

- 事件发生 → 发聊天通知、触发 CI、解锁付费计划等「副作用信号」

**误用（当主同步管道）**：

用 webhook 把 Clerk 等 Auth 提供商的用户/组织/角色**完整镜像**到本地库以减延迟：必须独自扛超时、重放、乱序……副本很容易脏。

**更稳的同步思路**（仍可用 webhook，但角色变了）：

提供商有**有序 event log**（自家事务写入，无分布式投递乱序问题）：

1. **非紧急**：定时 worker 拉 `/events`，从上次 `last_event_id` 继续追  
2. **近实时**：订阅「log 有新条目」的 webhook —— 当**唤醒信号**，再从 `last_event_id` 拉 log 追平  

Webhook 负责「有事了」，**有序 log + 游标**负责「数据正确」。

---

## 后端规则与最佳实践（Checklist）

- [ ] 支付/权限等关键信号：**只信服务端 webhook（或服务端查提供商 API）**，不信浏览器回调
- [ ] 每个提供商独立 URL 与 handler（`/hooks/stripe` ≠ `/hooks/github`）
- [ ] 读文档：超时秒数、重试表、签名字符串格式、握手要求、是否自动重试
- [ ] 验签：共享 HMAC 或公钥；**raw body 先验后 parse**
- [ ] 防重放：校验签名内时间戳 / 窗口（如 5 分钟）
- [ ] 比较签名用 **常量时间** API
- [ ] HTTPS 必要但不充分；配合 secret + 验签（± IP allowlist）
- [ ] 假设 **at-least-once**：按 delivery/event ID 幂等；ID 与副作用 **同事务**
- [ ] 不假设顺序；关键状态以提供商 API 或 version 字段为准
- [ ] 接收端极瘦：验签 → 持久化/入队 → 2xx；重活异步
- [ ] 本地调试用隧道（ngrok / Cloudflare Tunnel）
- [ ] 自己发 webhook：Outbox 同事务；dispatcher 签名、超时、退避+jitter、SSRF 每次解析、按 endpoint 隔离队列
- [ ] 同步副本：优先 **event log + 游标**；webhook 只做唤醒

---

## 常见坑与反模式

| 坑 / 反模式 | 为何糟 |
|-------------|--------|
| 轮询支付状态当主方案 | 延迟、浪费、被限流 |
| 客户端「支付成功」当真相 | 不可靠 + 可伪造 |
| 共用 `/hooks/callback` | 验签/重试差异缠在一起 |
| parse JSON 后再 stringify 验签 | 字节不一致，全部失败 |
| 普通字符串 `==` 比签名 | 时序侧信道 |
| 超时窗口内做完整业务 | 触发重试雪崩 |
| 不做幂等 | 重复解锁、重复记账 |
| 先副作用后记 ID（或反过来）且无事务 | 重复或漏处理 |
| 按 webhook payload 盲信顺序建副本 | 幽灵行 / 脏数据 |
| 用 webhook 硬同步整库 | 边缘情况爆炸；应用 log+游标 |
| 发 webhook 同步打在请求路径 | 客户慢拖垮你；崩溃丢投递或谎报 |
| 注册时才查 SSRF、发送时不查 | DNS 重绑定绕过 |
| 跟随客户 URL 的 3xx | SSRF 经典入口 |
| 依赖 GitHub 自动重试 | GitHub 默认不重试，需自建补投 |

---

## 与前后课的关系

| 课 | 关系 |
|----|------|
| **实时后端系统** | 同属「推」；实时是客户端先连再推；Webhook 是 **后端↔后端**、无浏览器流 |
| **HTTP / 安全** | 签名、HMAC、常量时间比较、HTTPS 边界 |
| **后台任务与队列** | 瘦 handler + worker；Outbox 投递 |
| **数据库 / 事务** | delivery ID 与副作用同事务；Outbox 与业务同事务 |
| **十二要素 / DevOps** | 本地隧道、公网入口；生产 inbound 与 egress 安全 |
| **下一课 DevOps** | 隧道只是开发期；上线后真实公网 endpoint、TLS、部署与重试负载 |

---

## 参考来源

- 源字幕：`待整理的后端开发课程/30.md`
- 课程主题：Webhooks（反向 API、验签、重试、幂等、Outbox、同步误用）
- 关联标准/产品直觉：GitHub / Stripe / Shopify / Slack / Discord / SNS / Standard Webhooks / Svix；Clerk event log 同步模式
`)