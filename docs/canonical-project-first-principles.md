# Project First Principles (Canonical)

- All code must be strict TypeScript and ESM.
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
