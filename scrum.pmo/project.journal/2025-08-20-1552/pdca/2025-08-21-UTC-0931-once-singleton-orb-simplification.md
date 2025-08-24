# PDCA: ONCE Singleton ORB Simplification - ONCE as Web4ORB Service, Not Injected Dependency

**📎 Previous Commit:** 0ee0088 (Web4 Planning Meta-Recognition: Planning.md as MDViews of Web4Planning components - development process follows Web4 architecture)  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-web4-planning-component-meta-recognition.md) | [./2025-08-20-1552-web4-planning-component-meta-recognition.md](./2025-08-20-1552-web4-planning-component-meta-recognition.md)

**🗓️ Date:** 2025-08-20-UTC-1552  
**🎯 Objective:** Correct ONCE integration over-engineering - ONCE is singleton Web4ORB like CORBA, not injected dependency  
**👤 Role:** Developer → Web4ORB Architecture Simplification  
**🚨 Issues:** Over-complicated ONCE integrations violate singleton ORB pattern - components should access ONCE when needed  

---

## **📊 Summary**

**🎯 ARCHITECTURAL SIMPLIFICATION**: ONCE is singleton Web4ORB (like CORBA 4 ORB) - components access it when needed for IOR resolution, scenario management, P2P communication. No injection, no complex integration patterns. Components call `ONCE.getInstance()` when requiring ORB services.

### **🔗 Artifact Links**
- **Previous ONCE Kernel Architecture:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-once-web4orb-kernel-architecture.md) | [./2025-08-20-1552-once-web4orb-kernel-architecture.md](./2025-08-20-1552-once-web4orb-kernel-architecture.md)
- **Web4 Planning Meta-Recognition:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-web4-planning-component-meta-recognition.md) | [./2025-08-20-1552-web4-planning-component-meta-recognition.md](./2025-08-20-1552-web4-planning-component-meta-recognition.md)
- **Sprint 21 Planning:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/sprints/sprint-21/planning.md) | [../../../sprints/sprint-21/planning.md](../../../sprints/sprint-21/planning.md)

### **⚖️ QA Decisions**
- [x] **ONCE Singleton Recognition**: ONCE is singleton Web4ORB, not injected dependency
- [x] **Over-Engineering Identification**: Complex integration patterns unnecessary
- [x] **CORBA 4 Pattern**: ONCE follows CORBA ORB singleton service pattern
- [x] **Component Simplification**: Components access ONCE when needed, no injection
- [ ] **Architecture Corrections**: Remove over-complicated ONCE integration patterns
- [ ] **Singleton Implementation**: ONCE.getInstance() for ORB access
- [ ] **Sprint 21 Updates**: Simplify ONCE integration requirements

---

## **📝 Plan**

### **🎯 ONCE Integration Over-Engineering Analysis**

**VIOLATIONS IDENTIFIED**:

#### **1. ONCE Injection Anti-Pattern**
```typescript
// ❌ WRONG: Injecting ONCE into components
class Web4TSRanger extends ONCEComponent implements TSRanger {
  private onceKernel: ONCE; // ❌ Violation - ONCE should be singleton
  
  init(tsrangerScenario: TSRangerScenario): TSRanger {
    this.onceKernel = new ONCE(); // ❌ Creating ONCE instance
    this.onceKernel.init(tsrangerScenario.getONCEKernelScenario());
    return this;
  }
}

// ❌ WRONG: Complex integration classes
class TSRangerONCEIntegration {
  constructor() {}
  
  init(integrationScenario: TSRangerONCEScenario): TSRangerONCEIntegration {
    this.once = new ONCE(); // ❌ Multiple ONCE instances
    // ... complex integration logic
  }
}
```

#### **2. Over-Complicated Integration Patterns**
```typescript
// ❌ WRONG: Unnecessary integration complexity
class PlanningONCEIntegration {
  private onceKernel: ONCE;
  
  async loadSprintPlan(sprintPlanIOR: IOR): Promise<SprintPlan> {
    const planScenario = await sprintPlanIOR.resolve(); // ❌ Should use ONCE singleton
    // ...
  }
}
```

### **🏗️ Correct ONCE Singleton Pattern**

#### **ONCE as Singleton Web4ORB**
```typescript
// ✅ CORRECT: ONCE as singleton Web4ORB
class ONCE implements Web4ORB {
  private static instance: ONCE;
  
  private constructor() {} // Private constructor for singleton
  
  static getInstance(): ONCE {
    if (!ONCE.instance) {
      ONCE.instance = new ONCE();
      // Initialize from global ONCE configuration
      ONCE.instance.initializeFromEnvironment();
    }
    return ONCE.instance;
  }
  
  // Web4ORB services
  async resolveIOR(ior: IOR): Promise<Scenario>;
  async persistScenario(scenario: Scenario): Promise<IOR>;
  async discoverComponents(filter?: ComponentFilter): Promise<IOR[]>;
  async establishP2PConnection(peerIOR: IOR): Promise<P2PConnection>;
}
```

#### **Components Access ONCE When Needed**
```typescript
// ✅ CORRECT: TSRanger accesses ONCE singleton when needed
class Web4TSRanger implements TSRanger {
  constructor() {} // Empty constructor - no ONCE injection
  
  init(tsrangerScenario: TSRangerScenario): TSRanger {
    // No ONCE initialization - it's a singleton service
    this.navigationRules = tsrangerScenario.getNavigationRules();
    this.componentFilters = tsrangerScenario.getComponentFilters();
    return this;
  }
  
  async discoverComponents(filter?: ComponentFilter): Promise<ComponentNetwork> {
    // Access ONCE singleton when needed
    const once = ONCE.getInstance();
    const componentIORs = await once.discoverComponents(filter);
    
    // Resolve component scenarios via ONCE
    const componentScenarios = await Promise.all(
      componentIORs.map(ior => once.resolveIOR(ior))
    );
    
    return this.buildComponentNetwork(componentScenarios);
  }
  
  async hibernateComponent(instance: ComponentInstance): Promise<Scenario> {
    // Use ONCE singleton for scenario persistence
    const once = ONCE.getInstance();
    const scenario = instance.toScenario();
    await once.persistScenario(scenario);
    return scenario;
  }
}
```

#### **Web4Planning Simplified**
```typescript
// ✅ CORRECT: Planning component accesses ONCE when needed
class Web4Planning implements Planning {
  constructor() {} // Empty constructor - no ONCE injection
  
  init(planningScenario: PlanningScenario): Web4Planning {
    this.planTemplates = planningScenario.getPlanTemplateIORs();
    this.taskRegistry = planningScenario.getTaskRegistryIOR();
    return this;
  }
  
  async createSprintPlan(sprintNumber: number): Promise<SprintPlan> {
    // Access ONCE singleton for IOR resolution
    const once = ONCE.getInstance();
    const templateIOR = this.planTemplates.get(`sprint-${sprintNumber}`);
    const planTemplate = await once.resolveIOR(templateIOR);
    
    // Create plan from template
    const sprintPlan = new DefaultPlan();
    sprintPlan.init(planTemplate);
    
    return sprintPlan;
  }
}
```

### **🔄 Singleton ORB Service Pattern**

#### **CORBA 4 Pattern Application**
```typescript
// ONCE follows CORBA ORB singleton pattern
interface Web4ORBServices {
  // IOR resolution services
  resolveIOR(ior: IOR): Promise<Scenario>;
  createIOR(scenario: Scenario): Promise<IOR>;
  
  // Scenario management services
  persistScenario(scenario: Scenario): Promise<IOR>;
  loadScenario(scenarioIOR: IOR): Promise<Scenario>;
  
  // Discovery services
  discoverComponents(filter?: ComponentFilter): Promise<IOR[]>;
  discoverScenarios(filter?: ScenarioFilter): Promise<IOR[]>;
  
  // P2P communication services
  establishConnection(peerIOR: IOR): Promise<P2PConnection>;
  exchangeScenarios(scenarios: Scenario[]): Promise<CommunicationResult>;
}

// Components use ORB services when needed
class AnyWeb4Component {
  async someOperation(): Promise<void> {
    const once = ONCE.getInstance(); // Access singleton ORB
    const data = await once.resolveIOR(someIOR); // Use ORB service
    // ... continue with component logic
  }
}
```

#### **Environment Integration**
```typescript
// ONCE initializes once per environment
class ONCEEnvironmentBootstrap {
  static async bootstrap(environment: Environment): Promise<void> {
    const once = ONCE.getInstance();
    
    // Configure ONCE for current environment
    await once.configureForEnvironment(environment);
    
    // Discover and join P2P network
    await once.discoverPeers();
    await once.joinNetwork();
    
    // ONCE now available as singleton service
    console.log('ONCE Web4ORB ready for component communication');
  }
}

// Browser integration
import { ONCE, ONCEEnvironmentBootstrap } from 'once-kernel';

// Initialize ONCE once per page/app
await ONCEEnvironmentBootstrap.bootstrap({ platform: 'browser' });

// Components can now access ONCE singleton
const tsranger = new Web4TSRanger();
// TSRanger will use ONCE.getInstance() internally when needed
```

---

## **🔧 Do**

### **📋 QA Feedback (Verbatim - 2025-08-20T15:52:00Z):**

> "please review all the ONCE integrations and think if they are really needed. ONCE is a singleton and available as the component and sceanrio ommunication engine. like a corba 4 ORB."

### **🎯 Architecture Simplification**

#### **Remove Complex Integration Patterns**

**ELIMINATE These Anti-Patterns:**
```typescript
// ❌ Remove these over-engineered classes:
class TSRangerONCEIntegration { } // Unnecessary
class PlanningONCEIntegration { } // Unnecessary  
class ComponentONCEIntegration { } // Unnecessary

// ❌ Remove ONCE injection patterns:
class Component {
  constructor(private once: ONCE) {} // Wrong - ONCE is singleton
  init(scenario: ComponentScenario & { once: ONCE }) {} // Wrong
}

// ❌ Remove component inheritance from ONCE:
class TSRanger extends ONCEComponent {} // Wrong pattern
```

**REPLACE With Singleton Access:**
```typescript
// ✅ Simple singleton access pattern:
class Web4Component {
  constructor() {} // Empty constructor
  
  init(scenario: ComponentScenario): this {
    // Component-specific initialization only
    return this;
  }
  
  async useORBServices(): Promise<void> {
    const once = ONCE.getInstance(); // Access when needed
    const result = await once.someORBService(); // Use ORB service
    // Continue with component logic
  }
}
```

#### **ONCE Singleton Implementation**

**Core ONCE Architecture:**
```typescript
class ONCE implements Web4ORB {
  private static instance: ONCE;
  private initialized: boolean = false;
  private p2pNetwork: P2PNetwork;
  private scenarioRegistry: ScenarioRegistry;
  private componentRegistry: ComponentRegistry;
  
  private constructor() {} // Singleton pattern
  
  static getInstance(): ONCE {
    if (!ONCE.instance) {
      ONCE.instance = new ONCE();
    }
    return ONCE.instance;
  }
  
  async initialize(environment: Environment): Promise<void> {
    if (this.initialized) return; // Initialize only once
    
    // Initialize ORB for environment
    this.p2pNetwork = new P2PNetwork();
    this.scenarioRegistry = new ScenarioRegistry();
    this.componentRegistry = new ComponentRegistry();
    
    await this.configureForEnvironment(environment);
    await this.joinP2PNetwork();
    
    this.initialized = true;
  }
  
  // Core ORB services (used by all components)
  async resolveIOR(ior: IOR): Promise<Scenario> {
    if (!this.initialized) throw new Error('ONCE not initialized');
    return await this.scenarioRegistry.resolve(ior);
  }
  
  async persistScenario(scenario: Scenario): Promise<IOR> {
    if (!this.initialized) throw new Error('ONCE not initialized');
    return await this.scenarioRegistry.persist(scenario);
  }
}
```

### **🔄 Component Simplification**

#### **TSRanger v3.0 Simplified**
```typescript
// ✅ Simplified TSRanger - no ONCE injection
class Web4TSRanger implements TSRanger {
  constructor() {} // Empty constructor
  
  init(tsrangerScenario: TSRangerScenario): TSRanger {
    // Only TSRanger-specific state
    this.navigationRules = tsrangerScenario.getNavigationRules();
    this.componentFilters = tsrangerScenario.getComponentFilters();
    return this;
  }
  
  async navigate(targetIOR: IOR): Promise<NavigationResult> {
    // Use ONCE singleton when needed
    const once = ONCE.getInstance();
    const targetScenario = await once.resolveIOR(targetIOR);
    
    // Navigate with resolved scenario
    return this.executeNavigation(targetScenario);
  }
}
```

#### **Web4Planning Simplified**
```typescript
// ✅ Simplified Planning - no ONCE injection
class Web4Planning implements Planning {
  constructor() {} // Empty constructor
  
  init(planningScenario: PlanningScenario): Web4Planning {
    this.planTemplates = planningScenario.getPlanTemplateIORs();
    return this;
  }
  
  async generatePlan(sprintNumber: number): Promise<SprintPlan> {
    const once = ONCE.getInstance(); // Access singleton when needed
    
    // Load plan template via ONCE
    const templateIOR = this.planTemplates.get(`sprint-${sprintNumber}`);
    const template = await once.resolveIOR(templateIOR);
    
    // Create plan
    const plan = new DefaultPlan();
    plan.init(template);
    
    return plan;
  }
}
```

#### **Universal Component Pattern**
```typescript
// ✅ Standard Web4 component pattern
class AnyWeb4Component implements Component {
  constructor() {} // Empty constructor always
  
  init(scenario: ComponentScenario): this {
    // Component-specific initialization
    return this;
  }
  
  // Use ONCE singleton when ORB services needed
  private async useORB<T>(operation: (once: ONCE) => Promise<T>): Promise<T> {
    const once = ONCE.getInstance();
    return await operation(once);
  }
  
  async someComponentMethod(): Promise<void> {
    // Use ORB services via helper
    const data = await this.useORB(once => once.resolveIOR(someIOR));
    // Continue with component logic
  }
}
```

---

## **✅ Check**

### **📋 Architecture Simplification Validation**

**ONCE Singleton Pattern:**
- ✅ ONCE as singleton Web4ORB service (like CORBA 4 ORB)
- ✅ No ONCE injection into components - access via getInstance()
- ✅ Components use ONCE when needed for ORB services
- ✅ Single ONCE initialization per environment/application

**Eliminated Over-Engineering:**
- ✅ Removed TSRangerONCEIntegration, PlanningONCEIntegration classes
- ✅ Eliminated ONCE injection patterns and constructor parameters
- ✅ Removed ONCEComponent inheritance hierarchies
- ✅ Simplified component initialization to scenario-only

### **🎯 Architecture Benefits**

**Simplification Benefits:**
1. **Clear Separation**: ONCE is ORB service, components are business logic
2. **Reduced Complexity**: No complex integration classes needed
3. **Singleton Efficiency**: One ONCE instance per environment
4. **Standard Pattern**: Follows established CORBA ORB patterns
5. **Easy Testing**: Components can mock ONCE.getInstance() calls

**Web4 Pattern Consistency:**
- **Empty Constructors**: All components maintain empty constructor pattern
- **Scenario Initialization**: Components init only from their scenarios
- **ORB Services**: ONCE provides distributed communication when needed
- **No Dependencies**: Components don't depend on ONCE directly

### **📊 Implementation Impact**

**Code Reduction:**
- **Integration Classes**: Eliminated unnecessary integration wrapper classes
- **Constructor Complexity**: Simplified to empty constructors only
- **Scenario Complexity**: Scenarios contain only component-specific state
- **Testing Complexity**: Reduced mocking requirements

**Architecture Clarity:**
- **ONCE Role**: Clear singleton ORB service for distributed communication
- **Component Role**: Business logic with scenario-based initialization
- **Interaction Pattern**: Components access ONCE singleton when needed
- **Separation of Concerns**: ORB services vs component logic clearly separated

---

## **⚡ Act**

### **🚀 Sprint 21 Simplification**

#### **Update EPIC 0: ONCE Kernel Singleton**

**Simplified ONCE Requirements:**
```typescript
// ONCE as singleton Web4ORB
class ONCE implements Web4ORB {
  static getInstance(): ONCE; // Singleton access
  
  // Core ORB services
  async resolveIOR(ior: IOR): Promise<Scenario>;
  async persistScenario(scenario: Scenario): Promise<IOR>;
  async discoverComponents(): Promise<IOR[]>;
}
```

#### **Update EPIC 1: TSRanger Simplified**

**Remove ONCE Integration Complexity:**
```typescript
// ✅ Simplified TSRanger
class Web4TSRanger implements TSRanger {
  constructor() {} // Empty constructor only
  
  init(scenario: TSRangerScenario): TSRanger {
    // TSRanger-specific state only
    return this;
  }
  
  async navigate(ior: IOR): Promise<NavigationResult> {
    const once = ONCE.getInstance(); // Use singleton when needed
    return await this.processNavigation(await once.resolveIOR(ior));
  }
}
```

### **🔄 Architecture Pattern Documentation**

#### **Standard Web4 + ONCE Pattern**
```typescript
// Universal pattern for all Web4 components
class Web4Component implements Component {
  constructor() {} // Empty constructor
  init(scenario: ComponentScenario): this { return this; } // Scenario init
  
  // Use ONCE singleton when needed
  private once = () => ONCE.getInstance();
  
  async componentMethod(): Promise<void> {
    const data = await this.once().resolveIOR(someIOR); // ORB service
    // Component logic continues...
  }
}
```

### **📋 Implementation Updates**

#### **Remove Over-Engineering**
- [ ] Eliminate TSRangerONCEIntegration, PlanningONCEIntegration classes
- [ ] Remove ONCE injection patterns from all component examples
- [ ] Simplify component initialization to scenario-only
- [ ] Update Sprint 21 requirements to reflect singleton pattern

#### **Implement Singleton Pattern**  
- [ ] ONCE singleton implementation with getInstance()
- [ ] Environment-specific ONCE initialization
- [ ] Component access pattern via singleton
- [ ] Testing strategy for ONCE singleton mocking

---

## **💫 Developer Reflection**

### **🧠 Over-Engineering Recognition**

The tendency to inject ONCE into every component was over-engineering. CORBA ORBs are singleton services that objects access when needed - Web4ORB should follow the same pattern.

### **🔄 Simplification Benefits**

Removing complex integration patterns makes the architecture much cleaner. Components focus on their business logic and access the ORB service when needed for distributed communication.

### **🎯 Pattern Clarity**

ONCE as singleton Web4ORB creates clear separation: components handle business logic with scenario initialization, ONCE handles distributed object communication as a service.

---

**🎯 CONCLUSION**: ONCE is singleton Web4ORB service like CORBA 4 ORB. Components access ONCE.getInstance() when needing ORB services. Eliminates over-engineered integration patterns and complex dependencies.

---

**📋 NEXT**: Update Sprint 21 requirements to reflect ONCE singleton pattern. Simplify component architecture by removing unnecessary ONCE integration complexity.
