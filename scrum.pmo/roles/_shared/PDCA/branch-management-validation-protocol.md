# Branch Management Validation Protocol

**📋 Purpose:** Prevent implementation failures through step-by-step verification and content validation

**🎯 Created:** 2025-08-28-UTC-1105 - Following save/start.v3 implementation failure and correction

---

## **🔄 Pre-Implementation Checklist**

### **1. Source Verification**
- [ ] Confirm source branch contains expected improvements
- [ ] `git log --oneline SOURCE_BRANCH -5` - Review recent commits
- [ ] Verify all required files and systems present in source
- [ ] Check branch is up-to-date with latest changes

### **2. Clean State Verification**
- [ ] `git status` - Confirm no uncommitted changes
- [ ] `git stash` if needed to save local work
- [ ] Document any stashed changes for recovery

---

## **🔧 Implementation Validation Steps**

### **Branch Creation Protocol**
```bash
# Step 1: Source Content Verification
git checkout SOURCE_BRANCH
git log --oneline -3
git status

# Step 2: Branch Creation
git checkout -b NEW_BRANCH_NAME

# Step 3: Immediate Content Verification
git log --oneline NEW_BRANCH_NAME -3
# Verify: Does new branch contain expected source commits?

# Step 4: Push with Verification
git push -u origin NEW_BRANCH_NAME

# Step 5: Remote Content Verification
git log --oneline origin/NEW_BRANCH_NAME -3
# Verify: Does remote branch match local content?
```

### **Content Audit Checklist**
After branch creation, verify presence of critical systems:

- [ ] **Templates**: Latest PDCA templates and formats
- [ ] **Process Files**: Updated howto and decision frameworks  
- [ ] **Improvement Systems**: Natural behavior accommodation files
- [ ] **Communication Protocols**: Agent validation systems
- [ ] **Learning Documentation**: Session analysis and insights

---

## **✅ Post-Implementation Validation**

### **Content Parity Test**
```bash
# Compare new branch with source for content verification
git diff SOURCE_BRANCH..NEW_BRANCH --name-only
# Should show: No differences (0 files) for proper copy
```

### **Access Verification**
- [ ] Key directories accessible: `scrum.pmo/roles/_shared/PDCA/`
- [ ] Agent-friendly templates present and readable
- [ ] Communication systems available: `scrum.pmo/agent-communication/`
- [ ] All session PDCAs and learning documentation accessible

### **Documentation Requirements**
- [ ] Record actual commit hash of created branch
- [ ] Document verification steps completed
- [ ] Confirm content audit results
- [ ] Note any discrepancies between expected and actual

---

## **🚨 Failure Prevention Measures**

### **Git Operation Safety**
1. **Never trust command success alone** - Always verify content
2. **Check remote matches local** after push operations
3. **Use step-by-step verification** for multi-operation processes
4. **Document actual results** not just process completion

### **Implementation Integrity Standards**
1. **Content verification required** before claiming implementation success
2. **Separate process completion from result validation** in documentation
3. **Include verification evidence** in implementation documentation
4. **Test access to critical systems** before declaring readiness

---

## **🔄 Emergency Recovery Procedures**

### **When Implementation Fails**
1. **Immediate Error Analysis**
   - Document claimed vs actual results
   - Identify exact point of failure
   - Preserve failed branch for analysis

2. **Root Cause Investigation**
   - Review git operation logs
   - Check for conflict resolution issues
   - Analyze content differences

3. **Impact Assessment**
   - Determine consequences of failed implementation
   - Assess system access implications
   - Plan correction strategy

4. **Correction Implementation**
   - Create new version with proper verification
   - Follow full validation protocol
   - Document correction process

5. **Process Learning Integration**
   - Update validation protocol based on failure
   - Add prevention measures for identified failure mode
   - Document lessons learned for future reference

---

## **📊 Validation Metrics**

### **Success Criteria**
- ✅ New branch contains all expected improvements
- ✅ Remote branch matches local content exactly  
- ✅ Critical systems accessible and functional
- ✅ Content parity with source branch verified
- ✅ Documentation matches actual implementation

### **Failure Indicators**
- ❌ New branch missing expected files or commits
- ❌ Remote branch differs from local branch
- ❌ Critical systems inaccessible or incomplete
- ❌ Content differs from source branch unexpectedly
- ❌ Claims about implementation don't match verification results

---

**🎯 This protocol prevents implementation failures by requiring verification at each step rather than trusting process completion alone.**

**Created following save/start.v3 failure where claimed success delivered zero improvements - verification prevents similar disasters.**
