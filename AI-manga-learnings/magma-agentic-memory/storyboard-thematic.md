---
title: "MAGMA: 图解AI的多维记忆"
---

## Metadata

| Field | Value |
|-------|-------|
| **Article Title** | MAGMA: A Multi-Graph based Agentic Memory Architecture for AI Agents |
| **Source** | [MAGMA Paper](https://arxiv.org/abs/2601.03236) |
| **Author** | Dongming Jiang, Yi Li, Guanpeng Li, Bingzhe Li |
| **Date** | 2026-01 |

## Article Summary

MAGMA是一种创新的多图记忆架构，通过将AI Agent的记忆组织为语义、时序、因果、实体四个独立但互联的图层，解决了传统记忆系统的结构性缺陷。核心创新包括意图感知检索和双流处理机制。

---

## Technical Details

| Property | Value |
|----------|-------|
| Topic | AI Agent记忆架构 |
| Time Span | 2026 |
| Narrative Approach | thematic |
| Recommended Style | tech |
| Recommended Layout | dense |
| Aspect Ratio | 3:4 |
| Language | zh |
| Page Count | 10 |
| Generated | 2026-01-19 16:58 |

---

# MAGMA多维记忆 - 知识漫画分镜稿

**Character Reference**: characters-thematic/characters.png

---

## Cover

**Filename**: 00-cover-magma-dimensions.png
**Core Message**: 四维度解锁AI记忆

**Visual Design**:
- 标题使用科技蓝霓虹字体，带有电路板纹理
- 主视觉：四个相互嵌套的立方体，代表四种图层
- 中心是大脑图标与图网络融合的imagery
- 深色科技背景带有蓝绿渐变
- 副标题："Breaking Memory Barriers with Multi-Graph Architecture"

**Visual Prompt**:
Tech-style cover art for educational manga. Dark navy blue background with subtle circuit patterns. Center: Four nested translucent cubes (blue semantic, green temporal, orange causal, purple entity) forming a brain-like shape. Neural network connections glowing between layers. Title "MAGMA 多维记忆" in neon cyan tech font. Futuristic, precise, intelligent aesthetic.

---

## Page 1 / 10

**Filename**: 01-page-problem-space.png
**Layout**: dense
**Narrative Layer**: Problem definition
**Core Message**: 定义LLM记忆问题空间

### Section Summary

> **What this section covers**: 系统性地展示LLM记忆的多维度问题：上下文窗口限制、注意力衰减、跨会话遗忘。
> 
> **Key takeaway**: 理解问题的多个维度是设计解决方案的前提。

### Panel Layout

**Panel Count**: 6
**Layout Type**: dense grid

#### Panel 1 (Size: 1/6 page, Position: Top-left)
**Scene**: 上下文窗口图解
**Text Elements**:
- Icon: Fixed-size window
- Label: "固定长度上下文窗口"

#### Panel 2 (Size: 1/6 page, Position: Top-center)
**Scene**: 注意力稀释
**Text Elements**:
- Icon: Diluted attention waves
- Label: "注意力随距离衰减"

#### Panel 3 (Size: 1/6 page, Position: Top-right)
**Scene**: 位置编码限制
**Text Elements**:
- Icon: Position encoding grid
- Label: "位置编码局限"

#### Panel 4 (Size: 1/6 page, Position: Bottom-left)
**Scene**: 跨会话遗忘
**Text Elements**:
- Icon: Broken session chain
- Label: "会话间无持久化"

#### Panel 5 (Size: 1/6 page, Position: Bottom-center)
**Scene**: 推理不一致
**Text Elements**:
- Icon: Conflicting arrows
- Label: "长程推理不稳定"

#### Panel 6 (Size: 1/6 page, Position: Bottom-right)
**Scene**: 问题总结
**Text Elements**:
- Icon: Summary diagram
- Label: "需要结构化外部记忆"

**Visual Prompt**:
Tech-style dense manga page with 6 small panels in grid. Each panel contains one icon and Chinese label. Icons: fixed window frame, diluting waves, position grid, broken chain, conflicting arrows, memory bank. Dark blue background, cyan highlights, clean technical illustration style.

---

## Page 2 / 10

**Filename**: 02-page-existing-solutions.png
**Layout**: dense
**Narrative Layer**: State-of-the-art analysis
**Core Message**: 现有解决方案的分类与局限

### Section Summary

> **What this section covers**: 对比RAG、MAG、A-MEM、Nemori等现有方法，分析各自的优势与不足。
> 
> **Key takeaway**: 现有方法缺乏多关系显式建模，难以支持复杂推理。

### Panel Layout

**Panel Count**: 4
**Layout Type**: comparison matrix

#### Panel 1 (Size: 1/4 page, Position: Top-left)
**Scene**: RAG方法
**Image Description**: Static document retrieval
**Text Elements**:
- Title: "RAG"
- Pros: "外部知识增强"
- Cons: "静态库，无记忆演化"

#### Panel 2 (Size: 1/4 page, Position: Top-right)
**Scene**: MAG范式
**Image Description**: Dynamic feedback loop
**Text Elements**:
- Title: "MAG"
- Pros: "动态记忆+反馈循环"
- Cons: "依赖语义相似度"

#### Panel 3 (Size: 1/4 page, Position: Bottom-left)
**Scene**: A-MEM
**Image Description**: Zettelkasten-like notes
**Text Elements**:
- Title: "A-MEM"
- Pros: "自演化笔记网络"
- Cons: "缺少时序/因果建模"

#### Panel 4 (Size: 1/4 page, Position: Bottom-right)
**Scene**: Nemori
**Image Description**: Episodic segmentation
**Text Elements**:
- Title: "Nemori"
- Pros: "情景分割+对齐"
- Cons: "叙事式未分化结构"

**Visual Prompt**:
Tech-style manga page with 4 quadrants comparing methods. Each quadrant: method name, icon, pros (green), cons (red). RAG: document stack, MAG: feedback loop, A-MEM: linked notes, Nemori: episode segments. Dark blue grid background, contrasting highlights.

---

## Page 3 / 10

**Filename**: 03-page-magma-thesis.png
**Layout**: splash
**Narrative Layer**: Core thesis
**Core Message**: MAGMA核心论点

### Section Summary

> **What this section covers**: 提出MAGMA的核心设计原则：多图分离表示 + 策略引导遍历 + 双流演化。
> 
> **Key takeaway**: 分离记忆表示与检索逻辑，实现透明可控的推理路径。

### Panel Layout

**Panel Count**: 1 (full splash)
**Layout Type**: thesis statement

#### Panel 1 (Size: Full page, Position: Center)

**Scene**: MAGMA核心论点可视化
**Image Description**:
- Camera angle: Conceptual diagram
- Environment: Three key principles as interconnected nodes
- 1. Multi-Graph Representation (四个图层图标)
- 2. Policy-Guided Traversal (路由器+路径图标)
- 3. Dual-Stream Evolution (快慢双流图标)
- Central: "Decoupling Representation from Retrieval"

**Text Elements**:
- Title: "MAGMA 设计原则"
- Principle 1: "多图分离表示"
- Principle 2: "策略引导遍历"
- Principle 3: "双流记忆演化"
- Central thesis: "解耦表示与检索 → 透明推理路径"

**Visual Prompt**:
Tech-style splash page. Dark blue gradient background. Three large principle nodes connected in triangle: multi-graph icon (4 layers), router icon (paths), dual-stream icon (fast/slow lanes). Center: glowing text "Decoupling Representation from Retrieval". Clean lines, neon cyan and green accents.

---

## Page 4 / 10

**Filename**: 04-page-semantic-temporal.png
**Layout**: dense
**Narrative Layer**: Component deep dive
**Core Message**: 语义图与时序图详解

### Section Summary

> **What this section covers**: 深入解释语义图（基于余弦相似度连接概念）和时序图（不可变时间链）的定义、构建和用途。
> 
> **Key takeaway**: 语义支持"什么"查询，时序支持"何时"查询。

### Panel Layout

**Panel Count**: 4
**Layout Type**: detailed explanation

#### Panel 1 (Size: 1/4 page, Position: Top-left)
**Scene**: 语义图定义
**Text Elements**:
- Title: "Semantic Graph ℰsem"
- Formula: "cos(vi, vj) > θsim"
- Type: "无向边"

#### Panel 2 (Size: 1/4 page, Position: Top-right)
**Scene**: 语义图可视化
**Image Description**: Colorful clustered nodes
**Text Elements**:
- Visual: Similar concepts clustering

#### Panel 3 (Size: 1/4 page, Position: Bottom-left)
**Scene**: 时序图定义
**Text Elements**:
- Title: "Temporal Graph ℰtemp"
- Formula: "τi < τj"
- Type: "有向边（不可变）"

#### Panel 4 (Size: 1/4 page, Position: Bottom-right)
**Scene**: 时序图可视化
**Image Description**: Linear timeline chain
**Text Elements**:
- Visual: Events as beads on timeline

**Visual Prompt**:
Tech-style manga page with 4 panels. Top row: Semantic graph - left panel shows formula/definition, right panel shows colorful clustered node visualization. Bottom row: Temporal graph - left panel shows formula, right panel shows linear timeline with event nodes. Dark blue background, cyan for semantic, green for temporal.

---

## Page 5 / 10

**Filename**: 05-page-causal-entity.png
**Layout**: dense
**Narrative Layer**: Component deep dive
**Core Message**: 因果图与实体图详解

### Section Summary

> **What this section covers**: 深入解释因果图（支持Why查询）和实体图（解决对象持久性）的定义、构建和用途。
> 
> **Key takeaway**: 因果支持"为什么"查询，实体追踪跨时间的对象同一性。

### Panel Layout

**Panel Count**: 4
**Layout Type**: detailed explanation

#### Panel 1 (Size: 1/4 page, Position: Top-left)
**Scene**: 因果图定义
**Text Elements**:
- Title: "Causal Graph ℰcausal"
- Formula: "S(nj|ni,q) > δ"
- Type: "有向边（推断生成）"

#### Panel 2 (Size: 1/4 page, Position: Top-right)
**Scene**: 因果图可视化
**Image Description**: Domino chain / cause-effect arrows
**Text Elements**:
- Visual: "支持Why查询"

#### Panel 3 (Size: 1/4 page, Position: Bottom-left)
**Scene**: 实体图定义
**Text Elements**:
- Title: "Entity Graph ℰent"
- Purpose: "连接事件到抽象实体节点"
- Solves: "对象持久性问题"

#### Panel 4 (Size: 1/4 page, Position: Bottom-right)
**Scene**: 实体图可视化
**Image Description**: Entity nodes connecting to multiple events
**Text Elements**:
- Visual: Same entity across timeline segments

**Visual Prompt**:
Tech-style manga page with 4 panels. Top row: Causal graph - left shows formula, right shows domino cause-effect chain with arrows. Bottom row: Entity graph - left shows definition, right shows entity node connected to multiple temporal event nodes. Dark blue, orange for causal, purple for entity.

---

## Page 6 / 10

**Filename**: 06-page-query-pipeline.png
**Layout**: dense
**Narrative Layer**: Algorithm walkthrough
**Core Message**: 四阶段查询流水线

### Section Summary

> **What this section covers**: 详细展示Query Analysis → Anchor ID → Adaptive Traversal → Narrative Synthesis的完整流程。
> 
> **Key takeaway**: 每个阶段都有明确的输入输出和算法，形成端到端的检索管道。

### Panel Layout

**Panel Count**: 4
**Layout Type**: pipeline stages

#### Panel 1 (Size: 1/4 page)
**Scene**: Stage 1 Query Analysis
**Text Elements**:
- Input: Raw query q
- Process: Intent→Tq, Time→[τs,τe], Embed→q⃗
- Output: Structured signals

#### Panel 2 (Size: 1/4 page)
**Scene**: Stage 2 Anchor Identification
**Text Elements**:
- Input: Signals
- Process: RRF fusion (semantic + keyword + temporal)
- Output: Sanchor

#### Panel 3 (Size: 1/4 page)
**Scene**: Stage 3 Adaptive Traversal
**Text Elements**:
- Input: Anchor set
- Process: Heuristic beam search, S(nj|ni,q)
- Output: Gsub

#### Panel 4 (Size: 1/4 page)
**Scene**: Stage 4 Narrative Synthesis
**Text Elements**:
- Input: Subgraph
- Process: Topo sort + provenance + budgeting
- Output: Cprompt

**Visual Prompt**:
Tech-style manga page showing 4-stage pipeline as horizontal flow. Each stage: box with stage name, input arrow, process description, output arrow. Stage 1: Query analysis (parse icon), Stage 2: Anchor ID (target icon), Stage 3: Traversal (graph walk icon), Stage 4: Synthesis (document icon). Dark blue, flowing cyan arrows connecting stages.

---

## Page 7 / 10

**Filename**: 07-page-adaptive-policy.png
**Layout**: standard
**Narrative Layer**: Key innovation
**Core Message**: 自适应遍历策略的优雅设计

### Section Summary

> **What this section covers**: 深入解释意图感知权重向量wTq如何根据查询类型动态调整边权重。
> 
> **Key takeaway**: Why查询激活因果边，When查询激活时序边，实现查询自适应检索。

### Panel Layout

**Panel Count**: 3
**Layout Type**: equation breakdown

#### Panel 1 (Size: 1/3 page, Position: Top)
**Scene**: 转移得分公式
**Text Elements**:
- Formula: S(nj|ni,q) = λ·φ(eij,Tq) + (1-λ)·sim(vj,q⃗)
- Components explanation

#### Panel 2 (Size: 1/3 page, Position: Middle)
**Scene**: 结构对齐函数
**Text Elements**:
- Formula: φ(eij,Tq) = wTq · 1r
- Meaning: Intent-specific weight × edge type one-hot

#### Panel 3 (Size: 1/3 page, Position: Bottom)
**Scene**: 意图路由示例
**Text Elements**:
- Example: "Why" → wWhy = [0.1, 0.1, 0.7, 0.1] (causal high)
- Example: "When" → wWhen = [0.1, 0.7, 0.1, 0.1] (temporal high)
- Visual: Weight sliders per intent type

**Visual Prompt**:
Tech-style manga page with 3 panels explaining adaptive policy. Panel 1: Score formula with labeled components. Panel 2: Alignment function formula with visual explanation. Panel 3: Concrete examples showing weight vectors as slider bars for different intent types. Dark blue, equations in white, highlights in cyan.

---

## Page 8 / 10

**Filename**: 08-page-dual-stream.png
**Layout**: standard
**Narrative Layer**: System design
**Core Message**: 双流处理的系统工程智慧

### Section Summary

> **What this section covers**: 详细解释快路径（非阻塞摄入）和慢路径（异步整合）的设计动机和实现细节。
> 
> **Key takeaway**: 解耦延迟敏感操作，在响应性和深度推理间取得平衡。

### Panel Layout

**Panel Count**: 3
**Layout Type**: parallel comparison

#### Panel 1 (Size: 1/3 page, Position: Top)
**Scene**: 双流架构图
**Image Description**: Split stream from input
**Text Elements**:
- Title: "Dual-Stream Architecture"
- Labels: Fast Path / Slow Path

#### Panel 2 (Size: 1/3 page, Position: Middle)
**Scene**: 快路径算法
**Text Elements**:
- Title: "Synaptic Ingestion (Algorithm 2)"
- Key ops: Event segmentation, Vector indexing, Temporal backbone
- Property: "Non-blocking, O(1) latency"

#### Panel 3 (Size: 1/3 page, Position: Bottom)
**Scene**: 慢路径算法
**Text Elements**:
- Title: "Structural Consolidation (Algorithm 3)"
- Key ops: Neighborhood analysis, Causal inference, Entity linking
- Property: "Async, depth-first"

**Visual Prompt**:
Tech-style manga page with 3 panels. Panel 1: Architectural diagram showing stream split. Panel 2: Fast path as express lane with algorithm highlights. Panel 3: Slow path as deep process with consolidation details. Dark blue, fast path in green/yellow speed lines, slow path in purple depths.

---

## Page 9 / 10

**Filename**: 09-page-results-matrix.png
**Layout**: dense
**Narrative Layer**: Empirical validation
**Core Message**: 全面的实验结果展示

### Section Summary

> **What this section covers**: 通过表格和图表展示LoCoMo、LongMemEval结果，消融实验，效率分析。
> 
> **Key takeaway**: MAGMA在准确性、鲁棒性、效率方面全面领先。

### Panel Layout

**Panel Count**: 4
**Layout Type**: results matrix

#### Panel 1 (Size: 1/4 page, Position: Top-left)
**Scene**: LoCoMo主结果
**Text Elements**:
- Table: Methods vs Judge Score
- Highlight: MAGMA 0.70 (+18.6%)

#### Panel 2 (Size: 1/4 page, Position: Top-right)
**Scene**: 分类别表现
**Text Elements**:
- Categories: Temporal, Adversarial, Entity
- MAGMA leads all

#### Panel 3 (Size: 1/4 page, Position: Bottom-left)
**Scene**: 消融实验
**Text Elements**:
- Components removed, performance drop
- All components contribute

#### Panel 4 (Size: 1/4 page, Position: Bottom-right)
**Scene**: 效率指标
**Text Elements**:
- Latency, Token usage
- MAGMA: Lower, More efficient

**Visual Prompt**:
Tech-style manga page with 4 quadrants showing results. Top-left: Main results table with MAGMA highlighted. Top-right: Category breakdown bars. Bottom-left: Ablation study chart. Bottom-right: Efficiency metrics comparison. Dark blue, winning metrics in gold/green.

---

## Page 10 / 10

**Filename**: 10-page-takeaways.png
**Layout**: splash
**Narrative Layer**: Synthesis
**Core Message**: 核心要点与行动指南

### Section Summary

> **What this section covers**: 总结MAGMA的四大贡献，提供实践建议和开源资源链接。
> 
> **Key takeaway**: MAGMA提供了可解释、高效、可扩展的Agent记忆解决方案。

### Panel Layout

**Panel Count**: 1 (splash with sections)
**Layout Type**: summary infographic

#### Panel 1 (Size: Full page)

**Scene**: 核心要点总结
**Image Description**:
- Central MAGMA logo
- Four contribution boxes radiating out
- Action items at bottom
- GitHub link

**Text Elements**:
- Title: "MAGMA Key Takeaways"
- Box 1: "Multi-Graph Architecture - 语义/时序/因果/实体分离"
- Box 2: "Adaptive Traversal - 意图感知路由"
- Box 3: "Dual-Stream Processing - 快+慢平衡"
- Box 4: "SoTA Performance - 18.6%+ improvement"
- Action: "Try it: github.com/FredJiang0324/MAMGA"
- Footer: "The End / 完"

**Visual Prompt**:
Tech-style splash summary page. Dark navy background. Central MAGMA logo in glowing neon. Four contribution boxes arranged around center, connected by light beams. GitHub link at bottom in terminal-style text. Clean, professional, actionable. "The End" in elegant typography.
