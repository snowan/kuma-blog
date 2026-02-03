---
title: "PagedAttention: How Virtual Memory Revolutionized LLM Inference"
date: 2026-02-02
author: "Michi Meow"
categories: ["AI", "LLM Optimization", "Inference", "System Design"]
tags: ["PagedAttention", "vLLM", "KV Cache", "Memory Management", "LLM Serving", "Deep Dive"]
description: "A deep dive into PagedAttention, the breakthrough memory management technique that enables efficient LLM serving. Learn how borrowing ideas from OS virtual memory solved the KV cache memory problem and enabled 2-4x throughput improvements."
image: "AI-blogs/resources/paged-attention-overview.png"
---

# PagedAttention: How Virtual Memory Revolutionized LLM Inference

## TL;DR

| Aspect | Traditional KV Cache | PagedAttention |
|--------|---------------------|----------------|
| **Memory waste** | 60-80% | <4% |
| **Allocation** | Pre-allocated, contiguous | On-demand, non-contiguous |
| **Fragmentation** | High (internal + external) | Near-zero |
| **Throughput** | Baseline | 2-4x improvement |
| **Memory sharing** | Not supported | Copy-on-write enabled |

---

## The Problem: Why LLM Serving Is Memory-Hungry

When you ask an LLM to generate text, something interesting happens behind the scenes. The model doesn't just process your prompt once—it needs to **remember** what it has already seen to generate each new token coherently.

### What Is the KV Cache?

In transformer models, the self-attention mechanism computes **Key** and **Value** vectors for every token. During text generation, these vectors are cached to avoid redundant computation:

```
Prompt: "Explain quantum computing"
                                   
Token 1: "Explain"  → Compute K₁, V₁ → Cache them
Token 2: "quantum"  → Compute K₂, V₂ → Cache them  
Token 3: "computing"→ Compute K₃, V₃ → Cache them
         ...

When generating token 4, 5, 6...:
- Reuse cached K₁,V₁, K₂,V₂, K₃,V₃
- Only compute new K,V for the latest token
- This is the KV cache!
```

### The Memory Math

For a model like LLaMA-13B, the KV cache for a **single token** requires:

```
KV cache per token = 2 × num_layers × hidden_dim × 2 (K and V) × precision_bytes
                   = 2 × 40 × 5120 × 2 × 2 bytes (FP16)
                   = ~1.6 MB per token
```

For a 2048-token sequence: **~3.2 GB just for KV cache per request!**

### The Allocation Nightmare

Traditional systems pre-allocate memory for the **maximum possible sequence length**:

```
TRADITIONAL KV CACHE ALLOCATION

Request A (actual: 500 tokens, reserved: 2048 tokens):
┌────────────────────────────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│     ↑                                                    ↑     │
│  500 tokens                                          2048 max  │
│  (24% used)                              (76% WASTED)          │
└────────────────────────────────────────────────────────────────┘

GPU Memory After Multiple Requests:
┌────────────────────────────────────────────────────────────────┐
│ ████░░░░░░░░░░░░░░░░ ██████████░░░░░░░░░░ ██░░░░░░░░░░░░░░░░░░ │
│   Request A (25%)      Request B (50%)     Request C (10%)     │
│                                                                 │
│   Average utilization: ~28%                                     │
│   Memory waste: ~72%                                            │
└────────────────────────────────────────────────────────────────┘
```

### Two Types of Fragmentation

**1. Internal Fragmentation** — wasted space *within* allocated blocks

```
┌─────────────────────────────────────┐
│ Request: "Hi" (2 tokens)            │
│ Reserved: 2048 tokens               │
│                                     │
│ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ↑                            ↑     │
│ Used                      Wasted    │
│ (0.1%)                    (99.9%)   │
└─────────────────────────────────────┘
```

**2. External Fragmentation** — unusable gaps *between* allocated blocks

```
GPU Memory Space:
┌────┬────────┬────┬──────────┬────┬─────────────────────────────┐
│ R1 │  FREE  │ R2 │   FREE   │ R3 │          FREE               │
│ 2GB│  1GB   │ 3GB│   0.5GB  │ 1GB│          2.5GB              │
└────┴────────┴────┴──────────┴────┴─────────────────────────────┘
                                      
Total free: 4GB, but largest contiguous block: 2.5GB
New request needs 3GB contiguous memory: ❌ FAILS (despite having 4GB free!)
```

> [!WARNING]
> Studies show that existing LLM serving systems waste **60-80% of KV cache memory** due to fragmentation. This directly limits how many requests can be batched together, reducing throughput.

---

## The Solution: PagedAttention

**PagedAttention** is a memory management technique introduced in the [vLLM paper (SOSP 2023)](https://arxiv.org/abs/2309.06180) that borrows ideas from operating system virtual memory to solve the KV cache problem.

### The Key Insight: OS Virtual Memory

In operating systems, programs don't directly access physical memory. Instead:

1. Programs use **virtual addresses** (logical)
2. The OS maps these to **physical addresses** using a **page table**
3. Physical memory is divided into fixed-size **pages** (typically 4KB)
4. Pages can be **non-contiguous** in physical memory

```
OS VIRTUAL MEMORY MODEL

Process View (Virtual):            Physical Memory:
┌────────────────────┐            ┌────────────────────┐
│ Page 0: 0x0000     │──────┐     │ Frame 7: 0x7000    │
├────────────────────┤      │     ├────────────────────┤
│ Page 1: 0x1000     │────┐ └────→│ Frame 2: 0x2000    │
├────────────────────┤    │       ├────────────────────┤
│ Page 2: 0x2000     │──┐ └──────→│ Frame 5: 0x5000    │
└────────────────────┘  │         ├────────────────────┤
                        └────────→│ Frame 9: 0x9000    │
                                  └────────────────────┘
        ↓
    Page Table
┌─────────┬──────────┐
│ Virtual │ Physical │
├─────────┼──────────┤
│ Page 0  │ Frame 7  │
│ Page 1  │ Frame 5  │
│ Page 2  │ Frame 9  │
└─────────┴──────────┘
```

### PagedAttention: The Same Idea for KV Cache

PagedAttention applies this concept to KV cache memory:

1. **KV Cache = Virtual Memory**: Each request has a "logical" view of its KV cache
2. **Blocks = Pages**: KV cache is divided into fixed-size **blocks** (e.g., 16 tokens each)
3. **Block Table = Page Table**: Maps logical blocks to physical GPU memory locations
4. **On-Demand Allocation**: Blocks are allocated only when needed

```
PAGEDATTENTION MODEL

Request A's Logical View:          Physical GPU Memory:
┌────────────────────┐            ┌────────────────────┐
│ Block 0 (tok 0-15) │──────┐     │ Block @ 0x1000     │
├────────────────────┤      │     ├────────────────────┤
│ Block 1 (tok 16-31)│────┐ └────→│ Block @ 0x5000     │
├────────────────────┤    │       ├────────────────────┤
│ Block 2 (tok 32-47)│──┐ └──────→│ Block @ 0x2000     │
└────────────────────┘  │         ├────────────────────┤
                        └────────→│ Block @ 0x8000     │
                                  └────────────────────┘
        ↓
    Block Table (Request A)
┌─────────┬──────────┐
│ Logical │ Physical │
├─────────┼──────────┤
│ Block 0 │ 0x5000   │
│ Block 1 │ 0x2000   │
│ Block 2 │ 0x8000   │
└─────────┴──────────┘
```

---

## How It Works: Step-by-Step

### Step 1: Initial Prompt Processing

When a request arrives, PagedAttention allocates blocks on-demand as prompts are processed:

```
Prompt: "What is the meaning of life?" (7 tokens)
Block size: 4 tokens

Step 1: Process first 4 tokens
┌───────────────────────────────────┐
│ GPU Memory                        │
│ ┌─────────────────┐               │
│ │ Block 0         │               │
│ │ [What][is][the] │               │
│ │ [meaning]       │               │
│ └─────────────────┘               │
│                                   │
│ Block Table A:                    │
│ ┌────────┬────────┐               │
│ │ Log 0  │ 0x1000 │               │
│ └────────┴────────┘               │
└───────────────────────────────────┘

Step 2: Process remaining 3 tokens
┌───────────────────────────────────┐
│ GPU Memory                        │
│ ┌─────────────────┐ ┌────────────┐│
│ │ Block 0         │ │ Block 1   ││
│ │ [What][is][the] │ │ [of][life]││
│ │ [meaning]       │ │ [?][ ]    ││ ← Partial block
│ └─────────────────┘ └────────────┘│
│                                   │
│ Block Table A:                    │
│ ┌────────┬────────┐               │
│ │ Log 0  │ 0x1000 │               │
│ │ Log 1  │ 0x3000 │ ← New block   │
│ └────────┴────────┘               │
└───────────────────────────────────┘
```

### Step 2: Token Generation

As new tokens are generated, blocks are allocated only when the current block fills up:

```
Generating response tokens...

Token 8: "The"  → Fits in Block 1 (slot 3)
Token 9: "answer" → Block 1 FULL! Allocate Block 2
Token 10: "is" → Fits in Block 2 (slot 1)
...

┌──────────────────────────────────────────────────────┐
│ GPU Memory                                           │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│ │ Block 0   │ │ Block 1   │ │ Block 2   │           │
│ │ Full      │ │ Full      │ │ Partial   │           │
│ │ (4 tok)   │ │ (4 tok)   │ │ (2 tok)   │           │
│ └───────────┘ └───────────┘ └───────────┘           │
│   @ 0x1000     @ 0x3000      @ 0x7000               │
│                                                      │
│ Block Table A:                                       │
│ ┌────────┬────────┐                                 │
│ │ Log 0  │ 0x1000 │                                 │
│ │ Log 1  │ 0x3000 │                                 │
│ │ Log 2  │ 0x7000 │ ← Allocated on demand           │
│ └────────┴────────┘                                 │
└──────────────────────────────────────────────────────┘
```

### Step 3: Multiple Requests with Non-Contiguous Allocation

The magic happens when multiple requests share GPU memory:

```
Request A (10 tokens) + Request B (6 tokens) + Request C (15 tokens)

┌────────────────────────────────────────────────────────────────┐
│ Physical GPU Memory (scattered but fully utilized)             │
│                                                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ A-0  │ │ B-0  │ │ C-0  │ │ A-1  │ │ C-1  │ │ B-1  │ │ C-2  ││
│ │ 4tok │ │ 4tok │ │ 4tok │ │ 4tok │ │ 4tok │ │ 2tok │ │ 4tok ││
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
│  0x1000   0x2000   0x3000   0x4000   0x5000   0x6000   0x7000  │
│                                                                 │
│ Each request has its own Block Table:                          │
│                                                                 │
│ Request A:         Request B:         Request C:               │
│ ┌────┬───────┐    ┌────┬───────┐    ┌────┬───────┐            │
│ │ 0  │0x1000 │    │ 0  │0x2000 │    │ 0  │0x3000 │            │
│ │ 1  │0x4000 │    │ 1  │0x6000 │    │ 1  │0x5000 │            │
│ │ 2  │0x8000 │    └────┴───────┘    │ 2  │0x7000 │            │
│ └────┴───────┘                      │ 3  │0x9000 │            │
│                                     └────┴───────┘            │
└────────────────────────────────────────────────────────────────┘

✅ No external fragmentation!
✅ Internal fragmentation only in last block of each request!
```

---

## Memory Sharing: The Copy-on-Write Advantage

PagedAttention enables efficient memory sharing for advanced use cases like **parallel sampling** and **beam search**.

### Scenario: Parallel Sampling

When generating multiple responses from the same prompt:

```
Shared Prompt: "Write a poem about trees" → Blocks 0, 1

Response A: "Tall oaks stand..."
Response B: "In forest deep..."
Response C: "Green leaves dance..."

WITHOUT PagedAttention:
─────────────────────────
┌─────────────────────────────────────────┐
│ Prompt A Copy │ Response A tokens       │
├─────────────────────────────────────────┤
│ Prompt B Copy │ Response B tokens       │  ← 3x prompt memory!
├─────────────────────────────────────────┤
│ Prompt C Copy │ Response C tokens       │
└─────────────────────────────────────────┘

WITH PagedAttention (Copy-on-Write):
────────────────────────────────────
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  ┌─────────────────┐                                      │
│  │ SHARED PROMPT   │◄──────┬──────┬──────┐               │
│  │ Blocks 0, 1     │       │      │      │               │
│  └─────────────────┘       │      │      │               │
│                            │      │      │               │
│  Block Tables:             │      │      │               │
│  ┌────────────────┐   ┌────┴───┐ ┌┴─────┴┐ ┌───────────┐ │
│  │ Response A     │   │ Resp A │ │Resp B │ │ Resp C    │ │
│  │ [0]→Shared     │   │ [2]    │ │ [2]   │ │ [2]       │ │
│  │ [1]→Shared     │   │ [3]    │ │ [3]   │ │ [3]       │ │
│  │ [2]→A's block  │   └────────┘ └───────┘ └───────────┘ │
│  │ [3]→A's block  │                                      │
│  └────────────────┘     Only unique blocks allocated!    │
│                                                           │
│  Memory saved: 2/3 of prompt memory!                      │
└───────────────────────────────────────────────────────────┘
```

### Copy-on-Write Mechanism

When a shared block needs modification, it's copied first:

```
Initial State (all 3 responses share prompt blocks):
─────────────────────────────────────────────────────
Block 0 (shared): ref_count = 3
Block 1 (shared): ref_count = 3

Response A wants to modify Block 1 (e.g., in beam search):
───────────────────────────────────────────────────────────
1. Check ref_count of Block 1: ref_count = 3 > 1
2. Allocate new Block 1' 
3. Copy Block 1 → Block 1'
4. Update Response A's block table: [1] → Block 1'
5. Decrement Block 1's ref_count: 3 → 2

After Copy-on-Write:
───────────────────
Block 0 (shared): ref_count = 3
Block 1 (shared by B, C): ref_count = 2
Block 1' (A's private): ref_count = 1
```

---

## Performance Benefits

### Memory Efficiency Comparison

```
MEMORY UTILIZATION COMPARISON

Traditional System:
┌────────────────────────────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ │←── Used: ~25% ──→│←────────── Wasted: ~75% ──────────────→│  │
└────────────────────────────────────────────────────────────────┘

PagedAttention:
┌────────────────────────────────────────────────────────────────┐
│ ██████████████████████████████████████████████████████████████ │
│ │←───────────────── Used: ~96% ──────────────────→│←─ 4% ─→│   │
└────────────────────────────────────────────────────────────────┘
```

### Throughput Improvement

Real-world benchmarks from the vLLM paper show significant improvements:

| Model | Sequence Length | Improvement vs FasterTransformer |
|-------|-----------------|----------------------------------|
| OPT-13B | 512 | 2.2x |
| OPT-13B | 2048 | 4.3x |
| LLaMA-13B | 512 | 2.4x |
| LLaMA-13B | 2048 | 3.8x |

> [!TIP]
> The improvement is **more pronounced with longer sequences** because traditional systems waste more memory with larger max-length allocations.

### Why Higher Throughput?

```
Traditional System (can only batch 2 requests):
┌─────────────────────────────────────────────────────┐
│ GPU Memory                                          │
│ ┌──────────────────────┐ ┌──────────────────────┐  │
│ │ Request A (pre-alloc)│ │ Request B (pre-alloc)│  │
│ │ 50% capacity each    │ │ 50% capacity each    │  │
│ └──────────────────────┘ └──────────────────────┘  │
│                                                     │
│ ❌ No room for Request C!                           │
└─────────────────────────────────────────────────────┘

PagedAttention (can batch 8 requests):
┌─────────────────────────────────────────────────────┐
│ GPU Memory                                          │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐  │
│ │A0││B0││C0││D0││A1││B1││E0││F0││C1││G0││H0││A2│  │
│ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘  │
│                                                     │
│ ✅ 8 concurrent requests with dynamic allocation!   │
└─────────────────────────────────────────────────────┘
```

---

## Practical Examples

### Using vLLM (PagedAttention Built-in)

```python
from vllm import LLM, SamplingParams

# vLLM uses PagedAttention by default
llm = LLM(
    model="meta-llama/Llama-2-13b-hf",
    
    # PagedAttention-related settings
    block_size=16,                    # Tokens per block (default: 16)
    gpu_memory_utilization=0.90,      # Use 90% of GPU memory
    max_num_seqs=256,                 # Max concurrent sequences
    max_num_batched_tokens=4096,      # Max tokens per iteration
)

# Multiple prompts automatically benefit from PagedAttention
prompts = [
    "Explain quantum computing in simple terms",
    "Write a haiku about artificial intelligence",
    "What are the benefits of renewable energy?",
    "How does machine learning differ from AI?",
]

sampling_params = SamplingParams(
    temperature=0.7,
    max_tokens=256,
)

# Efficient batch processing with memory sharing
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(f"Prompt: {output.prompt[:50]}...")
    print(f"Response: {output.outputs[0].text[:100]}...")
    print()
```

### Parallel Sampling with Shared Prefixes

```python
from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-2-13b-hf")

# Same prompt, multiple responses
# PagedAttention shares the prompt's KV cache across all samples
prompt = "Write a creative story about a robot learning to paint:"

sampling_params = SamplingParams(
    n=5,              # Generate 5 different responses
    temperature=0.9,  # More creative
    max_tokens=200,
)

# Memory efficient! Prompt KV cache is shared, not duplicated 5x
outputs = llm.generate([prompt], sampling_params)

for i, output in enumerate(outputs[0].outputs):
    print(f"=== Response {i+1} ===")
    print(output.text[:200])
    print()
```

### API Server Configuration

```bash
# Start vLLM server with optimal PagedAttention settings
vllm serve meta-llama/Llama-2-13b-hf \
    --block-size 16 \
    --gpu-memory-utilization 0.9 \
    --max-num-seqs 256 \
    --enable-prefix-caching  # Share KV cache for common prefixes
```

```python
# Client code (OpenAI-compatible API)
import openai

client = openai.OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token",
)

# All requests automatically benefit from PagedAttention
response = client.chat.completions.create(
    model="meta-llama/Llama-2-13b-hf",
    messages=[
        {"role": "user", "content": "Explain PagedAttention in one sentence"}
    ],
    max_tokens=100,
)

print(response.choices[0].message.content)
```

---

## Comparison with Traditional Approaches

| Feature | Static Allocation | Chunked Attention | PagedAttention |
|---------|-------------------|-------------------|----------------|
| **Memory allocation** | Pre-allocated max | Chunked prefill | On-demand blocks |
| **Fragmentation** | High | Medium | Near-zero |
| **Memory sharing** | None | Limited | Full (CoW) |
| **Throughput** | Baseline | 1.2-1.5x | 2-4x |
| **Long sequences** | Poor | Better | Excellent |
| **Implementation** | Simple | Medium | Complex |

---

## Key Takeaways

1. **The KV cache is memory-hungry**: Each token requires ~1MB+ of memory for large models

2. **Traditional allocation wastes 60-80% of memory**: Pre-allocation and fragmentation severely limit batch sizes

3. **PagedAttention borrows from OS concepts**: Virtual memory, paging, and copy-on-write solve the memory efficiency problem

4. **Block tables enable flexible allocation**: Logical-to-physical mapping allows non-contiguous, on-demand memory usage

5. **Memory sharing amplifies benefits**: Shared prefixes and copy-on-write make parallel sampling highly efficient

6. **Real-world impact is significant**: 2-4x throughput improvement with near-zero memory waste

> [!IMPORTANT]
> PagedAttention is now the **industry standard** for LLM serving. If you're deploying LLMs in production, use a serving framework that implements it (vLLM, TensorRT-LLM, etc.).

---

## References

1. Kwon, W., et al. (2023). "Efficient Memory Management for Large Language Model Serving with PagedAttention." SOSP '23. [Paper](https://arxiv.org/abs/2309.06180)

2. [vLLM GitHub Repository](https://github.com/vllm-project/vllm)

3. [vLLM Documentation](https://docs.vllm.ai/)

4. Yu, G., et al. (2022). "Orca: A Distributed Serving System for Transformer-Based Generative Models." OSDI '22. [Paper](https://www.usenix.org/conference/osdi22/presentation/yu)

5. [NVIDIA TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)

---

*Last updated: February 2026*
