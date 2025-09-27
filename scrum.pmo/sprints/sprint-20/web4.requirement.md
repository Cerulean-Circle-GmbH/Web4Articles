[Back to Sprint 20 Planning](./planning.md)

# Web4 Requirements - Paradigm Shifts from Mainstream Programming

## Goal

Document the revolutionary Web4 methodology principles that fundamentally differ from mainstream programming and architecture approaches, as discovered through the TLA (The Last Architecture) implementation journey.

## Core Paradigm Shifts

### 1. Empty Constructor Principle
<<<<<<< HEAD
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md) | [§/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md](../../../spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md)]** All objects MUST have empty constructors - NO initialization parameters
=======
<<<<<<< HEAD
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md) | [§/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md](../../../spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md)]** All objects MUST have empty constructors - NO initialization parameters
=======
- [x] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md) | [§/spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md](../../../spec/requirements.md/44da2f0a-885f-4547-ae1b-1619a0010069.requirement.md)]** All objects MUST have empty constructors - NO initialization parameters
>>>>>>> origin/dev/2025-09-14-UTC-1425
>>>>>>> origin/start/save.v5
  - **Mainstream:** Objects initialized with constructor parameters
  - **Web4:** Objects created empty, then configured via setters
  - **Why:** Enables universal serialization, scenario-based testing, and object hibernation

### 2. Scenario-First Development
<<<<<<< HEAD
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md) | [§/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md](../../../spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md)]** Every object instance is a scenario that can be hibernated/resurrected
=======
<<<<<<< HEAD
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md) | [§/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md](../../../spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md)]** Every object instance is a scenario that can be hibernated/resurrected
=======
- [~] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md) | [§/spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md](../../../spec/requirements.md/11466c7b-93e3-4912-b962-3f259b787480.requirement.md)]** Every object instance is a scenario that can be hibernated/resurrected
>>>>>>> origin/dev/2025-09-14-UTC-1425
>>>>>>> origin/start/save.v5
  - **Mainstream:** Objects as runtime entities with transient state
  - **Web4:** Objects as persistent scenarios with complete state preservation
  - **Why:** All formats (CSV/JSON/XML/Database) become semantically identical hibernation mechanisms

### 3. IOR (Interoperable Object Reference) Architecture
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/9ecd49f3-d7ad-4146-9efc-3a2145535fc8.requirement.md) | [§/spec/requirements.md/9ecd49f3-d7ad-4146-9efc-3a2145535fc8.requirement.md](../../../spec/requirements.md/9ecd49f3-d7ad-4146-9efc-3a2145535fc8.requirement.md)]** Objects referenced by IORs, not direct memory pointers
  - **Mainstream:** Direct object references and dependency injection
  - **Web4:** IOR-based references enabling distributed object networks
  - **Why:** True location transparency and universal object addressing

### 4. Semantic Invariants Over Format Wars
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/2a75f1ad-0892-411a-850e-0a283854b5f2.requirement.md) | [§/spec/requirements.md/2a75f1ad-0892-411a-850e-0a283854b5f2.requirement.md](../../../spec/requirements.md/2a75f1ad-0892-411a-850e-0a283854b5f2.requirement.md)]** Semantic equivalence resolves all format debates
  - **Mainstream:** Endless format wars (JSON vs XML vs YAML vs...)
  - **Web4:** Recognition that all formats hibernate object instances - format becomes irrelevant
  - **Why:** Ends Babylon problem - semantic invariants make formats interchangeable

### 5. MDA Sphere Architecture
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/89cae872-fb59-483b-88bb-06d7d7180f40.requirement.md) | [§/spec/requirements.md/89cae872-fb59-483b-88bb-06d7d7180f40.requirement.md](../../../spec/requirements.md/89cae872-fb59-483b-88bb-06d7d7180f40.requirement.md)]** Architecture forms a bounded sphere, not layered planes
  - **Mainstream:** Flat layered architectures (presentation, business, data)
  - **Web4:** Spherical MDA with poles (onion star, service domain) and equator (format diversity)
  - **Why:** Service contracts create curvature until complete semantic consolidation

### 6. Business Processes as Git Transactions
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/042ebda3-3a5d-4e1c-ac44-a6cda20fd3c7.requirement.md) | [§/spec/requirements.md/042ebda3-3a5d-4e1c-ac44-a6cda20fd3c7.requirement.md](../../../spec/requirements.md/042ebda3-3a5d-4e1c-ac44-a6cda20fd3c7.requirement.md)]** Business processes implemented as Git-versioned transaction chains
  - **Mainstream:** Database transactions with ACID properties
  - **Web4:** Git-based transaction chains with atomic rollback per step OR overall
  - **Why:** Complete audit trail, time travel debugging, and granular rollback capability

### 7. ONCE Kernel Foundation
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/85fe41c6-46e5-4210-82ab-d4e538159576.requirement.md) | [§/spec/requirements.md/85fe41c6-46e5-4210-82ab-d4e538159576.requirement.md](../../../spec/requirements.md/85fe41c6-46e5-4210-82ab-d4e538159576.requirement.md)]** Universal Object Network Communication Engine as foundation
  - **Mainstream:** Multiple messaging/communication frameworks
  - **Web4:** Single ONCE kernel handling all object communication ("ONCE and FOR ALL")
  - **Why:** Eliminates integration complexity - one universal communication mechanism

### 8. 6-Hop Traceability Graph
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/cb997b2a-96ff-48f6-9351-02521dd43eec.requirement.md) | [§/spec/requirements.md/cb997b2a-96ff-48f6-9351-02521dd43eec.requirement.md](../../../spec/requirements.md/cb997b2a-96ff-48f6-9351-02521dd43eec.requirement.md)]** Fixed 6-hop traceability from prose to units
  - **Mainstream:** Variable-depth traceability with gaps
  - **Web4:** Prose → Requirements → Tests → Features → Components → Versions → Units
  - **Why:** Complete semantic closure and guaranteed requirement coverage

### 9. Radical OOP Without Functions
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/5ca5fa55-25fc-4f8f-b194-b455127ad550.requirement.md) | [§/spec/requirements.md/5ca5fa55-25fc-4f8f-b194-b455127ad550.requirement.md](../../../spec/requirements.md/5ca5fa55-25fc-4f8f-b194-b455127ad550.requirement.md)]** NO functions outside classes - everything is a method
  - **Mainstream:** Mix of functions, classes, and procedures
  - **Web4:** Pure OOP where every operation belongs to a class
  - **Why:** Complete encapsulation and semantic clarity

### 10. The 42 Architectural Answer
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/e90b4e9b-2405-4801-8383-e89ef6ac9d38.requirement.md) | [§/spec/requirements.md/e90b4e9b-2405-4801-8383-e89ef6ac9d38.requirement.md](../../../spec/requirements.md/e90b4e9b-2405-4801-8383-e89ef6ac9d38.requirement.md)]** TLA = MDAv4 + EAMv4 + SOAv4 based on Web4
  - **Mainstream:** Endless architectural evolution and framework churn
  - **Web4:** The Last Architecture - finite science of all possible information systems
  - **Why:** Architectural singularity achieved - no more architectural evolution needed

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
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/15685fae-ff10-45ba-ae26-ad6b8f215d8e.requirement.md) | [§/spec/requirements.md/15685fae-ff10-45ba-ae26-ad6b8f215d8e.requirement.md](../../../spec/requirements.md/15685fae-ff10-45ba-ae26-ad6b8f215d8e.requirement.md)]** ONCE kernel implementation with IOR support
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/ed165310-022f-40f6-9186-e7142848ec51.requirement.md) | [§/spec/requirements.md/ed165310-022f-40f6-9186-e7142848ec51.requirement.md](../../../spec/requirements.md/ed165310-022f-40f6-9186-e7142848ec51.requirement.md)]** Universal hibernation engine for all formats
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/8c959995-7179-4f7d-90f6-b2c92b97e66f.requirement.md) | [§/spec/requirements.md/8c959995-7179-4f7d-90f6-b2c92b97e66f.requirement.md](../../../spec/requirements.md/8c959995-7179-4f7d-90f6-b2c92b97e66f.requirement.md)]** MDA sphere geometry engine with curvature calculation
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/a8c5b87a-3023-4850-b1fe-f8cf07909cc8.requirement.md) | [§/spec/requirements.md/a8c5b87a-3023-4850-b1fe-f8cf07909cc8.requirement.md](../../../spec/requirements.md/a8c5b87a-3023-4850-b1fe-f8cf07909cc8.requirement.md)]** Git-based transaction chain manager
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/13d39a68-5ea8-4225-b4fe-99ad7b745c86.requirement.md) | [§/spec/requirements.md/13d39a68-5ea8-4225-b4fe-99ad7b745c86.requirement.md](../../../spec/requirements.md/13d39a68-5ea8-4225-b4fe-99ad7b745c86.requirement.md)]** Semantic invariant validator
- [ ] **[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/8eabed89-76e3-421b-a865-871ca22c2fe2.requirement.md) | [§/spec/requirements.md/8eabed89-76e3-421b-a865-871ca22c2fe2.requirement.md](../../../spec/requirements.md/8eabed89-76e3-421b-a865-871ca22c2fe2.requirement.md)]** 6-hop traceability graph implementation

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
- **PDCA: TLA - The Last Architecture:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-21-UTC-1055-tla-the-last-architecture-web4x.md) | [§/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-21-UTC-1055-tla-the-last-architecture-web4x.md](../../project.journal/2025-08-20-1552/pdca/2025-08-21-UTC-1055-tla-the-last-architecture-web4x.md)

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