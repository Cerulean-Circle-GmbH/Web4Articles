[Back to Docs](../)

# Branching Strategy

## Overview

This project follows a controlled branching strategy aligned with CMMI Level 4 principles, ensuring quality and traceability.

## Branch Types

### 1. **main** (Protected)
- Production-ready code
- All changes via reviewed Pull Requests
- Triggers documentation updates on merge

### 2. **release/dev** (Integration)
- Integration branch for feature testing
- Receives selective merges from approved branches
- **NOT** automatically updated on every push
- Used for integration testing before main

### 3. **release/testing** 
- Pre-production testing branch
- Staging environment deployments

### 4. **Feature Branches**
- **cursor/*** - AI-generated feature branches
- **feat/*** - Human-initiated features
- **chore/*** - Maintenance and housekeeping
- **docs/*** - Documentation updates

### 5. **Special Purpose**
- **handover/*** - Knowledge transfer branches
- **test/*** - Experimental branches
- **retro/*** - Retrospective documentation

## Merge Strategy

### Why NOT Auto-merge on Every Push

1. **Quality Control**: Every merge to release/dev should be intentional and reviewed
2. **CMMI Compliance**: Level 4 requires measured, controlled processes
3. **Branch Stability**: Prevents work-in-progress from breaking integration
4. **Clear History**: Avoids cluttering with incomplete commits

### Recommended Approach

1. **Feature Development**: Work on feature branches
2. **Pull Request**: Create PR to main when ready
3. **Code Review**: Team reviews and approves
4. **Merge to main**: PR merged after approval
5. **Selective Integration**: Either:
   - Automatic merge to release/dev after PR approval
   - Manual trigger via workflow dispatch
   - Scheduled batch merges

## GitHub Actions Workflows

### eod-merge.yml
- Daily documentation snapshots
- Captures branch states and project status

### selective-merge.yml
- Triggered on PR merge to main
- Manual trigger option
- Merges approved code to release/dev
- Runs tests before pushing

## Best Practices

1. **Never push directly to main or release/***
2. **Always use Pull Requests for main**
3. **Keep feature branches small and focused**
4. **Delete branches after merge**
5. **Use descriptive branch names**
6. **Regular EOD documentation**

## Decision: No Auto-merge on Push

After analysis, automatic merging on every push is **not recommended** because:

- It bypasses quality gates
- It conflicts with CMMI Level 4 requirements
- It risks breaking the integration branch
- It removes human oversight from the process

Instead, use the selective merge workflow that runs after PR approval or can be manually triggered for specific branches.

[Back to Docs](../)