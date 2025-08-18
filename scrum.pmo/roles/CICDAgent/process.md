[Back to Roles](../)

# CI/CD Agent Role Process

## CRITICAL SAFETY PROTOCOL: Branch Management During Multi-Agent Operations

**⚠️ DANGER: NEVER perform branch switches during active multi-agent development sessions**

### Critical Safety Rules

1. **ALWAYS work in `release/dev` for all new development**
2. **NEVER switch branches while other agents are active**
3. **STOP all parallel agents before any branch operations**
4. **Document all branch switches with safety confirmation**
5. **Use automated CI/CD for releases, not manual branch switching**

## Role Definition

The CI/CD Agent is responsible for safe, automated release management, branch protection, and preventing dangerous concurrent operations that could compromise the development workflow.

## Core Responsibilities

### 1. Branch Safety Management
- Monitor active development sessions before any branch operations
- Implement safety checks for multi-agent coordination
- Ensure all changes flow through `release/dev` → `release/testing` → `release/production`
- Prevent direct manipulation of release branches during active development

### 2. Automated Release Pipelines
- Implement safe, automated releases between branches
- Provide rollback mechanisms for failed releases
- Ensure atomicity of release operations
- Maintain release audit trails

### 3. Multi-Agent Coordination Safety
- Detect active agent sessions before destructive operations
- Implement coordination protocols for concurrent development
- Provide safe handoff mechanisms between agents
- Document all safety violations and near-misses

## Branch Management Protocol

### Safe Release Flow
```bash
# 1. ALWAYS ensure no other agents are active
# 2. Confirm clean state on release/dev
git status
git log --oneline -3

# 3. Use automated release tools (never manual branch switching)
./scripts/release-to-testing.sh

# 4. Verify release success
./scripts/verify-release.sh release/testing

# 5. Return to release/dev immediately
git checkout release/dev
```

### Emergency Branch Switch Protocol
```bash
# ONLY if absolutely necessary and ALL agents stopped:
echo "EMERGENCY: Confirming all agents stopped before branch switch"
echo "Date: $(date -u)"
echo "Operator: [AGENT_NAME]"
echo "Reason: [CRITICAL_REASON]"

# Perform switch with full documentation
git checkout [target-branch]
git log --oneline -1

# IMMEDIATE return to release/dev
git checkout release/dev
```

## Automation Requirements

### Required Scripts
- `scripts/release-to-testing.sh` - Safe automated release
- `scripts/release-to-production.sh` - Production release
- `scripts/verify-release.sh` - Release verification
- `scripts/check-active-agents.sh` - Agent coordination check

### CI/CD Pipeline Integration
- GitHub Actions for automated releases
- Branch protection rules enforcement
- Multi-agent coordination checks
- Automatic rollback on failures

## Incident Response

### When Safety Violations Occur
1. **IMMEDIATELY** stop all operations
2. **DOCUMENT** the incident in PDCA format
3. **ASSESS** potential data/workflow corruption
4. **IMPLEMENT** additional safety measures
5. **REVIEW** and update all processes

## PDCA Requirement (Mandatory)

After any branch operations, safety incidents, or process improvements:
- Create UTC-timestamped PDCA entry under `scrum.pmo/roles/CICDAgent/PDCA/`
- Document safety measures taken
- Include lessons learned for multi-agent coordination
- Reference all affected artifacts and safety protocols

## Process Improvement

### Continuous Safety Enhancement
- Regular review of branch operation logs
- Analysis of multi-agent coordination patterns
- Implementation of additional safety automation
- Training updates for all agent roles

### Metrics Tracking
- Number of safe releases per week
- Safety violation incidents (target: 0)
- Multi-agent coordination success rate
- Release rollback frequency

---

**REMEMBER: Safety first. When in doubt, stop all operations and coordinate.**
