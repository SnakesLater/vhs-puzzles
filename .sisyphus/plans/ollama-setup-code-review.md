# Plan: Ollama Model Setup + Code Review

## Phase 1: Model Setup (Immediate)

### Tasks
- [ ] Pull new models: glm-4.7-flash, qwen3-coder:14b, glm-4.9
- [ ] Update oh-my-openagent.json with dual-mode config
- [ ] Verify all models load correctly
- [ ] Restart OpenCode and confirm agents work

### Files
- `~/projects/vhs-puzzles/setup-ollama-models.sh`

### Verification
```bash
ollama list  # Should show 5 models
opencode --version  # Should work
```

---

## Phase 2: Code Review (After Setup)

### Tasks
- [ ] Review game implementations (Connections, Wordle, Strands, Letter Boxed)
- [ ] Review shared systems (CleanupManager, EventManager, etc.)
- [ ] Review VHS aesthetic implementation
- [ ] Document TODO items and blockers
- [ ] Create CODE_REVIEW.md with findings

### Focus Areas
1. **Strands.js** - Document all TODOs, assess completeness
2. **Letter Boxed** - Determine what needs to be built
3. **Memory management** - Verify cleanup patterns
4. **VHS effects** - Check consistency

### Files to Create
- `~/projects/vhs-puzzles/CODE_REVIEW_<date>.md`

### Verification
- [ ] Report with prioritized findings
- [ ] Clear next steps identified

---

## Phase 3: Letter Boxed Implementation (Next Sprint)

### Tasks
- [ ] Design Letter Boxed architecture
- [ ] Create js/games/letterboxed.js
- [ ] Implement word validation
- [ ] Integrate with BaseGame
- [ ] Add VHS styling
- [ ] Test manually

### Priority: HIGH

---

## Dependencies
- Phase 2 depends on Phase 1 completing
- Phase 3 depends on Phase 2 findings

## Notes
- Using dual-mode model strategy: multi-agent (fast) vs deep work (quality)
- Budget-conscious: local models only, no API costs
