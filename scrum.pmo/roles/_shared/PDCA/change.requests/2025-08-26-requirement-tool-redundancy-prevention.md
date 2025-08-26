# Change Request: Requirement Tool Redundancy Prevention

**Date:** 2025-08-26  
**Submitted by:** Background Agent  
**Type:** Tool Enhancement - CMM4 Improvement  
**Priority:** High  

## Summary

Enhance the requirement tool to prevent redundant requirement creation and improve requirement tracking.

## Current State

The requirement tool:
- Creates new requirements with `requirement create`
- No way to check if a requirement UUID already exists
- No way to list missing/placeholder requirements
- Could create duplicates if user not careful

Sprint 20 contains 16 placeholder UUIDs (like "web4-001-empty-constructors") that aren't real requirements.

## Proposed Change

### 1. Add Existence Check Command

```bash
requirement exists <uuid>
# Returns: "Requirement exists: <title>" or "Requirement not found"
```

### 2. Add List Missing Command

```bash
requirement list --missing
# Scans all .md files for [requirement:uuid:xxx] patterns
# Reports which UUIDs don't have corresponding scenarios
```

### 3. Add Duplicate Prevention

Before creating a requirement:
- Check if title already exists
- Warn user: "Similar requirement exists: <uuid> - <title>"
- Ask for confirmation to proceed

### 4. Add Search by Title

```bash
requirement search "empty constructor"
# Returns matching requirements to prevent duplicates
```

## Benefits

1. **Prevents Duplicates**: Check before creating
2. **Finds Gaps**: Identify placeholder UUIDs
3. **Improves Tracking**: Know what exists vs documented
4. **CMM4 Compliance**: Question and verify assumptions

## Implementation Notes

- Use existing UnitIndexStorage for searching
- Scan markdown files for requirement references
- Compare against scenario index
- Provide clear feedback to users

## Testing

1. Create requirement with duplicate title - should warn
2. Use placeholder UUID - should report as missing
3. Search for existing requirement - should find it
4. List missing from Sprint 20 - should find 16

## References

- [CMM4 Sprint 20 Analysis PDCA](../../project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2130-cmm4-sprint20-requirements-analysis.md)
- [Sprint 20 Web4 Requirements](../../../../sprints/sprint-20/web4.requirement.md)