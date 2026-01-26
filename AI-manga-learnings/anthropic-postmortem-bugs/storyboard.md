# Storyboard: A Postmortem of Three Recent Issues

**Art Style**: ligne-claire (clean lines, flat colors)
**Tone**: warm (nostalgic, approachable, human)
**Layout**: standard
**Aspect Ratio**: 3:4 (portrait)

---

## Cover Page

**Title**: "A Postmortem of Three Recent Issues"
**Subtitle**: "How Anthropic Hunted Down Three Invisible Bugs"

**Visual Concept**:
- Central: Three engineers with magnifying glasses, looking determined yet warm
- Background: Stylized server infrastructure with TPU/GPU icons
- Three small bug creatures hiding among the servers (foreshadowing)
- Claude logo integrated subtly
- Warm golden lighting suggesting transparency and hope

**Mood**: Professional yet approachable, warm colors, inviting

---

## Page 1: The Scale of Claude

**Title**: "Serving Claude to the World"

### Panel 1 (Top, wide)
**Scene**: Bird's eye view of global infrastructure
**Content**: Map showing Claude serving millions across the globe
**Text Box**: "Claude serves millions of users via API, Amazon Bedrock, and Google Cloud's Vertex AI."

### Panel 2 (Middle left)
**Scene**: Close-up of three hardware platforms
**Content**: Stylized TPU, GPU, and Trainium chips as characters
**Text Box**: "Deployed across AWS Trainium, NVIDIA GPUs, and Google TPUs."

### Panel 3 (Middle right)
**Scene**: Engineer at a holographic dashboard
**Content**: Sarah (lead engineer) monitoring quality metrics
**Dialogue**: "Each platform needs specific optimizations... but users should never notice the difference."

### Panel 4 (Bottom)
**Scene**: Users happily using Claude on various devices
**Content**: Diverse users with warm expressions
**Text Box**: "Our aim: same quality responses, regardless of which platform serves the request."

---

## Page 2: The First Signs

**Title**: "Something's Wrong"

### Panel 1 (Top, wide)
**Scene**: Calendar showing August 2025
**Content**: Date highlighted, ominous shadow creeping in
**Text Box**: "August 2025. The reports started as whispers..."

### Panel 2 (Middle left)
**Scene**: User looking confused at screen
**Content**: User seeing unexpected characters "สวัสดี" in response
**Dialogue**: "Wait... did Claude just reply in Thai? I asked in English..."

### Panel 3 (Middle right)
**Scene**: Another user with code error
**Content**: Programmer seeing syntax errors in generated code
**Dialogue**: "These syntax errors don't make sense. Claude never does this."

### Panel 4 (Bottom left)
**Scene**: Forum posts multiplying
**Content**: Social media showing increasing reports
**Text Box**: "By late August, complaints were impossible to ignore."

### Panel 5 (Bottom right)
**Scene**: Sarah's expression turning serious
**Content**: Engineer looking at spike in reports
**Dialogue**: "We need to investigate. Now."

---

## Page 3: The Three Bugs Revealed

**Title**: "Uncovering the Trio"

### Panel 1 (Top, dramatic)
**Scene**: Three bug creatures emerging from shadows
**Content**: Visual representation of three distinct bugs
**Text Box**: "Investigation revealed not one, but THREE overlapping bugs."

### Panel 2 (Left, tall)
**Scene**: Bug #1 - The Router Bug
**Content**: A confused-looking bug redirecting traffic arrows
**Label**: "BUG 1: Context Window Routing Error"
**Caption**: "Short requests sent to 1M token servers. Initially 0.8%, peaked at 16%."

### Panel 3 (Center, tall)
**Scene**: Bug #2 - The Corruptor Bug
**Content**: A glitchy bug causing characters to scramble
**Label**: "BUG 2: Output Corruption"
**Caption**: "Token generation errors. Wrong characters appearing mid-response."

### Panel 4 (Right, tall)
**Scene**: Bug #3 - The Precision Bug
**Content**: A mathematical bug with misaligned gears (bf16/fp32)
**Label**: "BUG 3: XLA:TPU Miscompilation"
**Caption**: "Precision mismatch in top-k sampling. The most elusive of all."

---

## Page 4: The Timeline

**Title**: "A Perfect Storm"

### Panel 1 (Top)
**Scene**: Timeline visualization
**Content**: Calendar with events marked
**Text Box**: "The bugs overlapped, creating a perfect storm of confusion."

### Panel 2 (Middle, wide)
**Scene**: Timeline infographic style
**Content**: 
- Aug 5: Bug 1 introduced (small impact)
- Aug 25-26: Bugs 2 & 3 deployed
- Aug 29: Load balancing change amplifies issues
**Visual**: Growing waves of impact

### Panel 3 (Bottom left)
**Scene**: Users experiencing different issues
**Content**: Some users happy, others frustrated
**Text Box**: "Some users saw normal performance while others experienced severe degradation."

### Panel 4 (Bottom right)
**Scene**: Engineers puzzled
**Content**: Team looking at contradictory reports
**Dialogue**: "The reports don't match. It's like we're chasing ghosts..."

---

## Page 5: The Deep Dive - Precision Bug

**Title**: "Inside the Machine"

### Panel 1 (Top, wide)
**Scene**: Visual of Claude thinking
**Content**: Neural network visualization with probability distributions
**Text Box**: "When Claude generates text, it calculates probabilities for each possible next word."

### Panel 2 (Middle left)
**Scene**: Top-p sampling visualization
**Content**: Bell curve with threshold marker at 0.99
**Text Box**: "We use 'top-p sampling' - only considering words above a probability threshold."

### Panel 3 (Middle right)
**Scene**: Two gears labeled bf16 and fp32
**Content**: Gears slightly misaligned, teeth not matching
**Text Box**: "The problem: mixed precision arithmetic. bf16 and fp32 didn't agree."

### Panel 4 (Bottom, dramatic)
**Scene**: Highest probability token disappearing
**Content**: The "best" token falling through a gap
**Text Box**: "The precision mismatch caused the HIGHEST probability token to sometimes vanish entirely."
**Dialogue (engineer)**: "We thought we fixed this in December... but we only masked it."

---

## Page 6: The Frustrating Hunt

**Title**: "Chasing Shadows"

### Panel 1 (Top)
**Scene**: Sarah running tests
**Content**: Same test showing different results
**Text Box**: "The bug's behavior was frustratingly inconsistent."

### Panel 2 (Middle left)
**Scene**: Test result: PASS
**Content**: Green check mark
**Caption**: "Same prompt. Works perfectly."

### Panel 3 (Middle right)
**Scene**: Test result: FAIL
**Content**: Red X mark
**Caption**: "Same prompt. Fails completely."

### Panel 4 (Bottom left)
**Scene**: Debug tools being activated
**Content**: Engineer turning on debugging
**Text Box**: "It changed depending on what operations ran before, after, and whether debugging was enabled."

### Panel 5 (Bottom right)
**Scene**: Engineers exhausted but determined
**Content**: Team working late, warm lamp light
**Dialogue**: "Model quality is non-negotiable. We need the exact fix."

---

## Page 7: The Resolution

**Title**: "Fighting Back"

### Panel 1 (Top)
**Scene**: Engineer deploying fix
**Content**: Code being pushed with green indicators
**Text Box**: "September 2-18, 2025. The fixes rolled out."

### Panel 2 (Middle left)
**Scene**: Bug 1 being contained
**Content**: Router bug trapped, correct routing restored
**Caption**: "Routing fix: Correct server pools restored."

### Panel 3 (Middle center)
**Scene**: Bug 2 being rolled back
**Content**: Corruption bug eliminated
**Caption**: "Token corruption: Rolled back, detection tests added."

### Panel 4 (Middle right)
**Scene**: Bug 3 - switching to exact top-k
**Content**: Precision bug replaced with exact calculation
**Caption**: "XLA bug: Switched from approximate to exact top-k."

### Panel 5 (Bottom, wide)
**Scene**: All three bugs defeated
**Content**: Three bug creatures fading away
**Text Box**: "We accepted the minor efficiency impact. Model quality is worth it."

---

## Page 8: Lessons Learned

**Title**: "What We're Changing"

### Panel 1 (Top, wide)
**Scene**: Team meeting with holographic displays
**Content**: Engineers presenting new monitoring systems
**Text Box**: "These incidents taught us important lessons."

### Panel 2 (Middle left)
**Scene**: Evaluation dashboard
**Content**: More sensitive evaluation metrics
**Label**: "More Sensitive Evaluations"
**Caption**: "Better tools to differentiate working from broken."

### Panel 3 (Middle center)
**Scene**: Continuous monitoring visualization
**Content**: Live production monitoring
**Label**: "Continuous Quality Checks"
**Caption**: "Running evaluations on true production systems."

### Panel 4 (Middle right)
**Scene**: User feedback channel
**Content**: Bug report flowing to engineering
**Label**: "Faster Debugging"
**Caption**: "Better tools to process community feedback."

### Panel 5 (Bottom, wide)
**Scene**: Sarah addressing readers directly
**Content**: Warm, sincere expression
**Dialogue**: "We remain grateful to our community for their patience and contributions."
**Text Box**: "Transparency builds trust. Even when sharing our failures."

---

## Page 9: The Commitment

**Title**: "Moving Forward"

### Panel 1 (Top, dramatic)
**Scene**: Claude and the engineering team together
**Content**: Anthropomorphized Claude with protective engineers
**Text Box**: "To state it plainly: We never reduce model quality due to demand, time of day, or server load."

### Panel 2 (Middle, wide)
**Scene**: Infrastructure running smoothly
**Content**: All platforms in harmony, bugs gone
**Text Box**: "The problems our users reported were due to infrastructure bugs alone."

### Panel 3 (Bottom left)
**Scene**: User sending feedback
**Content**: User clicking thumbs down button
**Text Box**: "Use /bug in Claude Code or thumbs down in Claude apps to report issues."

### Panel 4 (Bottom right)
**Scene**: Sunrise over infrastructure
**Content**: New day, improved systems
**Text Box**: "We maintain an extremely high bar for quality. We'll keep climbing higher."

**End Note**: "Article by Sam McAllister, Anthropic - September 17, 2025"

---

## Visual Style Notes

### Color Palette (ligne-claire + warm)
- **Primary**: Warm blue #4A90A4
- **Secondary**: Soft orange #E8985E
- **Accent**: Golden yellow #D69E2E
- **Background**: Cream #FFF8F0
- **Text**: Warm charcoal #3D3D3D

### Character Design
- Clean, uniform outlines (2px)
- Flat colors, no gradients
- Expressive faces with warm emotions
- Professional but approachable attire
- 6-7 head height proportions

### Bug Creature Design
- Each bug has distinct visual identity
- Bug 1 (Router): Blue, tentacle arrows
- Bug 2 (Corruption): Glitchy, pixel-like
- Bug 3 (Precision): Mathematical, gear-shaped

### Panel Borders
- Clean black borders
- Consistent gutter spacing
- Occasional full-bleed for dramatic moments
