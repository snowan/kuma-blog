---
title: "MAGMA: AI记忆的多图革命"
---

## Metadata

| Field | Value |
|-------|-------|
| **Article Title** | MAGMA: A Multi-Graph based Agentic Memory Architecture for AI Agents |
| **Source** | [MAGMA Paper](https://arxiv.org/abs/2601.03236) |
| **Author** | Dongming Jiang, Yi Li, Guanpeng Li, Bingzhe Li |
| **Date** | 2026-01 |

## Article Summary

本文提出MAGMA，一种多图智能体记忆架构，通过将记忆分解为语义、时序、因果和实体四个正交图层，解决了LLM长期推理中的记忆遗忘问题。通过意图感知的图遍历检索策略，MAGMA在LoCoMo和LongMemEval基准测试中显著超越现有最先进方法。

---

## Technical Details

| Property | Value |
|----------|-------|
| Topic | AI Agent记忆架构 |
| Time Span | 2026 |
| Narrative Approach | chronological |
| Recommended Style | sepia |
| Recommended Layout | cinematic |
| Aspect Ratio | 3:4 |
| Language | zh |
| Page Count | 10 |
| Generated | 2026-01-19 16:55 |

---

# MAGMA记忆革命 - 知识漫画分镜稿

**Character Reference**: characters-chronological/characters.png

---

## Cover

**Filename**: 00-cover-magma-memory.png
**Core Message**: AI Agent的记忆觉醒

**Visual Design**:
- 标题使用科技感的金属字体，带有微光效果
- 主视觉：四层交织的发光网络图，代表四种关系图
- 中心是一个可爱的AI Agent形象，被记忆网络环绕
- 怀旧的棕褐色调(sepia)，带有科技感的点缀
- 副标题："打破LLM的记忆围墙"

**Visual Prompt**:
Sepia-toned cinematic cover art for an educational manga. Center: A cute robot assistant character surrounded by four interconnected glowing network layers (gold for semantic, bronze for temporal, copper for causal, silver for entity). The networks form a protective dome around the robot. Title "MAGMA 记忆革命" in metallic serif font at top. Subtitle at bottom. Warm brown color palette with golden highlights. Academic yet approachable aesthetic.

---

## Page 1 / 10

**Filename**: 01-page-memory-problem.png
**Layout**: cinematic
**Narrative Layer**: Main narrative
**Core Message**: LLM面临的记忆困境

### Section Summary

> **What this section covers**: 介绍大语言模型的根本局限性——有限的上下文窗口导致无法维持长期记忆，信息随时间"遗忘"。
> 
> **Key takeaway**: LLM需要外部记忆系统来解决长期推理问题。

### Panel Layout

**Panel Count**: 4
**Layout Type**: cinematic vertical flow

#### Panel 1 (Size: 1/2 page, Position: Top)

**Scene**: 一个可爱的机器人助手坐在信息的海洋中
**Image Description**:
- Camera angle: Wide shot, slightly overhead
- Characters: Cute robot assistant looking overwhelmed
- Environment: Surrounded by floating text blocks and documents
- Lighting: Warm sepia tones, soft glow from information blocks
- Color tone: Browns, golds, creams

**Text Elements**:
- Narrator box: 「大语言模型拥有强大的推理能力...」
- Caption bar: "Context Window: 固定长度"

#### Panel 2 (Size: 1/4 page, Position: Middle-left)

**Scene**: 信息从窗口边缘滑落消失
**Image Description**:
- Camera angle: Side view
- Characters: Robot reaching toward falling information blocks
- Environment: A visible "window" boundary with info sliding off
- Lighting: Information blocks dimming as they fall

**Text Elements**:
- Narrator box: 「但它们的记忆有限...」

#### Panel 3 (Size: 1/4 page, Position: Middle-right)

**Scene**: 机器人困惑地看着空荡的空间
**Image Description**:
- Camera angle: Close-up on robot's confused face
- Characters: Robot with question marks around head
- Environment: Empty space where memories used to be

**Text Elements**:
- Dialogue bubble: "刚才说了什么来着？"

#### Panel 4 (Size: 1/4 page, Position: Bottom)

**Scene**: 问题陈述
**Image Description**:
- Camera angle: Diagram view
- Characters: None
- Environment: Visual showing "lost-in-the-middle" phenomenon

**Text Elements**:
- Narrator box: 「这就是"迷失在中间"现象 — 距离越远，注意力越弱」

**Page Hook**: 如何让AI获得真正的长期记忆？

**Visual Prompt**:
Sepia-toned educational manga page with 4 panels in cinematic layout. Panel 1 (half page): Cute robot assistant sitting in sea of floating golden text blocks, looking overwhelmed. Panel 2: Robot reaching toward information blocks sliding off an invisible edge. Panel 3: Close-up of robot's confused face with question marks. Panel 4: Diagram showing "lost-in-the-middle" attention decay curve. Warm brown palette with golden highlights. Clean lines, academic feel.

---

## Page 2 / 10

**Filename**: 02-page-mag-systems.png
**Layout**: cinematic
**Narrative Layer**: Mixed
**Core Message**: 现有记忆增强方法的局限

### Section Summary

> **What this section covers**: 介绍Memory-Augmented Generation (MAG)的概念，以及现有方法（如A-MEM、Nemori）依赖语义相似度的局限性。
> 
> **Key takeaway**: 现有MAG系统缺乏对时序、因果、实体关系的显式建模。

### Panel Layout

**Panel Count**: 3
**Layout Type**: story progression

#### Panel 1 (Size: 1/3 page, Position: Top)

**Scene**: MAG概念图解
**Image Description**:
- Camera angle: Diagram view
- Characters: Robot with an external "memory bank" connected
- Environment: Clean technical illustration
- Lighting: Warm highlights on memory connection

**Text Elements**:
- Narrator box: 「记忆增强生成(MAG)为LLM添加外部记忆」
- Caption bar: "Memory-Augmented Generation"

#### Panel 2 (Size: 1/3 page, Position: Middle)

**Scene**: 语义相似度检索的问题
**Image Description**:
- Camera angle: Overhead view of memory nodes
- Characters: Robot searching through uniform blobs
- Environment: All memory nodes look similar, no structure

**Text Elements**:
- Narrator box: 「但现有系统只靠语义相似度检索...」
- Dialogue bubble: "这些记忆看起来都一样！"

#### Panel 3 (Size: 1/3 page, Position: Bottom)

**Scene**: 缺失的关系类型
**Image Description**:
- Camera angle: Split view showing missing connections
- Characters: Ghost-like missing links between nodes
- Environment: Four empty quadrants labeled: 语义 ✓, 时序 ✗, 因果 ✗, 实体 ✗

**Text Elements**:
- Narrator box: 「时序、因果、实体关系被忽略了」

**Page Hook**: 有没有更好的架构？

**Visual Prompt**:
Sepia-toned educational manga page with 3 equal panels. Panel 1: Technical diagram showing robot connected to external "memory bank" cloud. Panel 2: Robot searching through identical-looking memory blob nodes, confused expression. Panel 3: Four quadrants showing semantic (checkmark), temporal (X), causal (X), entity (X) missing connections. Warm brown palette, clean technical illustration style.

---

## Page 3 / 10

**Filename**: 03-page-magma-intro.png
**Layout**: splash mixed
**Narrative Layer**: Main narrative
**Core Message**: MAGMA的多图架构概览

### Section Summary

> **What this section covers**: 介绍MAGMA的核心创新——将记忆表示为跨越四个正交关系图的结构化系统。
> 
> **Key takeaway**: MAGMA通过分离语义、时序、因果、实体四种关系，实现更精准的记忆检索。

### Panel Layout

**Panel Count**: 2
**Layout Type**: splash + detail

#### Panel 1 (Size: 2/3 page, Position: Top - Splash)

**Scene**: MAGMA四图架构全景
**Image Description**:
- Camera angle: Isometric 3D view
- Characters: Four interconnected graph layers floating in space
- Environment: 
  - Layer 1 (金色): Semantic Graph - 概念云
  - Layer 2 (铜色): Temporal Graph - 时间轴链
  - Layer 3 (青铜): Causal Graph - 因果箭头
  - Layer 4 (银色): Entity Graph - 实体网络
- Lighting: Each layer has its own glow color

**Text Elements**:
- Title: "MAGMA: Multi-Graph Agentic Memory"
- Labels on each layer

#### Panel 2 (Size: 1/3 page, Position: Bottom)

**Scene**: 核心理念解释
**Image Description**:
- Camera angle: Diagram with character
- Characters: Cute robot giving thumbs up
- Environment: Simple equation visual

**Text Elements**:
- Narrator box: 「将记忆解耦为四种正交关系，实现查询自适应检索」

**Page Hook**: 让我们深入了解每一层...

**Visual Prompt**:
Sepia-toned manga splash page. Top 2/3: Isometric 3D view of four floating interconnected graph layers - golden semantic cloud, bronze temporal chain, copper causal arrows, silver entity web. Each layer glows with its distinct color. Bottom 1/3: Cute robot giving thumbs up next to simple diagram. Warm brown base with colorful graph accents. Academic yet inviting aesthetic.

---

## Page 4 / 10

**Filename**: 04-page-four-graphs.png
**Layout**: dense
**Narrative Layer**: Educational
**Core Message**: 四种关系图的详细解释

### Section Summary

> **What this section covers**: 深入解释语义图（概念相似）、时序图（时间顺序）、因果图（逻辑因果）、实体图（对象关联）的定义和作用。
> 
> **Key takeaway**: 每种图捕获不同类型的关系，共同支持复杂推理。

### Panel Layout

**Panel Count**: 4 (quadrant layout)
**Layout Type**: grid

#### Panel 1 (Size: 1/4 page, Position: Top-left)

**Scene**: Semantic Graph 语义图
**Image Description**:
- Camera angle: Node network view
- Environment: Colorful nodes clustered by similarity
- Visual metaphor: Similar concepts as nearby stars

**Text Elements**:
- Title: "语义图 Semantic"
- Description: "概念相近的记忆相互连接"
- Formula hint: cos(v_i, v_j) > θ

#### Panel 2 (Size: 1/4 page, Position: Top-right)

**Scene**: Temporal Graph 时序图
**Image Description**:
- Camera angle: Timeline view
- Environment: Beads on a timeline chain
- Visual metaphor: Events as pearls on a necklace

**Text Elements**:
- Title: "时序图 Temporal"
- Description: "按时间顺序的不可变链"
- Formula hint: τ_i < τ_j

#### Panel 3 (Size: 1/4 page, Position: Bottom-left)

**Scene**: Causal Graph 因果图
**Image Description**:
- Camera angle: Arrow network view
- Environment: Domino-style cause-effect chains
- Visual metaphor: Dominoes falling in sequence

**Text Elements**:
- Title: "因果图 Causal"
- Description: "回答'为什么'的逻辑链"
- Note: "支持Why查询"

#### Panel 4 (Size: 1/4 page, Position: Bottom-right)

**Scene**: Entity Graph 实体图
**Image Description**:
- Camera angle: Relationship web view
- Environment: Character icons connected by lines
- Visual metaphor: Social network of entities

**Text Elements**:
- Title: "实体图 Entity"
- Description: "追踪对象跨时间的关联"
- Note: "解决对象持久性问题"

**Page Hook**: 如何利用这四层进行检索？

**Visual Prompt**:
Sepia-toned educational manga page with 4 equal quadrants. Top-left: Semantic graph as colorful clustered star nodes. Top-right: Temporal graph as pearls on a horizontal timeline chain. Bottom-left: Causal graph as falling dominoes with arrows. Bottom-right: Entity graph as character icons in social network. Each quadrant has title and brief Chinese description. Clean diagrammatic style, warm browns with accent colors per graph type.

---

## Page 5 / 10

**Filename**: 05-page-query-process.png
**Layout**: cinematic
**Narrative Layer**: Main narrative
**Core Message**: 意图感知的查询处理流程

### Section Summary

> **What this section covers**: 介绍MAGMA的四阶段查询流程：查询分析、锚点识别、自适应遍历、叙事合成。
> 
> **Key takeaway**: MAGMA根据查询意图（Why/When/Entity）动态选择最相关的图层进行检索。

### Panel Layout

**Panel Count**: 5
**Layout Type**: vertical flow

#### Panel 1 (Size: 1/5 page, Position: Top)

**Scene**: 查询输入
**Image Description**:
- Camera angle: Wide shot
- Characters: User asking a question
- Environment: Question bubble floating toward system

**Text Elements**:
- Dialogue bubble: "为什么Alice上周改变了主意？"
- Caption bar: "Stage 1: Query Analysis"

#### Panel 2 (Size: 1/5 page, Position: Upper-middle)

**Scene**: 意图分类
**Image Description**:
- Camera angle: System interior view
- Characters: Router mechanism
- Environment: Three paths labeled Why/When/Entity

**Text Elements**:
- Narrator box: 「意图分类：检测到"Why"查询 → 激活因果图权重」

#### Panel 3 (Size: 1/5 page, Position: Middle)

**Scene**: 锚点识别
**Image Description**:
- Camera angle: Graph overview
- Environment: Multiple entry points highlighted on graphs
- Visual: RRF fusion combining signals

**Text Elements**:
- Caption bar: "Stage 2: Anchor Identification"
- Narrator box: 「融合语义、关键词、时间信号定位入口点」

#### Panel 4 (Size: 1/5 page, Position: Lower-middle)

**Scene**: 自适应遍历
**Image Description**:
- Camera angle: Inside graph view
- Characters: Beam search explorer
- Environment: Paths expanding, low-score paths pruning

**Text Elements**:
- Caption bar: "Stage 3: Adaptive Traversal"
- Narrator box: 「启发式束搜索，因果边优先」

#### Panel 5 (Size: 1/5 page, Position: Bottom)

**Scene**: 叙事合成
**Image Description**:
- Camera angle: Output assembly
- Characters: Retrieved nodes → coherent context
- Environment: Structured blocks forming narrative

**Text Elements**:
- Caption bar: "Stage 4: Narrative Synthesis"
- Narrator box: 「拓扑排序 + 证据标注 → 结构化上下文」

**Page Hook**: 记忆如何持续演化？

**Visual Prompt**:
Sepia-toned manga page with 5 equal vertical panels showing query flow. Panel 1: User speech bubble with question floating toward system. Panel 2: Three-way router switch highlighting "Why" path. Panel 3: Graph overview with multiple glowing anchor points. Panel 4: Beam search paths expanding, some fading/pruning. Panel 5: Nodes assembling into structured context blocks. Warm browns with golden highlights on active elements.

---

## Page 6 / 10

**Filename**: 06-page-memory-evolution.png
**Layout**: cinematic
**Narrative Layer**: Educational
**Core Message**: 双流记忆演化机制

### Section Summary

> **What this section covers**: 介绍MAGMA的快路径（快速摄入）和慢路径（结构整合）双流处理机制。
> 
> **Key takeaway**: 解耦延迟敏感操作和深度推理，保持响应性同时精化记忆结构。

### Panel Layout

**Panel Count**: 3
**Layout Type**: comparison layout

#### Panel 1 (Size: 1/3 page, Position: Top)

**Scene**: 双流概念图
**Image Description**:
- Camera angle: System diagram
- Environment: Two parallel paths diverging from input
- Visual: Fast path (lightning icon) vs Slow path (deep sea icon)

**Text Elements**:
- Title: "Dual-Stream Memory Evolution"
- Labels: "Fast Path" / "Slow Path"

#### Panel 2 (Size: 1/3 page, Position: Middle)

**Scene**: 快路径 - 突触摄入
**Image Description**:
- Camera angle: Speed lines, action view
- Characters: Event quickly indexed
- Environment: Lightning-fast pipeline
- Visual metaphor: Express lane on highway

**Text Elements**:
- Title: "快路径: Synaptic Ingestion"
- Bullet points: 
  - "事件分割"
  - "向量索引"
  - "时序骨干更新"
- Narrator box: 「非阻塞操作，保持交互响应」

#### Panel 3 (Size: 1/3 page, Position: Bottom)

**Scene**: 慢路径 - 结构整合
**Image Description**:
- Camera angle: Deep, contemplative view
- Characters: Background worker analyzing nodes
- Environment: Library-like organization scene
- Visual metaphor: Librarian carefully cataloging

**Text Elements**:
- Title: "慢路径: Structural Consolidation"
- Bullet points:
  - "分析局部邻域"
  - "推断因果链接"
  - "构建实体关联"
- Narrator box: 「异步深度推理，精化关系结构」

**Page Hook**: 这一切在实验中表现如何？

**Visual Prompt**:
Sepia-toned manga page with 3 panels. Panel 1: System diagram showing two paths splitting - lightning bolt fast path, deep sea slow path. Panel 2: Fast path as highway express lane with speed lines, event nodes zipping through. Panel 3: Slow path as cozy library with librarian character carefully connecting books/nodes. Warm browns, contrast between energetic and calm atmospheres.

---

## Page 7 / 10

**Filename**: 07-page-experiments.png
**Layout**: standard
**Narrative Layer**: Results presentation
**Core Message**: 在基准测试上的优异表现

### Section Summary

> **What this section covers**: 展示MAGMA在LoCoMo和LongMemEval基准上超越A-MEM、Nemori、MemoryOS等基线方法的实验结果。
> 
> **Key takeaway**: MAGMA达到0.7的Judge分数，比最佳基线提升18.6%，特别在时序和对抗性场景中表现突出。

### Panel Layout

**Panel Count**: 3
**Layout Type**: results showcase

#### Panel 1 (Size: 1/2 page, Position: Top)

**Scene**: 性能对比图表
**Image Description**:
- Camera angle: Chart view
- Environment: Bar chart with methods comparison
- Visual: MAGMA bar clearly highest

**Text Elements**:
- Title: "LoCoMo Benchmark Results"
- Chart labels: Full Context (0.48), A-MEM (0.58), Nemori (0.59), MemoryOS (0.55), MAGMA (0.70)
- Highlight: "18.6% - 45.5% improvement"

#### Panel 2 (Size: 1/4 page, Position: Bottom-left)

**Scene**: 时序推理优势
**Image Description**:
- Camera angle: Focused comparison
- Characters: MAGMA mascot with trophy
- Environment: Temporal category highlight

**Text Elements**:
- Narrator box: 「时序类别：0.650分，验证时序推理引擎有效性」

#### Panel 3 (Size: 1/4 page, Position: Bottom-right)

**Scene**: 对抗性鲁棒性
**Image Description**:
- Camera angle: Shield icon view
- Characters: MAGMA deflecting distractors
- Environment: Adversarial scenario visualization

**Text Elements**:
- Narrator box: 「对抗场景：0.742分，自适应策略避开误导性干扰」

**Page Hook**: 效率表现如何？

**Visual Prompt**:
Sepia-toned manga page showing experimental results. Top half: Clean bar chart comparing methods - MAGMA bar clearly tallest (0.70) among competitors. Bottom left: Cute trophy/medal scene for temporal reasoning. Bottom right: Shield icon deflecting attack arrows (adversarial robustness). Warm brown palette with golden accents on winning elements.

---

## Page 8 / 10

**Filename**: 08-page-efficiency.png
**Layout**: standard
**Narrative Layer**: Technical results
**Core Message**: 效率分析 - 更快、更省token

### Section Summary

> **What this section covers**: 展示MAGMA在检索延迟和token消耗方面的效率优势，特别是在超长上下文(100K+ tokens)场景下的可扩展性。
> 
> **Key takeaway**: MAGMA通过自适应遍历实现高效剪枝，降低延迟和token使用。

### Panel Layout

**Panel Count**: 3
**Layout Type**: efficiency showcase

#### Panel 1 (Size: 1/3 page, Position: Top)

**Scene**: 延迟对比
**Image Description**:
- Camera angle: Racing comparison
- Characters: MAGMA as fast runner
- Environment: Other methods lagging behind

**Text Elements**:
- Title: "Retrieval Latency"
- Narrator box: 「高效剪枝无关图区域」

#### Panel 2 (Size: 1/3 page, Position: Middle)

**Scene**: Token消耗
**Image Description**:
- Camera angle: Resource usage bars
- Characters: Token coins representing usage
- Visual: MAGMA using fewer tokens

**Text Elements**:
- Title: "Token Efficiency"
- Narrator box: 「显著性预算分配 — 重要节点保留细节，次要节点压缩」

#### Panel 3 (Size: 1/3 page, Position: Bottom)

**Scene**: 长上下文扩展性
**Image Description**:
- Camera angle: Scale comparison
- Environment: 100K+ token context visualization
- Visual: MAGMA handling massive context gracefully

**Text Elements**:
- Title: "LongMemEval: 100K+ Context"
- Narrator box: 「在超长上下文中保持稳定性能」

**Page Hook**: 这项工作有什么局限？

**Visual Prompt**:
Sepia-toned manga page with 3 panels. Panel 1: Racing scene with MAGMA character ahead of competitors. Panel 2: Token coins comparison - MAGMA pile smaller but effective. Panel 3: Massive 100K document stack with MAGMA confidently handling it. Warm browns with efficiency-green accents.

---

## Page 9 / 10

**Filename**: 09-page-limitations.png
**Layout**: standard
**Narrative Layer**: Honest assessment
**Core Message**: 局限性与未来方向

### Section Summary

> **What this section covers**: 诚实讨论MAGMA的局限性：依赖LLM推理质量、多图存储复杂性、评估范围有限。
> 
> **Key takeaway**: 了解系统局限是科学诚信的体现，也指明了未来研究方向。

### Panel Layout

**Panel Count**: 3
**Layout Type**: balanced discussion

#### Panel 1 (Size: 1/3 page, Position: Top)

**Scene**: LLM依赖性
**Image Description**:
- Camera angle: Thought process visualization
- Characters: LLM thinking, sometimes with errors
- Environment: Occasional wrong links being created

**Text Elements**:
- Title: "局限1: LLM推理依赖"
- Narrator box: 「图质量取决于底层LLM的推理保真度」

#### Panel 2 (Size: 1/3 page, Position: Middle)

**Scene**: 复杂性开销
**Image Description**:
- Camera angle: System architecture view
- Characters: Multiple graph layers and streams
- Environment: Infrastructure complexity visualization

**Text Elements**:
- Title: "局限2: 工程复杂性"
- Narrator box: 「多图基底比纯向量系统需要更多存储和工程资源」

#### Panel 3 (Size: 1/3 page, Position: Bottom)

**Scene**: 未来方向
**Image Description**:
- Camera angle: Horizon view
- Characters: MAGMA looking toward future possibilities
- Environment: Multimodal, heterogeneous scenarios

**Text Elements**:
- Title: "未来方向"
- Bullet list: "多模态Agent" / "异构观察流" / "更广泛评估基准"

**Page Hook**: 让我们总结一下...

**Visual Prompt**:
Sepia-toned manga page with 3 panels discussing limitations. Panel 1: LLM character thinking, some dotted (uncertain) links forming. Panel 2: Complex multi-layer system architecture visualization. Panel 3: Horizon scene with MAGMA looking toward future - multimodal icons (image, audio, video) in distance. Honest, balanced tone, warm browns.

---

## Page 10 / 10

**Filename**: 10-page-conclusion.png
**Layout**: splash
**Narrative Layer**: Summary & call-to-action
**Core Message**: MAGMA的核心贡献总结

### Section Summary

> **What this section covers**: 总结MAGMA的四大核心贡献，提供开源代码链接，鼓励读者探索和应用。
> 
> **Key takeaway**: MAGMA为Agent记忆提供了可解释、可扩展的多图架构，代码已开源供社区使用。

### Panel Layout

**Panel Count**: 2
**Layout Type**: splash + summary

#### Panel 1 (Size: 2/3 page, Position: Top - Splash)

**Scene**: 四大贡献总结
**Image Description**:
- Camera angle: Celebration/achievement view
- Characters: MAGMA system with four key icons
- Environment: Achievement podium with four pillars
- Visual: Four pillars for four contributions

**Text Elements**:
- Center: "MAGMA 核心贡献"
- Pillar 1: "多图架构 - 显式建模四种关系"
- Pillar 2: "自适应遍历 - 意图感知路由"
- Pillar 3: "双流演化 - 快+慢记忆处理"
- Pillar 4: "SoTA性能 - 超越现有方法"

#### Panel 2 (Size: 1/3 page, Position: Bottom)

**Scene**: 开源邀请
**Image Description**:
- Camera angle: Friendly invitation
- Characters: MAGMA mascot beckoning
- Environment: GitHub logo, code symbols

**Text Elements**:
- Title: "开源代码"
- Link: "github.com/FredJiang0324/MAMGA"
- Narrator box: 「探索、实验、构建你自己的Agent记忆系统！」
- Final message: "The End / 完"

**Page Hook**: N/A (final page)

**Visual Prompt**:
Sepia-toned manga final page. Top 2/3 splash: Four golden pillars on achievement podium, each representing a core contribution with icon. MAGMA system character in center celebrating. Bottom 1/3: Friendly invitation scene with GitHub logo, code brackets, and beckoning mascot. "The End 完" in elegant typography. Warm, triumphant, inviting tone.
