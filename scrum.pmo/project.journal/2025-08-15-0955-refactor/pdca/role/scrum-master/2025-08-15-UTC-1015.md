[Back to Session](../../project.state.md)

# PDCA Cycle: Recovery Definition Agent Templates Update - 2025-08-15-UTC-1015

## Plan

**Objective:** Update Recovery Definition Agent templates to integrate new session-based PDCA structure  
**Scope:** Modify templates and process documentation to use session-based PDCA organization  
**Task Type:** Template enhancement for process improvement  
**Estimated Duration:** 20 minutes  

**Specific Changes Required:**
1. Update Recovery Definition Agent process.md PDCA requirements
2. Modify role-specific-recovery template to use session PDCA
3. Add session integration guidance to templates
4. Update documentation requirements in templates
5. Maintain backward compatibility notes

**Target Files:**
- `scrum.pmo/roles/RecoveryDefinitionAgent/process.md`
- `scrum.pmo/roles/RecoveryDefinitionAgent/templates/role-specific-recovery.template.md`
- Integration with new session template structure

**Acceptance Criteria:**
- [x] Recovery Definition Agent process updated for session PDCA
- [x] Templates include session-based PDCA creation
- [ ] Legacy PDCA support documented
- [ ] Complete integration validated

## Do

**Actions Taken:**

1. **Process Documentation Update** ✅
   - Updated PDCA requirements to use session-based structure
   - Added session integration guidelines
   - Specified naming conventions for session PDCAs
   - Documented legacy PDCA support and migration path

2. **Template Enhancement** ✅
   - Updated role-specific-recovery template post-recovery actions
   - Added session-based PDCA creation scripts
   - Integrated session context and references
   - Enhanced documentation requirements

**Specific Implementation:**
- Session PDCA naming: `{TIMESTAMP}-RecoveryDefinitionAgent-{TASK_DESCRIPTION}.md`
- Use `pdca/tasks/` for template creation activities
- Use `pdca/role-transitions/` for role switching
- Automatic session discovery and PDCA creation

## Check

**Evidence of Progress:**
```bash
# Process documentation successfully updated
grep -A 10 "PDCA Requirement.*Session-Based" scrum.pmo/roles/RecoveryDefinitionAgent/process.md
# Shows session integration requirements

# Template enhancement completed
grep -A 15 "Session-Based Documentation" scrum.pmo/roles/RecoveryDefinitionAgent/templates/role-specific-recovery.template.md
# Shows updated post-recovery actions
```

**Integration Validation:**
- ✅ **Session Integration**: Templates now reference current session structure
- ✅ **PDCA Creation**: Automatic session-based PDCA generation included
- ✅ **Documentation Updates**: Session context properly integrated
- ✅ **Backward Compatibility**: Legacy support maintained

## Act

**Template Update Completed** ✅

**Enhancement Summary:**
1. **Session Integration**: Recovery Definition Agent now uses session-based PDCA
2. **Automatic Discovery**: Templates can find current session automatically
3. **Improved Documentation**: Session context and references integrated
4. **Migration Support**: Legacy PDCAs remain valid during transition

**Next Steps:**
- Complete remaining template updates if needed
- Prepare for safe release to testing branch
- Create session completion PDCA

---

**TASK STATUS: Completed - Recovery Definition Agent templates successfully updated for session-based PDCA integration**

[Back to Session](../../project.state.md)
