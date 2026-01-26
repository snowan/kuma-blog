# Scaling long-running autonomous coding

**Source**: https://cursor.com/blog/scaling-agents
**Author**: Wilson Lin (Cursor)

## Overview

We've been experimenting with running coding agents autonomously for weeks. Our goal is to understand how far we can push the frontier of agentic coding for projects that typically take human teams months to complete.

This post describes what we've learned from running hundreds of concurrent agents on a single project, coordinating their work, and watching them write over a million lines of code and trillions of tokens.

## The Limits of a Single Agent

Today's agents work well for focused tasks, but are slow for complex projects. The natural next step is to run multiple agents in parallel, but figuring out how to coordinate them is challenging.

Our first instinct was that planning ahead would be too rigid. The path through a large project is ambiguous, and the right division of work isn't obvious at the start. We began with dynamic coordination, where agents decide what to do based on what others are currently doing.

## Learning to Coordinate

Our initial approach gave agents equal status and let them self-coordinate through a shared file. Each agent would check what others were doing, claim a task, and update its status. To prevent two agents from grabbing the same task, we used a locking mechanism.

This failed in interesting ways:

1. Agents would hold locks for too long, or forget to release them entirely. Even when locking worked correctly, it became a bottleneck. Twenty agents would slow down to the effective throughput of two or three, with most time spent waiting.

2. The system was brittle: agents could fail while holding locks, try to acquire locks they already held, or update the coordination file without acquiring the lock at all.

We tried replacing locks with optimistic concurrency control. Agents could read state freely, but writes would fail if the state had changed since they last read it. This was simpler and more robust, but there were still deeper problems.

With no hierarchy, agents became risk-averse. They avoided difficult tasks and made small, safe changes instead. No agent took responsibility for hard problems or end-to-end implementation. This led to work churning for long periods of time without progress.

## Planners and Workers

Our next approach was to separate roles. Instead of a flat structure where every agent does everything, we created a pipeline with distinct responsibilities.

- **Planners** continuously explore the codebase and create tasks. They can spawn sub-planners for specific areas, making planning itself parallel and recursive.

- **Workers** pick up tasks and focus entirely on completing them. They don't coordinate with other workers or worry about the big picture. They just grind on their assigned task until it's done, then push their changes.

At the end of each cycle, a judge agent determined whether to continue, then the next iteration would start fresh. This solved most of our coordination problems and let us scale to very large projects without any single agent getting tunnel vision.

## Running for Weeks

To test this system, we pointed it at an ambitious goal: building a web browser from scratch. The agents ran for close to a week, writing over 1 million lines of code across 1,000 files.

Despite the codebase size, new agents can still understand it and make meaningful progress. Hundreds of workers run concurrently, pushing to the same branch with minimal conflicts.

Other experiments:
- **Solid to React migration** in the Cursor codebase: 3+ weeks, +266K/-193K edits
- **Video rendering 25x faster** with efficient Rust version
- **Java LSP**: 7.4K commits, 550K LoC
- **Windows 7 emulator**: 14.6K commits, 1.2M LoC
- **Excel clone**: 12K commits, 1.6M LoC

## What We've Learned

1. **Model choice matters** for extremely long-running tasks. GPT-5.2 models are much better at extended autonomous work: following instructions, keeping focus, avoiding drift, and implementing things precisely and completely.

2. **Different models excel at different roles**. GPT-5.2 is a better planner than GPT-5.1-Codex, even though the latter is trained specifically for coding.

3. **Many improvements came from removing complexity** rather than adding it. We initially built an integrator role for quality control and conflict resolution, but found it created more bottlenecks than it solved.

4. **The best system is often simpler than you'd expect**. We initially tried to model systems from distributed computing and organizational design. However, not all of them work for agents.

5. **The right amount of structure is somewhere in the middle**. Too little structure and agents conflict, duplicate work, and drift. Too much structure creates fragility.

6. **Prompts matter most**. A surprising amount of the system's behavior comes down to how we prompt the agents. Getting them to coordinate well, avoid pathological behaviors, and maintain focus over long periods required extensive experimentation.

## What's Next

Multi-agent coordination remains a hard problem. Our current system works, but we're nowhere near optimal:
- Planners should wake up when their tasks complete to plan the next step
- Agents occasionally run for far too long
- We still need periodic fresh starts to combat drift and tunnel vision

But the core question—can we scale autonomous coding by throwing more agents at a problem—has a more optimistic answer than we expected. Hundreds of agents can work together on a single codebase for weeks, making real progress on ambitious projects.
