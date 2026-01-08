# File Over App: A Deep Analysis of Digital Longevity

> **TL;DR**: Steph Ango's "File Over App" philosophy argues that the files you create are more important than the tools you use to create them. Apps are ephemeral; files can last forever. Choose open formats, store locally, and own your data.

---

## About This Analysis

This analysis applies a structured framework to examine **Steph Ango's (kepano) "File Over App" philosophy** — a manifesto for digital longevity that has become foundational to the local-first software movement.

**Source**: [kepano on X](https://x.com/kepano) and [stephango.com/file-over-app](https://stephango.com/file-over-app)

---

## I. Core Content (What)

### The Central Thesis

> "The files you create are more important than the tools you use to create them."

This deceptively simple statement contains a profound insight: **software is ephemeral, but data can be permanent** — if stored in the right formats.

### Key Concepts Defined

| Concept | Definition |
|---------|------------|
| **File Over App** | Prioritize durable file formats over application-dependent storage |
| **Digital Longevity** | Files from 2060 should be readable on computers from 1960 |
| **Data Ownership** | Users fully own their data, not the app vendor |
| **Plain Text Primacy** | .txt/.md files are the most durable digital format |
| **Local-First** | Data stored locally is primary; cloud is supplementary |

### Structure of the Argument

1. **Historical precedent**: Ideas carved on clay tablets and paper outlasted their tools
2. **Modern problem**: Cloud apps lock data behind logins, proprietary formats, and internet dependency
3. **The durability test**: "If you want your writing readable in 2160, it must be readable on a computer from 1960"
4. **Solution**: Use open formats (Markdown, plain text, JPEG, PDF)
5. **Call to action**: Tool makers should grant users genuine data ownership

### Evidence Provided

- **Egyptian hieroglyphs**: The carved ideas outlasted the specific chisels used
- **Dropbox Paper**: Stores URLs instead of actual content — a cautionary tale
- **Plain text from 1985**: Still perfectly readable on any modern computer
- **Obsidian's approach**: Markdown files in a local folder you own

---

## II. Background Context (Why)

### Who is Steph Ango (kepano)?

| Attribute | Detail |
|-----------|--------|
| Current Role | CEO of Obsidian (since February 2023) |
| Previous Work | Co-founded Lumi and Inkodye |
| Path to CEO | Started as a "superfan" power user |
| Personal Practice | Publishes plain text files via Jekyll/Netlify |

### Historical Context

The "File Over App" essay emerged during a perfect storm:

- **Cloud SaaS dominance**: Google Docs, Notion, and similar apps became ubiquitous
- **The Google Graveyard**: Increasing awareness of service shutdowns (Google Reader, etc.)
- **Privacy concerns**: High-profile data breaches at centralized services
- **Local-first movement**: Ink & Switch's seminal 2019 essay laid theoretical groundwork

### The Intent Behind the Philosophy

| Element | Description |
|---------|-------------|
| **Problem addressed** | Vendor lock-in, service discontinuation, data loss |
| **Target audience** | Knowledge workers, developers, tool makers |
| **Ultimate goal** | Shift industry norms toward user data ownership |

### Unstated Assumptions

1. Users will prefer control over convenience features
2. Open formats are sufficient for most use cases
3. People value long-term preservation over short-term features
4. The market will eventually reward ethical data practices

---

## III. Critical Scrutiny

### Counterarguments and Responses

| Objection | Ango's Position |
|-----------|-----------------|
| "Collaboration needs servers" | Local-first CRDTs enable real-time collaboration without central authority |
| "Plain text limits functionality" | Markdown + plugins can replicate most rich features |
| "Users don't care about this" | Growing market for privacy-focused tools suggests otherwise |
| "Sync is too hard without cloud" | Obsidian Sync, Syncthing, iCloud prove it's possible |

### Potential Weaknesses

1. **Survivorship bias**: Focuses on formats that survived; doesn't analyze successful proprietary formats
2. **Technical barrier**: Managing local files requires more user sophistication than cloud apps
3. **Network effects**: Cloud apps benefit from collaborative features that File Over App de-emphasizes
4. **Enterprise gaps**: Doesn't address compliance, audit trails, or access control needs

### Boundary Conditions

**Philosophy works well for:**
- Personal knowledge management
- Note-taking and journaling
- Static documents (writing, research)
- Individual archival needs

**Philosophy struggles with:**
- Real-time multiplayer applications
- Complex structured data (spreadsheets, databases)
- Enterprise workflows requiring granular access control
- Users who prioritize convenience over ownership

### What's Missing

- No discussion of Git integration for version control
- Limited treatment of end-to-end encryption
- Ignores mobile-first users who prefer cloud simplicity
- Doesn't address how enterprises could adopt this approach

---

## IV. Value Extraction

### Reusable Frameworks

#### 1. The Durability Test
Ask: "Can this file be read in 100 years without any special software?"

#### 2. Ownership Checklist
Before choosing a tool, verify:
- [ ] Can I access my data without internet?
- [ ] Can I export in a standard, open format?
- [ ] Will my data survive if the company shuts down?
- [ ] Do I have full control over my files?

#### 3. Tool Selection Hierarchy
Prioritize in this order:
1. **Open formats** (Markdown, plain text, PDF)
2. **Features** (what you actually need)
3. **Convenience** (nice-to-have UX)

### Role-Specific Takeaways

| Role | Key Lesson |
|------|------------|
| **Developer** | Build export-first; support open standards from day one |
| **Knowledge Worker** | Use Markdown for notes; avoid proprietary lock-in |
| **Enterprise Architect** | Evaluate SaaS vendors on data portability |
| **Digital Archivist** | Plain text + PDF for guaranteed long-term preservation |
| **Startup Founder** | Consider "File Over App" as a competitive differentiator |

### Mindset Shifts

| From | To |
|------|-----|
| "App features matter most" | "File durability matters most" |
| "Trust the cloud provider" | "Own your own data" |
| "Convenience now" | "Accessibility forever" |
| "Lock-in is inevitable" | "Portability is achievable" |
| "Apps define my workflow" | "Files outlive any app" |

---

## V. The 7 Local-First Ideals

The Ink & Switch research lab defined seven ideals that complement File Over App:

| # | Ideal | Description |
|---|-------|-------------|
| 1 | **No Spinners** | Instant response; no waiting for servers |
| 2 | **Multi-Device** | Sync across all your devices seamlessly |
| 3 | **Optional Network** | Full functionality offline |
| 4 | **Seamless Collaboration** | Real-time editing without central servers |
| 5 | **The Long Now** | Data accessible indefinitely |
| 6 | **Security & Privacy** | End-to-end encryption possible |
| 7 | **Ownership & Control** | Users have full agency |

---

## VI. Practical Implementation

### Durable File Formats

| Format | Longevity | Best For |
|--------|-----------|----------|
| `.txt` | Centuries | Universal notes, logs |
| `.md` | Decades+ | Structured notes, documentation |
| `.pdf` | Decades+ | Final documents, archival |
| `.jpg` | Decades+ | Photos, images |
| `.html` | Decades+ | Web content |

### Tools That Embrace This Philosophy

| Tool | Format | Notes |
|------|--------|-------|
| **Obsidian** | Markdown | Local-first, plugin ecosystem |
| **Logseq** | Markdown/Org | Open-source outliner |
| **iA Writer** | Markdown | Focused writing |
| **Zettlr** | Markdown | Academic writing |
| **SilverBullet** | Markdown | Open-source PKM |
| **Emacs + Org Mode** | Plain text | Ultimate flexibility |

### Migration Strategy

1. **Audit current tools**: What formats do they use? Can you export?
2. **Export everything**: Get your data out of locked systems
3. **Convert to open formats**: Markdown for text, PDF for finalized docs
4. **Establish local storage**: A folder structure you control
5. **Add sync as needed**: Obsidian Sync, iCloud, Syncthing
6. **Build new habits**: Create in open formats from the start

---

## VII. Conclusion

### The Core Message

Steph Ango's "File Over App" philosophy is a call to reclaim ownership of our digital lives. In an era of cloud dependency and service shutdowns, it offers a path to true data sovereignty.

### Key Takeaways

| Principle | Action |
|-----------|--------|
| **Files over apps** | Choose tools that respect open formats |
| **Local over cloud** | Store data on your device first |
| **Open over proprietary** | Prefer Markdown, plain text, PDF |
| **Ownership over convenience** | Accept some friction for true control |
| **Longevity over features** | Think in decades, not product cycles |

### The Ultimate Test

> "If you want your writing to still be readable on a computer from the 2060s or 2160s, it's important that your notes can be read on a computer from the 1960s."

Plain text passes this test. Does your current tool?

---

## Sources

### Primary Sources
- [File Over App - Steph Ango](https://stephango.com/file-over-app)
- [kepano on X (Twitter)](https://x.com/kepano)
- [Local-First Software - Ink & Switch](https://www.inkandswitch.com/essay/local-first/)

### Community Analysis
- [File Over App: The Philosophical Case](https://alessandrofarace.com/essay/file-over-app-philosophical-case)
- [Understanding 'File over App' Philosophy](https://myownsys.com/2024/11/03/understanding-file-over-app-philosophy/)
- [Obsidian CEO: Privacy, Plugins Power Note-Taking Over AI Hype](https://www.webpronews.com/obsidian-ceo-privacy-plugins-power-note-taking-over-ai-hype/)

### Discussions
- [Hacker News Discussion](https://news.ycombinator.com/item?id=42136054)
- [Indie Hackers Discussion](https://www.indiehackers.com/post/file-over-app-a-philosophy-for-digital-longevity-32fyepowtrOTKHUJIe5R)

---

## Appendix: Diagrams

Visual learning resources included:
- `file_over_app_philosophy.pdf` - Comprehensive knowledge infographic
- `cloud_vs_local_first.pdf` - Cloud vs Local-First comparison chart
