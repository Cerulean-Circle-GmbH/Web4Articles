<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Sprint 12 Planning](../planning.md)

# Task 12.4: Fix Journal Overview Update Process

## Status: Partial Complete ⚠️

## Problem Statement
Your observation:
> "i miss the project.journal.overview.md"

The update script has issues:
- Shows sed errors during execution
- May not be updating all sessions correctly
- Missing proper links and navigation

## Solution
Fix the update-journal-overview.sh script and ensure it runs properly.

## Execution Plan

### 1. Debug Script Issues
```bash
# Current errors:
sed: -e expression #1, char 17: Invalid preceding regular expression
```

### 2. Verify All Sessions Listed
- Check that all 25 sessions appear
- Ensure PDCA counts are accurate
- Verify links are clickable

### 3. Add Enhanced Navigation
Apply dual-link format to journal overview:
```markdown
**Session**: [GitHub](url) [./2025-08-16-1201-cleanup/](url)
```

### 4. Automate in Recovery Process
Already added but verify it works correctly.

## Success Criteria
- [ ] No sed errors during execution
- [ ] All sessions properly listed
- [ ] Dual-link format applied
- [ ] Accurate PDCA counts
- [ ] Runs automatically in recovery