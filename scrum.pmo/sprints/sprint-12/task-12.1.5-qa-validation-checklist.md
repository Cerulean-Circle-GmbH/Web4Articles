[Back to Sprint 12 Planning](../planning.md)

# Task 12.5: Comprehensive Cleanup Validation Checklist

## Status: Planning

## Problem Statement
Your observation:
> "a lot more to cleanup. add tasks and check better."

Need systematic validation to catch all issues before declaring cleanup complete.

## Solution
Create comprehensive checklist for all cleanup operations.

## Validation Checklist

### 1. PDCA Structure
- [ ] All PDCAs use `YYYY-MM-DD-UTC-HHMM.md` format
- [ ] PDCAs in correct role folders
- [ ] No PDCAs in sprint folders
- [ ] Chronological order maintained
- [ ] All have dual-link navigation

### 2. Sprint Structure  
- [ ] Only contains: planning.md, requirements.md, tasks/
- [ ] No articles in sprint folders
- [ ] No PDCAs in sprint folders
- [ ] All tasks properly numbered
- [ ] Planning consolidated to single file

### 3. Article Organization
- [ ] All in `/workspace/articles/platform/series/`
- [ ] Consistent naming convention
- [ ] No version conflicts (multiple 01-)
- [ ] All have proper headers

### 4. Journal Sessions
- [ ] project.state.md exists
- [ ] tree.index.md exists
- [ ] pdca/ structure correct
- [ ] All links working
- [ ] Journal overview updated

### 5. Navigation
- [ ] All references use dual-link format
- [ ] project.journal.overview.md current
- [ ] No broken links
- [ ] Quick navigation blocks in PDCAs

### 6. Git Hygiene
- [ ] All moves via `git mv`
- [ ] History preserved
- [ ] No uncommitted changes
- [ ] Branch up to date

## Automation
This checklist should become part of:
1. EOD cleanup routine
2. CI/CD validation
3. Recovery process verification

## Success Criteria
- [ ] All items checked
- [ ] No errors found
- [ ] Ready for next session