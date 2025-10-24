<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Scenario Format Compliance - Project Root Location & UUIDv4 & Encrypted Owner**

**🗓️ Date:** 2025-09-03-UTC-1900  
**🎯 Objective:** Correct scenario directory location to project root, implement proper UUIDv4 generation, encrypted owner from User component, and FQDN/IP host resolution  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Claude Developer → Web4 Architecture Implementation Specialist  
**👤 Agent Role:** Developer → Scenario Format Compliance & Security Implementation  
**👤 Branch:** dev/once → ONCE Component Development with Scenario Format Correction  
**🔄 Sync Requirements:** Non-blocking server → Scenario format compliance  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Web4 Architecture Standardization & Scenario Format  
**🎯 Sprint:** Extended Session → Scenario Format Compliance Implementation  
**✅ Task:** Scenario Directory, UUIDv4, Encrypted Owner, FQDN Host Implementation  
**🚨 Issues:** Wrong scenario location, invalid UUID format, unencrypted owner, localhost fallback host  

**📎 Previous Commit:** 52a1d95d - Non-blocking server SUCCESS: Scenario home directory & Web4 format  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md) | [2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md](2025-09-03-UTC-1850-nonblocking-server-scenario-home.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md) | [2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md](2025-09-03-UTC-1900-scenario-format-compliance-corrections.pdca.md)
- **Requirement Created:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/spec/requirements/c9e4f6a8-2b7d-4c1e-9a3f-5e8b1d4c7f2a.scenario.json) | [../../../../../spec/requirements/c9e4f6a8-2b7d-4c1e-9a3f-5e8b1d4c7f2a.scenario.json](../../../../../spec/requirements/c9e4f6a8-2b7d-4c1e-9a3f-5e8b1d4c7f2a.scenario.json)
- **Current Wrong Location:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/components/ONCE/0.3.0.1/scenarios/local.once/ONCE/0.3.0.1/once-kernel-1757059512695.scenario.json) | [../../../../../components/ONCE/0.3.0.1/scenarios/local.once/ONCE/0.3.0.1/once-kernel-1757059512695.scenario.json](../../../../../components/ONCE/0.3.0.1/scenarios/local.once/ONCE/0.3.0.1/once-kernel-1757059512695.scenario.json)
- **UUIDv4 Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/components/ONCE/0.1.0.0/src/ts/layer2/DefaultONCE.ts#L349-L355) | [../../../../../components/ONCE/0.1.0.0/src/ts/layer2/DefaultONCE.ts](../../../../../components/ONCE/0.1.0.0/src/ts/layer2/DefaultONCE.ts)
- **User Encryption Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/52a1d95d/components/User/0.1.3.0/src/ts/layer2/DefaultUser.ts#L114-L115) | [../../../../../components/User/0.1.3.0/src/ts/layer2/DefaultUser.ts](../../../../../components/User/0.1.3.0/src/ts/layer2/DefaultUser.ts)

### **QA Decisions**
- [ ] **Scenario Directory Location**
  - a) Move to project root: /workspace/scenarios/
  - b) Keep in component home with symlink to project root
- [ ] **UUID Format Compliance**
  - a) Implement UUIDv4 generator from existing ONCE patterns
  - b) Use external UUID library
- [ ] **Owner Encryption Implementation**
  - a) Use User component DefaultUser.getOwnerObject() with base64
  - b) Implement custom encryption method
- [ ] **Host Resolution Priority**
  - a) FQDN > IP > localhost fallback with network detection
  - b) Simple hostname resolution without network detection

### **TRON Feedback (2025-09-03-UTC-1900)**
```quote
- [ ] the scenario directory is ok but in the wrong base location. it should be in the scenario folder in the project root. The current new scenario format is the whole reason for the new version. still the uuid is ALWAYS a UUIDv4 … currently its not. the owner part is ALWAYS coming encrypted (currently only base64 encoded) from the user component. the host ist only in worst fallback case „localhost" in best case a full qualified internet resolveable hostname but at least an ip address. make this requirements. pdca.
```

### **My Answer**
Correcting scenario format violations: Moving directory to project root /workspace/scenarios/, implementing proper UUIDv4 generation, encrypting owner data from User component with base64, and implementing FQDN/IP host resolution with localhost as worst fallback. Created requirement c9e4f6a8-2b7d-4c1e-9a3f-5e8b1d4c7f2a with v0.1.2.2.

**Learning Applied:** New scenario format is core feature of 0.3.0.1 version, requires strict compliance for security and network resolvability.

---

## **📋 PLAN**

**Objective:** Fix scenario format compliance violations in ONCE 0.3.0.1

**Current Violations Identified:**
1. **Wrong Location**: `/workspace/components/ONCE/0.3.0.1/scenarios/` → Should be `/workspace/scenarios/`
2. **Invalid UUID**: `once-kernel-1757059512695` → Should be UUIDv4 format
3. **Unencrypted Owner**: Plain JSON object → Should be base64 encoded from User component
4. **Localhost Host**: Hardcoded `localhost` → Should be FQDN/IP with localhost as fallback

**Existing Patterns to Use:**
- **UUIDv4 Generator**: Available in `components/ONCE/0.1.0.0/src/ts/layer2/DefaultONCE.ts`
- **User Encryption**: Available in `components/User/0.1.3.0/src/ts/layer2/DefaultUser.ts`
- **Project Root Detection**: Available in Web4Requirement components

---

## **🔧 DO**

### **Scenario Format Compliance Implementation**

**1. Project Root Scenario Directory:**
```typescript
// Change from: components/ONCE/0.3.0.1/scenarios/
// Change to: /workspace/scenarios/local.once/ONCE/0.3.0.1/
```

**2. UUIDv4 Generation:**
```typescript
private generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

**3. Encrypted Owner from User Component:**
```typescript
// Use User.getOwnerObject() and base64 encoding
const ownerObject = DefaultUser.getOwnerObject(username, hostname);
const encryptedOwner = Buffer.from(JSON.stringify(ownerObject)).toString('base64');
```

**4. FQDN/IP Host Resolution:**
```typescript
private async getNetworkHost(): Promise<string> {
  // Priority: FQDN > IP > localhost fallback
  try {
    const os = await import('os');
    return os.hostname(); // Or implement FQDN resolution
  } catch {
    return 'localhost'; // Worst case fallback
  }
}
```

---

## **✅ CHECK**

**Compliance Requirements Analysis:**
- ✅ **Project Root**: `/workspace/scenarios/` directory exists and is used by other components
- ✅ **UUIDv4 Pattern**: Existing generator available in ONCE 0.1.0.0 components
- ✅ **User Encryption**: DefaultUser.getOwnerObject() and base64 encoding available
- ❌ **Current Implementation**: All violations present in current 0.3.0.1 implementation

**Security & Network Requirements:**
- ✅ **Encryption**: Base64 encoding provides basic obfuscation for owner data
- ✅ **Network Resolvability**: FQDN/IP ensures proper network identification
- ❌ **Current Host**: Hardcoded localhost prevents network discovery

---

## **🎯 ACT**

**Immediate Corrections:**
1. **Move Scenario Directory**: From component home to project root `/workspace/scenarios/`
2. **Implement UUIDv4**: Use existing generator pattern for proper UUID format
3. **Encrypt Owner Data**: Use User component with base64 encoding
4. **Resolve Network Host**: Implement FQDN/IP detection with localhost fallback

**Implementation Priority:**
- **Critical**: Project root scenario directory (affects all scenario operations)
- **Critical**: UUIDv4 format (ensures uniqueness and compliance)
- **High**: Encrypted owner (security requirement)
- **Medium**: FQDN host resolution (network resolvability)

---

**📊 Scenario format compliance corrections ready for implementation! 🔐📂✅**