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
- **Automatically updated** on:
  - Every push to any feature branch (immediate CI testing)
  - After PR merge to main (production sync)
- Used for continuous integration and early testing
- May contain experimental code from feature branches
- May have merge conflicts that don't block PR to main

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

### feature-to-dev.yml
- **Triggers on every push to any feature branch**
- Automatically merges feature branches into release/dev
- Provides immediate CI feedback
- Creates issues only for significant conflicts

### quality-checks.yml
- **Triggers on every push to feature branches and PRs to main**
- Runs comprehensive quality checks:
  - **Spell Check**: Validates spelling in markdown files
  - **Cross-Link Check**: Ensures internal links are valid
  - **Ontology Check**: Validates term definitions and usage
  - **License Check**: Ensures proper license headers
  - **Backlink Check**: Verifies markdown files have proper backlinks
- Reports issues as warnings/errors in GitHub Actions

### auto-merge-release-dev.yml
- **Triggers on PR merge to main** (NOT on push)
- Automatically merges main into release/dev
- Ensures release/dev includes production code
- Creates issues on merge conflicts

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
feature/* → release/dev (on every push for CI)
    ↓
    PR → main (production) → release/dev → release/testing
    ↑     ↑                  ↑           ↑
    Review & Approval       Re-sync     Manual promotion
                           with prod
           
    main ≡ release/production (kept in sync)
```

### Continuous Integration Flow
1. Push to feature branch → Auto-merge to release/dev (immediate CI)
2. Create PR to main → Code review process
3. PR approved & merged → main updated (production)
4. Main merged to release/dev → Ensures dev has production code
5. Manual promotion to release/testing when ready

## Key Points

- **main = production**: Every PR merge to main is a production deployment
- **No Direct Push**: Main branch is protected, PR-only
- **release/production**: Mirror of main for deployment compatibility
- **release/dev**: Continuous integration from ALL feature branches
- **release/testing**: Stable testing environment, manually updated

## Benefits of This CI Approach

### Early Integration Testing
- Every push to a feature branch is immediately tested in release/dev
- Integration issues discovered early, not at PR time
- Developers get immediate feedback on compatibility

### Non-Blocking Development
- Conflicts in release/dev don't block PR to main
- Feature branches can be developed independently
- release/dev serves as a "canary" environment

### Clear Separation of Concerns
- **release/dev**: Wild west - all features mixed for early testing
- **main**: Clean, reviewed, production-ready code only
- **release/testing**: Stable, curated subset for QA

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