[Back to Planning Sprint 22](./planning.md)

# Task D1: Universal IOR Origin Format Implementation
[task:uuid:d1a2b3c4-e5f6-7890-cdef-d1234567890a]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-d1.1-developer-ior-origin-format-spec.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Add `[task:uuid:d1a2b3c4-e5f6-7890-cdef-d1234567890a]` to this task.
- Source: OntologyAgent PDCA Analysis - IOR Universal Origin Foundation

  - up
    - [Unit Foundation Sprint Planning](../../roles/ProductOwner/PDCA/2025-09-08-UTC-1410.md)
    - [Unit Use Cases Analysis](../../roles/OntologyAgent/PDCA/2025-09-08-UTC-1405.md)

  - down
    - [Task D1.1: Developer - IOR Origin Format Specification](./task-d1.1-developer-ior-origin-format-spec.md)
    - [Task D1.2: Developer - Origin Validation System Implementation](./task-d1.2-developer-origin-validation-system.md)
    - [Task D1.3: Developer - Universal Origin Type Support](./task-d1.3-developer-universal-origin-types.md)

## Task Description
Implement universal IOR origin format system enabling any entity to be referenced as origin through consistent IOR format. This is the foundation task enabling all auto-sync capabilities and universal origin reference.

## Context
Current unit origins are limited to specific formats. TRON requirement: "the origin can be anything if it is always an IOR." This task implements universal IOR origin support enabling:
- file:// protocol for local files
- git:// protocol for git repository references  
- http:// protocol for network resources
- ior:// protocol for Web4 object references
- Consistent IOR format validation across all origin types

## Intention
Universal IOR origin format provides the foundation for all auto-sync and traceability capabilities. By standardizing on IOR format for all origins, units can reference any entity type consistently and enable universal synchronization patterns.

### **Why This Task Exists:**
1. **Universal Origin Support:** Enable any entity type as unit origin through IOR format
2. **Auto-Sync Foundation:** Provide consistent origin format for change detection
3. **Cross-Format Compatibility:** Support all Web4 reference types through unified format
4. **Traceability Foundation:** Enable complete traceability regardless of origin type

### **Problems This Task Solves:**
- **Origin Format Limitation:** Current origins limited to specific formats
- **Inconsistent Reference:** Different origin types use different reference formats
- **Auto-Sync Complexity:** Change detection varies by origin type
- **Cross-Format Traceability:** Cannot trace across different origin formats consistently

### **How This Task Solves These Problems:**
- **IOR Format Standardization:** All origins use consistent IOR format structure
- **Universal Validation:** Single validation system for all origin types
- **Consistent Change Detection:** Unified monitoring regardless of origin format
- **Cross-Format Navigation:** Seamless traceability across all supported origin types

## Acceptance Criteria
- [ ] IOR origin format specification supports file://, git://, http://, ior:// protocols
- [ ] Universal origin validation system validates all IOR format types
- [ ] Origin type classification system identifies and handles different formats
- [ ] Consistent change detection works across all supported origin types
- [ ] Cross-format navigation enables seamless traceability
- [ ] Performance optimized for different origin type access patterns
- [ ] Integration with existing Unit model and CLI infrastructure
- [ ] Comprehensive test coverage for all supported origin formats

## Dependencies
- **Requires:** Sprint-20 Task 18 (Terminal Identity) - Origin field foundation
- **Requires:** Sprint-20 Task 27 (Model Interface) - Type foundation
- **Enables:** Task E1 (Scenario Reference) - Scenario interface origin
- **Enables:** Task E2 (IOR Reference) - IOR interface origin
- **Enables:** All other Epic D, E tasks - Universal origin foundation

## Definition of Done
- [ ] Universal IOR origin format specification complete
- [ ] All protocol types (file, git, http, ior) supported
- [ ] Origin validation system functional for all types
- [ ] Change detection works consistently across formats
- [ ] Performance benchmarks meet requirements for all origin types
- [ ] Integration tests pass with existing Unit infrastructure
- [ ] Documentation complete with examples for all supported formats

---

*Sprint 22 - Unit Foundation Sprint*  
*Epic D: IOR Universal Origin (Foundation Priority)*  
*Priority: 1 (CRITICAL - Foundation for all auto-sync)*