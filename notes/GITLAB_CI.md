# GitLab CI/CD Configuration - VHS Horror Puzzle Collection

**Date**: 2026-04-01
**Status**: Working Locally
**Verified By**: QP (Pi, Opencode, Openclaw)

---

## ✅ Pipeline Status

| Stage | Job | Purpose | Status |
|--|--|--|--|
| **Lint** | lint_code | JavaScript syntax check | ✅ Working |
| **Test** | validate_project | Validate project structure | ✅ Working |
| **Security** | security_audit | Run npm audit | ✅ Working |

---

## 🔧 Pipeline Configuration (`.gitlab-ci.yml`)

### Stages:
1. **lint** - JavaScript syntax validation
2. **test** - Project structure validation
3. **security** - npm audit check

### Jobs:

#### lint_code:
```yaml
lint_code:
  stage: lint
  image: node:18
  script:
    - node --check js/*.js
    - node --check js/games/*.js
    - node --check js/systems/*.js
  only:
    - main
```

#### validate_project:
```yaml
validate_project:
  stage: test
  image: node:18
  script:
    - test -f index.html
    - test -f package.json
    - test -d js/
  only:
    - main
```

#### security_audit:
```yaml
security_audit:
  stage: security
  image: node:18
  script:
    - npm audit
  allow_failure: true
```

---

## 🤖 Active AI Agents (Verified)

### Current Team:
- **Pi** - Conversational, session management
- **Opencode** - Code generation, test creation
- **Openclaw** - Code verification, security checks

### Outdated References (REMOVE):
The following agents were referenced in old documentation:
- ❌ Amazon Q
- ❌ BlackBox
- ❌ GitLab Duo
- ❌ GitHub Copilot

**Update Required**: Replace all agent references with Pi + Opencode + Openclaw

---

## 🧪 Local Testing

### Run Locally:
```bash
cd /home/snak3/Documents/snak3wrights/clones/vhs-puzzles

# Lint
npm run lint

# Test
npm test

# Security
npm audit
```

### Manual Testing:
```bash
npm start
# Open index.html in browser
# Test each game
```

---

## 🔐 GitLab Setup (Optional for Local)

### GitLab Account Required For:
- ❌ Pushing to GitLab repos
- ❌ Remote CI/CD pipelines
- ❌ Merge request approvals

### Not Required For:
- ✅ Local development
- ✅ Local CI commands
- ✅ All npm operations

### GitLab Token Location:
```bash
# GitLab CI credentials (if using):
.env
.gitlab-token
```

### Security Note:
The `.gitlab-token` file is .gitignored for security.

---

## 🎯 CI/CD Best Practices

### Code Quality:
- ESLint passes before commit
- No eval() in code
- Security audit passes

### Branch Protection:
- `main` branch requires pipeline pass
- Merge requests must pass lint/test
- Openclaw must verify security

---

## 📝 Verification Checklist

Before any agent writes to `.memQ/` or piQ1/:

- [ ] Agent assignments corrected
- [ ] Outdated agents removed
- [ ] Implementation verified
- [ ] Tests passing
- [ ] No security issues
- [ ] Documentation accurate

---

## 🔧 Troubleshooting

### Pipeline Fails on "npm run lint:check":
**Fix**: Add proper script to package.json:
```json
"scripts": {
  "lint": "node --check js/",
  "lint:check": "node --check js/"
}
```

### ESLint Not Found:
**Fix**: Either install ESLint globally or use `node --check` syntax validation.

### Security Issues Found:
```bash
npm audit
# Expected: 0 vulnerabilities
npm audit fix
```

---

## 📞 Support

### For CI/CD Issues:
1. Check `.gitlab-ci.yml` syntax
2. Run locally with `gitlab-ci-local`
3. Openclaw for security checks
4. QP for verification

---

**Version**: 1.0 (Verified)
**Last Updated**: 2026-04-01
**Verified By**: QP (Pi + Opencode + Openclaw)
