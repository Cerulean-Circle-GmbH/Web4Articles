[Back to Recovery Definition Agent](../)

# ScrumMaster Recovery Example (Perfect Implementation)

## Role: ScrumMaster

### Role Definition
- **Primary Responsibilities**: Facilitate SCRUM process, remove impediments, coordinate team activities, maintain project documentation
- **Key Deliverables**: Sprint planning, project status reports, team coordination, process improvement
- **Stakeholder Interactions**: QA user, all development team roles (Developer, PO, Architect, Tester), external stakeholders
- **Domain Expertise**: SCRUM methodology, project management, team facilitation, process optimization

### Recovery Scope
- **Context Recovery**: Sprint status, team responsibilities, current impediments, project timeline
- **State Restoration**: Active sprint state, task assignments, team velocity, blockers list
- **Tool Access**: Project management tools, communication channels, documentation systems, git repositories
- **Data Dependencies**: Sprint backlogs, team capacity, historical velocity, stakeholder requirements

## Pre-Recovery Safety Protocol

### Environmental Verification
- [ ] Verify access to project repository on release/dev branch
- [ ] Confirm communication channels (chat, email, video conferencing) are accessible
- [ ] Validate project management tool access (JIRA, Trello, or equivalent)

### Multi-Agent Coordination
- [ ] Confirm no other agents are active in project management role
- [ ] Verify branch safety protocols (no concurrent branch operations)
- [ ] Check for conflicting operations (no active releases or deployments)

### Backup and Safety
- [ ] Document current project state before recovery
- [ ] Backup any incomplete work or temporary files
- [ ] Record timestamp and context of recovery initiation

## Recovery Execution Process

### Phase 1: Context Loading
1. **Load Project Documentation and Status**
   - Action: Read latest project status from `scrum.pmo/project.journal/*/project.state.md`
   - Validation: Confirm understanding of current sprint, active tasks, team status
   - Troubleshooting: If no recent status found, check recovery.md and README.md for last known state

2. **Review Active Sprint Information**
   - Action: Examine current sprint planning in `scrum.pmo/sprints/sprint-*/planning.md`
   - Validation: Understand sprint goals, task priorities, completion status
   - Troubleshooting: If sprint planning unclear, review task files and QA feedback logs

3. **Assess Team Roles and Responsibilities**
   - Action: Review all role process files in `scrum.pmo/roles/*/process.md`
   - Validation: Understand each role's current responsibilities and status
   - Troubleshooting: If role processes outdated, check recent PDCA entries for updates

### Phase 2: State Restoration
1. **Identify Current Impediments and Blockers**
   - Action: Review QA feedback in `qa-feedback-log.md` and recent PDCA entries
   - Validation: Understand blocking issues, their impact, and resolution status
   - Troubleshooting: If impediments unclear, review task QA sections and team communications

2. **Assess Sprint Progress and Velocity**
   - Action: Analyze task completion rates, sprint burn-down, team capacity
   - Validation: Understand if sprint is on track, ahead, or behind schedule
   - Troubleshooting: If progress data incomplete, review git commit history and task updates

3. **Review Stakeholder Communications**
   - Action: Check recent communications with QA user and external stakeholders
   - Validation: Understand current expectations, feedback, and required responses
   - Troubleshooting: If communications unclear, check email, chat logs, and documented feedback

### Phase 3: Operational Readiness
1. **Prepare Team Coordination Framework**
   - Action: Set up communication channels, update team status board, prepare for standup
   - Validation: Confirm ability to coordinate team activities and track progress
   - Troubleshooting: If coordination tools unavailable, establish alternative communication methods

2. **Plan Immediate Actions and Priorities**
   - Action: Identify urgent tasks, impediment resolution steps, stakeholder communications
   - Validation: Clear action plan for next 24-48 hours with defined priorities
   - Troubleshooting: If priorities unclear, escalate to QA user for guidance and clarification

## Recovery Validation

### Success Criteria Checklist
- [ ] Complete understanding of current sprint status and goals
- [ ] Clear visibility into team roles, responsibilities, and current tasks
- [ ] Identified impediments with resolution plans or escalation paths
- [ ] Established communication with team members and stakeholders

### Functional Verification
- [ ] Can facilitate team standup and coordinate activities
- [ ] Can update project status and communicate with stakeholders
- [ ] Can identify and address team impediments effectively

### Integration Testing
- [ ] Successfully coordinate with at least one other role (Developer, PO, etc.)
- [ ] Update project documentation with current status
- [ ] Role-specific workflows operational (sprint planning, retrospectives, etc.)

## Post-Recovery Protocol

### Documentation Requirements
- [ ] Update recovery status in `recovery.md` with timestamp and role context
- [ ] Log recovery completion with summary of project state
- [ ] Document any issues encountered during recovery for process improvement

### Role-Specific Setup
- [ ] Update team communication channels with ScrumMaster availability
- [ ] Schedule next sprint ceremonies (planning, review, retrospective) if needed
- [ ] Establish daily standup schedule and impediment tracking system

### Next Steps Identification
- [ ] Review sprint backlog and identify next priorities
- [ ] Check for overdue tasks or blocked team members
- [ ] Plan stakeholder communications and status updates
- [ ] Schedule process improvement activities based on recent learnings

## Emergency Recovery Scenarios

### Scenario: Critical Project Deadline Approaching
- **Symptoms**: Sprint behind schedule, stakeholder pressure, team stress indicators
- **Emergency Actions**: Immediate team assessment, stakeholder communication, scope adjustment
- **Recovery Steps**: Focus on critical path tasks, remove non-essential work, increase communication frequency
- **Escalation Path**: QA user involvement for scope decisions, stakeholder negotiation

### Scenario: Team Member Unavailable/Blocked
- **Emergency Actions**: Assess impact on sprint goals, redistribute tasks if possible
- **Recovery Steps**: Document blocker, find alternative resources, adjust sprint scope
- **Escalation Path**: Stakeholder communication if sprint goals at risk

### Scenario: Technical Crisis Affecting Development
- **Symptoms**: Multiple failed builds, infrastructure issues, development environment problems
- **Emergency Actions**: Coordinate with DevOps and technical leads, establish temporary workarounds
- **Recovery Steps**: Focus team on crisis resolution, defer non-critical tasks, document lessons learned
- **Escalation Path**: Executive stakeholder involvement if business impact significant

## Automation Integration

### Pre-Recovery Automation
```bash
# Validate project environment and access
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
if [ ! -d "$PROJECT_ROOT/scrum.pmo" ]; then
  echo "ERROR: Not in valid project directory"
  exit 1
fi

# Check for latest project status
LATEST_STATUS=$(find "$PROJECT_ROOT/scrum.pmo/project.journal" -name "project.state.md" | sort | tail -1)
if [ -n "$LATEST_STATUS" ]; then
  echo "Latest project status: $LATEST_STATUS"
else
  echo "WARNING: No recent project status found"
fi
```

### Recovery Automation
```bash
# Generate recovery journal entry
TIMESTAMP=$(date -u +"%Y-%m-%d-%H%M")
JOURNAL_DIR="$PROJECT_ROOT/scrum.pmo/project.journal/${TIMESTAMP}-recovery"
mkdir -p "$JOURNAL_DIR"

# Create project state template for ScrumMaster recovery
sed "s/{{TIMESTAMP}}/${TIMESTAMP} UTC/g" "$PROJECT_ROOT/scrum.pmo/templates/project.state.template.md" > "$JOURNAL_DIR/project.state.md"
sed -i "s/ScrumMaster (autonomous)/ScrumMaster (recovered)/g" "$JOURNAL_DIR/project.state.md"

echo "Created recovery journal: $JOURNAL_DIR"
```

### Post-Recovery Automation
```bash
# Update project index and push changes
"$PROJECT_ROOT/scripts/update-project-index.sh" "$JOURNAL_DIR"

# Commit recovery documentation
git add "$JOURNAL_DIR/" index.md recovery.md
git commit -m "docs: ScrumMaster recovery completed - ${TIMESTAMP}"
git push origin release/dev

echo "Recovery documented and committed successfully"
```

## Real-World Usage Example

### Execution Context
**Date**: 2025-08-15 09:30 UTC  
**Trigger**: QA user requested "recover" after 3-day project hiatus  
**Environment**: macOS development machine, project on release/dev branch  
**Previous State**: Last activity 3 days ago, sprint status unclear  

### Recovery Execution Log
```
09:30 - Started ScrumMaster recovery process
09:31 - Verified environment: release/dev branch, clean working tree
09:32 - Located latest project status: scrum.pmo/project.journal/2025-08-12-1102/project.state.md
09:33 - Reviewed Sprint 18 status: 75% complete, 3 tasks pending
09:35 - Identified impediment: TSRanger v2.5 testing incomplete
09:37 - Checked team roles: Developer and Tester roles need coordination
09:40 - Created recovery journal: 2025-08-15-0930-recovery
09:42 - Updated team communication: Slack channel and email notification
09:45 - Recovery complete, ready for team coordination
```

### Lessons Learned
- Recovery process took 15 minutes for complex project state
- Most time spent understanding sprint status and task dependencies
- Automation reduced documentation overhead significantly
- Clear role process documentation enabled quick context loading

---

**This example demonstrates comprehensive ScrumMaster recovery with realistic scenarios, detailed steps, and proven automation integration.**

[Back to Recovery Definition Agent](../)
