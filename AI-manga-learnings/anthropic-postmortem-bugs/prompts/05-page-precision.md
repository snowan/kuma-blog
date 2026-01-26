# Page 5: The Deep Dive - Precision Bug

**File**: 05-page-precision.png
**Aspect Ratio**: 3:4 (portrait)

## Image Prompt

Create a manga page in ligne-claire style with warm tones. 4-panel layout explaining the precision bug technically but accessibly.

**PAGE TITLE**: "Inside the Machine"

**PANEL 1 (Top, wide - 30% height)**:
Beautiful visualization of Claude "thinking". A gentle orange-glowing Claude figure in the center. Around Claude, flowing streams of words with probability numbers attached. High probability words are brighter, low probability words fade. Neural network patterns in background. Text box: "When Claude generates text, it calculates probabilities for each possible next word."

**PANEL 2 (Middle left - 25% height, 50% width)**:
Educational diagram: A bell curve/probability distribution. A threshold line at 0.99 marked clearly. Words above the line are highlighted (selected), words below are dimmed. Arrow pointing to threshold with label "top-p threshold". Text box: "We use 'top-p sampling' - only considering words above a probability threshold."

**PANEL 3 (Middle right - 25% height, 50% width)**:
Visual metaphor: Two gears of different sizes trying to mesh. One labeled "bf16" (16-bit), one labeled "fp32" (32-bit). The teeth don't quite align, causing grinding/sparks. Small numbers (precision values) falling between the gaps. Text box: "The problem: mixed precision arithmetic. bf16 and fp32 didn't agree."

**PANEL 4 (Bottom, dramatic - 45% height)**:
Dramatic visualization: A bright, golden token labeled "BEST CHOICE" (highest probability) falling through a gap between the two misaligned gears. Other less optimal tokens watching from above. The Decimal bug creature visible in the machinery, looking accidentally guilty. Priya in foreground, pointing at the scene with realization. Text box: "The precision mismatch caused the HIGHEST probability token to sometimes vanish entirely." Speech bubble (Priya): "We thought we fixed this in December... but we only masked it."

**Color Palette**:
- Background: Cream #FFF8F0
- Claude glow: Soft orange #E8985E
- Probability highlights: Golden #D69E2E
- Gear colors: Metallic blue-gray for bf16, warmer gray for fp32
- Error/gap: Soft red #E8685E

**Style**: Ligne-claire, educational visualization, technical concepts made visual and accessible, warm and inviting despite complexity
