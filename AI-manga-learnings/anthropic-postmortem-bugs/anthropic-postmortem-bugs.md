---
title: "A Postmortem of Three Recent Issues"
source: "https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues"
author: "Sam McAllister"
company: "Anthropic"
date: "2025-09-17"
style: "ligne-claire + warm"
---

# A Postmortem of Three Recent Issues

## Article Summary

Between August and early September 2025, three infrastructure bugs intermittently degraded Claude's response quality. This transparent technical postmortem from Anthropic explains what happened, why detection and resolution took time, and what changes are being made to prevent similar issues.

### Key Insights

1. **Scale Complexity**: Claude is served across multiple platforms (API, Amazon Bedrock, Google Vertex AI) and hardware (TPUs, GPUs, Trainium), each requiring specific optimizations while maintaining strict equivalence.

2. **The Three Overlapping Bugs**:
   - **Context Window Routing Error**: Some requests misrouted to 1M token servers (peaked at 16%)
   - **Output Corruption**: Token generation errors producing wrong characters mid-response
   - **XLA:TPU Miscompilation**: Precision mismatch (bf16 vs fp32) causing high-probability tokens to vanish

3. **Transparency Commitment**: "We never reduce model quality due to demand, time of day, or server load."

4. **Lessons Learned**: More sensitive evaluations, continuous production monitoring, and faster debugging tools while preserving user privacy.

---

## Visual Story

### Cover
![Cover](./00-cover-postmortem.png)

**Three engineers stand ready with magnifying glasses, surrounded by server infrastructure.** Three small bug creatures hide among the servers, foreshadowing the investigation to come. The warm lighting suggests hope and transparency despite the serious topic.

---

### Page 1: The Scale of Claude
![Page 1](./01-page-scale.png)

**How Anthropic serves Claude to millions worldwide.** This page introduces the massive infrastructure behind Claude - TPUs, GPUs, and Trainium chips working together across AWS, Google Cloud, and first-party API. The challenge: maintaining identical quality regardless of which platform handles a request.

---

### Page 2: Something's Wrong
![Page 2](./02-page-first-signs.png)

**The first signs of trouble emerge in August 2025.** Users begin reporting strange behavior - Thai characters appearing in English responses, syntax errors in code. By late August, the complaints are impossible to ignore, and engineer Sarah declares: "We need to investigate. Now."

---

### Page 3: Uncovering the Trio
![Page 3](./03-page-three-bugs.png)

**Three distinct bugs are revealed.** Investigation uncovers not one, but three overlapping issues:
- **Routy** (Router Bug): Confused arrow tentacles sending requests to wrong servers
- **Glitchy** (Corruption Bug): Pixelated creature causing scrambled output
- **Decimal** (Precision Bug): Misaligned gears (bf16/fp32) dropping the best tokens

---

### Page 4: A Perfect Storm
![Page 4](./04-page-timeline.png)

**The timeline shows how the bugs compounded.** Starting August 5 with small impact, amplified by load balancing changes on August 29, until 16% of some requests were affected. Some users saw normal performance, others experienced severe degradation - creating confusing, contradictory reports.

---

### Page 5: Inside the Machine
![Page 5](./05-page-precision.png)

**A deep dive into the XLA compiler precision bug.** Claude calculates probabilities for each next word, using top-p sampling. The problem: bf16 and fp32 operations didn't agree on which token had highest probability, causing the best choice to sometimes vanish entirely.

---

### Page 6: Chasing Shadows
![Page 6](./06-page-hunt.png)

**The frustrating inconsistency of the bug.** The same test passes, then fails. Same prompt, different results. The bug's behavior changed based on what ran before, after, and whether debugging was enabled. Late nights in the office, but the team remains determined: "Model quality is non-negotiable."

---

### Page 7: Fighting Back
![Page 7](./07-page-resolution.png)

**September 2-18: The fixes roll out.** Each bug is contained:
- Routing logic corrected to proper server pools
- Token corruption rolled back with detection tests added
- Switched from approximate to exact top-k sampling
"We accepted the minor efficiency impact. Model quality is worth it."

---

### Page 8: What We're Changing
![Page 8](./08-page-lessons.png)

**Lessons learned and commitments made.** More sensitive evaluations, continuous quality checks on production systems, and faster debugging tools. Sarah addresses readers directly: "We remain grateful to our community for their patience and contributions. Transparency builds trust."

---

### Page 9: Moving Forward
![Page 9](./09-page-commitment.png)

**The final commitment to users.** Claude surrounded protectively by the engineering team. Infrastructure running smoothly. Sunrise over the systems. "We never reduce model quality due to demand, time of day, or server load. We maintain an extremely high bar for quality. We'll keep climbing higher."

---

*Generated by Michi Manga*
*Source: [Anthropic Engineering Blog](https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues)*
