# Prompt Repetition Improves Non-Reasoning LLMs

> **Paper**: [Prompt Repetition Improves Non-Reasoning LLMs](https://arxiv.org/abs/2512.14982)  
> **Authors**: Yaniv Leviathan, Matan Kalman, Yossi Matias  
> **Date**: December 2025

## Summary

This paper presents a surprisingly simple technique to improve the performance of standard LLMs: **just repeat the prompt**. When you feed the same query twice to models like GPT-4, Claude, or Gemini, they perform significantly better on reasoning and math tasks—without the latency penalty of "reasoning" models like o1.

---

## 1. The Problem: Reasoning vs Speed

![The Reasoning Gap](01-slide-cover.png)

**Key Takeaway**: Modern "reasoning" models (like OpenAI's o1) achieve better results by generating internal "thinking" tokens. However, this comes at a significant cost: increased latency and token usage. Standard models are fast but can miss complex details.

**The Question**: Can we make standard models smarter *without* the slow-down?

---

## 2. The Technique: Prompt Repetition

![Two Robots Comparing](02-slide-reasoning-gap.png)

**Key Takeaway**: The core technique is deceptively simple: repeat the user's input prompt.

**Example**:
- **Before**: `"Solve this math problem: 2x + 5 = 15"`
- **After**: `"Solve this math problem: 2x + 5 = 15. Solve this math problem: 2x + 5 = 15."`

That's it. No fancy prompting strategies. No Chain-of-Thought. Just... say it twice.

---

## 3. The Magic of Repetition

![Cat with Magic Wand](03-slide-magic-trick.png)

**Key Takeaway**: This simple trick unlocks latent capability in the model. It's like giving the model a "second chance" to pay attention to the critical parts of your query.

**Why "Magic"?**
- Works across different model families (Gemini, GPT, Claude, Deepseek)
- No model modifications required
- Zero-shot improvement

---

## 4. How It Works Mechanically

![Cat at Whiteboard](04-slide-how-it-works.png)

**Key Takeaway**: The technique increases input tokens but does NOT increase output tokens or generation latency.

**The Mechanics**:
1. User provides prompt P.
2. System creates new prompt: P + P.
3. Model processes the doubled prompt.
4. Output is generated at the same speed as a single prompt.

**Why no latency increase?**: Input token processing (pre-fill) is highly parallel and cheap. Output token generation (auto-regressive) is the bottleneck, and that remains unchanged.

---

## 5. Benchmark Results

![Cat Climbing Bar Chart Tree](05-slide-results.png)

**Key Takeaway**: Prompt repetition shows consistent improvements across multiple benchmarks.

**Results Summary**:
- **GSM8K (Math)**: Significant accuracy gains
- **MMLU (Reasoning)**: Noticeable improvement
- **Models Tested**: Gemini 1.5 Pro, GPT-4o, Claude 3.5 Sonnet, Llama 3, Deepseek

The improvement is NOT marginal—it's a meaningful lift in accuracy for complex tasks.

---

## 6. Comparison: Fast vs. Slow

![Cat Racing Car vs Turtle](06-slide-fast-vs-slow.png)

**Key Takeaway**: Prompt Repetition achieves a Pareto improvement—better performance without latency cost.

| Method | Input Tokens | Output Tokens | Latency |
|--------|--------------|---------------|---------|
| Standard Prompt | 1x | 1x | Fast |
| Chain of Thought | 1x | 5-10x | Slow |
| o1 Reasoning | 1x | 10-100x | Very Slow |
| **Prompt Repetition** | **2x** | **1x** | **Fast** |

---

## 7. Why Does It Work?

![Cat Reading with Magnifying Glass](07-slide-why.png)

**Key Takeaway**: The hypothesis is that repetition simulates "re-reading" for the model.

**Possible Mechanisms**:
1. **Increased Attention Scores**: The repeated tokens accumulate higher attention weights, making the query more salient.
2. **Overcoming "Lost in the Middle"**: LLMs often struggle to attend to information in the middle of long contexts. Repetition places key information at the end as well.
3. **Implicit Emphasis**: Similar to how bolding or repeating instructions helps humans, it helps models too.

---

## 8. Practical Application

![Cat Thumbs Up with Phone](08-slide-try-it.png)

**Key Takeaway**: You can start using this technique today in your own prompts.

**How to Apply**:
```python
# Simple implementation
def repeat_prompt(prompt, n=2):
    return " ".join([prompt] * n)

response = model.generate(repeat_prompt("Explain quantum computing."))
```

**Best Practices**:
- Start with 2x repetition (diminishing returns beyond that)
- Most effective for complex reasoning/math tasks
- Less impactful for simple factual retrieval

---

## Key Takeaways

1. **Simple but Effective**: Repeating the prompt 2x improves LLM performance on reasoning tasks.
2. **Zero Latency Cost**: Unlike Chain-of-Thought or o1, repetition only adds input tokens.
3. **Universal**: Works on Gemini, GPT, Claude, and open-source models.
4. **Easy to Implement**: One-line code change in your prompting strategy.
5. **Hypothesis**: Acts like "re-reading" to increase attention on key instructions.

---

## Citation

```bibtex
@article{leviathan2025prompt,
  title={Prompt Repetition Improves Non-Reasoning LLMs},
  author={Leviathan, Yaniv and Kalman, Matan and Matias, Yossi},
  journal={arXiv preprint arXiv:2512.14982},
  year={2025}
}
```
