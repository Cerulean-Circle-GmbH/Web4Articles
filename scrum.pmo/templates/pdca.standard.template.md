[Back to Session](../../../project.state.md) | [Journal Overview](../../../../../project.journal.overview.md)

# 📋 **PDCA Cycle: {{PDCA_TITLE}} - {{UTC_TIMESTAMP}}**

**🗓️ Date:** {{UTC_TIMESTAMP}}  
**🎯 Objective:** {{OBJECTIVE}}  
**👤 Role:** {{ROLE_NAME}}  
**🚨 Issues:** {{KEY_ISSUES}}

---

## **📊 Summary**

{{BRIEF_ISSUE_DESCRIPTION}}

### **🔗 Artifact Links**

- **{{PRIMARY_ARTIFACT}}**: [GitHub]({{PRIMARY_GITHUB_URL}}) | [{{PRIMARY_LOCAL_PATH}}]({{PRIMARY_LOCAL_PATH}})
- **{{SECONDARY_ARTIFACT}}**: [GitHub]({{SECONDARY_GITHUB_URL}}) | [{{SECONDARY_LOCAL_PATH}}]({{SECONDARY_LOCAL_PATH}})
- **This PDCA**: [GitHub]({{THIS_PDCA_GITHUB_URL}}) | [{{THIS_PDCA_LOCAL_PATH}}]({{THIS_PDCA_LOCAL_PATH}})

### **⚖️ QA Decisions Required**

- [ ] **{{QA_DECISION_1}}**: {{QA_DECISION_1_DESCRIPTION}}
- [ ] **{{QA_DECISION_2}}**: {{QA_DECISION_2_DESCRIPTION}}
- [ ] **{{QA_DECISION_3}}**: {{QA_DECISION_3_DESCRIPTION}}

---

## **📝 Plan**

### **Critical Issues to Address**
{{#each CRITICAL_ISSUES}}
{{INDEX}}. **{{ISSUE_TITLE}}**: {{ISSUE_DESCRIPTION}}
{{/each}}

### **{{PLAN_SCOPE_TITLE}}**
{{PLAN_SCOPE_DETAILS}}

---

## **🔧 Do**

### **{{DO_SECTION_TITLE}}**

{{#each DO_ACTIONS}}
#### **{{ACTION_CATEGORY}}**
{{ACTION_DETAILS}}
{{/each}}

---

## **✅ Check**

### **QA Feedback**
**Timestamp:** {{QA_TIMESTAMP}}  
**User Feedback:** "{{QA_FEEDBACK_VERBATIM}}"

### **{{CHECK_CATEGORY_1}}**
✅ **{{CHECK_ITEM_1}}**: {{CHECK_ITEM_1_DESCRIPTION}} ✅  
✅ **{{CHECK_ITEM_2}}**: {{CHECK_ITEM_2_DESCRIPTION}} ✅  
✅ **{{CHECK_ITEM_3}}**: {{CHECK_ITEM_3_DESCRIPTION}} ✅  

### **{{CHECK_CATEGORY_2}}**
❌ **{{CHECK_ITEM_FAIL_1}}**: {{CHECK_ITEM_FAIL_1_DESCRIPTION}} ❌  
❌ **{{CHECK_ITEM_FAIL_2}}**: {{CHECK_ITEM_FAIL_2_DESCRIPTION}} ❌  

---

## **🚀 Act**

### **Immediate Actions**
{{#each IMMEDIATE_ACTIONS}}
{{INDEX}}. **{{ACTION_TITLE}}**: {{ACTION_DESCRIPTION}}
{{/each}}

### **{{ACT_STRATEGY_TITLE}}**
{{ACT_STRATEGY_DETAILS}}

### **Critical Gap Priorities**
{{#each CRITICAL_GAPS}}
{{INDEX}}. **{{GAP_TITLE}}**: {{GAP_DESCRIPTION}}
{{/each}}

### **Success Metrics**
{{#each SUCCESS_METRICS}}
- {{METRIC_DESCRIPTION}}
{{/each}}

---

## **📋 PDCA Process Update**

### **{{ROLE_NAME}} Learning**
✅ **{{ROLE_LEARNING_1}}**: {{ROLE_LEARNING_1_DESCRIPTION}} ✅  
✅ **{{ROLE_LEARNING_2}}**: {{ROLE_LEARNING_2_DESCRIPTION}} ✅  
✅ **{{ROLE_LEARNING_3}}**: {{ROLE_LEARNING_3_DESCRIPTION}} ✅  

### **Process Learning**
- **{{PROCESS_LEARNING_1}}**: {{PROCESS_LEARNING_1_DESCRIPTION}}
- **{{PROCESS_LEARNING_2}}**: {{PROCESS_LEARNING_2_DESCRIPTION}}
- **{{PROCESS_LEARNING_3}}**: {{PROCESS_LEARNING_3_DESCRIPTION}}

---

**📊 Summary:** {{FINAL_SUMMARY}} 🚨📋✅

[Back to Session](../../../project.state.md) | [Journal Overview](../../../../../project.journal.overview.md)
