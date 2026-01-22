---
title: "SimpleMem: Efficient Lifelong Memory for LLM Agents"
url: "https://arxiv.org/abs/2601.02553"
date: "2026-01"
tags: ["LLM", "Memory", "Agents", "Efficiency"]
---

# SimpleMem: Efficient Lifelong Memory for LLM Agents

## Summary
SimpleMem is an efficient memory framework for LLM agents based on semantic lossless compression. It addresses the challenges of managing historical experiences in complex environments by proposing a three-stage pipeline:
1.  **Semantic Structured Compression**: Distills unstructured interactions into compact, multi-view indexed memory units using entropy-aware filtering.
2.  **Recursive Memory Consolidation**: Asynchronously integrates related units into higher-level abstract representations to reduce redundancy.
3.  **Adaptive Query-Aware Retrieval**: Dynamically adjusts retrieval scope based on query complexity.

The framework achieves an average F1 improvement of 26.4% and reduces inference-time token consumption by up to 30-fold compared to baseline approaches.
