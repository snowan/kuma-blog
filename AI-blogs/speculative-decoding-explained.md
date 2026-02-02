---
title: "Speculative Decoding: How to Make LLMs 2-3x Faster Without Losing Quality"
date: 2026-02-02
author: "Michi Meow"
categories: ["AI", "LLM Optimization", "Inference"]
tags: ["Speculative Decoding", "LLM", "Inference Optimization", "vLLM", "Hugging Face", "Deep Dive"]
description: "A comprehensive guide to speculative decoding, the technique that accelerates LLM inference by 2-3x while maintaining identical output quality. Learn how draft-then-verify works, the math behind acceptance rates, and practical implementations."
image: "AI-blogs/resources/speculative-decoding-hero.png"
---

# Speculative Decoding: How to Make LLMs 2-3x Faster Without Losing Quality

## The Problem: Why LLMs Are Slow

Large Language Models (LLMs) generate text one token at a time through a process called **autoregressive decoding**. Each token requires a full forward pass through billions of parameters, and each pass must wait for the previous one to complete.

```
Input: "The cat sat on the"
       ↓ (forward pass 1)
       "mat"
       ↓ (forward pass 2)  
       "and"
       ↓ (forward pass 3)
       "purred"
       ...
```

This sequential nature creates a fundamental bottleneck: **generating 100 tokens requires 100 forward passes**, regardless of how powerful your hardware is. The model is often "memory-bound" rather than "compute-bound" — it spends more time loading weights than doing actual computation.

### The Latency Problem

For a 70 billion parameter model:
- **Memory bandwidth**: Loading 70B parameters × 2 bytes (FP16) = 140 GB per forward pass
- **Generation speed**: ~30-50 tokens/second on high-end hardware
- **User experience**: Noticeable lag, especially for longer responses

What if we could generate **multiple tokens in the time of one forward pass**?

---

## The Solution: Speculative Decoding

**Speculative decoding** (also called "speculative sampling") is a technique that uses a smaller, faster "draft" model to predict what the larger "target" model would say, then verifies those predictions in parallel.

The key insight: **verification is cheaper than generation**.

### The Core Idea

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SPECULATIVE DECODING                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. DRAFT PHASE (Fast)                                              │
│     ┌─────────────┐                                                 │
│     │ Draft Model │ ──→ [The] [cat] [sat] [on] [the]               │
│     │    (7B)     │         5 tokens in ~5ms                       │
│     └─────────────┘                                                 │
│                                                                     │
│  2. VERIFY PHASE (Parallel)                                         │
│     ┌──────────────┐                                                │
│     │ Target Model │ ──→ Verify all 5 tokens in ONE forward pass   │
│     │    (70B)     │                                                │
│     └──────────────┘                                                │
│                                                                     │
│  3. ACCEPT/REJECT                                                   │
│     [The] ✓  [cat] ✓  [sat] ✓  [on] ✗  [the] (discarded)           │
│                                                                     │
│  Result: 4 tokens generated in ~1 forward pass time                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Why This Works

1. **Parallel verification**: The target model can compute probabilities for ALL draft tokens simultaneously in a single forward pass
2. **KV cache reuse**: Once tokens are verified, their KV cache entries are kept for the next iteration
3. **Lossless quality**: The final output distribution is mathematically identical to standard decoding

---

## A Simple Analogy: The Editor and the Intern

Imagine a busy editor (the target model) who must review every word in a document. Instead of writing each word themselves:

1. **The intern** (draft model) writes a rough draft quickly
2. **The editor** reviews the entire draft at once
3. If the first 3 sentences are good, the editor **accepts** them
4. The editor **corrects** the first wrong sentence and discards everything after it
5. The intern writes a new draft starting from the correction

The editor saves time because **reviewing is faster than writing**, and most of the intern's work is good enough to keep.

---

## How It Works: Step by Step

### Step 1: Draft Token Generation

The smaller draft model (e.g., 7B parameters) generates K candidate tokens autoregressively:

```python
# Pseudocode
draft_tokens = []
for i in range(K):  # K = 4-8 typically
    next_token = draft_model.generate(input + draft_tokens)
    draft_tokens.append(next_token)
```

### Step 2: Parallel Verification

The target model (e.g., 70B parameters) processes all draft tokens in a **single forward pass**:

```python
# Single forward pass computes probabilities for all positions
target_probs = target_model.forward(input + draft_tokens)
draft_probs = [p1, p2, p3, p4, ...]  # Saved from draft phase
```

### Step 3: Accept or Reject (Rejection Sampling)

For each draft token, compare probabilities:

```
For token at position i with value x:
  
  If P_target(x) >= P_draft(x):
      → Always ACCEPT (draft was conservative)
  
  Else:
      → Accept with probability: P_target(x) / P_draft(x)
      → If rejected: Stop, sample new token from adjusted distribution
```

This is the mathematical magic that makes speculative decoding **lossless**.

### Step 4: Continue

Accept the longest prefix of matching tokens, then:
- If all K tokens accepted: Generate 1 bonus token from target model → K+1 tokens total
- If n tokens accepted (n < K): Use target model's token at position n+1

---

## The Math: Why It's Lossless

Speculative decoding uses **rejection sampling** to ensure the output distribution matches what the target model would have produced alone.

### Rejection Sampling Explained

For each draft token x with:
- P_q(x) = draft model probability
- P_p(x) = target model probability

The acceptance probability is:

```
α(x) = min(1, P_p(x) / P_q(x))
```

**Case 1: P_p(x) ≥ P_q(x)**
- Accept with probability 1
- The draft model was "pessimistic" about this token

**Case 2: P_p(x) < P_q(x)**
- Accept with probability P_p(x) / P_q(x)
- If rejected: Sample from the "residual" distribution:
  
  ```
  P_residual(x) ∝ max(0, P_p(x) - P_q(x))
  ```

### Why This Preserves the Distribution

The beauty of rejection sampling is that:
- Accepted tokens come from the target distribution
- Rejected tokens are resampled from a correction distribution
- The **combination** exactly matches P_target

This guarantees **identical outputs** to standard decoding — same quality, just faster.

### Acceptance Rate and Speedup

The **acceptance rate (α)** determines the speedup:

```
Expected accepted tokens per round: τ = (1 - α^(K+1)) / (1 - α)

Where:
  α = average acceptance probability
  K = number of draft tokens
```

| Acceptance Rate | Expected Tokens | Effective Speedup |
|-----------------|-----------------|-------------------|
| 50%             | ~2 tokens       | ~1.5x             |
| 70%             | ~3 tokens       | ~2.0x             |
| 80%             | ~4 tokens       | ~2.5x             |
| 90%             | ~5+ tokens      | ~3.0x             |

---

## Real-World Implementations

### Hugging Face Transformers (Assisted Generation)

Starting from `transformers` v4.45.0, speculative decoding is called "assisted generation":

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load target model
target_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b-hf")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-70b-hf")

# Load draft (assistant) model
assistant_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")

# Generate with speculative decoding
inputs = tokenizer("The future of AI is", return_tensors="pt")
outputs = target_model.generate(
    **inputs,
    assistant_model=assistant_model,  # Enable speculative decoding
    max_new_tokens=100,
    do_sample=False  # Greedy decoding
)
print(tokenizer.decode(outputs[0]))
```

### vLLM Implementation

vLLM supports multiple speculative decoding methods:

```python
from vllm import LLM, SamplingParams

# Method 1: Separate draft model
llm = LLM(
    model="facebook/opt-6.7b",
    speculative_model="facebook/opt-125m",
    num_speculative_tokens=5,
)

# Method 2: N-gram prompt lookup (no extra model needed!)
llm = LLM(
    model="facebook/opt-6.7b",
    speculative_model="[ngram]",  # Use prompt n-grams
    num_speculative_tokens=5,
    ngram_prompt_lookup_max=4,
)

sampling_params = SamplingParams(temperature=0, max_tokens=100)
output = llm.generate("The future of AI is", sampling_params)
```

### N-gram Prompt Lookup: A Clever Trick

For tasks where the output contains text from the input (like summarization or copy-paste tasks), vLLM offers **n-gram prompt lookup**:

1. Look for n-grams in the prompt that match the current context
2. Use the tokens following that n-gram as draft tokens
3. No separate draft model needed!

This is especially powerful for:
- Document summarization
- Code completion (when copying existing code)
- Chat with context retrieval

---

## Performance Benchmarks

Real-world results from vLLM and academic papers:

| Model Pair | Task | Speedup |
|------------|------|---------|
| Llama-2 7B + 70B | General text | 2.3x |
| Chinchilla 1B + 70B (DeepMind) | Text generation | 2.5x |
| distil-whisper + whisper-large | Audio transcription | 2.0x |
| OPT-125M + OPT-6.7B | Text generation | 1.8x |
| EAGLE-3 + Various | Text generation | 2.5x |

### Factors Affecting Speedup

1. **Draft model quality**: Better alignment with target → higher acceptance rate
2. **Vocabulary overlap**: Same tokenizer is required
3. **Task type**: Predictable outputs (code, templates) → higher speedup
4. **Temperature**: Lower temperature → higher acceptance rate
5. **Number of draft tokens (K)**: Sweet spot is typically 4-8

---

## Trade-offs and Limitations

### Memory Overhead

Running two models requires more VRAM:
- Target model (70B): ~140 GB (FP16)
- Draft model (7B): ~14 GB (FP16)
- **Total**: ~154 GB vs 140 GB (10% overhead)

### When Speculative Decoding Doesn't Help

1. **Very creative outputs**: High temperature → low acceptance rate → frequent rejections
2. **Poor draft model**: If the draft model is too different from the target, most tokens get rejected
3. **Short outputs**: Overhead of running two models not worth it for <10 tokens
4. **Already compute-bound**: If GPU is already at 100% utilization

### Draft Model Selection Tips

| Target Model | Good Draft Model | Notes |
|--------------|------------------|-------|
| Llama-2 70B | Llama-2 7B | Same family |
| GPT-4 | GPT-3.5 Turbo | Same architecture |
| Whisper large | distil-whisper | Distilled version |
| Custom fine-tune | Base model 1/10 size | Aligned training data |

---

## Advanced Techniques

### EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency)

EAGLE uses a **feature-level draft model** that:
- Takes hidden states from the target model
- Predicts next hidden states (not tokens directly)
- Much lighter than a full draft model
- Achieves higher acceptance rates

### Medusa: Multiple Heads

Instead of a separate draft model, Medusa adds **multiple prediction heads** to the target model:
- Head 1: Predicts token at position +1
- Head 2: Predicts token at position +2
- ...
- All heads share the same forward pass

This eliminates the draft model entirely!

### Self-Speculative Decoding

Uses the **early layers** of the target model as the draft model:
- First N layers → draft predictions
- Full model → verification
- No separate model needed

---

## The Research Papers

Speculative decoding was independently discovered by two teams in 2022-2023:

### Google: "Fast Inference from Transformers via Speculative Decoding"
- **Authors**: Yaniv Leviathan et al.
- **Date**: November 2022
- **arXiv**: [2211.17192](https://arxiv.org/abs/2211.17192)
- **Key contribution**: Formalized the rejection sampling approach

### DeepMind: "Accelerating LLM Decoding with Speculative Sampling"
- **Authors**: Charlie Chen et al.
- **Date**: February 2023
- **arXiv**: [2302.01318](https://arxiv.org/abs/2302.01318)
- **Key contribution**: Demonstrated 2-2.5x speedup on Chinchilla 70B

---

## Practical Recommendations

### When to Use Speculative Decoding

✅ **Good use cases**:
- Long-form text generation (articles, stories)
- Code generation with predictable patterns
- API serving with latency SLAs
- Batch inference for cost reduction

❌ **Avoid when**:
- Very short outputs (<10 tokens)
- Highly creative/diverse sampling (high temperature)
- Memory-constrained environments
- Draft model unavailable for your target model

### Quick Start Checklist

1. **Choose a draft model** from the same family, ~1/10 the size
2. **Set K = 4-6** draft tokens as a starting point
3. **Use greedy decoding** (temperature=0) for maximum speedup
4. **Monitor acceptance rate** — aim for >70%
5. **Profile memory** — ensure both models fit in VRAM

---

## Conclusion

Speculative decoding represents a fundamental shift in how we think about LLM inference. By exploiting the asymmetry between **generation** (expensive) and **verification** (cheap), it achieves 2-3x speedups while maintaining identical output quality.

### Key Takeaways

- **Draft-then-verify**: Small model drafts, large model verifies in parallel
- **Lossless**: Rejection sampling ensures identical output distribution
- **Practical**: Supported by vLLM, Hugging Face, and production systems
- **Trade-offs**: Memory overhead vs. latency reduction

As LLMs grow larger and inference costs dominate, speculative decoding will become an essential tool in every ML engineer's toolkit.

---

## References

1. Leviathan, Y. et al. (2022). "Fast Inference from Transformers via Speculative Decoding." [arXiv:2211.17192](https://arxiv.org/abs/2211.17192)
2. Chen, C. et al. (2023). "Accelerating Large Language Model Decoding with Speculative Sampling." [arXiv:2302.01318](https://arxiv.org/abs/2302.01318)
3. [vLLM Speculative Decoding Documentation](https://docs.vllm.ai/en/latest/features/spec_decode.html)
4. [Hugging Face Assisted Generation Blog](https://huggingface.co/blog/assisted-generation)
5. [EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty](https://arxiv.org/abs/2401.15077)

---

*Last updated: February 2026*
