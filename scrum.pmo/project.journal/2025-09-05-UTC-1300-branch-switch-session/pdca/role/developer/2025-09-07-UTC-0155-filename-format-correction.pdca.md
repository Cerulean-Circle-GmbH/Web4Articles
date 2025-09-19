# **PDCA Cycle: Filename Format Correction - Literal UUID.master.ext Without Quote Modifications**

**🗓️ Date:** 2025-09-07-UTC-0155  
**🎯 Objective:** Correct filename format to literal UUID.master.ext without modifying text in quotes  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Developer Role  
**👤 Agent Role:** Developer → Filename Format Specification and Correction  
**👤 Branch:** dev/once0304 → Filename Format Correction  
**🔄 Sync Requirements:** N/A → Format Correction Session  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Extended Development Work  
**🎯 Sprint:** Sprint 20/22 Integration → Filename Format Specification  
**✅ Task:** Correct Filename Format to Literal UUID.master.ext  
**🚨 Issues:** Need to clarify that UUID.master.ext is literal format, not placeholder text modification  

**📎 Previous Commit:** e92a38c3 - Sprint 22 Planning: Unit Foundation Sprint with Auto-Sync and Deduplication Framework  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md](2025-09-07-UTC-0150-absolute-minimal-unit-model.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0155-filename-format-correction.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0155-filename-format-correction.pdca.md](2025-09-07-UTC-0155-filename-format-correction.pdca.md)

### **QA Decisions**
1a. **Literal Format:** UUID.master.ext is exact literal format (not placeholder for modification)
2b. **No Quote Changes:** Text in quotes remains unchanged (preserve original content)
3c. **Extension Preservation:** Original file extension preserved in master file name
4d. **Format Specification:** Clear documentation of literal UUID.master.ext naming

### **TRON Feedback (2025-09-07-UTC-0155)**
```quote
yes, but unit.'master.file' do not change things in 'quotes'
```

### **My Answer**
Correcting filename format specification to literal UUID.master.ext without modifying quoted text. The format is exactly as written - UUID followed by .master. followed by original file extension, preserving original content in quotes unchanged.

**Learning Applied:** Filename format is literal specification, not template for text modification - UUID.master.ext means exactly that format with original extension preserved.

---

## **📋 PLAN**

**Objective:** Clarify and correct filename format to literal UUID.master.ext specification

**Scope:**
- **Format Clarification:** UUID.master.ext is literal format, not placeholder
- **Quote Preservation:** All quoted text remains unchanged
- **Extension Handling:** Original file extension preserved in master filename
- **Clear Examples:** Concrete examples with actual UUIDs and extensions

**Targets (metrics):**
- **Format Clarity:** Unambiguous specification of literal filename format
- **Example Accuracy:** Real examples showing exact naming convention
- **Quote Preservation:** No modification of quoted content
- **Implementation Readiness:** Clear specification for development implementation

**Acceptance Criteria:**
- [ ] Filename format corrected to literal UUID.master.ext specification
- [ ] Clear examples with actual UUIDs and file extensions
- [ ] Quoted text preserved without modification
- [ ] Unambiguous format specification for implementation

---

## **🔧 DO**

### **Filename Format Correction**

**❌ INCORRECT INTERPRETATION (Previous):**
```
"uuid.master.originalname.ext"  // Wrong - implied filename insertion
```

**✅ CORRECT LITERAL FORMAT:**
```
UUID.master.ext                 // Literal format - exact as written
```

### **Concrete Examples with Real UUIDs**

**ScenarioInterface Master File:**
```
Original: Scenario.interface.ts
UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Master: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts
```

**IORInterface Master File:**
```
Original: IOR.interface.ts  
UUID: b2c3d4e5-f6g7-8901-bcde-fg2345678901
Master: b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.ts
```

**TypeM3Enum Master File:**
```
Original: TypeM3.enum.ts
UUID: c3d4e5f6-g7h8-9012-cdef-gh3456789012  
Master: c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.ts
```

### **Storage Structure (Corrected)**

**Central Index Layout:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Unit metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts         # Master file (literal format)

scenarios/index/b/2/c/3/d/  
├── b2c3d4e5-f6g7-8901-bcde-fg2345678901.scenario.json     # IOR unit metadata
└── b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.ts         # IOR master file

scenarios/index/c/3/d/4/e/
├── c3d4e5f6-g7h8-9012-cdef-gh3456789012.scenario.json     # Enum unit metadata  
└── c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.ts         # Enum master file
```

### **ln Link Structure (Corrected)**

**ln Links Preserve Original Names:**
```bash
# ScenarioInterface ln links
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts

/workspace/components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts  
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts

# IORInterface ln links
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/IOR.interface.ts
  → ../../../../../scenarios/index/b/2/c/3/d/b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.ts

/workspace/components/User/0.3.0.4/src/ts/layer3/IOR.interface.ts
  → ../../../../../scenarios/index/b/2/c/3/d/b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.ts
```

### **Corrected Unit Model**

```typescript
export interface UnitModel extends Model {
  uuid: string;
  name: string;
  origin: IOR;                      // IOR object (contains filename in gitUrl)
  definition: IOR;                  // IOR object (contains definition location)
  typeM3: TypeM3;
  
  // UUID-based file storage (literal format)
  indexPath: string;                // Path to uuid.scenario.json
  masterFile: string;               // Path to uuid.master.ts (literal format)
  
  // Reference tracking
  references: UnitReference[];      // linkLocation + syncStatus
  
  createdAt: string;
  updatedAt: string;
}
```

### **Corrected Example Scenario**

**a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json:**
```json
{
  "ior": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "component": "Unit",
    "version": "0.3.0.4"
  },
  "owner": "{\"user\":\"system\",\"hostname\":\"web4\",\"uuid\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"timestamp\":\"2025-09-07T01:55:00.000Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "ScenarioInterface",
    
    "origin": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "component": "Unit",
      "version": "0.3.0.4", 
      "gitUrl": "https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-20:1"
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
    
    "createdAt": "2025-09-07T01:55:00.000Z",
    "updatedAt": "2025-09-07T01:55:00.000Z"
  }
}
```

### **Key Clarifications:**

**1. Literal Format (No Placeholders):**
- **Master File:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts`
- **Not:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.Scenario.interface.ts`

**2. Extension Preservation:**
- **TypeScript:** `.master.ts`
- **JavaScript:** `.master.js`
- **Markdown:** `.master.md`
- **JSON:** `.master.json`

**3. Filename Resolution:**
```typescript
// Extract original filename from IOR when needed
const getOriginalFilename = (unit: UnitModel): string => {
  return unit.origin.getFilename();  // "Scenario.interface.ts" from gitUrl
};

// Create ln link with original name
const createSemanticLink = (unit: UnitModel, targetDir: string): void => {
  const originalName = unit.origin.getFilename();  // From IOR
  const masterFile = unit.masterFile;              // UUID.master.ts
  const targetPath = `${targetDir}/${originalName}`;
  
  symlink(masterFile, targetPath);  // Semantic name → UUID master
};
```

---

## **✅ CHECK**

**Filename Format Correction Verification:**

**Literal Format Confirmed (✅)**
```
Correct: UUID.master.ts (literal format, no filename insertion)
Storage: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts
Semantics: Preserved in IOR gitUrl only
ln Links: Preserve original names pointing to UUID masters
```

**TRON QA Feedback Validation**
> **"yes, but unit.'master.file' do not change things in 'quotes'"**

**Format Specification Clarified (✅)**
- ✅ **Literal UUID.master.ext:** Exact format without filename insertion
- ✅ **Quote Preservation:** All quoted text remains unchanged
- ✅ **Extension Only:** Original file extension preserved in master filename
- ✅ **IOR Semantics:** Filename information preserved in IOR gitUrl only

---

## **💫 EMOTIONAL REFLECTION: PRECISION AND LITERAL SPECIFICATION CLARITY**

### **PRECISION APPRECIATION:**
**TREMENDOUS** appreciation for TRON's precision in format specification - literal UUID.master.ext without any placeholder modifications.

### **CLARITY ACHIEVEMENT:**
**PROFOUND** satisfaction in achieving absolute clarity on filename format - no ambiguity about literal vs placeholder naming.

### **SPECIFICATION CONFIDENCE:**
**SYSTEMATIC** confidence in the corrected specification - pure UUID naming with extension only, semantics preserved in IOR.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Template v3.1.4.2 compliance maintained for format correction
- ✅ **Literal Specification:** Format specifications must be exact and unambiguous
- ✅ **Quote Preservation:** Quoted content remains unchanged in all specifications
- ✅ **IOR Semantic Preservation:** Filename semantics belong in IOR, not file system

**Quality Impact:** Corrected filename format specification provides absolute clarity for implementation with literal UUID.master.ext naming and IOR-based semantic preservation.

**Next PDCA Focus:** Implement corrected filename format with literal UUID.master.ext naming system.

---

## **🎯 ACT**

**Immediate Results:**
- **✅ Format Corrected:** Literal UUID.master.ext naming (no filename insertion)
- **✅ Quote Preservation:** All quoted text unchanged in specifications
- **✅ Extension Clarity:** Original file extension preserved in master filename only
- **✅ IOR Semantics:** Filename information exclusively in IOR gitUrl

**Corrected Format Examples:**

**ScenarioInterface Master:**
```
File: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts
IOR: "gitUrl": "https://github.com/.../Scenario.interface.ts"
```

**IORInterface Master:**
```
File: b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.ts  
IOR: "gitUrl": "https://github.com/.../IOR.interface.ts"
```

**TypeM3Enum Master:**
```
File: c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.ts
IOR: "gitUrl": "https://github.com/.../TypeM3.enum.ts"
```

**Key Success Factors:**
1. **Literal Format:** UUID.master.ext exactly as written
2. **Quote Preservation:** No modification of quoted content
3. **Extension Only:** Original file extension preserved in master name
4. **IOR Semantics:** Filename information in IOR where it belongs

**Critical Insights:**
1. **Literal specifications prevent implementation ambiguity**
2. **Quote preservation maintains content integrity**
3. **UUID.master.ext provides pure storage naming**
4. **IOR gitUrl contains all semantic filename information**

---

**🎯 Filename format corrected to literal UUID.master.ext with quote preservation and IOR-based semantic information!** 📋✅

**"Always 4 2 (FOR TWO) - literal format specifications ensure precise implementation without ambiguity."** ⚡🎯📊