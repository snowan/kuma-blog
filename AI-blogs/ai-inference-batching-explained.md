---
title: "AI Inference Batching: Static, Dynamic, and Continuous Batching Explained"
date: 2026-02-02
author: "Michi Meow"
categories: ["AI", "LLM Optimization", "Inference", "System Design"]
tags: ["Batching", "LLM", "Inference Optimization", "vLLM", "TensorRT-LLM", "Orca", "PagedAttention", "Deep Dive"]
description: "A comprehensive guide to AI inference batching mechanisms. Learn when to use static, dynamic, or continuous batching, understand the tradeoffs, and make informed decisions for your AI inference API design."
image: "AI-blogs/resources/batching-comparison-hero.png"
---

# AI Inference Batching: Static, Dynamic, and Continuous Batching Explained

## TL;DR

| Strategy | Best For | Throughput | Latency | Complexity |
|----------|----------|------------|---------|------------|
| **Static** | Offline batch jobs | Medium | High | Low |
| **Dynamic** | General ML APIs | Medium-High | Medium | Medium |
| **Continuous** | LLM production APIs | Very High | Low | High |

---

## Why Batching Matters

GPUs are incredibly powerful parallel processors, but they're also expensive and inefficient when underutilized. Here's the fundamental problem:

```
Single Request Processing:
┌─────────────────────────────────────────────────────────┐
│                        GPU Cores                         │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│       ↑                                                  │
│    10% utilized (wasted $$$)                            │
└─────────────────────────────────────────────────────────┘

Batched Processing (8 requests):
┌─────────────────────────────────────────────────────────┐
│                        GPU Cores                         │
│  ██████████████████████████████████████████████████████ │
│       ↑                                                  │
│    90%+ utilized (efficient!)                           │
└─────────────────────────────────────────────────────────┘
```

### The Economics

Processing requests one at a time means:
- **Wasted compute**: GPU cycles sit idle between requests
- **Higher costs**: You pay for 100% of the GPU but use 10%
- **Lower throughput**: Fewer requests per second

Batching allows the GPU to process multiple requests simultaneously, **amortizing the overhead** of:
- Loading model weights from memory
- Kernel launch overhead
- Memory bandwidth utilization

> [!IMPORTANT]
> **The key question isn't whether to batch — it's HOW to batch.** The three strategies (static, dynamic, continuous) offer different tradeoffs between throughput, latency, and implementation complexity.

---

## The Batching Spectrum

```
Simplicity ◄──────────────────────────────────────────► Efficiency

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   STATIC     │    │  DYNAMIC     │    │ CONTINUOUS   │
│   BATCHING   │ →  │  BATCHING    │ →  │  BATCHING    │
└──────────────┘    └──────────────┘    └──────────────┘
     │                    │                    │
     │                    │                    │
     ▼                    ▼                    ▼
  Fixed batch         Time-window          Token-level
  size, wait          + max size           iteration
  until full          triggers             scheduling
     │                    │                    │
     ▼                    ▼                    ▼
  Simple to           Better               Maximum
  implement           balance              GPU usage
```

---

## Static Batching

### How It Works

Static batching is the simplest approach: **wait for a fixed number of requests** (or a timeout) before processing them all together.

```
                      STATIC BATCHING
                      
   Request Queue                          Processing
   ─────────────                          ──────────
                                          
   t=0    [R1] ──┐                        
                 │                        
   t=50   [R2] ──┤                        
                 │     Wait for           ┌──────────────┐
   t=100  [R3] ──┼──→  batch_size=4  ──→  │ Process ALL  │
                 │     or timeout         │ R1,R2,R3,R4  │
   t=200  [R4] ──┘                        │  together    │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │ ALL responses│
                                          │ return at    │
                                          │ same time    │
                                          └──────────────┘
```

### The Bus Analogy

Think of static batching like a **bus that only departs when all seats are filled**:

- 🚌 Bus capacity = `batch_size` (e.g., 8 requests)
- ⏰ Maximum wait = `timeout` (e.g., 100ms)
- First passenger waits for others to board
- Everyone arrives at the destination together

### The Padding Problem

When sequences have different lengths, shorter sequences must be **padded** to match the longest:

```
Original sequences:        After padding:
┌───────────────┐         ┌───────────────┐
│ R1: "Hello"   │         │ R1: "Hello░░░░│ ← Wasted compute
├───────────────┤         ├───────────────┤
│ R2: "Hi"      │         │ R2: "Hi░░░░░░░│ ← More waste
├───────────────┤         ├───────────────┤
│ R3: "Good     │         │ R3: "Good     │
│ morning to   │         │ morning to   │
│ everyone"    │         │ everyone"    │ ← Actual data
└───────────────┘         └───────────────┘

░ = padding tokens (wasted GPU cycles)
```

### Pros and Cons

**✅ Advantages**
- Simple to implement
- Predictable performance in stable environments
- High throughput for offline workloads
- Good GPU utilization when batch is full

**❌ Disadvantages**
- **Latency**: First request waits for the batch to fill
- **Padding overhead**: Wasted compute on padded tokens
- **GPU bubbles**: Shorter sequences finish early, creating idle time
- **Inflexible**: Fixed batch size doesn't adapt to traffic

### When to Use Static Batching

| Use Case | Fit |
|----------|-----|
| Overnight batch processing | ✅ Excellent |
| Document summarization jobs | ✅ Excellent |
| Bulk embedding generation | ✅ Good |
| Real-time chatbot API | ❌ Poor |
| Interactive applications | ❌ Poor |

### Code Example

```python
# Simple static batching implementation
class StaticBatcher:
    def __init__(self, batch_size=8, timeout_ms=100):
        self.batch_size = batch_size
        self.timeout_ms = timeout_ms
        self.queue = []
        self.lock = threading.Lock()
    
    def add_request(self, request):
        with self.lock:
            self.queue.append(request)
            
            # Trigger batch when full
            if len(self.queue) >= self.batch_size:
                return self._process_batch()
        
        # Or wait for timeout
        time.sleep(self.timeout_ms / 1000)
        return self._process_batch()
    
    def _process_batch(self):
        with self.lock:
            batch = self.queue[:self.batch_size]
            self.queue = self.queue[self.batch_size:]
        
        # Pad sequences to max length
        padded = self._pad_sequences(batch)
        
        # Process all at once
        results = model.forward(padded)
        return results
```

---

## Dynamic Batching

### How It Works

Dynamic batching improves on static batching by using **time windows** instead of fixed sizes. The batch is processed when:
1. The time window expires, OR
2. The maximum batch size is reached

**Whichever comes first.**

```
                     DYNAMIC BATCHING
                     
   Time Window: 50ms          Max Batch: 8
   ─────────────────          ────────────
                     
   ─────────────────────────────────────────► time
   │                 │
   0ms              50ms
   │                 │
   ├──R1─────────────┤
   │  ├──R2──────────┤           
   │  │  ├──R3───────┤           
   │  │  │           │           
   └──┴──┴───────────┴─→ Batch 1 [R1,R2,R3] processed at 50ms
                     
                     ├──R4─────────────┤
                     │     ├──R5───────┤
                     │     │  ├──R6,R7,R8,R9,R10──┤
                     │     │  │           │
                     └─────┴──┴───────────┴─→ Batch 2 triggered by max_size=8
```

### The Bus Analogy (Improved)

Dynamic batching is like a **bus with a schedule AND capacity limit**:

- 🚌 The bus leaves at its scheduled time (time window expires)
- 🚌 OR the bus leaves when it's full (max batch size reached)
- Passengers don't wait forever
- Efficiency balanced with reasonable wait times

### GPU Utilization

```
Static Batching GPU Timeline:
┌────────────────┐     ┌────────────────┐
│████████████████│     │████████████████│
│████████████████│     │████████████████│
│████░░░░░░░░░░░░│     │████████░░░░░░░░│
│████░░░░░░░░░░░░│     │████████░░░░░░░░│
└────────────────┘     └────────────────┘
    Batch 1                Batch 2
    
    (Long gaps between batches, padding waste)

Dynamic Batching GPU Timeline:
┌──────────┐ ┌────────────┐ ┌────────────────┐
│██████████│ │████████████│ │████████████████│
│██████████│ │████████████│ │████████████████│
│██████░░░░│ │████████████│ │████████████░░░░│
└──────────┘ └────────────┘ └────────────────┘
  Batch 1      Batch 2         Batch 3
  
  (Smaller gaps, variable batch sizes, better utilization)
```

### Pros and Cons

**✅ Advantages**
- Better latency than static batching
- Adapts to traffic patterns
- Flexible batch sizes
- Good balance of throughput and responsiveness

**❌ Disadvantages**
- Still bounded by the **slowest request** in each batch
- Padding overhead still exists
- More complex than static batching
- Tuning window size and max batch requires experimentation

### When to Use Dynamic Batching

| Use Case | Fit |
|----------|-----|
| Image classification API | ✅ Excellent |
| Text embedding service | ✅ Excellent |
| Speech-to-text API | ✅ Good |
| Non-LLM inference APIs | ✅ Good |
| LLM chatbots | ⚠️ Consider continuous |

### Code Example (NVIDIA Triton Config)

```protobuf
# config.pbtxt for Triton Inference Server
name: "my_model"
platform: "tensorrt_plan"

dynamic_batching {
    preferred_batch_size: [ 4, 8 ]
    max_queue_delay_microseconds: 50000  # 50ms window
}

instance_group [
    {
        count: 1
        kind: KIND_GPU
        gpus: [ 0 ]
    }
]
```

```python
# Python implementation sketch
class DynamicBatcher:
    def __init__(self, max_batch_size=16, max_delay_ms=50):
        self.max_batch_size = max_batch_size
        self.max_delay_ms = max_delay_ms
        self.queue = asyncio.Queue()
        
    async def add_request(self, request):
        future = asyncio.Future()
        await self.queue.put((request, future))
        return await future
    
    async def batch_loop(self):
        while True:
            batch = []
            start_time = time.time()
            
            # Collect requests within time window
            while len(batch) < self.max_batch_size:
                elapsed = (time.time() - start_time) * 1000
                remaining = self.max_delay_ms - elapsed
                
                if remaining <= 0:
                    break
                    
                try:
                    item = await asyncio.wait_for(
                        self.queue.get(),
                        timeout=remaining / 1000
                    )
                    batch.append(item)
                except asyncio.TimeoutError:
                    break
            
            if batch:
                await self._process_batch(batch)
```

---

## Continuous Batching

### How It Works

Continuous batching (also called **iteration-level scheduling** or **in-flight batching**) is a paradigm shift. Instead of processing requests as complete units, it operates at the **token level**.

```
                    CONTINUOUS BATCHING
                    
   Token-by-Token Processing (each column = one iteration)
   ──────────────────────────────────────────────────────
   
   Iteration:   t1    t2    t3    t4    t5    t6    t7
              ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
   Slot 1     │ A1  │ A2  │ A3  │ A4  │ C1  │ C2  │ C3  │
              ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
   Slot 2     │ B1  │ B2  │ B3  │ B4  │ B5  │ B6  │ D1  │
              ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
   Slot 3     │     │     │     │ E1  │ E2  │ E3  │ E4  │
              └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
                          │           │           │
                          │           │           │
              Request A   ▼           ▼           │
              completes   Request C   Request D   ▼
              (4 tokens)  enters      enters     ...
                          immediately
   
   Legend: A1 = Request A, token 1
           B1 = Request B, token 1
           ...
```

### The Assembly Line Analogy

Continuous batching is like an **assembly line** instead of a bus:

- 🏭 Products (requests) enter the line as soon as there's space
- 🏭 Finished products exit immediately
- 🏭 New products take their place instantly
- 🏭 The line never stops for individual items

### Why It's Revolutionary for LLMs

LLMs generate text **one token at a time**. With static/dynamic batching:

```
Request A (4 tokens): ████────────────────────────────────
Request B (8 tokens): ████████────────────────────────────
Request C (2 tokens): ██──────────────────────────────────
                      ↑
                      All wait for B to finish (8 tokens)
                      
                      Wasted: 4 + 6 = 10 token slots
```

With continuous batching:

```
Request A (4 tokens): ████                               → exits at t4
Request B (8 tokens): ████████                           → exits at t8
Request C (2 tokens): ██                                 → exits at t2
Request D (enters t2): ████████                          → starts at t2
Request E (enters t4):     ████                          → starts at t4
                      
                      No wasted slots!
```

### PagedAttention: The Memory Enabler

Continuous batching requires **dynamic memory allocation** for the KV cache. Traditional systems pre-allocate fixed memory:

```
Traditional KV Cache (wasteful):
┌──────────────────────────────────────────────────────────┐
│ Request A: ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│            ↑ actual                        ↑ reserved   │
│            (4 tokens)                      (max 32)     │
└──────────────────────────────────────────────────────────┘
Memory waste: 28 token slots × memory per token
```

**PagedAttention** (from vLLM) solves this by allocating memory in **pages** on-demand:

```
PagedAttention (efficient):
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Request A  │ │ Request B  │ │ Request C  │
│ Page 1     │ │ Page 1     │ │ Page 1     │
│ ████       │ │ ████       │ │ ██         │
└────────────┘ └────────────┘ └────────────┘
     ↑              ↑              ↑
  Allocated     Allocated      Allocated
  on-demand     as needed      when needed
  
Pages can be:
- Non-contiguous in memory
- Shared across requests (for common prefixes)
- Freed immediately when request completes
```

### Pros and Cons

**✅ Advantages**
- **Maximum GPU utilization**: Near 100% with high traffic
- **Up to 23x throughput** improvement over static batching
- **Lower latency**: Requests start processing immediately
- **Efficient memory**: With PagedAttention, <4% memory waste

**❌ Disadvantages**
- **Complex implementation**: Requires specialized infrastructure
- **Framework dependency**: Need vLLM, TensorRT-LLM, or similar
- **More overhead per iteration**: Managing dynamic batch composition

### When to Use Continuous Batching

| Use Case | Fit |
|----------|-----|
| LLM inference APIs | ✅ Essential |
| Chatbots and assistants | ✅ Essential |
| High-traffic LLM services | ✅ Essential |
| Variable-length generation | ✅ Excellent |
| Small/simple models | ⚠️ Overkill |

### Code Example (vLLM)

```python
from vllm import LLM, SamplingParams

# vLLM automatically uses continuous batching
llm = LLM(
    model="meta-llama/Llama-2-70b-hf",
    tensor_parallel_size=4,  # Distribute across 4 GPUs
    max_num_seqs=256,        # Max concurrent sequences
    max_num_batched_tokens=4096,  # Max tokens per iteration
)

sampling_params = SamplingParams(
    temperature=0.7,
    max_tokens=256,
)

# Requests are automatically batched at iteration level
outputs = llm.generate([
    "Write a poem about",
    "Explain quantum computing in",
    "The history of artificial intelligence",
], sampling_params)
```

### vLLM API Server (Production)

```python
# Start vLLM server
# vllm serve meta-llama/Llama-2-70b-hf --tensor-parallel-size 4

# Client code
import openai

client = openai.OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-abc123",  # vLLM doesn't validate by default
)

# Multiple concurrent requests automatically benefit from
# continuous batching
responses = await asyncio.gather(*[
    client.chat.completions.create(
        model="meta-llama/Llama-2-70b-hf",
        messages=[{"role": "user", "content": prompt}]
    )
    for prompt in prompts
])
```

---

## Comparison Table

| Feature | Static Batching | Dynamic Batching | Continuous Batching |
|---------|-----------------|------------------|---------------------|
| **Batch trigger** | Fixed size or timeout | Time window or max size | Every token iteration |
| **GPU utilization** | Medium (60-80%) | Medium-High (70-85%) | Very High (90-99%) |
| **Latency** | High | Medium | Low |
| **Throughput** | Medium | Medium-High | Very High (up to 23x) |
| **Memory efficiency** | Low (pre-allocated) | Low-Medium | High (with PagedAttention) |
| **Implementation** | Simple | Medium | Complex |
| **Best for** | Offline jobs | General ML APIs | LLM production |
| **Examples** | Custom scripts | NVIDIA Triton | vLLM, TensorRT-LLM |

---

## Decision Flowchart

```
                        ┌─────────────────────┐
                        │   START: Choose a   │
                        │  Batching Strategy  │
                        └──────────┬──────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Is this an LLM /     │
                       │  autoregressive model?│
                       └───────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                   YES                           NO
                    │                             │
                    ▼                             ▼
         ┌──────────────────┐          ┌──────────────────┐
         │ Is real-time     │          │ Is this offline/ │
         │ latency critical?│          │ batch processing?│
         └────────┬─────────┘          └────────┬─────────┘
                  │                             │
         ┌────────┴────────┐           ┌────────┴────────┐
         │                 │           │                 │
        YES               NO          YES               NO
         │                 │           │                 │
         ▼                 ▼           ▼                 ▼
   ┌───────────┐    ┌───────────┐┌───────────┐    ┌───────────┐
   │CONTINUOUS │    │  DYNAMIC  ││  STATIC   │    │  DYNAMIC  │
   │ BATCHING  │    │ BATCHING  ││ BATCHING  │    │ BATCHING  │
   │           │    │    or     │└───────────┘    │           │
   │  vLLM     │    │Continuous │      │          │  Triton   │
   │TensorRT-LLM    │ if traffic│      │          │           │
   └───────────┘    │ is high   │      │          └───────────┘
         │          └───────────┘      │                 │
         ▼                 │           ▼                 ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    USE CASES                            │
   ├─────────────────────────────────────────────────────────┤
   │ Continuous: Chatbots, AI assistants, streaming APIs     │
   │ Dynamic:    Embedding APIs, image models, general ML    │
   │ Static:     Overnight processing, bulk jobs, reports    │
   └─────────────────────────────────────────────────────────┘
```

---

## Practical Recommendations

### Quick Reference by Use Case

| Your Situation | Recommended Strategy | Why |
|----------------|---------------------|-----|
| Building an LLM API | Continuous (vLLM) | Maximum throughput + low latency |
| Serving embeddings | Dynamic (Triton) | Good balance, no iteration-level scheduling needed |
| Processing overnight | Static | Simplest, throughput > latency |
| Variable traffic | Dynamic | Adapts to load |
| GPU memory constrained | Continuous + PagedAttention | Best memory efficiency |
| Prototype/simple deployment | Static | Fastest to implement |

### Configuration Tips

**For vLLM (Continuous Batching):**
```python
# Key parameters to tune
llm = LLM(
    model="your-model",
    max_num_seqs=256,           # Higher = more concurrent requests
    max_num_batched_tokens=4096, # Balance with GPU memory
    gpu_memory_utilization=0.9,  # Leave headroom
)
```

**For Triton (Dynamic Batching):**
```protobuf
dynamic_batching {
    # Start with these, tune based on p99 latency
    preferred_batch_size: [ 4, 8, 16 ]
    max_queue_delay_microseconds: 10000  # 10ms
}
```

**For Static Batching:**
```python
# Simple heuristics
batch_size = min(
    gpu_memory_limit // memory_per_request,
    target_throughput * acceptable_latency
)
timeout_ms = acceptable_latency * 0.5  # Leave time for processing
```

---

## The Evolution of LLM Serving

```
2020-2021: Static Batching Era
└─→ Simple but inefficient for LLMs

2022: Orca Paper (OSDI '22)
└─→ Introduced iteration-level scheduling
└─→ "Selective batching" concept

2023: vLLM + PagedAttention
└─→ Combined continuous batching with efficient memory
└─→ Open-source, production-ready
└─→ 2-4x throughput over FasterTransformer

2024-2025: Industry Standard
└─→ TensorRT-LLM adopted Orca concepts
└─→ Major cloud providers use continuous batching
└─→ Essential for cost-effective LLM serving
```

---

## Key Takeaways

1. **Batching is essential** for cost-effective GPU utilization
2. **Static batching** is simple but creates latency and wastes compute on padding
3. **Dynamic batching** balances throughput and latency for general ML APIs
4. **Continuous batching** is the gold standard for LLM inference, achieving up to 23x throughput improvement
5. **PagedAttention** enables efficient memory management for continuous batching
6. **Choose based on your use case**: real-time LLMs need continuous batching; offline jobs can use static

> [!TIP]
> When in doubt, start with dynamic batching (using Triton or similar). If you're serving LLMs in production, invest in continuous batching infrastructure (vLLM, TensorRT-LLM) — the throughput gains will pay for the complexity.

---

## References

1. Yu, G. et al. (2022). "Orca: A Distributed Serving System for Transformer-Based Generative Models." USENIX OSDI '22. [Paper](https://www.usenix.org/conference/osdi22/presentation/yu)

2. Kwon, W. et al. (2023). "Efficient Memory Management for Large Language Model Serving with PagedAttention." SOSP '23. [vLLM Paper](https://arxiv.org/abs/2309.06180)

3. [vLLM Documentation](https://docs.vllm.ai/)

4. [NVIDIA TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)

5. [NVIDIA Triton Inference Server - Dynamic Batching](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_configuration.md#dynamic-batcher)

6. [BentoML - LLM Batching Guide](https://docs.bentoml.com/en/latest/guides/adaptive-batching.html)

---

*Last updated: February 2026*
