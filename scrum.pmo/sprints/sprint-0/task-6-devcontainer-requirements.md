[Back to Planning](./planning.md)

# Task 6: DevContainer Requirements

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Document the requirements and setup for a proper devcontainer for the Web4Articles project, ensuring compatibility with strict OOP, TypeScript, and shell integration.

## Context
- Migrated from previous misplaced devcontainer.md file.
- This task ensures all devcontainer requirements are documented in the correct sprint planning location.

## Requirements
- Node.js 18.x LTS (or compatible with ts-node)
- TypeScript and ts-node installed
- Bash and coreutils available
- Project mounted at git root
- All CLI/scripts run via ts-node
- See full details in the content below.

---

# Web4Articles DevContainer Requirements

## 1. Node.js Version
- Use Node.js 18.x LTS for maximum compatibility with ts-node v10.x and legacy TypeScript tooling.
- If using Node.js 20+ or 22+, ensure ts-node v11+ is available (not always possible as of 2025).
- Avoid Node.js 23.x+ unless all tooling is confirmed compatible.

## 2. TypeScript and ts-node
- Install TypeScript (>=5.0) and ts-node (>=10.9.2, ideally latest).
- If using ESM, prefer the latest ts-node and TypeScript versions.
- All CLI scripts must run via ts-node, not precompiled JS.

## 3. Shell Integration
- Bash must be available for shell wrappers (e.g., oosh).
- All shell scripts must resolve project root using git and set environment variables as needed.

## 4. Workspace Structure
- All CLI and TypeScript sources must be in the workspace and accessible to the devcontainer.
- The devcontainer must mount the entire project workspace, not just a subfolder.

## 5. NPM Registry
- Use the default npm registry or a registry that provides the latest ts-node and TypeScript versions.
- If using a private registry, ensure it is kept up to date.

## 6. Recommended Extensions
- ms-vscode.vscode-typescript-next
- ms-vscode.vscode-typescript-tslint-plugin
- ms-vscode.vscode-node-azure-pack

## 7. Example Dockerfile Snippet
```
FROM mcr.microsoft.com/devcontainers/typescript-node:18
RUN npm install -g ts-node typescript
```

## 8. Troubleshooting
- If you see persistent ts-node or ESM warnings, check Node.js and ts-node versions.
- If using Node.js 20+ and cannot upgrade ts-node, downgrade Node.js to 18.x LTS.
- Always check for outdated dependencies with `npm outdated`.

---

See also: docs/first-principles.md and docs/5.2-cli-requirements.md
