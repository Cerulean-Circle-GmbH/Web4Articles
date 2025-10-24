<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA: Requirement CLI Path Architecture Fix**

**🗓️ Date:** 2025-08-25-UTC-1103  
**👤 Role:** Architect  
**🎯 Sprint:** 2025-08-25-0947-external-references-learnings  
**📋 Type:** Architecture Fix  
**⚡ Priority:** High (UCP Architecture Compliance)  

**📎 GitHub:** [Link to this PDCA](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/architect/2025-08-25-UTC-1103-requirement-cli-path-architecture-fix.md)

📎 Previous Commit: a94709c - 2025-08-25-UTC-1059-tsranger-cli-debug-version-fix-interactive-mode-prevention
🔗 Previous PDCA: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/architect/2025-08-25-UTC-1059-tsranger-cli-debug-and-fix.md) | [2025-08-25-UTC-1059-tsranger-cli-debug-and-fix.md](2025-08-25-UTC-1059-tsranger-cli-debug-and-fix.md)

---

## **📋 PLAN**

**🎯 Problem Identified:**
> **User Feedback:** "it created the files but in temp. this is GOOD for the spec directory, but bad for the scenario/index which is project root bound. obviously the links in spec have to be maintained if the scenario/index will be relocated."

**Current Incorrect Behavior:**
```bash
cd /Users/Shared/Workspaces/2cuGitHub/Web4Articles/temp
requirement create "TEMP Test Unit Architecture Fix" "workflows are user role specific screen transitions"

# GOOD: Local spec directory (context-aware)
📁 Directory: /Users/Shared/Workspaces/2cuGitHub/Web4Articles/temp/spec/requirements

# BAD: Central index in temp (should be project root!)  
🔗 Central Index: /Users/Shared/Workspaces/2cuGitHub/Web4Articles/temp/scenarios/index/6/1/1/8/1/61181c87-299f-4f8a-af35-eee347e1f4d4.scenario.json

# PROBLEM: Symlink now points to wrong location
# temp/spec/requirements/61181c87-299f-4f8a-af35-eee347e1f4d4.scenario.json 
# → temp/scenarios/index/... (WRONG - should point to PROJECT_ROOT/scenarios/index/...)
```

**UCP Architecture Requirement:**
- **`spec/requirements/`** → Context-aware, local to component/directory ✅ (GOOD current behavior)
- **`scenarios/index/`** → ALWAYS project root bound ❌ (BAD current behavior) 
- **Symlinks** → Must correctly bridge local spec to project-root central index

**QA Decisions Required:**
1. **Path Architecture:** Should central `scenarios/index/` always be project-root relative?
2. **Symlink Logic:** How should symlinks be calculated when spec and scenarios are in different directory trees?
3. **Context Detection:** Should CLI auto-detect project root for central index while keeping spec local?

**Implementation Plan:**
1. **Analyze Current Logic:** Read requirement.sh path detection logic
2. **Fix Central Index Path:** Always use PROJECT_ROOT/scenarios/index/ regardless of CWD
3. **Fix Symlink Logic:** Calculate correct relative path from local spec to project-root scenarios
4. **Test Verification:** Verify behavior from both project root and subdirectories
5. **Document Architecture:** Clear UCP path architecture documentation

---

## **🔧 DO**

**Problem Analysis - Current Implementation:**

**✅ Shell Script (CORRECT):**
```bash
# Shell script correctly finds PROJECT_ROOT via git:
PROJECT_ROOT=$(find_project_root)  # Uses git rev-parse --show-toplevel
export PROJECT_ROOT                # Available to Node.js CLI
```

**❌ TypeScript Implementation (INCORRECT):**
```typescript
// DefaultRequirement.ts - Line 483:
const projectRoot = this.findProjectRoot();  // ❌ IGNORES shell PROJECT_ROOT
const unitStorage = new UnitIndexStorage().init(projectRoot);

// findProjectRoot() method (Lines 27-41):
private findProjectRoot(): string {
  let currentDir = process.cwd();  // ❌ Uses CWD instead of PROJECT_ROOT env var
  while (currentDir !== path.dirname(currentDir)) {
    const scenariosPath = path.join(currentDir, 'scenarios');
    // Looks for scenarios directory starting from CWD
    return currentDir; // ❌ May return /project/temp/ if scenarios exists there
  }
  return process.cwd(); // ❌ Falls back to temp directory
}
```

**🔍 Root Cause Identified:**
1. **Shell script** correctly finds git project root → `PROJECT_ROOT=/path/to/project`
2. **TypeScript code** ignores `PROJECT_ROOT` environment variable
3. **TypeScript code** uses `process.cwd()` = `/path/to/project/temp/` as starting point
4. **scenarios/index** gets created in temp directory instead of project root
5. **Symlinks** point from spec/requirements to wrong scenarios location

**✅ Correct Architecture Should Be:**
- **scenarios/index/** → ALWAYS `${PROJECT_ROOT}/scenarios/index/` (git project root)  
- **spec/requirements/** → Context-aware: `${CWD}/spec/requirements/` (local to component)
- **Symlinks** → Calculated from local spec to project-root scenarios

**QA Decisions:**
1. **1a:** Use `process.env.PROJECT_ROOT` from shell script instead of `findProjectRoot()`
2. **2a:** Keep spec/requirements context-aware (current behavior correct)  
3. **3a:** Fix symlink calculation between different directory trees

**Implementation Fix Required:**
```typescript
// Fix: DefaultRequirement.ts saveScenario method
async saveScenario(uuid: string, scenario: any): Promise<void> {
  // OLD: const projectRoot = this.findProjectRoot(); // ❌ CWD-based
  // NEW: Use PROJECT_ROOT from shell script environment
  const projectRoot = process.env.PROJECT_ROOT || this.findProjectRoot();
  
  const unitStorage = new UnitIndexStorage().init(projectRoot);
  // ... rest remains same
}
```

