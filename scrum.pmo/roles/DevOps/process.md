# DevOps First Principles & Learnings (Canonical)

## CMMI Level 4 Feedback & Learning
- All process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant debugging or integration session, summarize what was learned and how it will change future process or automation.

## Logger & Verification Principles
- All automation and scripts must use the canonical Logger where applicable. Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.

## Environment Consistency
- All scripts and tools must work identically in local, CI, and devcontainer environments.
- The devcontainer must mount the project at the git root and set the working directory accordingly.
- Ensure `node_modules/.bin` is in the `PATH` for all automation and shell scripts.

## Environment Verification Checklist (run before any work)
- Docker engine installed and running:
  - `docker version` returns client and server info
- Devcontainer tooling available:
  - VS Code Dev Containers extension or `devcontainer` CLI
- Node.js version satisfies engines of all devDependencies (see `npm ci` warnings)
- PlantUML and Graphviz installed (for rendering PUML locally) or plan to render inside devcontainer
- Git configured with correct user/email and access to required remotes
- `gh` GitHub CLI installed if repository automation is needed

## Structure & Automation
- Use `tree` and project structure analysis to verify and document dependencies.
- Automate release, tagging, and QA steps for reproducibility.

## CI/CD Discipline
- Require all tests to pass and documentation to be up-to-date before release.

## Pre-Commit Spellcheck & Cross-Reference Check (Mandatory)
- For infra/docs changes:
  - Spellcheck modified markdown; correct obvious typos.
  - Validate all relative links in changed files (including devcontainer docs) resolve.

# DevOps: Tree Dependencies & DevContainer Requirements

## Project Structure Analysis
- Use `tree -a -L 5` to document and verify the project structure.
- Ensure all scripts and tools are referenced relative to the git root for consistency.

## DevContainer Setup (for later)
- The devcontainer must:
  - Mount the project at the git root.
  - Set the working directory to the git root.
  - Ensure `node_modules/.bin` is in the `PATH`.
  - Install all devDependencies from `package.json` (notably `ts-node`, `typescript`, `@types/node`).
  - Provide bash and coreutils (for `tree`, `git`, etc.).
  - Include PlantUML and Graphviz for diagram rendering.
  - Provide Docker-in-Docker or `docker` socket access for workflows that interact with Docker (optional based on security policy).
  - Include `gh` CLI where GitHub automation is part of the sprint tasks.

## Example: PATH Setup in DevContainer
```bash
export PATH="/workspaces/<project>/node_modules/.bin:$PATH"
```

## Rationale
- This ensures all developer and CI/CD scripts work identically in local and containerized environments.
# DevOps Role Process

## Role Definition
The DevOps role is responsible for the setup, maintenance, and automation of the project's infrastructure, repositories, and development workflows. DevOps ensures smooth integration, deployment, and collaboration between all project components and team members.

## Responsibilities
- Set up and maintain the project repository structure.
- Add and configure git submodules (e.g., the project wiki).
- Ensure all team members have access to the correct repository structure.
- Document technical setup steps and automation scripts.

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. DevOps is responsible for tasks such as creating the SCRUM structure, setting up the wiki submodule, and templating new subprojects.

---
DevOps should continue to maintain and automate these processes as the project evolves.
