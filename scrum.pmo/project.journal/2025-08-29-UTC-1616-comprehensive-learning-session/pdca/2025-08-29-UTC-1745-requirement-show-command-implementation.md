# 📋 **PDCA Cycle: Requirement Show Command Implementation**

**📅 Date:** 2025-08-29 UTC 17:45  
**🎯 Objective:** Implement requirement show <uuid> command to display requirement markdown content in shell  
**👤 Role:** Developer  
**🚨 Issues:** Need CLI command to view requirement files directly without manual file navigation  
**📎 Previous Commit:** 69b39f8 - Add requirement show command: Display requirement markdown content by UUID with validation and error handling  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scrum.pmo/project.journal/2025-08-29-UTC-1616-comprehensive-learning-session/pdca/2025-08-29-UTC-1738-once-cli-web4-pattern-refactor.md) | [../2025-08-29-UTC-1738-once-cli-web4-pattern-refactor.md](../2025-08-29-UTC-1738-once-cli-web4-pattern-refactor.md)  

## 📋 **Summary**

### **Artifact Links**
- [GitHub: RequirementCLI.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/Web4Requirement/0.1.2.2/src/ts/layer5/RequirementCLI.ts) | [components/Web4Requirement/0.1.2.2/src/ts/layer5/RequirementCLI.ts](components/Web4Requirement/0.1.2.2/src/ts/layer5/RequirementCLI.ts)
- [GitHub: Global CLI Color Requirement](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/spec/requirements.md/71223733-75d1-4002-bee1-e004d5ccd76c.requirement.md) | [spec/requirements.md/71223733-75d1-4002-bee1-e004d5ccd76c.requirement.md](spec/requirements.md/71223733-75d1-4002-bee1-e004d5ccd76c.requirement.md)

### **QA Decisions**
- [x] Command accepts UUID parameter and validates format
- [x] Command displays full markdown content using cat-like behavior  
- [x] Error handling for invalid UUID format and missing files
- [x] Integration into CLI help text and command routing
- [x] TypeScript compilation successful without errors

---

## 🎯 **Plan**

### **Implementation Strategy**
1. **Add Command Handler:** Create `handleShow()` method in `RequirementCLI.ts`
2. **UUID Validation:** Implement regex validation for proper UUID format
3. **File Resolution:** Construct path to `spec/requirements.md/{uuid}.requirement.md`
4. **Error Handling:** Provide helpful error messages for validation failures
5. **CLI Integration:** Add to command routing and help documentation
6. **Testing:** Verify with actual requirement UUID from Global CLI Color Requirement

### **Technical Approach**
- Follow existing CLI patterns from `handleFind()` and other commands
- Use `readFileSync()` to display file contents directly to shell
- Implement comprehensive error handling with user-friendly messages
- Add to both regular command routing and component context routing

---

## 🔧 **Do**

### **Implementation Completed**
1. **✅ Command Handler Created:** Added `handleShow(args: string[])` method with UUID validation
2. **✅ UUID Validation:** Implemented regex pattern `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
3. **✅ File Path Construction:** Used `path.join(this.projectRoot, 'spec/requirements.md', ${uuid}.requirement.md)`
4. **✅ Error Handling:** Added validation for UUID format, file existence, and file read operations
5. **✅ Command Routing:** Integrated into both regular and component context command switches
6. **✅ Help Documentation:** Added usage examples and command descriptions
7. **✅ TypeScript Build:** Successfully compiled without errors

### **Key Implementation Details**
```typescript
private async handleShow(args: string[]): Promise<void> {
  // UUID validation with helpful error messages
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    console.error(`❌ Invalid UUID format: ${uuid}`);
    console.log('💡 UUID should be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    return;
  }
  
  // File resolution and content display
  const requirementFile = path.join(this.projectRoot, 'spec/requirements.md', `${uuid}.requirement.md`);
  const content = readFileSync(requirementFile, 'utf8');
  console.log(content);
}
```

---

## ✅ **Check**

### **QA Feedback**
*User Request: "add a requirement show <uuid> that cats its md file to the shell." - 2025-08-29T17:45:00Z*

### **Verification Results**
1. **✅ Command Functionality:** `requirement show 71223733-75d1-4002-bee1-e004d5ccd76c` successfully displays Global CLI Color Requirement markdown
2. **✅ UUID Validation:** Invalid format `invalid-uuid-format` properly rejected with helpful error message
3. **✅ Usage Help:** `requirement show` without parameters displays proper usage examples
4. **✅ Error Handling:** File not found scenarios handled gracefully with suggested next steps
5. **✅ Integration:** Command appears in help text and responds to both direct and component context usage

### **Testing Evidence**
- Command successfully displayed 47-line Global CLI Color Requirement markdown
- UUID validation correctly rejected malformed input with format guidance
- Error messages provide actionable guidance (use `requirement find` to locate requirements)
- Help text integration maintains consistency with existing CLI patterns

---

## 🚀 **Act**

### **PDCA Process Update**
- **Process Improvement:** Enhanced CLI usability by eliminating need for manual file path navigation
- **Developer Experience:** Requirement content now directly accessible via UUID reference
- **Error Prevention:** UUID validation prevents file system errors from malformed inputs
- **Documentation Enhancement:** Integrated help text guides users through proper command usage

### **Next Actions**
- Monitor usage patterns to identify potential enhancements
- Consider adding optional output formatting (e.g., `--format json` for API consumption)
- Evaluate integration with requirement search workflow (show after find)

### **Knowledge Retention**
- Web4Requirement CLI follows consistent pattern for command implementation
- UUID validation regex pattern: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
- File path construction uses `path.join()` for cross-platform compatibility
- Error handling provides actionable guidance rather than technical error dumps

---

**📋 One-line Summary:** Successfully implemented `requirement show <uuid>` command with UUID validation, error handling, and help integration - CLI now provides direct access to requirement markdown content 🎯✅📄
