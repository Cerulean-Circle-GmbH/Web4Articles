<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Web4 Component Self-Build Dependency Management Implementation**

**🗓️ Date:** 2025-08-30-UTC-1000  
**🎯 Objective:** Implement self-aware build dependency management for Web4 components  
**🎯 Template Version:** 3.0  

**👤 Agent Role:** Developer → Component Lifecycle Specialist  
**👤 Branch:** release/dev → Self-Build Implementation  
**🎯 Project Journal Session:** 2025-08-30-UTC-0840-once-demo-session → Component Architecture
**🎯 Sprint:** Sprint 20 → Web4 Methodology Implementation
**✅ Task:** Make components self-aware of build dependencies  
**🚨 Issues:** Components require manual build order knowledge instead of self-managing  

**📎 Previous Commit:** 433280f0 - PDCA: Fixed Web4Requirement v0.1.2.2 build chain - Unit → User → Web4Requirement  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-0945-web4requirement-build-chain-fix.md) | [scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-0945-web4requirement-build-chain-fix.md](scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-0945-web4requirement-build-chain-fix.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-1000-component-self-build-dependency-fix.md) | [scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-1000-component-self-build-dependency-fix.md](scrum.pmo/project.journal/2025-08-30-UTC-0840-once-demo-session/pdca/2025-08-30-UTC-1000-component-self-build-dependency-fix.md)
- **Self-Build Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/b326c719-bdff-4734-b562-a13849e06c5d.requirement.md) | [spec/requirements.md/b326c719-bdff-4734-b562-a13849e06c5d.requirement.md](spec/requirements.md/b326c719-bdff-4734-b562-a13849e06c5d.requirement.md)
- **Build Order Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/0b03205a-65e8-4f95-8060-1a6599350c1e.requirement.md) | [spec/requirements.md/0b03205a-65e8-4f95-8060-1a6599350c1e.requirement.md](spec/requirements.md/0b03205a-65e8-4f95-8060-1a6599350c1e.requirement.md)
- **npm start Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/spec/requirements.md/32bc674b-100b-498f-b07b-532eb45e7883.requirement.md) | [spec/requirements.md/32bc674b-100b-498f-b07b-532eb45e7883.requirement.md](spec/requirements.md/32bc674b-100b-498f-b07b-532eb45e7883.requirement.md)

### **QA Decisions**
- [ ] **Decision 1: Build Dependency Declaration Format**
  - a) Use custom "buildDependencies" field in package.json
  - b) Extend existing "dependencies" with build metadata
  - c) Create separate build-config.json file per component

- [ ] **Decision 2: Implementation Approach**
  - a) Update each component individually with new scripts
  - b) Create shared build utility used by all components
  - c) Use Web4TSComponent CLI for lifecycle management

### **TRON Feedback (2025-08-30-UTC-1000)**
```quote
did you figure out the build order manually?
in web4 each component needs to know its dependencies and be aware of its own build order.

make detailed requirements from my prompt.
check for each component if it can build itself and its dependencies upfront.

npm start
should have the same effect as the simple sh startscript.
additionally it has to check that it is build and able to start obviously.
to support that you can have more npm scripts.
in best case the scripts call the components cli or the web4tscomponents cli to handle its own lifecycle.

review the components and fix that.
pdca
```

### **My Answer**
Yes, I figured out the build order manually by following error messages. You're right - this violates Web4 principles. Components should be self-aware and handle their own dependencies. I've created three requirements and will now review components to implement proper self-build capability with npm scripts that check build status and use component lifecycle CLIs.

**Learning Applied:** Web4 components must be autonomous and self-managing, not require external build order knowledge

---

## **📋 PLAN**

**Objective:** Implement self-aware build dependency management across Web4 components

**Requirements Created:**
1. **b326c719:** Web4 Component Self-Build Dependency Management
2. **0b03205a:** Component Build Order Declaration  
3. **32bc674b:** npm start Build Check Implementation

**Implementation Strategy:**
1. Review current component build scripts
2. Identify dependency chains
3. Add buildDependencies declaration
4. Implement smart npm start scripts
5. Test self-build capability

**Target Components:**
- Unit (base component)
- User (depends on Unit)
- Web4Requirement (depends on Unit and User)
- Web4TSComponent (lifecycle manager)

---

## **🔧 DO**

**1. Review Current Build Scripts**

Let me check Web4Requirement's current npm scripts:
```json
// Web4Requirement/0.1.2.2/package.json
"scripts": {
  "build": "tsc",
  "start": "node -r ts-node/register src/ts/layer5/RequirementCLI.ts",
  "generate-overview": "node -r ts-node/register src/ts/layer5/RequirementCLI.ts --generate-overview",
  "update-status": "node -r ts-node/register src/ts/layer5/RequirementCLI.ts --update-status"
}
```

Issues found:
- No dependency checking
- No build status verification
- start assumes already built
- No prebuild hooks

**2. Check Web4TSComponent for Lifecycle Management**

Web4TSComponent has basic lifecycle scripts but no dependency management yet.

**3. Existing Dependency Management Found**

User component already has sophisticated dependency checking:
- DependencyChecker class in layer4
- Checks for Unit component availability
- Verifies build artifacts exist
- Provides helpful error messages

**4. Create Enhanced package.json for Web4Requirement**

```json
{
  "name": "@web4x/web4-requirement",
  "version": "0.1.2.2",
  "buildDependencies": {
    "@web4/unit": "latest",
    "@web4/user": "0.1.3.0"
  },
  "scripts": {
    "prestart": "npm run ensure-built",
    "start": "./requirement.sh",
    "ensure-built": "npm run check-deps && npm run build-if-needed",
    "check-deps": "node scripts/check-dependencies.js",
    "build-if-needed": "[ -d dist ] || npm run build",
    "build-deps": "node scripts/build-dependencies.js",
    "prebuild": "npm run build-deps",
    "build": "tsc",
    "postbuild": "echo '✅ Web4Requirement built successfully'"
  }
}
```

**5. Implement Dependency Build Script**

```javascript
// scripts/build-dependencies.js
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const buildDependencies = {
  '@web4/unit': '../../Unit/latest',
  '@web4/user': '../../User/0.1.3.0'
};

async function buildDeps() {
  console.log('🔨 Building Web4Requirement dependencies...\n');
  
  for (const [name, path] of Object.entries(buildDependencies)) {
    const componentPath = resolve(process.cwd(), path);
    const distPath = resolve(componentPath, 'dist');
    
    if (!existsSync(distPath)) {
      console.log(`📦 Building ${name}...`);
      try {
        execSync('npm install && npm run build', {
          cwd: componentPath,
          stdio: 'inherit'
        });
      } catch (error) {
        console.error(`❌ Failed to build ${name}`);
        process.exit(1);
      }
    } else {
      console.log(`✅ ${name} already built`);
    }
  }
}

buildDeps();
```

---

## **✅ CHECK**

**Current State Analysis:**
- ✅ User component has dependency checking (checks for Unit)
- ✅ Web4TSComponent has lifecycle scripts but no dependency management
- ✅ Web4Requirement has no dependency awareness
- ❌ Unit has no dependency checking (it's the base component)
- ❌ No components use buildDependencies declaration yet

**Requirements Implementation Status:**
- ✅ Created requirement b326c719 - Self-Build Dependency Management
- ✅ Created requirement 0b03205a - Build Order Declaration
- ✅ Created requirement 32bc674b - npm start Build Check
- 🔄 Found existing partial implementation in User component
- 📋 Need to standardize across all components

---

## **🎯 ACT**

**Implementation Plan:** Standardize self-build dependency management across components

**Immediate Actions:**
1. **Create standard buildDependencies format** for package.json
2. **Implement dependency build scripts** for Web4Requirement
3. **Update npm start** to check build status first
4. **Test self-build capability** end-to-end

**Standard Pattern for All Components:**
```json
{
  "buildDependencies": {
    "component-name": "relative-path"
  },
  "scripts": {
    "prestart": "npm run ensure-built",
    "start": "./component.sh || npm run cli",
    "ensure-built": "npm run check-build || npm run build",
    "check-build": "[ -d dist ] && echo '✅ Already built' || false",
    "prebuild": "npm run build-dependencies",
    "build-dependencies": "node scripts/build-dependencies.js"
  }
}
```

**Next Steps:**
1. Implement for Web4Requirement first
2. Backport to User component
3. Update Unit (no dependencies but should follow pattern)
4. Create Web4TSComponent command for this

---

## **💡 Emotional Reflection**
Discovering existing dependency management in User component was encouraging - the pattern exists, it just needs standardization and propagation across all components.

---

## **🔄 PDCA Process Update**
- ✅ Found existing dependency checking in User component (DRY!)
- ✅ Created requirements for self-build capability
- ✅ Designed standard pattern for all components
- 🔄 Ready to implement across component ecosystem

---

**🎯 Self-Build Pattern Identified: Ready for implementation across Web4 components! 🔧🔄**