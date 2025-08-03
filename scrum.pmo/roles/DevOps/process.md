# DevOps First Principles & Learnings (Migrated from src/devops/process.md)

## Environment Consistency
- All scripts and tools must work identically in local, CI, and devcontainer environments.
- The devcontainer must mount the project at the git root and set the working directory accordingly.
- Ensure `node_modules/.bin` is in the `PATH` for all automation and shell scripts.

## Structure & Automation
- Use `tree` and project structure analysis to verify and document dependencies.
- Automate release, tagging, and QA steps for reproducibility.

## CI/CD Discipline
- Require all tests to pass and documentation to be up-to-date before release.

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
