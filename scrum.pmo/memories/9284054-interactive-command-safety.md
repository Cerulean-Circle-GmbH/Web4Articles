# Memory ID: 9284054 - Interactive Command Safety

**Title:** Interactive Command Safety - Background Agent Limitations  
**Created:** 2025-09-24 (from process.memory.fixed.md)  
**Source:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0308/scrum.pmo/roles/_shared/PDCA/bad.interactive.sh.commands.md) | [§/scrum.pmo/roles/_shared/PDCA/bad.interactive.sh.commands.md](../roles/_shared/PDCA/bad.interactive.sh.commands.md)

## Memory Content

Background agents CANNOT handle interactive prompts and will hang indefinitely on commands requiring user input.

**Critical Bad Commands:**
- `git pull` (without --no-edit)  
- `git cherry-pick` (without --no-commit)
- `git merge`, `git rebase`
- `npm install` (without --yes)
- `apt-get install` (without -y)

**Safe Alternatives:**
- `git pull --no-edit origin branch`
- `git cherry-pick --no-commit`  
- `npm ci` or `npm install --yes`
- `apt-get install -y package`

**Recovery:** Background agents cannot send Ctrl+C, requiring new terminal session if hung.

## Prevention Protocol
1. Always use non-interactive flags for background agent safety
2. Apply timeout protocols: `timeout 30s git pull --no-edit`
3. Use safety protocols from bad.interactive.sh.commands.md
4. Test commands with timeouts in background agent environment

## Violation Impact
- Terminal session becomes unresponsive
- Previous work may be lost if not committed
- Requires starting new terminal session
- Can block entire workflow indefinitely