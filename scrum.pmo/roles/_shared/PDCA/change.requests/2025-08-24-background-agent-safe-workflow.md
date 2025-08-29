# 📝 **Change Request: Safe Additive-Only Workflow**

**Date:** 2025-08-24-UTC-1420  
**Agent:** Background Agent 🕵️‍♂️  
**Type:** Enhancement  
**Priority:** High

## **Summary**
Critical workflow update: Replaced dangerous force-push with safe additive-only merge strategy that preserves all newer content in release/dev.

## **Current State**
The current howto.PDCA.md and auto-merge scripts contain force-push logic that can destroy commits. This caused a disaster where 819 commits were lost from release/dev.

## **Proposed Change**

### 1. Update howto.PDCA.md
Add new section after "Common Mistakes":
```markdown
## **🛡️ SAFE WORKFLOW: ADDITIVE-ONLY MERGES**

**CRITICAL:** Force push can destroy data! Use safe additive-only workflow:
- Compare file timestamps before merging
- Only add files that are newer or don't exist
- Skip files that are older in your branch
- NEVER use --force or --force-with-lease
- Create PR if normal push fails

**Implementation:** Use pdca-auto-merge.sh which now implements safe additive logic
```

### 2. Update all agent process.md files
Add warning about force push and reference to safe workflow.

### 3. Document the new cherry-pick-newest.sh tool
Available for syncing newest files from release/dev.

## **Rationale**
- Force push from minimal branch destroyed 819 commits
- User requirement: "never update release/dev with older content"
- release/dev should collect ALL latest changes safely
- Prevents future data loss disasters

## **Example**
Before (dangerous):
```bash
git push --force-with-lease origin HEAD:release/dev
```

After (safe):
```bash
# Only newer files are staged and pushed
git push origin $BRANCH:release/dev  # No force!
```

---
**Status:** [X] Pending Review | [ ] In Progress | [ ] Completed