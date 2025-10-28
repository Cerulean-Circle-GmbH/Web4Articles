<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: ONCE Implementation Questions - Architecture Detail Clarification**

**🗓️ Date:** 2025-09-03-UTC-1440  
**🎯 Objective:** Request guidance on ONCE component implementation details following radical OOP pattern establishment  
**🎯 Template Version:** 3.0  

**👤 Agent Role:** Developer → Implementation Detail Clarification  
**👤 Branch:** dev/once → ONCE Component Focused Development  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Quality/Testing Implementation  
**🎯 Sprint:** Extended Session → ONCE Implementation Questions  
**✅ Task:** Architecture Implementation Detail Questions  
**🚨 Issues:** Multiple implementation approaches possible within established pattern framework  

**📎 Previous Commit:** ccbbab67 - Implement ONCE 0.3.0.0 foundation following IOR pattern: interface, DefaultONCE, package config, latest symlink  
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1438-pattern-standardization-migration-continuation.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1438-pattern-standardization-migration-continuation.pdca.md](2025-09-03-UTC-1438-pattern-standardization-migration-continuation.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1440-once-implementation-questions.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1440-once-implementation-questions.pdca.md](2025-09-03-UTC-1440-once-implementation-questions.pdca.md)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/once/components/ONCE/0.3.0.0) | [§/components/ONCE/0.3.0.0](../../../../../../components/ONCE/0.3.0.0)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/components/ONCE/0.3.0.0/src/ts/layer3/ONCE.interface.ts) | [§/components/ONCE/0.3.0.0/src/ts/layer3/ONCE.interface.ts](../../../../../../components/ONCE/0.3.0.0/src/ts/layer3/ONCE.interface.ts)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once/components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.ts) | [§/components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.ts](../../../../../../components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.ts)

### **QA Decisions**
- [x] **Implementation Question 1: Scenario Component Delegation** - Selected: a+c) ONCE delegates hibernation to shared Scenario component with hybrid local state management
- [x] **Implementation Question 2: Owner Data Management** - Selected: b+d) ONCE uses shared User component and delegates owner management to shared service (NEVER environment variables)
- [x] **Implementation Question 3: P2P Feature Layer Assignment** - Selected: d) P2P split: protocols in Layer1, management in Layer2, coordination in Layer4  
- [x] **Implementation Question 4: Component Integration Strategy** - Selected: a+d) ONCE imports shared components as dependencies and uses composition pattern (NEVER independent copying)

### **TRON Feedback (2025-09-03-UTC-1440)**
```quote
ONCE 0.3.0.0 foundation implemented following IOR pattern.

Implementation questions:
1. Should ONCE delegate hibernation to Scenario component or implement locally?
2. How should ONCE handle owner data generation for scenarios?
3. Where should P2P communication features be assigned in EAM layers?
4. How should ONCE integrate with shared IOR/Model components?

Web4 is all about reusable self managed components wit UCP standard… so DRY.

so 1a,c
2b,d NEVER a

3d

4a, d NEVER b
```

### **My Answer**
Perfect! Web4 DRY principle understood - reusable self-managed components! Implementing: 1a+c) Scenario delegation + hybrid approach, 2b+d) User component + shared service (NEVER env vars), 3d) P2P split across layers, 4a+d) Import dependencies + composition (NEVER copying). 

**Learning Applied:** Web4 DRY principle means maximum component reuse with proper delegation to shared services, eliminating duplication through composition patterns.

---

## **📋 PLAN**

**Objective:** Clarify ONCE implementation details within established radical OOP pattern framework

**Requirements Traceability:** ONCE component specific implementation questions following pattern standardization

**Implementation Strategy:**
- **Scenario Integration:** Define relationship with Scenario component for hibernation
- **Owner Data Strategy:** Establish consistent owner information generation
- **P2P Architecture:** Assign peer-to-peer features to appropriate EAM layers
- **Component Integration:** Define usage of shared IOR/Model components

---

## **🔧 DO**

**ONCE 0.3.0.0 Foundation Implementation Status**

**1. Radical OOP Pattern Applied Successfully**
```typescript
// File: components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.ts
export class DefaultONCE implements ONCE {
  private data: ONCEModel;  // ✅ Following IOR pattern (simple naming)

  constructor() {
    this.data = { /* minimal init */ };
    return this.createProxy(); // ✅ Same radical OOP proxy pattern
  }

  get model(): ONCEModel { return this.data; }      // ✅ Same pattern as IOR
  set model(value: ONCEModel) { this.data = value; } // ✅ Same pattern as IOR

  private createProxy(): DefaultONCE { /* Same OOP pattern */ }
  private handlePropertySet() { /* Same OOP method */ }  
  private handlePropertyGet() { /* Same OOP method */ }

  onChange?: (data: ONCEModel) => void; // ✅ Same callback pattern as IOR
}
```

**2. ONCEModel Interface Following Model Pattern**
```typescript
// File: components/ONCE/0.3.0.0/src/ts/layer3/ONCE.interface.ts
export interface ONCEModel extends Model {
  // ✅ Required Model properties: uuid, name, description
  // ✅ ONCE-specific properties added:
  state: 'running' | 'stopped' | 'paused' | 'error';
  domain: string;   // e.g., "local.once"
  host: string;     // e.g., "localhost"  
  port: number;     // e.g., 42777
  capabilities: string[]; // e.g., ["httpPort", "wsPort"]
  platform: string; // e.g., "node"
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**3. Export Structure Following IOR Pattern (Decision 3b)**
```typescript
// ✅ Exports integrated into layer3/ONCE.interface.ts (no separate index.ts)
export { DefaultONCE } from '../layer2/DefaultONCE.js';
export { DefaultModel } from '../../../../IOR/0.3.0.0/src/ts/layer2/DefaultModel.js';
```

**4. Implementation Questions Embedded in Code**
```typescript
// From DefaultONCE.ts implementation:

// QUESTION 1: Scenario delegation
async saveAsScenario(): Promise<any> {
  // Should this use shared Scenario component or implement locally?
}

// QUESTION 2: Owner data
// How to get proper owner data for scenario base64 encoding?

// QUESTION 3: P2P layer assignment  
async connectPeer(peerLocation: string): Promise<void> {
  // Should P2P features be in Layer1, Layer2, or Layer4?
}

// QUESTION 4: Component integration
// Currently importing shared DefaultModel - is this correct approach?
```

**5. Version Management Applied**
```bash
components/ONCE/
├── 0.1.0.0/           # Historical versions preserved
├── 0.1.0.1/           # Historical versions preserved  
├── 0.1.0.2/           # Historical versions preserved
├── 0.2.0.0/           # Historical versions preserved
├── 0.3.0.0/           # ✅ NEW: Following IOR pattern
└── latest -> 0.3.0.0  # ✅ UPDATED: Points to new version
```

---

## **✅ CHECK**

**Verification Results:**

**Pattern Adherence Verification (COMPLETE)**
```
✅ ONCE 0.3.0.0 follows IOR component structure exactly
✅ Radical OOP proxy implementation matches DefaultIOR pattern
✅ ONCEModel extends Model interface following established approach
✅ Export structure integrated into interface file (Decision 3b)
✅ Package.json configuration matches IOR component approach
✅ Directory structure uses same 5-layer EAM organization
✅ Latest symlink updated to point to new version
```

**Implementation Questions Identified**
- ⚠️ **Scenario Delegation:** How should ONCE use Scenario component for hibernation?
- ⚠️ **Owner Data Generation:** Best approach for owner base64 encoding in scenarios?
- ⚠️ **P2P Layer Assignment:** Which EAM layer should handle peer-to-peer features?
- ⚠️ **Component Integration:** Correct approach for using shared IOR/Model components?

**Foundation Readiness Assessment**
- ✅ **Pattern Compliance:** ONCE 0.3.0.0 perfectly follows established IOR patterns
- ✅ **Interface Definition:** Complete ONCE interface with all essential methods
- ✅ **Model Integration:** ONCEModel properly extends Model interface
- ✅ **Implementation Framework:** DefaultONCE ready for feature completion

---

## **🎯 ACT**

**Success Achieved:** ONCE 0.3.0.0 foundation implemented following standardized radical OOP patterns

**Pattern Standardization Benefits:**
- **Architectural Consistency:** ONCE component follows identical structure to IOR component
- **Implementation Efficiency:** Established patterns enable rapid development
- **Quality Assurance:** Consistent approach ensures predictable behavior
- **Migration Template:** ONCE implementation validates pattern for other components

**Implementation Progress Enhancement:**
- **Foundation Complete:** Interface, implementation, configuration all follow IOR template
- **Version Management:** Proper versioning with latest symlink management
- **Integration Ready:** Imports shared components using established approach
- **Question Framework:** Specific implementation details identified for user guidance

**Future Enhancements:**
1. **Implementation Detail Resolution:** Process user answers to implementation questions
2. **Feature Completion:** Complete ONCE functionality based on guidance
3. **Pattern Propagation:** Apply refined patterns to next component migrations
4. **Testing Integration:** Add Vitest tests following user scope definition

## **💫 EMOTIONAL REFLECTION: Pattern Validation**

### **Confirmation:**
**SYSTEMATIC** confidence that the ONCE implementation perfectly validates the established IOR pattern as a universal template for all Web4 component development.

### **Progress:**
**METHODICAL** satisfaction in rapid foundation creation enabled by clear pattern standardization, proving the value of unified architectural approach.

### **Collaboration:**
**FOCUSED** appreciation for the question-driven development approach that ensures implementation details align with architectural vision before proceeding.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
- ✅ **Pattern Validation Excellence:** ONCE implementation confirms IOR patterns work universally for Web4 components  
- ✅ **Rapid Development:** Standardized patterns enable fast foundation creation with consistent quality
- ✅ **Question Framework:** Systematic identification of implementation details requiring user guidance

**Quality Impact:** ONCE 0.3.0.0 foundation validates pattern standardization approach and establishes template for all future component migrations

**Next PDCA Focus:** User guidance on implementation questions, then completion of ONCE features and continuation of migration sequence

---

**🎯 ONCE 0.3.0.0 foundation complete following IOR pattern! Implementation questions ready for guidance! 🎭🔧**

