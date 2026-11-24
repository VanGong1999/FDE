# 29. OpenAPI 标准（OpenAPI / Swagger）

## 一句话直觉

进程内函数有签名，编译器会在改坏时立刻报错；跨网络的 HTTP 调用默认**没有签名**——OpenAPI 就是给远程调用一份**可机器执行的契约**，让文档、客户端、服务端、校验与 Mock 共用同一份真相。

## 本课问题

- API 知识为何常散落在「后端 Handler / 前端 fetch / 文档」三处？不同步会怎样？
- 为何进程内改签名能编译期发现，跨 HTTP 却只能运行期踩坑？
- OpenAPI / OAS / OAD / OAI / Swagger 各指什么？别再混用。
- 一份描述文件里有哪些核心块（info、servers、paths、parameters、requestBody、responses、schema）？
- Code-first vs Design-first？设计优先流水线（lint → mock → 生成客户端/服务端 → 对照测）怎么走？

---

## 核心概念详解

### 1. 知识住在三个地方

以任务看板的 `POST /api/move` 为例：body 含 `task_id`、`to`、`actor`；成功 200，客户端错 400/404，服务端错 500/502……

**同一份知识**通常有三份拷贝：

1. **后端 Handler**——真正读 body、写状态码的代码；
2. **前端**——`fetch` / Axios 的调用点（知道 URL 与字段）；
3. **文档**——若有人维护规格说明。

问题在**三份真相如何保持同步**。例：同事把字段 `to` 改成更直观的 `column`，更新了后端和前端，**忘了改文档**。几周后新人按文档集成，仍传 `to` → 校验失败。文档自称真相，却已过期。

注意：这主要发生在**跨网络边界**时。同一后端进程内，函数签名变了，所有调用点在**编译期**就会炸（字段改名、类型从 string 变 int）。HTTP 远程调用默认**没有签名**，错配往往只能**运行时**发现——除非引入本课的机制。

### 2. 目标：给远程调用也一份「签名」

把下列内容冻成**一份可编程文档**（不是随意 Markdown）：

- 有哪些路由；
- query / path / header / cookie / body 各期望什么，细到字段类型；
- 各种响应长什么样。

这份规格叫 **OpenAPI**。描述通常是 **JSON 或 YAML** 单文件，列出端点并描述每个端点的输入、输出与行为，从而**跨网络强制契约**。

### 3. 简史与动机

2010 年前后，Wordnik（约 6 名工程师）的客户要多语言客户端 SDK + 文档。Tony Tam 等推动：一句话动机——**我们写代码的速度往往快过写文档**。

想法：服务器用 JSON **描述自己**；再有程序读该文件去做不同事——渲染人读文档、生成各语言客户端等。结构化格式便于解析、搜索、生成；纯文本很难同等可编程。

演进要点：

- 团队内称 **Swagger**，后开源；Swagger 2.0（约 2014）带动采用；
- SmartBear 收购后把规格捐给 **Linux Foundation**（Google、Microsoft、IBM、PayPal 等为早期成员）；
- 2016-01 改名 **OpenAPI**（OpenAPI 2.0 ≡ Swagger 2.0 内容）；
- 课程录制时规格已到 **3.2.0**，但生态工具大量仍以 **3.1** 为主——写文件时注明版本很重要。

### 4. 四个易混名词

| 名称 | 是什么 |
|------|--------|
| **OpenAPI Specification（OAS）** | 规则集：哪些字段存在、含义是什么 |
| **OpenAPI Description（OAD）** | **你的文件**（常 `openapi.json` / `openapi.yaml`），必须遵守 OAS |
| **OpenAPI Initiative（OAI）** | 发布与维护规格的组织（属 Linux Foundation） |
| **Swagger** | 旧称；今多指**工具**。说「Swagger 文件」常 = OAD；说「Swagger UI」= 交互式渲染工具 |

JSON 与 YAML 可互换；YAML 是 JSON 超集且支持注释，实务更常用 YAML。

规格自我定位三要点（课程强调）：

1. **语言无关**——描述行为与 I/O，不绑定 Go/Node/Python…  
2. **人与机器都能用**——交互文档给人；程序解析生成代码/校验；  
3. **不必靠读源码、翻过期文档或抓 Network 面板**——一份描述即可理解 API。

### 5. 一份文件能 unlock 什么

| 用途 | 说明 |
|------|------|
| **文档** | 只读说明，或 Swagger UI / Scalar / Redoc 等**可试调** UI（带 token、发真实请求） |
| **生成客户端** | 按描述生成各语言 SDK，少手写字段与分支 |
| **生成服务端样板/接口** | 减少手写样板与漂移 |
| **请求校验** | 网关或框架按 schema 自动校验 query/path/body |
| **Mock / 测试 / 网关** | 同一真相驱动多条流水线 |

课程评价：往代码库加的**性价比极高**的一件事——前后端与基础设施都能受益。

### 6. 描述文件结构（用看板 API 建立直觉）

#### 6.1 最小合法文件

根上需要：

- `openapi`：遵循的 **OAS 版本**（如 3.1.x）；
- `info`：至少 `title` + **API 自身版本**（产品/后端版本，与 OAS 版本是两回事；可与路由版本策略呼应）；
- 且至少具备 `paths` / `components` / `webhooks` 之一。

常再加：`servers`（API 基址列表）、`security`（认证方式）、`tags`（分组）。

#### 6.2 servers

列表：本机 `http://localhost:8080`、预发、生产……写一次 base URL，后面 path 只写相对路径。

#### 6.3 paths

Map：键是路径（须以 `/` 开头），值是 **path item**——该地址上每个 HTTP 方法一条（GET/POST/PUT/PATCH/DELETE…）。

动态段用花括号：`/api/tasks/{id}`（path 参数）。

#### 6.4 Operation（每个方法）

常见字段：

- `summary` / `description`（可用 Markdown）；
- `tags`：渲染时分组（如所有 task 相关）；
- **`operationId`**：全局唯一；**建议写成函数名风格**（如 `getBoard`）——代码生成时会变成真实函数名；
- `parameters` / `requestBody` / `responses`。

#### 6.5 Parameters vs requestBody

**Parameters** 可出现在：

| `in` | 含义 |
|------|------|
| `path` | 路径参数（**必须 required**，否则构不成稳定 URL） |
| `query` | 查询串（如轮询的 `since` 序号） |
| `header` | 如 SSE 重连的 `Last-Event-ID` |
| `cookie` | Cookie |

每项有 `name`、`in`、`required`、值的 `schema`。

**requestBody**：POST/PUT/PATCH 等载荷；用 `content` 映射 **media type → schema**：

- `application/json` 最常见；
- `multipart/form-data` 上传；
- `application/x-www-form-urlencoded` 传统表单。

看板 `move` 示例：JSON，必填 `task_id`、`to`；`actor` 可选，缺省服务端当 `guest`——**行为写进契约，无需翻 Handler**。

#### 6.6 Responses 与 Schema Object

按状态码（键要加引号，如 `"200"`）列出可能结果；每项有 `description`，通常还有 `content` + schema。

`move` 可列：200 回事件；400/404 错误体；502 表示搬动成功但 **publish 到 bus 失败** 等。

**Schema**：描述数据结构——`type`（string/number/integer/boolean/array/object/null）、对象属性、字符串 min/max/pattern/enum、数值范围、数组 `items` 等。可组合出几乎任意形状；另有 security schemes 描述认证。

实务提示：不必背完所有 OAS 特性——现代库（如 ts-rest、FastAPI）让你用熟悉的类型/注解表达「path + 输入 + 响应」，再生成文件。

### 7. Code-first vs Design-first（Contract-first）

契约是服务端与客户端共同的地面真相 → 谁先写？

| 路线 | 做法 |
|------|------|
| **Code-first** | 先实现 Handler；再从注解/注释/类型**派生** OpenAPI 文件 |
| **Design-first** | **先写描述**；再实现后端、客户端、Mock、测试——契约为源 |

Swagger 团队早期因已有服务而走 code-first，后来倾向契约优先更合理。课程经验：存量系统常 code-first 补文档/SDK；**新项目几乎总是 contract-first**——前后端可**并行**（契约已约定行为）；在智能体协作时代尤其顺：先对齐契约，再开两个 agent 分写服务端与前端。

Code-first 变体示例：

- 注释扫 Handler 生成 JSON；
- 或用 Zod + ts-rest 等**用代码写契约**再 `generate openapi.json`（仍是「契约在代码里显式存在」，比纯注释更难漂）；
- FastAPI：从 Handler 注解原生生成并托管 OpenAPI。

### 8. Design-first 流水线（五段）

以尚无 OpenAPI 的实时看板为例（小项目适合从设计优先立规矩）：

1. **Lint**：Spectral 等，按 OAS 规则查缺 description、缺 `operationId`、响应无 schema 等——与 ESLint 同理。  
2. **Mock**：Prism 等读规格，按 **example** 起假服务器——前端可对 Mock 开发，后端同时写真 Handler。  
3. **客户端生成**：如 OpenAPI TypeScript + openapi-fetch → 路径/字段/类型进编译器；拼错字段编译期红。  
4. **服务端表面**：如 oapi-codegen → Go **interface**；Handler 必须满足接口。契约改了、实现没跟上 → **编译失败**。  
5. **文档 UI**：同一文件喂给 Swagger UI / Redoc / Scalar（课程偏好 Scalar 的现代 UI）。

再加验证服务是否真符合文件：

- **Schemathesis** 等：从 schema 生成合法/非法请求打真服务器，核对响应是否贴契约；
- 或对比文件两版本做破坏性变更检查。

整条链：**单一真相文件** → lint、mock、客户端、服务端接口、文档、契约测试。

### 9. 行业标准与延伸

GitHub、Stripe 等公开发布 OpenAPI（体量可达数十万行）——「OpenAPI 是 API 的标准」指的是：行业已选定用它描述后端。网关校验、SDK 生成、以及给 AI agent 提供**可调用工具描述**，都是同一文件的现代用法。

### 10. 一句话收束

进程内靠编译器护签名；跨网络靠 **OpenAPI 描述** 把路径、输入、输出、类型与认证写成机器可读契约，并由此生成客户端、服务端接口、Mock、测试与文档——把三处漂移的知识收成**一处**。

---

## Checklist

- [ ] 能说出知识三处散落与「只改两端忘文档」的事故链
- [ ] 能对比进程内签名 vs HTTP 无签名
- [ ] 能分清 OAS / OAD / OAI / Swagger（文件 vs UI）
- [ ] 能默写最小文件字段，并区分「OAS 版本」与「API 版本」
- [ ] 会写 servers、paths、path 参数花括号、`operationId` 函数名风格
- [ ] 能区分 parameter 的 `in` 与 requestBody 的 media type
- [ ] 能为同一操作列出多状态码响应 + schema
- [ ] 能说清 code-first vs design-first，及设计优先五段流水线
- [ ] 知道可用工具对照「真服务器 ↔ 文件」做契约测试

## 常见坑

| 坑 | 说明 |
|----|------|
| Markdown 文档当唯一真相 | 不强制行为，最先过期 |
| 改字段只改后端或只改前端 | 第三方/新人按旧文档集成即炸 |
| 混淆 Swagger UI 与规格本身 | 工具可换，契约文件才是标准 |
| 不写 / 乱写 `operationId` | 代码生成函数名灾难、冲突 |
| path 参数标 optional | URL 形状不稳定 |
| 只生成文档从不对照测服务器 | 文件与实现静默漂移 |
| 大存量系统硬上纯手写 YAML | 可用 code-first/ts-rest 等降低摩擦，但仍要单一真相 |

## 前后课关系

- **前**：路由与 REST/CRUD、校验、序列化、错误码、认证；实时看板提供具体 paths（move、SSE/`Last-Event-ID`、轮询 `since`）；测试课的 Mock/契约思想在此升格为行业标准文件。
- **本课**：跨网络的契约与文档单一真相。
- **后**：Webhooks、DevOps 等会继续碰到「对外 API 如何被发现与集成」；大厂公开 OpenAPI 是同一模式的规模化。

## 参考来源

- 课程字幕：`待整理的后端开发课程/29.md`
- [OpenAPI Specification](https://www.openapis.org/) / OpenAPI Initiative
- 工具提及：Swagger UI、Scalar、Redoc、Spectral、Prism、openapi-typescript、oapi-codegen、Schemathesis、ts-rest、FastAPI
