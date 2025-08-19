# Comprehensive Sprint Cleanup Plan

## Summary of Issues Found

### ✅ Properly Structured Sprints
- **Sprint 12**: Fixed during this session
- **Sprint 4**: Only planning.md (minimal sprint)
- **Sprint 11**: Only planning.md and requirements.md

### ❌ Sprints Needing Cleanup

#### Sprint 0 (Foundation)
**Issues**: Mixed naming patterns
- Has both `task-X` and `task-X.Y` patterns
- Missing role indicators in some refinements
**Actions**: 
- Rename refinements to include roles
- Ensure consistent numbering

#### Sprint 1 (CLI Tool)
**Issues**: Inconsistent structure
- Has `task-1-tssh-wrapper.md` (duplicate of task-1.0?)
- Refinements don't follow X.Y.Z pattern (uses X.Y.Z format)
**Actions**:
- Clarify major vs refinement tasks
- Fix numbering to X.Y for major, X.Y.Z for refinements

#### Sprint 2 (TSRanger v1)
**Issues**: Has both task-1.md and task-1.X refinements
**Actions**:
- Determine if task-1.md is planning or should be task-1.0
- Ensure consistent structure

#### Sprint 3 (Project Template)
**Issues**: Very long task numbers (1.10-1.15)
**Actions**:
- Consider if these should be separate major tasks
- Reorganize if needed

#### Sprint 5 (TSRanger v2)
**Issues**: Multiple major tasks without clear hierarchy
- task-1.md, task-2.md, task-3.md (major)
- task-X.1 refinements
**Actions**: Structure looks correct, just verify

#### Sprint 6 (Versioned Structure)
**Issues**: Good structure, minor naming
- task-6.X refinements should check role naming
**Actions**: Verify role indicators

#### Sprint 7 (TSRanger v2.5)
**Issues**: Duplicate of Sprint 5 tasks?
**Actions**: Investigate why same files as Sprint 5

#### Sprint 8 (Ranger Analysis)
**Issues**: Has requirements files but no tasks
**Actions**: Determine if tasks were created

#### Sprint 9 (Merge Operations)
**Issues**: Only specific numbered tasks (9.22, 9.7, 9.8)
- No planning.md
**Actions**: Add planning.md, check task numbering

#### Sprint 10 (License)
**Issues**: Empty directory
**Actions**: Check if sprint was executed

#### Sprint 13-18 (Article Sprints)
**Issues**: Only planning and requirements, no tasks
**Actions**: These are future sprints, OK as-is

### Sprint 17
**Issues**: Has planning-preview.md instead of planning.md
**Actions**: Rename when sprint starts

## Cleanup Execution Plan

### Phase 1: Document Current State
1. Create inventory of all sprint structures
2. Identify patterns and inconsistencies
3. Document in cleanup tasks

### Phase 2: Fix Critical Issues
1. **Sprint 0**: Fix refinement naming
2. **Sprint 1**: Resolve duplicate task-1
3. **Sprint 9**: Add missing planning.md

### Phase 3: Standardize Naming
1. All refinements must have role indicators
2. Fix X.Y.Z numbering patterns
3. Ensure major vs refinement clarity

### Phase 4: Validate
1. Run structure validation
2. Update Sprint 0 Task 8 with findings
3. Create automated checker

## Priority Order
1. Sprint 0 (foundation)
2. Sprint 1 (establishes patterns)
3. Sprint 9 (missing planning)
4. Others in sequence

## Estimated Effort
- 15-20 minutes per sprint
- Total: 2-3 hours for complete cleanup