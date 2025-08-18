[← Back to Web4 First Principles](0_web4-first-principles.md) | [Overview](overview.md)

# Technical Architecture - Web4 First Principles

## Infrastructure Components

### [ONCE](../../Glossary.md/ONCE.md) Core Framework
**Location**: `Components/tla/EAM/layer1/Thinglish/Once/2.4.2/src/js/Once.class.js`

**Core Architecture**:
```javascript
class ONCE {
    static get implements() {
        return ['CoreFramework', 'InteroperabilityEngine'];
    }
    
    static async start() {
        // Core framework initialization
        // IOR (Internet Object Reference) management
        // Type descriptor system
        // Namespace management
    }
}
```

**Key Features**:
- **[Internet Object References (IOR)](../../Glossary.md/IOR.md)**: Unique identifiers for distributed communication
- **[Type Descriptors](../../Glossary.md/TypeDescriptor.md)**: Runtime type information and introspection capabilities
- **[Namespace Management](../../Glossary.md/Namespace.md)**: Hierarchical organization of classes and objects
- **Reflection System**: Runtime discovery of object capabilities

### [UCP](../../Glossary.md/UCP.md) Component Model
**Location**: `cerulean-circle-unlimited-2cu/cerulean-circle-unlimited-2cu/product/development/coast/eamducp-repository/ucp.md`

**[Component](../../Glossary.md/Component.md) Requirements**:
1. **Self-contained**: Everything in one unit, descriptor not in separate location
2. **Black-box**: No need to know internal implementation to use it
3. **[Interface](../../Glossary.md/Interface.md)**: Exposed typed interface semantic specifies possible interactions
4. **Self-description**: Machine-readable self-description through interface

**Fractal Architecture**:
- **Units**: Basic building blocks that don't fulfill all 4 qualities
- **Components**: Units that fulfill all 4 quality gates
- **Packages**: Components that only contain other Components
- **Self-Similar**: Same pattern repeats at different levels of abstraction

## Environment Configuration

### TypeScript Integration
**Requirements**:
- All code in strict TypeScript
- ES Modules only (no CommonJS)
- No standalone functions
- Static `start()` methods only

**Configuration Example**:
```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Component XML Descriptors
**Implementation**:
```xml
<link href="/EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once/2.4.2/src/js/Once.class.js" 
      rel="ucpComponent" type="text/html" />
```

**Location**: Found in `apps/woda/WODA.latest.html`, `apps/220/CityManagement.html`

## Layered Architecture

### Layer1: Core Framework (ONCE)
**Responsibilities**:
- Core framework functionality
- IOR management
- Type descriptor system
- Namespace management
- Reflection capabilities

**Components**:
- ONCE class implementation
- IOR creation and management
- Type descriptor system
- Namespace registry

### Layer2: Business Logic Implementations
**Responsibilities**:
- Domain-specific business logic
- Application-specific implementations
- Business rule enforcement
- Domain object management

**Components**:
- Domain-specific classes
- Business logic implementations
- Application-specific components

### Layer3: Interfaces and Contracts
**Responsibilities**:
- Interface definitions
- Contract specifications
- API definitions
- Service contracts

**Components**:
- Interface declarations
- Contract specifications
- API documentation
- Service definitions

### Layer4: Process Orchestration
**Responsibilities**:
- Process management
- Workflow orchestration
- Service coordination
- Event management

**Components**:
- Process managers
- Workflow engines
- Service coordinators
- Event handlers

### Layer5: User Interface & Experience
**Responsibilities**:
- User interface management
- User experience design
- Accessibility compliance
- Cross-platform compatibility

**Components**:
- UI components
- UX designers
- Accessibility validators
- Platform adapters

## Communication Architecture

### Particle/Wave Model
**Implementation**:
```javascript
// Particles represent data
class Particle {
    constructor(data) {
        this.data = data;
        this.timestamp = Date.now();
    }
}

// Waves represent communication
class Wave {
    constructor(event, target) {
        this.event = event;
        this.target = target;
        this.propagation = 'outward';
    }
}
```

**Location**: Found in ONCE Class implementation and Tech Roadmap

### Event-Driven Architecture
**Pattern**:
- All communication through events
- Event handlers process component logic
- Event propagation across components
- Loose coupling through events

**Implementation**:
```javascript
class EventHandler {
    static handle(event) {
        // Process event
        // Trigger appropriate handlers
        // Propagate to other components
    }
}
```

## Component Assembly

### Drag & Drop Component Assembly
**Implementation**:
```javascript
class DropSupport {
    async onDrop(event) {
        // Handles component assembly
        const component = await this.discoverSuitableClass(event.dataTransfer);
        await this.assembleComponent(component);
    }
    
    async discoverSuitableClass(dataTransfer) {
        // Finds appropriate component based on data
        return await this.findMatchingComponent(dataTransfer);
    }
}
```

**Location**: Found in ONCE Class implementation

### Component Discovery
**Implementation**:
```javascript
class Loader {
    static discover() {
        return this.type.implementations;
    }
    
    static load(componentName) {
        // Load component based on name
        // Validate interface implementation
        // Return instantiated component
    }
}
```

## Cross-Domain Interoperability

### Component Exchange
**Innovation**: First time domain objects can flow freely between different vendors

**Implementation**:
- Components can be exchanged between different company domains
- Drag & drop assembly across company boundaries
- Machine-readable component descriptions
- Interface-based compatibility checking

### Vendor Independence
**"Write ONCE, Deploy Anywhere"**:
- Vendor/language independent deployment
- Similar to Java's "Write Once, Run Anywhere" but for web components
- Components work across different vendor browsers
- Cross-domain component sharing

## Integration with EAMD.ucp

### Repository Structure
**EAMD.ucp Foundation**:
- "Enterprise Architecture Management Descriptors" - foundation for Web 4.0
- Technology agnostic architecture
- Supports any programming language or technology
- Enterprise-proven implementation

### Component Ecosystem
**Applications**:
- [WODA](../../Glossary.md/WODA.md): Main development environment
- [ONCE](../../Glossary.md/ONCE.md): Core framework
- 220: Community platform
- NEOM: Smart city platform
- DAL: Data access layer
- Gelicail: Content management
- SFS-RE: Real estate platform
- Shift: Network management

**[Components](../../Glossary.md/Component.md)**:
- TLA: The Last Architecture components
- Third-party: External integrations
- Custom: Project-specific components
- Domain: Business logic components

## Performance Considerations

### Runtime Performance
- **Type Checking**: Runtime type validation impact
- **Reflection**: Introspection capabilities overhead
- **Event Propagation**: Event-driven architecture performance
- **Component Loading**: Dynamic component discovery and loading

### Scalability Patterns
- **Component Reuse**: Shared component libraries
- **Layered Architecture**: Clear separation of concerns
- **Event-Driven**: Loose coupling for scalability
- **Fractal Design**: Self-similar patterns at different scales

## Configuration Management

### Environment Setup
1. **TypeScript Configuration**: Strict mode with ES modules
2. **Component Registry**: Component discovery and registration
3. **Namespace Configuration**: Hierarchical organization setup
4. **Interface Registry**: Interface definition and validation

### Deployment Configuration
1. **Component Descriptors**: XML-based component descriptions
2. **Cross-Domain Setup**: Interoperability configuration
3. **Security Configuration**: Privacy and access control setup
4. **Performance Tuning**: Runtime optimization settings

## Technology Stack

### Core Technologies
- **TypeScript**: Strict typing and ES modules
- **ONCE Framework**: Core interoperability engine
- **UCP Model**: Component architecture foundation
- **XML Descriptors**: Machine-readable component descriptions

### Development Tools
- **Component Registry**: Component discovery and management
- **Interface Validator**: Interface implementation checking
- **Type Descriptor System**: Runtime type information
- **Namespace Manager**: Hierarchical organization

### Integration Points
- **EAMD.ucp Repository**: Foundation architecture
- **Enterprise Systems**: CMMI Level 4 compliance
- **Cross-Domain Communication**: Vendor-independent deployment
- **Component Exchange**: Drag & drop assembly
