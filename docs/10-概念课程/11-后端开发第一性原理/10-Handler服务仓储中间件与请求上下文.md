# 10 · Handler、服务、仓储、中间件与请求上下文

一句话直觉：一个 HTTP 请求进了服务器之后，会穿过**中间件链 → 路由 → Handler（取数/校验）→ Service（办事）→ Repository（碰库）**，全程可以往 **Request Context** 里放「本请求专用」的共享状态，并带着超时/取消信号往下传。

## 本课要解决什么问题

前面几课沿着请求从外到内讲了 HTTP、路由、序列化、认证、校验。本课把**服务器内部**拼成一张完整地图：

1. 请求生命周期（Request Lifecycle）在服务器里长什么样？
2. Handler / Service / Repository 各自干什么、为何要拆？
3. 中间件是什么、`next` 是什么、**顺序**为何致命？
4. Request Context 解决什么耦合问题？超时与取消如何用？

> 说明：三层拆分是**可维护性设计模式**，不是语言硬性规定；小脚本可以全写在一个函数里，但生产级代码几乎总会分层。

## 核心概念详解

### 1. 服务器内的请求生命周期

客户端发出请求 → 操作系统把到达某端口（3000/4000…）的连接交给你的进程 → **入口**。

自此到写出响应，内部大致经历：

```
入口
  →（可选）全局中间件（CORS、日志、限流…）
  → 路由匹配（/users、/users/:id …）
  →（可选）路由级中间件（认证、权限…）
  → Handler / Controller
       → 绑定/反序列化 → 校验与转换
       → 调用 Service
            →（可选）调用 Repository / 外部 API / 发信…
       ← 得到结果
  → Handler 决定状态码与响应体
  →（可选）尾部中间件（压缩、全局错误处理）
  → 响应回客户端
```

此前课程讲的是「客户端 ↔ 服务器」外部生命周期；本课补上**墙内**这一段。

### 2. Handler / Controller 职责

路由把请求映射到预先注册的函数——**Handler**（有的生态叫 Controller）。

运行时通常注入：

- **Request**：读 method、path、query、headers、body…
- **Response**：写状态码、headers、body…

（具体 API 因 Go / Express / Python 框架而异，模式相同。）

#### Handler 典型步骤（生产级理想路径）

1. **取出数据**  
   - GET → query（及 path params）  
   - POST/PUT/PATCH → body（DELETE 视约定）  

2. **反序列化 / Binding**  
   - JSON → 本地类型（Go struct、Python dict/class、Rust struct…）。  
   - Node 常在更上游用 `json body parser` 中间件完成，Handler 里已是对象。  
   - 绑定失败 → **400**，终止。

3. **校验与转换**（第 9 课）  
   - 必填、类型、语义、默认值（如未传 `sort` 则默认 `date`）。  
   - 建议：Query 参数尽量设计为**可选** + 服务端默认值（第 11 课会强调）。

4. **调用 Service**  
   - 传入已干净的数据 + 认证上下文（userId、权限等）。

5. **写回响应**  
   - 成功：200 / 201 / 204 等。  
   - 客户端错：4xx；服务器错：5xx。  
   - **由 Controller 决定 HTTP 语义**，而不是 Service。

口诀：**Controller 控制数据进出与 HTTP 形态；真正「办事」在 Service。**

### 3. Service 职责

Service 应尽量是**与 HTTP 无关**的函数：入参是普通数据，出参是普通数据/领域结果。一眼看去不应暴露「这是某个 REST 端点专用」。

可以做的事：

- 编排多个 Repository 调用，合并结果；
- 发邮件、推送、调第三方 API；
- 纯业务规则（不碰库也可以，例如只发信）。

不应做的事：

- 纠结 Response 状态码、Header；
- 在深处重复做 HTTP 绑定/校验（应在边界完成）。

### 4. Repository 职责

**单一职责：构造并执行数据访问，返回结果。**

- 接收过滤、排序、插入所需字段；
- 拼查询 / 调用 ORM；
- 返回 DB 结果。

设计建议：

- 「列出全部书」与「按 ID 取一本书」→ **两个方法**，不要用一个方法 + 可选参数有时返回数组有时返回单对象。
- Service 负责编排多个 repo；repo 保持「一次一件事」。

三层隔离总结：

| 层 | 管什么 |
|----|--------|
| Handler | 输入/输出格式、HTTP、校验转换 |
| Service | 业务处理与编排 |
| Repository | 数据库读写 |

### 5. 中间件（Middleware）

#### 5.1 是什么

夹在生命周期「边界」之间的函数：入口与路由之间、路由与 Handler 之间、Handler 与最终响应之间……都可以挂。

中间件也像 Handler，能碰 Request/Response，但多一个 **`next`**：

- 调用 `next` → 把执行权交给**下一个**处理上下文（下一个中间件、路由或 Handler）；
- 不调用 `next` 而直接写响应 → **短路**，后面的 Handler 根本不会跑（省资源，常用于认证失败、限流）。

中间件**可选**：没有也能工作；有则用于横切关注点。

#### 5.2 为何需要（而不只在每个 Handler 里调函数）

后端有成百上千端点，每个端点一个 Handler。日志、CORS、认证、限流、压缩、解析 Body……若每个 Handler 复制或手动调用 → 冗余、易漏。

中间件 = 在生命周期固定位置**统一执行一次**这些横切逻辑，类似「把重复代码提成函数」，但由框架按链自动调用。

#### 5.3 顺序极其重要

请求单向流动：`M1 → M2 → … → Handler → …`。  
错误处理中间件若放在中间，**后面** Handler 抛的错它接不住。

**常见推荐顺序（可按项目调整，但要有意识）：**

1. **CORS**（尽早识别/标记允许的 Origin；不该放行的尽早结束）
2. **安全 Headers**（CSP 等）
3. **日志 / 监控**（尽早分配 requestId 并开始记）
4. **Rate limit**（防刷，返回 **429**）
5. **Body 解析 / 大小限制**
6. **Authentication**（失败 **401** 短路；成功写入 context）
7. **Authorization / 权限**（失败 **403**）
8. **路由 → Handler → Service → Repo**
9. **压缩**（大 JSON 可用 gzip 等；浏览器可解压）
10. **全局错误处理（放最后）** → 统一结构化错误（message / code）、区分 4xx/5xx

#### 5.4 典型中间件举例

| 中间件 | 做什么 |
|--------|--------|
| **CORS** | 读 Origin；若为允许的前端域，写入允许跨域的响应头，再 `next`；否则不写允许头，浏览器会拦 |
| **Security headers** | 为每个响应加安全相关头 |
| **Authentication** | 取 Cookie/Header 中的 Session/JWT；失败立即 401；成功把 userId/role 写入 **Request Context** 再 `next` |
| **Rate limit** | 按 IP（或用户）计数；超限 429 |
| **Logging** | 记录 method、path、query、耗时、status、requestId… |
| **Compression** | 压缩出站 Body |
| **Validation / Binding** | 也可下沉为中间件，减少 Handler 样板代码 |
| **Global error** | 捕获链上任意未处理错误，变成稳定 JSON 错误响应 |

### 6. Request Context（请求上下文）

#### 6.1 概念

**作用域限于「这一次 HTTP 请求」的共享状态**（常为键值）。该请求的所有中间件与 Handler 都能读/写，请求结束后丢弃。

目的：

- 避免把 `userId` 一层层当函数参数硬传（过紧耦合）；
- 又避免用全局变量（并发请求会串号）。

#### 6.2 经典用途

1. **认证结果**  
   Auth 中间件验票后写入 `userId`、`role`、权限列表。  
   Handler 创建书籍时：**从 context 取 userId 写入 DB**，**绝不**信任客户端 Body 里的 `userId`（恶意用户可伪造他人 ID）。

2. **Request ID / 链路追踪**  
   入口生成 UUID，写入 context 与日志；微服务间用 `X-Request-ID` 传递 → 排障时可串起整条调用链。

3. **超时、取消、Deadline**  
   把取消信号/截止时间放入 context，传给下游 DB 查询、HTTP 客户端。  
   客户端断开或超时 → 下游应停止，避免**无限挂起**占满连接与线程。

> Go 的 `context.Context`、许多 Node/Python 框架的 `req` 扩展字段，都是同一思想的不同实现。

### 7. 端到端串起来（创建书的例子）

1. 请求进入 → CORS/日志/限流通过。  
2. Auth 中间件验 JWT/Session → context 写入 `userId=42, role=user`。  
3. 路由到 `POST /books` Handler。  
4. 绑定 JSON → 校验 title/author → 转换默认值。  
5. Service 创建书 → Repository INSERT（`user_id` 来自 context，非 Body）。  
6. Handler 返回 **201** + 新书 JSON。  
7. 若中途抛错 → 最终错误中间件变成结构化 4xx/5xx。

## 后端规则与最佳实践（Checklist）

- [ ] 画清本项目的中间件顺序，并写进团队规范。
- [ ] HTTP 细节留在 Handler；Service 可单测、不依赖 Request 对象。
- [ ] Repository 方法单一返回形态；编排放 Service。
- [ ] 认证失败 401 短路；授权失败 403；限流 429。
- [ ] 身份与租户 ID 从 context/会话取，不从可变客户端输入取。
- [ ] 每个请求有 requestId；日志必带。
- [ ] 对外调用与 DB 查询尊重 context 取消/超时。
- [ ] 全局错误处理在链尾；生产响应不泄露堆栈。
- [ ] Query 可选 + 服务端默认值，减轻客户端负担。

## 常见坑与反模式

| 反模式 | 问题 | 纠正 |
|--------|------|------|
| 上帝 Handler（路由里写完所有逻辑） | 难测、难复用 | 分层 |
| Service 里 `res.status(500)` | HTTP 泄漏进领域层 | 返回错误类型，Handler 映射 |
| 错误中间件放在链中间 | 后面的错捕不到 | 放最后 |
| 无认证就信 Body.userId | IDOR / 越权 | context 中的认证身份 |
| 中间件顺序随意 | CORS/鉴权/日志行为怪异 | 显式排序并评审 |
| 忽略取消信号 | 雪崩、连接耗尽 | deadline 贯穿下游 |
| 用全局变量存「当前用户」 | 并发串请求 | 每请求 context |

## 与前后课的关系

- **前：路由、序列化、认证、校验** — 分别对应本课生命周期中的匹配、绑定、Auth 中间件、校验步骤。
- **后：REST API 设计（第 11 课）** — 路由形态、状态码、分页参数等由 Handler 落实；分层保证设计与实现清晰。
- **贯穿：Request Context** — 连接第 8 课的 RBAC 与第 11 课的受保护资源操作。

## 参考来源

- 源字幕：`待整理的后端开发课程/10.md`（Handler/Service/Repository、中间件与 next、顺序、CORS/认证/限流/日志/错误处理、Request Context、取消与 deadline）
