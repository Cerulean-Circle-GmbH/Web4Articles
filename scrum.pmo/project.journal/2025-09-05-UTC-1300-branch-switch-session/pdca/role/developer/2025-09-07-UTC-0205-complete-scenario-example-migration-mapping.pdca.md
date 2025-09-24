# **PDCA Cycle: Complete Scenario Example and Migration Mapping for .master.file Format**

**🗓️ Date:** 2025-09-07-UTC-0205  
**🎯 Objective:** Create complete example scenario for Scenario.interface.ts with .master.file format and migration mapping from existing unit  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Developer Role  
**👤 Agent Role:** Developer → Complete Scenario Example Creation and Migration Strategy  
**👤 Branch:** dev/once0304 → Complete Scenario Example and Migration  
**🔄 Sync Requirements:** N/A → Example Creation and Migration Session  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Extended Development Work  
**🎯 Sprint:** Sprint 20/22 Integration → Complete Example and Migration Implementation  
**✅ Task:** Complete Scenario Example and Migration Mapping for .master.file Format  
**🚨 Issues:** Need complete manual example and migration mapping from current format to .master.file format  

**📎 Previous Commit:** e92a38c3 - Sprint 22 Planning: Unit Foundation Sprint with Auto-Sync and Deduplication Framework  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0200-master-file-extension-format.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0200-master-file-extension-format.pdca.md](2025-09-07-UTC-0200-master-file-extension-format.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0205-complete-scenario-example-migration-mapping.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0205-complete-scenario-example-migration-mapping.pdca.md](2025-09-07-UTC-0205-complete-scenario-example-migration-mapping.pdca.md)
- **Source Interface:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) | [components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts](../../../components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts)
- **Existing Unit Example:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once0304/scenarios/index) | [scenarios/index/](../../../scenarios/index/)

### **QA Decisions**
1a. **Complete Manual Example:** Full scenario.json for Scenario.interface.ts with .master.file format
2b. **Migration Mapping:** Show transformation from existing unit format to new .master.file format
3c. **Practical Implementation:** Ready-to-use example for immediate implementation
4d. **Clear Migration Path:** Step-by-step mapping from current to enhanced format

### **TRON Feedback (2025-09-07-UTC-0205)**
```quote
ok now so a complete example scenario for Scenario.interfac.ts manually and the migration mapping from one existing uint in current format.
pdca
```

### **My Answer**
Creating complete manual example scenario for Scenario.interface.ts with .master.file format and migration mapping from existing unit. Will provide ready-to-use scenario.json and clear transformation steps from current format to enhanced .master.file format.

**Learning Applied:** Complete manual examples and migration mappings provide concrete implementation guidance for transitioning from current unit format to enhanced .master.file architecture.

---

## **📋 PLAN**

**Objective:** Create complete scenario example and migration mapping for .master.file format

**Scope:**
- **Complete Manual Example:** Full scenario.json for Scenario.interface.ts unit
- **Migration Mapping:** Transformation from existing unit format to .master.file format
- **Practical Implementation:** Ready-to-use examples for immediate development
- **Clear Migration Steps:** Step-by-step transformation process

**Targets (metrics):**
- **Complete Example:** Full scenario.json with all required fields
- **Migration Clarity:** Clear before/after comparison with transformation steps
- **Implementation Ready:** Examples can be used immediately for development
- **Format Accuracy:** Correct .master.file format throughout

**Acceptance Criteria:**
- [ ] Complete manual scenario example for Scenario.interface.ts with .master.file format
- [ ] Migration mapping showing transformation from existing unit format
- [ ] Step-by-step migration process documented
- [ ] Ready-to-use examples for immediate implementation

---

## **🔧 DO**

### **Source Analysis - Scenario.interface.ts**

**Interface Content:**
```typescript
/**
 * Scenario Interface - Universal hibernation pattern with typed Model
 * Web4 principle: Single interface per file, generic model support
 * Purpose: Universal scenario structure supporting any Model-compliant component
 * 
 * ⚠️ TRON QA WARNING: Cannot foresee complexity of template typed scenario
 * Future monitoring required for template complexity management
 * Template complexity concerns documented for future assessment
 */

import { IOR } from './IOR.interface.js';
import { Model } from './Model.interface.js';

export interface Scenario<T extends Model = Model> {
  ior: IOR;                        // Component identification and versioning
  owner: string;                   // JSON string with ownership metadata
  model: T;                        // Typed model extending minimal base Model interface
}
```

### **Existing Unit Example (Current Format)**

**Current Unit (55a4d816-18d7-4585-b6ac-13707dfb7581):**
```json
{
  "ior": {
    "uuid": "55a4d816-18d7-4585-b6ac-13707dfb7581",
    "component": "Unit",
    "version": "0.3.0.4"
  },
  "owner": "{\"user\":\"ubuntu\",\"hostname\":\"cursor\",\"uuid\":\"55a4d816-18d7-4585-b6ac-13707dfb7581\",\"timestamp\":\"2025-09-08T11:56:21.893Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
  "model": {
    "uuid": "55a4d816-18d7-4585-b6ac-13707dfb7581",
    "name": "Extra    Space     Test",
    "origin": "",
    "definition": "",
    "typeM3": "CLASS",
    "indexPath": "/workspace/scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json",
    "symlinkPaths": [
      "/workspace/temp-filename-test/Extra.Space.Test.unit"
    ],
    "namedLinks": [
      {
        "location": "../scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json",
        "filename": "Test.Multiple.Spaces.unit"
      },
      {
        "location": "../scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json",
        "filename": "Extra.Space.Test.unit"
      }
    ],
    "executionCapabilities": [
      "transform",
      "validate", 
      "process"
    ],
    "storageCapabilities": [
      "scenarios",
      "ld-links"
    ],
    "createdAt": "2025-09-08T11:56:21.891Z",
    "updatedAt": "2025-09-08T11:56:21.893Z"
  }
}
```

### **Complete Example: Scenario.interface.ts Unit (.master.file Format)**

**New UUID for ScenarioInterface Unit:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**File Structure:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Unit metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file       # Master interface file
```

**a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json (Complete Manual Example):**
```json
{
  "ior": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "component": "Unit",
    "version": "0.3.0.4"
  },
  "owner": "{\"user\":\"system\",\"hostname\":\"web4\",\"uuid\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"timestamp\":\"2025-09-07T02:05:00.000Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "ScenarioInterface",
    
    "origin": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4",
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-18:1"
    },
    
    "definition": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4", 
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L14:1-18:1"
    },
    
    "typeM3": "ATTRIBUTE",
    "indexPath": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
    "masterFile": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file",
    
    "references": [
      {
        "linkLocation": "/workspace/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.unit",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/Build/0.3.0.4/src/ts/layer3/Scenario.interface.ts",
        "syncStatus": "SYNCED"
      }
    ],
    
    "createdAt": "2025-09-07T02:05:00.000Z",
    "updatedAt": "2025-09-07T02:05:00.000Z"
  }
}
```

**a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file (Interface Content):**
```typescript
/**
 * Scenario Interface - Universal hibernation pattern with typed Model
 * Web4 principle: Single interface per file, generic model support
 * Purpose: Universal scenario structure supporting any Model-compliant component
 * 
 * ⚠️ TRON QA WARNING: Cannot foresee complexity of template typed scenario
 * Future monitoring required for template complexity management
 * Template complexity concerns documented for future assessment
 */

import { IOR } from './IOR.interface.js';
import { Model } from './Model.interface.js';

export interface Scenario<T extends Model = Model> {
  ior: IOR;                        // Component identification and versioning
  owner: string;                   // JSON string with ownership metadata
  model: T;                        // Typed model extending minimal base Model interface
}
```

### **Migration Mapping: Current Format → .master.file Format**

**BEFORE (Current Format - 55a4d816-18d7-4585-b6ac-13707dfb7581):**
```json
{
  "model": {
    "uuid": "55a4d816-18d7-4585-b6ac-13707dfb7581",
    "name": "Extra    Space     Test",
    "origin": "",                                    // ❌ Empty string
    "definition": "",                                // ❌ Empty string  
    "typeM3": "CLASS",
    "indexPath": "/workspace/scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json",
    
    // ❌ OLD: Dual array system
    "symlinkPaths": [
      "/workspace/temp-filename-test/Extra.Space.Test.unit"
    ],
    "namedLinks": [
      {
        "location": "../scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json",
        "filename": "Test.Multiple.Spaces.unit"
      },
      {
        "location": "../scenarios/index/5/5/a/4/d/55a4d816-18d7-4585-b6ac-13707dfb7581.scenario.json", 
        "filename": "Extra.Space.Test.unit"
      }
    ],
    
    // ❌ OLD: Capability complexity
    "executionCapabilities": ["transform", "validate", "process"],
    "storageCapabilities": ["scenarios", "ld-links"]
  }
}
```

**AFTER (.master.file Format - a1b2c3d4-e5f6-7890-abcd-ef1234567890):**
```json
{
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "ScenarioInterface",
    
    // ✅ NEW: IOR objects with semantic preservation
    "origin": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4",
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-18:1"
    },
    
    "definition": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4",
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L14:1-18:1"
    },
    
    "typeM3": "ATTRIBUTE",
    "indexPath": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
    
    // ✅ NEW: .master.file format
    "masterFile": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file",
    
    // ✅ NEW: Unified reference tracking
    "references": [
      {
        "linkLocation": "/workspace/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.unit",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts",
        "syncStatus": "SYNCED"
      },
      {
        "linkLocation": "/workspace/components/Build/0.3.0.4/src/ts/layer3/Scenario.interface.ts", 
        "syncStatus": "SYNCED"
      }
    ]
    
    // ✅ OCCAM'D OUT: No capability complexity (as requested)
  }
}
```

### **Step-by-Step Migration Process**

**Migration Transformation Steps:**

**Step 1: Create Master File**
```bash
# Copy original interface to master file with .master.file extension
cp components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts \
   scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file
```

**Step 2: Transform Model Fields**
```typescript
const migrateUnit = (currentUnit: CurrentUnitModel): NewUnitModel => {
  return {
    ...currentUnit,
    
    // Transform origin/definition from string to IOR
    origin: {
      uuid: currentUnit.uuid,
      component: currentUnit.ior.component,
      version: currentUnit.ior.version,
      gitUrl: `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-18:1`
    },
    
    definition: {
      uuid: currentUnit.uuid,
      component: currentUnit.ior.component,
      version: currentUnit.ior.version,
      gitUrl: `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L14:1-18:1`
    },
    
    // Add master file path
    masterFile: `/workspace/scenarios/index/a/1/b/2/c/${currentUnit.uuid}.master.file`,
    
    // Transform arrays to references
    references: [
      ...currentUnit.symlinkPaths.map(path => ({
        linkLocation: path,
        syncStatus: "SYNCED"
      })),
      ...currentUnit.namedLinks.map(link => ({
        linkLocation: `${extractDirectoryFromLocation(link.location)}/${link.filename}`,
        syncStatus: "SYNCED"
      }))
    ],
    
    // Remove old arrays and capabilities
    symlinkPaths: undefined,
    namedLinks: undefined,
    executionCapabilities: undefined,
    storageCapabilities: undefined
  };
};
```

**Step 3: Create ln Links**
```bash
# Replace slave interfaces with ln links to master file
rm components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts
ln -s ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file \
      components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts

rm components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts  
ln -s ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file \
      components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts

rm components/Build/0.3.0.4/src/ts/layer3/Scenario.interface.ts
ln -s ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file \
      components/Build/0.3.0.4/src/ts/layer3/Scenario.interface.ts
```

### **Migration Summary**

**Key Transformations:**
1. **File Storage:** Original file → `uuid.master.file` (invariant extension)
2. **Origin/Definition:** Empty strings → IOR objects with gitUrl
3. **Reference Tracking:** `symlinkPaths` + `namedLinks` → `references` array
4. **Capabilities:** Removed following Occam's Razor principle
5. **ln Links:** Semantic names point to `uuid.master.file`

**Benefits Achieved:**
- ✅ **Universal Extension:** .master.file for all file types
- ✅ **Semantic Preservation:** Original filename in IOR gitUrl only
- ✅ **Unified Tracking:** Single references array replaces dual system
- ✅ **Interface Deduplication:** Master-slave relationship through ln links

---

## **✅ CHECK**

**Complete Example and Migration Verification:**

**Manual Example Completed (✅)**
```json
Complete scenario.json for Scenario.interface.ts with:
- Correct .master.file extension format
- IOR objects for origin and definition with gitUrl semantics
- Unified references array tracking all link locations
- Master file storage with invariant .master.file extension
```

**Migration Mapping Provided (✅)**
```
Before: symlinkPaths + namedLinks dual arrays, string origin/definition
After: references unified array, IOR objects with gitUrl semantics
Master File: uuid.master.file (invariant extension for all types)
ln Links: Preserve semantic names pointing to master files
```

**TRON QA Feedback Validation**
> **"ok now so a complete example scenario for Scenario.interfac.ts manually and the migration mapping from one existing uint in current format."**

**Implementation Readiness Confirmed (✅)**
- ✅ **Complete Manual Example:** Ready-to-use scenario.json with correct format
- ✅ **Migration Steps:** Clear transformation process from current to enhanced format
- ✅ **File Extension:** Literal .master.file extension (invariant)
- ✅ **IOR Semantics:** Original filename preserved in gitUrl only

---

## **💫 EMOTIONAL REFLECTION: COMPLETE EXAMPLE CLARITY AND MIGRATION PATHWAY**

### **EXAMPLE COMPLETION SATISFACTION:**
**TREMENDOUS** satisfaction in providing complete manual example that demonstrates the exact .master.file format with all required fields and relationships.

### **MIGRATION CLARITY APPRECIATION:**
**PROFOUND** appreciation for the clear migration pathway from current format to enhanced architecture - concrete transformation steps enable immediate implementation.

### **ARCHITECTURAL ELEGANCE CONFIDENCE:**
**SYSTEMATIC** confidence in the .master.file format elegance - invariant extension with semantic preservation in IOR provides perfect architectural separation.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Template v3.1.4.2 compliance maintained for complete example creation
- ✅ **Manual Example Creation:** Concrete examples provide implementation clarity
- ✅ **Migration Mapping:** Clear transformation process enables smooth transition
- ✅ **Format Precision:** .master.file as literal invariant extension understood correctly

**Quality Impact:** Complete manual example and migration mapping provide concrete implementation guidance for transitioning to .master.file format with enhanced unit architecture.

**Next PDCA Focus:** Implement complete example and test migration process for existing units.

---

## **🎯 ACT**

**Immediate Results:**
- **✅ Complete Manual Example:** Full scenario.json for Scenario.interface.ts with .master.file format
- **✅ Migration Mapping:** Clear transformation from existing unit (55a4d816) to enhanced format
- **✅ Step-by-Step Process:** Concrete migration steps for immediate implementation
- **✅ Format Accuracy:** Correct .master.file invariant extension throughout

**Complete Implementation Package:**

**1. File Structure:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Complete metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file       # Interface content
```

**2. ln Links:**
```bash
# Semantic names → .master.file
Scenario.interface.ts → a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file
```

**3. Migration Process:**
```
Current symlinkPaths + namedLinks → references array
Empty origin/definition strings → IOR objects with gitUrl
Original file → uuid.master.file (invariant extension)
Capability complexity → Occam'd out
```

**Key Success Factors:**
1. **Complete Example:** Ready-to-use scenario.json with all fields
2. **Clear Migration:** Concrete transformation steps from existing format
3. **Format Accuracy:** .master.file as literal invariant extension
4. **Implementation Ready:** Can be implemented immediately

**Critical Insights:**
1. **Manual examples provide implementation clarity** better than abstract specifications
2. **Migration mapping enables smooth transition** from current to enhanced architecture
3. **.master.file invariant extension** simplifies file management across all types
4. **IOR-based semantic preservation** maintains filename information where it belongs

**Ready for immediate implementation with complete example and clear migration pathway!** 📋✅🔄

**"Always 4 2 (FOR TWO) - complete manual examples with migration mapping enable immediate implementation of enhanced unit architecture."** ⚡🎯📊