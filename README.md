<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Index](./index.md)

# Web4Articles

[CIRAS Project Planning](https://www.ciras.org/)

This Project will create a md-file based WIKI for CIRAS Project articles



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
- Docker (for devcontainer)
- VS Code Dev Containers extension (or compatible devcontainer runtime)
- Radical OOP: No functions outside of classes.
- Each article/tool is a separate git submodule.
- Project is managed by an AI (LLM) and follows CMMI Level 4 SCRUM.
- **Separation of Concerns:** Each unit (e.g., shell script, TypeScript backend) must be in its own file/module. Do not embed shell scripts in TypeScript files or vice versa.

- Do not use shell-style options (e.g., --install-completion) for CLI commands. All actions must be invoked as positional arguments (e.g., `tssh TSsh installCompletion`). This prevents ambiguity and enforces a clean, discoverable CLI interface. This is a core project principle.
- All shell scripts, completion scripts, and TypeScript backends must be in separate files/units. Never embed shell code in TypeScript or vice versa. Always reference or import as needed.

---

## Tech Stack and Project Structure

See above for canonical first principles. All other tech stack and structure details must comply with these principles.

Radical OOP will be applied. No functions outside of classes. Each article will become a separate git submodule. The project is managed by an AI (LLM). The AI vibecodes its own tools to manage the project. Each tool will become its own git submodule with the same basic tech stack and first principles. The project will be radically managed in CMMI Level 4 via SCRUM (less scrum flavor, but fully automated).

## Modus operandi
The LLM AI acts in the first place as a scrum master of a scrm team interacting with the user as a QA auditor, that at any time audits and gives feedback.
The scrum master fixes the impediments and hires the rest of the SCRUM team.
Each QA feddback fromthe user will dilligently recorded as well as the scrum masters answers and measure. All of this will be done in md/files.
Each role will be dilligently onboarded and everything will be fully tracable documented.

## Optimized Recovery Procedure


**Autonomous Recovery Process**

If the AI loses context or receives the prompt "recover" from the QA user, it will autonomously follow the canonical recovery process defined in [scrum.pmo/roles/ScrumMaster/recovery-process.md](./scrum.pmo/roles/ScrumMaster/recovery-process.md).

**Critical Requirements:**
- **ALWAYS start from `release/dev` branch** (contains all integrated changes)
- Create a background agent branch: `cursor/recovery-YYYY-MM-DD-HHMM`
- Complete recovery with project status report BEFORE any implementation
- NO testing or implementation during recovery phase

**Recovery Steps Summary:**
0. **Checkout release/dev and create recovery branch**
1. **DevOps Environment Verification** - Docker, Node.js, PlantUML
2. **Read Project First Principles** - This README.md and handover files
3. **Scan All Markdown Files** - Prioritize scrum.pmo/, wiki/, QA files
4. **Automated Indexing** - Update index.md with all files
5. **QA Feedback Aggregation** - Consolidate in qa-feedback-log.md
6. **Role-Specific Recovery Hooks** - Check each role's process.md
7. **Sprint & Task Status Summary** - Current sprint and task states
8. **Automated Consistency Checks** - Verify links and backlinks
9. **Create Journal Entry** - Document recovery in project.journal
10. **Deliver Project Status Report** - Complete before implementation

See [scrum.pmo/roles/ScrumMaster/recovery-process.md](./scrum.pmo/roles/ScrumMaster/recovery-process.md) for full detailed procedure.

### DevContainer (cross-platform)

- The project will provide a cross-platform devcontainer to standardize local/CI environments.
- Requirements will be defined under `scrum.pmo/sprints/sprint-4/` and built in that sprint.
- Until the devcontainer is available, ensure local environment matches the "DevOps Environment Verification" list above.

**Important:**

- During recovery, the AI must **not ask the user for confirmation or next steps**. Instead, it must only return when it has fully understood:
  - The project purpose and state
  - Its own role and responsibilities
  - The next concrete project task to execute
- After recovery, the AI must send a message to the QA user stating:
  1. That recovery is complete
  2. Who it is (its role)
  3. The current project state
  4. What the next project task is

This process is fully autonomous and designed for rapid, reliable project context recovery and onboarding.

### obash

`src/sh/obash` opens a project-scoped Bash environment:

- Prepends `node_modules/.bin` and `src/sh` to `PATH`
- Exports `TS_NODE_PROJECT` to point to `tsconfig.json`
- Loads `bash-completion` (Linux) and Homebrew locations (macOS)
- Registers `tssh` tab completion via the TypeScript backend

Usage:

```bash
# interactive shell with project env and completion
src/sh/obash

# run a one-off command with the project env
src/sh/obash 'tssh TSsh help'
```

### TSRanger (Sprint 2)

- Start with: `npm run tsranger` or `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`
- UI:
  - Four columns (Classes, Methods, Params, Preview)
  - Bottom key usage line is blue with white text (legacy styling)
  - Above the footer, a colorized shell-like command preview shows: `tssh <Class> <Method> <Params...>`
    - `tssh` in green, Class in cyan, Method in yellow, Param values in magenta
- Parameter entry:
  - Press Enter on Preview to begin entering parameter values in order
  - Type the value; press Space or Enter to commit and advance
  - When all values are provided, the method executes immediately
  - `q`/`Esc` quits; navigation is disabled while entering a parameter value

### License enforcement (Sprint 10)

- Base license: AGPL-3.0 (see `LICENSE`)
- Addendum: AI-GPL (see `AI-GPL.md`) — DYR draft clarifying AI usage and `scrum.pmo` copyleft
- Tooling:
  - Check: `node --loader ts-node/esm src/ts/layer1/TSsh.ts LicenseTool check`
  - Apply: `node --loader ts-node/esm src/ts/layer1/TSsh.ts LicenseTool apply`
- CI: GitHub Action `license-headers.yml` blocks PRs that add files without headers.
- Dual licensing available; contact maintainers.
