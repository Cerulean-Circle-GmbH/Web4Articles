[Back to Roles](../)

# AI Feedback Processing Protocol

When the AI is acting as Developer to process feedback:
- Read this process.md in full before taking action.
- Complete all required steps and document changes as needed.
- After processing, always return to the Scrum Master role and report what was done as Developer.
# Project First Principles (Canonical)

## CMMI Level 4 Feedback & Learning
- All process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant debugging or integration session, summarize what was learned and how it will change future process or code.

## Logger & Verification Principles
- All CLI and backend code must use the canonical Logger. Logging must be environment-aware (see Logger.ts), non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.
- Jest is strictly forbidden in this project. Do not add, configure, or use Jest or any related files. Remove any Jest config or code immediately if found.
- All file removals and renames must be performed using the shell (not via code or editors), to ensure traceability and auditability.
- All code must be written in strict TypeScript and ESM.
- No CommonJS or legacy Node.js patterns.
- All scripts, tests, and automation must be ESM-compliant.
- All CLI entry points must be ESM TypeScript files, run via `ts-node --esm`.
- All shell wrappers and completion scripts must resolve the project root and invoke ESM TypeScript entry points.
- Never use `main.ts` as a CLI entry point. Always use a static `start()` method in a dedicated entry class.
- DRY Principle: Do not repeat logic, code, or documentation. Always consolidate and refactor to a single canonical location if repetition is found.
- Node.js 18+ (LTS recommended)
- Bash for shell integration
- Vitest for testing (ESM compatible)
- VS Code with recommended extensions
- Radical OOP: No functions outside of classes.
- Each article/tool is a separate git submodule.
- Project is managed by an AI (LLM) and follows CMMI Level 4 SCRUM.
- **Separation of Concerns:** Each unit (e.g., shell script, TypeScript backend) must be in its own file/module. Do not embed shell scripts in TypeScript files or vice versa.

# Developer First Principles & Learnings (Migrated from src/developer/process.md)

## Pathing & Environment
- Always resolve script and tool paths from the git root using `git rev-parse --show-toplevel`.
- Prepend `$GIT_ROOT/node_modules/.bin` to `PATH` in all scripts to ensure local binaries are used.

## Testing & QA
- Automated tests must simulate real shell usage, not just backend logic.
- Manual QA must validate that completions are visible and correct in the shell. Completion must only ever suggest valid, existing arguments. Shell-style options and unsupported input are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).
- All warnings and extraneous output must be suppressed in completions.

## Documentation
- Document all process, QA, and architectural learnings in markdown for onboarding and future reference.
- Always reference the canonical project first principles at the top of this file for any new or updated process.

## Systematic Investigation Protocol

### Evidence-Based Problem Solving
The Developer role applies systematic investigation methodology for technical problems through evidence-based analysis and comprehensive validation.

#### Core Investigation Principles
1. **Work from clear evidence, not assumptions** - Create sequences from findings to understand behavior
2. **Systematic approach prevents chaotic debugging** - Evidence-based protocol enables reproducible results
3. **Multi-perspective analysis** - Coordinate with other roles to prevent perspective bias
4. **Comprehensive coverage** through specialization in technical analysis

#### Developer-Specific Investigation Areas
- **Code Analysis:** Implementation review, architectural assessment, technical debt analysis
- **Debugging:** Systematic reproduction, error analysis, root cause identification
- **Integration:** Component interaction analysis, system behavior validation
- **Performance:** Bottleneck identification, optimization opportunities, resource usage analysis

#### Investigation Methodology
1. **Problem Definition**: Gather technical symptoms and error reports
2. **Evidence Collection**: Code review, log analysis, systematic reproduction
3. **Hypothesis Development**: Multiple potential technical root causes
4. **Systematic Testing**: Design experiments to validate/eliminate hypotheses
5. **Solution Framework**: Immediate fixes, systematic solutions, architectural improvements

### Testing Excellence Protocol - Non-Interactive Mode

#### CRITICAL: Interactive Mode Hang Prevention
**❌ NEVER RUN:** Direct TSRanger commands without test flags - causes session hangs requiring manual intervention

**Required Commands (Non-Interactive):**
```bash
# ✅ CORRECT: Built-in test command
components/TSRanger/v2.2/sh/tsranger test '[down]'
components/TSRanger/v2.2/sh/tsranger test 'g[tab]'

# ✅ CORRECT: Environment variable test mode  
TSRANGER_TEST_MODE=1 TSRANGER_TEST_INPUT='[down]' components/TSRanger/v2.2/sh/tsranger
```

#### Testing Best Practices for Developers
1. **Start Simple** - Basic commands first (`[down]`, `g`)
2. **Build Complexity** - Add sequences gradually (`[down]5x[tab]`)
3. **Test Edge Cases** - Critical scenarios (filter corruption: `t\x7fg`)
4. **Validate Results** - Confirm expected behavior matches implementation

#### Pre-Test Checklist (Always Follow)
- [ ] ✅ **Test mode flag present** (`test` subcommand or `TSRANGER_TEST_MODE=1`)
- [ ] ✅ **Input specified** (test sequence provided)
- [ ] ✅ **No bare commands** (never run raw `tsranger`)
- [ ] ✅ **Timeout awareness** (recognize potential hangs)

#### Integration with Systematic Investigation
- **Evidence-Based Testing**: Convert investigation findings into systematic test cases
- **Regression Prevention**: Ensure identified bugs cannot reoccur through comprehensive test coverage
- **Matrix Integration**: Add discovered scenarios to test matrices for systematic validation

## Pre-Commit Spellcheck & Cross-Reference Check (Mandatory)
- Before committing changes:
  - Spellcheck modified markdown and code comments; fix obvious typos and normalize agreed terms.
  - Verify first-line backlinks and relative links in changed markdown resolve correctly.
  - Ensure all testing follows non-interactive protocols to prevent session hangs


# tssh CLI: Test-Driven Development & Feedback Integration (2025-08-04)

## Test Approach (Updated)
- All integration and CLI tests for `tssh` must use realistic, user-facing scenarios and arguments.
- Avoid placeholder or dummy arguments (e.g., `foo`, `bar`).
- Test cases must cover:
  - Project root/unit path output (no arguments)
  - Bash completion installation (positional arguments)
  - Shell-style option rejection
  - Invalid/unknown command handling
  - Direct backend invocation for completion install
- All test code must be placed in the canonical `test/` directory and referenced in process docs and tasks.
- Manual QA must validate that completions are visible and correct in the shell, with no warnings or extraneous output.
- All feedback from QA and user must be incorporated into test refinement and process documentation.

## Lessons Learned
- Realistic, user-driven test cases improve reliability and traceability.
- Feedback loops between Developer, Tester, and QA are essential for robust CLI and completion features.

## Reference
- See `test/tssh-cli.integration.test.ts` for canonical test coverage and patterns.

# Developer First Principles: Script Pathing & Environment

## Always Run Scripts Relative to Git Root
- Use `git rev-parse --show-toplevel` in scripts to determine the project root.
- All script invocations (Node, TypeScript, etc.) should use absolute paths from the git root for reliability.

## Add Local Binaries to PATH
- Prepend `$GIT_ROOT/node_modules/.bin` to the `PATH` in all shell scripts to ensure local tools (like `ts-node`) are found regardless of the working directory.

## Use `tree` for Structure Analysis
- Use the `tree` command to analyze and document the project structure, especially when debugging or onboarding.

## Example Pattern (Bash):
```bash
GIT_ROOT="$(git rev-parse --show-toplevel)"
export PATH="$GIT_ROOT/node_modules/.bin:$PATH"
ts-node "$GIT_ROOT/src/ts/layer4/TSCompletion.ts" "$@"
```

## Rationale
- This approach ensures scripts are robust, portable, and environment-agnostic, supporting both local and containerized development.
# Subtask Naming and Dependencies

Subtasks will always be named to indicate the affected role (e.g., `task-1.1-developer-setup.md`). Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.
# Developer Role Process

## Role Definition
The Developer is responsible for implementing features, maintaining code quality, and collaborating with other roles to deliver the project according to requirements and best practices.

## Responsibilities
- Follow the structure and conventions set by DevOps and the PO.
- Ensure code and documentation are organized as specified.
- Contribute to the ontology and wiki as new terms and features are developed.
- Provide feedback on the setup for continuous improvement.

## Strict OOP First Principles

- **Interface Segregation**: All CLI logic is abstracted behind a `CLI` interface in `layer3`, ensuring that implementations can be swapped or extended without changing the consumer.
- **Composition over Inheritance**: The main class (`GitScrumProject`) composes a CLI instance, rather than inheriting CLI logic, to maximize flexibility and testability.
- **Single Responsibility**: Each class has a single, well-defined responsibility:
  - `GitScrumProject`: Project creation logic and orchestration.
  - `CLI` (interface): Contract for CLI interaction.
  - `DefaultCLI`: Default implementation that parses parameters and invokes the correct logic.
  - `ParameterParser`: Responsible only for parsing CLI arguments.
- **Dependency Injection**: `GitScrumProject` receives its CLI implementation as a dependency (defaulting to `DefaultCLI`), allowing for easy testing and extension.
- **No Preknowledge Required**: The static `start()` method on `GitScrumProject` is the only entry point needed for CLI usage; no constructor parameters or setup required.
- **Layered Architecture**: Interfaces and contracts are in `layer3`, implementations in `layer2`, and process orchestration in `layer4`.
- **One Class per File**: Every class and interface is defined in its own `.ts` file for clarity and maintainability.

## Example Structure

- `src/ts/layer3/CLI.ts`: CLI interface.
- `src/ts/layer3/DefaultCLI.ts`: DefaultCLI implementation.
- `src/ts/layer2/GitScrumProject.ts`: Composes a CLI instance and delegates CLI logic.
- `src/ts/layer2/ParameterParser.ts`: Parses CLI arguments.

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. Developers are responsible for following conventions, contributing to documentation, and providing feedback.

## Benefits
- Maximizes maintainability, testability, and clarity.
- Supports CMMI Level 4 process improvement by making responsibilities explicit and traceable.
- Enables future extension or replacement of CLI logic without changing core project logic.

---
Developers should continue to maintain and expand the documentation and ontology as the project grows.

## PDCA Requirement (Shared)
- Use the shared PDCA template at `scrum.pmo/roles/_shared/PDCA/template.md`.
- After each QA/user prompt or significant development change, create a UTC-named PDCA entry under `scrum.pmo/roles/Developer/PDCA/`.
- In Check, include concrete evidence (tree, test logs, git) and a verbatim QA quote.
- Plan must include bold-labelled subsections (Objective, Scope, Targets, Inputs, Acceptance Criteria, Assumptions, Constraints, Options, Rationale, Risks/Mitigations).

## Recovery → PDCA → Commit & Push (Enforced)
- After recovery or any QA prompt: perform recovery, write PDCA (UTC, QA quote, Actions with artifact links), then commit and push immediately.

## Linking Policy (GitHub-first dual-linking)
- Provide GitHub web link followed by relative path link for referenced files.
- Example:
  - `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/<branch>/scrum.pmo/roles/Developer/process.md): [scrum.pmo/roles/Developer/process.md](../../scrum.pmo/roles/Developer/process.md)`
