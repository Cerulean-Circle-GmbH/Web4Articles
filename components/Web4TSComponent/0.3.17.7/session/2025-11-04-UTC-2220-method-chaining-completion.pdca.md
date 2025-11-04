# PDCA: Method Chaining Completion - After `on` Command

**Created:** 2025-11-04 UTC 22:20  
**Author:** AI Agent (Claude Sonnet 4.5)  
**Component:** Web4TSComponent 0.3.17.7  
**Type:** Bug Fix - Completion Logic  

---

## 📋 **PLAN**

### **Problem Statement**

When using method chaining with the `on` command, completion stops after the `on` parameters are complete, instead of continuing to complete the next chained method.

**User Bash Terminal Evidence:**
```bash
web4tscomponent on IdealMinimalComponent latest li
💭 Thinking...

Completing: on <component> <?version>


(no completions available)
```

**Expected Behavior:**
```bash
web4tscomponent on IdealMinimalComponent latest li
💭 Thinking...

Completing: METHOD (after 'on IdealMinimalComponent latest')
Completion Component: Web4TSComponent v0.3.17.7
Target Component: IdealMinimalComponent v0.3.17.7

(show methods starting with 'li' like 'links')
```

### **Root Cause Analysis**

**Current Completion Logic:**
1. Parses: `web4tscomponent on IdealMinimalComponent latest li`
2. Identifies: Currently completing `on` command parameters
3. Sees: `<?version>` is optional and already filled
4. Returns: "(no completions available)" - WRONG!

**What Should Happen:**
1. Parses: `web4tscomponent on IdealMinimalComponent latest li`
2. Identifies: `on <component> <?version>` is FULLY complete (3 words consumed)
3. Recognizes: Next word `li` starts a NEW method (method chaining!)
4. Switches: From parameter completion to METHOD completion
5. Provides: Methods of IdealMinimalComponent starting with `li`

**The Bug:**
- Completion logic doesn't detect when `on` command parameters are fully consumed
- Doesn't switch from parameter completion to method completion for chained command
- Doesn't load the target component context for method completion

### **Requirements**

**R1: Detect Method Chaining**
- After `on <component> <version>`, recognize that next word is a new method
- Count consumed words to know when parameter completion is done

**R2: Diagnostic Output Enhancement**
```
Completing: METHOD (after 'on IdealMinimalComponent latest')
Completion Component: Web4TSComponent v0.3.17.7
Target Component: IdealMinimalComponent v0.3.17.7
```

**R3: Context Switching**
- Load target component (IdealMinimalComponent) for method discovery
- Complete methods from target component, not source component

**R4: Show Current Position**
```
Completing: on <component> <?version>
Parameter: <?version>
```
This already works! Need to keep it and extend for method chaining.

### **QA Decisions**

**Decision 1: How to detect method chaining?**

Options:
- **a)** Count consumed words vs method parameters - if all parameters filled, next word is new method
  - ✅ Simple logic
  - ✅ Works with optional parameters
  - ✅ No context changes needed
- **b)** Parse entire command line into chained methods first
  - ❌ Complex
  - ❌ Requires full parser
  - ❌ Overkill

User Decision: [ ] a / [ ] b

**Decision 2: Where to implement context switching?**

Options:
- **a)** In `cliSignature()` after detecting chaining
  - ✅ Central location
  - ✅ All completion goes through here
  - ✅ Can call loadComponent()
- **b)** In `getValidCompletionValues()`
  - ❌ Too late - already determined what to complete
  - ❌ Harder to switch context

User Decision: [ ] a / [ ] b

**Decision 3: How to show component versions in diagnostic?**

Format:
```
Completion Component: Web4TSComponent v0.3.17.7
Target Component: IdealMinimalComponent v0.3.17.7
```

Options:
- **a)** Add to `outputCompletionDiagnostic()` when context differs
  - ✅ Clear separation of concerns
  - ✅ Shows both component versions
- **b)** Only show target component
  - ❌ User can't tell which completion version is running
  - ❌ Less transparent

User Decision: [ ] a / [ ] b

---

## 🔨 **DO**

*Implementation will be documented after decisions*

---

## ✅ **CHECK**

*Test results will be documented after implementation*

---

## 🔄 **ACT**

*Process improvements will be documented after CHECK*

---

## 📊 **Meta**

- **Related:** 2025-11-04-UTC-2044.pdca.md (diagnostic output implementation)
- **Issue:** Method chaining completion stops after `on` command
- **CMM Level:** Target CMM3 (Reproducible completion behavior)

