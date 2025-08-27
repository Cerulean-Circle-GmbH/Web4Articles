[Back to Index](../../../index.md) | [Back to Project Journal](../project.journal.overview.md)

# Branch Overview

**Generated:** 2025-08-25 15:06 UTC  
**Repository:** [Web4Articles](https://github.com/Cerulean-Circle-GmbH/Web4Articles)  
**Current Branch:** dev/2025-08-25-UTC-1308

## Branch Categorization

### Branches Not to Touch (Protected)

These branches serve special purposes and should be handled with care:

- **origin/main** - Production branch (protected)
- **origin/release/dev** - Main development integration branch
- **origin/release/production** - Production release branch
- **origin/release/testing** - Testing release branch
- **origin/retro/2025-08-10-agent-retro** - Retrospective archive (historical)
- **origin/save/start** - Save/Restart Agent operations branch

### Unmerged Branches (64 total)

These branches have not been merged into main and may contain active work:

#### Active Development Branches
- **origin/dev/2025-08-25-UTC-1308** ← Current branch (Background Agent session)
- **origin/dev/2025-08-25-UTC-0845** - Development session
- **origin/dev/2025-08-24-UTC-1248** - Recovery session
- **origin/dev/2025-08-24-UTC-0917** - Development session
- **origin/dev/2025-08-24-UTC-0857** - Development session
- **origin/dev/2025-08-23-UTC-1529** - Development session
- **origin/dev/sprint5** - Sprint 5 development

#### Cursor Background Agent Branches
- **origin/cursor/start-background-process-10df** - Background process
- **origin/cursor/start-background-process-dcf6** - Background process
- **origin/cursor/start-minimalist-process-5289** - Minimalist process
- **origin/cursor/recovery-2025-08-20-0950** - Recovery session
- **origin/cursor/recovery-2025-08-16-2134** - Recovery session
- **origin/cursor/recovery-2025-08-16-1854** - Recovery session
- **origin/cursor/recovery-from-readme-20250819-0949** - Recovery from README
- **origin/cursor/tsranger-v22-testing-2025-08-20-1012** - TSRanger v22 testing

#### Feature Branches
- **origin/feature/eod-2025-08-24-background-agent** - End of day background agent
- **origin/feature/recovery-agent** - Recovery agent implementation
- **origin/feature/TSRangerColumns** - TSRanger columns feature
- **origin/feature/user** - User component development

#### Fix Branches
- **origin/fix/v2.5** - Version 2.5 fixes

#### Integration/Test Branches
- **origin/integration/team-a-b-2025-08-20** - Team integration
- **origin/test/recovery** - Recovery testing
- **origin/test/tsrangerV22FixedTestCasesApproachThomas** - TSRanger v22 test cases

#### Temporary Merge Branches (13 total)
- origin/temp-pdca-merge-* (various timestamps)
- origin/test-merge/* (latest and prev1-9 versions)

#### Other Cursor Branches (Multiple recovery attempts)
- origin/cursor/recover-from-readme-file-* (multiple versions)
- origin/cursor/execute-role-from-readme-and-add-to-project-4f37
- origin/cursor/recover-scrum-master-info-from-readme-fdc0
- origin/cursor/recover-scrum-session-from-readme-53bc
- origin/cursor/recover-from-readme-for-sprint-3-po-2719

### Already Merged Branches (36 total)

These branches have been successfully merged into main:

#### Cursor Automation Branches
- origin/cursor/automate-gitscrum-project-setup-and-management-3bc8
- origin/cursor/automate-license-header-and-backlink-enforcement-3dd3
- origin/cursor/enhance-terminal-help-and-preview-9502
- origin/cursor/generate-project-journal-and-status-dfd0
- origin/cursor/get-workspace-tree-eff5
- origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc
- origin/cursor/plan-new-sprint-with-tsranger-v2-ef48
- origin/cursor/plan-ranger-shell-sprint-c396
- origin/cursor/refactor-tsranger-to-one-class-per-file-7b09
- origin/cursor/review-readme-and-sprint-2-work-5861

#### Cursor Recovery Branches
- origin/cursor/recover-from-readme-file-0c0e
- origin/cursor/recover-readme-and-overview-remote-branches-6e9e
- origin/cursor/recover-readme-and-test-state-machine-a372
- origin/cursor/recover-readme-for-pdca-entry-check-9aa0
- origin/cursor/recovery-2025-08-12-0923
- origin/cursor/recovery-2025-08-12-1038
- origin/cursor/recovery-2025-08-12-1102
- origin/cursor/recovery-2025-08-13-1526
- origin/cursor/recovery-2025-08-13-1537
- origin/cursor/recovery-2025-08-13-1557

#### Feature/Chore Branches
- origin/chore/branch-review-checklist
- origin/chore/sprint-4-devcontainer
- origin/docs/sprint-3-embed-svgs
- origin/feat/sprint-4-devcontainer-planning-pr
- origin/feat/tsranger-colors
- origin/feat/ts.ranger.good
- origin/feature/analyze-ranger
- origin/feature/branchStatusAgent
- origin/feature/ontology-agent
- origin/feature/research-agent
- origin/fix/pr-based-workflows
- origin/handover/backend

#### Release Branches
- origin/release/v1.0.0.plan

#### Test Branches
- origin/test/wentAstray

## Summary Statistics

- **Total Remote Branches:** 100
- **Unmerged Branches:** 64 (64%)
- **Merged Branches:** 36 (36%)
- **Protected Branches:** 6
- **Temporary Branches:** 13 (temp-pdca-merge-*)
- **Active Development Branches:** 7 (dev/*)
- **Cursor Branches:** 43 (cursor/*)

## Recommendations

1. **Cleanup Candidates:**
   - All 13 `temp-pdca-merge-*` branches appear to be temporary and can likely be deleted
   - The 10 `test-merge/*` branches seem to be test artifacts
   - Multiple `cursor/recover-from-readme-file-*` branches (8 versions) could be consolidated

2. **Active Work:**
   - Current session on `dev/2025-08-25-UTC-1308`
   - Recent development on dev/UTC branches from past 3 days
   - Feature branches for user component and recovery agent appear active

3. **Branch Hygiene:**
   - 64% of branches are unmerged, indicating need for cleanup
   - Many cursor recovery branches could be archived after verification
   - Consider establishing branch lifetime policies

4. **Protected Status:**
   - Maintain protection on main, release/*, and retro branches
   - save/start should remain for Save/Restart Agent operations

---

*Generated by Background Agent following BranchStatusAgent process standards*

[Back to Index](../../../index.md) | [Back to Project Journal](../project.journal.overview.md)