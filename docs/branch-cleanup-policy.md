[Back to Docs](../)

# Branch Cleanup Policy

## Overview

This document describes the automated branch cleanup process that helps maintain a clean repository by identifying and removing stale merged branches.

## Automated EOD Branch Marking

Every day at 23:59 UTC, the EOD (End of Day) workflow automatically:

1. **Scans all remote branches**
2. **Identifies merged branches**
3. **Marks branches for deletion** based on:
   - Merged to `main`
   - Age since last activity
   - Not protected branches

## Deletion Markers

Branches are marked with different statuses in the daily branch overview:

- **[SAFE TO DELETE]** - Merged within the last 7 days
- **[MARKED FOR DELETION]** - Merged more than 7 days ago
- No marker - Active/unmerged branches or protected branches

## Protected Branches

The following branches are never marked for deletion:

- `main` - Production branch
- `release/dev` - CI/CD integration branch  
- `release/testing` - Testing environment
- `release/production` - Production mirror

## Cleanup Methods

### 1. Manual Script

Run the cleanup script locally:

```bash
./scripts/cleanup-merged-branches.sh
```

This script:
- Reads the latest EOD branch overview
- Shows branches marked for deletion
- Prompts for confirmation
- Deletes confirmed branches
- Updates local references

### 2. GitHub Action

Use the Branch Cleanup Report workflow:

1. Go to Actions → Branch Cleanup Report
2. Click "Run workflow"
3. Set parameters:
   - **Dry run**: `true` (report only) or `false` (delete)
   - **Age threshold**: Days before marking (default: 7)
4. Review the summary report
5. Re-run with dry_run=false to delete

### 3. Manual Deletion

Delete individual branches:

```bash
git push origin --delete branch-name
```

## Best Practices

1. **Review Before Deletion**
   - Check the EOD branch overview
   - Verify no active work in branches
   - Consider archiving important branches

2. **Regular Cleanup**
   - Run cleanup weekly or bi-weekly
   - Keep only active development branches
   - Archive completed feature branches

3. **Branch Naming**
   - Use descriptive names
   - Include ticket/issue numbers
   - Follow naming conventions

## Retention Guidelines

- **Feature branches**: Delete after merge + 7 days
- **Hotfix branches**: Delete after merge + 3 days
- **Release branches**: Keep indefinitely
- **Experimental branches**: Delete after 30 days of inactivity

## Recovery

If a branch is deleted by mistake:

1. Check the reflog: `git reflog`
2. Find the last commit SHA
3. Create a new branch: `git checkout -b recovered-branch SHA`
4. Push to remote: `git push origin recovered-branch`

## Automation

The cleanup process is integrated into:

- Daily EOD workflow (marking only)
- On-demand cleanup workflow
- Local cleanup script

This ensures a clean repository while maintaining safety through:
- Clear marking before deletion
- Confirmation prompts
- Protected branch lists
- Recovery procedures