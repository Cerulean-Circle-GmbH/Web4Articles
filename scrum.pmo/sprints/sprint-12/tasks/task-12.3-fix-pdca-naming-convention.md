[Back to Sprint 12 Planning](../planning.md)

# Task 12.3: Fix PDCA Naming Convention

## Status: Planning

## Problem Statement
Your observation:
> "the pdcas became speaky naming but are then not in timely order"

Current issue: PDCAs in sprint-12-work folder have descriptive names like:
- `pdca-article-progression.md`
- `pdca-distillation-wisdom.md`
- `pdca-you-revealed.md`

This breaks chronological ordering and makes timeline tracking difficult.

## Solution
All PDCAs should follow strict timestamp naming: `YYYY-MM-DD-UTC-HHMM.md`

## Execution Plan

### 1. Rename Existing PDCAs
Map descriptive names to proper timestamps by checking git history:
```bash
# Get original creation time from git
git log --diff-filter=A --format='%aI' -- "pdca-article-progression.md"

# Rename to timestamp format
git mv pdca-article-progression.md 2025-08-15-UTC-1000.md
```

### 2. Update PDCA Template
Enforce timestamp-only naming in templates and documentation.

### 3. Add Description Inside PDCA
Move descriptive text to PDCA title/header:
```markdown
# 📋 PDCA Cycle: Article Progression Strategy - 2025-08-15-UTC-1000
```

## Success Criteria
- [ ] All PDCAs use timestamp naming
- [ ] Chronological order restored
- [ ] Descriptive titles moved inside files
- [ ] Git history preserved