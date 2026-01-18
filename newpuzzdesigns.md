# VHS Horror Puzzle Designs

## Design Philosophy
- **Atmosphere over mechanics** - Horror vibes must enhance, not distract from gameplay
- **Player agency** - Every puzzle requires skill/timing, not just luck
- **Progressive difficulty** - Mechanics evolve and compound
- **VHS authenticity** - Static, interference, analog artifacts

---

## Puzzle Ideas

### 1. Signal Static ⚡
**Status:** Implemented (needs gameplay fixes)
**Core:** Tune radio frequencies to find hidden emergency messages
**Problems:** Too passive, RNG-dependent, no skill expression
**Fixes Needed:**
- Active static manipulation (tap to clear interference)
- Timing-based tuning (hold steady for signal lock)
- Player tools (antenna adjustment, signal boost)
- Risk/reward (fast tuning = interference, slow = time pressure)

### 2. Tape Rewind Puzzle 📼
**Concept:** VHS tape is corrupted, player must manually rewind/fast-forward to specific timestamps to reveal story fragments
**Mechanics:**
- Drag timeline scrubber to navigate tape
- Audio/visual distortion increases with speed
- Must find exact moments where signal is clear
- Fragments form larger message when assembled
**Skill Element:** Precise timing, pattern recognition

### 3. Channel Surfing Horror 📺
**Concept:** Flip through TV channels, each showing different horror scenarios. Must identify which channels are "real" vs "fake"
**Mechanics:**
- 50+ channels with random content
- 5-7 channels contain actual story clues
- Fake channels have subtle "tells" (wrong era, impossible scenarios)
- Time pressure - channels change content over time
**Skill Element:** Pattern recognition, memory, deduction

### 4. Tracking Adjustment 🎛️
**Concept:** VHS tracking is off, player must manually adjust horizontal/vertical hold to reveal hidden images
**Mechanics:**
- Two sliders control H/V tracking
- Image slowly emerges as tracking improves
- Multiple "sweet spots" reveal different layers
- Static interference creates false positives
**Skill Element:** Fine motor control, patience, visual acuity

### 5. Analog Glitch Repair 💾
**Concept:** Digital corruption in analog format - player fixes "impossible" glitches
**Mechanics:**
- Drag corrupted pixels back to correct positions
- Some glitches are red herrings (meant to be there)
- Fixing wrong glitches creates new problems
- Final image reveals crucial story element
**Skill Element:** Problem-solving, visual logic

### 6. Frequency Interference 📻
**Concept:** Multiple radio signals bleeding through, player must isolate specific conversations
**Mechanics:**
- 3-4 overlapping audio streams
- Adjust frequency, volume, and filter controls
- Must isolate specific dialogue without losing it
- Background static hides jump scares
**Skill Element:** Audio processing, multitasking

### 7. Tape Speed Manipulation ⏩
**Concept:** Audio recorded at wrong speeds, player must find correct playback rate
**Mechanics:**
- Speed slider affects pitch and comprehension
- Some messages only clear at specific speeds
- Multiple layers of audio at different speeds
- Time limit before tape degrades
**Skill Element:** Audio recognition, experimentation

### 8. Static Corruption Duel ⚔️
**Concept:** Boss battle - Player sets defensive word, boss generates attack word, wrong guesses corrupt opponent's word with static
**Mechanics:**
- Player enters 5-letter defensive word
- Boss generates hidden 5-letter word
- Alternating guesses
- Wrong guesses add static blocks (█) to opponent's word
- First to decode through interference wins
**Skill Element:** Strategic guessing, word knowledge, risk assessment
**Visual:** `YOUR WORD: H█U█T` vs `BOSS WORD: █E█AY`

### 9. Boss Battle Variants 🎮
**Original Concept:** Pong-Wordle hybrid - Player sets defensive word, boss sets word, pong minigame determines who gets to guess

**Alternative Concepts:**
- **Turn-Based Duel:** Pure text battle, boss guesses your word while you guess theirs, first to solve wins
- **Simultaneous Countdown:** 30s timer, both guess simultaneously, fastest solver wins
- **Shared Letter Pool:** Limited letters (H A U N T D E C A Y), strategic choices about which letters to take for word building

**All variants maintain:** VHS theme, minimal UI, skill-based gameplay, psychological tension

---

## Rejected Ideas
- **Pure RNG mechanics** - No skill expression
- **Waiting games** - Passive, boring
- **Pixel hunting** - Frustrating, not fun
- **Complex UI** - Breaks VHS immersion

---

## Implementation Notes
- All puzzles must have clear win conditions
- Maximum 3-minute time limits
- Progressive hint system for accessibility
- Consistent VHS aesthetic across all puzzles
- Audio cues for visually impaired players

---

## Next Steps
1. Fix Signal Static gameplay issues
2. Prototype Tape Rewind puzzle
3. Test player agency improvements
4. Implement difficulty scaling