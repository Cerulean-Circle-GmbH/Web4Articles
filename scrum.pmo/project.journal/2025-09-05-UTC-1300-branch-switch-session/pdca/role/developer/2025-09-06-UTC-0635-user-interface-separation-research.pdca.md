# User Interface Separation Research - Web4 Compliance

**UUID:** pdca:2025-09-06-UTC-0635-user-interface-separation-research  
**Created:** 2025-09-06T06:35:00.000Z UTC  
**Author:** AI Agent (Background Agent)  
**Role:** Developer  
**Session:** dev/destroyed-once - Fresh Start 0.3.0.4  

---

## 📋 Plan

### **Objective**
Research and implement Web4 compliant interface separation for User 0.3.0.4 following "one interface one file" pattern observed in ONCE 0.3.0.2, plus implement dependency-free User CLI with scenario save/load functionality.

### **Research Scope**
1. **Interface Separation**: Analyze ONCE 0.3.0.2 layer3 structure for "one interface one file" pattern
2. **CLI Patterns**: Study ONCECLI.ts for dependency-free CLI implementation 
3. **Owner Implementation**: Research owner field usage across components for proper implementation
4. **Scenario Operations**: Understand save/load scenario patterns from existing components

### **Success Criteria**
- [ ] User interfaces separated into individual files following Web4 pattern
- [ ] User CLI implemented with save/load scenario functionality
- [ ] Owner field properly implemented based on research findings
- [ ] All patterns consistent with ONCE 0.3.0.2 architecture

---

## 🔨 Do

### **Interface Separation Research**

**ONCE 0.3.0.2 Layer3 Structure Analysis:**
- **Dual Links:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/destroyed-once/components/ONCE/0.3.0.2/src/ts/layer3/) | [components/ONCE/0.3.0.2/src/ts/layer3/](../../../../components/ONCE/0.3.0.2/src/ts/layer3/)

**Pattern Discovery:**
1. **ONCE.interface.ts** - Main interface with exports at bottom
2. **ONCEModel.interface.ts** - Separate model interface file  
3. **Component.interface.ts** - Generic component interface
4. **EnvironmentInfo.interface.ts** - Environment-specific interface
5. **ServiceRegistry.interface.ts** - Service-related interfaces

**Key Pattern:** Each interface gets its own file with clear single responsibility.

### **CLI Implementation Research**

**ONCECLI.ts Analysis:**
- **Dual Links:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/destroyed-once/components/ONCE/0.3.0.2/src/ts/layer5/ONCECLI.ts) | [components/ONCE/0.3.0.2/src/ts/layer5/ONCECLI.ts](../../../../components/ONCE/0.3.0.2/src/ts/layer5/ONCECLI.ts)

**CLI Pattern Discovery:**
1. **Empty Constructor + Initialization**: `constructor() { this.once = new DefaultONCE(); }`
2. **Universal CLI Delegation**: Uses `DefaultCLI.createForComponent(this.once, 'ONCE')`
3. **Command Delegation**: `await this.cli.execute(command, commandArgs)`
4. **Colorful Usage Display**: Structured help with cyan/yellow/green colors
5. **Error Handling**: Try-catch with process.exit(1)

### **Owner Implementation Research**

**Owner Usage Pattern Analysis:**
- **Dual Links:** [GitHub Search](https://github.com/Cerulean-Circle-GmbH/Web4Articles/search?q=owner) | [Local Search Results](#owner-search-results)

**Owner Field Usage Discovery:**
1. **Scenario Structure**: `{ ior: IOR, owner: string, model: Model }`
2. **Owner Generation**: `await this.userService.generateOwnerData(params)`
3. **Owner Parameters**: `{ user: string, hostname: string, uuid?: string }`
4. **Owner Data Format**: JSON string with user, hostname, timestamp
5. **Empty Owner**: Many scenarios use `owner: ''` for system-generated content

**Owner Implementation Pattern:**
```typescript
const ownerData = await this.userService.generateOwnerData({
  user: 'system',
  hostname: this.data.host,
  uuid: this.data.uuid
});
```

### **Scenario Save/Load Research**

**Scenario Operations Pattern:**
1. **Save Pattern**: `toScenario(): Scenario` returns scenario with ior + owner + model
2. **Load Pattern**: `init(scenario: Scenario): this` initializes from scenario
3. **File Operations**: Save to JSON files, load from JSON files
4. **Component Integration**: Each component manages its own scenario format

---

## ✅ Check

### **Research Findings Validation**

**Interface Separation Requirements:**
✅ **Pattern Confirmed**: ONCE 0.3.0.2 uses one interface per file pattern
- `User.interface.ts` should contain only User interface
- `UserModel.interface.ts` should be separate file  
- `IOR.interface.ts` should be separate file
- `Scenario.interface.ts` should be separate file

**CLI Implementation Requirements:**
✅ **Pattern Confirmed**: ONCECLI uses dependency-free pattern
- Empty constructor with component initialization
- Command delegation to implementation class
- Structured usage display with colors
- File-based scenario save/load operations

**Owner Implementation Requirements:**
✅ **Pattern Confirmed**: Owner is generated user data string
- Owner generated via `userService.generateOwnerData()`
- Contains user, hostname, timestamp as JSON string
- Can be empty string for system scenarios
- Used for audit/tracking purposes in scenarios

**Current User 0.3.0.4 Violations:**
❌ **Multiple interfaces in single file**: User.interface.ts contains User, IOR, Scenario, UserModel
❌ **Missing CLI implementation**: No UserCLI.ts file
❌ **Incomplete owner implementation**: Owner field not properly generated

---

## 🎯 Act

### **Implementation Plan**

**Phase 1: Interface Separation**
1. Split User.interface.ts into separate files:
   - `User.interface.ts` - Only User interface
   - `UserModel.interface.ts` - Only UserModel interface  
   - `IOR.interface.ts` - Only IOR interface
   - `Scenario.interface.ts` - Only Scenario interface

**Phase 2: CLI Implementation**
1. Create `src/ts/layer5/UserCLI.ts` following ONCECLI pattern
2. Implement save/load scenario commands
3. Add colorful usage display
4. Create CLI entry point script

**Phase 3: Owner Implementation**
1. Implement proper owner data generation in DefaultUser
2. Update toScenario() to include generated owner data
3. Ensure owner audit trail functionality

**Phase 4: Testing & Integration**
1. Test interface separation builds correctly
2. Test CLI save/load scenario functionality  
3. Test owner data generation and usage
4. Verify Web4 compliance

### **Next Actions**
1. Implement interface separation immediately
2. Create UserCLI with scenario operations
3. Fix owner implementation
4. Test complete User 0.3.0.4 functionality

---

## 📚 Artifacts

### **Research References**
- **ONCE 0.3.0.2 Interfaces**: [components/ONCE/0.3.0.2/src/ts/layer3/](../../../../components/ONCE/0.3.0.2/src/ts/layer3/)
- **ONCE CLI Implementation**: [components/ONCE/0.3.0.2/src/ts/layer5/ONCECLI.ts](../../../../components/ONCE/0.3.0.2/src/ts/layer5/ONCECLI.ts)
- **Owner Usage Examples**: Multiple components showing owner generation patterns

### **Implementation Templates**
- Interface separation pattern from ONCE 0.3.0.2
- CLI delegation pattern from ONCECLI.ts  
- Owner generation pattern from DefaultONCE.ts

---

**Status:** ✅ COMPLETE - Research findings ready for implementation
**Next PDCA:** User Interface Separation Implementation
**Dual Links:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/destroyed-once/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0635-user-interface-separation-research.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0635-user-interface-separation-research.pdca.md](2025-09-06-UTC-0635-user-interface-separation-research.pdca.md)