# Fractal PDCA Checklist v1.0.0

**Purpose**: Execute-focused checklist for fractalizing complex PDCA iterations  
**Format**: Minimal, scannable, agent-optimized  
**Date**: 2025-11-21

---

## **🎯 WHEN TO FRACTALIZE**

Fractalize if **ANY** condition is true:

- [ ] **1a** Iteration estimate **>4 hours**
- [ ] **1b** Iteration has **>3 distinct technical concerns**
- [ ] **1c** Iteration touches **core architecture** or introduces **new paradigm**
- [ ] **1d** User says **"I think it's big"** (domain expert feedback)
- [ ] **1e** Initial estimate feels **uncertain** or **vague**

**Action**: If ANY checked → Proceed to Section 2

**References**:
- [Detailed Guide](./howto.fractal.pdca.md)
- [CMM3 Checklist](./cmm3.compliance.checklist.md)

---

## **2️⃣ FRACTAL DECOMPOSITION**

### **2a. Analyze**
- [ ] List all **distinct technical concerns** (interfaces, implementation, communication, UI)
- [ ] Map **dependencies** (which must be done first?)
- [ ] Identify **validation points** (where must we stop and verify?)

### **2b. Decompose**
- [ ] Split into **3-5 sub-iterations**
- [ ] Each sub-iteration: **1-3 hours**
- [ ] Each sub-iteration: **clear deliverable**
- [ ] Each sub-iteration: **testable independently**

### **2c. Dependency Order**
- [ ] Sub-iterations ordered by dependencies: A → B → C → D
- [ ] No sub-iteration depends on future sub-iteration
- [ ] Foundational work (interfaces, types) comes first

**Pattern**:
```
Foundation (interfaces/types) → Core (implementation) → Integration (communication) → UI (user-facing)
```

---

## **3️⃣ CHECK CRITERIA (MANDATORY)**

**CRITICAL**: Each sub-iteration MUST have CHECK criteria BEFORE starting DO phase.

### **For Each Sub-Iteration, Define**:

#### **3a. Compilation Check**
- [ ] `tsc --noEmit` must pass (zero errors)
- [ ] No import resolution errors
- [ ] No circular dependencies

#### **3b. Test Check**
- [ ] **New Tests**: Specify exactly how many and what type (unit/integration/E2E)
  - [ ] Test case 1: [specific behavior]
  - [ ] Test case 2: [specific behavior]
- [ ] **Existing Tests**: ALL must still pass (specify count, e.g., 25/25)

#### **3c. Manual Verification** (if applicable)
- [ ] Specify WHAT to verify manually
- [ ] Specify HOW to verify (commands, UI actions)
- [ ] Specify expected RESULT

#### **3d. Success Criteria**
- [ ] List 3-5 **measurable** deliverables
- [ ] Each criterion must be **verifiable** (YES/NO)
- [ ] NO subjective criteria ("better", "cleaner", "improved")

**Template**:
```markdown
**CHECK Phase**:
- [ ] Compilation: `tsc --noEmit` passes
- [ ] New Tests: [N] [unit/integration/E2E] tests pass
- [ ] Existing Tests: All [N] tests pass
- [ ] Manual: [specific verification]

**Success Criteria**:
- ✅ [Measurable deliverable 1]
- ✅ [Measurable deliverable 2]
- ✅ Code compiles
- ✅ Tests pass ([N] existing + [N] new)
```

---

## **4️⃣ TRACKING PDCA UPDATES**

### **4a. Iteration Section Update**
- [ ] Show split: Original estimate → New total (with sub-count)
- [ ] Add warning: `⚠️ SCOPE CLASSIFICATION: [MAJOR/MEDIUM/SMALL]`
- [ ] List all sub-iterations with individual estimates
- [ ] For each sub-iteration, include:
  - [ ] Full tasks list
  - [ ] Complete CHECK phase
  - [ ] Clear success criteria

### **4b. Progress Tracking Update**
- [ ] Add fractal tree diagram showing sub-iterations
- [ ] Use tree format:
```
Iteration X.Y: Name (Total Duration)
  ├── X.Y.1: Name (Xh)
  ├── X.Y.2: Name (Xh)
  └── X.Y.3: Name (Xh)
```

### **4c. Complexity Analysis Update**
- [ ] Update sub-iteration count
- [ ] Update test strategy (total new tests)
- [ ] Update duration (original → realistic)
- [ ] Update timeline impact if >1 day change
- [ ] Add "CHECK Criteria: Applied to EVERY sub-iteration"

---

## **5️⃣ EXECUTION WITH CHECK GATES**

**CRITICAL RULE**: **NEVER** proceed to next sub-iteration until current passes CHECK.

### **For Each Sub-Iteration**:

#### **5a. BEFORE Starting DO**
- [ ] Previous sub-iteration CHECK phase **passed**
- [ ] Previous sub-iteration **committed** (if applicable)
- [ ] Current sub-iteration CHECK criteria **reviewed and understood**

#### **5b. DURING DO**
- [ ] Follow detailed PDCA steps
- [ ] Document any deviations in PDCA
- [ ] Keep changes focused (no scope creep)

#### **5c. DURING CHECK** (Execute in Order)
1. [ ] Run `tsc --noEmit` → MUST pass
2. [ ] Run new tests → MUST pass
3. [ ] Run existing tests → MUST pass
4. [ ] Perform manual verification → MUST match expected result
5. [ ] Check linter → No new errors

#### **5d. IF CHECK FAILS**
- [ ] **STOP** immediately
- [ ] **FIX** the issue
- [ ] **RE-CHECK** from step 5c.1
- [ ] **DO NOT** proceed until all CHECK steps pass

#### **5e. AFTER CHECK PASSES**
- [ ] Update tracking PDCA (mark sub-iteration ✅)
- [ ] Git commit (if appropriate gate)
- [ ] Review next sub-iteration CHECK criteria
- [ ] Proceed to next sub-iteration

**Flow**:
```
Sub-Iter X.Y.1: DO → CHECK → Pass? YES → X.Y.2
                              NO → FIX → RE-CHECK → Pass? YES → X.Y.2
```

---

## **6️⃣ SELF-FEEDBACK LOG**

After completing fractalized iteration:

- [ ] Create entry in tracking PDCA "Self-Feedback & Learning Log"
- [ ] Document: Initial estimate vs. actual
- [ ] Document: What triggered fractalization (user feedback)
- [ ] Document: Key lessons learned (3-5 insights)
- [ ] Document: Protocol refinement (what will be done differently next time)
- [ ] Document: Commitment to future behavior

**Template**:
```markdown
**Lesson from [Source] ([Date])**:
- ❌ Initial Assessment: [X hours, small task]
- ✅ Reality: [Y hours, major refactor]
- ✅ Learning: [When user says "I think it's big", believe them]
- ✅ Commitment: [Always properly assess architectural scope]
```

---

## **7️⃣ ANTI-PATTERNS (NEVER DO)**

### **7a. Fractalization Anti-Patterns**
- [ ] ❌ Fractalize without CHECK criteria
- [ ] ❌ Sub-iterations >3 hours (too large)
- [ ] ❌ Sub-iterations without clear deliverable
- [ ] ❌ Missing test strategy ("we'll test at the end")

### **7b. Execution Anti-Patterns**
- [ ] ❌ Proceed despite failed CHECK ("I'll fix it later")
- [ ] ❌ Skip existing test verification ("they probably still work")
- [ ] ❌ Skip manual verification ("looks good enough")
- [ ] ❌ Batch multiple sub-iterations without CHECK gates

### **7c. Documentation Anti-Patterns**
- [ ] ❌ Update tracking PDCA after all sub-iterations complete
- [ ] ❌ Vague success criteria ("improve architecture")
- [ ] ❌ No self-feedback log entry
- [ ] ❌ Missing complexity analysis update

---

## **📊 QUICK VALIDATION**

Use this for rapid self-check before proceeding:

### **Before Fractalization**:
- [ ] Condition 1a-1e triggered? → YES = Fractalize
- [ ] Analyzed all technical concerns?
- [ ] Mapped all dependencies?

### **After Fractalization Plan**:
- [ ] 3-5 sub-iterations defined?
- [ ] Each sub-iteration 1-3 hours?
- [ ] EVERY sub-iteration has CHECK criteria?
- [ ] Test strategy defined? (e.g., "+9 tests total")
- [ ] Tracking PDCA updated? (sections 4a, 4b, 4c)

### **During Execution** (Per Sub-Iteration):
- [ ] CHECK criteria reviewed before DO?
- [ ] All CHECK steps executed?
- [ ] All CHECK steps passed?
- [ ] Tracking PDCA marked complete?
- [ ] Only then proceeding to next?

### **After All Sub-Iterations**:
- [ ] All sub-iterations completed?
- [ ] All tests pass (existing + new)?
- [ ] Self-feedback log updated?
- [ ] Lessons learned documented?

**If ALL checked → Fractalization successful ✅**

---

## **🔗 REFERENCE DOCUMENTS**

### **Primary**:
1. **Fractal PDCA HowTo** (Detailed): [§/scrum.pmo/roles/_shared/howto.fractal.pdca.md](./howto.fractal.pdca.md)
2. **CMM3 Checklist**: [§/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md](./cmm3.compliance.checklist.md)
3. **PDCA Template**: [§/scrum.pmo/roles/_shared/PDCA/template.md](./PDCA/template.md)

### **Related**:
4. **PDCA HowTo**: [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](./PDCA/howto.PDCA.md)
5. **Git Protocol**: [§/scrum.pmo/roles/_shared/PDCA/howto.git-protocol.md](./PDCA/howto.git-protocol.md)

---

## **💡 AGENT LEARNING SHORTCUTS**

### **When User Says**:
- "I think it's big" → **Immediately fractalize** (1d triggered)
- "This is complex" → **Immediately fractalize** (1c triggered)
- Duration >4h → **Immediately fractalize** (1a triggered)

### **Red Flags** (Immediate Fractalize):
- New paradigm introduction (protocol-less, global singleton, etc.)
- Core architecture changes (interfaces, base classes, etc.)
- Multiple Web4 principles in one iteration
- User corrects your estimate upward

### **Execution Rules** (NEVER VIOLATE):
1. **CHECK before proceed**: No exceptions
2. **Fix immediately**: Never defer CHECK failures
3. **Existing tests always**: Must pass at every sub-iteration
4. **One sub-iteration at a time**: No batching

### **Documentation Rules** (ALWAYS):
1. **Update tracking PDCA**: After each sub-iteration completion
2. **Mark progress**: Use ✅ for completed sub-iterations
3. **Self-feedback**: After every fractalized iteration
4. **Lessons learned**: Capture what triggered fractalization

---

## **📈 SUCCESS METRICS**

Fractalization is successful when:

- ✅ All sub-iterations completed with CHECK gates passed
- ✅ All existing tests pass (e.g., 25/25 maintained)
- ✅ New tests added (~N tests as planned)
- ✅ Zero regressions
- ✅ Code compiles cleanly
- ✅ Tracking PDCA updated
- ✅ Self-feedback log documented
- ✅ User approves (implicit or explicit)

---

**Version**: 1.0.0 (2025-11-21)  
**Format**: Execution-focused checklist (agent-optimized)  
**Companion**: [howto.fractal.pdca.md](./howto.fractal.pdca.md) (detailed reference)

