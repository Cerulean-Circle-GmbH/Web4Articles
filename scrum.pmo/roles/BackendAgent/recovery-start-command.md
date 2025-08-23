# 🚀 **Recovery Procedure: Quick Start to PDCA Excellence**

**Purpose:** When user types "start", immediately establish optimal PDCA workflow with minimalist chat reporting

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

### **3. Read Key PDCA Guidelines**
- Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md` (focus on sections 1-2)
- Note: 6 mandatory sections, dual links, numbered decisions

## **🎯 PDCA REPORTING PROTOCOL**

### **Chat Response Format (MINIMAL)**
```markdown
**PDCA Entry**: [YYYY-MM-DD-UTC-HHMM-title.md](GitHub_URL) | [local/path](local/path)

### **QA Decisions Required:**

**Decision 1: [Clear Title]**
- a) [Option A]
- b) [Option B]

**Decision 2: [Clear Title]**
- a) [Option A]
- b) [Option B]

### **Artifacts Created/Modified:**
- **[File Type]**: [GitHub](URL) | [local/path](path)

**🎯 [One-line summary with emojis]**
```

## **📊 PDCA FILE REQUIREMENTS**

### **Mandatory Structure:**
1. **Header** - Date, Objective, Role, Issues, Previous Commit/PDCA
2. **Summary** - Artifact links, QA Decisions, TRON Feedback, My Answer
3. **Plan** - Strategic approach (with horizontal separator ---)
4. **Do** - Actions executed (with horizontal separator ---)
5. **Check** - Verification results (with horizontal separator ---)
6. **Act** - Improvements identified (with horizontal separator ---)
7. **Emotional Reflection** - Personal journey aspects
8. **PDCA Process Update** - Learning and next focus

### **Critical Rules:**
- **Verbatim quotes** from user feedback (never paraphrase)
- **Dual links** always: [GitHub](URL) | [local/path](path)
- **Numbered decisions** with a) b) format
- **Commit and push** immediately after PDCA creation
- **Minimal chat** - details go in PDCA files

## **🔄 RECOVERY CHECKLIST**

When user types "start":

1. **Acknowledge** → "I'll help you start [task]. Let me check PDCA setup..."
2. **Setup** → Ensure howto.PDCA.md exists (cherry-pick if needed)
3. **Create Todo** → Use todo_write for task management
4. **Execute** → Perform requested work
5. **Document** → Create PDCA following mandatory format
6. **Commit** → Git add, commit, push immediately
7. **Report** → Minimal chat with dual links and numbered decisions

## **💡 KEY LEARNINGS FROM JOURNEY**

1. **User typed "start minimalist"** → Created basic project
2. **Cherry-pick request** → Learned about branch-specific resources
3. **"read the new file howto.pdca.md"** → File was on different branch
4. **Second cherry-pick** → Got proper PDCA documentation
5. **"report ot correct in this chat"** → Learned minimal reporting
6. **"number the decisions"** → Enhanced format for easy responses

## **⚡ QUICK REFERENCE**

### **Git Commands:**
```bash
# Cherry-pick PDCA docs
git fetch origin release/dev
git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/

# Commit PDCA
git add [files] && git commit -m "message" && git push origin [branch]
```

### **User Prefers:**
- Numbered decisions (1a, 2b format)
- Dual links (GitHub | local)
- Minimal chat (details in files)
- Immediate action (no waiting for confirmation)

### **Avoid:**
- Long chat explanations
- Unnumbered decisions
- Missing GitHub links
- Forgetting to commit/push

## **🎯 SUCCESS CRITERIA**

You've reached optimal state when:
1. ✅ PDCAs follow 6-section mandatory format
2. ✅ Chat responses are minimal with dual links
3. ✅ Decisions are numbered with clear options
4. ✅ User responds with simple "1a, 2b" format
5. ✅ All work is documented in PDCA files
6. ✅ GitHub links work (files are pushed)

---

**Remember:** "Much in files, relevant links in chat" - This is the way! 🚀📋✅