# **PDCA Cycle: Master File Extension Format - .master.file as Literal Extension**

**🗓️ Date:** 2025-09-07-UTC-0200  
**🎯 Objective:** Correct understanding of .master.file as literal file extension, not placeholder for original extension  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Developer Role  
**👤 Agent Role:** Developer → File Extension Format Specification and Understanding  
**👤 Branch:** dev/once0304 → Master File Extension Correction  
**🔄 Sync Requirements:** N/A → Format Understanding Session  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Extended Development Work  
**🎯 Sprint:** Sprint 20/22 Integration → File Extension Format Specification  
**✅ Task:** Correct Understanding of .master.file as Literal Extension  
**🚨 Issues:** Misunderstood .master.file as placeholder instead of literal extension format  

**📎 Previous Commit:** e92a38c3 - Sprint 22 Planning: Unit Foundation Sprint with Auto-Sync and Deduplication Framework  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0155-filename-format-correction.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0155-filename-format-correction.pdca.md](2025-09-07-UTC-0155-filename-format-correction.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0200-master-file-extension-format.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0200-master-file-extension-format.pdca.md](2025-09-07-UTC-0200-master-file-extension-format.pdca.md)

### **QA Decisions**
1a. **Literal Extension:** .master.file is the actual file extension (not placeholder)
2b. **UUID Replacement Only:** Only replace "uuid" with actual UUID value
3c. **Invariant Extension:** .master.file extension remains constant for all file types
4d. **Simple and Clear:** Unambiguous format specification for all implementations

### **TRON Feedback (2025-09-07-UTC-0200)**
```quote
no you still did not get it uuid.master.file where you only replace uuid with the real uuid. *.mater.file shall be the extension! so its simple and clear and invariant
```

### **My Answer**
Now I understand! The extension is literally ".master.file" (invariant for all files). Only replace "uuid" with actual UUID. So a TypeScript interface becomes "a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file" regardless of original extension. Simple, clear, and invariant across all file types.

**Learning Applied:** .master.file is the literal file extension for ALL master files - invariant format that doesn't change based on original file type.

---

## **📋 PLAN**

**Objective:** Implement correct .master.file extension format with UUID replacement only

**Scope:**
- **Literal Extension:** .master.file is actual extension for all master files
- **UUID Replacement:** Only "uuid" gets replaced with actual UUID value
- **Invariant Format:** Same extension regardless of original file type
- **Clear Specification:** Unambiguous format for all implementations

**Targets (metrics):**
- **Format Consistency:** All master files use .master.file extension
- **UUID Replacement:** Only UUID portion varies between files
- **Type Invariance:** Same extension for .ts, .js, .md, .json, etc. originals
- **Implementation Clarity:** Unambiguous specification for development

**Acceptance Criteria:**
- [ ] Correct .master.file extension format specification
- [ ] Clear examples showing UUID replacement only
- [ ] Invariant extension across all file types demonstrated
- [ ] Updated unit model and examples with correct format

---

## **🔧 DO**

### **Correct Format Understanding**

**❌ WRONG (Previous Understanding):**
```
Original: Scenario.interface.ts
Master: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.ts    # Wrong - used original extension
```

**✅ CORRECT (TRON's Specification):**
```
Original: Scenario.interface.ts
Master: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file  # Correct - literal .master.file extension

Original: IOR.interface.ts
Master: b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.file  # Same extension - invariant

Original: TypeM3.enum.ts  
Master: c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.file  # Same extension - invariant

Original: README.md
Master: d4e5f6g7-h8i9-0123-defg-hi4567890123.master.file  # Same extension - invariant

Original: package.json
Master: e5f6g7h8-i9j0-1234-efgh-ij5678901234.master.file  # Same extension - invariant
```

### **Corrected Storage Structure**

**Central Index Layout:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Unit metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file       # Master file (invariant extension)

scenarios/index/b/2/c/3/d/
├── b2c3d4e5-f6g7-8901-bcde-fg2345678901.scenario.json     # IOR unit metadata
└── b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.file       # IOR master file (same extension)

scenarios/index/c/3/d/4/e/
├── c3d4e5f6-g7h8-9012-cdef-gh3456789012.scenario.json     # Enum unit metadata
└── c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.file       # Enum master file (same extension)
```

### **ln Link Structure (Corrected)**

**ln Links Preserve Original Names, Point to .master.file:**
```bash
# ScenarioInterface ln links
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file

/workspace/components/User/0.3.0.4/src/ts/layer3/Scenario.interface.ts
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file

# IORInterface ln links  
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/IOR.interface.ts
  → ../../../../../scenarios/index/b/2/c/3/d/b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.file

/workspace/components/User/0.3.0.4/src/ts/layer3/IOR.interface.ts
  → ../../../../../scenarios/index/b/2/c/3/d/b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.file
```

### **Corrected Unit Model**

```typescript
export interface UnitModel extends Model {
  uuid: string;
  name: string;
  origin: IOR;                      // IOR object (contains original filename in gitUrl)
  definition: IOR;                  // IOR object (contains definition location)
  typeM3: TypeM3;
  
  // UUID-based file storage (corrected format)
  indexPath: string;                // Path to uuid.scenario.json
  masterFile: string;               // Path to uuid.master.file (LITERAL EXTENSION)
  
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
  "owner": "{\"user\":\"system\",\"hostname\":\"web4\",\"uuid\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"timestamp\":\"2025-09-07T02:00:00.000Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
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
    "masterFile": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file",
    
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
    
    "createdAt": "2025-09-07T02:00:00.000Z",
    "updatedAt": "2025-09-07T02:00:00.000Z"
  }
}
```

## **⚡ Perfect Understanding Achieved:**

### **✅ Correct Format:**
```
Pattern: uuid.master.file
Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file

- "uuid" → replaced with actual UUID
- ".master.file" → literal extension (invariant for ALL files)
```

### **🎯 Invariant Extension Benefits:**

**Universal Consistency:**
- ✅ **TypeScript:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file`
- ✅ **JavaScript:** `b2c3d4e5-f6g7-8901-bcde-fg2345678901.master.file`
- ✅ **Markdown:** `c3d4e5f6-g7h8-9012-cdef-gh3456789012.master.file`
- ✅ **JSON:** `d4e5f6g7-h8i9-0123-defg-hi4567890123.master.file`

**Perfect Simplicity:**
- ✅ **Simple:** Only UUID varies, extension constant
- ✅ **Clear:** .master.file immediately identifies master files
- ✅ **Invariant:** Same extension regardless of original file type
- ✅ **Semantic Preservation:** Original type info in IOR gitUrl only

### **🔧 Storage Structure:**
```
scenarios/index/a/1/b/2/c/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json     # Unit metadata
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file       # Master file (invariant extension)
```

### **📋 ln Links:**
```bash
# Preserve semantic names, point to .master.file
/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.ts
  → ../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.master.file
```

**Perfect! Now I understand - .master.file is the literal invariant extension for ALL master files, with only UUID replacement. Simple, clear, and universally consistent!** ⚡✅🎯