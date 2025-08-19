[Back to Process Index](../index.md)

# Systematic Investigation Protocol

**Process ID:** SIP-001  
**Created:** 2025-08-19 UTC 10:30  
**Source Session:** [Fresh Dawn Multi-Role Analysis](../project.journal/2025-08-19-0800-fresh-dawn/project-status-final.md)  
**Developed From:** Evidence-based systematic investigation applied to TRON QA findings

## Purpose

This protocol defines the systematic approach to investigating complex problems through evidence-based analysis, multi-role coordination, and comprehensive validation. Based on breakthrough learning that systematic investigation prevents "EPIPE error spam" and produces implementable solutions.

## Core Principles

### 1. Evidence-Based Protocol
- **Work from clear evidence, not assumptions**
- **Create sequences from findings to understand behavior**
- **Systematic approach prevents chaotic debugging**
- **Evidence-based protocol enables reproducible results**

### 2. Multi-Perspective Analysis
- **Single-perspective analysis misses critical insights**
- **Different roles provide complementary analysis**
- **Systematic coordination prevents perspective bias**
- **Comprehensive coverage through role specialization**

### 3. Systematic vs. Chaotic Approach
- **Systematic:** Matrix-based analysis with reproducible methodology
- **Chaotic:** Random attempts without systematic validation
- **Result:** Systematic approach identifies root causes efficiently**

## Investigation Framework

### Phase 1: Problem Definition and Evidence Collection

#### Initial Assessment
1. **Gather Initial Evidence:** Collect all available symptoms and error reports
2. **Define Investigation Scope:** Determine boundaries and focus areas
3. **Identify Stakeholders:** Determine who has relevant knowledge
4. **Document Baseline State:** Capture current system behavior

#### Evidence Classification
- **🔴 Critical Evidence:** Directly related to problem manifestation
- **🟡 Contextual Evidence:** Provides environmental or historical context
- **🟢 Supporting Evidence:** Confirms or validates other findings
- **⚪ Noise:** Information that doesn't contribute to investigation

### Phase 2: Systematic Analysis Through Multi-Role Coordination

#### Role Assignment Strategy
Based on problem type and required expertise:

**Technical Problems (e.g., TSRanger bugs):**
- **Developer Role:** Code analysis, architectural assessment, implementation review
- **Tester Role:** Systematic reproduction, edge case analysis, regression testing
- **Architect Role:** System design analysis, architectural root cause investigation

**Process Problems (e.g., workflow inefficiencies):**
- **ScrumMaster Role:** Process analysis, coordination issues, systematic bottlenecks
- **PO Role:** Requirements analysis, stakeholder impact, business logic review
- **DevOps Role:** Infrastructure analysis, deployment issues, environment factors

**Quality Problems (e.g., systematic failures):**
- **Tester Role:** Quality analysis, systematic validation, test coverage gaps
- **Architect Role:** Design quality, architectural debt, system robustness
- **Developer Role:** Implementation quality, code analysis, technical debt

#### Multi-Role Analysis Protocol
1. **Parallel Investigation:** Each role analyzes from their expertise perspective
2. **Independent Analysis:** Roles work without bias from other role findings
3. **Evidence Documentation:** Each role documents findings with specific evidence
4. **Cross-Validation:** Roles review each other's findings for gaps or conflicts
5. **Synthesis Integration:** ScrumMaster synthesizes all findings into comprehensive understanding

### Phase 3: Systematic Validation and Solution Development

#### Root Cause Analysis
- **Multiple Hypotheses:** Develop several potential root causes from multi-role analysis
- **Evidence Mapping:** Map available evidence to each hypothesis
- **Systematic Testing:** Design experiments to validate or eliminate hypotheses
- **Convergence Analysis:** Identify most likely root cause based on evidence weight

#### Solution Framework Development
- **Immediate Solutions:** Address critical symptoms requiring immediate attention
- **Systematic Solutions:** Address root causes to prevent recurrence
- **Architectural Solutions:** Address system design issues for long-term prevention
- **Process Solutions:** Address workflow or methodology issues

## Investigation Methodologies

### Matrix-Based Analysis

#### Test Matrix Development
Based on "3 Degrees of Freedom" framework:
1. **COLUMNS (WHO/WHERE):** What components are affected
2. **PROMPT (WHAT):** What behaviors are exhibited
3. **FILTER (HOW):** What conditions trigger the behavior

**Example - TSRanger Investigation:**
```
| Sequence | Columns Impact | Prompt Impact | Filter Impact | Expected | Actual | Status |
|----------|----------------|---------------|---------------|----------|--------|--------|
| [t][backspace][g] | Classes column | Shows "tg" | Filter corrupted | "g" | "tg" | ❌ BUG |
| [down]5x | Classes column | Shows class | No filter | Class display | Empty | ❌ BUG |
```

#### Systematic Reproduction
1. **Isolate Variables:** Test each component independently
2. **Combine Variables:** Test interactions between components
3. **Edge Cases:** Test boundary conditions and unusual sequences
4. **Environment Validation:** Verify behavior across different environments

### Evidence-Driven Documentation

#### Investigation Log Structure
```
## Investigation: [PROBLEM_TITLE]
**Date:** [UTC_TIMESTAMP]
**Investigator:** [ROLE]
**Scope:** [INVESTIGATION_BOUNDARIES]

### Evidence Collected
- **Primary:** [DIRECT_EVIDENCE]
- **Secondary:** [CONTEXTUAL_EVIDENCE]
- **Reproduction:** [STEPS_TO_REPRODUCE]

### Analysis
- **Hypothesis:** [POTENTIAL_ROOT_CAUSE]
- **Supporting Evidence:** [EVIDENCE_FOR_HYPOTHESIS]
- **Contradicting Evidence:** [EVIDENCE_AGAINST_HYPOTHESIS]
- **Confidence Level:** [HIGH/MEDIUM/LOW]

### Validation
- **Test Performed:** [SPECIFIC_TEST]
- **Expected Result:** [PREDICTION]
- **Actual Result:** [OBSERVATION]
- **Conclusion:** [VALIDATION_OUTCOME]
```

### Multi-Role Synthesis

#### Integration Protocol
1. **Individual Analysis Review:** Each role presents findings independently
2. **Evidence Correlation:** Identify overlapping and conflicting evidence
3. **Gap Analysis:** Identify areas not covered by any role
4. **Consensus Building:** Develop agreed understanding of root causes
5. **Solution Prioritization:** Rank solutions by impact and feasibility

#### Synthesis Documentation
- **Executive Summary:** High-level findings and recommendations
- **Detailed Analysis:** Comprehensive investigation results
- **Evidence Appendix:** All supporting evidence and data
- **Implementation Roadmap:** Systematic solution implementation plan

## Advanced Investigation Techniques

### TRON QA Finding Analysis

#### User Feedback Integration
When TRON provides QA feedback:
1. **Quote Verbatim:** Preserve exact user language and examples
2. **Systematic Reproduction:** Recreate exact user scenarios
3. **Behavior Analysis:** Understand user expectation vs. system behavior
4. **Impact Assessment:** Determine severity and scope of issue

**Example - Filter Corruption Discovery:**
> **TRON Quote:** "when typing then a next letter all backspaced letters are back in the prompt and in the filter wrongly. e.g. typing [t][backspace][g] results wrongly in a 'tg' filter and prompt while 'g' would be naturally right."

**Investigation Response:**
- **Exact Reproduction:** Test sequence `[t][backspace][g]`
- **System Analysis:** Examine filter state management
- **Architectural Review:** Identify filter update logic issues
- **Solution Development:** FilterStateEngine with immutable operations

### Systematic Test Case Development

#### From Investigation to Test Cases
1. **Evidence-Based Scenarios:** Convert investigation findings into test cases
2. **Regression Prevention:** Ensure identified bugs cannot reoccur
3. **Edge Case Coverage:** Test boundary conditions discovered during investigation
4. **Integration Testing:** Validate system behavior after fixes applied

#### Test Matrix Integration
- **Matrix v4 Enhancement:** Add discovered scenarios to comprehensive test matrix
- **Gap Analysis:** Identify areas where investigation revealed missing coverage
- **Systematic Validation:** Ensure all investigation findings have corresponding tests

## Quality Standards

### Investigation Completeness
- ✅ **All Evidence Collected:** No significant information overlooked
- ✅ **Multi-Role Analysis:** Multiple perspectives applied systematically
- ✅ **Systematic Validation:** All hypotheses tested with specific evidence
- ✅ **Root Cause Identification:** Clear understanding of underlying issues
- ✅ **Solution Development:** Implementable recommendations with clear acceptance criteria

### Documentation Quality
- ✅ **Evidence Traceability:** All findings linked to specific evidence
- ✅ **Reproducible Methodology:** Investigation can be repeated by others
- ✅ **Clear Conclusions:** Unambiguous findings and recommendations
- ✅ **Implementation Readiness:** Solutions ready for immediate execution

## Anti-Patterns to Avoid

### ❌ Assumption-Based Investigation
- **Problem:** Starting with preconceived notions about root cause
- **Solution:** Begin with evidence collection and systematic analysis

### ❌ Single-Perspective Analysis
- **Problem:** Missing critical insights from other expertise areas
- **Solution:** Apply multi-role coordination for comprehensive coverage

### ❌ Chaotic Debugging
- **Problem:** Random attempts without systematic methodology
- **Solution:** Matrix-based systematic approach with evidence validation

### ❌ Incomplete Documentation
- **Problem:** Investigation findings lost or cannot be reproduced
- **Solution:** Comprehensive documentation with evidence traceability

## Integration with Other Processes

### Multi-Agent Coordination
- **Investigation requires multiple roles** for comprehensive analysis
- **Systematic coordination** prevents overlap and ensures coverage
- **Integrated synthesis** produces implementable solutions

### Task Creation Excellence
- **Investigation findings** become basis for implementation-ready tasks
- **Specific evidence** enables precise acceptance criteria
- **Multi-role analysis** informs appropriate task structure

### PDCA Traceability
- **Investigation process** documented in PDCA cycles
- **Evidence collection** linked to investigation PDCAs
- **Solution implementation** creates follow-up PDCA cycles

---

**This protocol transforms problem investigation from chaotic debugging to systematic analysis. Evidence-based methodology with multi-role coordination produces comprehensive understanding and implementable solutions.**

**Systematic vs. chaotic: the difference between finding root causes and generating error spam.** 🔍📊✨

[Back to Process Index](../index.md)
