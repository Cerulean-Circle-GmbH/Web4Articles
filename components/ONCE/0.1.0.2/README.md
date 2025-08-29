# ONCE - Object Network Communication Engine v0.1.0.0

## Overview

ONCE is the universal Web4ORB kernel that enables P2P distributed object communication across all platforms. It serves as the foundational infrastructure for the Web4 ecosystem, providing component lifecycle management, scenario exchange, and multi-platform deployment capabilities.

**"ONCE and FOR ALL"** - Universal kernel for all Web4 components

## Key Features

### 🌟 Universal Deployment
- Single codebase works across all platforms
- Browser, Node.js, Web Workers, Service Workers, PWA, iframe
- Automatic environment detection and adaptation
- < 100ms initialization, < 5MB footprint

### ⚡ Web4 Architecture Compliance
- Empty constructors with scenario-based initialization
- Internet Object References (IOR) for distributed objects
- Event-driven lifecycle with hooks at each transition
- Universal hibernation/restoration via scenarios

### 🔗 P2P Communication
- WebRTC-based peer discovery and communication
- Scenario exchange between ONCE kernels
- Distributed object network with automatic routing
- Fallback mechanisms for restricted environments

### 🎯 Component Lifecycle Management
- `startComponent()` - Initialize and start components
- `pauseComponent()` - Pause running components
- `resumeComponent()` - Resume paused components
- `stopComponent()` - Stop components cleanly
- `saveAsScenario()` - Hibernate component state
- `loadScenario()` - Restore component from scenario

## Installation

```bash
cd components/ONCE/0.1.0.0
npm install
npm run build
```

## Usage

### One-Line Import

```typescript
import { ONCE } from '@web4x/once';

// Initialize ONCE kernel
const once = await ONCE.init();

// Use ONCE capabilities
const env = once.getEnvironment();
console.log(`Running on: ${env.platform}`);
```

### Component Management

```typescript
// Create component IOR
const ior = DefaultIOR.create('MyComponent', 'uuid-here', 
  DefaultNetworkLocation.create('web4', 'localhost', 8080)
);

// Start component
const component = await once.startComponent(ior, scenario);

// Save component state
const savedScenario = await once.saveAsScenario(component);

// Load component from scenario
const restoredComponent = await once.loadScenario(savedScenario);
```

### Lifecycle Events

```typescript
// Register lifecycle hooks
once.registerLifecycleHooks(component, {
  beforeStart: async (event) => {
    console.log('Component starting...');
  },
  afterStart: async (event) => {
    console.log('Component started!');
  },
  onError: async (event) => {
    console.error('Error:', event.error);
  }
});

// Or use global event handlers
once.on(LifecycleEventType.AFTER_INIT, async (event) => {
  console.log('Component initialized:', event.component?.getName());
});
```

### P2P Communication

```typescript
// Connect to peer ONCE kernel
const peerIOR = new DefaultIOR().parse('web4://peer.example.com:8080/once/peer-uuid');
await once.connectPeer(peerIOR);

// Exchange scenarios
await once.exchangeScenario(peerIOR, myScenario);

// Discover components
const components = await once.discoverComponents({ 
  type: 'component',
  capabilities: ['web4-compliant'] 
});
```

## CLI Usage

```bash
# Show ONCE information
once info

# Show environment capabilities
once env

# Show performance metrics
once metrics

# Start a component
once start MyComponent 123e4567-e89b-12d3-a456-426614174000

# Discover components
once discover

# Connect to peer
once connect web4://peer.example.com:8080/once/456e7890-a12b-34c5-d678-901234567890
```

## Architecture

### Layer Structure
- **Layer 5 (CLI)**: Command-line interface
- **Layer 3 (Interfaces)**: ONCE, Component, Scenario, IOR, LifecycleEvents
- **Layer 2 (Implementation)**: DefaultONCE, ComponentRegistry, PeerManager, etc.

### Core Patterns
1. **Empty Constructor Pattern**: All classes use empty constructors
2. **Scenario Initialization**: Objects initialize from scenarios, not constructors
3. **Event-Driven Lifecycle**: Hooks at each state transition
4. **IOR References**: Network-aware object references

### Platform Detection
ONCE automatically detects and adapts to:
- Node.js (filesystem, network server capabilities)
- Browser (DOM, local storage, IndexedDB)
- Web Workers (parallel compute, message ports)
- Service Workers (fetch intercept, cache API)
- PWA (standalone mode, offline capabilities)
- iframe (sandboxed environment)

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Clean build
npm run clean
```

## Sprint 20/21 Requirements

This implementation fulfills the Sprint 20/21 requirements:
- ✅ ONCE kernel as singleton Web4ORB
- ✅ Empty constructors with scenario initialization
- ✅ Multi-platform deployment with single codebase
- ✅ Component lifecycle management APIs
- ✅ P2P scenario communication (WebRTC)
- ✅ < 100ms initialization performance
- ✅ Event-driven lifecycle with hooks
- ✅ IOR distributed object references

## Links

- **Sprint 20 Planning**: [TLA Implementation](../../../scrum.pmo/sprints/sprint-20/planning.md)
- **Sprint 21 Task**: [ONCE Kernel Foundation](../../../scrum.pmo/sprints/sprint-21/task-1-once-kernel-foundation.md)
- **Web4 Architecture**: [Web4 Principles](../../../docs/web4-architecture.md)

---

**Status**: Initial Implementation Complete  
**Version**: 0.1.0.0  
**Architecture**: 100% Web4 Compliant  
**Purpose**: Universal kernel for Web4 ecosystem

"ONCE and FOR ALL" - The foundation for all Web4 components 🚀