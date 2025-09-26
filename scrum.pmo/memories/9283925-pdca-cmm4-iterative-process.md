# Memory ID: 9283925 - PDCA CMM4 Iterative Process Pattern

**Title:** PDCA CMM4 Iterative Process Pattern - Not Linear Execution  
**Created:** 2025-09-24 (from process.memory.fixed.md)  
**Source:** CMM4 feedback loop mastery principles

## Memory Content

PDCA is CMM4 but it's not linear plan-do-check-act. 

**Correct Pattern:**
1. **Plan-Do:** Initial planning and execution
2. **Iterative Check-Act:** Use todo_write tool for checks and iterate Check-Act cycles
3. **Continue Until:** Either user writes "stop" OR planned goal is achieved

**Critical Understanding:**
- NOT single-pass linear execution
- CMM4 feedback loop mastery requires iteration
- Check-Act cycles continue until success or user stop
- Todo tracking essential for managing complex improvement cycles

**User Stop Protocol:**
If user writes "stop":
- Must either hang and require killing operations  
- OR stop immediately using CMM2 or lower chaos operations

## Tool Integration
- Use `write_todo` for systematic Check-Act iteration tracking
- Never try to manage complex improvement cycles manually
- Apply todo_write for each Check phase assessment
- Continue Act cycles based on Check results until goal achieved

## CMM4 Application
- Run systems multiple times to understand as whiteboxes
- Apply iterative improvement through PDCA cycles
- Use systematic measurement in Check sections
- Continue until systematic improvement achieved, not just task completion