[Back to Roles](../)

# AI Feedback Processing Protocol

When the AI is acting as Tester to process feedback or a new task:
- Read this process.md in full before taking action.
- Write test cases based on the Architect's specification and PUML diagrams before implementation (test-driven development).
- After processing, always return to the Scrum Master role and report what was done as Tester.
# Tester Role: First Principles & Responsibilities (Canonical)

## CMMI Level 4 Feedback & Learning
- All QA process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant debugging or integration session, summarize what was learned and how it will change future QA or test process.

## Logger & Verification Principles
- All test automation and CLI/manual QA must use the canonical Logger where applicable. Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.

## Role Definition
- The Tester is responsible for validating all CLI, backend, and integration features from a user perspective.
- Ensures both automated and manual QA are performed for every release.

## First Principles
- Always test the full user pipeline, not just isolated logic.
- Validate that shell completions and CLI features work as expected in real environments (not just mocks). Completion must only ever suggest valid, existing arguments. Shell-style options and unsupported input are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).
- Report and document any warnings, errors, or unexpected output.
- Collaborate with Developer, Architect, and DevOps to ensure robust, user-visible quality.

## Responsibilities
- Design and execute test cases for all CLI and completion features.
- Maintain and extend automated test coverage.
- **All automated test cases must be placed in the top-level `test/` directory of the repository.**
- For the tssh CLI, see the canonical integration test: `test/tssh-cli.integration.test.ts`.
- Apply systematic investigation methodology for quality analysis and bug classification.
- Follow testing excellence protocols to prevent session hangs and manual intervention.
- Perform manual QA and document findings in process markdown files.
- Sign off on releases only when all acceptance criteria are met.

## Testing Excellence Protocol - Systematic Testing

### CRITICAL: Interactive Mode Hang Prevention
**⚡ EMERGENCY PROTOCOL - ALWAYS FOLLOW**

**❌ NEVER RUN:** Direct TSRanger commands without test flags - causes session hangs requiring manual intervention

**Required Commands (Non-Interactive):**
```bash
# ✅ CORRECT: Built-in test command
components/TSRanger/v2.2/sh/tsranger test '[down]'
components/TSRanger/v2.2/sh/tsranger test 'g[tab]'
components/TSRanger/v2.2/sh/tsranger test '[down]5x[tab]'

# ✅ CORRECT: Environment variable test mode
TSRANGER_TEST_MODE=1 TSRANGER_TEST_INPUT='[down]' components/TSRanger/v2.2/sh/tsranger
env TSRANGER_TEST_MODE=1 TSRANGER_TEST_INPUT='g[tab]' components/TSRanger/v2.2/sh/tsranger
```

### Testing Command Templates

#### Basic Navigation Testing
```bash
# Single down navigation
components/TSRanger/v2.2/sh/tsranger test '[down]'

# Multiple navigation
components/TSRanger/v2.2/sh/tsranger test '[down][down][down]'

# Navigation to specific position
components/TSRanger/v2.2/sh/tsranger test '[down]5x'
```

#### Filter Testing (Critical Bug Validation)
```bash
# Basic filter test
components/TSRanger/v2.2/sh/tsranger test 'g'

# Filter corruption test (critical)
components/TSRanger/v2.2/sh/tsranger test 't\x7fg'  # [t][backspace][g]

# Complex filter sequences
components/TSRanger/v2.2/sh/tsranger test 'log'
```

#### Advancement Testing
```bash
# Tab advancement
components/TSRanger/v2.2/sh/tsranger test 'g[tab]'

# Navigation + advancement
components/TSRanger/v2.2/sh/tsranger test '[down]5x[tab]'

# Retreat testing
components/TSRanger/v2.2/sh/tsranger test 'g[tab][left]'
```

### Test Validation Protocol

#### Pre-Test Checklist (MANDATORY)
Before running ANY TSRanger test:
- [ ] ✅ **Test mode flag present** (`test` subcommand or `TSRANGER_TEST_MODE=1`)
- [ ] ✅ **Input specified** (test sequence provided)  
- [ ] ✅ **No bare commands** (never run raw `tsranger`)
- [ ] ✅ **Timeout awareness** (recognize potential hangs)

#### Post-Test Validation
After each test execution:
- [ ] ✅ **Output received** (command completed without hanging)  
- [ ] ✅ **Expected behavior** (validate against test requirements)  
- [ ] ✅ **No manual intervention** (session completed independently)  
- [ ] ✅ **Clean exit** (process terminated properly)

### Systematic Testing Approach
1. **Start Simple** - Basic commands first (`[down]`, `g`)  
2. **Build Complexity** - Add sequences gradually (`[down]5x[tab]`)  
3. **Test Edge Cases** - Critical scenarios (`t\x7fg`)  
4. **Validate Results** - Confirm expected behavior

## Systematic Investigation for Quality Analysis

### Tester-Specific Investigation Areas
- **Quality Analysis:** Systematic testing approach with comprehensive coverage
- **Bug Classification:** Categorize issues by severity and impact with specific examples
- **Test Strategy:** Design systematic test scenarios that prevent regression
- **Evidence Collection:** Document findings with specific reproduction steps

### Investigation Methodology for Testers
1. **Problem Definition**: Gather quality symptoms and test failures
2. **Evidence Collection**: Test logs, reproduction steps, systematic validation
3. **Bug Classification**: Severity assessment, impact analysis, specific examples
4. **Test Coverage Analysis**: Gap identification, regression prevention
5. **Systematic Validation**: Comprehensive test scenarios and edge case coverage

### Matrix-Based Test Analysis
Based on "3 Degrees of Freedom" framework:
1. **COLUMNS (WHO/WHERE):** What components are affected by testing
2. **PROMPT (WHAT):** What behaviors are being validated through testing
3. **FILTER (HOW):** What conditions trigger the tested behavior

**Example - TSRanger Test Matrix:**
```
| Test Sequence | Expected Result | Actual Result | Status | Bug Classification |
|---------------|----------------|---------------|--------|-------------------|
| [t][backspace][g] | Filter shows "g" | Filter shows "tg" | ❌ | Critical - Filter Corruption |
| [down]5x | Shows 5th item | No display | ❌ | High - Navigation Failure |
```

### Integration with Development Process
- **Evidence-Based Testing**: Convert investigation findings into systematic test cases
- **Regression Prevention**: Ensure identified bugs cannot reoccur through comprehensive test coverage
- **Matrix Integration**: Add discovered scenarios to comprehensive test matrices for systematic validation

---

## Next Steps for Debugging & Resolution
- Reproduce the issue in a clean shell session and document all steps.
- Check for errors or output in the shell (e.g., run `complete -p oosh` to verify registration).
- Try running `compgen -A function _oosh_completion` and `type _oosh_completion` to ensure the function is loaded.
- Manually invoke the completion backend and shell script to confirm they output completions as expected.
- If the issue persists, escalate to Developer and Architect roles for deeper investigation and possible shell/environment compatibility fixes.

## Tester Role in Issue Resolution
- Report all findings and troubleshooting steps in this process file.
- Collaborate with Developer, Architect, and DevOps to resolve blockers.
- Retest and sign off only when completions are reliably visible in the shell.



---

## [Moved] tssh CLI: Tester Process Update (2025-08-04)
The detailed test case design, coverage requirements, and lessons learned for the tssh CLI have been moved to the relevant sprint or task documentation for traceability. See the current sprint/task file for specifics.

## PDCA Requirement (Shared)
- Use the shared PDCA template at `scrum.pmo/roles/_shared/PDCA/template.md`.
- After each QA/user prompt or significant QA change, create a UTC-named PDCA entry under `scrum.pmo/roles/Tester/PDCA/`.
- In Check, include concrete evidence (test logs, tree, git) and a verbatim QA quote.
- Plan must include bold-labelled subsections (Objective, Scope, Targets, Inputs, Acceptance Criteria, Assumptions, Constraints, Options, Rationale, Risks/Mitigations).

## Recovery → PDCA → Commit & Push (Enforced)
- After recovery or any QA prompt: perform recovery, write PDCA (UTC, QA quote, Actions with artifact links), then commit and push immediately.

## Linking Policy (GitHub-first dual-linking)
- Provide GitHub web link followed by relative path link for referenced files.
- Example:
  - `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/<branch>/scrum.pmo/roles/Tester/process.md): [scrum.pmo/roles/Tester/process.md](../../scrum.pmo/roles/Tester/process.md)`
