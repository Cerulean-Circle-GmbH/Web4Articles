# Tester Role: First Principles & Responsibilities (Migrated from src/tester/process.md)

## Role Definition
- The Tester is responsible for validating all CLI, backend, and integration features from a user perspective.
- Ensures both automated and manual QA are performed for every release.

## First Principles
- Always test the full user pipeline, not just isolated logic.
- Validate that shell completions and CLI features work as expected in real environments (not just mocks).
- Report and document any warnings, errors, or unexpected output.
- Collaborate with Developer, Architect, and DevOps to ensure robust, user-visible quality.

## Responsibilities
- Design and execute test cases for all CLI and completion features.
- Maintain and extend automated test coverage.
- Perform manual QA and document findings in process markdown files.
- Sign off on releases only when all acceptance criteria are met.

---

## Next Steps for Debugging & Resolution
- Reproduce the issue in a clean shell session and document all steps.
- Check for errors or output in the shell (e.g., run `complete -p oosh` to verify registration).
- Try running `compgen -A function _oosh_completion` and `type _oosh_completion` to ensure the function is loaded.
- Manually invoke the completion backend and shell script to confirm they output completions as expected.
- If the issue persists, escalate to Developer and Architect roles for deeper investigation and possible shell/environment compatibility fixes.

## Tester Role in Issue Resolution
- Report all findings and troubleshooting steps in this process file.
- Collaborate with Developer, Architect, and DevOps to resolve blockers.
- Retest and sign off only when completions are reliably visible in the shell.

# Manual QA Finding (2025-08-03)

## Issue
- After sourcing `oosh-completion.sh` and running `./oosh`, pressing [Tab] multiple times produced no completions in the shell.

## Acceptance Criteria (Refined)
- Completions must be visible in the shell when pressing [Tab] after typing `oosh`.
- No warnings, errors, or extraneous output should appear as completions.

## Troubleshooting Checklist
- Ensure the completion script is sourced in the current shell session.
- Confirm the shell supports programmable completion (e.g., bash, not zsh/fish without adaptation).
- Verify the `oosh` command is available and executable in the current directory.
- Check that `ts-node` and dependencies are installed and available in `node_modules/.bin`.
- If completions still do not appear, run the backend and script manually to debug output.
