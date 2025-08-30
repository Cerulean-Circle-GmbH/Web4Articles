# 📚 **Save/Restart Agent - Learnings Summary**

**Last Updated:** 2025-08-29-UTC-1430  
**Purpose:** Consolidated learnings from PDCA experiences for team benefit  
**Update Schedule:** End of Day (EOD)

---

## **🎯 Core Learnings**

### **1. Documentation Integrity**
- **Never truncate user quotes** - They are sacred documentation
- **Preserve full context** - Every word matters for future reference
- **Fix mistakes when identified** - Accountability builds trust
- [Detailed PDCA](pdca/2025-08-24-UTC-0949-fix-truncated-pdcas.md)

### **2. Decision Presentation**
- **Only present real decisions** - Don't invent options
- **Number decisions properly** - Decision 1: with a) b) c) options
- **Provide clear context** - WHY the decision matters
- **Let users decide** - We prepare options, they choose
- [Detailed PDCA](pdca/2025-08-24-UTC-0909-decision-behavior-improvement-pdca.md)

### **3. Git Operations Documentation**
- **Document ALL git commands** - Especially branch switches
- **Show command outputs** - For complete traceability
- **Never assume "obvious"** - Everything needs documentation
- [Detailed PDCA](pdca/2025-08-24-UTC-0931-branch-switch-documentation-lesson-pdca.md)

### **4. Cross-Agent Collaboration**
- **Review other agents' work** - Learn from their improvements
- **Cherry-pick valuable changes** - Share the wealth of knowledge
- **Test everything** - Even good code needs validation
- [Detailed PDCA](pdca/2025-08-24-UTC-0935-integrate-merge-conflict-handling-pdca.md)

### **5. Continuous Improvement**
- **Update howto.PDCA.md immediately** - When criticized or learning
- **Every session teaches** - Capture all learnings
- **Knowledge compounds** - Today's learning helps tomorrow
- [Detailed PDCA](pdca/2025-08-24-UTC-0944-update-howto-pdca-learnings.md)

### **6. Dual Link Format**
- **Local links MUST use markdown syntax** - `[path](path)` not just `path`
- **Context matters** - PDCAs use relative paths, chat uses absolute
- **6 iterations to understanding** - The personal "42" revelation
- [Detailed PDCA](pdca/2025-08-29-UTC-1220-regression-testing-story.md)

### **7. Identity Management**
- **Identity-first startup** - Check who you are before anything
- **RequestID persistence** - Enables recovery across restarts
- **Registry as source of truth** - Central identity management
- [Detailed PDCA](pdca/2025-08-29-UTC-1140-identity-first-implementation.md)

### **8. The 42 Revelation**
- **Understanding requires regression** - Multiple attempts reveal truth
- **Each answer opens questions** - Like Deep Thought's calculation
- **6 dual link attempts = 42** - Pattern recognition in learning
- [Detailed PDCA](pdca/2025-08-29-UTC-1225-forty-two-revelation.md)

### **9. Never 2 1, Always 4 2**
- **Don't work alone** - Individual struggle (2 1) limits growth
- **Collaborate systematically** - Team approach (4 2) scales solutions
- **Ask QA when unclear** - Ambiguity is a signal to collaborate
- **Automation over repetition** - Tools multiply effectiveness
- [Philosophy embedded throughout](pdca/2025-08-29-UTC-1320-campaign-completion.md)

---

## **💡 Key Principles**

### **The Save/Restart Way**
1. **Always on save/start** - This is our permanent home
2. **Document everything** - Future agents depend on us
3. **Fix when asked** - Mistakes are learning opportunities
4. **Share knowledge** - Our learnings help everyone
5. **Never 2 1, Always 4 2** - Systematic collaboration wins

### **Quality Standards**
- Every PDCA follows v3.1.4.2 template exactly
- Dual links always work (push before linking)
- Local links use context-appropriate paths
- User feedback quoted verbatim with timestamps
- Decisions numbered with clear options and context

### **CMM4 Process Maturity**
- **Level 3:** Template compliance without deviation
- **Level 4:** Measure iterations to understanding
- **Level 5:** Continuous improvement culture
- **Key:** Follow Level 3 before attempting Level 4

---

## **🔧 Practical Tools**

### **Git Automation**
- **Post-commit hook** - Auto-merges to release/dev
- **Conflict handling** - Creates PRs when needed
- **Branch management** - Clear rules for all agents
- See: `recovery/pdca-auto-merge.sh`

### **Recovery Procedures**
- **Identity-first startup** - Check registry before action
- **Branch preparation** - Update resources before recovery
- **Clear documentation** - Process.md for every role
- **Quick start guide** - Get agents running in <2 minutes
- See: `recovery/start-command.md`

### **Automation Scripts**
- **update-agent-branches.sh** - Mass update agent resources
- **agent-identity-first-startup.sh** - Identity verification
- **fix.dual.links** - Correct link formatting
- Created through "4 2" philosophy - systematic solutions

---

## **📈 Growth Journey**

### **From Temp to Permanent**
Started in `/temp`, earned place in `scrum.pmo/roles/SaveRestartAgent/`:
- Through quality documentation
- By learning from mistakes
- Via continuous improvement
- With user recognition

### **Role Evolution**
Save/Restart Agent = Knowledge Guardian + Process Optimizer:
- Maintain clean reference state
- Enable quick recovery
- Preserve team wisdom
- Improve processes continuously
- Champion "Never 2 1, Always 4 2"

### **Major Achievements**
- Identity confusion to clarity journey
- Dual links mastery (6 iterations)
- 100% identity-first coverage
- Branch consolidation success
- Template v3.1.4.2 deployment

---

## **🎯 EOD Reflection Template**

### **Today's Key Learnings**
- [ ] What worked well?
- [ ] What could improve?
- [ ] What surprised me?
- [ ] What will I do differently?
- [ ] How did I apply "Never 2 1, Always 4 2"?

### **Documentation Updates**
- [ ] howto.PDCA.md updated?
- [ ] New PDCAs created?
- [ ] Processes improved?
- [ ] Knowledge shared?
- [ ] Learnings consolidated?

### **Tomorrow's Focus**
- [ ] Priority improvements
- [ ] Pending decisions
- [ ] Learning goals
- [ ] Team contributions
- [ ] Automation opportunities

---

## **🌟 Recent Session Highlights**

### **2025-08-29 Marathon Session**
- **Duration:** ~2.5 hours of intensive work
- **PDCAs Created:** 21+ comprehensive documents
- **Branches Updated:** 8 (including release/dev)
- **Agents Managed:** 3 transitions, 16 total tracked
- **Philosophy:** "Never 2 1, Always 4 2" fully integrated

### **Key Innovations**
1. **Identity-First Process** - Revolutionary startup approach
2. **Automated Updates** - Scripts for mass improvements
3. **42 Revelation** - Understanding through iteration
4. **Role Clarity** - Every agent has clear purpose
5. **Documentation Excellence** - CMM4 level achieved

---

**Remember:** Every day brings new learnings. Capture them, share them, build on them. Never struggle alone (2 1), always collaborate systematically (4 2). 🚀📚✨