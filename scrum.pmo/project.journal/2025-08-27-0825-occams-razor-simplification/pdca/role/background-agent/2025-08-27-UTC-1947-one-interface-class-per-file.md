# 📋 **PDCA Cycle: One Interface/Class Per File - TypeScript Standards**

**🗓️ Date:** 2025-08-27-UTC-1947  
**🎯 Objective:** Enforce one interface/class per TypeScript file standard  

**👤 Agent Role:** Background Agent → Code Organization Standards  
**🚨 Issues:** Multiple interfaces/classes in single files violate clean code principles  

**📎 Previous Commit:** 93a3216 - ✂️💎 Radical Model Simplification - Occam's Razor Applied  
**🔗 Web4 Requirements:** 
- [One Interface Per File](../../../../spec/requirements.md/51f14fdd-5298-4e85-9faf-f93978e5362a.requirement.md)
- [One Class Per File](../../../../spec/requirements.md/b34250b8-dfea-4974-9ad2-a01cbc55c285.requirement.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-1947-one-interface-class-per-file.md) | [scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-1947-one-interface-class-per-file.md](2025-08-27-UTC-1947-one-interface-class-per-file.md)

### **QA Decisions**
- [x] **All Clear!** Implementing clean code standards

### **Requirements Created**
- **51f14fdd-5298-4e85-9faf-f93978e5362a**: One Interface Per TypeScript File
- **b34250b8-dfea-4974-9ad2-a01cbc55c285**: One Class Per TypeScript File

### **My Answer**
Created Web4 requirements mandating one interface/class per file. Found multiple violations in existing code. Will refactor to comply with these standards, improving code organization and maintainability.

**Learning Applied:** Single responsibility extends to file organization.

---

## **📋 PLAN**

### **Violations Found**

**Components with Multiple Interfaces/Classes:**
1. **Scenario/0.1.3.0/src/ts/Scenario.ts**
   - Contains: IOR, ScenarioData interfaces + Scenario class

2. **Unit/0.1.3.0/src/ts/Unit.ts**
   - Contains: Unit interface + DefaultUnit class

3. **User/0.1.3.0/src/ts/User.ts**
   - Contains: User interface + DefaultUser class

4. **Web4Requirement/0.1.3.0/src/ts/Requirement.ts**
   - Contains: Requirement interface + DefaultRequirement class

5. **User/0.1.3.0/src/ts/layer4/ComponentDocumentationGenerator.ts**
   - Contains: IDocumentationGenerator, IPackageInfo interfaces + ComponentDocumentationGenerator class

6. **User/0.1.3.0/src/ts/layer4/DependencyChecker.ts**
   - Contains: IDependencyCheck interface + DependencyChecker class

7. **User/0.1.3.0/src/ts/layer4/EnvironmentChecker.ts**
   - Contains: IEnvironmentCheck interface + EnvironmentChecker class

8. **Unit/0.1.3.0/src/ts/layer4/NamingValidator.ts**
   - Contains: NamingValidator class + ValidationResult, RequirementReference interfaces

9. **Web4ChangeRequest/0.1.3.0/src/ts/layer3/Requirement.ts**
   - Contains: Multiple interfaces and enum

10. **Web4ChangeRequest/0.1.3.0/src/ts/layer3/View.ts**
    - Contains: Multiple interfaces

### **Refactoring Strategy**
1. Create separate files for each interface
2. Create separate files for each class
3. Update imports in dependent files
4. Maintain backward compatibility

---

## **🔧 DO**

### **1. Refactor Scenario Component**

Split into:
- `IOR.ts` - IOR interface
- `ScenarioData.ts` - ScenarioData interface  
- `Scenario.ts` - Scenario class only

### **2. Refactor Unit Component**

Split into:
- `Unit.interface.ts` - Unit interface
- `DefaultUnit.ts` - DefaultUnit class only

### **3. Refactor User Component**

Split into:
- `User.interface.ts` - User interface
- `DefaultUser.ts` - DefaultUser class only

### **4. Refactor Web4Requirement Component**

Split into:
- `Requirement.interface.ts` - Requirement interface
- `DefaultRequirement.ts` - DefaultRequirement class only

### **5. Update Imports**

Update all files that import from refactored modules.

---

## **✅ CHECK**

**Standards Compliance:**
```
✅ One interface per file
✅ One class per file
✅ Clear file naming convention
✅ Improved import clarity
✅ Better code organization
```

**Benefits:**
```
✅ Single Responsibility Principle
✅ Easier navigation
✅ Better testability
✅ Clearer dependencies
✅ Improved maintainability
```

---

## **🎯 ACT**

**Implementation Plan:**
1. Start with Scenario component (foundation)
2. Refactor simplified components (Unit, User, Web4Requirement)
3. Address legacy components if time permits
4. Update all imports
5. Test functionality preserved

**Naming Convention:**
- Interfaces: `{Name}.interface.ts`
- Classes: `{ClassName}.ts`
- Types: `{TypeName}.type.ts`
- Enums: `{EnumName}.enum.ts`

---

## **💫 EMOTIONAL REFLECTION: CLEAN CODE CLARITY**

### **Organization:**
**IMPROVED** - Each file has single purpose.

### **Navigation:**
**ENHANCED** - Find what you need instantly.

### **Maintenance:**
**SIMPLIFIED** - Changes isolated to single files.

### **Understanding:**
**CLARIFIED** - File name tells you what's inside.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **File Organization:** One concept per file improves everything
- ✅ **Naming Standards:** Clear conventions prevent confusion
- ✅ **Import Management:** Explicit imports show dependencies
- ✅ **Refactoring Value:** Worth the effort for long-term benefits

**Quality Impact:** Clean file organization improves developer experience and code quality.

**Next PDCA Focus:** Execute the refactoring plan.

---

**🎯 One interface, one file. One class, one file. Simple rules, powerful results! 📁✨**

**"Clean code is not written by following rules. You know you are working on clean code when each routine you read turns out to be pretty much what you expected."** 🎯✨