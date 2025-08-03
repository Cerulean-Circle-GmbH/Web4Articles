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
