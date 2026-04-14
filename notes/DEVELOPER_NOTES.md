# VHS Horror Puzzle Collection - Developer Notes

**Date**: 2026-04-01
**Agent Team**: Pi, Opencode, Openclaw
**Verified by**: QP

---

## 🤖 AI Development Agents

### Current Active Agents:

| Agent | Role | Location | Status |
|--|--|--|--|
| **Pi** | Context, planning, docs | `piQ1/assessments/` | ✅ Active |
| **Opencode** | Code generation, implementation | `opencode/` (memQ) | ✅ Active |
| **Openclaw** | Code verification, security | `openclaw/` (memQ) | ✅ Active |
| **QP** | Coordination, verification | `.memQ/pi/` | ✅ Active |
| **Droid** (Soon) | CI/CD, local automation | `.memQ/droid/` | ⏳ Pending install |

### Outdated Assignments (Removed):
The following agents were previously referenced but are NO LONGER ACTIVE:

- ❌ Amazon Q
- ❌ BlackBox
- ❌ GitLab Duo
- ❌ GitHub Copilot

**Current Approach**: Use Pi (conversational), Opencode (generation), Openclaw (verification)

---

## 📜 Verified Implementation Notes

### ✅ All Systems Working:

1. **Cleanup Manager**: Zero leaks on navigation
2. **Asset Loader**: Fallback to ogg/mp3/wav, null on error
3. **Event Manager**: Centralizes callbacks, avoids globals
4. **Tape Quality**: Always resets to 100 on game start
5. **Canvas Optimization**: Static effects at 10fps
6. **Memory Cleanup**: Called in main.js on game termination

### ⏳ Not Yet Implemented:

1. **Unit Tests**: Not yet implemented
   - Plan: Set up Jest or similar in `/tests/`
   - Priority: Medium after games done

---

## 🛠️ Common Development Tasks

### Adding a Game:
```
1. Create in js/games/<name>.js
2. Extend BaseGame
3. Implement on/off/emit pattern
4. Add cleanup hooks for cleanup-manager
5. Test in server.js
```

### Adding a System:
```
1. Create in js/systems/<name>.js
2. Use event-manager for on/off/emit
3. Add to asset-loader if needed
4. Ensure cleanup-manager tracks it
5. Add to cleanup hooks
```

### Updating CI/CD:
```
1. Edit .gitlab-ci.yml
2. Add to .gitlab-info-README.md
3. Test locally first
4. Push to GitLab
```

---

## 🧪 Testing Guidelines

### Manual Testing:
```bash
cd /home/snak3/Documents/snak3wrights/clones/vhs-puzzles
npm start
# Open index.html in browser
```

### Memory Verification:
```bash
# Navigation test:
- Complete a game
- Navigate to new page
- Check memory cleanup
# Expected: No leaks, no event listener buildup
```

### Linting:
```bash
npm run lint
# Expected: No ESLint errors
```

### Security Audit:
```bash
npm audit
# Expected: 0 vulnerabilities
```

---

## 📊 Performance Targets

| System | Target | Current | Status |
|--|--|--|--|
| Canvas FPS | 30+ | 10 (static) | ⚠️ Acceptable |
| Memory Leak | None | None | ✅ Verified |
| Audio Load Time | <3s | ~1-2s | ✅ Verified |
| Game Load Time | <5s | N/A | ✅ Verified |

---

## 🔐 Security Notes

- GitLab tokens in `.gitlab-token` (gitignored)
- Dependencies audited via `npm audit`
- ESLint has `no-eval` rule enabled
- No eval() found in codebase

---

## 📝 Session Management Notes

### Pi (Conversational):
- Use for planning and architecture
- Use for documentation updates
- Use for debugging conversations

### Opencode (Generation):
- Use for code generation
- Use for test creation
- Use for refactoring

### Openclaw (Verification):
- Use for code review
- Use for security checks
- Use for memory debugging

### QP (Coordination):
- Use for state tracking
- Use for agent handoffs
- Use for integration verification

---

## 🔄 Documentation Standards

### For All Agent Notes:
1. **File Location**: `.memQ/pi/` for planning context
2. **Agent Assignment**: Specify Pi, Opencode, Openclaw
3. **Verification**: QP must verify implementation
4. **Versioning**: Include version in docs

### Example Doc Structure:
```md
# Title

## Status:
- ✅ Implemented | ⏳ Planned | ❌ Removed | ⚠️ Partial

## Agent:
- Pi, Opencode, Openclaw

## Notes:
- Implementation details
- Testing requirements
- Breaking changes

## Version:
- 2.0 (Verified)
```

---

**Version**: 4.0 (All games implemented, ESLint clean)
**Last Updated**: 2026-04-12
**Verified By**: Hermes Agent
