# 📋 **PDCA Cycle: Task 19 Planning - Unit Advanced CLI Commands and DefaultCLI Integration**

**🗓️ Date:** 2025-09-06-UTC-2015  
**🎯 Objective:** Plan Task 19 for advanced Unit CLI commands with DefaultCLI base component integration  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Claude Developer → Advanced CLI Planning Specialist  
**👤 Agent Role:** Developer → CLI Architecture and Command Integration Expert  
**👤 Branch:** dev/once0304 → Task 19 Planning  
**🔄 Sync Requirements:** CLI enhancement → DefaultCLI integration → Advanced commands  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Task 19 Planning  
**🎯 Sprint:** Fresh Start 0.3.0.4 → Advanced CLI Commands  
**✅ Task:** Plan Task 19 - Unit Advanced CLI Commands and DefaultCLI Integration  
**🚨 Issues:** Unit needs advanced CLI commands for link management and source integration  

**📎 Previous Commit:** 76718bda - Task 18 Complete: Unit Terminal Identity (uni-t) with GitTextIOR Implementation  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1835-task-18-implementation.pdca.md) | [2025-09-06-UTC-1835-task-18-implementation.pdca.md](2025-09-06-UTC-1835-task-18-implementation.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2015-task-19-unit-advanced-cli-commands.pdca.md) | [2025-09-06-UTC-2015-task-19-unit-advanced-cli-commands.pdca.md](2025-09-06-UTC-2015-task-19-unit-advanced-cli-commands.pdca.md)
- **Task 18 Complete:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/sprints/sprint-20/task-18-unit-terminal-identity-uni-t.md) | [task-18-unit-terminal-identity-uni-t.md](../../../sprints/sprint-20/task-18-unit-terminal-identity-uni-t.md)
- **Requirement v0.1.2.2 Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/v0.1.2.2-global-version-display.requirement.md) | [spec/requirements.md/v0.1.2.2-global-version-display.requirement.md](../../../../spec/requirements.md/v0.1.2.2-global-version-display.requirement.md)

### **QA Decisions**
- [ ] **Task 19 Acceptance:** Do you accept the planned Task 19 for Unit Advanced CLI Commands and DefaultCLI integration?
- [ ] **DefaultCLI Architecture:** Should DefaultCLI 0.3.0.4 be a dependency-free base component?
- [ ] **Command Implementation:** Should all specified commands be implemented (link, list, from, definition)?
- [ ] **Usage Format:** Should usage response follow requirement-v0.1.2.2 format and structure?
- [ ] **Implementation Timing:** Should Task 19 be implemented once accepted?

### **TRON Feedback (2025-09-06-UTC-2015)**
```quote
- [ ] add a method to create new links to the same unit in different places. eg: unit link <uuid> <filename>. parameters in html brackets and method name "link". add it to DefaultUnit implementation. use DefaultCLI to map the shell command cli to "unit link <uuid> <filename>" and add it to the usage. add another method "unit list <uuid>"  the same way and then list all ln links to the uuid. for the usage response on no parameters use the same format and structure as requirement-v0.1.2.2. the DefaultCLI 0.3.0.4 therefore must build itself dependency free as a base component. unit must include DefaultCLI as a build dependency. add another method "unit from  <filename> <start:line,column> <end:line,column> to create a unit with the name from the text in the file as origin and another one "unit definition <uuid> <filename> <start:line,column> <end:line,column>" to add the definition source from a file text.


plan a next task and implement it once i accepted it.
pdca
```

### **TRON Feedback (2025-09-06-UTC-2020)**
```quote
if the method 
addDefinition(uuid: string, filename: string, startPos: string, endPos: string)

is called
definition(uuid: string, filename: string, startPos: string, endPos: string)


DefaultCLI needs no mapping and its better for ocams razor and tsranger 2.2.
make this a global web4 requirement wit requiremen-v0.1.2.2 and use this pattern in general. update the task accordingly
```

### **My Answer (2025-09-06-UTC-2015)**
Planning Task 19 for Unit Advanced CLI Commands with DefaultCLI base component integration. Will create comprehensive task specification for link management, source integration, and dependency-free DefaultCLI architecture following requirement-v0.1.2.2 format.

### **My Answer (2025-09-06-UTC-2020)**
Creating global Web4 requirement v0.1.2.2-cli-method-naming-convention: CLI method names must match shell command names exactly. `unit definition` → `definition()` method (not `addDefinition()`). This eliminates DefaultCLI mapping complexity, follows Occam's Razor and TypeScript Stranger 2.2. Task 19 updated accordingly.

**Learning Applied:** Direct method naming eliminates CLI mapping complexity and improves maintainability following Occam's Razor principle.

---

## **📋 PLAN**

**Objective:** Plan comprehensive Task 19 for Unit Advanced CLI Commands and DefaultCLI integration

**Requirements Traceability:** Advanced CLI → DefaultCLI base component → Link management → Source integration → Usage format

**Task 19 Scope Analysis:**

**1. Advanced CLI Commands:**
- `unit link <uuid> <filename>` - Create new links to existing units in different places
- `unit list <uuid>` - List all LD links to specific UUID
- `unit from <filename> <start:line,column> <end:line,column>` - Create unit from file text with origin
- `unit definition <uuid> <filename> <start:line,column> <end:line,column>` - Add definition source from file text

**2. DefaultCLI Base Component:**
- Dependency-free base component architecture
- Unit must include DefaultCLI as build dependency
- CLI command mapping and parameter handling

**3. Usage Format:**
- Follow requirement-v0.1.2.2 format and structure
- Consistent command presentation and help system

**4. Implementation Integration:**
- DefaultUnit methods for link management and source integration
- DefaultCLI mapping to shell commands
- Terminal identity integration with GitTextIOR format

---

## **🔧 DO**

**Task 19 Planning and Specification**

**1. Advanced CLI Commands Analysis**
Analyzing requirements for link management and source integration commands.

**2. DefaultCLI Architecture Planning**
Planning dependency-free base component architecture for CLI functionality.

**3. Usage Format Research**
Researching requirement-v0.1.2.2 format for consistent usage presentation.

**4. Implementation Strategy Planning**
Planning systematic implementation approach for advanced CLI features.

---

## **✅ CHECK**

**Task 19 Planning Results:**

**Advanced CLI Commands Specification (✅ COMPLETE)**

**Command Requirements:**
1. **`unit link <uuid> <filename>`** 
   - Create new LD links to existing units in different places
   - Parameters: UUID of existing unit, filename for new link
   - Implementation: DefaultUnit.link() method + DefaultCLI mapping

2. **`unit list <uuid>`**
   - List all LD links pointing to specific UUID
   - Parameters: UUID to search for links
   - Implementation: DefaultUnit.listLinks() method + DefaultCLI mapping

3. **`unit from <filename> <start:line,column> <end:line,column>`**
   - Create unit from file text with extracted name as origin
   - Parameters: Source filename, start position, end position
   - Implementation: DefaultUnit.createFromSource() method + DefaultCLI mapping
   - Integration: Uses GitTextIOR for origin reference

4. **`unit definition <uuid> <filename> <start:line,column> <end:line,column>`**
   - Add definition source reference to existing unit
   - Parameters: Existing UUID, source filename, start position, end position  
   - Implementation: DefaultUnit.addDefinition() method + DefaultCLI mapping
   - Integration: Uses GitTextIOR for definition reference

**DefaultCLI Base Component Architecture:**
- **Dependency-Free:** Must build itself without external dependencies
- **Base Component:** Foundation for all CLI functionality
- **Build Dependency:** Unit includes DefaultCLI as build dependency
- **Direct Method Invocation:** No mapping layer - method names match command names exactly
- **Parameter Handling:** HTML bracket parameter parsing and validation
- **Occam's Razor:** Simplest solution following CLI method naming convention v0.1.2.2

**Usage Format (requirement-v0.1.2.2 compliance):**
- **Format Reference:** Follow requirement-v0.1.2.2 structure and presentation
- **Consistent Help:** Standardized usage display across all commands
- **Parameter Documentation:** Clear parameter format with examples

**Implementation Files Required:**
- **DefaultCLI Base Component:** `components/DefaultCLI/0.3.0.4/` structure
- **Enhanced DefaultUnit:** Additional methods for link management and source integration
- **Enhanced UnitCLI:** Integration with DefaultCLI base component
- **Updated Usage:** requirement-v0.1.2.2 format compliance

---

## **🎯 ACT**

**Task 19 Planning Complete:** Ready to create comprehensive task specification for advanced CLI commands

**Next Steps:** Create Task 19 with:
1. **Advanced CLI Commands:** Complete specification for link, list, from, definition commands
2. **DefaultCLI Architecture:** Dependency-free base component design
3. **Implementation Strategy:** Systematic approach for CLI enhancement
4. **Usage Format Compliance:** requirement-v0.1.2.2 format integration

**Foundation Integration:** Advanced CLI commands will leverage Unit Terminal Identity (uni-t) system for complete source traceability and link management

## **💫 EMOTIONAL REFLECTION: Advanced CLI Planning**

### **CLI Enhancement Vision:**
**EXCITED** Excitement about implementing comprehensive CLI system for complete unit management and source integration.

### **Architecture Integration:**
**CONFIDENT** Confidence in integrating DefaultCLI base component with existing Unit Terminal Identity foundation.

### **User Experience Focus:**
**MOTIVATED** Motivation to create intuitive CLI commands following established format standards.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Advanced CLI Planning:** Comprehensive command specification with DefaultCLI base component integration
- ✅ **Architecture Foundation:** Building on Unit Terminal Identity system for enhanced functionality
- ✅ **Format Compliance:** Following requirement-v0.1.2.2 structure for consistent user experience
- ✅ **Implementation Strategy:** Systematic approach for CLI enhancement and dependency management

**Quality Impact:** Advanced CLI commands will provide complete unit management capabilities with source traceability

**Next PDCA Focus:** Create Task 19 specification and implement once accepted

---

**🎯 Task 19 planning complete - advanced CLI commands with DefaultCLI integration! 📋🔧⚡**

**"Always 4 2 (FOR TWO) - advanced CLI commands enable complete unit management and source traceability."** 🖥️🔗

---

### **📚 The 42 Revelation**
**Understanding requires comprehensive tooling:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../../../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨