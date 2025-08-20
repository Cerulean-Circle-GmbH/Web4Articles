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

## 🚨 **CRITICAL: Systematic vs Version-Specific Analysis Protocol**

**MANDATORY: Cross-Version Test Pattern Analysis**

When test failures appear across multiple versions of the same component:

### **✅ DO THIS FIRST - Systematic Analysis:**
1. **Test ALL Versions:** Run identical tests across ALL available versions (v2.0, v2.1, v2.2, etc.)
2. **Compare Results:** Look for IDENTICAL failure patterns:
   - Same number of failed/passed tests
   - Same error message patterns  
   - Same empty outputs or missing data
   - Same test duration ranges
3. **Pattern Recognition:** If 2+ versions show identical patterns → **INFRASTRUCTURE PROBLEM**
4. **Root Cause Focus:** Test infrastructure (test helpers, `runScripted()`, binary execution) NOT application functionality

### **❌ NEVER Do This (Learned 2025-08-20):**
- Assume failures are version-specific without cross-version validation
- Blame application functionality before checking test infrastructure
- Focus on single version when systematic issues exist
- Create version-specific analysis when pattern suggests infrastructure failure

### **🎯 Evidence Requirements:**
- Document cross-version test results with identical patterns
- Identify shared test infrastructure components (helper functions, execution methods)
- Show systematic failure signatures (same counts, same error types, same empty outputs)
- Conclude infrastructure vs functionality based on pattern analysis

### **📋 Reporting Protocol:**
- **Systemic Issues:** "ALL versions show identical test infrastructure failure"  
- **Version-Specific Issues:** "Only version X.Y shows this specific functional problem"
- **Mixed Issues:** "Versions A,B have infrastructure issues; Version C has functional issues"

**This protocol prevents misdiagnosis that wastes development effort on wrong root causes.**

## Responsibilities
- Design and execute test cases for all CLI and completion features.
- Maintain and extend automated test coverage.
- **All automated test cases must be placed in the top-level `test/` directory of the repository.**
- For the tssh CLI, see the canonical integration test: `test/tssh-cli.integration.test.ts`.
- Perform manual QA and document findings in process markdown files.
- Sign off on releases only when all acceptance criteria are met.

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
