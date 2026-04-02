# VHS Horror Puzzle Collection - Contribution Guidelines

**Version**: 1.0
**Verified by**: QP

---

## 🤖 Active Development Team

### Current Agents (Verified & Active):
- **Pi (You)** - Conversational coordination, session planning
- **Opencode** - Code generation, test creation
- **Openclaw** - Code verification, security audit

### Previously Listed (NOT ACTIVE):
- ❌ Amazon Q
- ❌ BlackBox
- ❌ GitLab Duo
- ❌ GitHub Copilot

**Update Required**: Replace outdated agent references with Pi + Opencode + Openclaw

---

## 📜 Code Standards (ESLint)

**Configuration**: `eslint.config.js`

### Rules Enforced:
- ✅ `prefer-const`: Use const/let instead of var
- ✅ `no-var`: Avoid var
- ✅ `no-console`: No console logs in production (test: ok)
- ✅ `curly`: Use curly braces
- ✅ `eqeqeq`: Use ===/!==
- ✅ `no-eval`: Prohibited (security)

### Code Style:
- Indentation: 2 spaces
- Semicolons: Yes
- Quotes: Double quotes for strings
- Imports: Top of file, sorted

### Example:
```javascript
const assetLoader = {
  load(url) {
    return fetch(url).then(res => res.blob());
  },
};
```

---

## 🧪 Testing Guidelines

### Unit Test Structure:
```javascript
// tests/cleanup-manager.test.js
import { cleanupManager } from '../js/systems/cleanup-manager';

describe('Cleanup Manager', () => {
  afterEach(() => cleanupManager.cleanupAll());

  test('cleanupAll clears timers', () => {
    // test code
  });
});
```

### Jest Setup (TODO):
```bash
# Create after Opencode generates tests
mkdir -p tests/
# Generate with Opencode
```

### Test Coverage Target: 80%

---

## 🎮 Adding a New Game

### Requirements:
1. Extend `BaseGame` from `js/games/base-game.js`
2. Use `EventManager` for events
3. Register cleanup in `main.js`
4. Implement core logic
5. Test manually and via CI

### Example (Connections):
```javascript
// js/games/connections.js
import BaseGame from './base-game';

export default class ConnectionsGame extends BaseGame {
  init() {
    this.setupConnections();
  }
}
```

---

## 🏗️ Adding a New System

### Requirements:
1. Create in `js/systems/<name>.js`
2. Register with EventManager (optional)
3. Include cleanup in `cleanup-manag er.js`
4. Add to `asset-loader` if needed (images/audio)

### Example:
```javascript
// js/systems/new-system.js
export default {
  init() { /* setup */ },
  update() { /* logic */ },
  cleanup() { /* cleanup */ }
};
```

---

## 🔐 Security Considerations

### Security Scanning:
```bash
npm audit
# Review output
npm audit fix
```

### Security Rules:
- ❌ No eval()
- ❌ No inline scripts
- ❌ No eval() in any context
- ✅ Validate user input
- ✅ CORS headers

---

## 🔧 GitLab CI/CD Contribution

### Pipeline Location: `.gitlab-ci.yml`

### Adding a Stage:
```yaml
new_stage:
  stage: new
  image: node:18
  script:
    - npm run lint
```

### Security Audit Stage:
```yaml
security_audit:
  stage: security
  image: node:18
  script:
    - npm audit
  allow_failure: true
```

---

## 📝 Documentation Standards

### Required Fields:
- **Version**: Include version number
- **Verified By**: Agent name (QP)
- **Date**: YYYY-MM-DD
- **Status**: Implemented/Planned/Completed/Removed

### Format:
```md
# Title

**Version**: X.X
**Verified By**: QP
**Date**: 2026-04-01
```

---

## 📋 Checklist Before PR

- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (if applicable)
- [ ] No security issues (`npm audit`)
- [ ] Documentation updated
- [ ] Agent assignments corrected
- [ ] Codebase verification complete
- [ ] `.memQ/` entries updated

---

## 🤝 Code Review Process

1. **Pi**: Reviews architecture and approach
2. **Opencode**: Reviews implementation details
3. **Openclaw**: Verifies correctness
4. **QP**: Verifies documentation, agent assignments
5. **Merge**: After pass

---

## 🚀 Next Steps for Contributors

1. Create Letter Boxed implementation
2. Complete Strands game logic
3. Write unit tests
4. Fix CI/CD issues
5. Update documentation

---

**See Also**:
- `PROJECT_STATUS.md`
- `DEVELOPER_NOTES.md`
- `.gitlab-info-README.md`
- `.memQ/` directory

