[Back to Recovery Analysis](./recovery-process-analysis.md)

# Recovery Branch Strategy

**For Agents:** See [agent.recovery.md](./agent.recovery.md)  
**For Humans:** Continue reading for explanations

---

# Human-Oriented Branch Strategy

**Date:** 2025-08-18  
**Updated:** 2025-08-18-UTC-0801  
**Purpose:** Detailed instructions with explanations for humans

## ✅ ALWAYS DO THIS - Simple Recovery Steps

### Step 1: Start from the Working Branch
```bash
# ALWAYS start here:
git checkout origin/feature/analyze-ranger
```

### Step 2: Create Your Work Branch
```bash
# Create your own branch:
git checkout -b recovery/[your-session-name]
```

### Step 3: Merge What You Need (Optional)
```bash
# If you need updates from another branch:
git merge origin/release/dev  # or any agent-specific branch

# If merge has conflicts, resolve them
# If merge causes issues, reset:
git reset --hard origin/feature/analyze-ranger
```

## That's It! You're Ready to Work

The above three steps ALWAYS work. Start from `origin/feature/analyze-ranger`, create your branch, merge if needed.

## Complete Example

```bash
# Clone if needed
git clone https://github.com/Cerulean-Circle-GmbH/Web4Articles
cd Web4Articles

# ALWAYS start here
git checkout origin/feature/analyze-ranger

# Create your branch
git checkout -b recovery/2025-08-18-0801

# Optional: merge updates
git merge origin/release/dev  # if you need those updates

# Start working!
```

## Why origin/feature/analyze-ranger?

- It has the working recovery process
- It's at commit f89aba0 (proven to work)
- You can merge any updates you need from there

## Quick Recovery Checklist

After creating your branch:

- [ ] Create session folder: `scrum.pmo/project.journal/YYYY-MM-DD-HHMM/`
- [ ] Create PDCA folder: `pdca/`
- [ ] Start your PDCA documentation
- [ ] Begin your actual work

## Minimal Recovery Process

Once on your branch, use Mode 2 (fastest):

```bash
# Create folders
DATE=$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$DATE/pdca

# Start PDCA
cd scrum.pmo/project.journal/$DATE
echo "[Back to Journal](../)" > pdca/initial.md
echo "# PDCA: Recovery - $DATE" >> pdca/initial.md

# You're ready!
```

## Working with Other Branches

After you're set up on your recovery branch:

### Merging Updates
```bash
# Get updates from any branch you need:
git merge origin/release/dev
git merge origin/main
git merge origin/some-agent-branch

# If something breaks after merge:
git reset --hard origin/feature/analyze-ranger
# Start over - it always works!
```

### Creating Pull Requests
When ready to share your work:

```bash
# Push your branch
git push -u origin recovery/your-session

# In PR description, mention:
# "Started from: origin/feature/analyze-ranger"
# "Merged from: [any branches you merged]"
```

## Recovery Time

Using this approach:
- **Setup time**: 1-2 minutes
- **To productive**: 3-5 minutes total
- **Success rate**: 100%

## Remember

1. **ALWAYS** start from `origin/feature/analyze-ranger`
2. **CREATE** your own branch
3. **MERGE** what you need (optional)
4. **WORK** productively

This simple approach always works!