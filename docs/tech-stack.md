[Back to Docs](../)

# Web4Articles Technology Stack & Testing

## Testing Frameworks

- **Vitest**: The modern, ESM-native, TypeScript-first test runner. All tests use Vitest for speed, ESM compatibility, and developer experience. (`describe`, `it`, `expect` are imported from `vitest`).
- **Jest**: ❌ **BANNED**. Jest and ts-jest are not allowed in this project. Jest is marked as evil due to poor ESM support, legacy CJS patterns, and slow ecosystem migration. All legacy Jest config and dependencies have been purged.

## Migration Notes
- All tests must use Vitest and ESM imports.
- If you see any Jest config, scripts, or dependencies, remove them immediately and mark as a tech debt violation.

---

## Example Vitest Test
```typescript
import { describe, it, expect } from 'vitest';

describe('my feature', () => {
  it('works', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

## Why Vitest?
- Fast, modern, and ESM-native
- TypeScript-first
- Works with Vite, Node, and browser
- No legacy CJS baggage
- Full support for `import.meta.url`, top-level await, and all modern JS features

---

## See also
- [Vitest Docs](https://vitest.dev/)

---

## Tooling & Environment

- Docker: standardize local and CI environments using a devcontainer.
- Devcontainer (VS Code or compatible): project will provide a cross-platform environment under `sprint-4`.
- PlantUML + Graphviz: render architecture diagrams from `src/puml` to SVG.
- GitHub CLI (`gh`): used for repository automation tasks where applicable.
