[Back to Recovery Definition Agent](../)

# Multi-Agent Coordination Template

## Template Overview

This template provides comprehensive frameworks for coordinating recovery operations when multiple agents need to work together or when recovery affects multiple roles simultaneously. Use this template for complex recovery scenarios requiring careful orchestration.

## Template Structure

### 1. Coordination Context

```markdown
## Multi-Agent Coordination: {{COORDINATION_SCENARIO}}

### Coordination Scope
- **Primary Agents**: {{PRIMARY_AGENTS}}
- **Supporting Agents**: {{SUPPORTING_AGENTS}}
- **Coordination Requirements**: {{COORDINATION_REQUIREMENTS}}
- **Interdependencies**: {{AGENT_INTERDEPENDENCIES}}

### Coordination Objectives
- **Primary Objective**: {{PRIMARY_OBJECTIVE}}
- **Secondary Objectives**: {{SECONDARY_OBJECTIVES}}
- **Success Criteria**: {{SUCCESS_CRITERIA}}
- **Coordination Timeline**: {{COORDINATION_TIMELINE}}

### Risk Assessment
- **Coordination Risks**: {{COORDINATION_RISKS}}
- **Communication Risks**: {{COMMUNICATION_RISKS}}
- **Conflict Risks**: {{CONFLICT_RISKS}}
- **Mitigation Strategies**: {{MITIGATION_STRATEGIES}}
```

### 2. Agent Role Definitions

```markdown
## Agent Roles and Responsibilities

### Primary Coordinator: {{PRIMARY_COORDINATOR_ROLE}}
- **Coordination Responsibilities**: {{COORDINATION_RESPONSIBILITIES}}
- **Decision Authority**: {{DECISION_AUTHORITY}}
- **Communication Duties**: {{COMMUNICATION_DUTIES}}
- **Escalation Powers**: {{ESCALATION_POWERS}}

### Agent: {{AGENT_ROLE_1}}
- **Specific Responsibilities**: {{AGENT_1_RESPONSIBILITIES}}
- **Coordination Points**: {{AGENT_1_COORDINATION_POINTS}}
- **Dependencies**: {{AGENT_1_DEPENDENCIES}}
- **Deliverables**: {{AGENT_1_DELIVERABLES}}

### Agent: {{AGENT_ROLE_2}}
- **Specific Responsibilities**: {{AGENT_2_RESPONSIBILITIES}}
- **Coordination Points**: {{AGENT_2_COORDINATION_POINTS}}
- **Dependencies**: {{AGENT_2_DEPENDENCIES}}
- **Deliverables**: {{AGENT_2_DELIVERABLES}}

### Agent: {{AGENT_ROLE_3}}
- **Specific Responsibilities**: {{AGENT_3_RESPONSIBILITIES}}
- **Coordination Points**: {{AGENT_3_COORDINATION_POINTS}}
- **Dependencies**: {{AGENT_3_DEPENDENCIES}}
- **Deliverables**: {{AGENT_3_DELIVERABLES}}
```

### 3. Communication Framework

```markdown
## Communication and Coordination Framework

### Communication Channels
- **Primary Channel**: {{PRIMARY_COMMUNICATION_CHANNEL}}
- **Backup Channel**: {{BACKUP_COMMUNICATION_CHANNEL}}
- **Emergency Channel**: {{EMERGENCY_COMMUNICATION_CHANNEL}}
- **Documentation Channel**: {{DOCUMENTATION_CHANNEL}}

### Communication Protocols
1. **Regular Status Updates**
   - **Frequency**: {{UPDATE_FREQUENCY}}
   - **Format**: {{UPDATE_FORMAT}}
   - **Required Information**: {{REQUIRED_INFORMATION}}
   - **Distribution List**: {{DISTRIBUTION_LIST}}

2. **Decision Communication**
   - **Decision Points**: {{DECISION_POINTS}}
   - **Authority Matrix**: {{AUTHORITY_MATRIX}}
   - **Notification Requirements**: {{NOTIFICATION_REQUIREMENTS}}
   - **Documentation Standards**: {{DOCUMENTATION_STANDARDS}}

3. **Issue Escalation**
   - **Level 1 Issues**: {{LEVEL_1_ISSUES}} → {{LEVEL_1_ESCALATION}}
   - **Level 2 Issues**: {{LEVEL_2_ISSUES}} → {{LEVEL_2_ESCALATION}}
   - **Emergency Issues**: {{EMERGENCY_ISSUES}} → {{EMERGENCY_ESCALATION}}
```

### 4. Coordination Workflow

```markdown
## Coordination Workflow Process

### Phase 1: Coordination Initiation
1. **{{INITIATION_STEP_1}}**
   - **Coordinator Action**: {{COORDINATOR_ACTION}}
   - **Agent Actions**: {{AGENT_ACTIONS}}
   - **Validation**: {{VALIDATION_CRITERIA}}
   - **Timeline**: {{STEP_TIMELINE}}

2. **{{INITIATION_STEP_2}}**
   - **Coordinator Action**: {{COORDINATOR_ACTION}}
   - **Agent Actions**: {{AGENT_ACTIONS}}
   - **Validation**: {{VALIDATION_CRITERIA}}
   - **Timeline**: {{STEP_TIMELINE}}

### Phase 2: Coordinated Execution
1. **{{EXECUTION_STEP_1}}**
   - **Lead Agent**: {{LEAD_AGENT}}
   - **Supporting Agents**: {{SUPPORTING_AGENTS}}
   - **Coordination Points**: {{COORDINATION_POINTS}}
   - **Dependencies**: {{STEP_DEPENDENCIES}}
   - **Validation**: {{VALIDATION_CRITERIA}}

2. **{{EXECUTION_STEP_2}}**
   - **Lead Agent**: {{LEAD_AGENT}}
   - **Supporting Agents**: {{SUPPORTING_AGENTS}}
   - **Coordination Points**: {{COORDINATION_POINTS}}
   - **Dependencies**: {{STEP_DEPENDENCIES}}
   - **Validation**: {{VALIDATION_CRITERIA}}

### Phase 3: Synchronization and Validation
1. **{{SYNC_STEP_1}}**
   - **Synchronization Requirements**: {{SYNC_REQUIREMENTS}}
   - **Validation Process**: {{VALIDATION_PROCESS}}
   - **Success Criteria**: {{SUCCESS_CRITERIA}}
   - **Failure Response**: {{FAILURE_RESPONSE}}

2. **{{SYNC_STEP_2}}**
   - **Synchronization Requirements**: {{SYNC_REQUIREMENTS}}
   - **Validation Process**: {{VALIDATION_PROCESS}}
   - **Success Criteria**: {{SUCCESS_CRITERIA}}
   - **Failure Response**: {{FAILURE_RESPONSE}}

### Phase 4: Coordination Completion
1. **{{COMPLETION_STEP_1}}**
   - **Final Validation**: {{FINAL_VALIDATION}}
   - **Documentation Requirements**: {{DOCUMENTATION_REQUIREMENTS}}
   - **Handoff Procedures**: {{HANDOFF_PROCEDURES}}
   - **Cleanup Tasks**: {{CLEANUP_TASKS}}

2. **{{COMPLETION_STEP_2}}**
   - **Sign-off Process**: {{SIGNOFF_PROCESS}}
   - **Lessons Learned**: {{LESSONS_LEARNED}}
   - **Process Improvements**: {{PROCESS_IMPROVEMENTS}}
   - **Future Coordination**: {{FUTURE_COORDINATION}}
```

### 5. Conflict Resolution

```markdown
## Conflict Resolution Framework

### Conflict Types and Resolution

#### Type 1: {{CONFLICT_TYPE_1}}
- **Identification**: {{CONFLICT_IDENTIFICATION}}
- **Resolution Process**: {{RESOLUTION_PROCESS}}
- **Decision Authority**: {{DECISION_AUTHORITY}}
- **Timeline**: {{RESOLUTION_TIMELINE}}

#### Type 2: {{CONFLICT_TYPE_2}}
- **Identification**: {{CONFLICT_IDENTIFICATION}}
- **Resolution Process**: {{RESOLUTION_PROCESS}}
- **Decision Authority**: {{DECISION_AUTHORITY}}
- **Timeline**: {{RESOLUTION_TIMELINE}}

#### Type 3: {{CONFLICT_TYPE_3}}
- **Identification**: {{CONFLICT_IDENTIFICATION}}
- **Resolution Process**: {{RESOLUTION_PROCESS}}
- **Decision Authority**: {{DECISION_AUTHORITY}}
- **Timeline**: {{RESOLUTION_TIMELINE}}

### Escalation Matrix
- **Agent-Level Resolution**: {{AGENT_LEVEL_RESOLUTION}}
- **Coordinator Resolution**: {{COORDINATOR_RESOLUTION}}
- **QA User Resolution**: {{QA_USER_RESOLUTION}}
- **Emergency Resolution**: {{EMERGENCY_RESOLUTION}}
```

### 6. Safety and Validation

```markdown
## Multi-Agent Safety Protocols

### Safety Checkpoints
- [ ] **Checkpoint 1**: {{SAFETY_CHECKPOINT_1}}
  - **Validation**: {{VALIDATION_METHOD}}
  - **Responsible Agent**: {{RESPONSIBLE_AGENT}}
  - **Failure Action**: {{FAILURE_ACTION}}

- [ ] **Checkpoint 2**: {{SAFETY_CHECKPOINT_2}}
  - **Validation**: {{VALIDATION_METHOD}}
  - **Responsible Agent**: {{RESPONSIBLE_AGENT}}
  - **Failure Action**: {{FAILURE_ACTION}}

- [ ] **Checkpoint 3**: {{SAFETY_CHECKPOINT_3}}
  - **Validation**: {{VALIDATION_METHOD}}
  - **Responsible Agent**: {{RESPONSIBLE_AGENT}}
  - **Failure Action**: {{FAILURE_ACTION}}

### Coordination Validation
- **Agent Readiness**: {{AGENT_READINESS_VALIDATION}}
- **Resource Availability**: {{RESOURCE_VALIDATION}}
- **Communication Testing**: {{COMMUNICATION_VALIDATION}}
- **Process Understanding**: {{PROCESS_VALIDATION}}

### Emergency Procedures
- **Coordination Failure**: {{COORDINATION_FAILURE_PROCEDURE}}
- **Agent Unavailability**: {{AGENT_UNAVAILABILITY_PROCEDURE}}
- **Communication Breakdown**: {{COMMUNICATION_BREAKDOWN_PROCEDURE}}
- **Critical Error Conditions**: {{CRITICAL_ERROR_PROCEDURE}}
```

### 7. Automation and Monitoring

```markdown
## Coordination Automation

### Coordination Monitoring
```bash
# {{MONITORING_DESCRIPTION}}
{{MONITORING_SCRIPT}}
```

### Agent Status Tracking
```bash
# {{STATUS_TRACKING_DESCRIPTION}}
{{STATUS_TRACKING_SCRIPT}}
```

### Automated Coordination
```bash
# {{AUTOMATED_COORDINATION_DESCRIPTION}}
{{COORDINATION_SCRIPT}}
```

### Validation Automation
```bash
# {{VALIDATION_AUTOMATION_DESCRIPTION}}
{{VALIDATION_SCRIPT}}
```

## Template Usage Guidelines

### 1. Coordination Planning
- Identify all agents that need coordination
- Define clear roles and responsibilities for each agent
- Establish communication protocols and channels
- Plan for potential conflicts and resolution methods

### 2. Template Customization
- Replace all `{{PLACEHOLDER}}` values with specific coordination requirements
- Ensure all coordination points are clearly defined and actionable
- Include realistic timelines and resource requirements
- Validate communication channels and protocols

### 3. Testing and Rehearsal
- Conduct coordination rehearsals with all involved agents
- Test communication channels and escalation procedures
- Validate conflict resolution processes
- Ensure all agents understand their roles and responsibilities

### 4. Continuous Improvement
- Gather feedback from coordination executions
- Refine coordination processes based on real-world usage
- Update templates to reflect lessons learned
- Share improvements across similar coordination scenarios

---

**This template ensures effective multi-agent coordination with clear communication, defined responsibilities, and robust conflict resolution capabilities.**

[Back to Recovery Definition Agent](../)

