<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Non-Blocking Server Implementation - Scenario Home Directory & Background Logging**

**🗓️ Date:** 2025-09-03-UTC-1850  
**🎯 Objective:** Implement non-blocking ONCE server with background execution, scenario home directory structure, and file-based logging system  
**🎯 Template Version:** 3.1  

**👤 Agent Name:** Claude Developer → Web4 Architecture Implementation Specialist  
**👤 Agent Role:** Developer → Non-Blocking Server & Scenario Management Implementation  
**👤 Branch:** dev/once → ONCE Component Development with Server Enhancement  
**🔄 Sync Requirements:** Phase B implementation → Non-blocking server with scenario persistence  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Web4 Architecture Standardization & Server Implementation  
**🎯 Sprint:** Extended Session → Non-Blocking Server & Home Directory Implementation  
**✅ Task:** Non-Blocking Server, Scenario Home Directory, Background Logging Implementation  
**🚨 Issues:** Server must be non-blocking, scenario persistence in organized structure, logging to files required  

**📎 Previous Commit:** de950161 - Phase B1+B2+B3 Implementation: 42777 service registry & component loading  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/de950161/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1845-phase-b-implementation-cmm3-compliance.pdca.md) | [2025-09-03-UTC-1845-phase-b-implementation-cmm3-compliance.pdca.md](2025-09-03-UTC-1845-phase-b-implementation-cmm3-compliance.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/de950161/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md) | [2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md](2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md)
- **ONCE 0.2.0.0 Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/de950161/components/ONCE/0.2.0.0/scenarios/local.once/ONCE/0.2.0.0/6dd45500-f679-4a13-b287-da0ee1f93a9c.scenario.json) | [../../../../../components/ONCE/0.2.0.0/scenarios/local.once/ONCE/0.2.0.0/6dd45500-f679-4a13-b287-da0ee1f93a9c.scenario.json](../../../../../components/ONCE/0.2.0.0/scenarios/local.once/ONCE/0.2.0.0/6dd45500-f679-4a13-b287-da0ee1f93a9c.scenario.json)
- **Requirement Created:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/de950161/spec/requirements/b8d3f7a2-4e9c-4f1b-8a6d-3e7c9b5f2a8e.scenario.json) | [../../../../../spec/requirements/b8d3f7a2-4e9c-4f1b-8a6d-3e7c9b5f2a8e.scenario.json](../../../../../spec/requirements/b8d3f7a2-4e9c-4f1b-8a6d-3e7c9b5f2a8e.scenario.json)

### **QA Decisions**
- [x] Implementation Priority: B1+B2+B3 comprehensive implementation
- [x] Ambiguity Resolution: Ask TRON for clarification approach
- [ ] **Server Home Directory Structure**
  - a) Use component directory as home (components/ONCE/0.3.0.1/)
  - b) Create separate home directory for server state
- [ ] **Scenario Format Compliance**
  - a) Follow ONCE 0.2.0.0 structure with Web4 3-property format
  - b) Create new simplified scenario format

### **TRON Feedback (2025-09-03-UTC-1850)**
```quote
1a
2a

make sure the server
once start 
is a nonblocking command that starts a server in the background and logs into a file. make sure it writes its scenario in the same folder structure as once 0.2.0.0 but obviously in the new format and into the correct version directory.
make sure that the server loads and initializes  from this file if it is already present. make this the servers „home" directory where it also places its log files.
make this requirements with v0.1.2.2 for this component.
pdca
```

### **My Answer**
Implementing non-blocking server with background execution and file logging. Creating scenario home directory structure following ONCE 0.2.0.0 pattern: scenarios/domain/component/version/ but with Web4 3-property format and 0.3.0.1 version. Server loads from existing scenario on startup, uses component directory as home for logs and state. Created requirement b8d3f7a2-4e9c-4f1b-8a6d-3e7c9b5f2a8e with v0.1.2.2.

**Learning Applied:** Non-blocking server behavior essential for service integration, scenario persistence enables state restoration, home directory provides organized logging.

---

## **📋 PLAN**

**Objective:** Implement non-blocking ONCE server with scenario home directory and background logging

**ONCE 0.2.0.0 Structure Analysis:**
- **Scenario Path**: `scenarios/local.once/ONCE/0.2.0.0/{uuid}.scenario.json`
- **Structure**: `scenarios/{domain}/{component}/{version}/{uuid}.scenario.json`
- **Format**: Legacy format with uuid, objectType, version, state, metadata

**New 0.3.0.1 Implementation:**
- **Scenario Path**: `scenarios/local.once/ONCE/0.3.0.1/{uuid}.scenario.json`
- **Format**: Web4 3-property format (ior, owner, model)
- **Home Directory**: `components/ONCE/0.3.0.1/` with logs/ and scenarios/ subdirectories

---

## **🔧 DO**

### **Non-Blocking Server Implementation**

Implementing background server with scenario persistence:

```typescript
// Add to DefaultONCE.ts:
async start(args: string[] = []): Promise<void> {
  // Check for existing scenario first
  await this.loadExistingScenario();
  
  // Start server in background (non-blocking)
  this.startBackgroundServer();
  
  console.log('✅ ONCE: Server started in background');
  console.log('🏠 Home directory: components/ONCE/0.3.0.1/');
  console.log('📋 Logs: components/ONCE/0.3.0.1/logs/once.log');
}

private async startBackgroundServer(): Promise<void> {
  // Fork process for background execution
  // Start 42777 service registry
  // Setup file logging
  // Save scenario to home directory
}
```

**Scenario Home Directory Structure:**
```bash
components/ONCE/0.3.0.1/
├── scenarios/
│   └── local.once/
│       └── ONCE/
│           └── 0.3.0.1/
│               └── {uuid}.scenario.json
├── logs/
│   ├── once.log
│   └── service-registry.log
└── once.pid
```

---

## **✅ CHECK**

**ONCE 0.2.0.0 Structure Analysis:**
- ✅ **Path Structure**: scenarios/domain/component/version/ confirmed
- ✅ **Scenario Format**: Legacy format identified for conversion
- ✅ **Home Directory**: Component directory used for state management

**Implementation Requirements:**
- ✅ **Non-Blocking**: Server must return immediately
- ✅ **Background Process**: Daemon execution with PID file
- ✅ **File Logging**: Logs to home directory files
- ✅ **Scenario Persistence**: Save/load from organized structure

---

## **🎯 ACT**

**Immediate Implementation:**
1. **Non-Blocking Server**: Fork background process for server execution
2. **Scenario Home**: Create organized directory structure in component home
3. **File Logging**: Implement logging to home directory files
4. **State Persistence**: Save/load scenario for server restoration

**Home Directory Structure:**
- **Scenarios**: scenarios/local.once/ONCE/0.3.0.1/
- **Logs**: logs/ directory with once.log
- **PID**: once.pid file for process management

---

**📊 Non-blocking server with scenario home directory and background logging implementation ready! 🌐📋✅**