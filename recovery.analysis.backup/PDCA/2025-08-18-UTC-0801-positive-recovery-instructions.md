[Back to Recovery Analysis](../recovery-process-analysis.md)

# 📋 **PDCA Cycle: Positive Recovery Instructions - 2025-08-18-UTC-0801**

**🗓️ Date:** 2025-08-18-UTC-0801  
**🎯 Objective:** Rewrite recovery instructions to focus on WHAT TO DO  
**👤 Role:** Developer (Documentation Improvement)  
**🚨 Issues:** Previous docs focused on negatives; agents need clear positive actions

## **✅ Summary**

**📊 QA Decisions**
- [x] Rewrote branch strategy with positive instructions
- [x] Clear "ALWAYS DO THIS" approach
- [x] Removed confusing negative warnings
- [x] Added merge instructions for agent-specific branches

**🔗 Artifact Links**
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/test/recovery/recovery.analysis/design.recovery.branch-strategy.md) | [recovery.analysis/design.recovery.branch-strategy.md](../design.recovery.branch-strategy.md)

---

## **📋 Plan**

### **Documentation Strategy**
1. Remove "what not to do" focus
2. Create clear "ALWAYS DO THIS" instructions
3. Specify origin/feature/analyze-ranger as THE starting point
4. Add merge instructions for other branches

---

## **🔨 Do**

### **Rewrote Branch Strategy**
Changed from:
- "DON'T use release/dev"
- "AVOID main"
- Confusing warnings

To:
- "ALWAYS start from origin/feature/analyze-ranger"
- "Then merge what you need"
- Clear positive steps

### **Created Simple Instructions**
```bash
# ALWAYS DO THIS:
git checkout origin/feature/analyze-ranger
git checkout -b your-work-branch
# Then merge any needed branch
```

---

## **🔍 Check**

### **QA Feedback**
> **User Input**: "Safe Recovery Branches ├── main (at commit f89aba0) MAIN has ta slightly oder version of release/dev but is also not save in the todays state when yo write the pdca with utc. it is more importena to say WHAT TO DO than what NOT to do!!! because then you do not know WHAT TO DO. in this case recover always from origin/feature/analyze-ranger create a new branch and merge from release/dev or any other agent specific branch...."  
> **Timestamp**: 2025-08-18-UTC-0801

### **Improvements Made**
- ✅ Focus on positive actions
- ✅ Clear starting point
- ✅ Simple merge strategy
- ✅ No confusing negatives

---

## **⚡ Act**

### **New Clear Instructions**
1. ALWAYS start: `origin/feature/analyze-ranger`
2. Create your branch
3. Merge what you need
4. Test before proceeding

### **Key Learning**
Positive instructions ("DO THIS") are more effective than negative warnings ("DON'T DO THAT").

---

## **🎯 PDCA Process Update**

**Key Learning**: Documentation should guide with clear positive actions, not confuse with multiple warnings about what to avoid.

**Process Enhancement**: All recovery docs now start with "ALWAYS DO THIS" instead of warnings.

**Quality Impact**: Agents can immediately start working instead of being paralyzed by warnings.

---

## **📝 One-Line Summary**
Rewrote recovery instructions to focus on positive action: "ALWAYS start from origin/feature/analyze-ranger, then merge what you need" instead of confusing negative warnings.