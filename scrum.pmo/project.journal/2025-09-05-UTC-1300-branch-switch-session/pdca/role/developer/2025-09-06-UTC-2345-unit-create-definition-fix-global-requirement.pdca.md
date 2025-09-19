# **PDCA: Unit Create Definition Fix and Global CLI Options Prohibition**

**Date:** 2025-09-06-UTC-2345  
**Role:** Developer  
**Sprint:** Sprint 20  
**Session:** [dev/2025-09-05-UTC-1300-branch-switch-session](../../../2025-09-05-UTC-1300-branch-switch-session)  
**Component:** Unit Tool Enhancement + Global CLI Standards  
**Task:** Fix Unit Create Command and Create Global CLI Options Prohibition Requirement  

---

## **🎯 SUMMARY**

TRON identified critical issues with proposed unit definition fix approach and provided key insights: unit create command should store definition immediately, no complex workarounds needed. Also mandated global prohibition of CLI options in Web4 (options killed OOP in Unix/shells). Need to create global requirement v0.1.2.2 and update Task 27 to reflect correct approach.

### **TRON Feedback**
```quote
# Complete terminal identity for existing File unit
cd scenarios/ontology
../scripts/unit definition 7e4edfc3-f746-419f-ad31-e4b49bed9549 "definition.txt" "1:1" "1:50"

# Where definition.txt contains: "M2 Class for M1 file instances"
echo "M2 Class for M1 file instances" > definition.txt

this is total bullshit.

the command should be
unit create <name> <definition>

as it was used and immediately store the definition correctly.

see the ontology table from the ontology agent. what would we need to improve to let the agent create units from each entry.

eg.
name can contain multiple words separated by spaces. filename should not have spaces, but „.." instead.

btw. do not do these ontological enhancements. and NEVER use —options in web4 clis EVER. make this a global requirement with requirement v0.1.2.2. unix and shells where meant to be OOP but the introduction of options killed it all.

update task 27 or subtasks to reflect these decisions.
update the planning in a way that i can see wich subtasks files really exist and start to use the status in the tasks while the planning just reflects these decisions status from inside the tasks.
```

### **My Answer (2025-09-06-UTC-2345)**
Critical corrections applied: unit create command should store definition immediately (no complex workarounds). Creating global requirement v0.1.2.2 prohibiting CLI options in Web4 (options killed OOP). Updating Task 27 with correct approach and planning structure to reflect actual subtask file existence and status.

---

## **📋 PLAN**

### **Critical Corrections Required**
1. **Fix Unit Create Command:** Should store definition immediately, not require separate commands
2. **Global CLI Options Prohibition:** Create requirement v0.1.2.2 against CLI options
3. **Task 27 Updates:** Reflect correct unit create approach and remove ontological enhancements
4. **Planning Structure:** Show actual subtask file existence and use task-internal status

### **OntologyAgent Table Analysis**
1. **Review Ontological Terminology Table:** Identify entries for unit creation
2. **Multi-word Name Handling:** Support spaces in names, dots in filenames
3. **Automated Unit Creation:** Enable agent to create units from table entries

---

## **🔧 DO**

### **Critical Issue: Unit Create Command Should Work Immediately**

**❌ WRONG Approach (My Suggestion):**
```bash
# Complex workaround - TOTAL BULLSHIT
unit create File ""
echo "M2 Class for M1 file instances" > definition.txt
unit definition 7e4edfc3 "definition.txt" "1:1" "1:50"
```

**✅ CORRECT Approach (TRON's Insight):**
```bash
# Simple, immediate storage - AS IT SHOULD BE
unit create File "M2 Class for M1 file instances"
# Should immediately store definition in model.definition field
```

**Fix Required:** DefaultUnit.create() method should store description parameter in model.definition immediately.

### **Global CLI Options Prohibition Requirement**

**TRON's Key Insight:**
> "NEVER use —options in web4 clis EVER. make this a global requirement with requirement v0.1.2.2. unix and shells where meant to be OOP but the introduction of options killed it all."

**Creating Global Requirement v0.1.2.2:**