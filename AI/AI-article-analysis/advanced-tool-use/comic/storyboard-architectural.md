---
title: "Building MAGMA: Layer by Layer"
---

## Metadata

| Field | Value |
|-------|-------|
| **Article Title** | MAGMA: A Multi-Graph based Agentic Memory Architecture for AI Agents |
| **Source** | [MAGMA Paper](https://arxiv.org/abs/2601.03236) |
| **Author** | Dongming Jiang, Yi Li, Guanpeng Li, Bingzhe Li |
| **Date** | 2026-01 |

## Article Summary

This paper introduces MAGMA, a revolutionary memory architecture for AI agents that solves the fundamental problem of long-horizon reasoning. The architecture is organized into three logical layers: the Data Structure Layer (multi-graph storage), the Query Process Layer (adaptive retrieval), and the Write/Update Layer (memory evolution). This comic walks through each layer to explain how the system works.

---

## Technical Details

| Property | Value |
|----------|-------|
| Topic | AI Memory Architecture |
| Time Span | 2026 (Research) |
| Narrative Approach | Architectural |
| Recommended Style | dramatic |
| Recommended Layout | cinematic |
| Aspect Ratio | 3:4 |
| Language | en |
| Page Count | 9 |
| Generated | 2026-01-19 17:00 |

---

# Building MAGMA: Layer by Layer - Knowledge Comic Storyboard

**Character Reference**: characters-architectural/characters.png

---

## Cover

**Filename**: 00-cover-building-magma.png
**Core Message**: Explore the architecture that revolutionizes AI memory

**Visual Design**:
- Title: "Building MAGMA" in bold dramatic typography
- Main visual: Cross-section view of MAGMA architecture like a high-tech building blueprint
- Three layers visible: Data (foundation), Query (middle), Write (top)
- Subtitle: "A Deep Dive into AI Memory Architecture"
- Background: Dark with dramatic lighting from below

**Visual Prompt**:
Dramatic comic book cover. Title "Building MAGMA" in bold white text with golden glow. Central image: cross-section architectural blueprint of MAGMA showing three distinct layers like a futuristic building - Data Structure Layer as the foundation in blue, Query Layer in the middle glowing green, Write/Update Layer at top in orange. Dramatic lighting from below casting long shadows. Subtitle: "A Deep Dive into AI Memory Architecture". High contrast, cinematic, blueprint aesthetic with technical elegance.

---

## Page 1 / 9

**Filename**: 01-page-architecture-overview.png
**Layout**: splash
**Narrative Layer**: Introduction
**Core Message**: MAGMA's three-layer architecture

### Section Summary

> **What this section covers**: Introduction to MAGMA's modular three-layer architecture and how the layers interact with each other.
> 
> **Key takeaway**: Well-designed systems separate concerns - storage, retrieval, and updates each have their own optimized layer.

### Panel Layout

**Panel Count**: 1 with inset diagrams
**Layout Type**: splash

#### Panel 1 (Size: Full page)

**Scene**: Dramatic reveal of the full architecture
**Image Description**:
- Camera angle: 3/4 isometric view
- Visual: Three stacked layers of the MAGMA architecture
  - Bottom: Data Structure Layer (blue, solid foundation)
  - Middle: Query Process Layer (green, active processing)
  - Top: Write/Update Layer (orange, dual streams)
- Environment: Dark void with spotlight on the architecture
- Lighting: Dramatic uplighting, each layer has its own glow
- Color tone: Blue foundation, green middle, orange top

**Text Elements**:
- Title: "MAGMA ARCHITECTURE"
- Labels for each layer
- Narrator: "Three layers. One mission: perfect memory."

**Visual Prompt**:
Dramatic splash page revealing MAGMA architecture. Isometric 3D view of three stacked hexagonal layers floating in dark space. Bottom layer glows deep blue, labeled "DATA STRUCTURE LAYER - Four Graphs + Vector DB". Middle layer glows emerald green, labeled "QUERY PROCESS LAYER - Router + Retrieval + Synthesis". Top layer glows orange, labeled "WRITE/UPDATE LAYER - Fast Path + Slow Path". Dramatic lighting from below, cinematic composition, each layer connected by glowing data streams. High contrast, architectural rendering style.

---

## Page 2 / 9

**Filename**: 02-page-data-layer-intro.png
**Layout**: cinematic
**Narrative Layer**: Layer 1 introduction
**Core Message**: The Data Structure Layer is the foundation

### Section Summary

> **What this section covers**: Introducing the Data Structure Layer - the storage substrate that contains the multi-graph memory structure.
> 
> **Key takeaway**: A solid foundation enables everything above it. The data layer provides unified node representation across multiple relational views.

### Panel Layout

**Panel Count**: 3
**Layout Type**: horizontal cinematic

#### Panel 1 (Size: 1/3 page, Position: Top)

**Scene**: Descending into the Data Layer
**Image Description**:
- Camera angle: Downward diving shot
- Visual: "Camera" moving down through the layers toward the blue foundation
- Lighting: Fading other layers, focusing on blue glow below
- Motion: Arrows indicating downward movement

**Text Elements**:
- Narrator: "Let's start at the foundation..."
- Caption: "THE DATA STRUCTURE LAYER"

#### Panel 2 (Size: 1/3 page, Position: Middle)

**Scene**: The unified multigraph
**Image Description**:
- Camera angle: Eye level, wide
- Visual: The multigraph 𝒢 = (𝒩, ℰ) visualized as a unified structure
- Four colored edge types visible: blue, green, orange, purple
- Lighting: Even illumination showing structure

**Text Elements**:
- Narrator: "A unified multigraph where each event exists across four relational views"
- Math: "𝒢ₜ = (𝒩ₜ, ℰₜ)"

#### Panel 3 (Size: 1/3 page, Position: Bottom)

**Scene**: Node representation
**Image Description**:
- Camera angle: Close-up on a single node
- Visual: A memory node showing its components: content, timestamp, vector, attributes
- Lighting: Spotlight on node detail

**Text Elements**:
- Node components labeled: "content cᵢ", "timestamp τᵢ", "vector vᵢ", "attributes 𝒜ᵢ"
- Caption: "Each node = (content, timestamp, embedding, metadata)"

**Page Hook**: "Now let's explore each of the four edge types..."

**Visual Prompt**:
Cinematic three-panel page diving into Data Structure Layer. Top panel: Dramatic downward camera motion into blue-glowing foundation layer, other layers fading above. Middle panel: Wide view of the unified multigraph - a crystalline structure with nodes connected by four colors of edges (blue, green, orange, purple), mathematical notation "𝒢ₜ = (𝒩ₜ, ℰₜ)" visible. Bottom panel: Close-up on a single node - hexagonal crystal showing four data slots: content, timestamp, vector embedding, attributes. Dark dramatic lighting, architectural detail.

---

## Page 3 / 9

**Filename**: 03-page-four-edge-types.png
**Layout**: grid
**Narrative Layer**: Layer 1 detail
**Core Message**: Four types of edges for four types of relationships

### Section Summary

> **What this section covers**: Detailed look at the four edge types - Temporal, Causal, Semantic, and Entity - and what kind of relationships each captures.
> 
> **Key takeaway**: By separating different relationship types into different edge spaces, MAGMA can reason about each dimension independently.

### Panel Layout

**Panel Count**: 4
**Layout Type**: 2x2 grid with dramatic lighting

#### Panel 1-4: Each edge type

Similar to Page 4 in Problem-Solution variant, but with more dramatic, architectural emphasis on the structure.

**Visual Prompt**:
Dramatic 4-panel grid showing edge types as architectural blueprints. Each panel shows one edge type as a glowing structural element. Temporal (green): Linear chain blueprint with timestamps. Causal (orange): Directed graph blueprint with cause-effect arrows. Semantic (blue): Clustered network blueprint with similarity scores. Entity (purple): Hub-spoke blueprint connecting to event nodes. Dark background, blueprint grid lines, architectural precision, dramatic shadows.

---

## Page 4 / 9

**Filename**: 04-page-query-layer-intro.png
**Layout**: cinematic
**Narrative Layer**: Layer 2 introduction
**Core Message**: The Query Layer processes retrieval requests

### Section Summary

> **What this section covers**: Moving up to the Query Process Layer - the "brain" of MAGMA that handles incoming queries, retrieves relevant memories, and synthesizes responses.
> 
> **Key takeaway**: Intelligent query processing requires multiple stages: analysis, routing, traversal, and synthesis.

### Panel Layout

**Panel Count**: 3
**Layout Type**: vertical flow

#### Panel 1-3: Query layer introduction and components

**Visual Prompt**:
Cinematic page ascending to Query Layer. Top: Camera rising from blue layer to green layer, transition effect. Middle: Wide view of Query Layer components - Intent Router (brain icon), Adaptive Retrieval (pathfinding arrows), Context Synthesizer (assembly station). Bottom: Query entering the layer from above, being processed. Dramatic green glow, processing energy, architectural precision.

---

## Page 5 / 9

**Filename**: 05-page-four-stage-retrieval.png
**Layout**: dense
**Narrative Layer**: Layer 2 detail
**Core Message**: The four stages of query processing

### Section Summary

> **What this section covers**: Deep dive into the four-stage retrieval process - Query Analysis, Anchor Identification, Adaptive Traversal, and Narrative Synthesis.
> 
> **Key takeaway**: Sophisticated retrieval requires multiple stages, each optimizing for different aspects of the search.

### Panel Layout

**Panel Count**: 4
**Layout Type**: vertical sequence

#### Panels 1-4: Each retrieval stage

**Visual Prompt**:
Dense 4-panel vertical sequence showing retrieval stages. Panel 1 - Query Analysis: Query being parsed into intent type (Why/When/Entity), temporal range, and embeddings. Panel 2 - Anchor Identification: Multiple signal sources (dense, lexical, temporal) being fused via RRF into anchor nodes. Panel 3 - Adaptive Traversal: Beam search traversing graph with dynamic scoring based on intent. Panel 4 - Narrative Synthesis: Retrieved subgraph being linearized and budgeted for LLM context. Dramatic green energy, stage transitions, architectural flow.

---

## Page 6 / 9

**Filename**: 06-page-traversal-policy.png
**Layout**: splash
**Narrative Layer**: Layer 2 deep dive
**Core Message**: The Adaptive Traversal Policy in action

### Section Summary

> **What this section covers**: How the scoring function combines structural alignment (edge type matching query intent) with semantic relevance to guide the beam search.
> 
> **Key takeaway**: The magic is in the policy - it dynamically weights different edge types based on what the query is asking for.

### Panel Layout

**Panel Count**: 1
**Layout Type**: full splash with formula overlay

**Visual Prompt**:
Dramatic splash showing traversal policy in action. Central image: A "Why?" query triggering bright glow on Causal edges while other edges dim. Mathematical formula overlaid: S(nⱼ|nᵢ,q) = λ·sim(vⱼ,q) + (1-λ)·φ(eᵢⱼ,Tq). Visual showing how φ weights change based on query type. Beam paths lighting up through the graph. Dramatic green and orange interplay, cinematic lighting.

---

## Page 7 / 9

**Filename**: 07-page-write-layer.png
**Layout**: split
**Narrative Layer**: Layer 3
**Core Message**: Dual-stream memory evolution

### Section Summary

> **What this section covers**: The Write/Update Layer with its dual-stream processing - Fast Path for immediate ingestion and Slow Path for structural consolidation.
> 
> **Key takeaway**: Inspired by neuroscience, separating fast and slow processing enables both responsiveness and deep learning.

### Panel Layout

**Panel Count**: 2
**Layout Type**: vertical split

**Visual Prompt**:
Split page showing dual-stream architecture. Left side - FAST PATH: Lightning-fast orange energy, events being segmented and indexed immediately, temporal backbone being extended, algorithm pseudocode snippet. Right side - SLOW PATH: Contemplative amber glow, background worker analyzing neighborhoods, LLM inferring causal links, new edges being added to graph. Both paths shown as architectural channels in the Write Layer. Dramatic contrast, architectural precision.

---

## Page 8 / 9

**Filename**: 08-page-implementation.png
**Layout**: mixed
**Narrative Layer**: System design
**Core Message**: Implementation flexibility and modularity

### Section Summary

> **What this section covers**: MAGMA's modular implementation with pluggable backends for storage, retrieval, and application layers.
> 
> **Key takeaway**: Good architecture separates interface from implementation, allowing easy upgrades and customization.

### Panel Layout

**Panel Count**: 3
**Layout Type**: mixed

**Visual Prompt**:
Mixed layout showing implementation architecture. Top: Storage layer abstraction - different backend icons (in-memory, production graph DB, vector DB) all connecting to unified interface. Middle: Retrieval layer components as modular blocks that can be swapped. Bottom: Application layer showing agent interaction loop, evaluation harness, prompt construction. Clean architectural diagram style with dramatic highlighting.

---

## Page 9 / 9

**Filename**: 09-page-conclusion.png
**Layout**: splash
**Narrative Layer**: Conclusion
**Core Message**: A complete architecture for the future

### Section Summary

> **What this section covers**: Summary of MAGMA's architectural elegance and its performance advantages - reduced latency, lower token consumption, and better reasoning accuracy.
> 
> **Key takeaway**: Great architecture enables great performance. MAGMA's layered design is both elegant and effective.

### Panel Layout

**Panel Count**: 1
**Layout Type**: full splash

**Visual Prompt**:
Epic conclusion splash. Full architectural view of all three MAGMA layers working together in harmony. Data flows visibly between layers - queries coming in from above, being processed through Query Layer, accessing Data Layer, responses flowing out, while Write Layer continuously updates from the side. Performance metrics floating around: "70% accuracy", "Lower latency", "Reduced tokens". Dramatic lighting, architectural elegance, cinematic conclusion. Link to GitHub at bottom.
