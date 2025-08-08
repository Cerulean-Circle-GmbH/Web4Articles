
# Task: Submodule Management CLI Tool

## Goal
Create a CLI tool to automate and simplify git submodule workflows for this project.

## Concrete Requirements
- List all submodules and their status (clean/dirty, ahead/behind, unpushed commits). See [submodule-status.md](submodule-status.md)
- For a given submodule:
  - Stage, commit, and push changes with a user-supplied message ([submodule-commit.md](submodule-commit.md))
  - Pull latest changes from remote ([submodule-update.md](submodule-update.md))
  - Show current commit and branch
- For the parent repo:
  - Detect when a submodule reference has changed and prompt to commit/push the parent
- Provide a single command to update all submodules to their latest remote commit ([submodule-update.md](submodule-update.md))
- Provide clear, actionable error messages for all git failures
- Print a summary of all actions taken
- Usage: `npx submodule-tool <command> [options]`
- Document all commands and options in a dedicated README

## Acceptance Criteria
- All requirements above are implemented and tested
- Tool is available in `src/sh/` or `src/ts/` and executable from project root
- Usage and troubleshooting are documented in the tool's README
- The tool links to [Submodule Workflow Best Practices](../../../devops/process.md) for background

## References
- [Submodule Workflow Best Practices](../../../devops/process.md)
- [submodule-status.md](submodule-status.md)
- [submodule-commit.md](submodule-commit.md)
- [submodule-update.md](submodule-update.md)
