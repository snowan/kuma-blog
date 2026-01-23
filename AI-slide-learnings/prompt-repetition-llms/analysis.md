---
title: "Prompt Repetition Improves Non-Reasoning LLMs"
topic: AI / Prompt Engineering
source_language: en
user_language: en
style_signals: ["LLMs", "performance", "simple trick", "benchmark"]
---

## Core Message
Repeating the input prompt (e.g., repeating the question twice) significantly improves the performance of standard "non-reasoning" LLMs (like GPT-4, Claude 3.5 Sonnet, Gemini 1.5 Pro) on complex tasks, without increasing generation latency (unlike "reasoning" models that "think" for a long time).

## Key Insights
1.  **The Technique**: Simply repeat the user prompt.
2.  **The Benefit**: Better performance on reasoning/math/logic benchmarks.
3.  **The "Why"**: It might allow the model to attend to the query more effectively or simulate a form of "re-reading" before answering.
4.  **The Trade-off**: Slightly more input tokens, but NO increase in output generation time (unlike Chain-of-Thought or o1).

## Audience
- AI Engineers
- Prompt Engineers
- Developers using LLM APIs
- General Tech Enthusiasts

## Structure (Slide Deck)
1.  **Cover**: The "One Weird Trick" for LLMs.
2.  **The Problem**: Standard LLMs can struggle with complex reasoning compared to new "Reasoning" models (o1).
3.  **The Solution**: Just... repeat the prompt? (Yes/No? Yes!)
4.  **How it Works**: Input: "Solve X. Solve X." -> Output: "Answer".
5.  **Results**: Show improvement graphs (stylized).
6.  **Comparison**: vs Chain of Thought (more output tokens) vs o1 (slow). Repetition is fast!
7.  **Why it works**: Re-reading key information.
8.  **Takeaway**: Try it in your prompts today.
