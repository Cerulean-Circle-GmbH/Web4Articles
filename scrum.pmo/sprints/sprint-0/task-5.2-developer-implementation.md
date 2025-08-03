# [Back to Sprint 0 Planning](./planning.md)
# [Back to Main Task 5](./task-5-template-new-subproject.md)

# Task 5.2: Developer - Implementation

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Implement the CLI interface, default implementation, and shell/TypeScript completion for the oosh CLI, following strict OOP and process requirements.

## Context
- This subtask is derived from Task 5 and focuses on implementing the CLI, completion, and related developer logic.

## Intention
- Ensure the CLI and completion logic are robust, extensible, and developer-friendly.

## Steps
- Implement the CLI interface and default implementation in TypeScript.
- Implement the oosh shell wrapper and bash completion script.
- Implement the TypeScript completion backend for dynamic tab completion.
- Ensure all code follows strict OOP and process requirements.

## Requirements
- An automated test must simulate terminal completion (as described in the manual test) and capture the real output, verifying the completion logic end-to-end.
- CLI and completion logic must be implemented in TypeScript and shell as specified.
- The TSCompletion class must generically discover available TypeScript classes, their methods, and method parameters from the project source code (not hardcoded for a specific class).
- Completion must work for any class, method, or parameter in the project, supporting future extensibility.
- All code must follow strict OOP, naming, and process conventions.

## Acceptance Criteria
- CLI and completion work as specified and pass all tests.
- Code is reviewed and accepted by the team.

## QA Audit & User Feedback
- [x] Manual QA revealed that the completion script failed when sourced or run from different directories, due to incorrect TS_NODE_PROJECT path resolution.
- [x] The automated test did not cover the real shell usage scenario, so the bug was not caught by CI.
- [x] After suppressing Node.js warnings, no completions are shown in the shell after pressing [Tab], indicating a new or remaining bug in the completion pipeline.

### Manual QA Transcript (2025-08-03)
```
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/UpDown > source oosh-completion.sh 
bash: oosh-completion.sh: No such file or directory
ERROR> line 1: "source" from  returned with ERROR code: EPERM 1 Operation not permitted
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/UpDown > cd ../Web4Articles/src/sh/
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/sh > source oosh-completion.sh 
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/sh > ./oosh (node:51864) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:51864) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/ts/layer4/TSCompletion.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/ts/package.json.
^C
```

### Additional QA Feedback (2025-08-03)
```
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/sh > source oosh-completion.sh 
[oosh McDonges.native] donges@McDonges-3:/Users/Shared/Workspaces/2cuGitHub/Web4Articles/src/sh > ./oosh G
# (No completions shown after pressing [Tab])
```

### QA Action Items
- Fix the shell script and/or completion backend so that completions are actually shown in the shell after pressing [Tab].
- Add a test that simulates the full shell completion pipeline, including the shell script, and verifies that completions are returned and visible to the user.

- Write an automated test that:
  - Spawns the completion backend from the src/sh directory, as the shell script does
  - Sets TS_NODE_PROJECT to the correct absolute path
  - Verifies completions are returned as expected
  - Fails if the completion backend cannot find tsconfig.json or fails to run
  - Simulates the shell script invocation and checks that completions are visible in the shell (not just in the backend)

## Completion Specification

The following describes the shell and TypeScript completion integration for the oosh CLI:

> When the user types `oosh` and presses [Tab], the shell calls a TypeScript class `TSCompletion` implementing the `Completion` interface. The completion responds with a list of TypeScript classes. As the user types further (e.g., `oosh GitScrumProject` [Tab]), the completion lists available methods, then sub-methods or parameters, and finally default parameter values. This enables context-aware tab completion for the CLI, driven by the TypeScript backend.

Example flow:

```
oosh [Tab]                # completes: GitScrumProject
oosh GitScrumProject [Tab] # completes: create createProject
oosh GitScrumProject create [Tab] # completes: project
oosh GitScrumProject create project [Tab] # completes: Web4Scrum
```

This specification is implemented by a shell script for bash completion and a TypeScript backend for dynamic completions.
