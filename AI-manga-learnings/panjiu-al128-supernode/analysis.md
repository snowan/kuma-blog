---
# Article Metadata (for markdown post)
title: "In-depth Analysis of Alibaba Cloud Panjiu AL128 Supernode AI Servers and Their Interconnect Architecture"
source_url: "https://www.alibabacloud.com/blog/in-depth-analysis-of-alibaba-cloud-panjiu-al128-supernode-ai-servers-and-their-interconnect-architecture_602665"
author: "Alibaba Cloud Community"
company: "Alibaba Cloud"
date: "2025"

# Content Analysis
topic: panjiu-al128-supernode
source_language: en
user_language: en

# Style Recommendations
aspect_ratio: "3:4"
recommended_page_count: 8
recommended_art: realistic
recommended_tone: vintage
recommended_layout: standard
---

# Analysis: Alibaba Cloud Panjiu AL128 Supernode AI Servers

## Article Summary

Alibaba Cloud unveiled its new-generation **Panjiu AI Infra 2.0 AL128 supernode AI servers** at the Apsara Conference 2025. These supernode servers represent a fundamental shift in AI infrastructure design, moving from traditional CPU-centric to **GPU-centric architectures** optimized for foundation model training and inference.

**Key Technical Innovations:**

1. **Supernode Architecture**: 128-144 GPUs in a single rack with 350kW power supply and 2kW liquid cooling per GPU. Modular design decouples CPU, GPU, and power nodes for flexibility.

2. **Three-Layer Interconnect Architecture**:
   - **Layer 1 (ScaleUp)**: Single-stage switching within supernode using non-Ethernet ALink protocol (UALink, NVLink, xLink compatible). Up to 14-28 Tbit/s bandwidth per GPU with ultra-low latency.
   - **Layer 2 (ScaleOut)**: Network between supernodes with 400-800 Gbit/s per GPU via NICs.
   - **Layer 3 (DCN)**: Data center network for storage, databases, and external communication.

3. **GPU-Centric Future Directions**:
   - Break PCIe bandwidth limits by connecting peripherals via ScaleUp protocol
   - Reshape access modes to support GPU memory semantics
   - Simplify topology from 3-layer to 2-layer (ScaleUp + High-bandwidth DCN)
   - Apply optical interconnection for even lower latency

4. **CXL Protocol for Memory Extension**: Enables larger memory pools with hundreds of ns latency, improving KV cache performance by 4.79x and reducing TTFT by 82.7%.

**Core Message**: As AI model scales grow to 10+ trillion parameters, supernode servers with 128 interconnected GPUs provide the optimal balance of performance, latency, and cost for inference workloads.

## Target Audience

**Primary**: AI infrastructure engineers, data center architects, cloud computing professionals
**Secondary**: Technical decision makers evaluating AI infrastructure, GPU cluster designers

## Value Proposition

- **Knowledge Value**: Understand how next-gen AI servers are designed differently from traditional servers
- **Practical Value**: Learn the trade-offs between ScaleUp/ScaleOut architectures for different workloads
- **Industry Value**: Insight into where AI infrastructure is heading

## Core Themes for Visual Storytelling (Retro Style)

| Theme | Narrative Potential | Visual Metaphor |
|-------|---------------------|-----------------|
| Supernode as industrial marvel | 128 GPUs as interconnected factory | 1960s mainframe meets modern datacenter |
| ScaleUp interconnection | Internal communication networks | Telephone switchboard operators connecting calls |
| ScaleOut network | City-to-city communication | Retro telegraph/radio towers |
| GPU-centric evolution | Power shift in computing | Blueprint diagrams showing architectural shift |
| Optical interconnection | Light-based future | Retro-futuristic light beams |
| CXL memory pool | Shared resources | Library card catalog system |

## Recommended Narrative Approach

**Retro Style** (realistic art + vintage tone):
- Visual aesthetic: 1960s-70s technical illustration meets modern infographics
- Color palette: Muted oranges, teals, cream backgrounds, aged paper texture
- Characters: Professional engineers in retro-futuristic attire
- Typography: Bold sans-serif, technical blueprint annotations
- Diagrams: Vintage technical illustration style, cross-sections, cutaways
