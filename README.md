# Web4Articles

[CIRAS Project Planning](https://www.ciras.org/)

This Project will create a md-file based WIKI for CIRAS Project articles


## Tech Stack and First Principles

- **TypeScript**: All code is written in strict TypeScript.
- **ES Modules (ESM)**: All code, scripts, and CLI entry points must use the most modern ES module syntax (`import`/`export`).
- **No CommonJS**: CommonJS (`require`, `module.exports`) is strictly forbidden. Do not use legacy Node.js module systems anywhere in the project.
- **All scripts, tests, and automation must be ESM-compliant.**
- All CLI entry points must be ESM TypeScript files, run via `ts-node --esm`.
- All shell wrappers (e.g., `oosh`, completion scripts) must resolve the project root and invoke ESM TypeScript entry points.
- Never use `main.ts` as a CLI entry point. Always use a static `start()` method in a dedicated entry class (e.g., `OOSH.start()` or `GitScrumProject.start()`).
  - **start() methods and constructors must never take parameters.** All CLI argument parsing and dispatch must be handled inside the class, using a CLI interface (see `GitScrumProject` and `OOSH` for reference). This ensures strict OOP and testability.
- **DRY Principle**: Do not repeat logic, code, or documentation. Always consolidate and refactor to a single canonical location if repetition is found.
- Node.js 18+ (LTS recommended)
- Bash for shell integration
- Jest for testing (ESM compatible)
- VS Code with recommended extensions

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

1. **Read this README.md** for project purpose, tech stack, and management principles.
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

This process is fully autonomous and designed for rapid, reliable project context recovery and onboarding.
