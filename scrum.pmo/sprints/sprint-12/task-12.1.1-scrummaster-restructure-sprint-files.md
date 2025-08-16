[Back to Sprint 12 Planning](../planning.md)

# Task 12.1: Restructure Sprint 12 Files

## Status: Awaiting QA Review

## Problem Statement
Sprint 12 file structure has deviated from project standards:
- PDCAs stored directly in sprint folder (should be in journal sessions)
- Articles stored in sprint folder (should be in `/workspace/articles/`)
- Multiple planning files (should have one)
- No proper session structure

## Solution
Restructure Sprint 12 to follow CMMI Level 4 standards per recovery process.

## Execution Plan

### 1. Move Articles to Proper Location
```bash
# Create articles directory if needed
mkdir -p /workspace/articles/medium.com/sprint-12-series/

# Move all article versions
git mv article-v1-chaos-to-order.md /workspace/articles/medium.com/sprint-12-series/
git mv article-v2-tsranger-journey.md /workspace/articles/medium.com/sprint-12-series/
git mv article-v3-consciousness-journey.md /workspace/articles/medium.com/sprint-12-series/
git mv article-v4-developer-struggles.md /workspace/articles/medium.com/sprint-12-series/
```

### 2. Move PDCAs to Current Session
```bash
# Assuming we're in session 2025-08-15-0947-article-writing
SESSION_DIR="/workspace/scrum.pmo/project.journal/2025-08-15-0947-article-writing"

# Move all PDCAs with proper timestamps
git mv pdca-*.md $SESSION_DIR/pdca/role/scrummaster/
```

### 3. Clean Sprint Folder
```bash
# Keep only essential sprint files
# - planning.md (main planning)
# - tasks/ (this folder)

# Remove redundant planning files
git rm planning-article-series.md  # Content to be integrated into main planning
git rm planning.input.md           # Historical, not needed
```

### 4. Update References
- Update `planning.md` with correct article paths
- Update session PDCAs with correct cross-references
- Ensure all links work

### 5. Create Proper Requirements
```bash
# Extract requirements from various PDCAs into requirements.md
```

## Success Criteria
- [ ] Sprint folder contains only: `planning.md`, `requirements.md`, `tasks/`
- [ ] All articles in `/workspace/articles/medium.com/`
- [ ] All PDCAs in journal session structure
- [ ] All links functional
- [ ] Git history preserved via `git mv`

## QA Notes
Awaiting your review on this restructuring plan. Key questions:
1. Should we create a new session for the restructuring work?
2. Should historical PDCAs get current timestamps or preserve original?
3. Any other structural concerns?

"after qa rev you fix it…"