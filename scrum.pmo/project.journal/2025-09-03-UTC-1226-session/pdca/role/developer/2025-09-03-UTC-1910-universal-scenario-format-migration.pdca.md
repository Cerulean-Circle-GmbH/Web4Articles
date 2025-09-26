# 📋 **PDCA Cycle: Universal Scenario Format Migration - All 0.3.x.x Components Compliance**

**🗓️ Date:** 2025-09-03-UTC-1910  
**🎯 Objective:** Apply new Web4 3-property scenario format universally to ALL 0.3.x.x components across the entire ecosystem  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Claude Developer → Web4 Architecture Implementation Specialist  
**👤 Agent Role:** Developer → Universal Scenario Format Migration & Ecosystem Compliance  
**👤 Branch:** dev/once → Universal 0.3.x.x Component Migration  
**🔄 Sync Requirements:** Scenario format compliance → Universal ecosystem migration  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Web4 Architecture Standardization & Universal Migration  
**🎯 Sprint:** Extended Session → Universal Scenario Format Migration Implementation  
**✅ Task:** ALL 0.3.x.x Components Scenario Format Compliance Migration  
**🚨 Issues:** Only ONCE 0.3.0.1 updated, ALL other 0.3.x.x components still use old format  

**📎 Previous Commit:** 2782bcca - Scenario Format Compliance SUCCESS: Project Root + UUIDv4 + Encrypted Owner + FQDN Host  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/2782bcca/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md) | [2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md](2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/2782bcca/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1910-universal-scenario-format-migration.pdca.md) | [2025-09-03-UTC-1910-universal-scenario-format-migration.pdca.md](2025-09-03-UTC-1910-universal-scenario-format-migration.pdca.md)
- **Universal Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/2782bcca/spec/requirements/d7f2a8c4-3e6b-4d9f-8a7c-5f1e9b3d2c8a.scenario.json) | [../../../../../spec/requirements/d7f2a8c4-3e6b-4d9f-8a7c-5f1e9b3d2c8a.scenario.json](../../../../../spec/requirements/d7f2a8c4-3e6b-4d9f-8a7c-5f1e9b3d2c8a.scenario.json)

### **QA Decisions**
- [ ] **Migration Scope Strategy**
  - a) Update all 0.3.x.x components immediately in parallel
  - b) Update components one by one with testing between each
- [ ] **Scenario Interface Updates**
  - a) Create new universal Scenario interface for 0.3.x.x
  - b) Update existing Scenario interfaces in each component
- [ ] **Backward Compatibility**
  - a) Maintain ability to load old scenario formats
  - b) Force migration to new format only
- [ ] **Implementation Pattern**
  - a) Copy ONCE 0.3.0.1 pattern to all components
  - b) Create shared scenario utility for all components

### **TRON Feedback (2025-09-03-UTC-1910)**
```quote
you do not understand what the decisions are for. they are NOT documentation.
you shall ask me before assuming!

did you apply the scenario changes in a way that all 0.3.x.x components are affected by it? thats the whole point here!
pdca
```

### **My Answer**
I understand now! QA decisions are for asking you to decide, not documentation. I only applied scenario format changes to ONCE 0.3.0.1, but the whole point is ALL 0.3.x.x components need this format. Created universal requirement d7f2a8c4-3e6b-4d9f-8a7c-5f1e9b3d2c8a for ecosystem-wide migration.

**Learning Applied:** New scenario format is architectural change for entire 0.3.x.x ecosystem, not just ONCE component.

---

## **📋 PLAN**

**Objective:** Apply new Web4 3-property scenario format to ALL 0.3.x.x components universally

**Current State Analysis:**
- ✅ **ONCE 0.3.0.1**: Updated with new scenario format
- ❌ **ONCE 0.3.0.0**: Still uses old format
- ❌ **Build 0.3.0.0**: Still uses old format  
- ❌ **Build 0.3.0.1**: Still uses old format
- ❌ **IOR 0.3.0.0**: Still uses old format
- ❌ **HttpServer 0.3.0.0**: Still uses old format
- ❌ **WsServer 0.3.0.0**: Still uses old format
- ❌ **P2PServer 0.3.0.0**: Still uses old format

**Affected Components Found:**
```bash
/workspace/components/ONCE/0.3.0.0
/workspace/components/Build/0.3.0.1
/workspace/components/Build/0.3.0.0
/workspace/components/P2PServer/0.3.0.0
/workspace/components/IOR/0.3.0.0
/workspace/components/WsServer/0.3.0.0
/workspace/components/HttpServer/0.3.0.0
```

**Universal Changes Needed:**
1. **UUIDv4 Generation**: Add generateUUID() method to all components
2. **Project Root Scenarios**: Change from component/scenarios/ to /workspace/scenarios/
3. **Encrypted Owner**: Use User component pattern with base64 encoding
4. **FQDN Host Resolution**: Network interface detection with localhost fallback
5. **Web4 3-Property Format**: ior, owner, model structure

---

## **🔧 DO**

### **Critical Understanding Gap Identified**

I made a fundamental error: I applied the scenario format changes ONLY to ONCE 0.3.0.1, but TRON's requirement is that ALL 0.3.x.x components must use the new format. This is the architectural reason for the 0.3.x.x version increment.

**Components Requiring Universal Migration:**
- ONCE/0.3.0.0 (not updated)
- Build/0.3.0.0 & 0.3.0.1 (not updated)
- IOR/0.3.0.0 (not updated)
- HttpServer/0.3.0.0 (not updated)
- WsServer/0.3.0.0 (not updated)
- P2PServer/0.3.0.0 (not updated)

**Pattern to Apply Universally:**
```typescript
// 1. UUIDv4 Generator (all components)
private generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 2. Project Root Scenario Saving (all components)
const scenarioDir = `/workspace/scenarios/domain/component/version/`;

// 3. Encrypted Owner (all components)
const encryptedOwner = Buffer.from(JSON.stringify(ownerObject)).toString('base64');

// 4. Web4 3-Property Format (all components)
const scenario = { ior: {...}, owner: encryptedOwner, model: {...} };
```

---

## **✅ CHECK**

**Migration Scope Verification:**
- ❌ **Current**: Only ONCE 0.3.0.1 has new scenario format
- ✅ **Required**: ALL 0.3.x.x components must have new scenario format
- ❌ **Gap**: 7+ components still using old scenario format

**Architectural Impact:**
- ✅ **New Format Reason**: This IS the reason for 0.3.x.x version increment
- ❌ **Ecosystem Consistency**: Components using different scenario formats
- ❌ **Interoperability**: Components cannot exchange scenarios properly

---

## **🎯 ACT**

**QUESTION FOR TRON:**

I understand the scope now - ALL 0.3.x.x components need the scenario format changes. Before proceeding with the universal migration:

**Migration Scope Strategy:**
- a) Update all 0.3.x.x components immediately in parallel
- b) Update components one by one with testing between each

**Scenario Interface Updates:**
- a) Create new universal Scenario interface for 0.3.x.x
- b) Update existing Scenario interfaces in each component

**Backward Compatibility:**
- a) Maintain ability to load old scenario formats
- b) Force migration to new format only

**Implementation Pattern:**
- a) Copy ONCE 0.3.0.1 pattern to all components
- b) Create shared scenario utility for all components

Which approach should I take for the universal 0.3.x.x ecosystem migration?

---

**📊 Universal scenario format migration scope identified - asking for direction before proceeding! 🌐📂❓**