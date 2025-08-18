# Agent Recovery Process

## Project
Web4Articles - Markdown-based WIKI for CIRAS articles. AI-managed CMMI Level 4 SCRUM.

## Recovery Steps
```bash
git checkout origin/feature/analyze-ranger
git checkout -b recovery/$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$(date +"%Y-%m-%d-%H%M")/pdca
```

## Project Structure
```
scrum.pmo/
├── roles/      # Process docs
├── sprints/    # Sprint 0-8 + planning
└── project.journal/  # Session PDCAs

components/     # Git submodules
docs/          # Architecture, guides
wiki/          # Project ontology
```

## Key Files
- README.md - First principles, tech stack
- index.md - File listing (stale)
- qa-feedback-log.md - QA history
- recovery.md - Recovery history

## Tech Stack
- TypeScript ESM only
- Node.js 18+
- Vitest (no Jest)
- Radical OOP
- Git submodules per component

## Current State
- Latest: Sprint 8 (ranger analysis)
- Branch: feature/analyze-ranger
- Status: Recovery improvements

## Merge Other Branches
```bash
# After recovery setup, if needed:
git merge origin/release/dev
git merge origin/[agent-specific-branch]

# If breaks:
git reset --hard origin/feature/analyze-ranger
```

## Start Working
Create PDCA, document progress, continue task.