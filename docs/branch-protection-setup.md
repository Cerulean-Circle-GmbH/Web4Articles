[Back to Docs](../)

# Branch Protection Setup Guide

## Critical: main Branch Protection

Since main is production, it MUST be protected to prevent direct pushes. This guide shows how to set up branch protection rules.

## GitHub Branch Protection Settings

### Navigate to Settings
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Branches" in the left sidebar
4. Click "Add rule" or edit existing rule for `main`

### Required Protection Rules for `main`

✅ **Require a pull request before merging**
- [x] Require approvals: 1 (minimum)
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require review from CODEOWNERS (if using CODEOWNERS file)

✅ **Require status checks to pass before merging**
- [x] Require branches to be up to date before merging
- Add required status checks:
  - [ ] Tests (if you have test workflows)
  - [ ] Linting (if you have lint workflows)
  - [ ] Build (if you have build workflows)

✅ **Require conversation resolution before merging**
- [x] All conversations must be resolved

✅ **Include administrators**
- [x] Include administrators (even admins can't push directly)

✅ **Restrict who can push to matching branches**
- [x] Restrict pushes that create matching branches
- Leave the allowed people/teams empty (NOBODY can push)

❌ **Do NOT enable:**
- [ ] Allow force pushes (dangerous for production)
- [ ] Allow deletions (main should never be deleted)

### Additional Recommended Rules

✅ **Require signed commits** (optional but recommended)
- [x] Require signed commits

✅ **Lock branch** (optional for extra safety)
- [ ] Lock branch (prevents any changes - use carefully)

## Setting Up Protection via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Set branch protection rules
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Verifying Protection

After setting up protection, verify:

1. Try to push directly to main:
   ```bash
   git checkout main
   git commit --allow-empty -m "test"
   git push origin main
   # Should be rejected with protection error
   ```

2. Check protection status:
   ```bash
   gh api repos/:owner/:repo/branches/main/protection
   ```

## What Happens After Protection

### For Developers
- Cannot push directly to main
- Must create feature branches
- Must open PRs for all changes
- Must get reviews before merging

### For CI/CD
- Workflows trigger on PR merge, not push
- Auto-merge to release/dev works after PR approval
- Production sync happens automatically

### Error Messages
If someone tries to push to main, they'll see:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
```

## Emergency Override

In absolute emergencies only, admins can temporarily disable protection:
1. Go to Settings → Branches
2. Edit main rule
3. Uncheck "Include administrators"
4. Make emergency fix
5. **IMMEDIATELY re-enable protection**

⚠️ **WARNING**: This should be extremely rare and well-documented.

## Related Documentation
- [Branching Strategy](./branching-strategy.md)
- [GitHub Docs: Protected Branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

[Back to Docs](../)