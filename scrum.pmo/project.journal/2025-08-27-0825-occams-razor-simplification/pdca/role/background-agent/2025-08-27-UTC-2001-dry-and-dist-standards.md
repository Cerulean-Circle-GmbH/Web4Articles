# 📋 **PDCA Cycle: DRY Principle and Dist Folder Standards**

**🗓️ Date:** 2025-08-27-UTC-2001  
**🎯 Objective:** Enforce DRY principle through components and dist folder standards  

**👤 Agent Role:** Background Agent → Architecture Standards  
**🚨 Issues:** Code duplication and committed dist folders found  

**📎 Previous Commit:** cabca6f - 🚫 No JavaScript in TypeScript Source Folders  
**🔗 Web4 Requirements:** 
- [Dist Folder is Build Output Only](../../../../spec/requirements.md/2f0205c2-d367-4ad2-8dc8-a7939c721fd0.requirement.md)
- [DRY - Reusable Code Must Be Components](../../../../spec/requirements.md/2953c813-8f87-4fef-8d6f-aaf06238753f.requirement.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2001-dry-and-dist-standards.md) | [scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2001-dry-and-dist-standards.md](2025-08-27-UTC-2001-dry-and-dist-standards.md)

### **QA Decisions**
- [ ] **ASK** - Should we remove TSRanger's committed dist folders?
- [ ] **ASK** - Should we refactor all components to use Scenario's IOR?

### **Requirements Created**
- **2f0205c2-d367-4ad2-8dc8-a7939c721fd0**: Dist Folder is Build Output Only
- **2953c813-8f87-4fef-8d6f-aaf06238753f**: DRY - Reusable Code Must Be Components

### **My Answer**
Created requirements for dist folder management and DRY principle. Found violations: TSRanger has committed dist folders, and IOR interface is duplicated in multiple components instead of being reused from Scenario component.

**Learning Applied:** Reusable code belongs in components, not copied.

---

## **📋 PLAN**

### **DRY Violations Found**

**IOR Interface Duplicated In:**
1. `components/Scenario/0.1.3.0/src/ts/IOR.interface.ts` ✅ (Authoritative)
2. `components/Unit/0.1.3.0/src/ts/layer3/SimpleTypes.ts` ❌ (Duplicate)
3. `components/Unit/0.1.0.0/src/ts/layer3/SimpleTypes.ts` ❌ (Duplicate)
4. `components/Web4Test/0.1.0.0/src/ts/layer3/Test.ts` ❌ (Duplicate)
5. `components/Web4Test/v1.0/src/ts/layer3/Test.ts` ❌ (Duplicate)

### **Dist Folder Violations**

**Committed Dist Folders:**
- `components/TSRanger/v3.njs14/dist/` - Contains build output in git

### **Standards to Enforce**

**DRY Principle:**
- One source of truth per concept
- Reusable code → Component
- Import, don't duplicate
- Example: All use Scenario's IOR

**Dist Folder Rules:**
- Never commit dist/
- Always in .gitignore
- Clean before build
- Mirror src structure

---

## **🔧 DO**

### **1. DRY Implementation Strategy**

**Current State:**
```typescript
// Unit/0.1.3.0/src/ts/layer3/SimpleTypes.ts
export interface IOR {
  uuid: string;
  component: string;
  version: string;
}
```

**Target State:**
```typescript
// Unit/0.1.3.0/src/ts/layer3/SimpleTypes.ts
export { IOR } from '../../../../Scenario/latest/dist/ts/IOR.interface.js';
```

### **2. Component Dependencies**

**Scenario Component:**
- Provides: IOR, ScenarioData, Scenario
- Used by: All other components

**Benefits:**
- Single source of truth
- Consistent updates
- Smaller bundle sizes
- Clear dependencies

### **3. Dist Folder Cleanup**

**Actions Needed:**
1. Remove TSRanger dist from git
2. Ensure all dist in .gitignore
3. Add clean scripts to package.json
4. Document build process

---

## **✅ CHECK**

**DRY Compliance:**
```
✅ Scenario component owns IOR
❌ Unit duplicates IOR
❌ Web4Test duplicates IOR
✅ New components import from Scenario
```

**Dist Folder Compliance:**
```
✅ Root .gitignore includes dist
❌ TSRanger has committed dist
✅ New components don't commit dist
✅ Build scripts output to dist only
```

---

## **🎯 ACT**

### **Decisions Needed**

**Option 1: Full Cleanup**
- Remove all duplicate IOR interfaces
- Update imports to use Scenario
- Remove TSRanger's dist from git
- Risk: May affect legacy components

**Option 2: Forward-Only**
- Keep legacy as-is
- Enforce standards on new code only
- Document technical debt
- Lower risk approach

**Option 3: Gradual Migration**
- Fix new components (0.1.3.0+)
- Create migration plan for legacy
- Track debt in requirements
- Balanced approach

### **Recommended Actions**
1. Fix duplicate IOR in Unit 0.1.3.0
2. Remove TSRanger dist if safe
3. Document component dependencies
4. Create build best practices

---

## **💫 EMOTIONAL REFLECTION: ARCHITECTURAL DISCIPLINE**

### **Frustration:**
**ACKNOWLEDGED** - Duplicated code creates maintenance burden.

### **Clarity:**
**EMERGING** - Clear patterns prevent future issues.

### **Determination:**
**STRONG** - Worth fixing for long-term health.

### **Wisdom:**
**APPLIED** - Balance perfection with pragmatism.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **DRY Enforcement:** Components enable code reuse
- ✅ **Build Hygiene:** Dist folders need strict management
- ✅ **Legacy Debt:** Document violations for future cleanup
- ✅ **Standards Evolution:** Apply to new code immediately

**Quality Impact:** DRY principle and proper build management reduce bugs and improve maintainability.

**Next PDCA Focus:** Await decision on cleanup approach.

---

**🎯 Don't Repeat Yourself - Make it a Component! 🔄📦**

**"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."** 🎯✨