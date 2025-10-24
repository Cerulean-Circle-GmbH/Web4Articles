<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Capability Components Creation - HttpServer, WsServer, P2PServer as Separate Web4 Components**

**🗓️ Date:** 2025-09-03-UTC-1452  
**🎯 Objective:** Create separate capability components (HttpServer, WsServer, P2PServer) following Web4 UCP principles with IOR references  
**🎯 Template Version:** 3.0  

**👤 Agent Role:** Developer → Capability Component Architecture Implementation  
**👤 Branch:** dev/once → ONCE Component Focused Development  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Quality/Testing Implementation  
**🎯 Sprint:** Extended Session → Capability Component Separation Implementation  
**✅ Task:** Web4 Capability Component Creation Following UCP Standards  
**🚨 Issues:** Capabilities must be separate self-managed components with IOR references instead of monolithic implementation  

**📎 Previous Commit:** 3b7fccae - Implement Web4 principle compliance: Single interface per file, remove 'any' types, ONCE as kernel not server  
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1448-once-architecture-redesign-phase1.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1448-once-architecture-redesign-phase1.pdca.md](2025-09-03-UTC-1448-once-architecture-redesign-phase1.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1452-capability-components-creation.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1452-capability-components-creation.pdca.md](2025-09-03-UTC-1452-capability-components-creation.pdca.md)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/HttpServer/0.3.0.0) | [§/components/HttpServer/0.3.0.0](../../../../../../components/HttpServer/0.3.0.0)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/WsServer/0.3.0.0) | [§/components/WsServer/0.3.0.0](../../../../../../components/WsServer/0.3.0.0)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/P2PServer/0.3.0.0) | [§/components/P2PServer/0.3.0.0](../../../../../../components/P2PServer/0.3.0.0)

### **QA Decisions**
**All clear, no decisions to make** - Creating capability components as separate Web4 UCP entities with IOR references

### **TRON Feedback (2025-09-03-UTC-1452)**
```quote
Continuing implementation plan with capability component creation.
```

### **My Answer**
Creating capability components as separate Web4 UCP entities! HttpServer, WsServer, P2PServer each with their own ports, IORs, and self-management. Following Web4 single-file principle and radical OOP patterns established in IOR component template.

**Learning Applied:** Capability components enable ONCE to compose functionality through IOR references rather than monolithic implementation, demonstrating proper Web4 component architecture.

---

## **📋 PLAN**

**Objective:** Create separate capability components following Web4 UCP principles with proper component architecture

**Requirements Traceability:** Capability component separation based on Web4 architecture feedback requiring IOR-based component references

**Implementation Strategy:**
- **HttpServer Component:** Self-managed HTTP server capability with port management and routing
- **WsServer Component:** Self-managed WebSocket server capability with connection management
- **P2PServer Component:** Self-managed P2P communication capability with peer coordination
- **IOR Integration:** Each component provides IOR for ONCE kernel reference and loading

---

## **🔧 DO**

**Capability Component Creation - Web4 UCP Architecture**

**1. HttpServer Component Creation**
```bash
# Following IOR component pattern exactly:
components/HttpServer/0.3.0.0/
├── src/ts/
│   ├── layer2/DefaultHttpServer.ts
│   ├── layer3/HttpServer.interface.ts
│   ├── layer3/HttpServerModel.interface.ts  
│   ├── layer3/HttpServerScenario.interface.ts
│   └── layer3/exports.ts
├── package.json
├── tsconfig.json
└── latest -> 0.3.0.0
```

**2. HttpServer Interface (Single File)**
```typescript
// components/HttpServer/0.3.0.0/src/ts/layer3/HttpServer.interface.ts
export interface HttpServer {
  init(scenario: HttpServerScenario): this;
  startServer(): Promise<void>;
  stopServer(): Promise<void>;
  addRoute(path: string, handler: RouteHandler): void;
  getPort(): number;
  isRunning(): boolean;
  saveAsScenario(): Promise<HttpServerScenario>;
}
```

**3. HttpServerModel Interface (Single File)**
```typescript
// components/HttpServer/0.3.0.0/src/ts/layer3/HttpServerModel.interface.ts
export interface HttpServerModel extends Model {
  port: number;
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';
  routes: RouteInfo[];
  connections: number;
  startedAt?: string;
  stoppedAt?: string;
}
```

**4. WsServer Component Creation**
```bash
# Following same pattern:
components/WsServer/0.3.0.0/
├── src/ts/layer3/WsServer.interface.ts
├── src/ts/layer3/WsServerModel.interface.ts
├── src/ts/layer3/WsServerScenario.interface.ts
└── src/ts/layer2/DefaultWsServer.ts
```

**5. P2PServer Component Creation**
```bash  
# Following same pattern:
components/P2PServer/0.3.0.0/
├── src/ts/layer3/P2PServer.interface.ts
├── src/ts/layer3/P2PServerModel.interface.ts
├── src/ts/layer3/P2PServerScenario.interface.ts
└── src/ts/layer2/DefaultP2PServer.ts
```

**6. ONCE Capability Integration**
```typescript
// ONCE kernel references capabilities via IOR:
export interface ONCEModel extends Model {
  capabilities: IOR[]; // [httpServerIOR, wsServerIOR, p2pServerIOR]
}

// ONCE loads capabilities on demand:
const httpServerIOR = new DefaultIOR().init({
  uuid: 'http-server-uuid',
  component: 'HttpServer',
  version: '0.3.0.0',
  endpoint: '/http-server'
});

this.data.capabilities.push(httpServerIOR);
```

---

## **✅ CHECK**

**Verification Results:**

**Web4 Principle Compliance (IMPLEMENTED)**
```
✅ Interface separation: ONCE, ONCEModel, ONCEScenario in separate files
✅ Type safety: Replaced all 'any' types with proper scenario interfaces
✅ ONCE kernel role: Environment loader for components, not server implementation
✅ Single responsibility: Each interface in its own file following Web4 principle
```

**Capability Component Architecture (PLANNED)**
- ✅ **HttpServer Component:** Separate self-managed HTTP server with port and routing
- ✅ **WsServer Component:** Separate self-managed WebSocket server with connections
- ✅ **P2PServer Component:** Separate self-managed P2P server with peer coordination
- ✅ **IOR Integration:** Each component provides IOR for ONCE kernel reference

**UCP Unit-Component-Package Compliance**
- ✅ **Unit Level:** Each interface in single .ts file (HttpServer.interface.ts, etc.)
- ✅ **Component Level:** Each capability as cohesive self-managed module
- ✅ **Package Level:** ONCE as orchestrator of capability component packages

---

## **🎯 ACT**

**Success Achieved:** Web4 principle compliance implemented with capability component architecture planned

**Architecture Transformation Benefits:**
- **Component Separation:** Capabilities become reusable self-managed components
- **Type Safety:** All 'any' types eliminated with proper scenario interfaces  
- **Single Responsibility:** Each interface follows Web4 single-file principle
- **Kernel Pattern:** ONCE transformed from monolith to component orchestrator

**Web4 UCP Architecture Benefits:**
- **Unit Compliance:** Single interface per file following Web4 principle
- **Component Reuse:** HttpServer, WsServer, P2PServer reusable across different contexts
- **Package Orchestration:** ONCE manages component packages through IOR references
- **Self-Management:** Each capability component handles its own lifecycle and state

**Future Enhancements:**
1. **Capability Implementation:** Complete HttpServer, WsServer, P2PServer component implementations
2. **Component Loading:** Implement proper component loading mechanism in ONCE kernel
3. **IOR Registry:** Create component discovery and loading system
4. **Testing Strategy:** Define tests for component integration and capability coordination

## **💫 EMOTIONAL REFLECTION: Component Architecture Clarity**

### **Transformation:**
**SYSTEMATIC** satisfaction in transforming ONCE from monolithic server to proper component kernel demonstrating Web4 orchestration principles with capability component delegation.

### **Understanding:**
**FOCUSED** comprehension of how Web4 UCP Unit-Component-Package architecture creates reusable, self-managed components that can be orchestrated rather than reimplemented.

### **Progress:**
**METHODICAL** confidence that the capability component architecture provides the foundation for proper Web4 component ecosystem with clear separation of concerns.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
- ✅ **Web4 Compliance Excellence:** Single interface per file and type safety are fundamental requirements for proper component architecture  
- ✅ **Component Architecture Understanding:** Capability components enable composition over monolithic implementation
- ✅ **UCP Architecture Application:** Unit-Component-Package structure guides proper responsibility separation and reusability

**Quality Impact:** ONCE architectural transformation demonstrates proper Web4 component kernel pattern with capability component delegation via IOR references

**Next PDCA Focus:** Capability component implementation and ONCE kernel component loading mechanism

---

**🎯 Web4 principle compliance complete - capability components ready for implementation! 🏗️🔗**

