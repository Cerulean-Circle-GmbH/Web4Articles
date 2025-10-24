<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../LICENSE) and AI-GPL Addendum (../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle {{CYCLE_NUMBER}}: {{PDCA_TITLE}}**

**🗓️ Date:** {{UTC_TIMESTAMP}}  
**🎯 Objective:** {{OBJECTIVE}}  
**👤 Role:** {{ROLE_NAME}}  
**🚨 Issues:** {{KEY_ISSUES}}

---

## **📊 Summary**

{{BRIEF_ISSUE_DESCRIPTION}}

### **🔗 Artifact Links**

{{#each ARTIFACTS}}
[GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})
{{/each}}

### **⚖️ QA Decisions Required**

{{#each QA_DECISIONS}}
- [{{STATUS}}] **{{DECISION_TITLE}}**: {{DECISION_DESCRIPTION}}
{{/each}}

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
**User Feedback:** {{QA_FEEDBACK_VERBATIM}}

### **{{CHECK_CATEGORY_1}}**
{{#each CHECK_ITEMS_1}}
✅ **{{ITEM_TITLE}}**: {{ITEM_DESCRIPTION}} ✅  
{{/each}}

### **{{CHECK_CATEGORY_2}}**
{{#each CHECK_ITEMS_2}}
❌ **{{ITEM_TITLE}}**: {{ITEM_DESCRIPTION}} ❌  
{{/each}}

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
{{#each ROLE_LEARNING}}
✅ **{{LEARNING_TITLE}}**: {{LEARNING_DESCRIPTION}} ✅  
{{/each}}

### **Process Learning**
{{#each PROCESS_LEARNING}}
- **{{LEARNING_TITLE}}**: {{LEARNING_DESCRIPTION}}
{{/each}}

---

**📊 Summary:** {{FINAL_SUMMARY}} 🚨📋✅
