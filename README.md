# Web4Articles (Beta)

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

- **Commit & Push Guarantee:** After each assistant prompt that modifies files, immediately commit and push the changes with a clear, auditable message. Prefer small, atomic commits per prompt to maximize revision safety.

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

## Recovery



## Optimized Recovery Procedure


**Autonomous Recovery Process**

If the AI loses context or receives the prompt "recover" from the QA user, it will autonomously:

0. **DevOps Environment Verification (blocking, do first):**
   - Check local environment and fix before proceeding:
     - Docker engine is installed and running (`docker version` works)
     - Devcontainer tooling available (VS Code Dev Containers or equivalent)
     - Node.js satisfies engine ranges in `package.json`
     - PlantUML and Graphviz installed (or plan to use devcontainer)
   - If any prerequisite is missing, open a DevOps task to resolve locally, or prefer using the project devcontainer once available.
1. **Read the canonical Project First Principles section in this README.md** for project purpose, tech stack, and management principles. Only scan other sections as needed for context or updates.
2. **Scan all markdown files** in the project, prioritizing:
   - `scrum.pmo/` (roles, sprints, tasks, process docs)
   - `wiki/` (ontology, Home.md, definitions)
   - Any onboarding, process, or QA feedback files
3. **Automated Indexing:**  
   - Update or generate an index (e.g., `index.md` or `structure.json`) listing all markdown files, their roles, and last modified dates.
4. **QA Feedback Aggregation:**  
   - Aggregate all QA feedback and audit findings from task QA sections and sprint audit files into a single `qa-feedback-log.md`.
5. **Role-Specific Recovery Hooks:**  
   - Reference each role’s `process.md` “Recovery Checklist” for role-specific context and recent actions.
6. **Sprint & Task Status Summary:**  
   - Generate a summary table of all sprints, tasks, and their statuses (open/closed/in-progress), linking to their markdown files.
7. **Automated Consistency Checks:**  
   - Check for broken links, missing backlinks, and outdated templates in all markdown files, reporting issues in the recovery summary.
8. **Document findings:**  
   - Append a timestamped entry to `recovery.md` summarizing findings, gaps, and actions taken.
   - Notify the QA user with the summary and next steps.

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
