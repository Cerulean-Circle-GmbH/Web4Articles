# Agent Recovery Testing Strategy

## The Problem
We cannot spawn agents to test recovery, but need to verify it works.

## Testing Approach

### 1. Mental Simulation Test
Walk through recovery as if you're a fresh agent:
- [ ] Can you understand what the project is?
- [ ] Can you identify which role to take?
- [ ] Can you create a PDCA from the template?
- [ ] Can you find current tasks?
- [ ] Can you start working?

### 2. Checklist Validation
From agent.recovery.md, can agent:
- [ ] Execute git commands successfully
- [ ] Create session folder structure
- [ ] Generate initial PDCA
- [ ] Understand PDCA format
- [ ] Find role process docs
- [ ] Locate current sprint
- [ ] Begin productive work

### 3. Required Knowledge Test
Does agent learn:
- [ ] Project purpose (WIKI for CIRAS)
- [ ] Work method (PDCAs)
- [ ] Role options (6 roles)
- [ ] Current state (Sprint 8)
- [ ] How to document work
- [ ] Where to commit

### 4. Failure Recovery Test
If something breaks:
- [ ] Reset command provided
- [ ] Alternative paths shown
- [ ] Help resources listed

## Testing with Human

Ask human to:
1. Start fresh cursor/agent
2. Only provide agent.recovery.md
3. Observe if agent can recover
4. Document any confusion points
5. Note missing information

## Success Criteria

Agent successfully recovers when:
1. Creates valid session structure
2. Writes first PDCA
3. Identifies role and task
4. Begins productive work
5. No human intervention needed

## Improvement Loop

1. Test with agent
2. Document failures
3. Update agent.recovery.md
4. Retest
5. Iterate until 100% success