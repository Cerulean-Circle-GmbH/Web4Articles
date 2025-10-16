# Chat Reporting Template

**Purpose:** Ensure CMM3 compliant chat reporting format after PDCA completion.

**Last Updated:** 2025-10-16-UTC-1450  
**Status:** Active  
**Derived From:** [Meta-Irony Documentation vs. Execution Gap Analysis](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md) | [§/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md](../../../project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md)

---

## 📋 CMM3 Compliant Format

**Use this template for ALL chat reports after PDCA completion:**

```markdown
**PDCA:** [GitHub](https://github.com/[ORG]/[REPO]/blob/[BRANCH]/[PATH-TO-PDCA]) | [§/[PATH-FROM-ROOT]]([PATH-FROM-ROOT])

**QA Decisions:**
[Copy verbatim from PDCA § QA Decisions OR § Summary section]
```

**That's it.** Links only, no explanatory text.

---

## ✅ Pre-Send Validation Checklist

**MANDATORY: Run through this checklist BEFORE sending chat report:**

- [ ] **3a Compliance:** Links only, no explanatory text? (No summaries, metrics, or verbose descriptions)
- [ ] **4c Compliance:** Dual link uses project-root-relative path? (NOT `file://` prefix)
- [ ] **3c Compliance:** Dual link format is `[GitHub](URL) | [§/path](path-from-root)`?
- [ ] **3b Compliance:** QA Decisions copied verbatim from PDCA (not paraphrased)?
- [ ] **1g Compliance:** Any violations cited as "[#][letter] cmm2" format?
- [ ] **Link Test:** Can you click the local link? Does it resolve?

**If ANY checkbox unchecked → FIX before sending.**

---

## 🚫 Common Mistakes to Avoid

### ❌ WRONG: Verbose Summary

```markdown
## ✅ Task Complete: CMM3 Checklist Sections 1b & 1g Enhanced

### **Improvements Delivered:**

**Section 1b (Real UTC time) - BEFORE:**
- "Real UTC time (`date -u` output), not hallucinated"

**Section 1b - AFTER:**
[... 50+ lines of explanation, metrics, transformation details ...]
```

**Problem:** Violates 3a - "Links only, no explanatory text"

### ✅ RIGHT: Links Only

```markdown
**PDCA:** [GitHub](https://github.com/.../file.pdca.md) | [§/path/to/file.pdca.md](path/to/file.pdca.md)

**QA Decisions:**
All clear, no decisions to make - Task clearly defined by TRON: enhance sections 1b and 1g. Implementation completed per specification.
```

**Why:** PDCA contains the details. Chat is for navigation + decisions only.

---

### ❌ WRONG: File System Absolute Path

```markdown
**PDCA:** [GitHub](...) | [§/path](file:///var/dev/Workspaces/2cuGitHub/Web4Articles/path)
```

**Problem:** Violates 4c - Uses `file://` absolute system path instead of project-root-relative

### ✅ RIGHT: Project-Root-Relative Path

```markdown
**PDCA:** [GitHub](...) | [§/scrum.pmo/path/file.md](scrum.pmo/path/file.md)
```

**Why:** Chat has no relative context - must use paths from project root (without `file://`)

---

### ❌ WRONG: Paraphrased QA Decisions

```markdown
**QA Decisions:**
I decided not to present any decisions because the task was clear.
```

**Problem:** Violates 3b - Paraphrased instead of verbatim copy

### ✅ RIGHT: Verbatim Copy

```markdown
**QA Decisions:**
All clear, no decisions to make - Task clearly defined by TRON: enhance sections 1b and 1g. Implementation completed per specification.
```

**Why:** Must match PDCA exactly (copy-paste, not rewrite)

---

## 📝 Path Format Reference

**In Chat Responses (MUST use project-root-relative):**

| Element | Format | Example |
|---------|--------|---------|
| Display text | `§/path/from/root` | `§/scrum.pmo/project.journal/session/file.pdca.md` |
| Link path | `path/from/root` | `scrum.pmo/project.journal/session/file.pdca.md` |
| Full format | `[§/path](path)` | `[§/scrum.pmo/.../file.md](scrum.pmo/.../file.md)` |

**NOT:**
- `file:///absolute/system/path` ❌
- `/absolute/system/path` ❌
- `../../../relative/from/here` ❌

**Reference:** [Dual Link Format Requirement](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](PDCA.dual.link.format.requirement.md)

---

## 🎯 Quick Validation Commands

**Before sending chat report, run these checks:**

### 1. Check Link Format
```bash
# Your chat link should look like:
# [§/scrum.pmo/path/file.md](scrum.pmo/path/file.md)

# NOT like:
# [§/.../file.md](file:///var/dev/Workspaces/...)
```

### 2. Verify Path from Project Root
```bash
# From workspace root, verify file exists at reported path
ls scrum.pmo/project.journal/2025-10-16-UTC-1310-session/file.pdca.md

# If this fails, your path is wrong
```

### 3. Test Link Locally
```bash
# In cursor/IDE, click the local link
# Should open the file
# If doesn't work → path is broken → fix before sending
```

---

## 🔄 Integration with Workflow

### When to Use This Template

**After completing work:**
1. Create PDCA with detailed documentation ✅
1. Commit and push PDCA ✅
1. **STOP HERE** → Run pre-send validation checklist
1. Format chat report using this template
1. Verify all 6 checkboxes checked
1. Send chat report

### Step 11 Enhancement

**Original 1f step 11:**
> "finally do the git protocol"

**Enhanced 1f step 11:**
> "finally do the git protocol + VALIDATE CHAT REPORT"
> 1. Commit changes with proper message
> 1. Push to remote
> 1. **BEFORE CHAT REPORT:** Run pre-chat-response validation checklist
> 1. Use chat.report.template.md format
> 1. Verify all checkboxes checked
> 1. Send report

---

## 💡 Why This Matters

**Problem Without Template:**
- Agent provides verbose summaries (violates 3a)
- Agent uses wrong link format (violates 4c)
- TRON must correct violations manually
- Correction cycles waste time
- Meta-irony: Documenting rules, then violating them

**Solution With Template:**
- Clear format to follow
- Validation checklist prevents violations
- Self-correction before TRON sees output
- Faster workflow (no correction cycles)
- Demonstrates true CMM4 capability

**Core Values Connection:**
- **Integrity:** Do what you documented (apply chat rules)
- **Transparency:** Use simple, clear format (links only)
- **Commitment:** Validate every time (consistent application)

---

## 🔗 Related Documents

- [CMM3 Compliance Checklist](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md](../../SaveRestartAgent/cmm3.compliance.checklist.md)
- [Dual Link Format Requirement](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](PDCA.dual.link.format.requirement.md)
- [PDCA howto](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](howto.PDCA.md)
- [Meta-Irony Analysis PDCA](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md) | [§/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md](../../../project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1426.meta-irony-documentation-vs-execution-gap.pdca.md)

---

**Remember:** 
- PDCA = Detailed documentation
- Chat = Links + QA Decisions only
- Use this template EVERY TIME
- Validate BEFORE sending
- Trust the process 🎯

