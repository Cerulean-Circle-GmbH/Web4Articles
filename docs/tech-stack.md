

# Web4Articles Technology Stack & Testing

> **See also:**
> - [tssh/OOSH Architecture Spec](../scrum.pmo/sprints/sprint-1/task-1.0-architect-tssh-spec.md)
> - [tssh Shell Wrapper Task](../scrum.pmo/sprints/sprint-1/task-1.1-developer-tssh-wrapper.md)
> - [tssh Backend Task](../scrum.pmo/sprints/sprint-1/task-1.2-developer-tssh-backend.md)
> - [tssh Completion Task](../scrum.pmo/sprints/sprint-1/task-1.3-developer-tssh-completion.md)
> - [tssh PO Documentation Task](../scrum.pmo/sprints/sprint-1/task-1.4-po-document-tssh.md)
> - [tssh Completion Test Task](../scrum.pmo/sprints/sprint-1/task-1.5-tester-completion-tests.md)
> - [tssh Test Cases](../scrum.pmo/sprints/sprint-1/task-1.1.5-tester-tssh-testcases.md)
> - [tssh Main Wrapper Task](../scrum.pmo/sprints/sprint-1/task-1-tssh-wrapper.md)
> - [Sprint 1 Planning](../scrum.pmo/sprints/sprint-1/planning.md)
> - [Developer Process](../scrum.pmo/roles/Developer/process.md)
> - [Tester Process](../scrum.pmo/roles/Tester/process.md)
> - [PO Process](../scrum.pmo/roles/PO/process.md)
> - [Submodule Status Example](../scrum.pmo/sprints/sprint-1/submodule-status.md)
> - [README](../README.md)
> - [Project Index](../index.md)
> - [Recovery Log](../recovery.md)

## TypeScript Shells & CLI Execution

- **tssh**: A next-generation, TypeScript-native shell. tssh is aware of all TypeScript classes in the project (including those in `node_modules`). It provides:
  - Tab and inline completion for classes, methods, and parameters (not just files)
  - Ability to call any class method with arguments, with real-time suggestions
  - Modern ESM-only, strict TypeScript support
  - UX inspired by ranger and nushell: interactive navigation, fuzzy search, and context-aware actions
  - More powerful than `ts-node --interactive` or basic REPLs
  - Designed for developer productivity and discoverability

- **OOSH**: A full-featured bash replacement shell, with all base navigation and scripting features (like ranger/nushell), but for general shell use. OOSH delegates TypeScript/ESM logic to tssh for seamless integration.

- **ts-node**: All TypeScript CLI tools/scripts must be executed using `ts-node` (not `tsx`) for direct script execution. Example:
  ```bash
  npx ts-node src/ts/layer2/GitScrumProject.ts <command>
  ```


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
