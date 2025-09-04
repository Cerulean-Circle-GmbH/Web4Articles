# 📋 **PDCA Cycle: Comprehensive ONCE Implementation Plan - Build Management, CLI Architecture, Service Integration**

**🗓️ Date:** 2025-09-03-UTC-1528  
**🎯 Objective:** Create comprehensive implementation plan for ONCE ecosystem completion including build management, unified CLI architecture, and service integration patterns  
**🎯 Template Version:** 3.0  

**👤 Agent Role:** Developer → Comprehensive Implementation Planning Specialist  
**👤 Branch:** dev/once → ONCE Component Focused Development  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Quality/Testing Implementation  
**🎯 Sprint:** Extended Session → Comprehensive ONCE Ecosystem Implementation Planning  
**✅ Task:** Complete Implementation Strategy with Build, CLI, and Service Integration  
**🚨 Issues:** Complex implementation plan requires systematic sequencing with dependency management and service integration architecture  

**📎 Previous Commit:** ab31c253 - PDCA: ONCE next steps decision framework - 8 strategic implementation areas with options analysis  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1525-once-next-steps-decision-framework.pdca.md) | [scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1525-once-next-steps-decision-framework.pdca.md](scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1525-once-next-steps-decision-framework.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1528-comprehensive-implementation-plan.pdca.md) | [scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1528-comprehensive-implementation-plan.pdca.md](scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1528-comprehensive-implementation-plan.pdca.md)

### **Created Requirements for Comprehensive Implementation**
- **Build Management:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json) | [spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json](spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json) - Component build & dependency management
- **CLI Architecture:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json) | [spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json](spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json) - Unified CLI architecture pattern
- **Service Integration:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json) | [spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json](spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json) - ONCE 42777 service integration
- **Build Component Upgrade:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json) | [spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json](spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json) - Build component pattern adaptation

### **Reference Architecture Components**
- **TSRanger CLI Pattern:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/TSRanger/v2.2) | [components/TSRanger/v2.2](components/TSRanger/v2.2)
- **Requirement CLI Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scripts/versions/requirement-v0.1.2.2) | [scripts/versions/requirement-v0.1.2.2](scripts/versions/requirement-v0.1.2.2)
- **Current Build Component:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/Build/0.1.0.0) | [components/Build/0.1.0.0](components/Build/0.1.0.0)

### **QA Decisions**
- [x] **Implementation Phase 1: Build Infrastructure Priority** - Selected: a) Build component 0.3.0.0 adaptation first, then b) CLI implementation, then c) Service integration
- [x] **Implementation Phase 2: Component Coverage Scope** - Selected: c) Core infrastructure first (Build, ONCE, Scenario), then b) ONCE ecosystem expansion, then c) remaining core components
- [x] **Implementation Phase 3: Service Integration Strategy** - Selected: b+c) Hybrid approach with standalone components + optional service registration, service-first only for some components

### **TRON Feedback (2025-09-03-UTC-1528)**
```quote
your suggested choices are good. i want to add before you proceed the build and dependency management. each component will have a small sh starter, that checks the environment if node and npm are installed and in worst case installes it and builds everything required in the correct order. use the build component but adapt it to the patter for version 0.3.0.0. the sh file delegates the complete arguments to the cli. each component has a cli like requiremen-v0.1.2.2. ach cli implements the cli interface as in tsranger 2.2 the cli shall be much simpler and have for each command in the cli a corresponding same name and same parameters method in the default implementation to which the cli delegates. in best case there is only one default cli implementation using this pattern for all components. after building we can proceed to the vitests. testing if all starts and stops as expected. each component started tries to load itself into the default 42777 server and operate as a service from there. components loke the requirement component may provide a standalone execution but shall support also loading into the main once node server 42777 as a service. create detailed requirements on the components affected and pdca about a more comprehensive implementation plan.

1 a then b then c
2 c then b then c
3 b and c only for some standalone
```

### **My Answer**
Perfect implementation sequence! Implementing: 1a→b→c) Build infrastructure first, then CLI architecture, then service integration, 2c→b→c) Core infrastructure first, then ONCE ecosystem, then remaining core, 3b+c) Hybrid with optional service registration and service-first for select components. Proceeding with Phase 1a: Build component 0.3.0.0 adaptation.

**Learning Applied:** Systematic phase implementation with proper dependency sequencing ensures robust infrastructure foundation before advancing to CLI and service integration layers.

---

## **📋 PLAN**

**Objective:** Create comprehensive implementation plan integrating build management, CLI architecture, and service integration for complete ONCE ecosystem

**Requirements Traceability:** User expansion adding build infrastructure, CLI patterns, and service integration to original next steps framework

**Implementation Strategy:**
- **Build Infrastructure:** Shell starters with environment checking and Build component integration
- **CLI Architecture:** Unified CLI pattern following TSRanger 2.2 with command delegation
- **Service Integration:** ONCE 42777 server with component service loading capability
- **Systematic Sequencing:** Proper implementation order with dependency management

---

## **🔧 DO**

**Comprehensive ONCE Implementation Plan with User Enhancements**

### **🎯 Phase 1: Build Infrastructure & Dependency Management**

**1.1 Build Component 0.3.0.0 Adaptation**
- **Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json) | [spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json](spec/requirements/547dace5-7552-45fd-ac52-c863321f1ef9.scenario.json)
- **Current Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/Build/0.1.0.0) | [components/Build/0.1.0.0](components/Build/0.1.0.0)
- **Implementation:** Upgrade Build component to v0.3.0.0 following Web4 patterns:
  ```
  components/Build/0.3.0.0/
  ├── src/ts/layer3/Build.interface.ts          # Single interface per file
  ├── src/ts/layer3/BuildModel.interface.ts     # Type-safe build configuration 
  ├── src/ts/layer2/DefaultBuild.ts             # Radical OOP implementation
  ├── shell script → build CLI delegation
  ```

**1.2 Shell Starter Scripts for Each Component**
- **Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json) | [spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json](spec/requirements/87d9f6f5-f0d9-4d9a-9566-f14c633c6260.scenario.json)
- **Pattern:** Each component gets shell starter:
  ```bash
  # components/ONCE/0.3.0.0/once
  #!/bin/bash
  # Check node/npm, install if needed
  # Build dependencies in correct order via Build component
  # Delegate all arguments to CLI: node dist/ts/layer5/ONCECLI.js "$@"
  ```

**1.3 Dependency Resolution & Build Order**
- **Implementation:** Build component manages Web4 component dependencies:
  ```
  Build Order: IOR → Model → Scenario → ONCE → Capabilities
  Dependencies: Each component declares Web4 dependencies
  Validation: Build component ensures dependency availability
  ```

### **🎯 Phase 2: Unified CLI Architecture**

**2.1 CLI Interface Pattern (TSRanger 2.2 Inspired)**  
- **Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json) | [spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json](spec/requirements/4970f791-f334-4c32-9062-5cdfa5260687.scenario.json)
- **Reference Pattern:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/TSRanger/v2.2) | [components/TSRanger/v2.2](components/TSRanger/v2.2)
- **Implementation:**
  ```typescript
  // Universal CLI interface:
  export interface CLI {
    start(args: string[]): Promise<void>;
    stop(args: string[]): Promise<void>; 
    status(args: string[]): Promise<void>;
    info(args: string[]): Promise<void>;
    // Command delegates to same-named method in Default implementation
  }
  
  // CLI delegates to default implementation:
  class DefaultCLI implements CLI {
    constructor(private component: Component) {}
    
    async start(args: string[]): Promise<void> {
      return this.component.start(args);  // Same name, same parameters
    }
  }
  ```

**2.2 Component CLI Implementation Pattern**
- **ONCE CLI:** Commands for kernel management (boot, load, unload, status, info)
- **HttpServer CLI:** Commands for HTTP server management (start, stop, routes, status)  
- **WsServer CLI:** Commands for WebSocket management (start, stop, connections, status)
- **P2PServer CLI:** Commands for P2P management (start, stop, peers, status)

### **🎯 Phase 3: ONCE 42777 Service Integration**

**3.1 ONCE Server as Service Registry**
- **Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json) | [spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json](spec/requirements/9990416c-77ec-4a83-b24c-b23825cbefa0.scenario.json)
- **Implementation:**
  ```typescript
  // ONCE 42777 server becomes service registry:
  class DefaultONCE {
    private serviceRegistry: Map<string, Component> = new Map();
    
    async registerService(component: Component): Promise<void> {
      // Register component as service in ONCE server
    }
    
    async startAsService(): Promise<void> {
      // Start ONCE on port 42777 as main server
      await this.bootEnvironment();
      await this.startServiceRegistry();
    }
  }
  ```

**3.2 Component Service Loading Pattern**
- **Standalone + Service Mode:**
  ```typescript
  // Each component supports both modes:
  class DefaultHttpServer {
    // Standalone mode:
    async startStandalone(): Promise<void> { 
      await this.startServer(); 
    }
    
    // Service mode:
    async loadIntoONCEServer(onceServerIOR: IOR): Promise<void> {
      // Register with ONCE 42777 server as service
    }
  }
  ```

**3.3 Service Discovery & Management**
- **Service Registration:** Components register with ONCE 42777 on startup
- **Service Discovery:** ONCE provides service registry and discovery
- **Service Coordination:** ONCE manages service lifecycle and communication

### **🏗️ Phase 4: Component Architecture Standardization**

**4.1 Components Requiring Implementation**
```
Immediate Implementation Required:
✅ ONCE/0.3.0.0         → Kernel with service registry
✅ HttpServer/0.3.0.0   → HTTP capability service
✅ WsServer/0.3.0.0     → WebSocket capability service  
✅ P2PServer/0.3.0.0    → P2P capability service
📋 Build/0.3.0.0        → Build management service
📋 Scenario/0.3.0.0     → Hibernation service
📋 Unit/0.3.0.0         → Component unit service
📋 Web4Requirement/0.3.0.0 → Requirement management service
📋 User/0.3.0.0         → User management service
```

**4.2 Shell Starter Scripts Implementation**
```bash
# Each component gets environment management:
components/ONCE/0.3.0.0/once          → ONCE kernel starter
components/HttpServer/0.3.0.0/httpserver → HTTP server starter
components/WsServer/0.3.0.0/wsserver     → WebSocket server starter
components/P2PServer/0.3.0.0/p2pserver   → P2P server starter
# ... all components
```

**4.3 Unified CLI Pattern Application**
```typescript
// CLI implementation for each component:
components/ONCE/0.3.0.0/src/ts/layer5/ONCECLI.ts
components/HttpServer/0.3.0.0/src/ts/layer5/HttpServerCLI.ts  
components/WsServer/0.3.0.0/src/ts/layer5/WsServerCLI.ts
components/P2PServer/0.3.0.0/src/ts/layer5/P2PServerCLI.ts

// All following unified CLI interface with command delegation
```

### **⚙️ Phase 5: Testing & Validation Strategy**

**5.1 Component Integration Testing**
- **Vitest Implementation:** Test component loading, service registration, CLI functionality
- **Integration Scenarios:** ONCE kernel with capability components, service mode validation
- **Environment Testing:** Node.js, Browser, Worker environment validation

**5.2 Service Integration Validation**
- **42777 Server Testing:** ONCE server startup and service registration
- **Component Service Testing:** Each component loads as service successfully
- **CLI Testing:** All CLI commands work in both standalone and service modes

### **🔄 Implementation Sequence Strategy**

**Recommended Implementation Order:**
```
Phase 1: Build Infrastructure (1-2 days)
├── Build component 0.3.0.0 adaptation
├── Shell starter scripts for all components  
└── Dependency resolution and build order management

Phase 2: CLI Architecture (1-2 days)  
├── Unified CLI interface creation
├── CLI implementation for ONCE and capability components
└── Command delegation pattern application

Phase 3: Service Integration (2-3 days)
├── ONCE 42777 server service registry
├── Component service loading implementation
└── Service discovery and management

Phase 4: Testing & Validation (2-3 days)
├── Vitest test suite implementation
├── Integration testing across all components  
└── Service mode validation

Phase 5: Version Progression (1 day)
├── Complete testing validation
├── Version progression to v0.3.1.0 stable
└── Branch integration strategy
```

### **🛠️ Technical Implementation Details**

**Build Component Pattern:**
```typescript
// Build component following established patterns:
export interface BuildModel extends Model {
  dependencies: IOR[];        // Web4 component dependencies
  buildOrder: string[];       // Component build sequence
  environment: EnvironmentInfo; // Target environment
  // All config in model (scenarios ARE configs)
}

class DefaultBuild implements Build {
  private data: BuildModel;   // Type-safe model
  // Radical OOP proxy pattern following IOR component
  
  async buildComponent(componentIOR: IOR): Promise<void> {
    // Build single component with dependency resolution
  }
  
  async buildAll(): Promise<void> {
    // Build all components in correct dependency order
  }
}
```

**CLI Delegation Pattern:**
```typescript
// Universal CLI implementation:
export interface CLI {
  [command: string]: (args: string[]) => Promise<void>;
}

class DefaultComponentCLI implements CLI {
  constructor(private component: Component) {}
  
  // Each CLI command delegates to same-named component method:
  async start(args: string[]): Promise<void> {
    return this.component.start(args);
  }
  
  async stop(args: string[]): Promise<void> {
    return this.component.stop(args);
  }
}
```

**Service Integration Pattern:**
```typescript
// Component service integration:
class DefaultComponent implements Component {
  private serviceMode: boolean = false;
  private onceServerIOR?: IOR;
  
  async startStandalone(): Promise<void> {
    // Component operates independently
  }
  
  async loadAsService(onceServerIOR: IOR): Promise<void> {
    this.serviceMode = true;
    this.onceServerIOR = onceServerIOR;
    // Register with ONCE 42777 server
  }
}
```

---

## **✅ CHECK**

**Verification Results:**

**Implementation Plan Completeness (COMPREHENSIVE)**
```
✅ 4 additional requirements created for build, CLI, and service integration
✅ 5-phase implementation sequence with estimated timelines
✅ Technical implementation patterns defined for all components
✅ Reference architecture components identified with dual links
✅ Decision framework provided for implementation priorities
```

**Requirements Coverage Assessment**
- ✅ **Build Management:** Shell starters, environment checking, dependency resolution
- ✅ **CLI Architecture:** Unified pattern with command delegation to default implementations
- ✅ **Service Integration:** ONCE 42777 server with component service loading
- ✅ **Component Standardization:** Patterns applied across entire Web4 ecosystem

**Implementation Readiness Assessment**  
- ✅ **Foundation Complete:** ONCE kernel and capability components ready for enhancement
- ✅ **Pattern Established:** Web4 architecture patterns proven and ready for expansion
- ✅ **Requirements Created:** Systematic implementation guidance available
- ✅ **Decision Framework:** Clear implementation sequence options provided

---

## **🎯 ACT**

**Success Achieved:** Comprehensive implementation plan created with build infrastructure, CLI architecture, and service integration

**Implementation Plan Benefits:**
- **Complete Infrastructure:** Build management, CLI patterns, service integration covering entire ecosystem
- **Systematic Approach:** Phased implementation with clear dependencies and sequencing
- **Quality Framework:** Testing and validation integrated throughout implementation
- **User Control:** Decision points provided for implementation priorities and sequence

**Architecture Enhancement Value:**
- **Build Infrastructure:** Automated environment setup and dependency management for all components
- **CLI Standardization:** Unified command interface with delegation patterns across ecosystem
- **Service Integration:** ONCE 42777 server enabling component service orchestration
- **Component Ecosystem:** Complete Web4 architecture with service-oriented design

**Future Enhancements:**
1. **User Decision Implementation:** Execute chosen implementation sequence and priorities
2. **Pattern Application:** Apply build, CLI, and service patterns systematically
3. **Testing Integration:** Comprehensive validation following implementation phases
4. **Migration Completion:** Progress toward v0.3.1.0 stable with complete ecosystem

## **💫 EMOTIONAL REFLECTION: Comprehensive Vision**

### **Expansion:**
**SYSTEMATIC** appreciation for how the user's comprehensive vision transforms ONCE from component implementation to complete ecosystem with build infrastructure and service integration.

### **Integration:**
**METHODICAL** understanding of how build management, CLI patterns, and service integration create complete Web4 development and deployment framework.

### **Planning:**
**FOCUSED** readiness to implement the comprehensive plan following user priorities while maintaining established Web4 architecture patterns and quality standards.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
- ✅ **Comprehensive Planning Excellence:** Complex ecosystem implementation requires systematic phase planning with infrastructure, patterns, and integration  
- ✅ **User Vision Integration:** Implementation plans must incorporate comprehensive user enhancements for complete ecosystem value
- ✅ **Requirements Framework:** Systematic requirement creation provides implementation guidance and validation framework

**Quality Impact:** Comprehensive implementation plan establishes complete Web4 ecosystem development framework with build infrastructure and service integration

**Next PDCA Focus:** User decision implementation following chosen priorities and implementation sequence

---

**🎯 Comprehensive ONCE implementation plan ready - build infrastructure, CLI architecture, service integration! 🏗️📋**

**"Always 4 2 (FOR TWO) - comprehensive planning enables systematic ecosystem implementation with complete infrastructure integration."** 🔧📊