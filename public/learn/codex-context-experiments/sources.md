# Codex context experiments：研究账本

核验与发布日期：2026-09-06。[Kuma Blog 互动课程](https://snowan.github.io/kuma-blog/learn/codex-context-experiments/)的公开来源账本。

研究起点是用户提供的 [Charles Packer 原帖](https://x.com/charlespacker/status/2096046696988119413)，发表于 2026-09-04。网页抓取返回 403 后，通过正常浏览器读取了原帖正文。原帖把摘要链、文件式记忆与带状态 API 检索当作待验证的解释；本课没有把这些猜测直接当成架构事实。

## 学习问题与结论

**中心问题：模型当前可使用的输入有限，一个持续任务怎样跨过多个窗口，还能找回早先的约束、失败尝试与测试证据？**

最小心智模型是：有限的工作上下文、可维护的笔记、可回查的历史，以及独立延续的文件与运行环境。该实验将预算提示、笔记/历史访问与换窗连接起来。公开客户端中的 `new_context` 路径不生成新的历史摘要；恢复需要按需读取笔记或历史。当前材料支持对客户端接口和状态变化的说明，不能证明后端数据库、训练方法或实际性能收益。

课程的因果主线是：观察预算 → 保存关键线索 → 切换工作上下文 → 按需找回证据 → 继续并验证。这是本课选取的正常工作流，不是源码强制每个任务完整执行的固定程序。尤其是笔记内容与检索决策仍依赖模型行为。

## 版本边界

- 实验入口的初始 PR：[openai/codex #42385](https://github.com/openai/codex/pull/42385)，2026-09-02 合并，合并提交 `cff76fa96f70f9f3b63d221446fd02cfd87e6d2e`。
- 本课最终固定的源码版本：[6af345407d9c2a568da9d01b6c4b81a9e61495c0](https://github.com/openai/codex/commit/6af345407d9c2a568da9d01b6c4b81a9e61495c0)，提交时间 2026-09-06 02:28:38 UTC。研究时通过 GitHub API 核对为 public main 的当时最新提交。
- 最新提交关联 [PR #43147](https://github.com/openai/codex/pull/43147)，为实验入口增加起始模型能力检查。不能只使用较早的 #42385 资格条件来描述这个新版本。
- 比较两版下载源码后，new_context 工具、token-budget 上下文片段、token-budget compaction，以及 history-notes 的工具、后端和 extension 文件一致；启动激活、session 与测试文件发生变化。本课相关链接固定到最终版本。
- 源码存在某个能力不等于用户当前安装客户端已发布、已启用、账号符合条件或后端正常。此研究没有修改用户配置，也没有检查私人历史或笔记。

## 原子主张与证据

| 主张 | 证据类型 | 直接来源 | 限制 |
| --- | --- | --- | --- |
| 官方实验以跨窗口笔记和同一任务历史检索保存连续性；默认关闭 | 官方文档 | [Models：Experimental context management](https://learn.chatgpt.com/docs/models#experimental-context-management) | 产品说明较概括；不能推导内部存储 |
| 配置键是 `features.context_management.experimental_mode` | 官方配置文档 | [配置参考](https://learn.chatgpt.com/docs/config-file/config-reference) | 需要符合条件的客户端 / 登录方式；新任务生效 |
| 初始实验入口会激活 TokenBudget 和 history notes | 公开源码阅读 | [token_budget.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/session/token_budget.rs#L21) | 受模型能力、认证、provider、workspace 管理等条件约束 |
| 新版本要求起始模型声明支持；能力缺省 false，内置 Astra 开启 | 变更记录及源码阅读 | [#43147](https://github.com/openai/codex/pull/43147), [激活判断](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/session/token_budget.rs#L21) | 内置目录和实际客户端/后端目录可能随时间变动 |
| `new_context` 不重置环境，处理器请求一次不做摘要的换窗 | 工具定义及处理器阅读 | [工具定义](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/tools/handlers/new_context_window_spec.rs#L9), [处理器](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/tools/handlers/new_context_window.rs#L14) | 不保证换窗前模型已经写好笔记 |
| 换窗重建初始上下文与 world state，并替换活跃历史；部分 developer 消息按特性有界保留 | 公开源码阅读 | [start_new_context_window](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/session/mod.rs#L4219) | 不能说全部旧消息继续直接可见，也不能说一切环境被清空 |
| 新窗口有 first / previous / current window ID 等上下文标识 | 公开源码阅读 | [token_budget_context.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/context/token_budget_context.rs#L63) | 有前后 ID 不是“整个实现只有摘要链”的证据 |
| history 提供窗口列举、消息列举、按 ID 读取与搜索；搜索是区分大小写的字面子串 | 接口契约阅读 | [tools.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/tools.rs#L142) | 不能从这个契约推导向量搜索、语义检索或完整后端索引算法 |
| notes 提供虚拟文件的列举、读、搜、追加与替换 | 接口契约阅读 | [tools.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/tools.rs#L24) | 虚拟路径不是本机文件路径；范围是此 rollout 的窗口连续性 |
| 成功写笔记后的直接读取立即反映写入；列举、搜索与历史可见性有最终一致性 | 接口契约阅读 | [namespace 描述](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/tools.rs#L24) | 是公开契约描述，不是本次测出的服务 SLA |
| 单个笔记文件上限 1,000,000 UTF-8 字节 | 接口契约阅读 | [notes 描述](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/tools.rs#L27) | 不能与窗口 token 上限或练习中的 6 格混为一谈 |
| 客户端通过 Codex 后端路由访问 history 和 notes，并附带 session 与 agent 身份 | 公开客户端源码阅读 | [backend.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/backend.rs#L30) | 不是后端数据库、持久化拓扑或跨所有用户任务检索的证据 |
| extension 可把后端 thread_hint 放入窗口上下文，失败、空值或超限时跳过 | 公开客户端源码阅读 | [extension.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/ext/history-notes/src/extension.rs#L105) | 提示内容生成方式不在该客户端实现中公开；不保证每次存在 |
| token-budget 手动和自动 compaction 可以跳过摘要，但保留 compaction hooks / 事件生命周期 | 公开源码阅读 | [compact_token_budget.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/compact_token_budget.rs#L22) | 所以 compaction 事件不必意味着生成了摘要 |
| token-budget 提醒及 fallback 受配置和模型默认值影响 | 源码与测试阅读 | [token_budget.rs](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/src/session/token_budget.rs), [fallback 测试](https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/core/tests/suite/token_budget.rs#L1343) | 没有单一适用于所有模型的百分比阈值；本课 100 格完全为教学构造 |

## 文档差异与未解决的问题

模型说明页写 Plus / Pro；配置参考与源码还列出 Pro Lite。本课展示这个粒度差异，没有自行抹平。最新源码还增加起始模型能力检查，说明不能把初始发布说明当成永远不变的完整资格逻辑。

目前未知：后端具体数据库和索引架构、数据保留 SLA、检索失败率、笔记质量的分布、是否以及如何专门训练模型使用这些能力、与其他 compaction 路径相比的真实质量 / 延迟 / 成本。这些未知不影响解释已公开的客户端机制，但限制性能和产品可用性结论。

公开源码把 history / notes 定义为模型接续任务使用的内部能力。本教学页展示的是公开接口与合成材料，没有访问当前任务的私人恢复内容，也不把内部工具包装为用户实际可点击的 Codex 控件。

## 教学构造与推荐实践

- `paginate(offset)`、pageSize=37、commit a17 / b24、窗口 W1 / W2、消息 m01–m06、所有 PASS / FAIL 内容都是合成例子。
- 100 格窗口预算、88% 提醒点、6 格便签容量、索引延迟开关、5 秒 / 2.8 秒播放节奏都是教学变量，没有测量含义。
- a17 的 PASS 覆盖 offset=0、36；b24 的 FAIL 针对 offset=37。例子刻意要求同时核对版本与测试范围。
- 便签的“目标与约束 / 当前证据与出处 / 排除路径 / 下一步”是恢复策略建议，不是官方强制格式。
- “历史告诉你过去，当前环境检查告诉你现在”是由状态与证据边界得出的工程判断。
- 窗口切换演示结束在“继续并验证”，没有伪造修复后 PASS。

## 后续可执行的评估，而非已完成的实验

选相同任务、模型、起点与预算；对照可适用的上下文策略；预先定义约束恢复、失败尝试恢复、版本归属、功能验证和外部动作边界。记录检索次数、实际输入/输出 token、缓存使用、延迟与任务结果。在索引延迟、过时笔记和服务错误下重复观察恢复行为。

本次没有运行真实模型 A/B、没有运行 Codex 仓库的 Rust 测试，也没有得出性能提升百分比。网页自身的浏览器检查与源代码阅读是不同的证据层；网页验证范围见[课程说明](./README.md#evidence-and-limitations)。
