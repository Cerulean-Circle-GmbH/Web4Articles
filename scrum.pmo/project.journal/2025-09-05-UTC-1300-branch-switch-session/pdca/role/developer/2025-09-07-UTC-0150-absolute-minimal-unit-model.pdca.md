# **PDCA Cycle: Absolute Minimal Unit Model - UUID Master Files with IOR-Only Filename Preservation**

**🗓️ Date:** 2025-09-07-UTC-0150  
**🎯 Objective:** Design absolute minimal unit model with uuid.master.ext files and filename preservation only in origin IOR  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Developer Role  
**👤 Agent Role:** Developer → Absolute Minimal Architecture and IOR-Based Filename Preservation  
**👤 Branch:** dev/once0304 → Absolute Minimal Unit Model  
**🔄 Sync Requirements:** N/A → Ultimate Minimalism Session  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Extended Development Work  
**🎯 Sprint:** Sprint 20/22 Integration → Absolute Minimal Unit Architecture  
**✅ Task:** Absolute Minimal Unit Model with IOR-Only Filename Preservation  
**🚨 Issues:** Need even more radical simplification with UUID-only master files and IOR-based filename preservation  

**📎 Previous Commit:** e92a38c3 - Sprint 22 Planning: Unit Foundation Sprint with Auto-Sync and Deduplication Framework  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0145-ultimate-file-based-unit-model.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0145-ultimate-file-based-unit-model.pdca.md](2025-09-07-UTC-0145-ultimate-file-based-unit-model.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md](2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md)
- **IOR Interface:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts) | [components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts](../../../components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts)
- **Scenario Interface:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) | [components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts](../../../components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts)

### **QA Decisions**
1a. **UUID-Only Master Files:** Store as literal "uuid.master.ext" without original filename
2b. **IOR-Only Filename Preservation:** Original filename preserved only in origin IOR URL
3c. **Type Implementation:** GitTextIOR implements IOR interface for type safety
4d. **Absolute Minimalism:** Ultimate Occam's Razor with IOR-based filename resolution

### **TRON Feedback (2025-09-07-UTC-0150)**
```quote
i would make it even simpler… the master file has literally "uuid".master.file extension the original filename is ONLY preseved in the origin "ior:url" 
while the type is of type ior and gitTextIor obviously implements ior.
```

### **My Answer**
Designing absolute minimal unit model with literal UUID.master.ext files and filename preservation exclusively in origin IOR. GitTextIOR implements IOR interface for type safety. Ultimate simplification where file system uses pure UUID naming and all semantic information preserved in IOR URLs only.

**Learning Applied:** Absolute minimalism achieves ultimate simplicity by eliminating all redundant filename information from file system, preserving semantics only in IOR URLs where they belong architecturally.

---

## **📋 PLAN**

**Objective:** Design absolute minimal unit model with UUID-only master files and IOR-based filename preservation

**Scope:**
- **UUID-Only Storage:** Master files named literally as "uuid.master.ext"
- **IOR Filename Preservation:** Original filenames preserved only in origin IOR URLs
- **Type Safety:** GitTextIOR implements IOR interface for proper type hierarchy
- **Absolute Minimalism:** Ultimate Occam's Razor with semantic information in IOR only

**Targets (metrics):**
- **Maximum Simplification:** File system uses pure UUID naming only
- **IOR Semantic Preservation:** All filename semantics in IOR URLs where they belong
- **Type Safety:** Proper IOR interface implementation with GitTextIOR
- **Ultimate Minimalism:** Zero redundant information in file system

**Acceptance Criteria:**
- [ ] Absolute minimal unit model designed with UUID-only master files
- [ ] IOR-based filename preservation with GitTextIOR implementing IOR
- [ ] Complete example with pure UUID file naming and IOR semantics
- [ ] Type safety maintained with proper interface implementation

---

## **🔧 DO**

### **Absolute Minimal Unit Architecture**

**Central Index Storage Structure (Ultimate Simplification):**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Unit metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts         # Pure UUID master file
```

**Key Innovation:**
- **Master File:** `uuid.master.ts` (pure UUID naming, extension only)
- **Filename Semantics:** Preserved ONLY in origin IOR URL
- **ln Links:** Point to UUID master, preserve original names in target locations
- **Ultimate Minimalism:** Zero redundant filename information in storage

### **Absolute Minimal UnitModel**

```typescript
export interface UnitModel extends Model {
  uuid: string;
  name: string;                     // Display name for unit
  origin: IOR;                      // ✅ IOR type (not string) - contains filename
  definition: IOR;                  // ✅ IOR type (not string) - contains definition
  typeM3: TypeM3;
  
  // UUID-based file storage
  indexPath: string;                // Path to uuid.scenario.json
  masterFile: string;               // Path to uuid.master.ext (NO original filename)
  
  // 🎯 ABSOLUTE MINIMAL: Reference tracking only
  references: UnitReference[];      // linkLocation + syncStatus
  
  createdAt: string;
  updatedAt: string;
}

// Base IOR interface
export interface IOR {
  uuid: string;
  component: string; 
  version: string;
  
  // ✅ FILENAME PRESERVED HERE (where it belongs)
  getFilename(): string;            // Extract filename from IOR
  getUrl(): string;                 // Get complete IOR URL
  getType(): string;                // Get IOR type (git, file, web, etc.)
}

// GitTextIOR implements IOR
export class GitTextIOR implements IOR {
  constructor(
    public uuid: string,
    public component: string,
    public version: string,
    public gitUrl: string,           // Contains filename semantics
    public startPos?: string,
    public endPos?: string
  ) {}
  
  getFilename(): string {
    // Extract filename from git URL
    const match = this.gitUrl.match(/\/([^\/]+)(?:#|$)/);
    return match?.[1] || 'unknown';
  }
  
  getUrl(): string {
    return `ior:git:text:${this.gitUrl}`;
  }
  
  getType(): string {
    return 'git:text';
  }
}

interface UnitReference {
  linkLocation: string;             // WHERE: Full path to ln link or copy
  syncStatus: SyncStatus;           // SYNC STATE: synced/outdated/broken
}
```

### **Absolute Minimal Example: ScenarioInterface Unit**

**Storage Structure:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts         # Pure UUID file
```

**a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json:**
```json
{
  "ior": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "component": "Unit",
    "version": "0.3.0.4"
  },
  "owner": "{\"user\":\"system\",\"hostname\":\"web4\",\"uuid\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"timestamp\":\"2025-09-07T01:50:00.000Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "ScenarioInterface",
    
    "origin": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4",
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-20:1",
      "startPos": "1:1",
      "endPos": "20:1"
    },
    
    "definition": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", 
      "component": "Unit",
      "version": "0.3.0.4",
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-20:1"
    },
    
    "typeM3": "ATTRIBUTE",
    "indexPath": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
    "masterFile": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts",
    
    "references": [
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
    
    "createdAt": "2025-09-07T01:50:00.000Z",
    "updatedAt": "2025-09-07T01:50:00.000Z"
  }
}
```

### **ln Link Structure with Name Preservation**

**File System Layout:**
```bash
# Master file (pure UUID naming)
/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts

# ln links (preserve original names in target locations)
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts 
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts

/workspace/components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts
```

### **IOR Type Hierarchy Implementation**

```typescript
// Base IOR interface
export interface IOR {
  uuid: string;
  component: string;
  version: string;
  getUrl(): string;                 // Complete IOR URL
  getFilename(): string;            // Extract filename from IOR
  getType(): string;                // IOR type identifier
}

// GitTextIOR implements IOR (type safety)
export class GitTextIOR implements IOR {
  constructor(
    public uuid: string,
    public component: string,
    public version: string,
    public gitUrl: string,           // ✅ FILENAME PRESERVED HERE ONLY
    public startPos?: string,
    public endPos?: string
  ) {}
  
  getFilename(): string {
    // Extract original filename from git URL (ONLY place it's preserved)
    const match = this.gitUrl.match(/\/([^\/]+\.(?:ts|js|md|json))(?:#|$)/);
    return match?.[1] || 'unknown';
  }
  
  getUrl(): string {
    return `ior:git:text:${this.gitUrl}`;
  }
  
  getType(): string {
    return 'git:text';
  }
}
```

### **Ultimate Simplification Benefits**

**Pure UUID Storage:**
- ✅ **File System:** Only UUID.master.ext (no semantic filename pollution)
- ✅ **Semantic Preservation:** Filename semantics in IOR URL only (where they belong)
- ✅ **Type Safety:** GitTextIOR implements IOR for proper type hierarchy
- ✅ **Name Resolution:** getFilename() extracts from IOR when needed

**Interface Deduplication Workflow:**
```bash
# 1. Create master from Unit's Scenario.interface.ts
unit create-master components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts
# → Creates: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts (pure UUID)
# → Origin IOR: "https://github.com/.../Scenario.interface.ts" (filename preserved)

# 2. Create ln links preserving names in target locations
ln -s ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts \
      components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts

# 3. Result: Clean separation
# - Storage: Pure UUID naming (a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts)
# - Usage: Semantic naming (Scenario.interface.ts)
# - Semantics: Preserved in IOR URL only
```

### **Filename Resolution System**

**When Filename Needed (Computed from IOR):**
```typescript
const getOriginalFilename = (unit: UnitModel): string => {
  // Extract from origin IOR (ONLY place it's preserved)
  if (unit.origin instanceof GitTextIOR) {
    return unit.origin.getFilename();  // "Scenario.interface.ts"
  }
  return 'unknown';
};

const createLnLink = (unit: UnitModel, targetLocation: string): void => {
  const originalName = unit.origin.getFilename();  // From IOR
  const masterFile = unit.masterFile;              // UUID.master.ts
  const targetPath = `${targetLocation}/${originalName}`;
  
  // ln link preserves semantic name while pointing to UUID master
  symlink(masterFile, targetPath);
};
```

### **Ultimate CLI Commands**

**Simplified Commands (IOR-Based Filename Resolution):**
```bash
# Core operations with IOR filename resolution
unit create-master <source-file>         # Create UUID.master.ext with IOR origin
unit link-to <uuid> <target-location>    # Create ln link with original name from IOR
unit sync-check <uuid>                   # Check sync status of all references
unit resolve-filename <uuid>             # Extract original filename from IOR

# Interface deduplication 
unit deduplicate <interface-path>        # Convert to UUID master + semantic ln links
```

**Example Usage:**
```bash
unit resolve-filename a1b2c3d4-e5f6-7890-abcd-ef1234567890
# Output: Scenario.interface.ts (extracted from origin IOR)

unit link-to a1b2c3d4-e5f6 components/DefaultCLI/0.3.0.4/src/ts/layer3/
# Creates: components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts 
# Points to: scenarios/index/.../a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts
```

---

## **✅ CHECK**

**Absolute Minimal Unit Model Verification:**

**Ultimate Simplification Achieved (✅)**
```
Master files use pure UUID naming: uuid.master.ext (zero semantic pollution)
Original filenames preserved ONLY in origin IOR URLs (proper architectural separation)
GitTextIOR implements IOR interface for type safety and filename resolution
ln links preserve semantic names in target locations while referencing UUID masters
```

**TRON QA Feedback Validation**
> **"the master file has literally 'uuid'.master.file extension the original filename is ONLY preseved in the origin 'ior:url' while the type is of type ior and gitTextIor obviously implements ior."**

**Architectural Perfection Confirmed (✅)**
- ✅ **Pure UUID Storage:** Master files named literally as "uuid.master.ext"
- ✅ **IOR-Only Semantics:** Filename preservation exclusively in origin IOR
- ✅ **Type Hierarchy:** GitTextIOR implements IOR for proper type safety
- ✅ **Semantic Separation:** File system = UUID, IOR = semantics (perfect separation)

**Benefits Analysis Verified (✅)**
```json
Storage: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts (pure UUID)
Semantics: origin.gitUrl contains "Scenario.interface.ts" (IOR-only preservation)
Usage: ln link named "Scenario.interface.ts" points to UUID master
Type Safety: GitTextIOR implements IOR with getFilename() method
```

---

## **💫 EMOTIONAL REFLECTION: ARCHITECTURAL PURITY AND ULTIMATE SEPARATION OF CONCERNS**

### **PURITY APPRECIATION:**
**TREMENDOUS** appreciation for TRON's architectural purity insight - separating UUID storage from semantic naming achieves perfect architectural separation of concerns.

### **MINIMALISM MASTERY:**
**PROFOUND** satisfaction in achieving absolute minimalism - file system handles storage with pure UUIDs, IOR handles semantics, perfect separation achieved.

### **TYPE SAFETY ELEGANCE:**
**SYSTEMATIC** confidence in the IOR interface implementation - GitTextIOR provides type safety while preserving semantic information where it architecturally belongs.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Template v3.1.4.2 compliance maintained for absolute minimal design
- ✅ **Architectural Purity:** Perfect separation of UUID storage and semantic information
- ✅ **Type Safety:** IOR interface with GitTextIOR implementation provides proper type hierarchy
- ✅ **Ultimate Occam's Razor:** Semantic information belongs in IOR, not file system

**Quality Impact:** Absolute minimal unit model achieves perfect architectural purity with UUID-only storage and IOR-based semantic preservation - ultimate separation of concerns.

**Next PDCA Focus:** Implement absolute minimal unit model and validate complete interface deduplication with pure UUID storage.

---

## **🎯 ACT**

**Immediate Results:**
- **✅ Absolute Minimalism:** Pure UUID.master.ext storage with IOR-only filename preservation
- **✅ Type Safety:** GitTextIOR implements IOR interface for proper type hierarchy
- **✅ Semantic Separation:** File system = UUID, IOR = semantics (perfect architectural separation)
- **✅ Ultimate Simplification:** Zero redundant filename information in storage

**Next Steps:**

**Absolute Minimal Implementation:**

**Phase 1: Interface Updates (IMMEDIATE)**
1. **Update IOR.interface.ts** with getFilename(), getUrl(), getType() methods
2. **Create GitTextIOR.ts** implementing IOR interface with filename extraction
3. **Update UnitModel.interface.ts** with IOR types for origin and definition

**Phase 2: Storage Implementation (HIGH PRIORITY)**
1. **Update DefaultUnit.ts** to create UUID.master.ext files
2. **Implement IOR-based filename resolution** for ln link creation
3. **Update storage methods** to use pure UUID file naming

**Phase 3: Interface Deduplication (STRATEGIC)**
1. **Test ScenarioInterface master creation** with pure UUID storage
2. **Create ln links** with semantic names pointing to UUID masters
3. **Validate TypeScript compilation** with ln linked UUID files

**Phase 4: Sync Management (OPERATIONAL)**
1. **Implement sync status detection** for UUID-based masters
2. **Add filename resolution** from IOR when needed
3. **Create verification tools** for ln link integrity with UUID masters

**Key Success Factors:**
1. **Architectural Purity:** Perfect separation of UUID storage and semantic information
2. **Type Safety:** IOR interface implementation with GitTextIOR for filename resolution
3. **Ultimate Minimalism:** File system handles storage, IOR handles semantics
4. **Name Preservation:** ln links maintain semantic names while referencing UUID masters

**Critical Insights:**
1. **Semantic information belongs in IOR, not file system** - perfect architectural separation
2. **Pure UUID storage eliminates filename pollution** while preserving functionality
3. **ln links provide semantic preservation** in target locations with UUID master references
4. **Type safety through IOR interface** enables proper filename resolution when needed

**Measurement and Success Metrics:**
- **Storage Purity:** 100% UUID-only master file naming
- **Semantic Preservation:** 100% filename semantics in IOR URLs only
- **Type Safety:** Complete IOR interface implementation with GitTextIOR
- **Architectural Separation:** Perfect separation of storage and semantics concerns

---

**🎯 Absolute minimal unit model with pure UUID.master.ext storage and IOR-only filename preservation achieves ultimate architectural purity!** 📋✅🔄

**"Always 4 2 (FOR TWO) - absolute minimalism through perfect separation of UUID storage and IOR semantics represents ultimate architectural elegance."** ⚡🎯📊