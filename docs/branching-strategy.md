[Back to Docs](../)

# Branching Strategy

## Overview

This project follows a continuous integration branching strategy with automated merging to keep integration branches in sync.

## Branch Types

### 1. **main** (Protected)
- Production-ready code
- All changes via reviewed Pull Requests
- Automatically triggers merge to release/dev

### 2. **release/dev** (Continuous Integration)
- **Automatically updated** on every push to main
- Always in sync with main branch
- Used for continuous integration and development
- May contain merge commits from auto-merge process

### 3. **release/testing** 
- Pre-production testing branch
- Manually updated from release/dev when ready for testing
- More stable than release/dev
- Used for QA and staging deployments

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

### Auto-merge to release/dev

The project uses **automatic merging** from main to release/dev because:

1. **Continuous Integration**: Ensures release/dev always has latest approved changes
2. **Early Conflict Detection**: Identifies integration issues immediately
3. **Simplified Workflow**: Reduces manual merge overhead
4. **Testing Isolation**: release/testing branch provides stable testing environment

### Workflow

1. **Feature Development**: Work on feature branches
2. **Pull Request**: Create PR to main when ready
3. **Code Review**: Team reviews and approves
4. **Merge to main**: PR merged after approval
5. **Auto-merge**: GitHub Action automatically merges main → release/dev
6. **Testing**: When ready, manually promote release/dev → release/testing

## GitHub Actions Workflows

### auto-merge-release-dev.yml
- Triggers on every push to main
- Automatically merges main into release/dev
- Creates issues on merge conflicts
- Provides merge reports

### eod-merge.yml
- Daily documentation snapshots
- Captures branch states and project status

## Handling Merge Conflicts

If auto-merge fails due to conflicts:

1. An issue is automatically created
2. Manual intervention required:
   ```bash
   git checkout release/dev
   git merge main
   # Resolve conflicts
   git push origin release/dev
   ```

## Best Practices

1. **Never push directly to main or release/***
2. **Always use Pull Requests for main**
3. **Keep feature branches small to minimize conflicts**
4. **Delete branches after merge**
5. **Monitor auto-merge status**
6. **Resolve conflicts promptly**

## Branch Flow

```
feature/* → main → release/dev → release/testing → production
           ↑       ↑              ↑
           PR     Auto-merge     Manual promotion
```

## Benefits of Auto-merge

- **Always Current**: release/dev reflects latest approved code
- **Fast Feedback**: Integration issues detected immediately
- **Clear Separation**: Testing happens in release/testing, not release/dev
- **Reduced Overhead**: No manual merge process needed
- **Audit Trail**: All merges tracked in Git history

[Back to Docs](../)