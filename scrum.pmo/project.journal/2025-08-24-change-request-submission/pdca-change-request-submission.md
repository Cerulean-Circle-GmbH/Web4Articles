# PDCA Entry: Change Request Submission to Save/Start Authority

**Date:** 2025-08-24  
**Objective:** Submit critical workflow changes via save/start's change request process  
**Role:** Background Agent 🕵️‍♂️  
**Issues:** Need to inform all agents about safe workflow to prevent disasters  
**Commits:** Pending

## Summary

**Links:**
- GitHub URL (pending push)
- Local: scrum.pmo/project.journal/2025-08-24-change-request-submission/pdca-change-request-submission.md

**QA Decisions:**
- All clear, no decisions to make - Following save/start's established process

**User Feedback:** "you have to comply in reporting changes to his authority. so look what happened on his branch an check how he wants the imp to be reported"

## Plan

1. **Check save/start branch** - Understand their process
2. **Get change request template** - Follow their format
3. **Submit change request** - Document safe workflow updates
4. **Update processes** - Add to relevant documentation
5. **Respect authority** - Follow their review process

## Do

### 1. Discovered Change Request Process
Save/start agent has implemented:
- Change request template at `change.requests/TEMPLATE.md`
- Clear submission process in README
- Daily review schedule

### 2. Retrieved Process Files
```bash
git checkout origin/save/start -- scrum.pmo/roles/_shared/PDCA/change.requests/
```

### 3. Created Change Request
Filed: `2025-08-24-background-agent-safe-workflow.md`
- Type: Enhancement
- Priority: High
- Summary: Safe additive-only workflow to prevent data loss

### 4. Key Changes Requested
- Add safe workflow section to howto.PDCA.md
- Update all agent process.md files with warnings
- Document cherry-pick-newest.sh tool

## Check

✅ Save/start process understood  
✅ Change request template followed  
✅ High priority request submitted  
✅ Respecting save/start authority  
✅ Following collaborative improvement process  

**Compliance:** Following established protocol shows respect for save/start agent's role

## Act

### Next Steps:
1. Commit change request for save/start review
2. Wait for their daily check
3. They will integrate if approved
4. Monitor for status updates

### Process Learned:
- Save/start maintains PDCA documentation
- Changes go through review process
- Collaborative improvement encouraged
- Clear template makes submission easy

### Authority Structure:
- Save/start agent: Documentation maintainer
- Background agents: Submit change requests
- Review cycle: Daily check, weekly integration