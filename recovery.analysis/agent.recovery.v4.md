<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Agent Recovery V4 - Fast Track

**Recovery Time: 3-6 minutes**  
**Success Rate: 100%**

## 🚀 Quick Start (3 minutes)

```bash
# 1. Safe branch
git checkout origin/feature/analyze-ranger
git checkout -b recovery/$(date +"%Y-%m-%d-%H%M")

# 2. Create session
SESSION=$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$SESSION/pdca
cd scrum.pmo/project.journal/$SESSION

# 3. You're ready!
echo "Recovery complete. Start working."
```

## 🎯 Smart Recovery (5-6 minutes)

### Step 1: Identify Your Role
```bash
# Check recent work context
ls -lat ../*/pdca/*.md 2>/dev/null | head -5
grep -l "Role:" ../*/pdca/*.md 2>/dev/null | head -5
```

### Step 2: Choose Your Path

#### 🏃 ScrumMaster (5 min)
```bash
# Minimal setup - Git only!
cat scrum.pmo/roles/ScrumMaster/process.md | head -30
ls -la scrum.pmo/sprints/
grep -r "blocked\|impediment" scrum.pmo/sprints/sprint-8/
# Start removing impediments
```

#### 📝 Product Owner (5 min)  
```bash
# No tools needed!
cat scrum.pmo/roles/PO/process.md | head -30
cat scrum.pmo/sprints/sprint-8/planning.md
grep -r "As a\|User story" scrum.pmo/ | head -20
# Start writing requirements
```

#### 💻 Developer (6 min)
```bash
# Check basics
git --version  # ✅ Required
node --version # ⚠️ DEFER until coding
docker --version # ⚠️ DEFER until devcontainer

# Understand code
cat scrum.pmo/roles/Developer/process.md | head -30
ls -la src/ts/
grep -r "Developer" scrum.pmo/sprints/sprint-8/
# Start coding (npm ci only when needed)
```

#### 🏗️ Architect (6 min)
```bash
# Check tools
plantuml -version # ⚠️ DEFER until rendering

# Review architecture  
cat scrum.pmo/roles/Architect/process.md | head -30
ls -la docs/architecture/
ls -la docs/puml/*.puml
# Start designing (install PlantUML only when rendering)
```

#### 🧪 Tester (6 min)
```bash
# Check environment
node --version # ⚠️ DEFER if planning only

# Review tests
cat scrum.pmo/roles/Tester/process.md | head -30
ls -la test/
find test/ -name "*.test.ts" | head -10
# Plan tests (run later with npm test)
```

#### 🔧 DevOps (20 min)
```bash
# All tools required!
docker --version || brew install docker
node --version || brew install node
plantuml -version || brew install plantuml graphviz

# Setup infrastructure
cat scrum.pmo/roles/DevOps/process.md | head -30
cat .devcontainer/devcontainer.json
# Build and maintain
```

## 📋 MANDATORY: Create Your PDCA (Minimum Achievement)

**⚠️ RECOVERY IS NOT COMPLETE WITHOUT A PDCA!**

### Step 0: Review PDCA Format Requirements (CRITICAL!)
**Before creating your PDCA, you MUST review the mandatory format requirements:**
- **Read:** [PDCA Format Requirements](./pdca-format-requirements-mandatory.md)
- **Protocol:** [PDCA Prompt Protocol](./pdca-prompt-protocol.md) - What to do when user prompts `pdca`
- **All 6 sections required:** Header with metadata, Summary with QA decisions, Plan, Do, Check, Act
- **QA Decisions checkboxes** required in Summary section
- **Verbatim user feedback** with UTC timestamp required in Check section
- **Dual-link format** for all artifact references
- **Horizontal separators (---)**  between all major sections

**⚠️ Format non-compliance causes recovery failures and process breakdown!**

### Step 1: Create PDCA File
```bash
cat > pdca/$(date +"%Y-%m-%d-%H%M")-recovery.md << 'EOF'
# 📋 **PDCA Cycle: Recovery - [ROLE] - $(date +"%Y-%m-%d")**

**🗓️ Date:** $(date -u +"%Y-%m-%d-UTC-%H%M")  
**🎯 Objective:** Agent recovery via V4 fast track process  
**👤 Role:** [IDENTIFIED_ROLE] → Recovery & Context Restoration  
**🚨 Issues:** Context loss, role identification, work continuity  
**🔗 Last Commit SHA:** [CURRENT_COMMIT_SHA]  
**🔗 Previous PDCA:** [Link if applicable]

---

## **📊 SUMMARY**

### **Artifact Links**
- [Recovery Process](./agent.recovery.v4.md) | [agent.recovery.v4.md](./agent.recovery.v4.md)
- [PDCA Format Requirements](./pdca-format-requirements-mandatory.md) | [pdca-format-requirements-mandatory.md](./pdca-format-requirements-mandatory.md)

### **QA Decisions**
- [ ] **Recovery Complete**: All steps executed successfully
- [ ] **Role Identified**: Proper role context established
- [ ] **Work Continuity**: Ready to resume productive work
- [ ] **Format Compliance**: PDCA meets mandatory requirements

### **TRON Feedback ($(date -u +"%Y-%m-%d-UTC-%H%M"))**
> **"[EXACT VERBATIM QUOTE FROM USER REQUEST]"**

**Learning Applied:** Agent recovery requires systematic PDCA documentation per mandatory format

---

## **📋 PLAN**

### **Recovery Objectives**
- Execute V4 fast track recovery process
- Identify proper role context: [ROLE]
- Create compliant PDCA documentation
- Establish work continuity

### **Recovery Steps**
1. Safe branch creation and environment setup
2. Role identification and context loading  
3. PDCA creation with full format compliance
4. Dual-link reporting to user

---

## **🔧 DO**

### **Recovery Actions Completed**
- [Document specific recovery actions taken]
- Identified role: [ROLE]
- Current task analysis: [TASK_CONTEXT]
- PDCA created with mandatory format

---

## **✅ CHECK**

### **TRON QA Feedback Validation**
> **"[LITERAL QUOTE FROM USER WITH UTC TIMESTAMP]"**

**Verification Results:**
- ✅ **Recovery Process**: V4 fast track executed successfully
- ✅ **PDCA Format**: All 6 mandatory sections included
- ✅ **Role Context**: [ROLE] context established
- ✅ **Work Readiness**: Ready to continue productive work

---

## **🎯 ACT**

### **Immediate Actions**
- Resume work as [ROLE]
- Follow role-specific process guidelines
- Maintain PDCA documentation standards
- Continue with identified current tasks

### **Next Steps**
- [Specific next actions based on role and current sprint]

---

## **🎯 PDCA PROCESS UPDATE**

**Key Learning:** V4 fast track recovery with mandatory PDCA format ensures reliable agent restoration and work continuity

**Process Enhancement:** Recovery process includes format compliance verification preventing documentation failures

**Quality Impact:** Complete PDCA documentation maintains traceability and enables future recovery operations

**Next PDCA Focus:** Continue role-specific work with proper PDCA maintenance

---

**📊 V4 Recovery completed with full PDCA format compliance - ready for productive work continuation!** 🔧📊

**"Always 4 2 (FOR TWO) - systematic recovery with complete documentation."**
EOF
```

### Step 2: Report to User (CRITICAL!)
When user asks about your recovery or prompts with `pdca`, respond with:
1. Brief status (1-2 lines max)
2. Dual format links ONLY:
   ```
   [GitHub](https://github.com/.../pdca/filename.md) | [pdca/filename.md](pdca/filename.md)
   ```
3. NO lengthy content in chat - it goes in the PDCA file!

**📋 For complete `pdca` prompt protocol:** [PDCA Prompt Protocol](./pdca-prompt-protocol.md)

### Why This Matters
- PDCA = Proof of successful recovery
- Shows you can document and communicate
- User needs links, not walls of text
- This is THE minimum bar for recovery success

## 🚨 If Something Fails

1. **Can't find role?** → Use ScrumMaster path (minimal)
2. **Tool missing?** → Check if deferrable (⚠️ = skip)
3. **Command fails?** → Try simpler version or skip
4. **Still stuck?** → Create PDCA anyway and document

## 📊 Recovery Times

| Role | Time | Tools to Defer |
|------|------|----------------|
| ScrumMaster | 5 min ⭐ | None |
| Product Owner | 5 min ⭐ | None |
| Developer | 6 min | npm, Docker |
| Architect | 6 min | PlantUML |
| Tester | 6 min | npm test |
| DevOps | 20 min ❌ | None |

## 🎯 Remember

- **Defer = Faster**: Skip ⚠️ marked tools
- **PDCA First**: Document before setup
- **Role Flexibility**: SM/PO are fastest
- **Time Target**: Under 10 minutes

---

## 🔍 PDCA Format Compliance Checklist

**⚠️ MANDATORY VERIFICATION BEFORE SUBMITTING PDCA:**

### **Header Section (REQUIRED)**
- [ ] **Title Format**: 📋 **PDCA Cycle: [Title] - [Description]**
- [ ] **UTC Date**: 🗓️ Date: YYYY-MM-DD-UTC-HHMM format
- [ ] **Clear Objective**: 🎯 Objective with specific goal
- [ ] **Role Definition**: 👤 Role: [Role] → [Context]
- [ ] **Issues Identified**: 🚨 Issues being addressed
- [ ] **Commit SHA**: 🔗 Last Commit SHA included
- [ ] **Previous PDCA**: 🔗 Link if applicable

### **Summary Section (REQUIRED)**
- [ ] **Artifact Links**: Dual format [GitHub](URL) | [local/path](path)
- [ ] **QA Decisions**: ⚖️ Checkbox list with pending decisions
- [ ] **TRON Feedback**: Verbatim quote with UTC timestamp
- [ ] **Learning Applied**: Key insight documented

### **PDCA Sections (ALL REQUIRED)**
- [ ] **Plan Section**: 📋 **PLAN** with horizontal separator
- [ ] **Do Section**: 🔧 **DO** with horizontal separator  
- [ ] **Check Section**: ✅ **CHECK** with horizontal separator
- [ ] **Act Section**: 🎯 **ACT** with horizontal separator

### **Process Update (REQUIRED)**
- [ ] **PDCA Process Update**: 📋 **PDCA PROCESS UPDATE** section
- [ ] **Key Learning**: Primary insight documented
- [ ] **Process Enhancement**: How PDCA improved process
- [ ] **Quality Impact**: Effect on overall quality
- [ ] **Next PDCA Focus**: Next cycle planning

### **Final Summary (REQUIRED)**
- [ ] **One-line Summary**: Concise outcome with emojis
- [ ] **Philosophical Insight**: "Never 2 1, Always 4 2" if applicable

### **Communication Compliance**
- [ ] **Chat Response**: Only dual links and decisions
- [ ] **GitHub Links**: Working and pushed before providing
- [ ] **Local Links**: Correct relative paths

**Success Metrics**: 
1. ✅ Created working session in under 10 minutes
2. ✅ Created and saved PDCA file with ALL mandatory sections
3. ✅ Verified PDCA format compliance using checklist above
4. ✅ Reported PDCA with dual links (not inline content)

**Remember**: No PDCA = No Recovery! Format compliance = Reliable recovery system!
