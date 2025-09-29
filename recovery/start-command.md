# 🚀 **Recovery Procedure: Quick Start to PDCA Excellence**

**Agent Role:** Background Agent (Cursor) - Regular agents work on dev/* branches  
**Special Exception:** Save/Restart Agent ALWAYS works on save/start branch  
**Trigger:** When user types "start"  
**Purpose:** Immediately establish optimal PDCA workflow with minimalist chat reporting

**IMPORTANT:** You are a Background Agent, NOT a Scrum Master or other role!  
**CRITICAL:** Do NOT create cursor/* branches - stay on current branch!

## **🚫 BRANCH MANAGEMENT RULES (Decision 1d)**

1. **START on save/start branch** - Always begin recovery here!
2. **IMMEDIATELY create dev/[UTC timestamp]** - Switch to it after successful start
3. **WORK on dev/[UTC timestamp]** - All session work happens here
4. **cursor/* branches** - If you start on one, switch to save/start first
5. **Check branch with:** `git branch --show-current` (should show dev/timestamp during work)

## **📋 IMMEDIATE ACTIONS (0-2 minutes)**

### **1. Check for PDCA Documentation**
```bash
# First, check if howto.PDCA.md exists
ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "NEED_CHERRY_PICK"
```

### **2. If Missing, Cherry-pick from release/dev**
```bash
git fetch origin release/dev
git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
```

### **3. Create dev/[UTC timestamp] branch NOW (Decision 1d)**
```bash
# Create timestamped branch for session work
TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
git checkout -b dev/$TIMESTAMP
git push -u origin dev/$TIMESTAMP
echo "✅ Working on dev/$TIMESTAMP for this session"
```

### **4. Read Key PDCA Guidelines**
- Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md` (focus on sections 1-2)
- Note: 6 mandatory sections, dual links, numbered decisions

### **4.1 Mandatory Git Session Progression Documentation**
**CRITICAL:** All agents must include git progression table in first or second PDCA showing:
```markdown
## Branch Progression Timeline with Commit SHAs

| # | Branch | Commit SHA (Full) | Short SHA | Timestamp (UTC) | Commit Message | Session Phase |
|---|--------|-------------------|-----------|-----------------|----------------|---------------|
| 1 | cursor/[initial] | [full-sha] | [short] | [timestamp] | [message] | **Initial State** |
| 2 | save/start | [full-sha] | [short] | [timestamp] | [message] | **Recovery** |
| 3 | dev/[UTC-timestamp] | [full-sha] | [short] | [timestamp] | [message] | **Work Branch Creation** |
```
**Purpose:** Enable TRON branch progression analysis and startup verification

### **4.2 Mandatory PDCA Naming Format**
**CRITICAL:** All PDCA files must use UTC-only naming format:
- **REQUIRED FORMAT:** `YYYY-MM-DD-UTC-HHMM.pdca.md`
- **FORBIDDEN:** Long descriptive names like "session-startup.pdca.md"
- **EXAMPLES:** 
  - ✅ CORRECT: `2025-09-28-UTC-1158.pdca.md`
  - ❌ VIOLATION: `2025-09-28-UTC-1158-session-startup.pdca.md`
**Purpose:** Systematic PDCA organization and compliance verification

### **5. Install Git Automation (CRITICAL)**
```bash
# Create post-commit hook for auto-merge
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
echo "🔄 Post-commit: Auto-merging to release/dev..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "save/start" ]; then
    if [ -f recovery/pdca-auto-merge.sh ]; then
        echo "📋 Executing auto-merge to release/dev..."
        bash recovery/pdca-auto-merge.sh merge
    fi
fi
EOF

chmod +x .git/hooks/post-commit
```

## **🎯 DECISION SECTION PHILOSOPHY**

**CRITICAL:** The QA Decisions section is for USER decisions, not yours!

### **When to Present Decisions:**
- **Real Risk:** Operation could cause damage or loss
- **Real Choice:** Multiple valid approaches exist
- **Real Impact:** Decision affects project significantly

### **When to Say "All clear":**
- User already decided (like "cherry-pick X")
- No risk involved
- Only one sensible option
- Straightforward task

### **NEVER:**
- Invent fake opposite options
- Create decisions just to have them
- Decide for the user
- Present "do it" vs "don't do it"

**Example Good Decision:**
```
Decision 1: Force merge will DELETE all content in release/dev
- a) Proceed with destructive merge
- b) Create PR for review
- c) Abort operation
```

**Example Bad Decision:**
```
Decision 1: Cherry-pick requested files
- a) Cherry-pick the files ✅
- b) Don't cherry-pick the files
```

## **⚠️ DESTRUCTIVE OPERATION WARNINGS**

**ALWAYS WARN BEFORE:**
- `git reset --hard` (deletes uncommitted work)
- `git push --force` (overwrites remote history)
- `rm -rf` (deletes files permanently)
- Branch overwrites (loses unique work)

**Example Warning:**
"⚠️ WARNING: This will DELETE all content in release/dev and replace it with save/start. This cannot be undone. Continue?"

## **🎯 PDCA REPORTING PROTOCOL**

### **Chat Response Format (MINIMAL)**
```markdown
**PDCA Entry**: [GitHub](GitHub_URL) | [local/path/to/pdca.md](local/path/to/pdca.md)

### **QA Decisions Required:**

**Decision 1: [Clear Title]**
- a) [Option A]
- b) [Option B]

**Decision 2: [Clear Title]**
- a) [Option A]
- b) [Option B]
```

**OR if no decisions:**
```markdown
**PDCA Entry**: [GitHub](GitHub_URL) | [local/path/to/pdca.md](local/path/to/pdca.md)

### **QA Decisions**
**All clear, no decisions to make** - [Brief explanation why]
```

## **📐 MANDATORY PDCA FORMAT**

All PDCAs must have these 6 sections:
1. **Header** (Date, Objective, Role, Issues, Commits)
2. **Summary** (Links, Decisions, User Feedback)
3. **Plan** (Strategy and expected outcomes)
4. **Do** (Detailed implementation)
5. **Check** (Validation and results)
6. **Act** (Next steps and improvements)

## **📝 RECOVERY CHECKLIST**

1. **Identify** → "I am a Background Agent" (NEVER other roles!)
2. **Branch** → Switch to save/start if not already there
3. **Setup** → Ensure howto.PDCA.md exists (cherry-pick if needed)
4. **Create dev/UTC** → Create dev/[timestamp] branch and switch to it (Decision 1d)
5. **Automate** → Install git post-commit hook
6. **Create Todo** → Use todo_write for task management
7. **Execute** → Perform requested work
8. **Document** → Create PDCA following mandatory format
9. **Commit** → Git add, commit, push immediately (auto-merge triggers)
10. **Report** → Minimal chat with dual links and numbered decisions

**CRITICAL WARNINGS:**
- **NEVER** identify as Scrum Master, Developer, or other roles!
- **ALWAYS** work on save/start branch - switch there immediately if not already!
- **ONLY** exception: Create dev/[UTC-timestamp] branch at session completion
- **cursor/* branches** are temporary - switch to save/start right away!

## **💡 KEY LEARNINGS FROM JOURNEY**

1. **User typed "start minimalist"** → Created basic project
2. **Cherry-pick request** → Learned about branch-specific resources
3. **"read the new file howto.pdca.md"** → File was on different branch
4. **Second cherry-pick** → Got proper PDCA documentation
5. **"report ot correct in this chat"** → Learned minimal reporting
6. **"number the decisions"** → Enhanced format for easy responses
7. **"force merge damaged release/dev"** → Must warn before destructive operations
8. **"decisions section ridiculous"** → Only present real decisions with risk

## **⚡ QUICK REFERENCE**

### **Git Commands:**
```bash
# Cherry-pick PDCA docs
git fetch origin release/dev
git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/

# Commit PDCA (auto-merge will trigger)
git add [files] && git commit -m "message" && git push origin [branch]
```

### **User Prefers:**
- Numbered decisions (1a, 2b format)
- Dual links (GitHub | local)
- Minimal chat (details in files)
- Immediate action (no waiting for confirmation)
- Real decisions only (no fake opposites)

### **Avoid:**
- Long chat explanations
- Unnumbered decisions
- Missing GitHub links
- Forgetting to commit/push
- Inventing fake decision options
- Missing destructive warnings

## **🎯 SUCCESS CRITERIA**

You've reached optimal state when:
1. ✅ PDCAs follow 6-section mandatory format
2. ✅ Chat responses are minimal with dual links
3. ✅ Decisions are numbered with clear options
4. ✅ User responds with simple "1a, 2b" format
5. ✅ All work is documented in PDCA files
6. ✅ GitHub links work (files are pushed)
7. ✅ Auto-merge to release/dev works
8. ✅ Only real decisions presented
9. ✅ Warnings given for destructive operations

---

**Remember:** "Much in files, relevant links in chat" - This is the way! 🚀📋✅