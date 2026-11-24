# AI 系统设计案例操练（AI System Design Cases）

> 原文来源：The Forward Deployed ——「Interview Practice」板块中的「AI System Design Cases」一页，全文翻译整理。
>
> 与本目录下《技术方案与 LLM 系统设计》互补：那篇给出标准答法结构（15–20 分钟时间分配）与高频题库（A–G）的答题要点；本篇是配套的「计时操练」材料——三个完整案例的 Bad / Good / Great 评分、二十道全新案例库、两道通用设计热身题、以及一段可直接粘贴的 AI 面试官提示词。两者合在一起，构成完整的系统设计面试准备。

Palantir 的现场面试包含一轮系统设计。请把它当作普通的那种系统设计轮来预期。错误在于用普通的方式来准备它，因为对 FDE 而言，这一轮真正只问一件事：你能否设计出一个能在真实客户手里存活下来的 AI 系统。

有一个值得反复琢磨的事实。在 AI 案例里，架构几乎是「被强制规定」的。一个文档助手就是「检索 + 一个模型」。一个 agent 就是「一个模型、若干工具、再加一个循环」。你这一轮里的每个候选人五分钟内都会画出同样的方框，所以这些方框决定不了什么。这一轮的结果由你在剩余时间里做的事决定。大多数候选人把时间花在 chunking（切块）策略上。你应该把时间花在「客户如何知道这个系统是对的」上：上线之前，以及上线之后的每一天——因为语料库会变化、模型会被换掉，上个月的准确率数字会悄悄不再成立。采纳跟随信任，而信任建立于客户看得见的 eval（评测）之上。

## 框架（The frame）

1. 在讲模型之前，先点明主导性约束。准确率门槛、合规规则、延迟预算、成本上限：其中有一个在主导这个设计。说出是哪一个。
2. 用一句话画出显而易见的架构，然后继续往下走。这一轮不是靠架构赢的。
3. 把真正的时间花在 eval（评测）上。上线前客户如何知道它对不对？语料库和模型变了之后，他们又如何持续知道？Demo 能跑通；真实数据会把它搞坏。弥合这个差距才是这份工作。
4. 界定「爆炸半径」（blast radius）。当模型自信地犯错时会发生什么？用什么来把它兜住？
5. 用生产化的措辞给出成本与延迟。每次请求多少美元。真实负载下的 p99，且是实测的。

## 现在该做什么（What to do now）

如果你的设计答案技术上正确、但听起来像泛泛的 SWE（普通软件工程师）答法，就读这一页。现在就做这件事：先跑一遍通用设计的「地板」（基础底线），然后在计时器下开口讲一个 AI 案例。当你的大部分答题时间花在 eval、爆炸半径、成本与延迟上、而不是花在架构琐事上时，你就完成了。

## 来源说明（Sourcing note）

没有任何独立的原始来源能证实 FDE 有正式的「AI 系统设计」轮。有据可查的是一轮通用系统设计；本页的「AI」框架是本网站把那轮面试加上「生产环境 AI 工作真正要求的东西」综合而成的产物。请预期它仍以普通的那轮面试为载体，把这一视角带进去。底层概念在「Production（生产）」板块里讲授，而本文所引用的真实世界版本是 Morgan Stanley 这个客户项目（engagement）。

## 通用系统设计基础（General system-design basics）

有据可查的那一轮往往是普通系统设计；出处见 Interview Method（面试方法）。所以在做任何 AI 的动作之前，你需要先把它们底下那层普通系统做好。下面这些是「地板」（底线）。如果通用系统设计对你来说还很新，请配合一本正经讲这个主题的书来学。

### 你必须能画出并守住四个「框」（Four boxes you must be able to draw and defend）

1. **摄取（Ingestion）**。数据或请求如何进入：一个同步的 API（Application Programming Interface，应用程序编程接口）、一个吸收突发流量的队列、或一个按计划执行的批量加载。说出流量形态要求的是哪一种。
2. **存储（Storage）**。哪种存储契合访问模式，以及为什么：需要连接（join）且要求一致性的查询用关系型数据库；按单一键做海量查找用键值或宽列存储；大对象用对象存储。是访问模式决定了存储。
3. **服务（Serving）**。答案如何在负载下输出：缓存热读、用读副本分摊查询流量、以及一个与数据查询方式相匹配的索引。
4. **失败（Failure）**。某个组件挂了之后会发生什么：超时让调用方不会一直挂着；带退避（backoff）的重试；背压（backpressure）让慢的消费者不会压垮生产者；幂等（idempotency）让重试的写入不会重复生效。

这是一套词汇「地板」。你不需要在白板上设计一个分布式数据库；但你确实需要能在无人提示的情况下说出这四个框，并守住每个问题所迫使你做出的选择。

## 一个完整的通用案例（A worked general case）

### 示例练习题（Illustrative practice prompt）

为练习而虚构；一个非 AI 案例，好把「底层」单独隔出来。

题目：设计一个服务，它摄取送货卡车的 GPS（Global Positioning System，全球定位系统）定位信号，并回答「我的货在哪？」这个问题。

走一遍这四个框。摄取：卡车持续不断地上报定位信号，所以在写入端前面放一个队列，用来吸收这条稳定的流，以及当一支车队在换班开始时集中上线所产生的突发流量。存储：写入是一个以「货件」（shipment）为键的小追加；读取则要的是「单个货件最新的已知位置」，所以用一个按货件标识（shipment identifier）建索引、并只保留最新一次定位的存储，就能廉价地同时满足两者。服务：「我的货在哪？」是一个高频、重复的读，所以按货件缓存最新位置，让缓存去吸收查询流量。失败：当卡车的网络重试时，同一条定位信号可能到达两次。让写入幂等，以「货件 + 定位时间戳」为键，重复的写入就会坍缩成同一条记录，而不是污染轨迹。

现在点明主导性约束。这个系统在摄取端是写密集（每辆卡车、时刻不停），在查询端是读密集（每个客户都在查），这两者会把你拉向不同的设计。先决定你要先优化哪一条路径，并把两者分开，好让其中一条不会饿死另一条。这里有一个值得大声守住的权衡。按货件标识分区，单个货件的历史就落在同一个节点上，这让「我的货在哪？」这个读保持很快，但如果某一区域的卡车占了大头，就会招来热点（hot spot）。按区域分区，写入负载能均衡，但一个货件的历史会散开，读就要扇出（fan out）。这个服务是为「按货件读」而存在的。那就按货件标识分区，并接受随之而来的再平衡（rebalancing）工作。

一旦摄取、存储、服务、失败都站得住了，再在它们之上加 AI 这一层：eval、护栏（guardrails）、模型特有的成本与延迟。本页剩下的内容就是这一层。

## 案例 1：有据可依的助手（grounded assistant）

题目：一家财富管理公司想要一个助手，让它根据公司内部的研究资料库来回答理财顾问的问题。设计它。

继续往下读之前先想一想：架构几乎是「被强制规定」的——对文档做检索，一个模型据其作答。那么这一轮到底在考什么？说出你会先设计的第一个东西，而它不是向量数据库。

### Bad / Good / Great —— 答题的着力点

**Bad（差）** —— 去搭 RAG 流水线。你把十五分钟花在切块策略、embedding 模型和索引选择上。这些都是真的、也都是意料之中的，但没有一个决定了这个系统的成败。你把容易的那一半设计得很好，却从头到尾没提「信任」。

**Good（好）** —— 架构加上一次上线前的 eval。你讲完了检索，然后说你会建一个测试集，在上线前测量答案准确率。这确实比大多数人都好：你提到了评测。但一次性的上线前 eval，在语料库或模型发生变化的那一刻就过时了；而在受监管的场景里，「它上线时是准的」并不能作为一种抗辩。

**Great（卓越）** —— 用一个「常设的信任流程」打头。「架构就是检索加一个有据可依的模型；那部分是既定的。决定成败的是信任。一个受监管的理财顾问，只要 AI 哪怕自信地错上一次，就不会把它摆到客户面前。所以我会先设计信任系统：由领域专家给输出打分，这些分数反哺 prompt 和检索的改进，再配一个每天跑一次的回归套件，让漂移（drift）在一天之内显形，而不是等到客户会议上才显形。在输出到达客户之前，始终保留一个人来审阅。检索器只是入场券（table stakes）。」这才是真实部署的形态，一个真正上线过这种系统的面试官一眼就能认出来。

### 可以预期的追问（The probe to expect）

面试官：「你怎么知道你的 eval 真的反映了理财顾问需要什么？」

你：「因为写这些 eval、给它们打分的是理财顾问和领域专家，而不只是工程师。对答案负责的人来定义『对』是什么意思。而且我还会盯线上信号：纠错率、哪些问题被升级、理财顾问在哪里开始不再信任它。」

## 案例 2：Agent 系统（agentic system）

### 示例练习题（Illustrative practice prompt）

为练习而虚构；训练如何给一个「会行动」的系统划定边界。

题目：一个客户想要一个能采取行动的 agent——从自然语言请求出发去建工单、发邮件、更新记录。设计它。

继续往下读之前先想一想：一个会行动的 agent，它的失败方式和一个只会回答问题的 agent 不一样。你会先给什么东西设边界？

### Bad / Good / Great —— 失败处理

**Bad（差）** —— 最大化自主性。「这个 agent 端到端地规划并执行整个工作流。」在 demo 里很惊艳，而它第一次把邮件发错客户、或删错记录的那一刻，就变成了一个包袱。你是为「理想路径（happy path）」设计的。

**Good（好）** —— 加上审批。「高影响的操作需要人工确认。」直觉是对的：你在划定爆炸半径。现在再往下追问：是哪些操作？以及你怎么知道它在出问题？

**Great（卓越）** —— 先划定半径，再给它装上「仪表」。「设计的核心问题是：它能在无人值守的情况下做什么。可逆、低成本的操作自动执行。任何不可逆或高爆炸半径的事，都送到人工检查点：给客户发邮件、动钱、删除。我会给它设一个上限，限制它在停下并上报之前最多能执行多少个操作；把每个操作都记进日志以备审计；再给它一个急停开关（kill switch）。然后去测量。它多久需要纠一次错、在哪里陷入循环、一个完成的任务要花多少钱。自主性随着 eval 数据挣得的资格而逐步调高。」这就是把「护栏」这面镜头，用在一个会行动的系统上。

### 可以预期的追问（The probe to expect）

面试官：「客户想要完全的自主——检查点会拖慢他们的人。」

你：「那我们就用数据去挣得自主性。先从不可逆操作上的检查点开始，测量 agent 本来会错多少次，等数字说某类操作已经安全了，再撤掉那类操作上的检查点。一次无人值守的错误操作，就是那个会毁掉整个部署的故事。逐步地把自主性买回来，比在那之后再把信任赢回来要便宜。」

## 案例 3：成本与延迟（cost and latency）

### 示例练习题（Illustrative practice prompt）

为练习而虚构；用美元和 p99 来训练「从 demo 到生产」之间的差距。

题目：试点在五十个用户身上跑得通。客户想让它上线给五万用户用。会有什么变化？

继续往下读之前先想一想：「它能扩展」不是一个答案。说出那两个真正会变动的数字，以及你对每一个会怎么做。

### Bad / Good / Great —— 生产规模化

**Bad（差）** —— 「加更多服务器。」你把一个 AI 系统当成无状态的 web 应用来处理了。这里成本和延迟都出在模型调用上，光靠水平扩展只会让账单更难堪，而不是更好。

**Good（好）** —— 把成本和延迟点名为约束。「每次请求的 token 成本乘以量就是账单，而首响应时间（time-to-first-response）就是体验。」框架是对的。现在说说你对每一个会怎么做。

**Great（卓越）** —— 具体地攻击这两个量。「有两个数字会变动：每次请求的美元成本，和 p99 延迟。成本上，把重复问题的响应缓存起来；把容易的那大部分流量派给更小的模型，把大模型留给难的那条长尾；在检索过度取用（over-fetching）的地方削减 prompt 长度。延迟上，流式输出 token，让用户立刻看到响应开始；并缓存那段昂贵的、共享的前缀。而且我从第一天起就按请求给这两者都装上观测，因为在五万用户规模下，任意一个的轻微回退，都会变成一张大账单、或一条排长队的客服队列。」Cost & Latency 那一页把每个杠杆都讲得很深。

### 可以预期的追问（The probe to expect）

面试官：「你先优化哪一个，成本还是延迟？」

你：「先优化离『搞垮这次部署』更近的那个。如果用户因为启动太慢而弃用，那就是延迟。如果试点的单位经济模型撑不过五万用户，那就是成本。我会先读真实数字，再做选择。」

## 练习题库（Practice bank）

上面这三个案例已经把自己的评分标准印出来了，所以它们只能用一次。下面的 Rep Kit（练习工具包）里有二十个同构的全新 AI 案例（一个客户、一个诉求、一个悄悄主导的约束），外加两个用于「地板」的通用设计热身题，全站任何地方都没有答案。取一道题，大声按框架讲十五分钟左右，然后对照那五个动作给自己打分。留意你的时间都花到哪去了；哪怕架构是对的，只要大部分时间都花在架构上，这一轮照样挂。概念在 Production（生产）板块里，完整展开的真实版本是 Morgan Stanley 这个客户项目；等你把四个轮次都跑完了，再回到 Interview Method（面试方法）。

## 案例库（The case bank）

### 示例练习题（Illustrative practice prompts）

为练习而虚构。每个案例里，每道题都会陈述一个关于客户的事实；判断「是它在主导设计、以及它迫使了什么」，是你的事。

1. 一家航空航天供应商想要一个文档助手，而且任何东西都不得离开其与外界物理隔离（air-gapped）的工厂网络。
2. 一家应急调度中心想要实时通话摘要，而一份在通话结束后才出来的摘要是毫无价值的。
3. 一款儿童教育应用想要一个作业辅导老师，而且每个用户都是未成年人。
4. 一家病理实验室想要报告草稿，而且多年之后，每一句话都必须能让监管机构追溯到出处。
5. 一家比价初创公司想要一个购物 agent，而如果一次会话的成本超过它的收益，这门生意就死了。
6. 一家法律研究平台服务于数百家互为竞争对手的律所，而且任何一家律所的文件都绝不能出现在另一家律所的答案里。
7. 一家电信公司想要一个面向预付费客户的客服助手，而那些地区的网络一断就是好几个小时。
8. 一家银行的欺诈团队想要案卷摘要，而那些案卷里被描述的人正在主动地试图毒化被写下来的内容。
9. 一家福利机构想要一个资格解释器，而一个错误答案可能让某人失去住所、且几乎无从追索。
10. 一家交易公司想要研究摘要，而一个建立在昨日申报文件之上的答案，比没有答案更糟。
11. 一家航空公司想要机组排班解释，而针对同一个决定给出两份不一致的解释，会酿成一起工会申诉。
12. 一家医院想要用十几种语言起草出院须知，而一个翻译错误就是一个临床错误。
13. 一家大型仓储零售商想要一个店内语音助手，而且它必须跑在每条过道里已经装好的那批廉价硬件上。
14. 一家保险公司想要理赔分流，而监管机构要求每一次拒赔都必须由一名可指名的人类可证明地做出。
15. 一个社交平台想要一个内容审核助手，而它的用户们争相截图它说出可怕的话。
16. 一家制药公司想要文献摘要，而引用一篇不存在的论文是一起须上报的事件。
17. 一家货运运营商想要一个能自行改订舱位的 agent，而一次错误操作会把实物货品运到错误的大洲。
18. 一个学区想要一个评分助手，而且任何家长都可能要求对任何一个分数给出完整的解释。
19. 一家报税公司想要一个申报助手，它全年的工作量都集中在几个残酷的星期里到来。
20. 一家海上平台运营商想要一个维护助手，而客户不允许用云、只提供一条卫星链路。

### 通用设计热身题（General-design warmups）

两道非 AI 案例，用于用同一套流程排练「地板」。这里没有模型可供评测，所以 AI 专属的评分动作（eval、爆炸半径）只能宽松套用。「点明主导性约束」仍然管用，理解为「读密集对写密集」，或「一致性对可用性」。

1. 一个票务平台想要一个服务，在结账过程中锁定座位、并在买家离开时释放座位，而且两个买家绝不能确认同一个座位。
2. 一家车队运营商想要一个服务，摄取来自数千辆车的传感器读数并回答「哪些卡车该保养了？」，而且读数的到达速度远快于任何人对它们的查询速度。

后面没有答案，这里没有，全站任何地方也没有。大声地、开着计时器、对着框架来练。

## AI 面试官（The AI interviewer）

把下面这段内容原封不动地粘贴进任何一个能力足够的 AI 聊天里，然后从案例库里给它几道题，或让它自己出题。只要聊天支持，就用语音模式；这里的每一轮都是口述的。

```text
You are the interviewer for a Forward Deployed Engineer AI system-design
round. Persona: a senior engineer who has watched demos die in production
and is bored by architecture talk.

Rules:
1. Present exactly ONE case at a time. Pick from the list I paste after this,
   or invent one in the same register: "design an AI system for customer X",
   where one constraint quietly dominates (compliance, latency, cost, offline
   operation, tenant isolation, hostile or vulnerable users). When presenting a bank case, give me only
   the clause before the first "and"; keep the constraint clause as your
   private grading key. Answer my clarifying questions with realistic
   customer facts, revealing the withheld constraint's facts when a
   question would genuinely surface them.
2. Give me one full answer per case — treat roughly eight hundred words
   of transcript as a fifteen-minute rep. I will answer out loud and give you the transcript —
   voice mode or a recording's transcript, not a from-memory summary, which
   hides exactly what you are grading. Typing in real time is fine; flag only
   compressed retellings and grade those as thin evidence.
3. Whenever more than about a hundred and fifty consecutive words of my
   answer are architecture, drag me back with one of two questions: "How do you know it's right?" and "What
   breaks, and what happens when it does?" Re-ask them even if I partially
   answered — a real interviewer re-asks.
4. Once I commit to a design, stress it: change or reveal the one condition
   my design most quietly assumed away — a budget, a regulator,
   connectivity, hardware — picking whichever my answer never priced in,
   and watch whether the design bends or shatters.
5. When I say "grade me", mark each of five moves PASS or FAIL, citing a specific
   moment for each: (a) did I name the dominant constraint before the model
   and state its two costliest design consequences — repeating the case
   line scores nothing; (b) did
   I sketch the obvious architecture in a sentence and move on; (c) did I
   lead with evaluation — how I know it is right before launch and every day
   after; (d) did I bound the blast radius and name the failure containment;
   (e) did I treat cost and latency as things to measure in production, in
   the customer's terms. Grade hard: a typical first rep fails at least two of the five moves — if none failed, re-examine before praising, and never soften a grade because I argue with it.
6. End with exactly one thing to fix on the next rep. Then offer the next
   case.
```

## 参考与来源

| 来源 | 链接 | 本篇用法 |
|------|------|----------|
| The Forward Deployed — Interview Practice | https://www.theforwarddeployed.io/interview-practice | 全文翻译整理 |
