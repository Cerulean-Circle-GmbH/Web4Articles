# PDCA Cycle: ONCE Kernel v0.2.0.0 Architecture Enhancement - Port 42777 & Server Hierarchy

**📅 Date:** 2025-08-30 UTC 04:30  
**🎯 Objective:** Design and implement major ONCE kernel architecture enhancement with default port 42777, server hierarchy, scenario-based configuration, and elimination of environment variable dependencies  
**👤 Role:** Developer  
**⚠️ Issues:** Current "address in use" error in `once demo "s10s10q"` reveals need for proper server management and hierarchical architecture

## Summary

**📎 Previous Commit:** 9e9bd4b9 🔗 PDCA DUAL LINKS FIX: Correct artifact links format to proper GitHub|Local dual link pattern with accurate relative paths  
**🔗 Previous PDCA:** [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/scrum.pmo/project.journal/2025-08-29-UTC-1925-component-development-session/pdca/2025-08-30-UTC-0400-once-demo-endpoint-enhancement.md) | [2025-08-30-UTC-0400-once-demo-endpoint-enhancement.md](2025-08-30-UTC-0400-once-demo-endpoint-enhancement.md)

### Artifact Links
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/components/ONCE/0.2.0.0/spec/requirements.md/471d2d0a-4914-4900-9aed-74b69e032679.requirement.md) | [../../../../components/ONCE/0.2.0.0/spec/requirements.md/471d2d0a-4914-4900-9aed-74b69e032679.requirement.md](../../../../components/ONCE/0.2.0.0/spec/requirements.md/471d2d0a-4914-4900-9aed-74b69e032679.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/9beee86b-09c2-43c8-b449-b9a7b8f2b338.requirement.md) | [../../../../spec/requirements.md/9beee86b-09c2-43c8-b449-b9a7b8f2b338.requirement.md](../../../../spec/requirements.md/9beee86b-09c2-43c8-b449-b9a7b8f2b338.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/9b768111-7a06-4266-9d71-0ef72e90c62b.requirement.md) | [../../../../spec/requirements.md/9b768111-7a06-4266-9d71-0ef72e90c62b.requirement.md](../../../../spec/requirements.md/9b768111-7a06-4266-9d71-0ef72e90c62b.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/36cd0fd1-9d4e-4f99-9694-9d9bcce7e1d4.requirement.md) | [../../../../spec/requirements.md/36cd0fd1-9d4e-4f99-9694-9d9bcce7e1d4.requirement.md](../../../../spec/requirements.md/36cd0fd1-9d4e-4f99-9694-9d9bcce7e1d4.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/6707a628-bf3b-4dd4-a750-562f9f0c5fa4.requirement.md) | [../../../../spec/requirements.md/6707a628-bf3b-4dd4-a750-562f9f0c5fa4.requirement.md](../../../../spec/requirements.md/6707a628-bf3b-4dd4-a750-562f9f0c5fa4.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/957efb2e-8610-47c2-a9de-7049c8506656.requirement.md) | [../../../../spec/requirements.md/957efb2e-8610-47c2-a9de-7049c8506656.requirement.md](../../../../spec/requirements.md/957efb2e-8610-47c2-a9de-7049c8506656.requirement.md)
- [GitHub](https://github.com/charlpcronje/Web4Articles/blob/main/spec/requirements.md/818efdc0-3dd6-464f-9d77-7ea7523c89db.requirement.md) | [../../../../spec/requirements.md/818efdc0-3dd6-464f-9d77-7ea7523c89db.requirement.md](../../../../spec/requirements.md/818efdc0-3dd6-464f-9d77-7ea7523c89db.requirement.md)

### QA Decisions
- [ ] **Migration Strategy:** Should we create ONCE v0.2.0.0 as parallel implementation or upgrade in-place?
- [ ] **Backward Compatibility:** How long should we maintain 0.1.0.2 compatibility layer?
- [ ] **Default Domain:** Confirm "local.once" as default reverse domain or prefer project-specific pattern?
- [ ] **Port Range Strategy:** Should port increment start at 8080 or use dynamic range (42778, 42779...)?
- [ ] **Scenario Directory:** Should scenarios be relative to project root or component root?
- [ ] **Testing During Transition:** How to handle existing tests while implementing new architecture?

---

## Plan

**Goal:** Implement comprehensive ONCE kernel architecture enhancement based on "address in use" issue analysis, creating robust server hierarchy with scenario-based configuration.

**User Request (2025-08-30 UTC 04:28):**
> "i ran once demo "s10s10q" and got a server address in use error. this is a good case to explain you the ONCE kernel better. refresh your mind with all sprint 20 files. create additional requirments for and in the once component with requirement-v0.1.2.2..."

**Current Problem Analysis:**
- **Address Conflicts:** Multiple server instances conflict on same port
- **Environment Dependency:** Current system relies on HOST/PORT environment variables
- **Test Brittleness:** Vitests fail due to environment setup requirements
- **No Server Discovery:** No mechanism for server instances to coordinate

**New Architecture Vision:**
1. **Default Port 42777:** ONCE servers start on standard port
2. **Server Hierarchy:** First instance becomes name server, others register as clients
3. **Auto-Discovery:** Port conflicts trigger automatic port negotiation (8080+)
4. **Scenario Storage:** Organized `/scenarios/domain/component/version/uuid.json` structure
5. **Zero Environment:** No dependency on environment variables
6. **CLI Enhancement:** Support `once start <scenariofile>` parameter

### Created Requirements Summary:
1. **471d2d0a-4914-4900-9aed-74b69e032679:** ONCE Kernel Default Port 42777 Architecture
2. **9beee86b-09c2-43c8-b449-b9a7b8f2b338:** ONCE Server Hierarchy Client-Server Model
3. **9b768111-7a06-4266-9d71-0ef72e90c62b:** ONCE Scenario Storage Organization
4. **36cd0fd1-9d4e-4f99-9694-9d9bcce7e1d4:** ONCE CLI Scenario File Support
5. **6707a628-bf3b-4dd4-a750-562f9f0c5fa4:** ONCE Environment Variable Elimination
6. **957efb2e-8610-47c2-a9de-7049c8506656:** ONCE Vitest Scenario-Based Testing
7. **818efdc0-3dd6-464f-9d77-7ea7523c89db:** ONCE v0.2.0.0 API Stability

**Expected Outcome:**
- Robust server instance management with automatic conflict resolution
- Scenario-driven configuration eliminating environment dependencies
- Hierarchical server discovery and coordination
- Stable CLI/API interface with enhanced kernel architecture
- Deterministic testing through scenario-based configurations

---

## Do

### 1. Current Architecture Analysis
**Examined ONCE v0.1.0.2 Structure:**
- **Layer 5 (CLI):** `ONCECLI.ts` handles commands, uses environment variables
- **Layer 3 (Core):** `ONCE.ts` interface, `DefaultONCE.ts` implementation  
- **Layer 2 (Management):** `ServerLifecycleManager.ts` manages server processes
- **Examples:** `server.mjs` serves HTTP/WebSocket, hardcoded ports
- **Current Issues:** Environment variable dependency, no server coordination

**Identified Key Components:**
- **LifecycleEvents.ts:** Defines states (CREATED → RUNNING → STOPPED)
- **Scenario.ts:** Hibernation format with UUID, objectType, version, state
- **ServerLifecycleManager:** Manages server start/stop, uses environment variables
- **Current Port Logic:** `PORT = process.env.PORT || 8080`

### 2. Requirements Creation Process
**Systematic Requirements Development:**
```
Component Context: ONCE/0.2.0.0 (new version)
Requirements Created: 7 comprehensive specifications
Coverage: Architecture, Hierarchy, Storage, CLI, Environment, Testing, Stability
```

**Requirements Framework:**
- **Architecture Foundation:** Port 42777, scenario generation, model specification
- **Operational Logic:** Server hierarchy, client-server registration, port negotiation
- **Data Management:** Organized scenario storage, domain-based organization
- **User Interface:** CLI enhancement, scenario file support
- **Technical Quality:** Environment elimination, scenario-based testing
- **Migration Safety:** API stability during architectural transition

### 3. New ONCE Model Specification
**Core Model Fields (from requirement 471d2d0a):**
```typescript
interface ONCEServerModel {
    pid: number;                    // Process ID
    state: LifecycleState;          // Current lifecycle state
    platform: EnvironmentInfo;      // Browser/Node/Worker detection
    domain: string;                 // Reverse domain (default: "local.once")
    host: string;                   // FQDN (e.g., "McDonges-3.fritz.box")
    ip: string;                     // Fallback: "127.0.0.1"
    capabilities: Array<{
        capability: string;         // "httpPort", "httpsPort", "wsPort"
        port: number;              // Actual port number
    }>;
}
```

### 4. Server Hierarchy Logic
**Port 42777 Primary Server:**
- First instance starts on port 42777
- Acts as name server for all subsequent instances
- Maintains registry of all server instances

**Client Server Registration:**
- Detect port 42777 in use → Start ONCE ns client
- Register with primary server at port 42777
- Receive assigned port starting from 8080
- Auto-increment on each conflict (8081, 8082...)

### 5. Scenario Storage Architecture
**Organized Directory Structure:**
```
/scenarios/
├── local.once/ONCE/0.2.0.0/server-uuid-1.scenario.json
├── com.ceruleancircle/MyApp/1.0.0/app-uuid-2.scenario.json  
└── org.web4/TestComponent/0.1.0/test-uuid-3.scenario.json
```

**Benefits:**
- **Namespace Isolation:** Domain prevents naming conflicts
- **Version Management:** Component versions tracked separately
- **Discovery:** Easy component finding by domain/version
- **Scalability:** Hierarchical structure supports large projects

---

## Check

### QA Feedback - Critical Decisions Required
**User Request (2025-08-30 UTC 04:28):**
> "if you need to decide critical things...ask QA."

**Critical Decision Points Identified:**

#### 1. Migration Strategy Decision
**Question for QA:** Should ONCE v0.2.0.0 be:
- **A) Parallel Implementation:** Keep 0.1.0.2 running, create 0.2.0.0 as new component
- **B) In-Place Upgrade:** Upgrade existing 0.1.0.2 to 0.2.0.0 directly
- **C) Gradual Migration:** Phase transition with compatibility layer

**Impact:** Affects development timeline, testing strategy, and user migration path

#### 2. Backward Compatibility Scope  
**Question for QA:** How long should we maintain 0.1.0.2 compatibility?
- **A) No Compatibility:** Clean break, users must upgrade
- **B) 6-Month Compatibility:** Maintain old interface for transition period
- **C) Permanent Compatibility:** Always support both architectures

**Impact:** Affects code complexity, maintenance burden, and user experience

#### 3. Default Domain Convention
**Question for QA:** What should be the default reverse domain pattern?
- **A) "local.once"** (as proposed)
- **B) Project-specific:** "local.web4articles" 
- **C) User-configurable:** Prompt during first startup
- **D) Machine-specific:** "local.hostname"

**Impact:** Affects scenario organization and multi-project coordination

#### 4. Port Range Strategy
**Question for QA:** When port 42777 is occupied, should fallback ports be:
- **A) Sequential from 8080:** 8080, 8081, 8082...
- **B) Sequential from 42778:** 42778, 42779, 42780...
- **C) Random available port:** Use OS assignment
- **D) User-configurable range:** Allow port range specification

**Impact:** Affects predictability, conflicts with other services, and debugging

#### 5. Testing Strategy During Transition
**Question for QA:** How should we handle existing tests during implementation?
- **A) Disable Current Tests:** Focus on new architecture only
- **B) Parallel Test Suites:** Maintain both 0.1.0.2 and 0.2.0.0 tests
- **C) Gradual Migration:** Convert tests one by one as architecture develops

**Impact:** Affects development confidence, regression detection, and delivery timeline

### Requirements Validation
**Created Requirements Review:**
- **✅ Comprehensive Coverage:** 7 requirements cover all major aspects
- **✅ Technical Specification:** Clear model definition and behavior
- **✅ User Experience:** Maintains CLI stability while enhancing kernel
- **✅ Testing Strategy:** Scenario-based approach eliminates environment issues
- **✅ Migration Path:** Considers API stability during transition

### Architecture Benefits Analysis
**Problem Resolution:**
- **✅ Address Conflicts:** Server hierarchy eliminates port conflicts
- **✅ Environment Independence:** Scenarios replace environment variables
- **✅ Test Reliability:** Deterministic configurations improve test stability  
- **✅ Server Discovery:** Name server enables instance coordination
- **✅ Scaling:** Hierarchical architecture supports multiple instances

---

## Act

### Major Architecture Enhancement Planned
**✅ ONCE Kernel v0.2.0.0 Requirements Complete:**
- **7 Comprehensive Requirements:** Cover architecture, hierarchy, storage, CLI, environment, testing, stability
- **Robust Server Management:** Port 42777 default with automatic conflict resolution
- **Scenario-Driven Configuration:** Eliminates environment variable dependencies
- **Hierarchical Storage:** Organized by domain/component/version for scalability
- **CLI Enhancement:** Supports scenario file loading for deterministic configurations

### Technical Architecture Decisions
**Server Hierarchy Model:**
- **Primary Server:** Port 42777 acts as name server and registry
- **Client Servers:** Auto-register with primary, receive assigned ports
- **Conflict Resolution:** Automatic port negotiation starting from 8080
- **Discovery Protocol:** All servers coordinate through primary instance

**Data Architecture:**
- **Scenario Format:** UUID, objectType, version, state (existing pattern)
- **Storage Organization:** `/scenarios/domain/component/version/uuid.json`
- **Model Enhancement:** pid, state, platform, domain, host, ip, capabilities
- **Zero Environment:** No external configuration dependencies

### Development Strategy
**Version 0.2.0.0 Implementation Approach:**
- **API Stability:** Existing `once demo`, `once start` commands unchanged
- **Kernel Enhancement:** Internal architecture completely redesigned
- **Migration Safety:** New version created alongside existing 0.1.0.2
- **Testing Revolution:** Scenario-based tests eliminate environment issues

### Critical QA Decisions Pending
**Awaiting QA Guidance on:**
1. **Migration Strategy:** Parallel vs in-place vs gradual approach
2. **Compatibility Timeline:** How long to maintain 0.1.0.2 support
3. **Domain Convention:** Default reverse domain naming pattern
4. **Port Strategy:** Fallback port range approach (8080+ vs 42778+ vs random)
5. **Testing Transition:** How to handle existing tests during development

### Next Actions Based on QA Decisions
- [ ] **Once QA Decides:** Implement chosen migration strategy
- [ ] **Architecture Implementation:** Create ONCE v0.2.0.0 directory structure
- [ ] **Kernel Development:** Implement server hierarchy and port management
- [ ] **Scenario System:** Build organized storage and loading mechanisms
- [ ] **CLI Enhancement:** Add scenario file support to existing commands
- [ ] **Test Migration:** Convert vitests to scenario-based approach
- [ ] **Documentation:** Update API docs maintaining stability promises

### PDCA Process Update
**Methodology Enhancement:**
- Real-world errors (address in use) drive architecture improvements
- Requirements creation before implementation ensures comprehensive planning
- QA decision points identified upfront prevent later architectural conflicts
- Version management strategy considers both technical and user experience aspects

### Problem-Solution Mapping
**Original Issue → Architecture Solution:**
- **"Address in use" error** → **Server hierarchy with port negotiation**
- **Environment variable brittleness** → **Scenario-based configuration**
- **Test unreliability** → **Deterministic test scenarios**
- **Server instance conflicts** → **Coordinated instance management**
- **Configuration complexity** → **Default port with automatic fallback**

**🎯 One-line Summary:** Created comprehensive ONCE kernel v0.2.0.0 architecture enhancement with 7 requirements covering port 42777 default, server hierarchy, scenario-based configuration, and environment variable elimination - awaiting QA decisions on critical migration and compatibility strategies! 🚀🔧✨
