# HowTo: Fractal PDCA - Breaking Down Complex Iterations

**Version**: 1.3.0  
**Date**: 2026-01-08  
**Author**: AI Assistant (Claude Opus 4.5)  
**Purpose**: Guide for fractally splitting complex PDCA iterations into manageable sub-iterations

---

## **🚫 TLA = The Last Acronym** (Web4 Semantic Naming)

> **TLA** stands for **"The Last Acronym"** for **"The Last Architecture"** (Web4).
> 
> **⚠️ STOP INVENTING ABBREVIATIONS! No one can understand them — not even yourself after context reset!**

### **Rules**

1. **NEVER invent new abbreviations** — Use full descriptive names
2. **NEVER use ambiguous short forms** — `MC`, `CPA`, `SOI` mean NOTHING
3. **ALWAYS use the PDCA filename** — It IS the unique identifier
4. **ALWAYS write out full names in tables** — Readability > brevity

### **Bad Examples (FORBIDDEN)**

```markdown
| MC | CPA | SOI | MDE |  ← MEANINGLESS ALPHABET SOUP
| ✅ | ✅ | 🟡 | ⏳ |
```

### **Good Examples (REQUIRED)**

```markdown
| PDCA | Status |
|------|--------|
| Model Consolidation DRY Cleanup | ✅ COMPLETE |
| CLI Path Authority Full Migration | ✅ COMPLETE |
| Scenario-Only Init Violations | 🟡 PLAN |
```

### **Why This Matters**

- **Context window resets** — Abbreviations become meaningless
- **Semantic Web principle** — Names carry meaning
- **Collaboration** — Others (and future you) need to understand
- **PDCA filename IS the identifier** — No need for abbreviations

---

## **🗂️ MANDATORY Stack Format** (DO NOT INVENT OTHER STRUCTURES)

> **⚠️ The FRACTAL PDCA STACK section MUST be at the TOP of the tracking PDCA and contain ALL incomplete work in hierarchical format. DO NOT create separate "CURRENT STATUS" sections or tables.**

### **Required Format**

```markdown
## **🗂️ FRACTAL PDCA STACK** (hierarchical, update before every commit)

➡️ **Next:** [PDCA Name](./path.pdca.md) — 🟡 PLAN

- 🔵 **Parent PDCA Name** — **XX% COMPLETE** (~Xh/Yh)
  - [GitHub](https://...) | [§/path/to/pdca.md](./path.pdca.md)
  - **Goal**: One-line description
  - ✅ Completed sub-tasks
  - **🔵 CURRENT →** Current sub-task description
    - [GitHub](https://...) | [§/path/to/sub.pdca.md](./sub.pdca.md)
  - ⏳ Pending sub-tasks
  - 🔮 Future sub-tasks — FUTURE
- 🟡 **Another PDCA** — **IN PROGRESS**
  - Details...

📊 **Build Status**
\`\`\`
tsc --noEmit   # ✅ 0 errors
./once build   # ✅ Exit 0
\`\`\`

**[→ Completed History](#-completed-pdca-history)**
```

### **Rules**

1. **Stack AT THE TOP** — `🗂️ FRACTAL PDCA STACK` is the FIRST section after header
2. **NO separate status sections** — All incomplete work is IN the stack
3. **Hierarchical indentation** — Shows parent→child relationships
4. **`➡️ Next:`** — Always shows what's immediately next
5. **Completed PDCAs** — Go to `📜 COMPLETED PDCA HISTORY` at the bottom
6. **Details in history** — Use `<details>` for collapsed completed PDCA lists

### **Forbidden**

- ❌ Creating `🔴 CURRENT STATUS` sections
- ❌ Tables for incomplete PDCAs (tables are for completed history only)
- ❌ Moving stack content to other sections
- ❌ Inventing new section types

---

## **🎯 Minimal Fractal PDCA Checklist**

### **Step 1: Identify Fractal Candidates**

Review the tracking PDCA iteration plan:

**Reference Documents**: READ THEM FIRST
- 📄 [CMM3 Compliance Checklist](./cmm3.compliance.checklist.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)
- 📄 [PDCA Template](./PDCA/template.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md)
- 📄 [PDCA HowTo](./PDCA/howto.PDCA.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md)

**Checklist**:
- [ ] Iteration duration estimated at **>4 hours**?
- [ ] Iteration has **>3 distinct technical concerns**?
- [ ] Iteration touches **core architecture** or **introduces new paradigm**?
- [ ] User feedback indicates **complexity underestimated**?
- [ ] **If ANY = YES**: Proceed to Step 2 (Fractalize) (---> ### **Step 2: Analyze & Decompose**)


---

## **🎓 Self-Informing with PDCA Tools** ⚠️ READ FIRST

When you are uncertain about any Web4, CMM3, or PDCA concept, **use the tools to self-inform before assuming**.

### **How to Self-Inform**

**1. Run a component without parameters** to see its capabilities:
```bash
cd /path/to/component
./component-name

# e.g. 
components/PDCA/0.3.5.2/pdca
```

This shows all available methods, parameters, and examples.

**2. Use `trainAI` for specific topics**:
```bash
./pdca trainAI dual-links    # Learn about dual links
./pdca trainAI pdca          # Learn about PDCA process
./pdca trainAI cmm           # Learn about CMM compliance
./pdca trainAI decide        # Learn about QA decisions
./pdca trainAI start         # Overview of all topics
```

Available topics: `start`, `pdca`, `cmm`, `component`, `feature-development`, `tech-stack`, `test-workflow`, `test-first`, `dual-links`, `ensure-links`, `component-upgrade`, `interpret-instructions`, `collaborate`, `chat-response`, `decide`

**3. Use `queryTrainAI` for natural language questions**:
```bash
./pdca queryTrainAI "how do I format dual links?" dual-links
```

### **Key Dual Link Insight**

**In markdown files (PDCAs)**:

`[GitHub](https://...) | [§/path/to/file](./relative/path)`

- GitHub link: absolute URL for verification
- § notation: project-root-relative path for display
- Link target: relative path from the markdown file

**In CHAT responses**:

`[GitHub](https://...) | [§/path/to/file](/absolute/path/to/file)`
- § notation: same (project-root-relative for display)
- Link target: **MUST be absolute** (chat is not in the project)

**Tool**: Use `pdca getDualLink <file>` to generate correct format.

### **RAG First Principle**

> When uncertain, query `trainAI` before acting. Context window exhaustion leads to assumptions and violations.

### **L16: Self-Re-Inform After Context Summary**

When context was summarized (message says "Summary:..."), immediately re-read:

1. **Tracking PDCA** → fractal stack, what's next
   - [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/2025-12-12-UTC-2100.iteration-tracking.pdca.md) | [§/.../iteration-tracking.pdca.md](../../UpDown/components/ONCE/0.3.22.1/session/2025-12-12-UTC-2100.iteration-tracking.pdca.md)

2. **Agent context** → per-prompt checklist, architecture
   - [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/2025-12-17-UTC-1200.agent-context.md) | [§/.../agent-context.md](../../UpDown/components/ONCE/0.3.22.1/session/2025-12-17-UTC-1200.agent-context.md)

3. **Learning log** → lessons L1-L16
   - [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/learning.md) | [§/.../learning.md](../../UpDown/components/ONCE/0.3.22.1/session/learning.md)

> `read_file` costs tokens but prevents mistakes that cost MORE tokens to fix.

---

## **🔴 MANDATORY CHECK: Web4 Principles Before Every Commit**

**⚠️ STOP AND READ DEEPLY BEFORE EVERY COMMIT**

Before committing ANY code during fractal PDCA execution, you MUST read and verify compliance with Web4 principles.

**📄 REQUIRED READING** (read deeply, not just skim - contains 21 principles):
- [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.21.8/session/web4-principles-checklist.md) | [§/components/ONCE/0.3.21.8/session/web4-principles-checklist.md](../../UpDown/components/ONCE/0.3.21.8/session/web4-principles-checklist.md)

**📄 EXAMPLE PDCA** (how to identify and fix violations):
- [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/Web4Requirement/0.3.20.6/session/2025-12-02-UTC-2145.fix-web4-principle-violations.pdca.md) | [§/components/Web4Requirement/0.3.20.6/session/2025-12-02-UTC-2145.fix-web4-principle-violations.pdca.md](../../UpDown/components/Web4Requirement/0.3.20.6/session/2025-12-02-UTC-2145.fix-web4-principle-violations.pdca.md)

**If violations found**: Create a fractal PDCA to fix them BEFORE proceeding.

---

## **🔄 OPTIONAL: Lazy Deprecation Migration Before Each Commit**

**If token budget allows**, resolve ONE deprecated pattern before committing:

1. **Check for `@deprecated`** methods/patterns in files you touched
2. **Migrate ONE** to the new Web4 pattern (Principle 16: nameVerb + TypeScript accessors)
3. **Update callers** if simple, or leave for next iteration
4. **Include in same commit** — no separate PDCA needed for single migrations

**Examples of lazy migrations:**
| Encountered | Migrate To |
|-------------|------------|
| `getProjectRoot()` | `get projectRoot()` |
| `setDependencies(v)` | `set dependencies(v)` |
| `buildDependencies()` | `dependenciesBuild()` |
| `createComponent()` | `componentCreate()` |

**Why this matters:**
- Keeps codebase progressively cleaner
- Avoids accumulating technical debt
- Each commit leaves code better than found
- No overhead — just opportunistic improvement

**Skip if:**
- Token budget is low (complex main task)
- Migration requires touching many files
- Would significantly delay the main task

---

## **🗂️ MANDATORY: Update Fractal PDCA Stack Before Every Commit**

**Every tracking PDCA should have a "Fractal PDCA Stack" section at the top** showing the active call stack from deepest to root — like a debugger stack trace. Only show the active path, not completed branches.

### **Why This Is Important**

1. **Quick Context**: See immediately where you are in the fractal hierarchy
2. **Avoid Re-Reading**: Navigate directly to the relevant PDCA via working dual links
3. **Focus**: Only active path shown — completed branches are collapsed
4. **Dual Links**: Each level has clickable links (not inside code blocks!)

### **Stack Format** (hierarchical nested list)

- 📁 **Main PDCA**: [Name] — [GitHub](https://...) | [§/.../main.pdca.md](./path)
  - 📋 **Tracking PDCA** (THIS FILE) — [Section: MASTER PLAN](#anchor)
    - ✅ Completed branches (N iterations)
    - 🔵 **Active Iteration**: [Name] — [Section](#anchor)
      - [GitHub](https://...) | [§/.../iteration.pdca.md](./path)
      - ✅ Completed sub-PDCA — [§/.../sub.pdca.md](./path)
      - **🔵 CURRENT →** [Current Task] (status)
        - [GitHub](https://...) | [§/.../current.pdca.md](./path)
    - 🔄 Future Itterations - especially next one

### **Key Principles**

- **Hierarchical list**: Shows tree structure with siblings visible
- **Nested bullets**: Markdown list, not code block → dual links work!
- **Collapsed completed**: Show ✅ summary, not every detail
- **Working links**: Every node has clickable dual links
- **Siblings visible**: Can see previous/next branches at each level

### **When to Update**

**Update the stack BEFORE every commit** by:
1. Moving to the next task? Update item 1
2. Completed a sub-iteration? Remove it, update parent
3. Started a new fractal? Add new item 1, shift others down
4. Finished an iteration? Collapse into "Completed branches"

### **⚠️ CRITICAL: 100% Completion Rule for PDCAs**

**When marking a PDCA as ✅ COMPLETE, it MUST be 100% complete:**

1. **All tasks checked** — No `- [ ]` unchecked items remain
2. **All CHECK criteria passed** — Every criterion has ✅
3. **Future work extracted** — Any `FUTURE`, `DEFERRED`, or remaining `[ ]` items must be:
   - **Removed** from the completed PDCA (or clearly marked as "tracked elsewhere")
   - **Added** to the tracking PDCA's BACKLOG section
   - **Linked** back to source PDCA for context

**Why This Matters:**
- Future work in completed PDCAs gets **lost forever** when context window resets
- Only the tracking PDCA's BACKLOG survives across sessions
- A PDCA marked complete but containing future work is a **lie** that causes technical debt

**BACKLOG Format in Tracking PDCA:**

```markdown
## **📋 BACKLOG: Future Work** (100% coverage from completed PDCAs)

### 🔵 [Category Name] (from [source.pdca.md](./path))
- [ ] **ID** Description of deferred work
- [ ] **ID** Another item
```

**Rule:** If you can't extract all future work to the tracking PDCA, the child PDCA is NOT complete — mark it 🔵 IN PROGRESS.

### **Example Reference**

See: [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.21.2/session/2025-11-19-UTC-1800.iteration-tracking.pdca.md) | [§/components/ONCE/0.3.21.2/session/2025-11-19-UTC-1800.iteration-tracking.pdca.md](../../UpDown/components/ONCE/0.3.21.2/session/2025-11-19-UTC-1800.iteration-tracking.pdca.md)

---

## **🧪 Tootsie Testing - Web4 Principle 25** ⚠️ MANDATORY

**Web4 uses ONLY Tootsie tests** - Radical OOP test objects, NOT traditional test runners.

### **Running Tootsie Tests**

```bash
# From the component directory
cd /path/to/component/version

# Run test by file number
./once tootsie file 1           # Runs Test01_...
./once tootsie file 2           # Runs Test02_...

# Run test by full name
./once tootsie file Test01_PathAuthorityAndProjectRootDetection

# Test isolation is AUTOMATIC - production files CANNOT be affected
```

### **Key Points**

1. **Command**: `once tootsie file <number>` or `once tootsie file <TestName>`
2. **NOT**: `npm test`, `vitest`, `jest`, `mocha`, or ANY other test runner
3. **Location**: Tests live in `/test/tootsie/` directory
4. **Base Class**: All tests extend `ONCETestCase.ts`
5. **Isolation**: Automatic test/data isolation - production safe

### **Example Output**

```
🔒 Test Isolation Enforced
📄 Test File: Test01_PathAuthority...ts
📦 Tootsie loaded
🧪 Executing test...
   ✅ Test PASSED
```

### **CHECK Phase Testing**

During CHECK phase of any sub-iteration:
```bash
# Run ALL Tootsie tests for the component
./once tootsie file 1
./once tootsie file 2
./once tootsie file 3
# ... etc
```

### **Web4 Lazy Migration Scan (Optional - When Token Budget Allows)**

Before committing, run the Web4 lazy migration scan to identify violations for future cleanup:

```bash
# Run Web4 violation scan (NEVER FAILS - just logs checklist)
cd /path/to/ONCE/0.3.21.8
npx tsx test/tootsie/Test19_Web4LazyMigrationScan.ts
```

This test scans for:
- **P16**: `getXyz()`/`setXyz()` → TypeScript getters/setters
- **P16**: `xyzGet()` without params → `get xyz()`
- **P16**: `createXyz()` → `xyzCreate()`
- **P4**: Arrow functions in forEach/map/filter → method references
- **P3**: Underscore prefix properties → `propertyField` suffix
- **P26**: Factory functions → `new Class().init(scenario)`

**Note**: This test NEVER FAILS. It outputs a lazy migration checklist. Fix violations incrementally.

**Reference**:
- 📄 [Test19_Web4LazyMigrationScan.ts](../../UpDown/components/ONCE/0.3.21.8/test/tootsie/Test19_Web4LazyMigrationScan.ts) | [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.21.8/test/tootsie/Test19_Web4LazyMigrationScan.ts)
- 📄 [Web4 Principles Checklist](../../UpDown/components/ONCE/0.3.21.8/session/web4-principles-checklist.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.21.8/session/web4-principles-checklist.md)

**Reference**:
- 📄 [ONCE README - Tootsie Section](../../UpDown/components/ONCE/0.3.21.8/README.md#-tootsie-testing---quality-consciousness-) | [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.21.8/README.md#-tootsie-testing---quality-consciousness-)

---

## **📋 Overview**

**Fractal PDCA** is the practice of splitting large, complex iterations into smaller, manageable sub-iterations, each with complete PDCA cycles (Plan-Do-Check-Act) and clear CHECK criteria.

**When to Use**:
- ✅ Iteration estimated at **>4 hours**
- ✅ Iteration has **multiple distinct concerns** (interfaces, implementation, testing)
- ✅ Iteration has **high risk** (touches core architecture)
- ✅ Iteration introduces **new paradigms** (requires step-by-step validation)
- ✅ User says **"I think it's big"** (domain expert feedback)

**Key Principle**:
> Each sub-iteration MUST have its own CHECK phase with compilation, tests, and success criteria. Never proceed to the next sub-iteration until the current one passes CHECK.

---

## **🎯 Minimal Fractal PDCA Checklist**

### **Step 1: Identify Fractal Candidates**

Review the tracking PDCA iteration plan:

**Reference Documents**:
- 📄 [CMM3 Compliance Checklist](./cmm3.compliance.checklist.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)
- 📄 [PDCA Template](./PDCA/template.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md)
- 📄 [PDCA HowTo](./PDCA/howto.PDCA.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md)

**Checklist**:
- [ ] Iteration duration estimated at **>4 hours**?
- [ ] Iteration has **>3 distinct technical concerns**?
- [ ] Iteration touches **core architecture** or **introduces new paradigm**?
- [ ] User feedback indicates **complexity underestimated**?
- [ ] **If ANY = YES**: Proceed to Step 2 (Fractalize)

---

### **Step 2: Analyze & Decompose**

Break down the iteration into logical, independent sub-units:

**Analysis Questions**:
1. What are the **distinct technical concerns**? (interfaces, implementation, communication, UI)
2. What are the **dependencies**? (which parts must be done first?)
3. What are the **validation points**? (where do we need to stop and verify?)
4. Can each sub-unit be **tested independently**?

**Decomposition Pattern**:
```
Large Iteration (10-15h)
├── Sub-Iteration A (2-3h) - Foundational (interfaces, types)
├── Sub-Iteration B (3-4h) - Core Implementation (main logic)
├── Sub-Iteration C (2-3h) - Integration (communication, coordination)
└── Sub-Iteration D (2-3h) - UI/UX (user-facing changes)
```

**Checklist**:
- [ ] Identified **3-5 distinct sub-concerns**
- [ ] Each sub-concern can be **completed in 1-3 hours**
- [ ] Dependencies mapped (A → B → C → D)
- [ ] Each sub-iteration has **clear deliverable**
- [ ] Each sub-iteration can be **validated independently**

---

### **Step 3: Define CHECK Criteria for Each Sub-Iteration**

**CRITICAL**: Each sub-iteration MUST have CHECK criteria BEFORE starting DO phase.

**Standard CHECK Template**:
```typescript
#### Sub-Iteration X.Y.Z: [Name]
**Duration**: 1-3h
**Focus**: [One-sentence description]

**Tasks**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**CHECK Phase**:
- [ ] **Compilation**: `tsc --noEmit` passes
- [ ] **New Tests**: [N] unit/integration tests pass
  - [ ] Test case 1: [specific behavior]
  - [ ] Test case 2: [specific behavior]
- [ ] **Existing Tests**: All [N] existing tests still pass
- [ ] **Manual Verification**: [if applicable]
  - [ ] Verify [specific behavior]
- [ ] **Linter**: No new linter errors

**Success Criteria**:
- ✅ [Specific deliverable 1]
- ✅ [Specific deliverable 2]
- ✅ Code compiles
- ✅ Tests pass (existing + new)
```

**Checklist**:
- [ ] Each sub-iteration has **Tasks** section
- [ ] Each sub-iteration has **CHECK Phase** section with:
  - [ ] Compilation check
  - [ ] Test check (new + existing)
  - [ ] Manual verification (if needed)
- [ ] Each sub-iteration has **Success Criteria**
- [ ] Success criteria are **measurable** (not subjective)

**Reference**:
- 📄 [CMM3 Section 1f](./cmm3.compliance.checklist.md#1f-process) - 11-step process includes CHECK phase

---

### **Step 4: Update Tracking PDCA**

Document the fractalization in the tracking PDCA:

**Location**: `session/[date]-UTC-[time].iteration-tracking.pdca.md`

**Required Updates**:

**A. Iteration Section**:
```
### **Iteration X.Y: [Name] ([Original Duration]h → [New Duration]h)**
**Status**: 🔵 PLANNED
**Duration Estimate**: [New Total] hours (split into [N] sub-iterations)
**PDCA File**: `[detailed-pdca-filename]`

**⚠️ SCOPE CLASSIFICATION: [MAJOR/MEDIUM/SMALL] REFACTOR**

**Split into [N] Sub-Iterations**:
- **X.Y.1**: [Sub-iteration name] (Xh)
- **X.Y.2**: [Sub-iteration name] (Xh)
- **X.Y.3**: [Sub-iteration name] (Xh)

---

#### **Iteration X.Y.1: [Name]**
[Full tasks, CHECK, success criteria]

#### **Iteration X.Y.2: [Name]**
[Full tasks, CHECK, success criteria]
```

**B. Progress Tracking Section**:

**🎯 Iteration X.Y Fractalized into [N] Sub-Iterations**:
```
Iteration X.Y: [Name] ([Total Duration])
  ├── X.Y.1: [Name] (Xh)
  ├── X.Y.2: [Name] (Xh)
  └── X.Y.3: [Name] (Xh)
```


**C. Complexity Analysis Section**:

**Iteration X.Y Complexity Analysis**:
- **[N] Sub-Iterations**: Fractalized for manageability
- **CHECK Criteria**: Applied to EVERY sub-iteration
- **Test Strategy**: ~[N] new tests covering [feature]
- **PRIMARY USE CASE**: [If applicable]
- **Manual Verification**: Included for critical sub-iterations
- **Existing Tests**: Must pass at every step ([N]/[N])


**Checklist**:
- [ ] Iteration section shows fractalization (original → split)
- [ ] Each sub-iteration documented with full details
- [ ] Progress tracking diagram updated with tree view
- [ ] Complexity analysis updated with new totals
- [ ] Timeline impact updated if needed
- [ ] Duration adjusted: Original estimate → Realistic estimate

**Reference**:
- 📄 [CMM3 Section 1g](./cmm3.compliance.checklist.md#1g-traceability) - Document references

---

### **Step 5: Create/Update Detailed Iteration PDCA**

The detailed iteration PDCA should include all sub-iterations in the DO phase:

**Location**: `session/[date]-UTC-[time].iteration-[number]-[name].pdca.md`

**Structure**:
```
## **D - DO (Implementation)**

### **Overview of Sub-Iterations**
[Summary table or diagram]

### **Sub-Iteration X.Y.1: [Name]**
#### **Step 1: [First Step]**
[Detailed implementation guidance]

#### **Step 2: [Second Step]**
[Detailed implementation guidance]

### **Sub-Iteration X.Y.2: [Name]**
[Similar structure]
```

**Checklist**:
- [ ] DO phase split into labeled sub-iterations
- [ ] Each sub-iteration has detailed steps
- [ ] Code examples provided where helpful
- [ ] Before/after comparisons included
- [ ] Success criteria repeated from tracking PDCA

**Reference**:
- 📄 [PDCA Template Section D](./PDCA/template.md#d---do) - DO phase structure

---

### **Step 6: Execute with CHECK Gates**

**⚠️ MANDATORY: 6-Step Post-Prompt Protocol**
```
1. UPDATE checkboxes   2. UPDATE stack   3. EXTRACT deferred → 🔶 QUEUED
4. COMMIT (PDCAfilename.pdca.md)   5. VERIFY clean   6. DUAL LINKS
```
Details: [§/.../improvement-pdca-automation.md](../../UpDown/components/ONCE/0.3.22.1/session/2025-12-19-UTC-improvement-pdca-automation.md) | [GitHub](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/2025-12-19-UTC-improvement-pdca-automation.md)

**CRITICAL RULE**: Never proceed to next sub-iteration until current passes CHECK.

**Execution Flow**:
```
Sub-Iteration X.Y.1
├── DO Phase (implement tasks)
├── CHECK Phase (run all checks)
│   ├── Compilation ✅
│   ├── New Tests ✅
│   ├── Existing Tests ✅
│   └── Manual Verification ✅
├── Success Criteria Met? YES → Proceed to X.Y.2
│
Sub-Iteration X.Y.2
├── DO Phase
├── CHECK Phase
│   ├── ... ❌ FAIL
│   └── FIX → Re-CHECK ✅
├── Success Criteria Met? YES → Proceed to X.Y.3
│
Sub-Iteration X.Y.3
[...]
```

**Checklist for Each Sub-Iteration**:
- [ ] **BEFORE starting DO**:
  - [ ] Previous sub-iteration CHECK phase passed
  - [ ] Previous sub-iteration committed (if applicable)
- [ ] **DURING DO**:
  - [ ] Follow detailed PDCA steps
  - [ ] Document any deviations
- [ ] **DURING CHECK**:
  - [ ] Run `tsc --noEmit` (must pass)
  - [ ] Run new tests (must pass)
  - [ ] Run existing tests (must pass)
  - [ ] Perform manual verification (if required)
  - [ ] Check linter (no new errors)
- [ ] **IF CHECK FAILS**:
  - [ ] Fix issues
  - [ ] Re-run CHECK
  - [ ] Do NOT proceed until CHECK passes
- [ ] **AFTER CHECK PASSES**:
  - [ ] Update tracking PDCA (mark sub-iteration complete)
  - [ ] Git commit with proper message format (see below)
  - [ ] **Verify git state is CLEAN** (`git status` shows nothing)
  - [ ] Proceed to next sub-iteration

### **⚠️ MANDATORY: Git Protocol & Clean State**

**After EVERY prompt that makes changes, you MUST:**

1. **Add ALL modified files**: `git add .` or specific files
2. **Commit with CMM3 format** (per [CMM3 1i](./cmm3.compliance.checklist.md)):
   - Format: `git commit -m "PDCAfilename.pdca.md"` (one-liner)
   - Or descriptive: `git commit -m "type(scope): description"`
3. **Verify CLEAN state**: `git status` must show `nothing to commit, working tree clean`
4. **Push if GitHub links needed**: `git push` (dual links require push to be accessible)

**⚠️ CRITICAL: Git state MUST be clean before returning control to TRON.**

```bash
# Verify clean state:
git status
# Expected output:
# On branch dev/...
# nothing to commit, working tree clean
```

**CMM3 1i Quote:**
> "Git commit & push protocol: One-liner commit `git commit -m "PDCAfilename.pdca.md"` then ALWAYS push `git push` - GitHub dual links REQUIRE push to be accessible"

**TRON Trigger**: If you forget, TRON says **"Checklist"** → immediately perform all 6 post-prompt steps.

**Reference**:
- 📄 [CMM3 Section 1i](./cmm3.compliance.checklist.md) - Git commit & push protocol
- 📄 [CMM3 Section 1d](./cmm3.compliance.checklist.md#1d-structure) - Process structure
- 📄 [PDCA HowTo](./PDCA/howto.PDCA.md) - Execution guidance

---

### **Step 7: Update Self-Feedback Log**

After completing the fractalized iteration, document lessons learned:

**Location**: Tracking PDCA, "Self-Feedback & Learning Log" section

**Template**:
```
**Lesson from [Source] ([Date])**:
```quote
[User feedback about complexity/scope]
```

**My Learning & Action**:
- ❌ **Initial Assessment Error**: [What was underestimated]
- ✅ **Reality Check**: [What the actual scope was]
- ✅ **Proper Assessment**: [Detailed breakdown]
- ✅ **Updated Tracking**: [What was updated]
- ✅ **Protocol Refined**: [New protocol learned]

**Key Insights**:
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

**Commitment**: [Future behavior change]
```

**Checklist**:
- [ ] Self-feedback entry created for fractalization
- [ ] Initial scope estimate vs. actual documented
- [ ] Lessons learned captured
- [ ] Protocol refinement documented
- [ ] Commitment to future behavior stated

**Reference**:
- 📄 [CMM3 Section 1j](./cmm3.compliance.checklist.md#1j-feedback) - Continuous improvement

---

## **🎯 Quick Reference Checklist**

Use this for rapid fractalization validation:

### **Before Fractalization**:
- [ ] Iteration estimated at >4 hours
- [ ] User indicates complexity underestimated ("I think it's big")
- [ ] Iteration introduces new paradigm or touches core architecture

### **During Fractalization**:
- [ ] Split into 3-5 sub-iterations (each 1-3 hours)
- [ ] Each sub-iteration has clear deliverable
- [ ] Each sub-iteration has complete CHECK criteria
- [ ] Dependencies mapped (A → B → C)
- [ ] Test strategy defined (~N new tests)

### **Documentation Updates**:
- [ ] Tracking PDCA iteration section updated
- [ ] Tracking PDCA progress diagram updated
- [ ] Tracking PDCA complexity analysis updated
- [ ] Detailed iteration PDCA updated (if exists)
- [ ] Timeline impact assessed

### **During Execution**:
- [ ] CHECK phase enforced for EVERY sub-iteration
- [ ] No proceeding without passing CHECK
- [ ] Existing tests verified at every step
- [ ] Manual verification performed where needed

### **After Completion**:
- [ ] Self-feedback log updated
- [ ] Lessons learned documented
- [ ] Protocol refinements captured

---

## **📚 Reference Documents**

All references use **dual-link format** (workspace-relative + GitHub):

### **Primary References**:
1. **CMM3 Compliance Checklist**
   - Workspace: [§/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md](./cmm3.compliance.checklist.md)
   - GitHub: [cmm3.compliance.checklist.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)
   - Sections: 1d (Structure), 1f (Process), 1g (Traceability), 1j (Feedback)

2. **PDCA Template v3.2.4.2**
   - Workspace: [§/scrum.pmo/roles/_shared/PDCA/template.md](./PDCA/template.md)
   - GitHub: [template.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md)
   - Sections: All (complete PDCA structure)

3. **PDCA HowTo Guide**
   - Workspace: [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](./PDCA/howto.PDCA.md)
   - GitHub: [howto.PDCA.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md)
   - Sections: Creation, Execution, Documentation

### **Related References**:

4. **Per-Prompt Checklist** (CMM3 1f Protocol) — **QUALITY GATE**
   - UpDown Workspace: [§/components/ONCE/0.3.22.1/session/2025-12-17-UTC-1200.agent-context.md](../../UpDown/components/ONCE/0.3.22.1/session/2025-12-17-UTC-1200.agent-context.md)
   - GitHub: [agent-context.md](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/2025-12-17-UTC-1200.agent-context.md)
   - Contains: Phase 1-4 checklist (PLAN→DO→CHECK→ACT) for EVERY prompt

5. **PDCA Automation Improvement** — **LESSONS LEARNED**
   - UpDown Workspace: [§/components/ONCE/0.3.22.1/session/2025-12-19-UTC-improvement-pdca-automation.md](../../UpDown/components/ONCE/0.3.22.1/session/2025-12-19-UTC-improvement-pdca-automation.md)
   - GitHub: [improvement-pdca-automation.md](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/2025-12-19-UTC-improvement-pdca-automation.md)
   - Contains: 6-step post-prompt protocol for PDCA hygiene automation

6. **Git Protocol**
   - Workspace: [§/scrum.pmo/roles/_shared/PDCA/howto.git-protocol.md](./PDCA/howto.git-protocol.md)
   - GitHub: [howto.git-protocol.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.git-protocol.md)

7. **Decide Framework (QA)**
   - Workspace: [§/scrum.pmo/roles/_shared/decide.md](./decide.md)
   - GitHub: [decide.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/scrum.pmo/roles/_shared/decide.md)

8. **Learning Log** — **AGENT LESSONS**
   - UpDown Workspace: [§/components/ONCE/0.3.22.1/session/learning.md](../../UpDown/components/ONCE/0.3.22.1/session/learning.md)
   - GitHub: [learning.md](https://github.com/Cerulean-Circle-GmbH/UpDown/blob/dev/web4v0100/components/ONCE/0.3.22.1/session/learning.md)
   - Contains: L1-L15 lessons including "grep > checkbox" (L15)

---

## **🎓 Example: Real Fractalization**

**Case Study**: ONCE v0.3.21.2 Iteration 1.6

**Initial Estimate**: 2-3 hours (small cleanup)

**User Feedback**: "I think it's big"

**Reality**:
- 6 architectural problems
- 3 NEW Web4 principles
- Complete P2P redesign
- Global singleton implementation
- Protocol-less paradigm shift

**Fractalization**:
```
Iteration 1.6: 2-3h → 13-18h (9 sub-iterations)
├── 1.6.1: Interface Renaming (1-2h)
├── 1.6.2: Split ONCEModel (1-2h)
├── 1.6.3: DefaultONCE Pattern (2-3h)
├── 1.6.4: Protocol-Less P2P (4-5h) ← FURTHER FRACTALIZED
│   ├── 1.6.4a: IOR Configuration (1-1.5h)
│   ├── 1.6.4b: ServerRegistry (1.5-2h)
│   └── 1.6.4c: Client-Primary (1.5-2h)
├── 1.6.5: IOR Method Invocation (2-3h)
└── 1.6.6: Final Validation (1h)
```

**CHECK Criteria**: Applied to ALL 9 sub-iterations

**Outcome**: 
- Each sub-iteration validated independently
- All 25 existing tests maintained
- ~9 new tests added
- Zero regressions

**Reference**: 
- Workspace: [§/../UpDown/components/ONCE/0.3.21.2/session/2025-11-19-UTC-1800.iteration-tracking.pdca.md](../../UpDown/components/ONCE/0.3.21.2/session/2025-11-19-UTC-1800.iteration-tracking.pdca.md)

---

## **⚠️ Common Pitfalls**

### **Anti-Pattern 1: Fractalization Without CHECK Criteria**
❌ **Wrong**:
```
Sub-Iteration 1: Do interface changes (2h)
Sub-Iteration 2: Update implementation (3h)
```

✅ **Right**:
```
Sub-Iteration 1: Interface Renaming (2h)
**CHECK**:
- [ ] Compilation passes
- [ ] All 25 existing tests pass
- [ ] 0 new linter errors
```

### **Anti-Pattern 2: Proceeding Despite Failed CHECK**
❌ **Wrong**: "CHECK failed, but I'll fix it later in next sub-iteration"

✅ **Right**: "CHECK failed, stop, fix immediately, re-CHECK, only then proceed"

### **Anti-Pattern 3: Sub-Iterations Too Large**
❌ **Wrong**: Sub-iteration estimated at 5-6 hours

✅ **Right**: Sub-iteration estimated at 1-3 hours (if >3h, fractalize further)

### **Anti-Pattern 4: Missing Test Strategy**
❌ **Wrong**: "We'll test everything at the end"

✅ **Right**: "Sub-iteration 1: +3 unit tests, Sub-iteration 2: +2 integration tests"

---

## **✅ Fractal PDCA Success Formula**

```
Large Iteration (>4h)
↓ [Fractalize]
Multiple Sub-Iterations (1-3h each)
↓ [Each Sub-Iteration]
PLAN → DO → CHECK (compile + test + verify) → ACT
↓ [CHECK Passed?]
YES → Proceed to Next Sub-Iteration
NO → FIX → Re-CHECK → Only then proceed
↓ [All Sub-Iterations Complete]
Final Validation → Git Commit → Update Tracking → Done ✅
```

---

**Version History**:
- v1.2.0 (2025-12-03): Moved self-inform to top, DRY principle violations check via reference
- v1.1.0 (2025-12-03): Added self-informing section with pdca trainAI usage
- v1.0.0 (2025-11-21): Initial version based on ONCE v0.3.21.2 Iteration 1.6 fractalization

**Maintained By**: AI Assistant (Claude Opus 4.5)  
**Location**: `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/_shared/howto.fractal.pdca.md`
