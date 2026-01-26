# A Postmortem of Three Recent Issues

**Source**: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
**Author**: Sam McAllister
**Published**: Sep 17, 2025
**Company**: Anthropic

## Summary

This is a technical report on three bugs that intermittently degraded responses from Claude. Between August and early September 2025, three infrastructure bugs caused degraded responses from Claude.

## Key Points

### How Anthropic Serves Claude at Scale
- Claude is served via first-party API, Amazon Bedrock, and Google Cloud's Vertex AI
- Deployed across multiple hardware platforms: AWS Trainium, NVIDIA GPUs, and Google TPUs
- Each platform requires specific optimizations while maintaining strict equivalence standards

### Timeline of Events
- August 5: First bug introduced (context window routing error)
- August 25-26: Two more bugs deployed
- August 29: Load balancing change increased affected traffic
- September 2-18: Fixes deployed across platforms

### The Three Bugs

**1. Context Window Routing Error**
- Some Sonnet 4 requests were misrouted to servers configured for 1M token context window
- Initially affected 0.8% of requests, peaked at 16% on August 31
- "Sticky" routing meant affected users continued getting degraded responses

**2. Output Corruption**
- Misconfiguration on TPU servers caused token generation errors
- Occasionally assigned high probability to wrong tokens
- Produced Thai/Chinese characters in English responses, syntax errors in code

**3. Approximate Top-k XLA:TPU Miscompilation**
- Code change triggered latent bug in XLA:TPU compiler
- Related to mixed precision arithmetic (bf16 vs fp32)
- Bug behavior was frustratingly inconsistent

### XLA Compiler Bug Deep Dive
- Models calculate probabilities for each possible next word
- Use "top-p sampling" with threshold of 0.99-0.999
- Precision mismatch between bf16 and fp32 caused issues
- Approximate top-k operation sometimes returned completely wrong results
- Fixed by switching from approximate to exact top-k

### Why Detection Was Difficult
- Evaluations didn't capture the degradation users reported
- Privacy practices limited engineer access to user interactions
- Each bug produced different symptoms on different platforms
- Overlapping bugs created confusing, contradictory reports

### What They're Changing
- More sensitive evaluations
- Quality evaluations running continuously on production systems
- Faster debugging tooling
- Better tools to debug community-sourced feedback while preserving privacy

## Key Quote
"To state it plainly: We never reduce model quality due to demand, time of day, or server load. The problems our users reported were due to infrastructure bugs alone."




