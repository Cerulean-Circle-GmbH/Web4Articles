[Back to Recovery Definition Agent](../)

# Role-Specific Recovery Template

## Template Overview

This template provides a comprehensive framework for creating recovery procedures tailored to specific project roles. Use this template when defining how a particular role should recover context, responsibilities, and operational state.

## Template Structure

### 1. Role Context Definition

```markdown
## Role: {{ROLE_NAME}}

### Role Definition
- **Primary Responsibilities**: {{PRIMARY_RESPONSIBILITIES}}
- **Key Deliverables**: {{KEY_DELIVERABLES}}
- **Stakeholder Interactions**: {{STAKEHOLDER_INTERACTIONS}}
- **Domain Expertise**: {{DOMAIN_EXPERTISE}}

### Recovery Scope
- **Context Recovery**: {{CONTEXT_RECOVERY_REQUIREMENTS}}
- **State Restoration**: {{STATE_RESTORATION_REQUIREMENTS}}
- **Tool Access**: {{TOOL_ACCESS_REQUIREMENTS}}
- **Data Dependencies**: {{DATA_DEPENDENCIES}}
```

### 2. Pre-Recovery Safety Checks

```markdown
## Pre-Recovery Safety Protocol

### Environmental Verification
- [ ] {{ENVIRONMENT_CHECK_1}}
- [ ] {{ENVIRONMENT_CHECK_2}}
- [ ] {{ENVIRONMENT_CHECK_3}}

### Multi-Agent Coordination
- [ ] Confirm no other agents are active in {{ROLE_SCOPE}}
- [ ] Verify branch safety protocols
- [ ] Check for conflicting operations

### Backup and Safety
- [ ] {{BACKUP_REQUIREMENT_1}}
- [ ] {{BACKUP_REQUIREMENT_2}}
- [ ] Document pre-recovery state
```

### 3. Recovery Process Steps

```markdown
## Recovery Execution Process

### Phase 1: Context Loading
1. **{{CONTEXT_STEP_1}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}

2. **{{CONTEXT_STEP_2}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}

### Phase 2: State Restoration
1. **{{STATE_STEP_1}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}

2. **{{STATE_STEP_2}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}

### Phase 3: Operational Readiness
1. **{{READINESS_STEP_1}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}

2. **{{READINESS_STEP_2}}**
   - Action: {{ACTION_DESCRIPTION}}
   - Validation: {{VALIDATION_CRITERIA}}
   - Troubleshooting: {{TROUBLESHOOTING_STEPS}}
```

### 4. Validation and Verification

```markdown
## Recovery Validation

### Success Criteria Checklist
- [ ] {{SUCCESS_CRITERION_1}}
- [ ] {{SUCCESS_CRITERION_2}}
- [ ] {{SUCCESS_CRITERION_3}}
- [ ] {{SUCCESS_CRITERION_4}}

### Functional Verification
- [ ] {{FUNCTIONAL_TEST_1}}
- [ ] {{FUNCTIONAL_TEST_2}}
- [ ] {{FUNCTIONAL_TEST_3}}

### Integration Testing
- [ ] {{INTEGRATION_TEST_1}}
- [ ] {{INTEGRATION_TEST_2}}
- [ ] Role-specific workflows operational
```

### 5. Post-Recovery Actions

```markdown
## Post-Recovery Protocol

### Documentation Requirements
- [ ] Update recovery status in {{STATUS_LOCATION}}
- [ ] Log recovery completion with timestamp
- [ ] Document any issues or improvements needed

### Role-Specific Setup
- [ ] {{ROLE_SETUP_1}}
- [ ] {{ROLE_SETUP_2}}
- [ ] {{ROLE_SETUP_3}}

### Next Steps Identification
- [ ] Identify current role priorities
- [ ] Review pending tasks and responsibilities
- [ ] Coordinate with other active roles if needed
```

### 6. Emergency Procedures

```markdown
## Emergency Recovery Scenarios

### Scenario: {{EMERGENCY_SCENARIO_1}}
- **Symptoms**: {{SYMPTOMS}}
- **Emergency Actions**: {{EMERGENCY_ACTIONS}}
- **Recovery Steps**: {{RECOVERY_STEPS}}
- **Escalation Path**: {{ESCALATION_PATH}}

### Scenario: {{EMERGENCY_SCENARIO_2}}
- **Symptoms**: {{SYMPTOMS}}
- **Emergency Actions**: {{EMERGENCY_ACTIONS}}
- **Recovery Steps**: {{RECOVERY_STEPS}}
- **Escalation Path**: {{ESCALATION_PATH}}
```

### 7. Automation Integration

```markdown
## Automation Hooks

### Pre-Recovery Automation
```bash
# {{AUTOMATION_DESCRIPTION_1}}
{{AUTOMATION_SCRIPT_1}}
```

### Recovery Automation
```bash
# {{AUTOMATION_DESCRIPTION_2}}
{{AUTOMATION_SCRIPT_2}}
```

### Post-Recovery Automation
```bash
# {{AUTOMATION_DESCRIPTION_3}}
{{AUTOMATION_SCRIPT_3}}
```

## Template Usage Instructions

### 1. Template Customization
- Replace all `{{PLACEHOLDER}}` values with role-specific content
- Ensure all steps are actionable and specific to the role
- Include realistic time estimates for each phase
- Add role-specific tools and resources

### 2. Validation Before Use
- Test the recovery procedure in a safe environment
- Verify all scripts and automation hooks work correctly
- Ensure safety protocols are appropriate for the role
- Validate with experienced practitioners of the role

### 3. Documentation Standards
- Use consistent markdown formatting
- Include proper backlinks and navigation
- Reference related templates and examples
- Maintain version control for template evolution

### 4. Continuous Improvement
- Gather feedback from actual recovery executions
- Update template based on real-world usage
- Document lessons learned and process improvements
- Share improvements with other role recovery templates

---

**This template ensures comprehensive, safe, and effective role-specific recovery procedures.**

[Back to Recovery Definition Agent](../)

