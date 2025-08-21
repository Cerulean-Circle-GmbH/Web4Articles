# PDCA: ONCE Web4ORB Kernel Architecture - P2P Object Network Communication Engine Foundation

**📎 Previous Commit:** 96afb05 (Sprint 21 Planning: Web4TSRanger v3.0 - Pure Web4 component navigation infrastructure from ground up)  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md) | [./2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md](./2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md)

**🗓️ Date:** 2025-08-20-UTC-1552  
**🎯 Objective:** Document ONCE (Object Network Communication Engine) as Web4ORB kernel for P2P object communication infrastructure  
**👤 Role:** Developer → Web4ORB Architecture Recognition  
**🚨 Issues:** TSRanger needs Web4ORB kernel for component instantiation, scenario management, and distributed communication  

---

## **📊 Summary**

**🎯 WEB4ORB KERNEL REVELATION**: ONCE (Object Network Communication Engine) is the fundamental Web4ORB kernel - a P2P distributed object communication infrastructure. Small kernel loadable in browser, Node.js, web workers, PWAs. TSRanger v3.0 built on ONCE for component discovery, instantiation, hibernation via scenario management. ONCE kernels communicate via scenario exchange for "com-unique-action".

### **🔗 Artifact Links**
- **Previous TSRanger v3.0 Vision:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md) | [./2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md](./2025-08-20-1552-tsranger-v3-web4-infrastructure-vision.md)
- **Sprint 21 Planning:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/sprints/sprint-21/planning.md) | [../../../sprints/sprint-21/planning.md](../../../sprints/sprint-21/planning.md)
- **IOR Distributed References:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-ior-distributed-object-references.md) | [./2025-08-20-1552-ior-distributed-object-references.md](./2025-08-20-1552-ior-distributed-object-references.md)

### **⚖️ QA Decisions**
- [x] **ONCE Kernel Recognition**: Web4ORB as fundamental P2P object communication engine
- [x] **Multi-Platform Deployment**: Browser, Node.js, web workers, service workers, PWA support
- [x] **TSRanger Foundation**: TSRanger v3.0 built on ONCE kernel for component management
- [x] **Scenario Management**: Component instantiation, hibernation via scenario persistence
- [x] **P2P Communication**: ONCE kernels exchange scenarios for distributed communication
- [ ] **Sprint 21 Update**: Add ONCE kernel development as foundation layer
- [ ] **Architecture Integration**: ONCE + TSRanger + Component ecosystem design
- [ ] **Implementation Strategy**: ONCE kernel development priority and approach

---

## **📝 Plan**

### **🎯 ONCE Web4ORB Kernel Architecture**

**FUNDAMENTAL INFRASTRUCTURE**:
```typescript
// ONCE: Object Network Communication Engine
// The Web4ORB kernel enabling all distributed object communication

interface ONCEKernel {
  // Core ORB functionality
  init(onceScenario: ONCEScenario): ONCEKernel;
  
  // Component lifecycle management
  startComponent(componentIOR: IOR): Promise<ComponentInstance>;
  createInstance(componentScenario: Scenario): Promise<ObjectInstance>;
  saveAsScenario(instance: ObjectInstance): Promise<Scenario>;
  loadScenario(scenarioIOR: IOR): Promise<Scenario>;
  
  // Environment discovery and adaptation
  discoverEnvironment(): Promise<EnvironmentInfo>;
  bootInEnvironment(env: EnvironmentInfo): Promise<void>;
  
  // P2P communication
  exchangeScenarioReferences(targetKernel: ONCEKernel): Promise<void>;
  communicateScenarios(scenarios: Scenario[]): Promise<CommunicationResult>;
  
  // Network formation
  joinObjectNetwork(): Promise<ObjectNetwork>;
  formP2PConnections(): Promise<PeerConnection[]>;
}
```

### **🏗️ Multi-Platform ONCE Deployment**

#### **Universal ONCE Kernel**
```typescript
// Single ONCE kernel deployable across all platforms
class ONCEKernel implements Web4ORB {
  constructor() {} // Empty constructor - Web4 principle
  
  init(onceScenario: ONCEScenario): ONCEKernel {
    // Environment-specific initialization
    this.environment = onceScenario.getTargetEnvironment();
    this.networkConfig = onceScenario.getNetworkConfiguration();
    this.componentRegistry = onceScenario.getComponentRegistryIORs();
    return this;
  }
  
  // Platform-agnostic component management
  async startComponent(componentIOR: IOR): Promise<ComponentInstance> {
    // 1. Resolve component scenario via IOR
    const componentScenario = await componentIOR.resolve();
    
    // 2. Create component instance from scenario
    const component = this.createComponentInstance(componentScenario.objectType);
    component.init(componentScenario);
    
    // 3. Register instance in local object network
    const instanceIOR = await this.registerInstance(component);
    
    return new ComponentInstance(component, instanceIOR);
  }
  
  async saveAsScenario(instance: ObjectInstance): Promise<Scenario> {
    // Hibernate object instance into scenario
    const scenario = instance.toScenario();
    
    // Persist scenario for network sharing
    const scenarioIOR = await this.persistScenario(scenario);
    scenario.setIOR(scenarioIOR);
    
    return scenario;
  }
}
```

#### **Platform-Specific ONCE Deployments**

**Browser Integration:**
```typescript
// Single line import in browser
import { ONCE } from './once-kernel.js';

const onceKernel = new ONCE();
onceKernel.init(browserONCEScenario);
await onceKernel.bootInEnvironment({ platform: 'browser' });
```

**Node.js Server:**
```typescript
// Node.js server deployment
import { ONCE } from 'once-kernel';

const onceKernel = new ONCE();
onceKernel.init(serverONCEScenario);
await onceKernel.bootInEnvironment({ platform: 'nodejs' });
await onceKernel.startServer(8080);
```

**Web Worker:**
```typescript
// Web Worker deployment
importScripts('./once-kernel.js');

const onceKernel = new ONCE();
onceKernel.init(workerONCEScenario);
await onceKernel.bootInEnvironment({ platform: 'webworker' });
```

**Progressive Web App:**
```typescript
// PWA Service Worker integration
import { ONCE } from './once-kernel.js';

self.addEventListener('install', async () => {
  const onceKernel = new ONCE();
  onceKernel.init(pwaONCEScenario);
  await onceKernel.bootInEnvironment({ platform: 'pwa' });
  await onceKernel.registerServiceWorkerComponents();
});
```

### **🔄 ONCE-Based TSRanger Architecture**

#### **TSRanger v3.0 on ONCE Foundation**
```typescript
// TSRanger v3.0 built on ONCE kernel
class Web4TSRanger implements TSRanger {
  private onceKernel: ONCEKernel;
  
  constructor() {} // Empty constructor
  
  init(tsrangerScenario: TSRangerScenario): TSRanger {
    // Initialize ONCE kernel foundation
    this.onceKernel = new ONCEKernel();
    this.onceKernel.init(tsrangerScenario.getONCEKernelScenario());
    
    // TSRanger-specific initialization
    this.navigationRules = tsrangerScenario.getNavigationRules();
    this.componentFilters = tsrangerScenario.getComponentFilters();
    
    return this;
  }
  
  // Component discovery via ONCE kernel
  async discoverComponents(filter?: ComponentFilter): Promise<ComponentNetwork> {
    // Discover components through ONCE kernel
    const componentIORs = await this.onceKernel.discoverComponents(filter);
    
    // Build component network via IOR resolution
    const components = await Promise.all(
      componentIORs.map(async ior => {
        const componentInstance = await this.onceKernel.startComponent(ior);
        return componentInstance;
      })
    );
    
    return new ComponentNetwork(components);
  }
  
  // Component instantiation via ONCE
  async instantiateComponent(componentIOR: IOR): Promise<ComponentInstance> {
    return await this.onceKernel.startComponent(componentIOR);
  }
  
  // Scenario hibernation via ONCE
  async hibernateComponent(instance: ComponentInstance): Promise<Scenario> {
    return await this.onceKernel.saveAsScenario(instance);
  }
  
  // Scenario restoration via ONCE
  async restoreFromScenario(scenarioIOR: IOR): Promise<ComponentInstance> {
    const scenario = await this.onceKernel.loadScenario(scenarioIOR);
    const component = this.createComponentFromScenario(scenario);
    return new ComponentInstance(component, scenarioIOR);
  }
}
```

#### **Component Lifecycle Management**
```typescript
// Complete component lifecycle through ONCE
interface ComponentLifecycle {
  // 1. Discovery
  discoverComponent(filter: ComponentFilter): Promise<IOR>;
  
  // 2. Instantiation  
  startComponent(componentIOR: IOR): Promise<ComponentInstance>;
  
  // 3. Execution
  executeComponent(instance: ComponentInstance): Promise<ExecutionResult>;
  
  // 4. Hibernation
  hibernateToScenario(instance: ComponentInstance): Promise<Scenario>;
  
  // 5. Restoration
  restoreFromScenario(scenarioIOR: IOR): Promise<ComponentInstance>;
  
  // 6. Communication
  communicateWithPeers(scenario: Scenario): Promise<CommunicationResult>;
}
```

---

## **🔧 Do**

### **📋 QA Feedback (Verbatim - 2025-08-20T15:52:00Z):**

> "obviously tsranger will have to start the components, create instances and save tem as scenarios and load scenarios to use them as parameters. to do tha tsranger needs an CCORBA ORB. an CORBA 4 Web4ORB. our orb will be a small P2P kernel loaded by one line of import in a browser as well as starting as a nodejs server as well as webworker, serviceworker, iframe and as a PWA (Progressive Web Aplication). the Corba 4 ORB kernel will be named ONCE, Object Network Communication Engine and create a P2P web4 Object Networ Communication Environment, that is itslef a component and dicovers its environment to boot there correctly. it will dicover components and load them via IORs and it will dicover Scenarios and instanciate them via IOR loading. TS Ranger 3 wil be based on ONCE to dicover, load start instanciate and hibernate component instances into scenarios. ONCE kenels will be able to excange scenario references and scenatrios to communicate with eaxch other...com-unique-action the resault of scenario communication and interaction."

### **🎯 ONCE Kernel Implementation Design**

#### **P2P Object Network Communication Environment**

**ONCE Core Architecture:**
```typescript
// ONCE as both component and communication engine
class ONCE implements Web4ORB, Component {
  constructor() {} // Empty constructor
  
  // Component interface - ONCE is itself a component
  init(onceScenario: ONCEScenario): ONCE {
    this.environmentDiscovery = onceScenario.getEnvironmentDiscovery();
    this.componentRegistry = onceScenario.getComponentRegistry();
    this.p2pNetwork = onceScenario.getP2PNetworkConfig();
    return this;
  }
  
  // Web4ORB interface - ORB functionality
  async startComponent(componentIOR: IOR): Promise<ComponentInstance> {
    // Start component via IOR resolution
    const componentScenario = await componentIOR.resolve();
    const component = this.instantiateFromScenario(componentScenario);
    return new ComponentInstance(component, componentIOR);
  }
  
  async saveAsScenario(instance: ObjectInstance): Promise<Scenario> {
    // Hibernate instance to scenario
    const scenario = instance.toScenario();
    await this.persistScenario(scenario);
    return scenario;
  }
  
  // Environment discovery and boot adaptation
  async discoverEnvironment(): Promise<EnvironmentInfo> {
    const env = new EnvironmentDiscovery();
    env.init(this.environmentDiscovery);
    return await env.analyze();
  }
  
  async bootInEnvironment(env: EnvironmentInfo): Promise<void> {
    switch (env.platform) {
      case 'browser':
        await this.bootBrowserMode();
        break;
      case 'nodejs':
        await this.bootNodeMode();
        break;
      case 'webworker':
        await this.bootWorkerMode();
        break;
      case 'pwa':
        await this.bootPWAMode();
        break;
    }
  }
}
```

#### **P2P Scenario Communication**

**Com-unique-action Pattern:**
```typescript
// Communication + Unique + Action = Scenario-based peer communication
interface ComUniqueAction {
  // Exchange scenario references between ONCE kernels
  exchangeReferences(peerKernel: ONCEKernel): Promise<ScenarioReference[]>;
  
  // Communicate scenarios for distributed coordination
  communicateScenarios(
    targetKernel: ONCEKernel, 
    scenarios: Scenario[]
  ): Promise<CommunicationResult>;
  
  // Execute unique actions based on scenario communication
  executeUniqueAction(
    communicationResult: CommunicationResult
  ): Promise<ActionResult>;
}

class P2PCommunicationEngine implements ComUniqueAction {
  constructor() {} // Empty constructor
  
  init(p2pScenario: P2PScenario): P2PCommunicationEngine {
    this.peerConnections = p2pScenario.getPeerConnections();
    this.communicationProtocols = p2pScenario.getProtocols();
    return this;
  }
  
  async communicateScenarios(
    targetKernel: ONCEKernel,
    scenarios: Scenario[]
  ): Promise<CommunicationResult> {
    // Establish P2P connection
    const connection = await this.establishConnection(targetKernel);
    
    // Exchange scenarios
    const exchangeResult = await connection.sendScenarios(scenarios);
    
    // Receive response scenarios
    const responseScenarios = await connection.receiveScenarios();
    
    return new CommunicationResult(exchangeResult, responseScenarios);
  }
  
  async executeUniqueAction(
    communicationResult: CommunicationResult
  ): Promise<ActionResult> {
    // Process received scenarios for unique actions
    const uniqueActions = this.analyzeForUniqueActions(
      communicationResult.responseScenarios
    );
    
    // Execute coordinated actions across network
    return await this.executeCoordinatedActions(uniqueActions);
  }
}
```

### **🔄 Multi-Platform Deployment Architecture**

#### **Universal ONCE Kernel Design**

**Single Codebase, Multi-Platform:**
```typescript
// Platform-agnostic ONCE kernel
class UniversalONCE {
  constructor() {} // Empty constructor
  
  init(deploymentScenario: DeploymentScenario): UniversalONCE {
    this.targetPlatform = deploymentScenario.getTargetPlatform();
    this.platformAdapter = this.createPlatformAdapter(this.targetPlatform);
    return this;
  }
  
  // Platform adaptation layer
  private createPlatformAdapter(platform: Platform): PlatformAdapter {
    switch (platform) {
      case 'browser': return new BrowserAdapter();
      case 'nodejs': return new NodeJSAdapter();  
      case 'webworker': return new WebWorkerAdapter();
      case 'serviceworker': return new ServiceWorkerAdapter();
      case 'pwa': return new PWAAdapter();
      case 'iframe': return new IFrameAdapter();
      default: throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
```

#### **Deployment Examples**

**Browser One-Line Import:**
```html
<script type="module">
  import { ONCE } from 'https://cdn.web4.dev/once-kernel/latest/once.js';
  
  const once = new ONCE();
  once.init(await fetch('/config/browser-once-scenario.json'));
  await once.bootInEnvironment({ platform: 'browser' });
  
  // ONCE kernel ready for component management
  globalThis.web4 = { once };
</script>
```

**Node.js Server:**
```typescript
import { ONCE } from 'once-kernel';

const once = new ONCE();
once.init(require('./config/server-once-scenario.json'));
await once.bootInEnvironment({ platform: 'nodejs', port: 8080 });

// Start TSRanger on ONCE foundation
const tsranger = new Web4TSRanger();
tsranger.init(once.getTSRangerScenario());
```

**Progressive Web App:**
```typescript
// service-worker.js
import { ONCE } from './lib/once-kernel.js';

const once = new ONCE();
once.init(pwaONCEScenario);
await once.bootInEnvironment({ platform: 'pwa' });

// Register PWA components via ONCE
await once.registerPWAComponents();
```

### **🔄 TSRanger-ONCE Integration**

#### **Component Management Flow**

**Complete Component Lifecycle:**
```typescript
// TSRanger using ONCE for all component operations
class TSRangerONCEIntegration {
  constructor() {} // Empty constructor
  
  init(integrationScenario: TSRangerONCEScenario): TSRangerONCEIntegration {
    this.once = new ONCE();
    this.once.init(integrationScenario.getONCEScenario());
    
    this.tsranger = new Web4TSRanger();
    this.tsranger.init(integrationScenario.getTSRangerScenario());
    
    return this;
  }
  
  // Complete workflow: discovery → instantiation → execution → hibernation
  async manageComponentWorkflow(workflowIOR: IOR): Promise<WorkflowResult> {
    // 1. Discover components via ONCE
    const componentIORs = await this.once.discoverComponents();
    
    // 2. Start required components via ONCE
    const componentInstances = await Promise.all(
      componentIORs.map(ior => this.once.startComponent(ior))
    );
    
    // 3. Navigate and coordinate via TSRanger
    const coordinationResult = await this.tsranger.coordinateComponents(
      componentInstances
    );
    
    // 4. Hibernate results via ONCE
    const scenarios = await Promise.all(
      componentInstances.map(instance => this.once.saveAsScenario(instance))
    );
    
    return new WorkflowResult(coordinationResult, scenarios);
  }
}
```

---

## **✅ Check**

### **📋 ONCE Kernel Architecture Validation**

**Web4ORB Foundation:**
- ✅ ONCE as fundamental Web4ORB kernel for distributed object communication
- ✅ P2P architecture enabling direct kernel-to-kernel scenario exchange
- ✅ Multi-platform deployment: browser, Node.js, web workers, PWA, service workers
- ✅ Component lifecycle management: discovery, instantiation, hibernation, restoration

**TSRanger Integration:**
- ✅ TSRanger v3.0 built on ONCE foundation for component navigation
- ✅ Component management through ONCE kernel APIs
- ✅ Scenario-based component persistence and restoration
- ✅ P2P communication for distributed component coordination

### **🎯 Architecture Benefits**

**Universal Deployment:**
1. **Single Codebase**: One ONCE kernel deployable across all platforms
2. **One-Line Integration**: Simple import/require for any environment
3. **Platform Adaptation**: Automatic environment discovery and optimization
4. **P2P Communication**: Direct kernel-to-kernel scenario exchange

**Component Ecosystem:**
1. **Unified Management**: ONCE handles all component lifecycle operations
2. **Scenario Persistence**: Component hibernation/restoration via scenarios
3. **IOR-Based Discovery**: Network-wide component location and instantiation
4. **Distributed Coordination**: Cross-kernel component collaboration

### **📊 Implementation Impact**

**Sprint 21 Update Required:**
- **ONCE Development Priority**: ONCE kernel as foundation layer
- **TSRanger Dependencies**: TSRanger built on ONCE infrastructure
- **Multi-Platform Testing**: Validate ONCE across all target platforms
- **P2P Communication**: Implement scenario exchange between kernels

---

## **⚡ Act**

### **🚀 Sprint 21 Architecture Update**

#### **Add EPIC 0: ONCE Kernel Foundation**
**Priority:** Highest - Foundation layer for all other EPICs

**[requirement:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890] - ONCE Web4ORB Kernel**
**As a** Web4 ecosystem requiring distributed object communication  
**I want** ONCE kernel as Web4ORB foundation with P2P scenario exchange  
**So that** all Web4 objects communicate through universal kernel infrastructure

**ONCE Kernel Architecture:**
- **Universal Deployment**: Single kernel for browser, Node.js, web workers, PWA
- **Component Lifecycle**: Discovery, instantiation, hibernation via scenario management
- **P2P Communication**: Kernel-to-kernel scenario exchange for distributed coordination
- **Environment Adaptation**: Auto-discovery and platform-specific optimization

#### **TSRanger-ONCE Integration**
```typescript
// TSRanger v3.0 foundation architecture
class Web4TSRanger extends ONCEComponent {
  constructor() {} // Empty constructor
  
  init(tsrangerScenario: TSRangerScenario): TSRanger {
    // Initialize on ONCE foundation
    super.init(tsrangerScenario.getONCEComponentScenario());
    
    // TSRanger-specific initialization
    this.navigationCapabilities = tsrangerScenario.getNavigationCapabilities();
    return this;
  }
}
```

### **🔄 Development Priority Update**

#### **Week 1: ONCE Foundation**
- **Days 1-4**: ONCE kernel development with multi-platform deployment
- **Days 5-7**: P2P communication and scenario exchange system

#### **Week 2: TSRanger Integration**  
- **Days 8-10**: TSRanger v3.0 built on ONCE foundation
- **Days 11-14**: Component ecosystem integration and testing

### **📋 Success Metrics Update**

#### **ONCE Kernel Validation**
- [ ] Single-line import deployment across all target platforms
- [ ] Component lifecycle management via ONCE APIs
- [ ] P2P scenario exchange between ONCE kernels
- [ ] Environment discovery and platform adaptation

#### **TSRanger-ONCE Integration**
- [ ] TSRanger v3.0 fully operational on ONCE foundation
- [ ] Component navigation via ONCE kernel services
- [ ] Distributed component coordination across P2P network
- [ ] Complete component hibernation/restoration workflow

---

## **💫 Developer Reflection**

### **🧠 Fundamental Architecture Recognition**

ONCE as the Web4ORB kernel represents the foundational infrastructure for all Web4 distributed object communication. TSRanger becomes a navigation layer built on this universal foundation.

### **🔄 P2P Communication Vision**

The "com-unique-action" concept - scenario-based communication between ONCE kernels creating unique coordinated actions across the distributed object network.

### **🎯 Implementation Strategy**

Sprint 21 must prioritize ONCE kernel development as the foundation layer, with TSRanger v3.0 built as an ONCE-based component navigation system.

---

**🎯 CONCLUSION**: ONCE (Object Network Communication Engine) is the fundamental Web4ORB kernel enabling P2P distributed object communication. TSRanger v3.0 built on ONCE foundation for component navigation infrastructure.

---

**📋 NEXT**: Update Sprint 21 with ONCE kernel development as highest priority foundation layer. Design TSRanger-ONCE integration architecture.
