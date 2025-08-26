# 🍒 **Cherry-Pick Prompt for Background Agent**

## **Critical Updates Available in release/dev Branch**

The following commits contain essential UCP compliance fixes, version management standards, and repository cleanup procedures that your agent needs to integrate:

### **🎯 Required Cherry-Pick Commands**

```bash
# Navigate to your workspace
cd /workspace

# Ensure you're on your working branch
git checkout [your-branch-name]

# Cherry-pick critical UCP violation fix (ESSENTIAL)
git cherry-pick 785bdd1
# Contains: Unit component build fix, JSON syntax correction, UCP requirements

# Cherry-pick repository cleanup procedures (IMPORTANT) 
git cherry-pick 0bdfdcc
# Contains: Git vs filesystem cleanup procedures, dual-phase cleanup standards

# Cherry-pick DevOps automation requirements (RECOMMENDED)
git cherry-pick b5598a1  
# Contains: Version management automation and post-refactoring cleanup requirements

# Cherry-pick version management standards (RECOMMENDED)
git cherry-pick 6f3a3ee
# Contains: Web4 component version management workflow and cleanup implementation
```

### **🔧 Essential Fix Details**

**Commit 785bdd1 - CRITICAL UCP Violation Fix:**
- ✅ **Fixed Unit component build:** `components/Unit/latest/dist/ts/layer2/UnitIndexStorage.js` now available
- ✅ **JSON syntax correction:** Removed invalid comments from `package.json` files
- ✅ **Requirement CLI restored:** ERR_MODULE_NOT_FOUND resolved
- ✅ **UCP compliance:** Component self-containedness principles restored

**Impact on Your Tools:**
- `requirement` CLI now works correctly
- Web4Requirement component dependencies resolved
- Background agent functionality restored

### **⚠️ Potential Conflicts & Resolutions**

**If cherry-pick conflicts occur:**
```bash
# Review conflicts
git status

# Most likely conflicts in:
# - components/Unit/latest/package.json (choose clean JSON version)
# - Any custom changes to Web4Requirement component

# Resolve conflicts, then:
git add .
git cherry-pick --continue
```

### **✅ Verification Steps**

**After cherry-picking, verify functionality:**
```bash
# Test requirement CLI functionality
requirement

# Expected output: Usage instructions (not ERR_MODULE_NOT_FOUND)

# Verify Unit component build
ls -la components/Unit/latest/dist/ts/layer2/UnitIndexStorage.js

# Test requirement creation
requirement create "Test Requirement" "Verify cherry-pick successful"
```

### **📋 Alternative: Full Branch Merge**

**If cherry-picking causes issues, merge entire branch:**
```bash
git merge origin/release/dev
# Contains all updates with proper conflict resolution
```

## **🎯 Why These Updates Are Critical**

1. **UCP Compliance Restored:** Your background tools will work correctly
2. **Build Process Fixed:** Component dependencies properly built and available  
3. **Repository Standards:** Clean development environment and procedures
4. **Version Management:** Professional component lifecycle management
5. **DevOps Foundation:** Automation requirements for future CI/CD integration

**Priority:** Cherry-pick commit `785bdd1` immediately - this fixes the ERR_MODULE_NOT_FOUND error preventing your requirement tools from functioning.
