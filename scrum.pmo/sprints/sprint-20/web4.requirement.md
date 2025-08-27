[Back to Sprint 20 Planning](./planning.md)

# Web4 Requirements - Paradigm Shifts from Mainstream Programming

## Goal

Document the revolutionary Web4 methodology principles that fundamentally differ from mainstream programming and architecture approaches, as discovered through the TLA (The Last Architecture) implementation journey.

## Core Paradigm Shifts

### 1. Empty Constructor Principle
- [ ] **[requirement:uuid:fe093f35-f143-4c54-8c64-b11f9f04443d]** All objects MUST have empty constructors - NO initialization parameters
  - **Mainstream:** Objects initialized with constructor parameters
  - **Web4:** Objects created empty, then configured via setters
  - **Why:** Enables universal serialization, scenario-based testing, and object hibernation

### 2. Scenario-First Development
- [ ] **[requirement:uuid:c3c960a6-5686-4658-8a55-6e2296eb419e]** Every object instance is a scenario that can be hibernated/resurrected
  - **Mainstream:** Objects as runtime entities with transient state
  - **Web4:** Objects as persistent scenarios with complete state preservation
  - **Why:** All formats (CSV/JSON/XML/Database) become semantically identical hibernation mechanisms

### 3. IOR (Interoperable Object Reference) Architecture
- [ ] **[requirement:uuid:7733f8b8-d12f-4cbb-b1d7-6f42ed0a540b]** Objects referenced by IORs, not direct memory pointers
  - **Mainstream:** Direct object references and dependency injection
  - **Web4:** IOR-based references enabling distributed object networks
  - **Why:** True location transparency and universal object addressing

### 4. Semantic Invariants Over Format Wars
- [ ] **[requirement:uuid:51ccc6fd-2438-47a3-9f6f-dd897694525d]** Semantic equivalence resolves all format debates
  - **Mainstream:** Endless format wars (JSON vs XML vs YAML vs...)
  - **Web4:** Recognition that all formats hibernate object instances - format becomes irrelevant
  - **Why:** Ends Babylon problem - semantic invariants make formats interchangeable

### 5. MDA Sphere Architecture
- [ ] **[requirement:uuid:765036e9-d3f9-410a-9cb8-3c36d030782c]** Architecture forms a bounded sphere, not layered planes
  - **Mainstream:** Flat layered architectures (presentation, business, data)
  - **Web4:** Spherical MDA with poles (onion star, service domain) and equator (format diversity)
  - **Why:** Service contracts create curvature until complete semantic consolidation

### 6. Business Processes as Git Transactions
- [ ] **[requirement:uuid:5a5fecd1-3507-4501-a362-b9640e88e18c]** Business processes implemented as Git-versioned transaction chains
  - **Mainstream:** Database transactions with ACID properties
  - **Web4:** Git-based transaction chains with atomic rollback per step OR overall
  - **Why:** Complete audit trail, time travel debugging, and granular rollback capability

### 7. ONCE Kernel Foundation
- [ ] **[requirement:uuid:33f39ed0-76f3-4940-9013-fb389990f776]** Universal Object Network Communication Engine as foundation
  - **Mainstream:** Multiple messaging/communication frameworks
  - **Web4:** Single ONCE kernel handling all object communication ("ONCE and FOR ALL")
  - **Why:** Eliminates integration complexity - one universal communication mechanism

### 8. 6-Hop Traceability Graph
- [ ] **[requirement:uuid:c6fc2fce-babb-410d-be7e-3e39d362bb28]** Fixed 6-hop traceability from prose to units
  - **Mainstream:** Variable-depth traceability with gaps
  - **Web4:** Prose → Requirements → Tests → Features → Components → Versions → Units
  - **Why:** Complete semantic closure and guaranteed requirement coverage

### 9. Radical OOP Without Functions
- [ ] **[requirement:uuid:ec4234b0-2615-4b6a-a8b1-64d4c2e5208d]** NO functions outside classes - everything is a method
  - **Mainstream:** Mix of functions, classes, and procedures
  - **Web4:** Pure OOP where every operation belongs to a class
  - **Why:** Complete encapsulation and semantic clarity

### 10. The 42 Architectural Answer
- [ ] **[requirement:uuid:153aa736-f519-48c5-95ef-19e0ba9c372e]** TLA = MDAv4 + EAMv4 + SOAv4 based on Web4
  - **Mainstream:** Endless architectural evolution and framework churn
  - **Web4:** The Last Architecture - finite science of all possible information systems
  - **Why:** Architectural singularity achieved - no more architectural evolution needed

### 11. Occam's Razor - Simplicity Through Integration
- [ ] **[requirement:uuid:f381877d-3797-4745-8d42-f62ada073d2f]** The simplest complete solution is the best solution
  - **Mainstream:** Multiple manual steps, disconnected tools, complex workflows
  - **Web4:** Integrated tools that handle full lifecycle in single commands
  - **Why:** Reduces errors, increases productivity, embodies true automation
  - **PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-1825-occams-razor-web4-simplicity.md) | [Local](../../project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-1825-occams-razor-web4-simplicity.md)

### 12. Scenario as Source of Truth - Never Edit Views
- [ ] **[requirement:uuid:e8e688d4-bcf3-4823-ad7d-d4e360553c80]** Scenarios are the model, views are ephemeral generated outputs
  - **Mainstream:** Direct editing of any file, treating all files as equal sources
  - **Web4:** Scenarios (JSON) are the single source of truth, MD views are regenerated
  - **Why:** Maintains data integrity, enables automated updates, prevents inconsistency
  - **Critical:** Never edit .requirement.md or other view files - only tools update scenarios

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
- [ ] **[requirement:uuid:7e3a05c7-ff51-4219-8053-c4dc986e0093]** ONCE kernel implementation with IOR support
- [ ] **[requirement:uuid:1d02823d-3078-4916-a417-27e34e470701]** Universal hibernation engine for all formats
- [ ] **[requirement:uuid:c4d31c74-cdcf-49e0-b648-5efd8154e454]** MDA sphere geometry engine with curvature calculation
- [ ] **[requirement:uuid:ea8c1982-a6bd-4a5a-854e-ed28fe22329e]** Git-based transaction chain manager
- [ ] **[requirement:uuid:cad23aef-2630-4ae0-986f-375564368c7a]** Semantic invariant validator
- [ ] **[requirement:uuid:0872a216-b6ab-4a0d-b572-3e70a07323d0]** 6-hop traceability graph implementation

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