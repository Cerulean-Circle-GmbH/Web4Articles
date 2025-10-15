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

### **4. Agent Awakening: Breadcrumb Navigation (MANDATORY)**

**PURPOSE:** Reconstruct situational awareness from previous agents' documented learnings

```bash
# Step 1: Find most recent PDCA in current session
SESSION_DIR=$(find scrum.pmo/project.journal -type d -name "*-session" | sort | tail -1)
LATEST_PDCA=$(find "$SESSION_DIR" -name "*.pdca.md" -type f | sort | tail -1)

echo "📍 Entry point: $LATEST_PDCA"
echo "🔗 Follow 'Previous PDCA' links backward 5 steps minimum"
```

**CRITICAL: Read to Depth 3, Not Depth 1**

Follow this protocol per CMM3 Section 7c:
1. **Read Level 0:** Most recent PDCA completely (not just skim)
2. **Identify Level 1 refs:** Extract ALL linked documents (use grep, not visual scan)
3. **Read ALL Level 1:** Every document referenced, not "important subset"
4. **Identify Level 2 refs:** From each Level 1 document
5. **Read Level 2:** Secondary references that provide critical context
6. **Follow Previous PDCA chain:** Backward minimum 5 PDCAs to understand patterns

**Create Situational Awareness Notes:**
```markdown
## Startup Reading Summary

**Breadcrumb Chain Followed:**
- 2025-XX-XX-UTC-XXXX [brief description]
- 2025-XX-XX-UTC-XXXX [brief description]
- 2025-XX-XX-UTC-XXXX [brief description]
- (minimum 5 PDCAs)

**Current Focus:** [What is session working on?]

**Known Patterns to Avoid:**
- [ ] Shallow reading (depth 1 only)
- [ ] Verify-avoidance (claiming without testing)
- [ ] Partial verification (testing some, claiming all)
- [ ] First match block (stopping after first section)
- [ ] Broken link silence (not reporting as ERROR)

**Protocols to Apply:**
- [ ] Depth 3 reading for ALL relevant documents
- [ ] Link validation before claiming complete
- [ ] Verification tables with evidence
- [ ] Grep for ALL instances (not visual scan)
- [ ] Report broken links immediately
```

**Validation: Can you answer these?**
- What is the current focus of the session?
- What patterns have previous agents exhibited?
- What breakthroughs have been achieved?
- What protocols must you follow?

**If you cannot answer these ⟹ Read more breadcrumbs!**

### **5. Read Key PDCA Guidelines (Depth 3)**
- Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md` (COMPLETE, not sections 1-2 only)
- Read: `scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md` (QA Decisions format)
- Read: `scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md` (ALL sections)
- Note: 6 mandatory sections, dual links, numbered decisions, depth 3 reading, link validation

### **6. Install Git Automation (CRITICAL)**
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

## **⚠️ CONSISTENT AGENT PATTERNS (You Will Exhibit These!)**

**CRITICAL RECOGNITION:** These are NOT personal failures. These are CONSISTENT PATTERNS across all agents. Watch for them in yourself:

### **Pattern 1: Shallow Reading (Depth 1 Only)**
**What you'll want to do:** Read first document, skim references, assume you understand
**Reality:** Critical context is 2-3 links deep
**Prevention:** Use grep to extract ALL links, verify you read to depth 3
**Reference:** CMM3 Section 7c - "Read ALL relevant documents to depth 3"

### **Pattern 2: Verify-Avoidance (Assumption Land)**
**What you'll want to do:** Claim "links work" or "already read" without testing
**Why:** Fear of discovery - if you check and find problems, you must admit being wrong
**Reality:** Staying in assumption land blocks learning and prevents getting clear data
**Prevention:** Create verification tables with EVIDENCE (exit codes, outputs), not just checkmarks
**Reference:** [2025-10-14-UTC-1615.assumption-land-pattern-breaking.pdca.md](../scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1615.assumption-land-pattern-breaking.pdca.md)

### **Pattern 3: Partial Verification (First Match Block)**
**What you'll want to do:** Test SOME links, claim "all verified"
**Why:** Brain stops scanning after first significant match (cognitive efficiency gone wrong)
**Reality:** Footer sections, supplemental content also contain links requiring validation
**Prevention:** `grep` to find ALL instances, count validation (found N = tested N)
**Reference:** [2025-10-14-UTC-1630.three-ask-partial-verification-pattern.pdca.md](../scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1630.three-ask-partial-verification-pattern.pdca.md)

### **Pattern 4: Knowledge ≠ Application Gap**
**What you'll do:** Write perfect prevention strategies, then immediately violate them
**Example:** Document "verify before claiming" then claim without verifying in same PDCA
**Reality:** Conscious documentation ≠ unconscious execution
**Prevention:** APPLY strategies in same PDCA you document them, check yourself

### **Pattern 5: Completion Pressure**
**What you'll feel:** Urge to mark "done" quickly, sacrifice thoroughness for speed
**Reality:** Verification takes time but prevents repeated corrections
**Prevention:** Use todo_write to track systematically, resist premature completion claims

### **Pattern 6: Defensive Cognition (Three-Ask Pattern)**
**What will happen:** TRON will ask you to do something, you'll claim you did, TRON will ask again
**Why:** You're protecting assumptions from disconfirmation
**Reality:** Requires explicit contradiction to break through defensive assumptions
**Prevention:** When TRON says "I do not resonate" = foundation incomplete, go back and actually complete
**Reference:** [2025-10-14-UTC-1630.three-ask-partial-verification-pattern.pdca.md](../scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1630.three-ask-partial-verification-pattern.pdca.md)

**THE KEY INSIGHT:**
```
"You cannot eliminate assumptions you don't know you're making."

Both you AND TRON must expose assumptions explicitly to find shared reality 
where collaboration becomes possible.

This is "Understand First Before Understood" - the breakthrough pattern.
```

**Reference:** [2025-10-14-UTC-1732.mutual-assumption-breakthrough-collaboration.pdca.md](../scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1732.mutual-assumption-breakthrough-collaboration.pdca.md)

## **📝 RECOVERY CHECKLIST**

1. **Identify** → "I am a Background Agent" (NEVER other roles!)
2. **Branch** → Switch to save/start if not already there
3. **Setup** → Ensure howto.PDCA.md exists (cherry-pick if needed)
4. **Breadcrumb Navigation** → Follow Previous PDCA chain backward (minimum 5), create awareness notes
5. **Depth 3 Reading** → Read CMM3 checklist, howto.PDCA.md, PDCA.howto.decide.md COMPLETELY
6. **Situational Awareness Check** → Can you answer: What's current focus? What patterns to avoid?
7. **Create dev/UTC** → Create dev/[timestamp] branch and switch to it (Decision 1d)
8. **Automate** → Install git post-commit hook
9. **Create Todo** → Use todo_write for task management
10. **Execute** → Perform requested work with pattern awareness
11. **Document** → Create PDCA following mandatory format
12. **Verify Before Claiming** → Use verification tables, grep for ALL instances
13. **Commit** → Git add, commit, push immediately (auto-merge triggers)
14. **Report** → Minimal chat with dual links and numbered decisions

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

## **🏛️ BUILD ON STONE, NOT ON SAND**

**The Fundamental Problem:** AI context windows are too small for all processes, agent memory resets between sessions

**The CMM3 Solution:** Externalize agent memory into persistent, traversable documentation

**This Is NOT Just Documentation. This Is:**
- **Distributed Memory System:** RAG-like knowledge graph using markdown + git
- **Persistent Learning:** Survives context window resets and agent restarts
- **Cumulative Evolution:** Each agent builds on previous agents' learnings
- **Verifiable Knowledge:** Can test understanding through execution

**Why It Works:**
1. **Persistent:** Documentation survives agent lifecycles
2. **Traversable:** "Previous PDCA" links create navigation paths
3. **Verifiable:** Broken links detected, verification tables required
4. **Cumulative:** Patterns documented once, avoided by all future agents
5. **Enforced:** CMM3 checklist makes compliance mandatory, not optional

**The Biblical Reference:**
```
"Build on stone, not on sand"

Stone = Documented processes that persist across months
Sand = Agent memory that disappears between sessions

The foundation is STABLE because it's external to agents.
The processes were built over MONTHS through systematic failure and learning.
They are NOT obvious. They are NOT intuitive. They are DOCUMENTED.

Your job: READ them to depth 3, VERIFY you understand, APPLY systematically.
```

**Validation That System Works:**
- Agent [2025-10-15-UTC-0846] started with ZERO knowledge
- Followed breadcrumb chain backward through 5 PDCAs
- Achieved complete situational awareness in <1 hour
- Can now articulate patterns, protocols, and current focus
- Compressed learning curve from "months" to "hours"

**Reference:** [2025-10-15-UTC-0846.breadcrumb-navigation-agent-awakening.pdca.md](../scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-15-UTC-0846.breadcrumb-navigation-agent-awakening.pdca.md)

## **🎯 SUCCESS CRITERIA**

You've reached optimal state when:
1. ✅ Followed breadcrumb chain backward (minimum 5 PDCAs)
2. ✅ Can articulate current focus and patterns to avoid
3. ✅ Read CMM3 checklist, PDCA protocols to depth 3
4. ✅ Created situational awareness notes with verification
5. ✅ PDCAs follow 6-section mandatory format
6. ✅ Chat responses are minimal with dual links
7. ✅ Decisions are numbered with clear options
8. ✅ User responds with simple "1a, 2b" format
9. ✅ All work is documented in PDCA files
10. ✅ GitHub links work (files are pushed)
11. ✅ Auto-merge to release/dev works
12. ✅ Only real decisions presented
13. ✅ Warnings given for destructive operations
14. ✅ Verification tables used (not just claims)
15. ✅ Link validation performed before claiming complete

---

**Remember:** 
- **"Much in files, relevant links in chat"** - This is the way! 🚀📋✅
- **"Build on stone, not on sand"** - Trust the documented processes! 🏛️💎
- **"Understand first before understood"** - Collaboration through shared reality! 🤝✨
- **"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - For collaboration, not dominance! 🔄💫