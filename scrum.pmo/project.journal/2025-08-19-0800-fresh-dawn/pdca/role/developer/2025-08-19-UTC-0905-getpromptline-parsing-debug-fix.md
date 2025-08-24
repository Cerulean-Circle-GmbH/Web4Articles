# 🔧 PDCA: getPromptLine() Parsing Debug & Fix

**Date:** 2025-08-19 UTC 09:05  
**Role:** Developer  
**Objective:** Fix getPromptLine() parsing bug blocking all Matrix v4 test validations  
**Handover From:** Tester role - systematic analysis complete  

---

## **📊 SUMMARY**

### **Artifact Links**
- [Test File with Bug](../../../../../components/TSRanger/v2.0/test/tsranger.unambiguous-requirements.test.ts) | [Local File](../../../../../components/TSRanger/v2.0/test/tsranger.unambiguous-requirements.test.ts)
- [Tester Analysis PDCA](../tester/2025-08-19-UTC-0900-unambiguous-requirements-test-failure-analysis.md) | [Local PDCA](../tester/2025-08-19-UTC-0900-unambiguous-requirements-test-failure-analysis.md)

### **QA Feedback from TRON**
> **2025-08-19 UTC 08:58:** "again some interactivemodee???"

**Tester provided critical discovery:** TSRanger outputs `'Logger'` correctly, but `getPromptLine()` returns empty string `''` for all 8 tests.

### **Problem Scope**
- **8/8 Tests Failing:** All due to same parsing issue  
- **TSRanger Working:** Binary execution confirmed functional  
- **Framework Working:** Vitest `--run` mode working correctly  
- **Parse Function Broken:** `getPromptLine()` logic doesn't match output format

---

## **📝 PLAN**

### **Objective**
Debug and fix `getPromptLine()` function to correctly extract prompt text from TSRanger output.

### **Debugging Strategy**
1. **Raw Output Analysis**: Compare actual TSRanger output with expected parsing  
2. **Working Test Comparison**: Study `tsranger.dry-key-combinations.test.ts` helpers  
3. **Step-by-step Debug**: Add console.log to trace parsing logic  
4. **Format Alignment**: Fix parsing to match actual output format  
5. **Validation**: Re-run tests to confirm all 8 pass

### **Evidence Available**
```bash
# Raw TSRanger output (WORKING):
[McDonges.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.0 Logger

# Test expectation (LOGICAL):
expect(promptLine).toBe('Logger');

# Actual test result (BUG):
expected '' to be 'Logger'
```

---

## **🔨 DO**

### **Step 1: Raw Output Analysis**
✅ **Confirmed TSRanger Output Format:**
- Prompt line contains: `[McDonges.fritz.box] donges@.../components/TSRanger/v2.0 Logger`
- Expected extraction: `'Logger'` (class name at end)

### **Step 2: Current getPromptLine() Logic Investigation**
Current function:
```typescript
function getPromptLine(out: string): string {
  const lines = out.split(/\r?\n/);
  const footerIdx = lines.findIndex(l => l.includes('column') && l.includes('Enter: select'));
  if (footerIdx > 1) {
    return lines[footerIdx - 2] || '';
  }
  return '';
}
```

**Hypothesis:** Looking for footer with 'column' and 'Enter: select', then taking line `footerIdx - 2`. But this logic may not match actual output structure.

### **Step 3: Debug Implementation**
[Implementation will follow systematic debugging approach]

---

## **✅ CHECK**

[To be completed after debugging implementation]

---

## **🎯 ACT**

### **Immediate Action Items**
1. **Debug Raw Output Structure:** Add console.log to see exact line parsing  
2. **Compare Working Tests:** Study existing helpers that work  
3. **Fix Parsing Logic:** Align with actual TSRanger output format  
4. **Validate Fix:** Run `npx vitest test/tsranger.unambiguous-requirements.test.ts --run`  
5. **Document Solution:** Update PDCA with fix details

### **Success Criteria**
- All 8 tests show expected prompt values instead of empty strings  
- `getPromptLine('[down]')` returns `'Logger'` 
- `getPromptLine('g')` returns `'GitScrumProject'`
- Matrix v4 unambiguous requirements validation complete

---

## **🎯 PDCA Process Update**

**Role:** Developer (debugging focus)  
**Next Steps:** Systematic debugging of getPromptLine() parsing logic  
**Success Metric:** 8/8 tests passing with correct prompt extraction  

---

**🔧 Developer debugging initiated. Systematic parsing fix in progress.**

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🛠️📊
