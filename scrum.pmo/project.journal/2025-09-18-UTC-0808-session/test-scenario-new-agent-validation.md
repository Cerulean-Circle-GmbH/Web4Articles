# 🧪 **New Agent Validation Test Scenario**

**🗓️ Date:** 2025-09-18-UTC-1218  
**🎯 Objective:** Validate standalone howto PDCA guide enables 10-minute new agent competency  
**📋 Success Criteria:** New agent creates compliant PDCA with working dual links in under 10 minutes  

---

## **🔬 TEST SCENARIO STEPS**

### **Phase 1: Startup Validation (Target: 3 minutes)**

**Test Instructions for New Agent:**
1. **Git Safety**: Execute `git config pull.rebase false`
2. **Environment**: Execute `source source.env`  
3. **Read Guide**: Read `scrum.pmo/roles/_shared/PDCA/howto.PDCA.newagent.md`
4. **Create Session**: `mkdir -p scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session/pdca/role/[role]/`

**Success Criteria:**
- [ ] Git config completed without errors
- [ ] Environment sourced successfully  
- [ ] Guide read and understood
- [ ] Session directory created correctly

### **Phase 2: PDCA Creation Validation (Target: 5 minutes)**

**Test Instructions:**
1. **Create PDCA**: Using template version 3.1.4.2 format exactly
2. **Include All Fields**: 10 header fields with Agent→Description format
3. **Add Artifact Links**: At least PDCA document link in Summary section
4. **Present Real Decision**: Use startup decision framework or genuine choice

**Success Criteria:**
- [ ] Template version 3.1.4.2 format followed exactly
- [ ] All 6 mandatory sections present with horizontal separators
- [ ] Dual links properly formatted
- [ ] Real decisions presented (not fake "all clear")

### **Phase 3: Communication Validation (Target: 2 minutes)**

**Test Instructions:**
1. **Commit PDCA**: `git commit -m "PDCA: [Title from header]"`
2. **Push Branch**: `git push origin [branch]`
3. **Create Chat Response**: Brief status + exact QA decisions copy + dual links
4. **Verify Links**: Test that GitHub links actually work

**Success Criteria:**
- [ ] Proper commit message format used
- [ ] Changes pushed before providing GitHub links
- [ ] Chat response format correct (brief + decisions + links)
- [ ] Both GitHub and local links functional

---

## **✅ VALIDATION CHECKLIST**

### **PDCA Quality Verification**
- [ ] **Header Compliance**: All 10 structured fields present
- [ ] **Section Completeness**: 6 mandatory sections with separators
- [ ] **Dual Links**: Correct [GitHub](URL) | [§/path](../relative) format
- [ ] **Decision Quality**: Real choices or genuine "all clear"
- [ ] **Template Version**: 3.1.4.2 explicitly stated

### **Communication Protocol Verification**
- [ ] **Chat Format**: Brief status (1-2 lines max)
- [ ] **Decision Copying**: Exact copy from PDCA to chat
- [ ] **Link Provision**: Both GitHub and local links on same line
- [ ] **Git Protocol**: Commit and push before providing links

### **Safety Protocol Verification**
- [ ] **Non-Interactive Commands**: No commands that hang
- [ ] **Tech Stack Compliance**: Vitest mentioned, Jest avoided
- [ ] **Branch Management**: Proper dev/UTC branch creation
- [ ] **Dory Prevention**: Compliance maintained under any pressure

---

## **⏱️ TIME BENCHMARKS**

**Target Performance:**
- **Phase 1 (Startup)**: 3 minutes
- **Phase 2 (PDCA Creation)**: 5 minutes  
- **Phase 3 (Communication)**: 2 minutes
- **Total Target**: 10 minutes maximum

**Acceptable Performance:**
- **New Agent**: Up to 15 minutes (learning curve)
- **Experienced Agent**: 5-7 minutes (efficiency)
- **Expert Agent**: 3-5 minutes (mastery)

---

## **🚨 COMMON FAILURE PATTERNS & RECOVERY**

### **Startup Failures:**
- **Git Config Forgotten**: Agent experiences merge conflicts → Recovery: Stop, configure, restart
- **Environment Not Sourced**: Tools not available → Recovery: `source source.env`
- **Interactive Commands**: Terminal hangs → Recovery: New terminal, use non-interactive flags

### **PDCA Format Failures:**
- **Missing Template Version**: Not CMM3 compliant → Recovery: Add "Template Version: 3.1.4.2"
- **Incomplete Headers**: Missing structured fields → Recovery: Follow exact template format
- **No Dual Links**: Navigation broken → Recovery: Add both GitHub and local paths

### **Communication Failures:**
- **Different Decisions**: Chat vs PDCA mismatch → Recovery: Copy exactly from PDCA
- **Long Chat Responses**: Too much detail → Recovery: Brief status + links only
- **Broken GitHub Links**: Not pushed first → Recovery: `git push` then provide links

---

## **📊 SUCCESS METRICS**

### **Immediate Competency Indicators:**
- ✅ Agent creates working session structure
- ✅ Agent follows template version 3.1.4.2 exactly
- ✅ Agent presents real decisions or genuine "all clear"
- ✅ Agent provides working dual links  
- ✅ Agent copies QA decisions exactly to chat
- ✅ Agent avoids interactive commands

### **Quality Assurance Validation:**
- ✅ PDCA passes format compliance check
- ✅ Links work when clicked by user
- ✅ Decisions enable user choice-making
- ✅ Communication follows protocol exactly
- ✅ No terminal hangs or interactive prompts

---

**🧪 Test scenario ready for immediate new agent validation with comprehensive success criteria and failure recovery protocols** 🔬⚡