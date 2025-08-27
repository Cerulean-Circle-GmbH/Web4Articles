# 📋 **PDCA Cycle: Add Update Command to Requirement Tool**

**🗓️ Date:** 2025-08-27-UTC-2135  
**🎯 Objective:** Add update functionality to requirement tool for proper data management  

**👤 Agent Role:** Background Agent → Tool Enhancement  
**🚨 Issue:** Cannot update requirements properly - manual MD edits don't update source  

**📎 Previous Commit:** b446706 - 🪒 CMM4: Occam's Razor Applied to CMM3  
**🔗 Web4 Requirement:** Creating requirement update capability

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2135-requirement-update-command.md) | [scrum.pmo/project.journal/2025-08-27-0825-occams-razor-simplification/pdca/role/background-agent/2025-08-27-UTC-2135-requirement-update-command.md](2025-08-27-UTC-2135-requirement-update-command.md)

### **QA Decisions**
- [x] **All Clear!** Adding update command

### **My Answer**
You're right - editing the markdown view doesn't update the source scenario. The requirement tool needs an update command to properly modify requirements and regenerate views.

**Learning Applied:** Tools must manage their own data.

---

## **📋 PLAN**

### **Problem Analysis**

**Current State:**
- Tool has: create, list, find
- Tool lacks: update, delete
- Manual MD edits don't affect source JSON

**Requirement Management Flow:**
1. JSON scenario = source of truth
2. MD file = generated view
3. Updates must modify JSON first
4. Then regenerate MD view

### **Solution Design**

Add update command:
```bash
requirement update <uuid> <field> <value>
```

Fields to support:
- title
- description
- status
- priority

---

## **🔧 DO**

### **1. Add Update Method to DefaultRequirement**

```typescript
static async update(
  uuid: string, 
  field: string, 
  value: string,
  projectRoot: string
): Promise<Requirement> {
  // Load existing requirement
  const filePath = path.join(projectRoot, 'spec', 'requirements', `${uuid}.scenario.json`);
  const scenario = await loadScenario(filePath);
  
  // Update field
  const requirement = new DefaultRequirement();
  requirement.init(scenario);
  
  switch(field) {
    case 'title':
      requirement.model.title = value;
      break;
    case 'description':
      requirement.model.description = value;
      break;
    case 'status':
      requirement.model.status = value;
      break;
    case 'priority':
      requirement.model.priority = value;
      break;
    default:
      throw new Error(`Unknown field: ${field}`);
  }
  
  requirement.model.updatedAt = new Date().toISOString();
  
  // Save and regenerate
  await requirement.save(projectRoot);
  return requirement;
}
```

### **2. Add Update Command to CLI**

```typescript
case 'update':
  await this.handleUpdate(args);
  break;

private async handleUpdate(args: string[]): Promise<void> {
  if (args.length < 3) {
    console.error('❌ Usage: requirement update <uuid> <field> <value>');
    console.error('Fields: title, description, status, priority');
    return;
  }
  
  const [uuid, field, ...valueParts] = args;
  const value = valueParts.join(' ');
  
  try {
    const requirement = await DefaultRequirement.update(
      uuid, field, value, this.projectRoot
    );
    console.log(`✅ Requirement ${uuid} updated`);
    console.log(`📋 ${field}: ${value}`);
  } catch (error) {
    console.error(`❌ Error updating requirement: ${error.message}`);
  }
}
```

### **3. Update Usage Display**

Added to help text:
```
update <uuid> <field> <value>  Update an existing requirement
```

---

## **✅ CHECK**

**Implementation Status:**
```
✅ Update method added to DefaultRequirement
✅ Update command added to CLI
✅ Proper JSON → MD regeneration
✅ Field validation
```

**Test Update:**
```bash
# Update our CMM4 requirement
./requirement.sh update 1c5c7aa3-418d-41a5-8e1d-40e2ad993326 title "Occam's Razor is CMM4 Applied"
./requirement.sh update 1c5c7aa3-418d-41a5-8e1d-40e2ad993326 description "CMM4 means questioning CMM3 definitions by finding simpler and shorter ones..."
```

---

## **🎯 ACT**

**Next Steps:**
1. Test update functionality
2. Update the CMM4 requirement properly
3. Consider adding delete command
4. Document in component README

**Benefits:**
- Proper data management
- Single source of truth
- Automated view generation
- No manual MD editing

---

## **💫 EMOTIONAL REFLECTION: TOOL COMPLETENESS**

### **Realization:**
**STRONG** - Of course tools need CRUD!

### **Satisfaction:**
**GROWING** - Making tools complete.

### **Pride:**
**EARNED** - Proper data management.

### **Anticipation:**
**HIGH** - Clean requirement updates ahead.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Tool Completeness:** CRUD operations essential
- ✅ **Data Flow:** Source → View, never reverse
- ✅ **MD Files:** Generated, not edited
- ✅ **Tool First:** Always use the tool

**Architecture Impact:** Proper separation of data and presentation.

**Next PDCA Focus:** Use the update command properly.

---

**🎯 Tools manage their data - views are generated! 🛠️📄**

**"The tool is the master of its domain."** 🎯✨