# Boris Cherny: How the Creator of Claude Code Actually Works

## Metadata
- **Created:** 2026-02-22
- **Subject:** Boris Cherny (@bcherny), Head of Claude Code at Anthropic
- **Sources:** [X Thread on Workflow](https://x.com/bcherny/status/2007179832300581177) · [Lenny's Podcast](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens) · [Developing.dev Interview](https://www.developing.dev/p/boris-cherny-creator-of-claude-code) · [Fortune](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/) · [InfoQ Workflow Deep Dive](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) · [Every.to Podcast](https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it)
- **Topics:** AI-assisted development, workflow design, future of software engineering, team infrastructure

---

## TL;DR

Boris Cherny created Claude Code as a side project in September 2024. Today he ships 22–27 pull requests a day — every line written by Claude. His setup is surprisingly vanilla. His philosophy is not. This post compiles his key insights across interviews and public posts: how he thinks about AI-assisted work, the five practices that actually move the needle, and what he believes engineering looks like from here.

---

## The Origin: A Side Project That Became the Future

Claude Code started in an unusual place — not from a product brief, but from curiosity.

> "When I created Claude Code as a side project back in September 2024, I had no idea it would grow to be what it is today. It is humbling to see how Claude Code has become a core dev tool for so many engineers."
> — Boris Cherny, X, January 2026

The product felt underwhelming at first. It only became viable after Claude Sonnet and Opus 4 shipped in March 2024. Boris's early design philosophy — build for capabilities that don't fully exist yet — turned out to be exactly right.

> "Don't build for today's model, build for the model six months from now."

**My Take:** Most product decisions optimize for what users have today. Boris bet on what the model *would become*. That bet required ignoring negative early signal and trusting that capability gaps were temporary. This is the same pattern behind every major platform — React felt heavy before fast rendering existed; Kubernetes felt complex before cloud-native deployments became standard. Timing bets like this define categories.

---

## The Numbers That Changed Everything

Today, Boris's output is striking by any measure.

> "I shipped 22 PRs yesterday and 27 the day before, each one 100% written by Claude."
> — Boris Cherny

> "100% for two+ months now, I don't even make small edits by hand."

The company-wide number is between 70–90% AI-generated code. Claude Code itself — the product — is approximately 90% written by Claude Code.

**My Take:** These aren't marketing numbers. They're the consequence of a specific workflow. The same person who built the tool ships at this rate by following a set of practices that are teachable, not magical. The rest of this post covers those practices.

---

## The Five Practices That Actually Matter

### 1. Plan First — Always

Most people open Claude Code and start describing what they want done. Boris does not.

> "If my goal is to write a Pull Request, I will use Plan mode, and go back and forth with Claude until I like its plan. From there, I switch into auto-accept edits mode and Claude can usually 1-shot it. A good plan is really important!"

> "You can double or triple your chances of success on complex tasks by switching to plan mode."

Almost every session starts with `Shift+Tab` twice to enter Plan Mode. The pattern: iterate on the plan until it's solid, then switch to auto-accept and let Claude execute.

**My Take:** This mirrors how experienced engineers think about large PRs. The planning phase is where you prevent rework — once you start writing code, sunk cost bias kicks in. Boris has codified this instinct into a mechanical habit. The insight is subtle: Plan Mode isn't a feature, it's a *discipline*. Most users skip it because it feels slower. Boris found the opposite.

---

### 2. Verification Loops — The Single Biggest Multiplier

When asked what matters most, Boris is direct.

> "Probably the most important thing to get great results out of Claude Code: give Claude a way to verify its work."

> "Give Claude a way to verify its work through feedback loops... This can improve the quality of the final result by a factor of 2–3."

In practice, this means giving Claude the ability to open a browser, run a test suite, check logs, or query an API — and iterate until the result actually works.

**My Take:** The verification loop is what separates AI-assisted work from AI-completed work. Without feedback, Claude writes plausible code. With feedback, it writes *correct* code. The difference is whether Claude can observe consequences. This is the same reason test-driven development works — it makes failure visible immediately. Boris has automated this loop as infrastructure, not a one-off check.

---

### 3. CLAUDE.md as Compounding Institutional Memory

Every mistake Claude makes is an opportunity.

> "When Claude does something wrong, add it so it doesn't repeat."

The Anthropic team maintains a shared `CLAUDE.md` file checked into git, currently around 2,500 tokens. It's updated multiple times weekly. During code review, engineers tag `@.claude` on pull requests to let Claude update the file with new learnings — turning review into meta-work.

**My Take:** This is the most underutilized pattern in most Claude Code setups. A `CLAUDE.md` file is not documentation — it's an evolving memory layer that compounds across every session. Each correction that goes in means the same mistake never happens again. Multiply that by a team over months, and you're building something no individual engineer can replicate alone.

---

### 4. Slash Commands for Everything Repetitive

Boris runs the same command dozens of times a day.

> "Claude and I use a /commit-push-pr slash command dozens of times every day."

Commands live in `.claude/commands/`. The team also uses specialized subagents stored in `.claude/agents/` — roles like `code-simplifier`, `verify-app`, `build-validator`, and `code-architect`.

> "In the end, the result is awesome — it finds all the real issues without the false ones."
> — on using competing subagents for code review

**My Take:** The slash command pattern transforms repeated prompts into named operations — closer to functions than chat messages. The subagent competition model (deploying agents with conflicting instructions — some finding bugs, others validating findings) is particularly clever. It reduces false positives the same way adversarial testing does in security: one agent looks for vulnerabilities, another challenges whether they're real.

---

### 5. Parallel Sessions — Treat Claude Like Infrastructure

> "I run 5 Claudes in parallel in my terminal, plus 5–10 on claude.ai/code, and start additional sessions from my phone daily."

Each local session uses its own separate git checkout to avoid conflicts. He acknowledges 10–20% of sessions are abandoned when they hit unexpected scenarios.

> "We've visited companies before where everyone's just walking around with their Claude Code running."

**My Take:** Running 10–15 parallel sessions isn't multitasking — it's pipelining. While one session handles a complex refactor, others run tests, draft documentation, or explore alternatives. The 10–20% abandonment rate is the honest cost: not every session lands, and that's fine. The overall throughput is still dramatically higher than sequential work.

---

## The Setup Is Deliberately Boring

Boris's hardware and tooling are worth noting precisely because they are unremarkable.

> "My setup might be surprisingly vanilla! Claude Code works great out of the box, so I personally don't customize it much. There is no one correct way to use Claude Code — we intentionally build it in a way that you can use it, customize it, and hack it however you like."

He uses:
- Opus 4.5 with thinking enabled — for everything, despite the speed cost
- Pre-approved permissions via `/permissions` (never `--dangerously-skip-permissions`)
- A PostToolUse formatting hook that handles the "final 10%" before CI
- MCP servers for Slack, BigQuery, and Sentry checked into team-wide config

> "A wrong fast answer is slower than a right slow answer."

**My Take:** The choice of Opus over Sonnet for all tasks is a deliberate quality-over-speed bet. Faster models require more steering corrections, which cost more time than the initial latency savings. For someone running 15 parallel sessions, steering quality *is* throughput. The vanilla setup reflects confidence: Boris trusts the defaults because he helped design them.

---

## The Joy Problem

Something Boris says repeatedly across interviews stands out — he talks about *joy*.

> "I have never had this much joy day to day in my work, as I do right now, because essentially all the tedious work, Claude does it, and I get to be creative."

> "Engineers just feel unshackled, that they don't have to work on all the tedious stuff anymore."

**My Take:** This is the signal most productivity analyses miss. The value of AI-assisted development isn't just throughput — it's the quality of work that remains. Humans keep the creative, ambiguous, judgment-heavy work. Claude gets the deterministic, repetitive, specification-following work. That's not subtraction — it's curation. Most engineers didn't get into the field to write boilerplate. Now they don't have to.

---

## The Future Boris Sees

### Software Engineering Is Not Disappearing — It's Transforming

> "Engineering is changing and great engineers are more important than ever."
> — Boris Cherny, responding to questions about hiring at Anthropic

> "Someone has to prompt the Claudes, talk to customers, coordinate with other teams, decide what to build next."

He is also direct about the tectonic shifts:

> "I think today coding is practically solved for me, and I think it'll be the case for everyone regardless of domain."

> "I think we're going to start to see the title 'software engineer' go away. And I think it's just going to be maybe 'builder,' maybe 'product manager,' maybe we'll keep the title as a vestigial thing."

**My Take:** Boris is saying two things simultaneously that seem contradictory but are not. Engineers are more important because *judgment* is more important — deciding what to build, reviewing for correctness, understanding customers, coordinating systems. But the *title* may go away because the distinction between "engineer who codes" and "product person who doesn't" collapses when everyone can produce working software.

### Writing Code Stays Essential — Differently

Boris has a personal rule about staying close to code, even in a management role.

> "Writing code anchors you to reality. Without it, you lose intuition quickly — dangerous place to be."

**My Take:** This is a warning directed at senior engineers and managers who delegate all implementation. When you stop reading and writing code, your mental model of what's possible and what's fragile drifts from reality. Boris's daily 22-PR output isn't vanity — it's a practice for staying calibrated. The tool he built keeps him in the code even as it removes the tedious parts.

### The Hiring Signal Is Shifting

> "When I hire engineers, I look for cool weekend projects — like someone really into making kombucha."
> — Boris Cherny, on what he values in candidates

> "Not all of the things people learned in the past translate to coding with LLMs. The model can fill in the details."

**My Take:** The hiring bar is moving from implementation depth to judgment breadth. Someone who builds experimental side projects demonstrates taste, initiative, and follow-through — qualities that matter more when AI handles implementation. The "kombucha" example is revealing: Boris isn't looking for perfect engineers. He's looking for people who are curious enough to build things they care about for no external reason.

---

## The Generalist Imperative: What Good Engineers Look Like Now

If AI handles the mechanical work of coding, what's left? Boris has been living this question for over two years — and his answer is consistent: the engineers who thrive are the ones who were never *just* coders.

### Escape the Swim Lane

> "At big companies, you get forced into this particular swim lane. It's just so artificial."

Boris traces this thinking back to his early career. Before Meta, he worked at startups since age 18 where he "had to do everything" — engineering, product, design, user research, and sometimes sales. That forced breadth turned out to be a career asset, not a detour.

> "Engineering is a very narrow skill set, when there's so much more that goes into doing that end to end besides just writing code."

**My Take:** Big tech companies optimize for specialization because it's efficient at scale. But specialization also means you never fully understand what you're building or why users care about it. Boris's observation is that the AI moment doesn't reward deeper specialization — it rewards the *opposite*. The constraint is no longer "can you write the code?" The constraint is "do you know what to build?"

---

### The Generalist Standard at Anthropic

Boris isn't just theorizing. He built this culture into how the Claude Code team operates.

> "I love working with generalists. If you're an engineer that codes but can also do product work, design, and have product sense — you want to talk to your users."

> "This is how we recruit for all functions now. Our product managers code, our data scientists code, our user researcher codes a little bit."

He describes engineers at Anthropic as "very much generalists" — where the boundaries between PM, engineer, and designer are deliberately blurry.

> "Software engineers are also going to be writing specs. They are going to be talking to users."

**My Take:** This is what the "builder" title Boris envisions actually requires. Not "someone who builds things" in a narrow technical sense — but someone who understands the full loop: user need → spec → implementation → feedback → iteration. AI accelerates every step in that loop. The person who can *drive* the full loop becomes dramatically more productive than one who only handles a handoff.

---

### Taste Over Syntax

When Boris talks about hiring, he's not looking for algorithm depth or language mastery. He's looking for something harder to teach.

> "When I hire engineers, I look for cool weekend projects — like someone really into making kombucha."

> "These are well-rounded people. These are the kind of people I enjoy working with."

The kombucha example is intentionally odd. Boris is describing people who *make things* — not because it advances their career, but because they're curious and have opinions about how something should work. That's taste. And taste can't be delegated to Claude.

**My Take:** When code generation is largely automated, the differentiated skill is knowing what *good* looks like. An engineer with taste knows when an API feels wrong, when a UI is confusing, when a feature is solving the wrong problem. This is aesthetic and analytical — it's developed through making things and caring about them, not through grinding LeetCode. Side projects are proxies for taste. That's what Boris is actually screening for.

---

### Latent Demand: See What Users Are Already Doing

Boris applies the same generalist lens to product intuition. His best insight on this comes from his time at Meta.

> "If you hit the same problem two or three times, you should probably look around, see if other people are hitting that problem too."

He observed this most clearly with Facebook Marketplace: users were already trading goods inside Facebook Groups before the product existed. The insight wasn't inventing a new behavior — it was removing friction from one that already existed. Facebook Marketplace became one of Meta's major products.

**My Take:** This is the hardest thing for pure engineers to learn, and it's exactly what becomes more valuable as AI handles implementation. The question changes from "how do I build this?" to "what should exist that doesn't yet?" That question requires being close enough to users to see what they're struggling with — which requires the generalist skills Boris keeps coming back to.

---

### Imposter Syndrome Is Information

Boris is direct about his own self-doubt, and what he learned from it.

> "No one knows what they're doing at any level. If you don't feel it, you're not pushing hard enough."

He described experiencing imposter syndrome at Meta when directing engineers at the same level. His reflection: "misplaced imposter syndrome because levels don't matter at all."

**My Take:** This reframing matters in an AI world where the pace of change means nobody has fully-current expertise. The engineer who waits to feel confident before trying new things will perpetually lag behind. Boris treats discomfort as a sign that you're at the edge of your knowledge — exactly where growth happens.

---

### Practical Advice: What to Actually Do

Boris gives one piece of direct advice to engineers asking how to grow in an AI world:

> "The tip is just learn how to use Claude Code and learn how to run a bunch of Claude Codes to do stuff."

And from his career philosophy:

> "Better engineering is the easiest way to grow your network and gain influence as an engineer."

He also emphasizes an underleveling strategy when joining new roles: come in with lower expectations, create space for exploration, and build momentum before scope expands. It sounds counterintuitive, but it reflects his belief that titles don't produce impact — execution does.

**My Take:** Boris is describing a specific career archetype: the engineer who solves repeated problems, builds institutional tools that help the whole team, cultivates product and design intuition alongside technical skills, and treats curiosity as a professional obligation. That archetype is being *supercharged* by AI — not replaced by it.

---

## Key Takeaways

1. **Plan Mode is a discipline, not a feature** — iterate with Claude until the plan is right before writing a single line of code; this alone can double or triple success rate on complex tasks

2. **Verification loops are the biggest multiplier** — giving Claude a way to see the consequences of its own work (tests, browser, logs) produces 2–3x quality improvement

3. **CLAUDE.md is compounding infrastructure** — every mistake documented means it never recurs; teams that maintain this file build institutional memory no individual can replicate

4. **Slash commands convert prompts into operations** — store repetitive workflows in `.claude/commands/` and let subagents handle specialized roles

5. **Boring setups outperform clever ones** — vanilla defaults + disciplined practices beats elaborate customization without the underlying habits

6. **Joy is a real signal** — if you're spending time on tedious work, you're using the tool wrong; the goal is to keep the creative, judgment-heavy work for yourself

7. **The engineering title may change, but engineering judgment matters more** — someone still has to decide what to build, why, and for whom

8. **Escape the swim lane** — specialization was an artifact of scale; the most valuable engineers are generalists who code, do product, design, and talk to users

9. **Taste can't be delegated** — when code generation is automated, the differentiated skill is knowing what *good* looks like; taste is developed through side projects and curiosity, not syntax drills

10. **Find latent demand** — the best product ideas are behaviors users are already doing; your job is to remove friction from them, not invent new ones

---

## Notable Quotes

| Quote | Context |
|-------|---------|
| "A good plan is really important!" | On why Plan Mode changes outcomes |
| "Give Claude a way to verify its work... 2–3x the quality of the final result." | Single most important practice |
| "I have never had this much joy day to day in my work." | On what AI-assisted development actually feels like |
| "Engineering is changing and great engineers are more important than ever." | On AI's effect on the profession |
| "Writing code anchors you to reality. Without it, you lose intuition quickly." | On why engineers should stay close to code |
| "At big companies, you get forced into this particular swim lane. It's just so artificial." | On why big tech produces narrow engineers |
| "I love working with generalists." | On the engineer profile he hires for |
| "Software engineers are also going to be writing specs. They are going to be talking to users." | On the expanding role of engineers |
| "No one knows what they're doing at any level. If you don't feel it, you're not pushing hard enough." | On imposter syndrome and growth |
| "There is no one correct way to use Claude Code." | On the design philosophy of the tool |
| "100% for two+ months now, I don't even make small edits by hand." | On full AI code generation |

---

## Related Resources

- [Boris Cherny: X Thread on Workflow](https://x.com/bcherny/status/2007179832300581177) — original setup reveal
- [Boris Cherny: 12 Ways to Customize Claude Code](https://x.com/bcherny/status/2021699851499798911) — customization guide
- [Lenny's Newsletter: Head of Claude Code](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens) — extended interview
- [Developing.dev: Boris Cherny Career Story](https://www.developing.dev/p/boris-cherny-creator-of-claude-code) — career journey from Meta to Anthropic
- [Fortune: 100% AI-Written Code at Anthropic](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/) — numbers and context
- [Every.to Podcast: How to Use Claude Code Like the People Who Built It](https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it) — team practices
- [InfoQ: Claude Code Creator Workflow Deep Dive](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/) — technical details
- [Simon Willison on Boris Cherny Quote](https://simonwillison.net/2026/Feb/14/boris/) — "engineers are more important than ever" in full context
- [Final Round AI: Software Engineer Title Will Go Away](https://www.finalroundai.com/blog/software-engineer-title-go-away) — analysis of Boris's future-of-engineering predictions
- [DNYUZ: Boris Cherny Hires Engineers Who Do Side Quests](https://dnyuz.com/2025/12/17/the-creator-of-anthropics-claude-code-likes-to-hire-engineers-who-do-side-quests-like-making-kombucha/) — on the kombucha hiring philosophy

---

*Boris Cherny is the creator and Head of Claude Code at Anthropic. He joined from Meta, where he spent a decade building infrastructure, state management libraries, and TypeScript tooling.*
