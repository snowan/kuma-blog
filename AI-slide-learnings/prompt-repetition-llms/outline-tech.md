---
title: "Prompt Repetition: Zero-Latency Performance Boost"
source: https://arxiv.org/abs/2512.14982
date: 2025-12
style: tech
slide_count: 8
language: en
---

> Source: [Prompt Repetition Improves Non-Reasoning LLMs](https://arxiv.org/abs/2512.14982)

## Slide 1: Cover
**Style**: tech
**Visual**: Abstract digital visualization of a prompt being duplicated. Glowing blue data streams.
**Title**: Prompt Repetition
**Subtitle**: Zero-Latency Performance Gains for LLMs

---

## Slide 2: The Latency/Performance Trade-off
**Style**: tech
**Visual**: Graph showing "Performance" vs "Latency". "Reasoning Models" (o1) are high performance but high latency. "Standard Models" are low latency but lower performance.
**Content**:
- **Reasoning Models (e.g., o1)**: Achieve high performance via Chain-of-Thought (CoT).
- **Cost**: Significant increase in output tokens and latency.
- **Challenge**: How to improve performance without the latency penalty?

---

## Slide 3: The Prompt Repetition Method
**Style**: tech
**Visual**: Schematic: Input Block -> [Repeat] -> Input Block x2 -> Model.
**Content**:
- **Mechanism**: Simply repeating the input query.
- **Example**: `Q: Solve X. Q: Solve X.`
- **Result**: Immediate performance improvement on standard benchmarks.

---

## Slide 4: Benchmark Results
**Style**: tech
**Visual**: Bar chart comparison. "Baseline" vs "Repetition" for GSM8K (Math) and MMLU (Logic). Repetition shows clear lift.
**Content**:
- **Tested Models**: Gemini 1.5 Pro, GPT-4o, Claude 3.5 Sonnet, Llama 3.
- **Gains**: Consistent improvements across models.
- **Benchmarks**: Math (GSM8K) and common sense reasoning.

---

## Slide 5: Why It Works: Attention Mechanism
**Style**: tech
**Visual**: Neural network attention map visualization. Highlighting how repetition increases attention scores on the query.
**Content**:
- **Hypothesis**: Repetition simulates "re-reading".
- Allows the attention mechanism to focus more heavily on the prompt constraints.
- Similar effect to CoT but occurred *before* generation.

---

## Slide 6: Efficiency Analysis
**Style**: tech
**Visual**: Side-by-side comparison of "Token Usage".
- **CoT**: Huge Output Tokens (Slow & Expensive).
- **Repetition**: Small Input Token increase (Fast & Cheap).
**Content**:
- **Input Tokens**: ~2x (Pre-fill is cheap/fast).
- **Output Tokens**: 1x (No change).
- **Latency**: Near zero impact.

---

## Slide 7: Implementation Strategy
**Style**: tech
**Visual**: Code snippet or API call example.
`response = client.generate(prompt + "\n" + prompt)`
**Content**:
- Easiest optimization to implement.
- No model fine-tuning required.
- Applicable to any existing LLM pipeline.

---

## Slide 8: Summary
**Style**: tech
**Visual**: Key value usage dashboard. "Performance: Up", "Latency: Flat".
**Content**:
- **Key Takeaway**: Prompt Repetition is a Pareto improvement.
- **Action**: Verify on your specific domain tasks.
- **Future**: Potential for automated "internal" repetition in future architectures.

