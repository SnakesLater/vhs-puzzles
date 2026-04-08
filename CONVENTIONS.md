# CONVENTIONS.md - Code Style & Conventions

**Project:** [name]
**Enforced by:** ESLint, Prettier, TypeScript

---

## General Guidelines

- Use meaningful, descriptive names
- Keep functions small and focused (single responsibility)
- Prefer composition over inheritance
- Write comments for *why*, not *what*
- No commented-out code

---

## TypeScript

### Types
- Always use explicit types for function parameters and return values
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for object shapes
- Use type aliases for unions and intersections

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> { /* ... */ }

// Avoid
function getUser(id: any): any { /* ... */ }
```

### Naming
- Types: `PascalCase`
- Interfaces: `PascalCase` (no I prefix)
- Variables/functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Private class members: `_camelCase`

---

## React/Component Conventions

### File Structure
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.css
│   └── index.ts
└── index.ts (barrel export)
```

### Component Structure
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

---

## CSS Conventions

### Class Naming
- Use BEM for component styles
- Prefix with component name

```css
.button { }
.button__icon { }
.button--primary { }
.button--secondary { }
```

### CSS Variables
```css
:root {
  --color-primary: #000;
  --space-sm: 0.5rem;
  --space-md: 1rem;
}
```

---

## Git Conventions

### Branch Names
```
feature/short-description
bugfix/short-description
hotfix/critical-issue
refactor/improve-area
```

### Commit Messages
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code change (no feature/fix)
- docs: Documentation only
- test: Tests only
- chore: Maintenance
```

### Pull Requests
- Small, focused PRs (< 400 lines ideal)
- Link to issue
- Include screenshots for UI changes

---

## Testing Conventions

### File Naming
```
Component.test.tsx
service.test.ts
utils.test.ts
```

### Test Structure
```typescript
describe('FeatureName', () => {
  describe('functionName', () => {
    it('should do X when Y', () => { /* ... */ });
    it('should throw when Z', () => { /* ... */ });
  });
});
```

---

## File Organization

```
src/
├── components/      # Reusable UI components
├── features/       # Feature-specific modules
├── hooks/          # Custom React hooks
├── services/       # API calls, business logic
├── stores/         # State management
├── types/          # TypeScript types/interfaces
├── utils/          # Pure utility functions
├── constants/      # App constants
└── styles/         # Global styles, variables
```

---

## Code Review Requirements

Before merging, ensure:
- [ ] No `console.log` statements
- [ ] No hardcoded values (use constants)
- [ ] Types are explicit
- [ ] Tests pass
- [ ] Linter passes
- [ ] TypeScript compiles without errors

---

## Editor Setup

### VS Code / Code-OSS Recommended Extensions
- ESLint
- Prettier
- TypeScript Vue Plugin (if using Vue)

### Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
