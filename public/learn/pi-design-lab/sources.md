# Pi Design Lab · 研究与证据账本

核对日期：2026-09-07。学习问题：为什么 Pi 同时强调前缀稳定、可读压缩、可携带的历史和持久执行？目标是能预测机制变化、检查真实记录、解释崩溃后的安全边界。课程是中文互动学习稿；动效和数值实验不调用 Pi 或模型。

## 原始资料与版本

| 编号 | 来源 | 核对与用途 |
| --- | --- | --- |
| S1 | [Prompt Caching In Agents](https://earendil.com/posts/prompt-caching/) · Earendil Engineering · 2026-07-22 | 完整阅读。作者的取舍：稳定前缀与缓存成本影响工具和历史设计。文章网页可后续修改；日期是页面标注日期。 |
| S2 | [How Compaction Works in Pi](https://earendil.com/posts/compaction-in-pi/) · Earendil Engineering · 2026-08-13 | 完整阅读。可读摘要、保留近期消息、压缩后的上下文和缓存。 |
| S3 | [The Session You Cannot Take With You](https://earendil.com/posts/session-portability/) · Earendil Engineering · 2026-07-30 | 完整阅读。作者关于会话所有权的主张与可迁移性检验。课程不把文章对各家 API 的全部描述当成当前产品说明。 |
| S4 | [历史 AgentHarness v2](https://github.com/earendil-works/pi/blob/51b45bc5bcecc37a3538af5b0eb3710cc1e2c3f7/packages/agent/docs/harness-v2.md) | 固定在旧文件移除前的父提交。阅读概念、lane、operation、checkpoint、恢复与工具重放相关章节。357 KB 文档，未逐条审计全部 API 与测试要求。 |
| S5 | [Pi Real Sessions](https://huggingface.co/datasets/badlogicgames/pi-mono/tree/dac2a1d3ba12dda597b973a791a77618ccb5f413) | 用户短链实际落点。固定数据集 revision `dac2a1d3ba12dda597b973a791a77618ccb5f413`；API 清单有 627 个 JSONL 文件。读取说明并解析 8 个定向样本；页面展示其中 3 个，不是全量统计或代表性抽样。 |
| S6 | [当前 compaction 文档](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/coding-agent/docs/compaction.md) | 完整阅读。阈值、近期 token 预算、切点约束、重复压缩、分支摘要与扩展钩子。 |
| S7 | [当前 AgentHarness 规范](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/agent/docs/harness.md) | 阅读概览、存储、恢复示例、非目标和实现状态。以 §0.9 为实现缺口清单；本文不声称执行了其全部 conformance tests。 |
| S8 | [Session v3 格式](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/coding-agent/docs/session-format.md) | JSONL、id/parentId、消息 content blocks、toolCall 与 toolResult 的关联。真实数据是旧 coding-agent v3，不能证明 Harness v2/v4 的恢复行为。 |
| S9 | [Compaction 实现](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/coding-agent/src/core/compaction/compaction.ts) / [AgentSession](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/coding-agent/src/core/agent-session.ts) | 静态核对默认值、shouldCompact 与调用时机；没有运行上游 Pi。 |
| S10 | [当前 restore.ts](https://github.com/earendil-works/pi/blob/c1d4c801114545f47c440921d8b3e04aeb1e565d/packages/agent/src/harness/runtime/restore.ts) | 静态检查：读取 tip/config/lane state 以及 op.meta/op.state，校验关联后构建状态，函数不启动外部工作。 |

当前代码核对在 `c1d4c801114545f47c440921d8b3e04aeb1e565d`。旧文档被 [85a2060](https://github.com/earendil-works/pi/commit/85a2060811a23f1580c13ab59a210b1409092837) 合并。用户提供的 Harness t.co 短链返回 404，通过正式文件名及 Git 历史找回；其他原文用标题定位。

## 概念依赖与解释范围

`一次请求 → assistant/tool 循环 → 重复前缀 → 缓存取舍 → 有损上下文投影 → Session 树 → 可迁移交接 → 持久操作与恢复 → 真实记录检验`。

贯穿示例是“修复一个缓存统计错误”：这是教学虚构任务，不是数据集中 Mario 的真实任务。所有流程步数、彩色方块、预算实验与工具执行计数都是本地模拟。KV 方块表示逻辑输入段，不表示真实 tokenizer 分块或缓存硬件布局。

## 主张与边界

| 主张 | 证据类型 | 支持 | 限制 / 教学处理 |
| --- | --- | --- | --- |
| 完整可见历史、模型当前输入、Provider KV 是不同状态 | 源码/文档事实加教学归纳 | S1、S6、S8 | Session 中的所有条目不一定进入模型；缓存不是永久记忆。 |
| 相同 token 前缀是复用的基础，session ID 只是发现或路由线索 | 作者机制说明 | S1 | 实际命中还依赖模型、最小长度、缓存分块、存留和路由；课程只模拟前缀上界。 |
| 中间删改可能让后续保留部分重算；支持的原生工具延迟加载有追加路径 | 作者说明 | S1 | 支持依赖模型和 API；课程提供传统插入与“假设原生支持”对照，不列未经核实的型号。 |
| 压缩增加摘要条目，再构建 summary + retained messages 的请求上下文 | 文档与实现 | S6、S9 | 有损；历史仍在也不等于自动全部重新注入。调用摘要模型也有成本。 |
| 默认 reserveTokens=16384，keepRecentTokens=20000；判断是严格大于 C-R | 代码事实 | S6、S9 | 近期预算是近似 token 目标，不是固定消息数。阈值实验不计算真实 tokenizer。 |
| 文章与当前文档的 compaction 检查时机不同 | 直接来源比对 | S2 vs S6 | 文章描述 turn 结束和 overflow；当前还在工具完成且将继续响应时、新 prompt 前检查。术语 turn/run 在不同文档中也不同。 |
| 工具结果不应独立成为切点 | 文档规则 | S6 | 大 turn 可在 assistant 边界拆分，并另做 turn-prefix 摘要。 |
| 分支是 parentId 路径；切换分支不删除另一条路径 | 格式事实 | S8 | `/tree` 可选摘要把离开的分支信息带到目标；不是自动把所有分支拼进 context。 |
| 可迁移是别的模型能接手语义，不要求 token、行为或质量一致 | 作者立场/定义 | S3 | 有限的文本不一定保留全部信息；Provider sealed state 对同源连续性可能有价值。 |
| 历史 v2 分离 tree、lanes、lane records、global facts | 历史设计 | S4 | 旧版日志恢复不能作为当前实现描述。 |
| 当前规范以 total op.state 为恢复入口 | 文档加代码观察 | S7、S10 | 当前 stores 为 entries、values/lists、usage；明确演进对照。文档包含未实现项。 |
| 一个 lane 最多一个操作；多个 lane 并行不等于多进程同时写 | 设计不变量 | S4、S7 | 当前 Branch/AgentLane 和显式 main 与旧版默认 main 有差异。 |
| 意图已提交、外部效果发生、结果未提交是“不确定窗口” | 规范 | S7 | replay: never 的未结算效果不自动重做；safe 也须符合已存与当前声明，示意仅模拟策略，不保证 exactly-once。 |
| 界面恢复与业务操作取消是独立生命周期 | 规范 | S7 | 示例中的刷新只清除易失显示；无真实服务器或网络副作用。 |

“Pi 的目标是让持续工作可承受、可接手、可恢复”是课程对这些来源的归纳，不是作者逐字原话或全部产品哲学的证明。

## 真实样本

页面只内嵌非叙事的结构字段：行号、entry id、parentId、类型、角色、content 类型、tool 名称及调用关联、压缩切点、原始记录中的 token 计数等。未复制完整用户消息、思考文本、工具输出、凭据、图片或本地路径。每个样本有固定 revision 原文件回链；事实性的字段投影不是原始 transcript。

| 样本 | 观察 | 精确位置 |
| --- | --- | --- |
| `e18dee76` · 2026-01-16 | 33 行：13 assistant、13 toolResult、2 user；assistant 的 thinking 与 toolCall 是不同 content blocks | [文件](https://huggingface.co/datasets/badlogicgames/pi-mono/blob/dac2a1d3ba12dda597b973a791a77618ccb5f413/2026-01-16T20-55-34-252Z_e18dee76-e4fc-4225-93aa-fef27bb337f8.jsonl) · 第 7–8 行的 tool call id 配对 |
| `9084660c` · 2026-03-02 | 495 行，有 1 个 compaction；后面仍有新条目 | [文件](https://huggingface.co/datasets/badlogicgames/pi-mono/blob/dac2a1d3ba12dda597b973a791a77618ccb5f413/2026-03-02T20-53-11-495Z_9084660c-d6dd-42f7-8892-91d565b75da5.jsonl) · 第 343 行 `4e5f9956`，`firstKeptEntryId=fdc4f4ef`，`tokensBefore=282414` 是文件记录值，不是本课测量 |
| `ffa23a57` · 2026-04-01 | 383 行，有一个共享 parent 的分叉；这个文件没有 branch_summary 条目 | [文件](https://huggingface.co/datasets/badlogicgames/pi-mono/blob/dac2a1d3ba12dda597b973a791a77618ccb5f413/2026-04-01T12-13-46-270Z_ffa23a57-4551-4981-a352-66184d8c7b62.jsonl) · 第 332 行 parent `770e501b`，第 333/335 行两个 child `b4321223` / `d1241557` |

公开数据经发布者筛选和尽力脱敏，不能推断 Mario 全部工作习惯、平均成功率、完整内部推理或线上成本；含 thinking 字段不证明它等于模型全部内部计算。样本没有演示崩溃恢复，课程也不从中推断恢复成功。

## 下一步验证

课程练习只检查你的预测是否符合这个有边界的模型。若要评估真实性能，需要固定 Pi/provider/model 版本、提示与工具布局、TTL/路由条件，收集实际 usage；若要证明恢复，则需执行上游恢复测试及外部工具的幂等性测试。本次未执行这些评估。
