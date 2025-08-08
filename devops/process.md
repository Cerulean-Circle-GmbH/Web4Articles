# Submodule Workflow Best Practices

## Overview
This document outlines best practices for working with git submodules in this project, with a focus on the wiki submodule. Follow these steps to ensure changes are properly committed and pushed.

## Common Operations

### 1. Editing Files in a Submodule
- Make your changes inside the submodule directory (e.g., `wiki/`).

### 2. Committing Changes in the Submodule
- Enter the submodule directory: `cd wiki`
- Stage and commit your changes:
  ```bash
  git add <file1> <file2> ...
  git commit -m "Describe your changes"
  git push
  ```

### 3. Updating the Submodule Reference in the Parent Repo
- Return to the parent repository root: `cd ..`
- Stage the submodule reference update:
  ```bash
  git add wiki
  git commit -m "Update wiki submodule reference after <describe changes>"
  git push
  ```

### 4. Pulling Latest Submodule Changes
- To update your local submodule to the latest commit:
  ```bash
  git submodule update --remote wiki
  ```

## Tips
- Always commit and push in the submodule before updating the parent repo reference.
- Use `git status` in both the submodule and parent repo to check for uncommitted changes.
- Document submodule changes in process logs for traceability.

## Troubleshooting
- If you see `Changes not staged for commit` in the parent repo after editing the submodule, you likely need to commit/push in the submodule first.
- If the submodule appears out of sync, use `git submodule update --remote`.

## References
- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- See also: `scrum.pmo/sprints/sprint-1/task-submodule-management-tool.md`
