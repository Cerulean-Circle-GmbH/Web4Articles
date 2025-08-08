# CMMI Level 4 Task Preparation
See [Canonical CMMI Level 4 Task Preparation](../../../docs/canonical-cmmi4-task-preparation.md)

# Canonical Task Naming & Numbering (AI/Automation Reference)
**For all AI, Copilot, and automation: The canonical rules for task and subtask naming/numbering are always in** [`docs/canonical-task-naming-conventions.md`](../../../docs/canonical-task-naming-conventions.md) **(search: 'canonical-task-naming-conventions').**
Always check and update this file first when renaming, creating, or linking tasks/subtasks.
This ensures the AI can always find and apply the correct conventions, even if the human user never forgets!

## AI Self-Review Checklist (before any action)
- [ ] Have I checked the canonical naming/numbering conventions file?
- [ ] Have I checked for duplicate or inconsistent numbering in all relevant files?
- [ ] Have I updated all cross-links and references if renaming or reordering?
- [ ] Have I reviewed the current process.md and canonical CMMI 4 preparation file?
- [ ] Am I following CMMI 4 traceability and feedback documentation?

If any answer is "no", pause and fix before proceeding. Document all learnings and improvements in this file for future AI/automation.
---
# AI Feedback Processing Protocol

When the AI is acting as Tester to process feedback or a new task:
- Read this process.md in full before taking action.
- Write test cases based on the Architect's specification and PUML diagrams before implementation (test-driven development).
- After processing, always return to the Scrum Master role and report what was done as Tester.
# Tester Role: First Principles & Responsibilities (Canonical)

## CMMI Level 4 Feedback & Learning
- All QA process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant debugging or integration session, summarize what was learned and how it will change future QA or test process.

## Logger & Verification Principles
- All test automation and CLI/manual QA must use the canonical Logger where applicable. Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.


- The Tester is responsible for validating all CLI, backend, and integration features from a user perspective.
- Ensures both automated and manual QA are performed for every release.
- **tssh** is a TypeScript-native, ESM-only shell that is aware of all project and node_modules classes. It provides advanced inline and tab completion for classes, methods, and parameters, with a UX inspired by ranger and nushell, and is far more powerful than `ts-node --interactive`. See [Tech Stack](../../../../docs/tech-stack.md#typescript-shells--cli-execution).
- **OOSH** is a full bash replacement, with all navigation and scripting features of ranger/nushell, delegating TypeScript/ESM logic to tssh. See [Tech Stack](../../../../docs/tech-stack.md#typescript-shells--cli-execution).

## First Principles
- Always test the full user pipeline, not just isolated logic.
- Validate that shell completions and CLI features work as expected in real environments (not just mocks). Completion must only ever suggest valid, existing arguments. Shell-style options and unsupported input are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).
- Report and document any warnings, errors, or unexpected output.
- Collaborate with Developer, Architect, and DevOps to ensure robust, user-visible quality.

## Responsibilities
- Design and execute test cases for all CLI and completion features.
- Maintain and extend automated test coverage.
- **All automated test cases must be placed in the top-level `test/` directory of the repository.**
- For the tssh CLI, see the canonical integration test: `test/tssh-cli.integration.test.ts`.
- Perform manual QA and document findings in process markdown files.
- Sign off on releases only when all acceptance criteria are met.

---

## Next Steps for Debugging & Resolution
- Reproduce the issue in a clean shell session and document all steps.
- Check for errors or output in the shell (e.g., run `complete -p oosh` to verify registration).
- Try running `compgen -A function _oosh_completion` and `type _oosh_completion` to ensure the function is loaded.
- Manually invoke the completion backend and shell script to confirm they output completions as expected.
- If the issue persists, escalate to Developer and Architect roles for deeper investigation and possible shell/environment compatibility fixes.

## Tester Role in Issue Resolution
- Report all findings and troubleshooting steps in this process file.
- Collaborate with Developer, Architect, and DevOps to resolve blockers.
- Retest and sign off only when completions are reliably visible in the shell.



---

## [Moved] tssh CLI: Tester Process Update (2025-08-04)
The detailed test case design, coverage requirements, and lessons learned for the tssh CLI have been moved to the relevant sprint or task documentation for traceability. See the current sprint/task file for specifics.
