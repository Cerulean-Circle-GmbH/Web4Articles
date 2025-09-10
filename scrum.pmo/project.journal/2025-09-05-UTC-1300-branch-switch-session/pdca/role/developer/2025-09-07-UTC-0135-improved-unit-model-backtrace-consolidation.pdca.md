# **PDCA Cycle: Improved Unit Model with Backtrace Array Consolidation**

**🗓️ Date:** 2025-09-07-UTC-0135  
**🎯 Objective:** Design improved Unit model with backtrace array consolidation to seamlessly support radical unit traceability  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Developer Role  
**👤 Agent Role:** Developer → Unit Model Architecture Design and Backtrace System  
**👤 Branch:** dev/once0304 → Unit Model Enhancement Analysis  
**🔄 Sync Requirements:** N/A → Unit Model Design Session  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Extended Development Work  
**🎯 Sprint:** Sprint 20/22 Integration → Unit Model Architecture Enhancement  
**✅ Task:** Improved Unit Model Design with Backtrace Consolidation  
**🚨 Issues:** Current symLinks and namedLinks arrays need Occam's Razor consolidation for better traceability  

## **🎯 PLAN**

### **Current Unit Model Analysis**

**Existing Structure Issues:**
- `symlinkPaths: string[]` - Absolute paths to link files (complex, brittle)
- `namedLinks: NamedLink[]` - Relative paths with filenames (DRY violation)
- Two separate arrays for essentially same concept (violates Occam's Razor)
- No backtrace capability to source files or master references
- Limited traceability for master-slave relationships

**Target Use Cases to Support:**
1. **Interface Deduplication:** `Scenario.interface.ts` in multiple components
2. **Master-Slave Relationships:** Unit layer3 → future Scenario component
3. **Version Mapping:** Different component versions with same interfaces
4. **Radical Unit Traceability:** Full backtrace to original sources
5. **Cyclic Dependency Resolution:** Non-cyclic bootstrapping paths

### **Improved Unit Model Design Strategy**

**Occam's Razor Consolidation:**
- **Single Array:** Replace `symlinkPaths` + `namedLinks` with unified `backtrace`
- **Rich Metadata:** Each backtrace entry contains full context
- **Master Reference:** Direct link to master source unit
- **Version Traceability:** Support for version mapping and consistency

## **🔧 DO**

### **Enhanced Unit Model Specification**

```typescript
export interface UnitModel extends Model {
  uuid: string;                    // UUIDv4 format - universal identifier
  name: string;                    // Unit terminal identity name
  origin: string;                  // GitTextIOR to source location
  definition: string;              // GitTextIOR to definition location
  indexPath: string;               // Path to scenario.json in central index
  typeM3: TypeM3;                 // MOF classification (CLASS, ATTRIBUTE, RELATIONSHIP)
  
  // CONSOLIDATED: Single backtrace array replaces symlinkPaths + namedLinks
  backtrace: BacktraceEntry[];     // Unified traceability with rich metadata
  
  // MASTER REFERENCE: For interface deduplication and version mapping
  masterUnit?: string;             // UUID of master unit (for slave copies)
  slaveUnits: string[];           // UUIDs of slave units (for master units)
}

export interface BacktraceEntry {
  // LOCATION INFORMATION
  linkPath: string;                // Absolute path to link file
  relativePath: string;            // Relative path from link to scenario
  filename: string;                // Link filename (e.g., "Scenario.interface.unit")
  
  // CONTEXT METADATA
  componentName: string;           // Component containing this link
  componentVersion: string;        // Component version
  layerPath: string;              // Layer path within component (e.g., "src/ts/layer3")
  
  // TRACEABILITY
  createdAt: string;              // ISO timestamp when link was created
  createdBy: string;              // Component/tool that created this link
  purpose: 'primary' | 'slave' | 'reference' | 'migration';  // Link purpose
  
  // MASTER-SLAVE RELATIONSHIPS
  masterReference?: string;        // UUID of master unit if this is a slave
  slaveGeneration?: number;        // Generation number for version tracking
}
```

### **Example Unit Scenario for Interface Deduplication Use Case**

```json
{
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "componentName": "Unit",
  "componentVersion": "0.3.0.4",
  "createdAt": "2025-09-07T01:35:00.000Z",
  "updatedAt": "2025-09-07T01:35:00.000Z",
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Scenario.interface",
    "origin": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-15:1",
    "definition": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts#L1:1-15:1",
    "indexPath": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
    "typeM3": "ATTRIBUTE",
    
    "backtrace": [
      {
        "linkPath": "/workspace/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.unit",
        "relativePath": "../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
        "filename": "Scenario.interface.unit",
        "componentName": "Unit",
        "componentVersion": "0.3.0.4",
        "layerPath": "src/ts/layer3",
        "createdAt": "2025-09-07T01:00:00.000Z",
        "createdBy": "unit create command",
        "purpose": "primary"
      },
      {
        "linkPath": "/workspace/components/DefaultCLI/0.3.0.4/src/ts/layer3/Scenario.interface.unit",
        "relativePath": "../../../../../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
        "filename": "Scenario.interface.unit",
        "componentName": "DefaultCLI",
        "componentVersion": "0.3.0.4",
        "layerPath": "src/ts/layer3",
        "createdAt": "2025-09-07T01:30:00.000Z",
        "createdBy": "unit linkInto command",
        "purpose": "slave",
        "masterReference": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "slaveGeneration": 1
      }
    ],
    
    "masterUnit": null,
    "slaveUnits": []
  }
}
```

### **Benefits of Enhanced Model**

**Occam's Razor Compliance ✅**
- Single `backtrace` array replaces two separate arrays
- Rich metadata eliminates need for external mapping
- Self-contained traceability information

**Radical Unit Traceability ✅**
- Full context for each link (component, version, layer, purpose)
- Master-slave relationship tracking
- Generation-based version mapping
- Timestamp-based change tracking

**Cyclic Dependency Resolution ✅**
- Clear master-slave designation prevents cycles
- Bootstrap-friendly: slaves can reference masters without circular imports
- Migration path: slaves can be promoted to masters when ready

**Interface Deduplication Support ✅**
- Master unit holds canonical interface definition
- Slave units link to master without duplication
- Version consistency through master reference
- Automatic propagation of interface changes

## **✅ CHECK**

### **Model Validation**

**Occam's Razor Assessment:**
- ✅ **Simplified:** Single backtrace array vs. two separate arrays
- ✅ **Self-Contained:** All traceability info in one structure
- ✅ **Minimal:** Only essential metadata included
- ✅ **Consistent:** Same pattern for all link types

**Use Case Coverage:**
- ✅ **Interface Deduplication:** Master-slave with backtrace
- ✅ **Version Mapping:** Generation tracking and component versions
- ✅ **Radical Traceability:** Full backtrace to original sources
- ✅ **Cyclic Prevention:** Clear master-slave hierarchy

**Implementation Feasibility:**
- ✅ **Backward Compatible:** Can migrate existing symlinkPaths/namedLinks
- ✅ **Forward Compatible:** Extensible for future use cases
- ✅ **Performance:** Single array iteration vs. multiple array searches
- ✅ **Maintainable:** Clear structure with rich metadata

## **🔄 ACT**

### **Implementation Strategy**

**Phase 1: Model Migration (Immediate)**
1. Create `BacktraceEntry.interface.ts` in Unit layer3
2. Update `UnitModel.interface.ts` with enhanced model
3. Implement migration method in DefaultUnit for existing units
4. Test migration with existing Unit scenarios

**Phase 2: CLI Enhancement (Next)**
1. Update Unit CLI commands to use backtrace array
2. Implement master-slave relationship commands
3. Add backtrace inspection commands (`unit backtrace <uuid>`)
4. Test interface deduplication workflow

**Phase 3: Interface Deduplication (Sprint 22)**
1. Identify master interfaces (Unit layer3 as initial masters)
2. Create slave links in other components
3. Implement consistency checking
4. Test cyclic dependency resolution

### **Next Steps**
1. **QA Decision:** Approve enhanced Unit model design
2. **Implementation:** Create BacktraceEntry interface and update UnitModel
3. **Migration:** Implement backward-compatible migration for existing units
4. **Testing:** Validate with Scenario.interface.ts deduplication use case

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0135-improved-unit-model-backtrace-consolidation.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0135-improved-unit-model-backtrace-consolidation.pdca.md](scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0135-improved-unit-model-backtrace-consolidation.pdca.md)