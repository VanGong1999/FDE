# 31 · 后端工程师的 DevOps

一句话直觉：DevOps 不是「运维替你点按钮」，而是把「本机 localhost 上的后端」变成「互联网上可持续发布、可观测、可回滚的服务」——让部署又小又便宜又无聊，从而又快又稳。

## 本课要解决什么问题

到本课为止，请求、handler、数据库……几乎都跑在**你自己的机器、localhost**上，用户够不着。本课回答：

1. 代码如何从 commit 变成公网可访问的服务？
2. 每天改代码时，服务如何保持存活、如何近零停机更新？
3. 构建、容器、编排、CI/CD、基础设施即代码、可靠性（SLO/on-call）各自解决什么？

传统大厂曾拆成两队：

| 团队 | 考核 | 倾向 |
|------|------|------|
| 开发（写代码） | 功能上线速度 | **多部署** |
| 运维（管机器） | 生产少宕机 | **少部署**（部署=熵增风险） |

出事故时互相甩锅 → 发布变周级/双周级。**DevOps 运动**是一套让「开发与运维目标对齐」的实践与工具文化：配置进版本库、一键构建/部署、功能开关、可观测性共享……核心模式是：

> **把部署做得又小、又便宜、又无聊** → 人们敢一天部署多次。

本课给后端工程师一张**心智地图**（不是教完整 AWS/K8s 证书）：听到这些词时不懵，知道去哪深挖。

---

## 核心概念详解

### 1. 用什么衡量：DORA 四个数

DORA 团队长期调研团队后提炼四指标：

| 类型 | 指标 | 含义 |
|------|------|------|
| 速度 | **Change lead time** | 从 commit 到生产生效多久 |
| 速度 | **Deployment frequency** | 多久部署一次 |
| 稳定 | **Change failure rate** | 多少比例的部署搞挂生产 |
| 稳定 | **Failed deployment recovery**（MTTR） | 挂了多久能恢复 |

2024 左右画像直觉：

- **顶尖组（约 20%）**：按需部署；commit → 生产常 **&lt; 1 天**；失败率约 **5%**；恢复 **&lt; 1 小时**
- **垫底组**：1–6 个月才部署；失败约 **40%**；恢复要 **一周**

反直觉结论：**部署更勤的组往往更稳**。速度与稳定不是零和。

原因：月发一次 ≈ 一包 200 个 commit；出问题难定位、修又是大包。每 commit（或极小包）上线 → 出事几乎能立刻知道是谁、改了什么，脑子还热着，修复快。

**拇指法则：部署要尽可能频繁，变更要尽可能小。**

---

### 2. Git 分支：CI 实践与 Trunk vs Git-Flow

**持续集成（CI）作为实践**：每人至少每天把工作合进**共享主干**；每次合并由自动化构建跑全量测试。人们口中的「CI 服务器」只是**强制执行该实践的工具**——它能挡不合格合并，不能强迫人天天合。

为何要天天合：两人各开 feature 三周再合 → 分支漂移巨大，解冲突可能数小时且易毁意图。每天合 → 只对抗「一天的漂移」，冲突几分钟级。

**分支模型**：

| 模型 | 要点 | 适合 |
|------|------|------|
| **Git-Flow**（develop / release / hotfix / main） | 作者十年后也说：对**持续交付的 Web** 太重 | 需长期支持多版本的桌面/移动安装包 |
| **Trunk-based** | 一个 main；短命 feature 分支（1–2 天）合完即删；从 main 发布 | Web/后端「生产只有一个当前版本」 |

大功能两周做不完？**合进 main，但用 feature flag 关着**——代码已在生产，用户不可见。

---

### 3. 构建（Build）与流水线

**Build**：源码 → 可运行物（编译、拉依赖、打包成 artifact / binary / executable）。

与十二要素一致：理想构建**不依赖机器上碰巧装了啥**——声明编译器版本、依赖精确版本 → 同配置应得到**字节级可复现**产物。lock 文件（`go.sum`、`package-lock.json`…）是可复现输入清单。

例：

- Go：`go build` + 钉死 Go 版本 + 入库的 `go.sum`
- Node：`npm ci` + lockfile

产物常**盖戳 commit hash**（有时加 build ID），便于从运行中的进程/健康检查判断「现在跑的是不是刚部署的那次」。

**部署流水线**：源码经过的一串阶段，最后上生产。排列原则：**前面快、便宜；后面慢、贵**。

典型：编译+单测（几分钟，失败立刻反馈）→ 集成测/staging → 推生产。

#### GitHub Actions 五词

| 词 | 含义 |
|----|------|
| **Workflow** | 仓内 YAML（常在 `.github/workflows/`）：何时跑、跑什么 |
| **Event** | 触发：push、PR、定时、手动 |
| **Job** | 一台机器上的一组 step；可并行或互相等待 |
| **Runner** | GitHub 给的临时 VM（或自建）；跑完即失效 → **每次当全新机器** |
| **Step** | job 里一条命令或 action |

故几乎每个 workflow 都以 checkout 开头。示例结构：test →（成功后）build 上传 artifact → image 等。

#### 密钥：Repo Secret vs OIDC

流水线终须碰云（推镜像、部署）。长期做法：仓库 Secret 存云密钥——简单，但**该仓所有 job 都能用**；泄漏则旋转前处处可滥用。

更好：**OIDC（OpenID Connect）**。Job 启动时 GitHub IdP 发**短时签名 token**（声明：某仓、某分支、某 workflow）。云侧（如 AWS）只信任「这些 claim」的 token，换临时凭证，**job 结束即失效**。比永久密钥进 Secret 安全得多。

#### 版本号：库 vs 服务

| 场景 | 版本习惯 |
|------|----------|
| 给用户用的**库** | SemVer：`major.minor.patch`（破坏/功能/修补） |
| **自己部署的服务** | 用户不关心部署号；用 **commit hash**（± build ID）打 tag 镜像与健康接口 |

---

### 4. 容器：为何「只拷二进制」不够

本机 Go 二进制拷到服务器可能因系统库、证书、时区库版本挂掉；Node 本机 22、生产 18 也会挂。

思路：**不只运代码，还运运行所需环境**（运行时、库、文件、精确版本）——打成 **container**：带自己文件系统视图的进程，只看见机器上「它需要的那一块」。

#### 容器 ≠ 小虚拟机

| | 虚拟机 | 容器 |
|--|--------|------|
| 内核 | **自己的完整 OS 内核** | **共用宿主机内核** |
| 隔离 | 很强、很重（数 GB RAM、启动慢） | 内核用 namespace/cgroup 给「幻觉」 |
| 本质 | 硬件分区出的环境 | **普通进程** + 特殊待遇（`ps` 在宿主机也能看到） |

隔离靠 Linux 三大能力：**namespaces、cgroups、分层文件系统（如 OverlayFS）**。

#### Namespaces：控制「看见什么」

把全局资源包一层，让一组进程看到**自己的副本**：

| Namespace | 效果直觉 |
|-----------|----------|
| PID | 容器内自己是 PID 1，看不见外面进程 |
| UTS | 自己的 hostname |
| Mount | 自己的挂载表 / 根目录 |
| Network | 自己的网卡、端口、路由 → **两容器都可听 80** |
| 另有 | IPC、user、cgroup、time 等（约 8 种） |

操作用系统调用：`clone`（新进程进新 ns）、`unshare`、`setns`。Docker/K8s 最终都落在这些调用上。课程演示 Liz Rice「Containers from Scratch」几十行 Go：`clone` + 新 UTS/PID/mount → `chroot` 到 Ubuntu 根 → 挂 proc → 起 shell。

#### cgroups：控制「能用多少」

Namespace 不管资源用量。cgroup 在 `/sys/fs/cgroup` 用目录+文件（如 `memory.max`、`cpu.max`、`pids.max`）限内存/CPU/进程数。K8s 说「内存 512Mi」≈ kubelet 往 `memory.max` 写数；超限 → 内核 OOM killer → 常见 **OOMKilled**。

#### 镜像、层、Dockerfile

- **Layer**：一组文件变更的 tarball（增/改/删）
- **Image**：层的栈；运行时 OverlayFS：下层只读 + 上层可写，合并成一个视图；写时 copy-up
- 同镜像起 10 个容器 → **共享下层**，各有薄可写层；停容器可写层没了 → **文件系统可丢弃**（十二要素：状态外置）

镜像身份：blobs（按 SHA-256）+ config JSON（层序、CMD、ENV、WORKDIR、端口…）+ manifest；**digest = manifest 的哈希**。Tag（`ubuntu:24.04`、`myapp:v2.3.1`）指向 digest。共享层靠 digest 去重。

**Dockerfile 缓存**：从上往下，**第一条输入变了的指令起下面全重建**。优化：

1. 先 COPY 依赖清单（`go.mod` / `package.json`…）→ 装依赖 → 再 COPY 源码（代码天天改、依赖少改 → 少重建）
2. 编译语言用 **multi-stage**：一阶段带编译器出二进制；二阶段极小基础镜像只 COPY 二进制 → 镜像小很多

#### Registry、运行时与 OCI

**Registry**：存镜像的 HTTP 服务；build 后 push、run 前 pull——因流水线 build/run 可能不在同一台机器。对象：blob（按 digest）与 manifest（按 tag/digest）。小改代码再 pull 往往只要几秒（下层已在本机）。

Docker Hub、GHCR、各云 ECR/GCR/ACR；也可自建。

`docker run` 路径直觉：CLI → **dockerd** → **containerd**（镜像与生命周期）→ **runC**（真正 `clone`/写 cgroup/`chroot`/exec）。拆开是为了 **OCI** 标准：镜像布局、runtime 如何被告知、registry 如何服务 → Docker 打的镜像可在只谈 containerd+CRI 的 K8s 上跑。

**好镜像清单**：小；**一进程**（不要 init/cron 全家桶）；**非 root**；**钉死基础镜像版本**（禁 `latest`）；**扫描**已知 CVE（读包列表对公开漏洞库）。

PaaS（Render、Railway…）常用 **buildpacks / Nixpacks**：看 `package.json` / `go.mod` 等自动建镜像，你可不写 Dockerfile。

---

### 5. 单机上线：systemd、反代、TLS、Kamal

单机跑服务 ≈ 三件事：

1. **进程**：开机起、挂了重启 → Linux 上常见 **systemd** unit（用户、命令、`Restart=on-failure`；日志进 journal → `journalctl`）
2. **反代**：80/443 终结 TLS，转到应用端口 → Nginx / **Caddy**
3. **日志**：能读到某处

域名 DNS → 机器 IP；防火墙放行 80/443 → 反代 → 容器内进程（unit 里常是 `docker run`）。

**TLS 证书**：用 **ACME** 协议 + **Let's Encrypt**（免费 CA）。客户端生成密钥 → 挑战（HTTP-01 放 token 或 DNS-01）→ CA 多点验证你控域 → 签证书。证书常 **90 天**，客户端约 60 天自动续——短寿命限制失窃密钥窗口。Caddy 常内置自动要证/续证。

用户变多 → **水平扩展**（加机器，而非无限加单机规格——扩展课）。多机时：每机拉新镜像、起新停旧、**零停机**很烦。**Kamal**：本机 SSH 到各 host，装 Docker、登录 registry、build/push、各机 pull、**新旧容器并行**、打 `/health` 等就绪后再切反代流量、停旧容器。

---

### 6. 不可变基础设施与编排（Kubernetes）

手养「雪花服务器」（十二要素反面）：时间一久配置独特，只有一两个人会修；SSH 上某台改配置 → **漂移**。正确做法：

- **不要手改机器**；改代码/配置再**整栈替换**
- **不可变基础设施**：机器/实例启动后不改，只替换
- 容器让「替换单元」从整台物理机变成**镜像版本**，成本骤降

多机多容器后的新问题：谁在哪台跑？机器挂了谁在别处起替身？流量翻倍谁加副本？发新版谁按序替换且不停机？→ **编排器（orchestrator）**，事实标准开源实现是 **Kubernetes**（源自 Google 内部多年系统）。

K8s 核心范式：**声明期望终态**，控制器循环对齐现实。

例：声明「此镜像 3 副本、某端口、某内存」→ API Server 存起来 → controllers 盯着：少了就起、多了就砍。

控制面直觉：API Server（唯一写存储的前门）→ **etcd**；scheduler 选节点；controller-manager；每节点 **kubelet**（问 API「我这该跑啥」）+ **kube-proxy**（服务网络）。

#### 对象阶梯

| 对象 | 作用 |
|------|------|
| **Pod** | 调度单位：同机一组容器共享网络 ns 与卷；多数一容器；自有 IP；**手创 pod 不持久**——节点挂 pod 没了 |
| **ReplicaSet** | 维持 N 个符合模板的 Pod |
| **Deployment** | 管 ReplicaSet；换镜像时建新 RS、搬副本数；**你日常写这个** |
| **Service** | 固定虚 IP / DNS 名，选中带 label 的 Pod；Pod IP 会变，Service 稳定 |
| **Ingress / Gateway API** | 把主机名+路径映到 Service；由控制器配真实 LB |
| **ConfigMap** | 非敏感配置 → env/文件 |
| **Secret** | 敏感配置，仅显式挂载的 Pod 可见 |
| **资源** | 每容器 **request**（预留）与 **limit**（硬顶）→ 落到 cgroup |

流量路径：**域名 → LB → Service → Pods**。部署时变的是 Pod，前面相对静态。

#### 滚动发布与探针

换镜像：Deployment 建新 RS，按 **maxSurge / maxUnavailable**（默认常各 25%）逐步挪。例 3 副本：新起 1 → 就绪 → 旧减 1 → 循环至新 3 旧 0。

**Readiness**：未就绪不进 Service 端点 → 坏镜像最多拖慢 rollout，不易整站秒挂。旧 RS 可缩到 0 但保留 → 易回滚。

**Probes**（kubelet 定时检查）：

| Probe | 失败时 |
|-------|--------|
| **readiness** | 摘流量；**不**杀容器 |
| **liveness** | 多次失败 → 杀容器重启 |
| **startup** | 慢启动时挡住前两者，避免启动中被误杀 |

**坑**：liveness 去查数据库 → DB 慢导致全员重启 → DB 更慢。规则：**liveness 只探「进程是否卡死」；readiness 探「此刻能否接客」。**

扩缩容：改 Deployment 副本数即可；进阶 **HPA** 盯平均 CPU 等自动加减，并设 min/max。

**要不要一上来就上 K8s？** 课程观点：**从小开始，复杂度用增长「挣」出来**——单机 systemd/Compose/PaaS → 多机 Kamal → 真需要再上 K8s。

---

### 7. 安全发布：CD、滚动 / 蓝绿 / 金丝雀

| 概念 | 含义 |
|------|------|
| **Continuous Delivery** | 软件**始终可部署**；合并后过完流水线，**随时一键**可上生产 |
| **Continuous Deployment** | 连按钮也省了：过检自动上生产（产品/合规决策，不是纯技术属性） |

可有 CD（交付能力）却仍选周发（changelog、合规评审）；**不能没有 Delivery 却硬上 Deployment**。

**零停机策略**：

| 策略 | 做法 | 取舍 |
|------|------|------|
| **Recreate** | 全停旧再起新 | 中间空窗 = **宕机** |
| **Rolling**（K8s 默认） | 逐个替换，靠 readiness | 零停机，但**短时双版本并存**——请求可能打到任一版 |
| **Blue-Green** | 两套完整环境；测好绿后切路由；蓝留作秒级回滚 | 同时只服务一版；**成本≈双倍**（并存期） |
| **Canary** | 先 1 个 Pod / 10% 流量，盯错误率与延迟，再 20%→…→100%；变差则切回 | 渐进风险 |
| **Progressive delivery** | 自动化金丝雀：控制器按指标扩量或回滚 | 人肉金丝雀的程序化 |

仅当你能接受「短暂双版本」时，才安心用默认 rolling（例如向后兼容的 API）。

---

### 8. GitOps（Argo CD / Flux）

大团队常用实践（多于单一工具）：

1. **期望状态**全写在声明式文件里，进 Git（可审、可版本、可逆）
2. 集群内 **agent 拉取 Git**，持续对齐集群
3. 有人手改集群 → agent **纠回** → **Git 为唯一真相源**

效果：部署 ≈ 改镜像 digest 的 PR；合并即发布。流水线**不必持有集群凭证**——只推镜像并开 PR。常见工具：**Argo CD、Flux**。

**环境**：dev / staging / prod = **同一镜像 + 不同配置**（十二要素）。另有：

- **Preview environment**：每个 PR 临时环境，合/关即毁
- **Promotion**：产物逐级晋升；常有人工审批门

---

### 9. 基础设施即代码（IaC）：Terraform 等

若只能用新云账号 **1 小时** 复刻现有手工基建——几乎不可能（缺文档、缺原作者、易错）。

**IaC**：机器、网络、权限、配置写成文件、进版本库；工具读取并在云账号上**幂等应用**出相同基建。

三类工具：

| 类 | 做什么 | 代表 |
|----|--------|------|
| **Provisioning** | 创建机器、网络、云服务 | **Terraform** / OpenTofu |
| **Configuration management** | 给定机器装软配软 | Ansible |
| **Image baking** | 烤好机器镜像，启动即就绪 | Packer + cloud-init |

Terraform 工作流：写 resource → `plan` 审差异 → `apply` 调云 API。

**State** 要点：

- 创建后把「这块配置 ↔ 云资源 ID」记进 **state**
- 下次 plan：读 state + 问云现状 → 差分为 plan
- **丢 state** → Terraform 以为什么都没有 → 计划「全新建」（灾难）
- **两人同时本地 apply** → 互相覆盖 → state 须 **远程集中 + 锁**
- State 含云返回的属性（含秘密）→ **勿提交 Git**；加密妥善存放

**Drift**：人在控制台/CLI 紧急改了安全组，文件未改 → 下次 plan 会想**撤掉**该改动（以代码为准）。演示：控制台开 22 端口 → plan 显示要关掉。

---

### 10. 活着：SLI / SLO / SLA、On-call、事故与复盘

用户不关心你是否 IaC；他们关心结果。

| 词 | 含义 |
|----|------|
| **SLI** | 用户在乎的测量：如成功率、P 延迟 &lt; 300ms 的比例 |
| **SLO** | 窗口内对 SLI 的目标：如 30 天内 99% 成功 |
| **SLA** | 对外合同：达不到则赔偿/延长期等 |

「几个 9」直觉：30 天 99.9% ≈ 约 **43 分钟**故障预算；再多个 9 量级更狠（课程给 99.99% 年/月量级直觉）。多一个 9 ≈ 承诺严一个数量级。

**Error budget**：把允许失败的那点比例当预算——留给发布、维护窗、实验、风险迁移；**不是**鼓励随便糊弄。预算耗尽 → **冻发布**，全力可靠性，直到窗口滚动恢复。

指标掉了 → **On-call**：轮值工程师接 **paging**（紧急推送；词源自旧 pager）。常备主 + 备份。Pager 依赖可观测性课里的告警。

**事故响应**角色分工：

| 角色 | 职责 |
|------|------|
| Incident commander | 全局症状与协调，**不亲自埋头修** |
| Fixer | 专心修 |
| Communicator | 更新公开 status page、通报管理层 |

先**止血**（回滚、关 feature flag），再根因与正式修复。事后出 **postmortem（复盘）**：时间线、影响、根因、行动项。好复盘是 **blameless**：怪系统不怪人——否则没人敢说「我当时为何以为命令是对的」，系统性问题永远修不掉。Cloudflare 等公开复盘可当范本。

原则常现：为失败而设计；部署尽量简单；一次只改一件。

**混沌工程**：故意在业务高峰删 Pod、摘节点、给依赖加延迟，验证副本集/超时是否真工作——别等真事故才发现安全网是纸。

---

### 11. 软件供应链

镜像里不全是你的代码：基础镜像、运行时、`npm install` / `go mod` 海量包 → 别人的错也能打爆你。

两类常见失败：依赖消失/突变打断构建；依赖被投毒。2024 **xz** 后门直觉：后门进了**发行 tarball/发布管线**而非源码仓 → 审源码的人看不见。

对策：依赖与基础镜像**钉版本**；镜像/依赖**漏洞扫描**。

---

### 12. 端到端拼图（心智模型）

```
本地改代码 → Git 合主干（CI 测）→ 可复现 Build → 容器镜像（钉版本+扫描）
    → Registry → 单机(systemd/反代/TLS) 或 多机(Kamal) 或 集群(K8s Deployment)
    → 滚动/蓝绿/金丝雀 →（可选 GitOps 以 Git 为真相）
    → IaC 管机器与网络 → SLI/SLO + 告警/on-call + 复盘与混沌
```

本课目的：后端边界外延一点到基础设施；听到这些词时有粗地图，再自行深读。

---

## 后端规则与最佳实践（Checklist）

- [ ] 优化目标：小变更、高频部署；用 DORA 看团队是否又快又稳
- [ ] CI 实践：至少每日合主干；自动化测；优先 trunk + 短分支 + feature flag
- [ ] 构建可复现：钉编译器/运行时；lockfile 入库；产物盖 commit
- [ ] 流水线前快后慢；失败早失败
- [ ] 云凭证优先 OIDC 短时令牌，少用永久 repo secret
- [ ] 服务版本用 commit，不用给库用的 SemVer 糊弄自己
- [ ] 运镜像不运「本机碰巧环境」；镜像小、单进程、非 root、钉 digest、扫描
- [ ] Dockerfile：依赖层在前；编译语言 multi-stage
- [ ] 单机：systemd 保活 + 反代 TLS（ACME）+ 健康检查
- [ ] 多机：不可变替换，忌 SSH 漂移；再考虑 Kamal / 编排
- [ ] K8s：声明 Deployment；用 Service/Ingress；滚动靠 readiness；liveness 别绑 DB
- [ ] 选发布策略时明确：能否接受短暂双版本？要不要蓝绿成本？要不要金丝雀指标？
- [ ] GitOps：期望状态在 Git；集群 agent 对齐；流水线可不碰集群凭证
- [ ] Terraform：远程 state + 锁；state 不进 Git；忌控制台漂移或接受 plan 纠正
- [ ] 用 SLI/SLO 管 error budget；预算耗尽冻发布
- [ ] On-call 轮值；事故先止血再根因；blameless postmortem
- [ ] 钉依赖与基础镜像；扫描供应链

---

## 常见坑与反模式

| 坑 / 反模式 | 为何糟 |
|-------------|--------|
| 月发一次大包 | 难定位、难回滚、恢复慢 |
| 认为「少部署才稳」 | 数据上高频小部署往往更稳 |
| 长寿命 feature 分支 | 合并地狱 |
| Web 应用硬套完整 Git-Flow | 为多版本安装包设计，过重 |
| 构建依赖「这台机子装了啥」 | 不可复现，「我机器上好的」 |
| 永久云密钥进每个 job 可见的 Secret | 泄漏面大 |
| 容器当「轻量 VM」理解 | 隔离与运维模型都错 |
| 镜像用 `latest`、不扫描 | 不可复现 + 已知洞 |
| Dockerfile 先 COPY 全源码再装依赖 | 缓存几乎总失效 |
| 雪花服务器 / SSH 热修生产 | 漂移、知识单点 |
| 一上来全家桶 K8s | 复杂度超过收益 |
| Recreate 当默认 | 必然空窗宕机 |
| Rolling 却发不兼容双版本 | 用户随机打到新旧逻辑 |
| Liveness 探 DB/依赖 | 依赖抖动引发重启风暴 |
| Terraform state 丢或进 Git | 重复创建或泄密 |
| 控制台改完不改代码 | Drift；下次 apply 打掉热修 |
| 有 SLA 无 SLO/预算 | 不知何时该停发保稳定 |
| 复盘点名背锅 | 真相被藏，同类事故再犯 |
| 不钉依赖 | xz 类供应链风险放大 |

---

## 与前后课的关系

| 课 | 关系 |
|----|------|
| **十二要素** | 构建/发布/运行分离、无状态、可丢弃、配置外置 ↔ 容器与不可变基建 |
| **扩展与性能** | 水平扩展动机；K8s/HPA 是编排层手段 |
| **优雅停机** | 滚动发布时旧 Pod 需优雅退出才真正零失败 |
| **日志与可观测性** | 告警 → paging；SLI 数据来源 |
| **测试与代码质量** | CI 流水线里的测是「敢高频部署」的前提 |
| **后台任务 / Webhooks** | 健康检查、异步；Webhook 公网入口依赖本章的上线与 TLS |
| **安全** | 非 root 容器、密钥、OIDC、镜像扫描、供应链 |

本课在系列中的位置：把「会写后端」接到「服务如何活在互联网上」——后端工程师不必成为专职 SRE，但必须有这张地图。

---

## 参考来源

- 源字幕：`待整理的后端开发课程/31.md`（约 1 小时 48 分，1800+ 行字幕）
- 课程主题：DevOps for backend engineers（DORA、CI/CD、容器、单机与 Kamal、K8s、发布策略、GitOps、IaC、SLO/事故、供应链）
- 提及工具/标准直觉：GitHub Actions、OIDC、Docker/containerd/runC、OCI、systemd、Caddy/Nginx、ACME/Let's Encrypt、Kamal、Kubernetes、Argo CD/Flux、Terraform/OpenTofu、DORA metrics
`)