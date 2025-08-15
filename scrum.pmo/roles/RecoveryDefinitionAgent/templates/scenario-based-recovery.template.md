[Back to Recovery Definition Agent](../)

# Scenario-Based Recovery Template

## Template Overview

This template provides a framework for handling specific recovery scenarios that may occur across different roles or in unique circumstances. Use this template when creating recovery procedures for edge cases, incidents, or complex multi-factor situations.

## Template Structure

### 1. Scenario Definition

```markdown
## Scenario: {{SCENARIO_NAME}}

### Scenario Description
- **Context**: {{SCENARIO_CONTEXT}}
- **Triggers**: {{SCENARIO_TRIGGERS}}
- **Scope of Impact**: {{IMPACT_SCOPE}}
- **Urgency Level**: {{URGENCY_LEVEL}} (Critical/High/Medium/Low)

### Affected Components
- **Roles**: {{AFFECTED_ROLES}}
- **Systems**: {{AFFECTED_SYSTEMS}}
- **Data**: {{AFFECTED_DATA}}
- **Workflows**: {{AFFECTED_WORKFLOWS}}

### Risk Assessment
- **Primary Risks**: {{PRIMARY_RISKS}}
- **Secondary Risks**: {{SECONDARY_RISKS}}
- **Business Impact**: {{BUSINESS_IMPACT}}
- **Technical Impact**: {{TECHNICAL_IMPACT}}
```

### 2. Detection and Assessment

```markdown
## Detection and Initial Assessment

### Scenario Recognition
- **Symptoms Checklist**:
  - [ ] {{SYMPTOM_1}}
  - [ ] {{SYMPTOM_2}}
  - [ ] {{SYMPTOM_3}}
  - [ ] {{SYMPTOM_4}}

### Impact Assessment Framework
1. **Immediate Impact Analysis**
   - Affected team members: {{TEAM_IMPACT}}
   - System availability: {{SYSTEM_IMPACT}}
   - Data integrity: {{DATA_IMPACT}}
   - Timeline impact: {{TIMELINE_IMPACT}}

2. **Severity Classification**
   - [ ] **Critical**: {{CRITICAL_CRITERIA}}
   - [ ] **High**: {{HIGH_CRITERIA}}
   - [ ] **Medium**: {{MEDIUM_CRITERIA}}
   - [ ] **Low**: {{LOW_CRITERIA}}
```

### 3. Recovery Strategy

```markdown
## Recovery Strategy Framework

### Strategic Approach
- **Primary Strategy**: {{PRIMARY_STRATEGY}}
- **Fallback Strategy**: {{FALLBACK_STRATEGY}}
- **Recovery Objectives**: {{RECOVERY_OBJECTIVES}}
- **Success Metrics**: {{SUCCESS_METRICS}}

### Resource Requirements
- **Personnel**: {{PERSONNEL_REQUIREMENTS}}
- **Tools**: {{TOOL_REQUIREMENTS}}
- **Time Estimate**: {{TIME_ESTIMATE}}
- **External Dependencies**: {{EXTERNAL_DEPENDENCIES}}

### Communication Plan
- **Stakeholder Notification**: {{STAKEHOLDER_NOTIFICATION}}
- **Team Coordination**: {{TEAM_COORDINATION}}
- **Status Reporting**: {{STATUS_REPORTING}}
- **Documentation Requirements**: {{DOCUMENTATION_REQUIREMENTS}}
```

### 4. Recovery Execution Plan

```markdown
## Recovery Execution Procedures

### Phase 1: Stabilization
1. **{{STABILIZATION_STEP_1}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Expected Outcome**: {{EXPECTED_OUTCOME}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Rollback Plan**: {{ROLLBACK_PLAN}}

2. **{{STABILIZATION_STEP_2}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Expected Outcome**: {{EXPECTED_OUTCOME}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Rollback Plan**: {{ROLLBACK_PLAN}}

### Phase 2: Recovery Implementation
1. **{{RECOVERY_STEP_1}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Expected Outcome**: {{EXPECTED_OUTCOME}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Dependencies**: {{DEPENDENCIES}}

2. **{{RECOVERY_STEP_2}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Expected Outcome**: {{EXPECTED_OUTCOME}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Dependencies**: {{DEPENDENCIES}}

### Phase 3: Verification and Validation
1. **{{VERIFICATION_STEP_1}}**
   - **Verification Method**: {{VERIFICATION_METHOD}}
   - **Success Criteria**: {{SUCCESS_CRITERIA}}
   - **Failure Response**: {{FAILURE_RESPONSE}}

2. **{{VERIFICATION_STEP_2}}**
   - **Verification Method**: {{VERIFICATION_METHOD}}
   - **Success Criteria**: {{SUCCESS_CRITERIA}}
   - **Failure Response**: {{FAILURE_RESPONSE}}

### Phase 4: Restoration and Cleanup
1. **{{RESTORATION_STEP_1}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Cleanup Tasks**: {{CLEANUP_TASKS}}

2. **{{RESTORATION_STEP_2}}**
   - **Action**: {{ACTION_DESCRIPTION}}
   - **Validation**: {{VALIDATION_METHOD}}
   - **Cleanup Tasks**: {{CLEANUP_TASKS}}
```

### 5. Contingency Planning

```markdown
## Contingency Plans

### Scenario: {{CONTINGENCY_SCENARIO_1}}
- **Trigger Conditions**: {{TRIGGER_CONDITIONS}}
- **Alternative Actions**: {{ALTERNATIVE_ACTIONS}}
- **Resource Adjustments**: {{RESOURCE_ADJUSTMENTS}}
- **Timeline Modifications**: {{TIMELINE_MODIFICATIONS}}

### Scenario: {{CONTINGENCY_SCENARIO_2}}
- **Trigger Conditions**: {{TRIGGER_CONDITIONS}}
- **Alternative Actions**: {{ALTERNATIVE_ACTIONS}}
- **Resource Adjustments**: {{RESOURCE_ADJUSTMENTS}}
- **Timeline Modifications**: {{TIMELINE_MODIFICATIONS}}

### Escalation Procedures
- **Level 1 Escalation**: {{LEVEL_1_ESCALATION}}
- **Level 2 Escalation**: {{LEVEL_2_ESCALATION}}
- **Level 3 Escalation**: {{LEVEL_3_ESCALATION}}
- **Emergency Escalation**: {{EMERGENCY_ESCALATION}}
```

### 6. Post-Recovery Analysis

```markdown
## Post-Recovery Analysis Framework

### Success Evaluation
- [ ] **Primary Objectives Met**: {{PRIMARY_OBJECTIVES_ASSESSMENT}}
- [ ] **Timeline Adherence**: {{TIMELINE_ASSESSMENT}}
- [ ] **Resource Utilization**: {{RESOURCE_ASSESSMENT}}
- [ ] **Quality Standards**: {{QUALITY_ASSESSMENT}}

### Lessons Learned Documentation
1. **What Worked Well**
   - {{SUCCESS_FACTOR_1}}
   - {{SUCCESS_FACTOR_2}}
   - {{SUCCESS_FACTOR_3}}

2. **Areas for Improvement**
   - {{IMPROVEMENT_AREA_1}}
   - {{IMPROVEMENT_AREA_2}}
   - {{IMPROVEMENT_AREA_3}}

3. **Process Refinements**
   - {{PROCESS_REFINEMENT_1}}
   - {{PROCESS_REFINEMENT_2}}
   - {{PROCESS_REFINEMENT_3}}

### Prevention Measures
- **Root Cause Analysis**: {{ROOT_CAUSE_ANALYSIS}}
- **Prevention Strategies**: {{PREVENTION_STRATEGIES}}
- **Monitoring Improvements**: {{MONITORING_IMPROVEMENTS}}
- **Training Needs**: {{TRAINING_NEEDS}}
```

### 7. Automation and Tooling

```markdown
## Automation Integration

### Detection Automation
```bash
# {{DETECTION_AUTOMATION_DESCRIPTION}}
{{DETECTION_SCRIPT}}
```

### Recovery Automation
```bash
# {{RECOVERY_AUTOMATION_DESCRIPTION}}
{{RECOVERY_SCRIPT}}
```

### Validation Automation
```bash
# {{VALIDATION_AUTOMATION_DESCRIPTION}}
{{VALIDATION_SCRIPT}}
```

### Monitoring and Alerting
```bash
# {{MONITORING_AUTOMATION_DESCRIPTION}}
{{MONITORING_SCRIPT}}
```

## Template Usage Guidelines

### 1. Scenario Identification
- Clearly define the specific scenario this template addresses
- Ensure the scenario is distinct from other recovery templates
- Include realistic trigger conditions and symptoms
- Define clear boundaries for when this template applies

### 2. Customization Requirements
- Replace all `{{PLACEHOLDER}}` values with scenario-specific content
- Ensure all steps are actionable and testable
- Include realistic time estimates and resource requirements
- Validate automation scripts in safe environments

### 3. Testing and Validation
- Create controlled scenarios to test the recovery procedures
- Validate all automation scripts and tools
- Ensure team members understand their roles in the scenario
- Document test results and refine procedures accordingly

### 4. Integration with Other Templates
- Reference related role-specific recovery templates
- Ensure consistency with overall recovery framework
- Link to relevant automation and safety templates
- Maintain cross-references for complex multi-template scenarios

---

**This template ensures comprehensive scenario-based recovery procedures that can handle complex, multi-factor situations effectively.**

[Back to Recovery Definition Agent](../)
