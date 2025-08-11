[Back to Docs](../)

# Branching Strategy

## Overview

This project follows a continuous integration branching strategy with automated merging triggered by Pull Request approvals. **Direct pushes to main are strictly forbidden.**

## Branch Types

### 1. **main** (Production - Protected)
- **Production-ready code** (identical to release/production)
- **NO DIRECT PUSHES ALLOWED** - main is protected
- All changes MUST go through Pull Requests
- PR merges automatically trigger:
  - Merge to release/dev
  - Sync to release/production

### 2. **release/production** (Mirror of main)
- **Identical to main** - exists for deployment compatibility
- Automatically synced after PR merge to main
- May be used by deployment systems expecting a "release" prefix
- Never push directly to this branch

### 3. **release/dev** (Continuous Integration)
- **Automatically updated** after PR merge to main
- Always in sync with production after PR approval
- Used for continuous integration and development
- May contain merge commits from auto-merge process

### 4. **release/testing** 
- Pre-production testing branch
- Manually updated from release/dev when ready for testing
- More stable than release/dev
- Used for QA and staging deployments

### 5. **Feature Branches**
- **cursor/*** - AI-generated feature branches
- **feat/*** - Human-initiated features
- **chore/*** - Maintenance and housekeeping
- **docs/*** - Documentation updates

### 6. **Special Purpose**
- **handover/*** - Knowledge transfer branches
- **test/*** - Experimental branches
- **retro/*** - Retrospective documentation

## Merge Strategy

### PR-Based Auto-merge

The project uses **Pull Request-based automatic merging** because:

1. **Production Safety**: No one can accidentally push to production (main)
2. **Code Review**: All changes are reviewed before reaching production
3. **Automated Integration**: After PR approval, automation handles the rest
4. **Audit Trail**: Every change to production is tracked through PRs

### Workflow

1. **Feature Development**: Work on feature branches
2. **Create Pull Request**: Open PR from feature branch to main
3. **Code Review**: Team reviews and approves PR
4. **PR Merge**: Approved PR is merged to main (this deploys to production!)
5. **Automatic Actions**: GitHub Actions automatically:
   - Merges main → release/dev
   - Syncs main → release/production
6. **Testing**: When ready, manually promote to release/testing for QA

## GitHub Actions Workflows

### auto-merge-release-dev.yml
- **Triggers on PR merge to main** (NOT on push)
- Automatically merges main into release/dev
- Creates issues on merge conflicts
- Provides merge reports with PR details

### sync-production.yml
- **Triggers on PR merge to main** (NOT on push)
- Keeps release/production identical to main
- Uses force push to ensure exact match

### eod-merge.yml
- Daily documentation snapshots
- Captures branch states and project status

## Branch Protection Rules

### main Branch Protection (REQUIRED)
```yaml
- Require pull request reviews before merging
- Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators in restrictions
- Restrict who can push to matching branches: NOBODY
```

## Handling Merge Conflicts

If auto-merge fails due to conflicts after PR merge:

1. An issue is automatically created with PR details
2. Manual intervention required:
   ```bash
   git checkout release/dev
   git merge main
   # Resolve conflicts
   git push origin release/dev
   ```

## Best Practices

1. **NEVER attempt to push directly to main** - it will be rejected
2. **ALWAYS use Pull Requests for all changes**
3. **Keep feature branches small to minimize conflicts**
4. **Delete branches after PR merge**
5. **Monitor auto-merge status after PR approval**
6. **Resolve conflicts promptly**

## Branch Flow

```
feature/* → PR → main (production) → release/dev → release/testing
           ↑     ↑                  ↑              ↑
           Review & Approval       Auto-merge     Manual promotion
                                   on PR merge
           
           main ≡ release/production (kept in sync)
```

## Key Points

- **main = production**: Every PR merge to main is a production deployment
- **No Direct Push**: Main branch is protected, PR-only
- **release/production**: Mirror of main for deployment compatibility
- **release/dev**: Continuous integration, automatically synced after PR merge
- **release/testing**: Stable testing environment, manually updated

## Common Mistakes to Avoid

❌ **DON'T** try to push directly to main  
❌ **DON'T** work directly on main branch  
❌ **DON'T** bypass PR process  
❌ **DON'T** merge PRs without review  

✅ **DO** create feature branches  
✅ **DO** open PRs for all changes  
✅ **DO** wait for reviews  
✅ **DO** let automation handle the rest  

[Back to Docs](../)