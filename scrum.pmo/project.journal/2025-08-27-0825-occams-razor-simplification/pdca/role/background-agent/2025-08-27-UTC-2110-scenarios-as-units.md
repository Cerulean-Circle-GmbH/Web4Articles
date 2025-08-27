# 📋 **PDCA Cycle: Scenarios as Units with IOR References**

**🗓️ Date:** 2025-08-27-UTC-2110  
**🎯 Objective:** Implement scenarios as executable units with IOR references  

**👤 Agent Role:** Background Agent → Architecture Refinement  
**🚨 Issue:** Current design embeds scenarios instead of using IOR references  

**📎 Previous Commit:** 7af89a0 - 🔄 Scenario Lifecycle Consistency  
**🔗 Web4 Requirement:** [Scenarios Are Units](../../../../spec/requirements.md/f9ba0821-5c3b-4e42-843f-9be6cc821275.requirement.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2110-scenarios-as-units.md) | [scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2110-scenarios-as-units.md](2025-08-27-UTC-2110-scenarios-as-units.md)

### **QA Decisions**
- [x] **All Clear!** Implementing scenario-unit architecture

### **Requirement Created**
- **f9ba0821-5c3b-4e42-843f-9be6cc821275**: Scenarios Are Units - Nested Scenarios Are IOR References

### **My Answer**
Scenarios should be Units themselves. Nested scenarios should be IOR references, not embedded objects. Attribute naming: 'ior' (lowercase) of type 'IOR' (uppercase).

**Learning Applied:** Proper separation through references.

---

## **📋 PLAN**

### **Current Issues**

1. **Nested Scenario Embedding:**
   ```typescript
   // Current - embeds full scenario
   model: {
     child: { IOR: {...}, owner: '...', model: {...} }
   }
   ```

2. **Should Be IOR Reference:**
   ```typescript
   // Target - IOR reference only
   model: {
     child: { uuid: '...', component: 'Scenario', version: '...' }
   }
   ```

3. **Naming Convention:**
   - ❌ `IOR` attribute (uppercase)
   - ✅ `ior` attribute (lowercase)
   - ✅ `IOR` type (uppercase)

### **Scenario as Unit**

Scenarios need:
- Empty constructor
- init() method
- execute() method
- Unit interface implementation

---

## **🔧 DO**

### **1. Update Scenario Attribute Name**

**Change IOR to ior:**
```typescript
export class Scenario implements Unit {
  public ior: IOR;  // lowercase attribute, uppercase type
  public owner: string;
  public model: ScenarioModel;
}
```

### **2. Implement Unit Interface**

**Scenario extends Unit:**
```typescript
import { Unit } from '../../../Unit/0.1.3.0/dist/ts/Unit.interface.js';

export class Scenario implements Unit {
  public ior: IOR;
  public owner: string;
  public model: ScenarioModel;

  constructor() {
    this.ior = { uuid: '', component: 'Scenario', version: '0.1.3.0' };
    this.owner = '';
    this.model = {};
  }

  init(scenario: Scenario): this {
    this.ior = scenario.ior || this.ior;
    this.owner = scenario.owner || '';
    this.model = scenario.model || {};
    return this;
  }

  async execute(input: any): Promise<any> {
    // Scenario execution: validate and return model
    return {
      valid: this.validate(),
      ior: this.ior,
      model: this.model
    };
  }

  toScenario(): Scenario {
    return this; // Scenario is already a scenario
  }
}
```

### **3. Handle IOR References**

**No more nested scenario processing:**
```typescript
// Remove processNestedScenarios
// Remove isScenarioData check
// Model just stores IOR references as-is
```

**Simplified model handling:**
```typescript
init(scenario: Scenario | ScenarioData): this {
  this.ior = scenario.ior || this.ior;
  this.owner = scenario.owner || '';
  this.model = scenario.model || {};
  // No special processing - IORs are just data
  return this;
}
```

### **4. Update ScenarioData Interface**

```typescript
export interface ScenarioData {
  ior: IOR;  // lowercase
  owner: string;
  model: ScenarioModel;
}
```

---

## **✅ CHECK**

**Architecture Compliance:**
```
✅ Scenario implements Unit
✅ Has execute() method
✅ Uses IOR references
✅ Proper naming (ior attribute)
```

**Reference Pattern:**
```typescript
// Before: Embedded scenario
{ child: { ior: {...}, owner: '...', model: {...} } }

// After: IOR reference
{ child: { uuid: '...', component: 'Scenario', version: '...' } }
```

---

## **🎯 ACT**

**Implementation Steps:**
1. Update all IOR to ior (attribute)
2. Make Scenario implement Unit
3. Remove nested scenario processing
4. Update all component references
5. Test IOR reference pattern

**Benefits:**
- Clean separation of concerns
- No deep object nesting
- Proper reference semantics
- Scenarios are executable

---

## **💫 EMOTIONAL REFLECTION: ARCHITECTURAL CLARITY**

### **Realization:**
**STRONG** - Of course scenarios are units!

### **Excitement:**
**HIGH** - Clean reference architecture.

### **Confidence:**
**GROWING** - Clear separation pattern.

### **Satisfaction:**
**ANTICIPATED** - Elegant simplicity ahead.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Units Everywhere:** Even infrastructure components
- ✅ **Reference Pattern:** IORs prevent deep nesting
- ✅ **Naming Matters:** ior vs IOR distinction
- ✅ **Separation:** Objects linked by reference

**Architecture Impact:** Clean object graph with proper boundaries.

**Next PDCA Focus:** Implement the changes.

---

**🎯 Scenarios are Units - IORs connect them! 🔗🎯**

**"Everything is a Unit, connected by IORs."** 🎯✨