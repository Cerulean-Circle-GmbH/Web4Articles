# 📋 **PDCA Cycle: Component Versions Comparison - Compare Unit 0.3.0.5, Web4Requirement 0.3.0.5, ONCE 0.2.0.0**

**🗓️ Date:** 2025-09-19-UTC-1416  
**🎯 Objective:** Summarize learnings and differences across three components  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Background Agent → Component reviewer  
**👤 Agent Role:** Developer → Web4Articles  
**👤 Branch:** dev/unit0305 → Feature work and documentation  
**🔄 Sync Requirements:** none → n/a  
**🎯 Project Journal Session:** 2025-09-18-UTC-1316-session → Web4Articles
**🎯 Sprint:** current → Web4Articles
**✅ Task:** Read components and document differences  
**🚨 Issues:** Version divergence in tooling and engines; test coverage variance  

**📎 Previous Commit:** 9ea907791eef144ad67ae5c41999b5e17f99d32c - PDCA: complete all sections and Artifact Links for ontology nouns review  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/2025-09-19-UTC-1402-ontology-nouns-index-review.md) | [§/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/2025-09-19-UTC-1402-ontology-nouns-index-review.md](./2025-09-19-UTC-1402-ontology-nouns-index-review.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- PDCA Document: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/2025-09-19-UTC-1416-component-versions-comparison.md) | [§/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/2025-09-19-UTC-1416-component-versions-comparison.md](./2025-09-19-UTC-1416-component-versions-comparison.md)
- Read: Unit 0.3.0.5: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/unit0305/components/Unit/0.3.0.5) | [§/components/Unit/0.3.0.5](../../../../components/Unit/0.3.0.5)
- Read: Web4Requirement 0.3.0.5: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/unit0305/components/Web4Requirement/0.3.0.5) | [§/components/Web4Requirement/0.3.0.5](../../../../components/Web4Requirement/0.3.0.5)
- Read: ONCE 0.2.0.0: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/unit0305/components/ONCE/0.2.0.0) | [§/components/ONCE/0.2.0.0](../../../../components/ONCE/0.2.0.0)

### **Key Learnings**
- All components are ESM-native with TypeScript and Vitest; versions diverge in Node engines and dependency versions.
- Unit depends on local DefaultCLI 0.3.0.4; Web4Requirement adds CLI exports and uuid; ONCE includes ws and richer CLI/bin tooling.
- Test setup: Unit/Web4Requirement have vitest.config.ts and tests; ONCE has no test folder at this version.

### **Differences Table**

| Aspect | Unit 0.3.0.5 | Web4Requirement 0.3.0.5 | ONCE 0.2.0.0 |
|---|---|---|---|
| package name | @web4/unit | web4-requirement | @web4/once |
| version | 0.3.0.5 | 0.3.0.5 | 0.2.0.0 |
| engines.node | (not specified) | >=14.0.0 | >=18.0.0 |
| scripts.test | vitest | vitest | vitest (plus test:server) |
| devDependencies.vitest | ^3.2.4 | ^1.0.0 | ^0.34.0 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 | ^5.2.2 |
| dependencies | @web4/defaultcli (local 0.3.0.4) | uuid ^9 | uuid ^11.1.0, ws ^8.14.2, @types/uuid ^10 |
| CLI export | UnitCLI (layer5) | RequirementCLI (exports ./cli) | ONCECLI (bin + layer5) |
| vitest.config.ts | present (10s timeout) | present (30s timeout, excludes dist) | (not found) |
| tests present | yes (2 files) | yes (regression test) | none found |

### **QA Decisions**
- [x] Completed decision: Read three components and document differences
- [ ] Decision 1: Align testing/tooling versions
  - a) Upgrade all to vitest ^3.x and TS ^5.2+
  - b) Keep as-is; align later during component releases
  - c) Align ONCE only (raise vitest/node engine), leave others

### **TRON Feedback (2025-09-19T14:16:00Z)**
```quote
read 
Unit/0.3.0.5
and
web4requirement/0.3.0.5
and
ONCE/0.2.0.0

pdca about your learnings and make a table about differences.

you always have to fill out the complete pdca not make me tell you everytime!
```

### **My Answer**
Understood. I reviewed the three components, built a differences table, populated all PDCA sections, and added complete Artifact Links. Going forward, I will always fully complete PDCAs without reminders.

**Learning Applied:** Always fill every PDCA section and include dual links for all read and created artifacts.

---

## **📋 PLAN**

**Objective:** Compare component versions and document actionable alignment options.

**Requirements Traceability:** e8535c4e-591d-4955-9874-6a853545e970; 857ff118-a4df-46b3-88b6-c6dc77c082b6

**Implementation Strategy:**
- **Discovery:** Read package.json, vitest configs, tests
- **Analysis:** Build concise differences table and key learnings
- **Compliance:** Fill all PDCA sections; add dual links

---

## **🔧 DO**

**Comparison Execution**

1. Read key files (package.json, vitest.config.ts, test directories)
2. Build differences table and Artifact Links

---

## **✅ CHECK**

**Links (ok)**
```
All Artifact Links resolve (GitHub | §/).
```

**Completeness (ok)**
```
Differences table included; key aspects compared.
```

**TRON QA Feedback Validation**
> **"fill out the complete pdca"**

**Verification**
- ✅ All PDCA sections populated
- ✅ Dual links present for read and created artifacts

---

## **🎯 ACT**

**Success Achieved:** Comparison completed; PDCA fully filled; links verified.

**Benefits:**
- Clear view of version/tooling differences
- Basis for alignment decisions (testing/node engines)

**Future Enhancements:**
1. Propose alignment PRs per chosen option
2. Add ONCE tests at 0.2.0.0 or document rationale
3. Standardize vitest/TypeScript versions across components

## **💫 EMOTIONAL REFLECTION: Confident and systematic**

### **Confidence:**
**High** Process clarity after full PDCA completion.

### **Clarity:**
**High** Differences and options are explicit.

### **Focus:**
**Medium** Prioritize test/version alignment next.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ Always complete PDCA sections and dual-link all artifacts

**Quality Impact:** Higher traceability and decision readiness

**Next PDCA Focus:** Draft alignment plan for testing/tooling versions

---

**🎯 Comparison done; PDCA complete; links verified. ✅🔎📚**

**"Consistency is a feature: complete documentation enables faster, safer change."** 🔧📊

---

### **📚 The 42 Revelation**
**Understanding requires regression testing:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨