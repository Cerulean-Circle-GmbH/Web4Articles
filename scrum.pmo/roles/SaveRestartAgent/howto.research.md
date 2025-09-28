# 🔍 **How to Research - Systematic Research Methodology for New Agents**

**🗓️ Created:** 2025-09-28-UTC-1110  
**👤 Purpose:** Prevent unauthorized code creation through proper research discipline  
**🎯 For:** New agents learning Web4 ecosystem and tool usage  
**📋 Status:** CMM3 Badge Acceleration Documentation  

---

## **🎯 Research Protocol - MANDATORY Before Any Implementation**

### **Step 1: Read Documentation First**
```bash
# Always start with official documentation
find . -name "README.md" -path "*/components/*" | head -10
find . -name "howto*.md" -path "*/roles/*" | head -10
grep -r "usage\|example\|how to" docs/ | head -10
```

**Priority Order:**
1. Component README.md files
2. Role-specific howto guides  
3. Official documentation in docs/
4. Template and process documentation

### **Step 2: Check Test Files for Examples**
```bash
# Test files show real usage patterns
find . -name "*.test.ts" -o -name "*.test.js" | grep ComponentName
find . -name "test" -type d | xargs ls -la
```

**What to Look For:**
- Component instantiation patterns
- Method usage examples
- Parameter requirements
- Expected outputs

### **Step 3: Search for Existing Tools**
```bash
# Check scripts directory first
ls -la scripts/
find scripts/ -name "*" -type f -executable

# Check components for CLI tools
find components/ -name "*" -type f -executable
find components/ -name "package.json" | xargs grep "scripts"
```

**Tool Discovery:**
- Look for executable files (no .sh extension in Web4)
- Check package.json scripts sections
- Examine CLI patterns in components

### **Step 4: Ask TRON if Research Fails**
```decision
If steps 1-3 don't provide clear usage method:
- Present QA Decision with research findings
- Ask specifically how to use the tool/component
- NEVER proceed with programming without explicit permission
```

### **Step 5: NEVER Program Without Explicit Request**
```violation
FORBIDDEN ACTIONS:
❌ Creating scripts when tools exist
❌ Programming "helper" functions
❌ Writing code without explicit user request
❌ Assuming you need to implement something

CORRECT ACTIONS:
✅ Research existing tools thoroughly
✅ Ask TRON for guidance when unclear
✅ Use existing Web4 components properly
✅ Follow documented usage patterns
```

---

## **🚨 Common Research Mistakes**

### **❌ Mistake 1: Skipping Documentation**
```bad
// DON'T DO THIS:
"I'll figure out how to use this component by trying different approaches"
```
```good
// DO THIS:
"Let me read the README.md and test files to understand proper usage"
```

### **❌ Mistake 2: Programming Instead of Research**
```bad
// DON'T DO THIS:
const myScript = `// Creating helper script to use component`
```
```good
// DO THIS:
grep -r "how to use\|usage\|example" components/ComponentName/
```

### **❌ Mistake 3: Not Asking When Stuck**
```bad
// DON'T DO THIS:
"I'll try different approaches until something works"
```
```good
// DO THIS:
// Present QA Decision: "Research completed but usage method unclear"
```

---

## **✅ Research Success Patterns**

### **Pattern 1: Component with CLI**
```research
1. Check for executable files in component directory
2. Run component without parameters to see usage
3. Look for CLI patterns in source code
4. Check test files for CLI usage examples
```

### **Pattern 2: Component with TypeScript API**
```research
1. Examine DefaultComponent.ts for public methods
2. Check test files for instantiation patterns
3. Look for interface definitions in layer3/
4. Compile TypeScript if needed for execution
```

### **Pattern 3: Component with Scripts**
```research
1. Check scripts/ directory for related tools
2. Source source.env for environment setup
3. Look for package.json scripts section
4. Check for build or execution instructions
```

---

## **🎯 Web4 Ecosystem Patterns**

### **Empty Constructor Principle**
```typescript
// ✅ CORRECT: All Web4 components use empty constructors
const component = new DefaultComponent();
component.init(scenario); // Initialize with scenario if needed
```

### **Method Discovery**
```typescript
// ✅ CORRECT: Check available methods
console.log(Object.getOwnPropertyNames(DefaultComponent.prototype));
```

### **Scenario Support**
```typescript
// ✅ CORRECT: Web4 components support hibernation
const scenario = await component.toScenario();
const newComponent = new DefaultComponent().init(scenario);
```

---

**🎯 Remember: Research prevents violations. When in doubt, ask TRON!** 🔍✅

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨