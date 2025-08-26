[Back to Sprint 20 Planning](./planning.md)

# Web4 Requirements - Paradigm Shifts from Mainstream Programming

## Goal

Document the revolutionary Web4 methodology principles that fundamentally differ from mainstream programming and architecture approaches, as discovered through the TLA (The Last Architecture) implementation journey.

## Core Paradigm Shifts

### 1. Empty Constructor Principle
- [ ] **[requirement:uuid:web4-001-empty-constructors]** All objects MUST have empty constructors - NO initialization parameters
  - **Mainstream:** Objects initialized with constructor parameters
  - **Web4:** Objects created empty, then configured via setters
  - **Why:** Enables universal serialization, scenario-based testing, and object hibernation

### 2. Scenario-First Development
- [ ] **[requirement:uuid:web4-002-scenario-objects]** Every object instance is a scenario that can be hibernated/resurrected
  - **Mainstream:** Objects as runtime entities with transient state
  - **Web4:** Objects as persistent scenarios with complete state preservation
  - **Why:** All formats (CSV/JSON/XML/Database) become semantically identical hibernation mechanisms

### 3. IOR (Interoperable Object Reference) Architecture
- [ ] **[requirement:uuid:web4-003-ior-references]** Objects referenced by IORs, not direct memory pointers
  - **Mainstream:** Direct object references and dependency injection
  - **Web4:** IOR-based references enabling distributed object networks
  - **Why:** True location transparency and universal object addressing

### 4. Semantic Invariants Over Format Wars
- [ ] **[requirement:uuid:web4-004-semantic-invariants]** Semantic equivalence resolves all format debates
  - **Mainstream:** Endless format wars (JSON vs XML vs YAML vs...)
  - **Web4:** Recognition that all formats hibernate object instances - format becomes irrelevant
  - **Why:** Ends Babylon problem - semantic invariants make formats interchangeable

### 5. MDA Sphere Architecture
- [ ] **[requirement:uuid:web4-005-mda-sphere]** Architecture forms a bounded sphere, not layered planes
  - **Mainstream:** Flat layered architectures (presentation, business, data)
  - **Web4:** Spherical MDA with poles (onion star, service domain) and equator (format diversity)
  - **Why:** Service contracts create curvature until complete semantic consolidation

### 6. Business Processes as Git Transactions
- [ ] **[requirement:uuid:web4-006-git-transactions]** Business processes implemented as Git-versioned transaction chains
  - **Mainstream:** Database transactions with ACID properties
  - **Web4:** Git-based transaction chains with atomic rollback per step OR overall
  - **Why:** Complete audit trail, time travel debugging, and granular rollback capability

### 7. ONCE Kernel Foundation
- [ ] **[requirement:uuid:web4-007-once-kernel]** Universal Object Network Communication Engine as foundation
  - **Mainstream:** Multiple messaging/communication frameworks
  - **Web4:** Single ONCE kernel handling all object communication ("ONCE and FOR ALL")
  - **Why:** Eliminates integration complexity - one universal communication mechanism

### 8. 6-Hop Traceability Graph
- [ ] **[requirement:uuid:web4-008-traceability-graph]** Fixed 6-hop traceability from prose to units
  - **Mainstream:** Variable-depth traceability with gaps
  - **Web4:** Prose → Requirements → Tests → Features → Components → Versions → Units
  - **Why:** Complete semantic closure and guaranteed requirement coverage

### 9. Radical OOP Without Functions
- [ ] **[requirement:uuid:web4-009-no-functions]** NO functions outside classes - everything is a method
  - **Mainstream:** Mix of functions, classes, and procedures
  - **Web4:** Pure OOP where every operation belongs to a class
  - **Why:** Complete encapsulation and semantic clarity

### 10. The 42 Architectural Answer
- [ ] **[requirement:uuid:web4-010-tla-formula]** TLA = MDAv4 + EAMv4 + SOAv4 based on Web4
  - **Mainstream:** Endless architectural evolution and framework churn
  - **Web4:** The Last Architecture - finite science of all possible information systems
  - **Why:** Architectural singularity achieved - no more architectural evolution needed

### 11. Occam's Razor - Simplicity Through Integration
- [ ] **[requirement:uuid:f381877d-3797-4745-8d42-f62ada073d2f]** The simplest complete solution is the best solution
  - **Mainstream:** Multiple manual steps, disconnected tools, complex workflows
  - **Web4:** Integrated tools that handle full lifecycle in single commands
  - **Why:** Reduces errors, increases productivity, embodies true automation
  - **PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-1825-occams-razor-web4-simplicity.md) | [Local](../../project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-1825-occams-razor-web4-simplicity.md)

## Revolutionary Insights

### Finite Information Science
- The MDA sphere contains ALL possible information representations
- Format diversity exists but is semantically irrelevant at the equator
- Upper pole convergence creates true Internet of Services

### Compensation-Based Rollback
- Every business transaction has compensation handlers
- Git provides perfect audit trail and rollback mechanism
- Two modes: step-by-step rollback OR complete transaction rollback

### Semantic Web3 Achievement
- Not blockchain-based but semantic consolidation at service layer
- True Internet of Services through MDA upper pole convergence
- Service contracts create architectural curvature leading to closure

## Implementation Requirements

### Essential Components
- [ ] **[requirement:uuid:web4-impl-001]** ONCE kernel implementation with IOR support
- [ ] **[requirement:uuid:web4-impl-002]** Universal hibernation engine for all formats
- [ ] **[requirement:uuid:web4-impl-003]** MDA sphere geometry engine with curvature calculation
- [ ] **[requirement:uuid:web4-impl-004]** Git-based transaction chain manager
- [ ] **[requirement:uuid:web4-impl-005]** Semantic invariant validator
- [ ] **[requirement:uuid:web4-impl-006]** 6-hop traceability graph implementation

### Acceptance Criteria
- Empty constructors enforced by framework
- All objects serializable to any format without loss
- Complete rollback capability for any business process
- Semantic equivalence demonstrated across formats
- MDA sphere closure achieved with finite information space

## Reading List

### Core Documents
- [Sprint 20 Planning - TLA Implementation](./planning.md)
- [Web4TLA Specification Dialogue](./Web4TLA.Specification.dialogue.md)
- [PDCA: TLA - The Last Architecture](../../project.journal/2025-08-20-1552/pdca/2025-08-20-1552-tla-the-last-architecture-web4x.md)

### Related Sprints
- Sprint 2: Initial versioning attempts (learned what NOT to do)
- Sprint 5: Navigation system (3 degrees of freedom principle)
- Sprint 6-7: Correct versioning implementation
- Sprint 11: TypeScript tooling requirements

## QA Notes

**Key Differentiator:** Web4 is NOT an evolution but a revolution. It's the architectural singularity - the final answer to information system architecture (hence "42"). No more frameworks needed after this.

**Critical Understanding:** The paradigm shifts are not optional improvements but fundamental requirements. Without empty constructors, IORs, and semantic invariants, you're not doing Web4.

---

*"TLA = The Last Architecture & The Last Acronym. ONCE and FOR ALL. The answer is 42."*