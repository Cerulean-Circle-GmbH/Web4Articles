[Back to Initialization](../initialization.md)

# Sprint 6 Planning — Versioned Folder Refactor

## Sprint Goal
Refactor to a versioned top-level structure: v2/src/ and v2/test/, with dependencies referenced relative to v2/src (path aliases/baseUrl). Migrate src.v2 → v2/src and test.v2 → v2/test, update wrappers, configs, and docs, preserving DRY and the versioned-units policy.

## Tasks

- [ ] [Task 1: Architect — Versioned Folder Structure and Dependency Strategy](./task-1-architect-versioned-structure.md)
- [ ] [Task 2: Developer — Migrate Code and Tests to v2/src and v2/test](./task-2-developer-migrate-v2-folders.md)
- [ ] [Task 3: DevOps — Update Wrapper, tsconfig, and CI for Version Routing](./task-3-devops-routing-config.md)
- [ ] [Task 4: Tester — Validate v2 Test Suite and Determinism](./task-4-tester-validate-v2-suite.md)
- [ ] [Task 5: PO — Update Docs, Cross-References, and Requirements](./task-5-po-docs-and-xrefs.md)

## Notes
- Follow docs/versioned-units.md for enforcement rules during migration.
