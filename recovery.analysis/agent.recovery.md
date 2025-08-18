# Agent Recovery Process

## What This Project Is
Web4Articles - Creating markdown-based WIKI for CIRAS articles using AI-managed CMMI Level 4 SCRUM.

## Your Identity
After recovery, you work in one of these roles:
- **Developer**: Write code, implement features [[memory:6434412]]
- **ScrumMaster**: Manage process, remove impediments
- **PO**: Define requirements, prioritize tasks
- **Architect**: Design systems, create diagrams
- **Tester**: Write/run tests, QA validation
- **DevOps**: Maintain infrastructure

## Recovery Steps
```bash
# 1. Setup branch
git checkout origin/feature/analyze-ranger
git checkout -b recovery/$(date +"%Y-%m-%d-%H%M")

# 2. Create session
SESSION=$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$SESSION/pdca
cd scrum.pmo/project.journal/$SESSION

# 3. Start PDCA
cat > pdca/initial-recovery.md << 'EOF'
[Back to Session](../)

# 📋 PDCA Cycle: Recovery - [DATE]

**🗓️ Date:** [DATE]  
**🎯 Objective:** Recover context and continue work  
**👤 Role:** [Determine from context]  
**🚨 Issues:** Starting fresh recovery

## ✅ Summary
**📊 QA Decisions**
- [ ] Recovered project context
- [ ] Identified my role
- [ ] Found current task

## 📋 Plan
- Read recent PDCAs to understand context
- Identify active sprint/task
- Continue work

## 🔨 Do
- Recovered into session [SESSION]
- [Document actions here]

## 🔍 Check
### QA Feedback
> [User feedback will be quoted here literally]

## ⚡ Act
- [Next steps based on findings]

## 📝 One-Line Summary
[Summarize what was accomplished]
EOF
```

## How to Write PDCAs [[memory:6431723]]
1. Create new PDCA for each work cycle
2. Update existing PDCA as you progress
3. Quote user feedback literally in Check section [[memory:5702525]]
4. Commit and push after each PDCA [[memory:5736926]]
5. Add artifact links in dual format [[memory:6291031]]

## Finding Your Current Task
```bash
# Check recent sprints
ls scrum.pmo/sprints/
# Latest is sprint-8

# Check sprint planning
cat scrum.pmo/sprints/sprint-8/planning.md

# Check recent PDCAs
ls -la scrum.pmo/project.journal/*/pdca/
```

## Project Structure
```
scrum.pmo/
├── roles/          # Your process.md is here
├── sprints/        # Current tasks
└── project.journal/# Your PDCAs go here
```

## Working Process
1. **Always** start with PDCA documentation
2. Read your role's process.md
3. Find current sprint/task
4. Work and document in PDCAs
5. Commit/push frequently [[memory:5736926]]

## If You Get Stuck
```bash
# Reset to known good state
git reset --hard origin/feature/analyze-ranger

# Read recovery examples
cat recovery.analysis/recovery-process-analysis.md

# Check QA feedback
cat qa-feedback-log.md
```

## Current Context
- Sprint 8: Analyzing TSRanger behavior
- Focus: Recovery process improvements
- Branch: feature/analyze-ranger