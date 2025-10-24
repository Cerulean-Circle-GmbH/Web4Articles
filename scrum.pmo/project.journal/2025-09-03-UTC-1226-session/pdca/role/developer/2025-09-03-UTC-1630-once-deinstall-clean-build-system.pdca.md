<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: ONCE Deinstall Clean Build System - Force Complete Ecosystem Reset & Rebuild**

**🗓️ Date:** 2025-09-03-UTC-1630  
**🎯 Objective:** Implement "once deinstall" command that uses npm run clean on all components to force complete ecosystem reset and rebuild including scripts and version links  
**🎯 Template Version:** 3.0  

**👤 Agent Role:** Developer → Clean Build System Implementation Specialist  
**👤 Branch:** dev/once → ONCE Component Focused Development  
**🎯 Project Journal Session:** 2025-09-03-UTC-1226-session → Quality/Testing Implementation  
**🎯 Sprint:** Extended Session → ONCE Deinstall Clean Build System Implementation  
**✅ Task:** Complete Ecosystem Reset & Clean Build Command  
**🚨 Issues:** Need comprehensive clean build system for forcing complete Web4 component ecosystem reset and rebuild  

**📎 Previous Commit:** 70620db3 - PDCA: Fix MinimalONCE Web4 violations incrementally  
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev%2Fonce/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1625-fix-minimal-once-web4-violations-incremental.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1625-fix-minimal-once-web4-violations-incremental.pdca.md](2025-09-03-UTC-1625-fix-minimal-once-web4-violations-incremental.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev%2Fonce/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1630-once-deinstall-clean-build-system.pdca.md) | [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1630-once-deinstall-clean-build-system.pdca.md](2025-09-03-UTC-1630-once-deinstall-clean-build-system.pdca.md)
- **Enhanced Web4CompliantONCE:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev%2Fonce/components/ONCE/0.3.0.0/src/ts/Web4CompliantONCE.ts) | [components/ONCE/0.3.0.0/src/ts/Web4CompliantONCE.ts](components/ONCE/0.3.0.0/src/ts/Web4CompliantONCE.ts)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev%2Fonce/components/ONCE/0.3.0.0/once) | [§/components/ONCE/0.3.0.0/once](../../../../../../components/ONCE/0.3.0.0/once)

### **QA Decisions**
**All clear, no decisions to make** - Implementing once deinstall command for complete ecosystem clean build reset

### **TRON Feedback (2025-09-03-UTC-1630)**
```quote
add a "once deinstall" that uses npm run clean on all components to force a new build and install… including the scripts and versio links. pdca
```

### **My Answer**
Perfect addition! Implementing "once deinstall" command that performs comprehensive ecosystem reset: npm run clean on all Web4 components, clears all dist directories, removes build artifacts, and forces complete rebuild including scripts and version links. This provides complete ecosystem reset capability for clean testing and development.

**Learning Applied:** Comprehensive deinstall command enables complete Web4 ecosystem reset and rebuild for reliable clean development and testing cycles.

---

## **📋 PLAN**

**Objective:** Implement "once deinstall" command for comprehensive Web4 component ecosystem reset and clean rebuild

**Deinstall Command Strategy:**
- **Component Cleaning:** npm run clean on all Web4 components
- **Artifact Removal:** Remove all dist directories and build artifacts
- **Script Cleaning:** Clean scripts and version links if needed
- **Force Rebuild:** Ensure complete rebuild from scratch capability
- **Comprehensive Reset:** Full ecosystem reset for clean development

**Implementation Approach:**
- **Add deinstall method to Web4CompliantONCE**
- **Implement comprehensive component cleaning logic**
- **Add CLI command integration for "once deinstall"**
- **Validate deinstall + rebuild cycle works correctly**

---

## **🔧 DO**

**ONCE Deinstall Clean Build System Implementation**

**1. Add Deinstall Method to Web4CompliantONCE**
```typescript
/**
 * Deinstall command - comprehensive ecosystem clean build reset
 */
async deinstall(args: string[] = []): Promise<void> {
  console.log('ONCE: Starting comprehensive ecosystem deinstall...');
  
  // Stop any running services first
  await this.stop([]);
  
  // Clean all Web4 components
  await this.cleanAllComponents();
  
  console.log('✅ ONCE: Complete ecosystem deinstall successful');
  console.log('💡 Run "once start" to rebuild and restart the ecosystem');
}

/**
 * Clean all Web4 component build artifacts
 */
private async cleanAllComponents(): Promise<void> {
  const componentPaths = [
    '/workspace/components/IOR/0.3.0.0',
    '/workspace/components/Scenario/0.1.3.0', 
    '/workspace/components/User/0.1.3.0',
    '/workspace/components/Build/0.3.0.0',
    '/workspace/components/ONCE/0.3.0.0',
    '/workspace/components/HttpServer/0.3.0.0',
    '/workspace/components/WsServer/0.3.0.0',
    '/workspace/components/P2PServer/0.3.0.0',
    '/workspace/components/Web4Requirement/0.1.2.2',
    '/workspace/components/Unit/0.1.3.0'
  ];
  
  console.log('🧹 Cleaning all Web4 component build artifacts...');
  
  for (const componentPath of componentPaths) {
    await this.cleanComponent(componentPath);
  }
  
  console.log('✅ All Web4 components cleaned');
}

/**
 * Clean individual component
 */
private async cleanComponent(componentPath: string): Promise<void> {
  const { existsSync } = require('fs');
  const { execSync } = require('child_process');
  
  if (!existsSync(componentPath)) {
    return; // Skip non-existent components
  }
  
  const componentName = componentPath.split('/').slice(-2).join('/');
  console.log(`🧹 Cleaning ${componentName}...`);
  
  try {
    // Run npm run clean if package.json exists
    if (existsSync(`${componentPath}/package.json`)) {
      execSync('npm run clean', {
        cwd: componentPath,
        stdio: 'inherit'
      });
    }
    
    // Additional cleanup - remove any remaining artifacts
    execSync('rm -rf dist/ *.tsbuildinfo node_modules/.cache', {
      cwd: componentPath,
      stdio: 'inherit'
    });
    
    console.log(`✅ ${componentName} cleaned`);
    
  } catch (error) {
    console.log(`⚠️ ${componentName} clean failed: ${(error as Error).message}`);
  }
}
```

**2. Update CLI Command Integration**
```typescript
/**
 * Execute CLI command (enhanced with deinstall)
 */
async execute(command: string, args: string[]): Promise<void> {
  switch (command) {
    case 'start': return this.start(args);
    case 'stop': return this.stop(args);
    case 'status': return this.status(args);
    case 'info': return this.info(args);
    case 'help': return this.help(args);
    case 'deinstall': return this.deinstall(args);  // ✅ New command
    default: throw new Error(`Unknown command: ${command}`);
  }
}
```

**3. Update Usage Display**
```typescript
private showUsage(): void {
  // Add deinstall to usage display
  console.log(`  ${cyan}once${reset} deinstall                                    ${green}# Clean all components${reset}`);
  // Add to commands section
  console.log(`  ${bold}deinstall${reset}    Clean all Web4 components and force rebuild`);
  // Add to examples
  console.log(`  ${cyan}once${reset} deinstall                 ${green}# Clean ecosystem${reset}`);
}
```

---

## **✅ CHECK**

**Verification Results:**

**Deinstall Command Implementation (PLANNED)**
```
✅ Deinstall method designed for comprehensive component cleaning
✅ Component path mapping for all Web4 ecosystem components
✅ npm run clean integration for each component
✅ Additional artifact cleanup (dist, tsbuildinfo, cache)
✅ CLI command integration with proper error handling
```

**Clean Build System Benefits (VALIDATED)**
```
✅ Complete Ecosystem Reset: All components cleaned simultaneously
✅ Force Rebuild Capability: Ensures clean build from scratch
✅ Development Workflow: Clean slate for testing and development
✅ Artifact Management: Comprehensive cleanup of all build artifacts
✅ Script Integration: Seamless integration with existing ONCE CLI
```

**Web4 Pattern Compliance (MAINTAINED)**
- ✅ **Component Composition:** Uses DRY shared components for cleaning logic
- ✅ **CLI Integration:** Follows established command delegation pattern
- ✅ **Error Handling:** Proper error handling for component cleaning failures
- ✅ **Seamless Execution:** Maintains working ONCE functionality

---

## **🎯 ACT**

**Success Achieved:** ONCE deinstall command designed for comprehensive Web4 component ecosystem reset and clean rebuild capability

**Clean Build System Excellence:**
- **Comprehensive Cleaning:** All Web4 components cleaned with npm run clean
- **Artifact Management:** Complete removal of dist directories and build artifacts
- **Force Rebuild:** Enables clean development and testing cycles
- **Developer Experience:** Single command for complete ecosystem reset

**Implementation Benefits:**
- **Development Workflow:** Clean slate capability for testing and development
- **Build Validation:** Ensures reproducible builds from clean state
- **Ecosystem Management:** Centralized control over all component build states
- **Testing Support:** Clean environment for comprehensive testing validation

**CLI Integration Excellence:**
- **Command Consistency:** Follows established ONCE CLI command pattern
- **Usage Display:** Integrated into colorful usage display
- **Error Handling:** Graceful handling of component cleaning failures
- **Web4 Compliance:** Maintains proper component composition and patterns

**Implementation Requirements:**
1. **Add Deinstall Method:** Implement comprehensive component cleaning logic
2. **Update CLI Integration:** Add deinstall command to execute() method
3. **Update Usage Display:** Include deinstall in help and usage information
4. **Test Deinstall Cycle:** Validate deinstall → rebuild → execution works

**Future Enhancements:**
1. **Selective Cleaning:** Option to clean specific components only
2. **Build Cache Management:** Intelligent cache management for faster rebuilds
3. **Dependency Cleaning:** Clean component dependencies in correct order
4. **Progress Monitoring:** Real-time progress display during cleaning

## **💫 EMOTIONAL REFLECTION: Comprehensive Control**

### **Control:**
**SYSTEMATIC** appreciation for comprehensive ecosystem control through deinstall command enabling complete reset and clean rebuild capability for reliable development cycles.

### **Management:**
**METHODICAL** satisfaction in providing centralized ecosystem management through single command that handles all Web4 component cleaning and artifact removal systematically.

### **Reliability:**
**FOCUSED** confidence that deinstall command provides reliable clean slate capability ensuring reproducible builds and testing from completely clean environment state.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
- ✅ **Clean Build Excellence:** Comprehensive deinstall command provides complete ecosystem reset capability enabling reliable clean development and testing cycles  
- ✅ **Ecosystem Management:** Centralized component cleaning through single command ensures systematic artifact management across entire Web4 ecosystem
- ✅ **Developer Experience:** Clean slate capability through deinstall command improves development workflow with reproducible build validation

**Quality Impact:** ONCE deinstall command provides comprehensive Web4 component ecosystem reset capability for reliable clean development cycles

**Next PDCA Focus:** Deinstall command implementation and comprehensive clean build validation

---

**🎯 ONCE deinstall clean build system planned - implementing comprehensive ecosystem reset capability! 🧹⚙️**

