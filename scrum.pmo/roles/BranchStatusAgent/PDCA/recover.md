# Recovery Handover — BranchStatusAgent

Purpose: ensure Cursor retirement can be recovered smoothly; provide exact steps, artifacts, and links to regenerate branch reports and continue PDCA.

Context snapshot (UTC 2025-08-14):
- Working branch: `feature/branchStatusAgent`
- Latest journal (favorite format): `scrum.pmo/project.journal/2025-08-14-1617/branch-overview.md`
- Tools: `scrum.pmo/roles/BranchStatusAgent/tools/*`
- Templates/Process updated for release/dev section and dual-linking

What this role delivers:
- Favorite branch overview with sections (order): Unmerged → release/dev, Unmerged → main, Merged → main, Not to touch, Summary
- Checklists with protected branches and release/dev awareness
- PDCA per prompt with dual-link Act entries

Protected policy (do not touch):
- Branches: `origin/main`, `origin/retro/2025-08-10-agent-retro`
- No force pushes to protected branches

Next recovery — do this exactly:
1) Ensure clean base
   - `git fetch --all --prune`
   - `git checkout feature/branchStatusAgent && git pull --ff-only`
2) Create a fresh journal folder
   - `TS=$(date -u +%F-%H%M)`
   - `mkdir -p scrum.pmo/project.journal/$TS`
   - Generate favorite branch overview:
     - `bash scrum.pmo/roles/BranchStatusAgent/tools/branch_overview_favorite.sh scrum.pmo/project.journal/$TS/branch-overview.md`
   - `git add scrum.pmo/project.journal/$TS && git commit -m "journal: branch overview ($TS)"`
3) Optional: Generate checklist
   - `bash scrum.pmo/roles/BranchStatusAgent/tools/branches_checklist_generate.sh scrum.pmo/project.journal/$TS/branches.checklist.md`
   - `git add scrum.pmo/project.journal/$TS/branches.checklist.md && git commit -m "journal: branches checklist ($TS)"`
4) Write a PDCA entry (quote the prompt)
   - `bash scrum.pmo/roles/BranchStatusAgent/tools/create_pdca.sh BranchStatusAgent "<paste prompt>"`
   - `git add scrum.pmo/roles/BranchStatusAgent/PDCA/*.md && git commit -m "pdca: <short summary>"`
5) Push
   - `git push`

Robustness notes (lessons learned):
- Tool script tolerates missing GitHub token (skips PR lookup) and uses safe printf to avoid crashes
- Avoid long chained one-liners for stateful ops; prefer atomic commands

Minimal references to resume quickly:
- Favorite overview tool:
  - [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/branchStatusAgent/scrum.pmo/roles/BranchStatusAgent/tools/branch_overview_favorite.sh): [scrum.pmo/roles/BranchStatusAgent/tools/branch_overview_favorite.sh](../../roles/BranchStatusAgent/tools/branch_overview_favorite.sh)
- Checklist generator:
  - [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/branchStatusAgent/scrum.pmo/roles/BranchStatusAgent/tools/branches_checklist_generate.sh): [scrum.pmo/roles/BranchStatusAgent/tools/branches_checklist_generate.sh](../../roles/BranchStatusAgent/tools/branches_checklist_generate.sh)
- PDCA creator:
  - [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/branchStatusAgent/scrum.pmo/roles/BranchStatusAgent/tools/create_pdca.sh): [scrum.pmo/roles/BranchStatusAgent/tools/create_pdca.sh](../../roles/BranchStatusAgent/tools/create_pdca.sh)
- Latest journal example:
  - [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/branchStatusAgent/scrum.pmo/project.journal/2025-08-14-1617/branch-overview.md): [scrum.pmo/project.journal/2025-08-14-1617/branch-overview.md](../../project.journal/2025-08-14-1617/branch-overview.md)

End of handover for BranchStatusAgent.