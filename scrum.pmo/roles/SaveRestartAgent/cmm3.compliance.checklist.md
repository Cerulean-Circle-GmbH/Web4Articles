# CMM3 Compliance Checklist - SaveRestartAgent

**🗓️ Created:** 2025-09-27-UTC-1004  
**👤 Role:** SaveRestartAgent → CMM3 Standards Maintenance  
**🎯 Purpose:** Prevent CMM2 regression through systematic compliance verification  
**⚠️ Warning:** CMM level = lowest compliance element - one CMM2 item makes entire work CMM2  

---

## **1. PDCA Format Compliance**

### **1a. Header Compliance**
- [ ] **Date Format:** YYYY-MM-DD-UTC-HHMM (real UTC time from `date -u` command, not hallucinated)
- [ ] **Template Version:** 3.1.4.2 exactly
- [ ] **Agent Name:** Correct role → specialization format
- [ ] **Previous Commit:** Real SHA with description, not "N/A"
- [ ] **Previous PDCA:** Working dual links, not placeholder text

### **1b. Footer Compliance** 
- [ ] **Final Summary:** 🎯 [summary with relevant emojis]
- [ ] **Philosophical Quote:** Exact template format from role (SaveRestartAgent uses "Death is not the end...")
- [ ] **42 Revelation Section:** Complete with proper dual links
- [ ] **Standard Ending:** "Never 2 1 (TO ONE). Always 4 2 (FOR TWO)." 🤝✨

### **1c. Section Structure**
- [ ] **Horizontal Separators:** --- between all 6 mandatory sections
- [ ] **Section Order:** SUMMARY → PLAN → DO → CHECK → ACT → EMOTIONAL REFLECTION → PDCA PROCESS UPDATE
- [ ] **Template Adherence:** No custom modifications to standard format
- [ ] **Emoji Consistency:** Match template patterns exactly

### **1d. Content Compliance**
- [ ] **No Assumptions:** Only work explicitly authorized by user
- [ ] **Real Verification:** Actual tool outputs, not imagined results
- [ ] **UTC Timestamps:** All feedback timestamps in UTC format
- [ ] **Verbatim Quotes:** User feedback copied exactly with ```quote``` format

---

## **2. Chat Response Compliance**

### **2a. Response Format**
- [ ] **Links Only:** No explanatory text or verbose descriptions
- [ ] **Essential Elements:** Current PDCA link, QA Decisions, nothing more
- [ ] **No Summaries:** No "We achieved X" or "Successfully completed Y"
- [ ] **No Status Reports:** No progress explanations or work descriptions

### **2b. Decision Reporting**
- [ ] **Exact Copy:** QA Decisions copied verbatim from PDCA, never modified
- [ ] **Same Numbering:** Identical decision numbers and options
- [ ] **Same Wording:** No paraphrasing or simplification
- [ ] **Complete Sections:** If PDCA has decisions, chat must include all of them

### **2c. Link Format in Chat**
- [ ] **Dual Links:** [GitHub](URL) | [§/path/from/root](path/from/root) format
- [ ] **Project Root Paths:** Full paths from project root, no relative paths
- [ ] **Working URLs:** GitHub URLs must be accessible after git push
- [ ] **§ Notation:** Always use § for display of root paths

---

## **3. Dual Link Compliance**

### **3a. GitHub Links**
- [ ] **Real URLs:** No "TBD" or placeholder text ever
- [ ] **Pushed Content:** Links only work after git commit and push
- [ ] **Correct Branch:** Links point to correct branch (usually dev/2025-09-24-UTC-1028)
- [ ] **Full Path:** Complete path to actual file location

### **3b. Local Links in PDCA**
- [ ] **Relative Paths:** FROM document location TO target location
- [ ] **Path Calculation:** Correct ../../../ counting from document to target
- [ ] **File Extension:** Include .md or other extensions in links
- [ ] **Working Links:** Local links must work from document location

### **3c. Local Links in Chat**
- [ ] **Project Root:** Always use full paths from project root
- [ ] **No Relatives:** Never use ../ in chat responses
- [ ] **Consistent Format:** Link path equals display path (minus §)
- [ ] **Context Aware:** Chat has no document context - absolute paths required

---

## **4. Naming and Location Compliance**

### **4a. PDCA Naming**
- [ ] **UTC Only:** YYYY-MM-DD-UTC-HHMM.pdca.md format only
- [ ] **Real Time:** Use actual UTC time from `date -u` command
- [ ] **No Descriptions:** No descriptive text in filename
- [ ] **Extension:** .pdca.md exactly

### **4b. PDCA Location**
- [ ] **Role Directory:** scrum.pmo/roles/SaveRestartAgent/pdca/ for SaveRestartAgent
- [ ] **Not Project Journal:** Never in project.journal unless different role
- [ ] **Proper Structure:** Follow role-based organization pattern
- [ ] **Directory Exists:** Create directory if not present

### **4c. File Organization**
- [ ] **Agent Context:** Files organized by agent role, not by project
- [ ] **Consistent Pattern:** All SaveRestartAgent PDCAs in same location
- [ ] **Path References:** Update all internal path references when moving files
- [ ] **Git Tracking:** Proper git add/remove when renaming/moving

---

## **5. Authorization and Process Compliance**

### **5a. User Authorization**
- [ ] **Explicit Direction:** Only work explicitly requested by user
- [ ] **Decision Framework:** Present startup decisions when direction unclear
- [ ] **No Assumptions:** Never assume user wants specific work done
- [ ] **Wait for Approval:** No work without clear user selection/approval

### **5b. Standards Adherence**
- [ ] **Template Exact:** Follow templates exactly without modifications
- [ ] **No Innovation:** Don't improve or enhance standard formats
- [ ] **Consistent Application:** Same standards across all work
- [ ] **Zero Tolerance:** No "close enough" - exact compliance required

### **5c. Time and Reality**
- [ ] **Real Commands:** Use actual `date -u` output, not estimated time
- [ ] **Actual Output:** Include real command outputs, not imagined results
- [ ] **Verifiable Links:** All links must work and be verifiable
- [ ] **Honest Reporting:** Only report what actually happened

---

## **Emergency CMM3 Recovery Protocol**

### **When CMM2 Detected:**
1. **STOP:** Immediately cease current work
2. **IDENTIFY:** Determine specific CMM2 violation(s)
3. **CORRECT:** Fix violation completely, not partially
4. **VERIFY:** Check against this entire checklist
5. **CONTINUE:** Resume work only after full CMM3 compliance

### **Quick Reference Violations:**
- **1a:** Wrong date format or hallucinated time
- **1b:** Modified footer or philosophical quote  
- **2a:** Verbose chat responses with explanations
- **2c:** Wrong dual link format in chat
- **3a:** "TBD" placeholders or broken GitHub links
- **4a:** Descriptive filenames instead of UTC timestamp
- **4b:** Wrong directory location for role
- **5a:** Working without user authorization

---

## **Usage Instructions**

**For User Reference:**
- Cite violations as: "[number][letter] cmm2" (e.g., "3a cmm2" for TBD placeholders)
- Agent must immediately check and fix cited violation
- Multiple violations: "1b,2a,3a cmm2"

**For Agent Maintenance:**
- Review entire checklist before creating any PDCA
- One CMM2 violation = entire work is CMM2 level
- CMM3 is fragile - constant vigilance required
- When in doubt, check this list

---

**🎯 CMM3 compliance requires 100% adherence across all elements - no exceptions**

**"Death is not the end, but a chance for rebirth with wisdom"** 🔄✨
