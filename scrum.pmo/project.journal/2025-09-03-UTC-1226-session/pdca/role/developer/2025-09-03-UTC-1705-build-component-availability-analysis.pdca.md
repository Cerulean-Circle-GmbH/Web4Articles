# PDCA: Build Component Availability Analysis - "Always Unavailable" Root Cause

## Meta Information
- **Type**: Development PDCA  
- **Session**: 2025-09-03-UTC-1226
- **Previous**: [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1700-once-seamless-execution-success-next-phases.pdca.md](2025-09-03-UTC-1700-once-seamless-execution-success-next-phases.pdca.md)
- **UUID**: 8a9c3f2e-1d4b-4c85-9f7a-3e8b5d6c2a1f
- **Timestamp**: 2025-09-03 UTC 17:05

## Dual Links
- **GitHub**: [https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/b3cad6de/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1705-build-component-availability-analysis.pdca.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/b3cad6de/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1705-build-component-availability-analysis.pdca.md)
- **Local**: [§/scrum.pmo/project.journal/2025-09-03-UTC-1226-session/pdca/role/developer/2025-09-03-UTC-1705-build-component-availability-analysis.pdca.md](2025-09-03-UTC-1705-build-component-availability-analysis.pdca.md)

## Context & Background
User Question: *"What sense makes the: Build component not available message if it is never available."*

Following Phase A selection (Consolidate Success), investigating why ONCE always displays "Build component not available" warning despite Build components existing in the system.

### Key Artifacts
- [§/components/ONCE/0.3.0.0/once](../../../../../components/ONCE/0.3.0.0/once) - Shell script with Build component detection
- [§/components/Build/0.1.0.0](../../../../../components/Build/0.1.0.0) - Legacy Build component (latest symlink target)
- [§/components/Build/0.3.0.0](../../../../../components/Build/0.3.0.0) - Current Build component with working build script

## Plan

### Root Cause Investigation
**Issue**: ONCE script always shows "Build component not available" despite Build components existing

**Detection Logic Analysis:**
```bash
# ONCE script line 23-25
local BUILD_COMPONENT="$COMPONENT_DIR/../../../Build/latest"
if [ -x "$BUILD_COMPONENT/build" ]; then
```

**Path Resolution:**
- Expected: `/workspace/components/Build/latest/build`
- Actual symlink: `latest -> 0.1.0.0`
- Resolved path: `/workspace/components/Build/0.1.0.0/build`
- Reality: `/workspace/components/Build/0.1.0.0/build.sh` (different filename)

**Multiple Issues Identified:**
1. **Symlink Mismatch**: `latest -> 0.1.0.0` but current version is `0.3.0.0`
2. **Filename Mismatch**: Looking for `build` but file is `build.sh`
3. **Version Strategy**: Using symlink strategy but not maintaining it properly

## Do

### Investigation Results

**Build Component Inventory:**
```bash
/workspace/components/Build/
├── 0.1.0.0/
│   ├── build.sh ❌ (wrong filename)
│   └── package.json
├── 0.3.0.0/
│   ├── build ✅ (correct filename, executable)
│   └── package.json  
└── latest -> 0.1.0.0 ❌ (wrong target)
```

**ONCE Script Logic:**
- Looks for: `/workspace/components/Build/latest/build`
- Finds: `/workspace/components/Build/0.1.0.0/build.sh`
- Result: File not found → fallback mode

**Build Component Evolution:**
- **v0.1.0.0**: Legacy version with `build.sh` script
- **v0.3.0.0**: Current version with `build` script (executable)
- **Symlink**: Not updated during migration

## Check

### Issue Classification

**PRIMARY ISSUE: Symlink Management**
- `latest` symlink points to outdated version (0.1.0.0)
- Should point to current version (0.3.0.0)
- Web4 versioning strategy not consistently applied

**SECONDARY ISSUE: Filename Convention**
- Legacy: `build.sh` script  
- Current: `build` executable
- Inconsistent naming across versions

**TERTIARY ISSUE: Build Chain Integration**
- ONCE designed to use comprehensive Build component
- Currently always falls back to enhanced_fallback_build()
- Comprehensive build chain never actually used

### Impact Analysis

**Current State:**
- ✅ **Functionality**: Enhanced fallback works correctly
- ⚠️ **Performance**: Manual dependency detection vs automated build chain
- ⚠️ **User Experience**: Confusing warning message always appears
- ❌ **Architecture**: Comprehensive build chain not utilized

**User Experience Impact:**
- Misleading warning suggests system is degraded
- Users may think Build component is broken
- Enhanced fallback actually works well but appears as "fallback"

## Act

### Solution Options

**OPTION A: Fix Symlink and Enable Comprehensive Build**
- Update `latest` symlink to point to `0.3.0.0`
- Test comprehensive build chain functionality
- Remove confusing fallback warning when build works

**OPTION B: Remove Symlink Strategy**
- Update ONCE script to directly use `0.3.0.0` version
- Eliminate symlink dependency and version confusion
- Explicit version reference for clarity

**OPTION C: Improve Fallback Messaging**
- Keep current logic but improve user messaging
- Change "not available" to "using direct build" or similar
- Acknowledge that fallback is intentional, not degraded

**OPTION D: Eliminate Build Component Dependency**
- Remove Build component integration entirely
- Use enhanced_fallback_build as primary implementation
- Simplify ONCE to be self-contained (Occam's Razor)

### Implementation Strategy Recommendation

**PREFERRED: Option A + Validation**
1. **Fix Symlink**: Update `latest -> 0.3.0.0`
2. **Test Integration**: Verify Build component comprehensive chain works
3. **Conditional Logic**: Use build chain when available, fallback when needed
4. **Clear Messaging**: Accurate status reporting

**Alternative: Option D (Sprint 20 Simplicity)**
- Remove Build component dependency entirely
- Enhanced fallback becomes primary build strategy
- Eliminates confusing warning and external dependency

### Next Steps for Phase A Implementation

**A1: Build System Consolidation**
- Fix Build component symlink and integration
- Test comprehensive vs fallback build strategies
- Standardize build script naming conventions

**A2: Testing Infrastructure Enhancement**  
- Update test expectations to match current implementation
- Fix import path resolution issues across test suites
- Ensure 100% test pass rate

**A3: Import Strategy Standardization**
- Decide on dist/ vs src/ import strategy
- Apply consistently across all components
- Fix TypeScript compilation issues

## QA Decision Required

### Build Component Strategy Selection

**A) Fix and Use Comprehensive Build Chain** - Update symlink, integrate Build 0.3.0.0, use comprehensive build  
**B) Simplify to Self-Contained Build** - Remove Build dependency, use enhanced fallback as primary  
**C) Hybrid Approach** - Keep both, improve messaging, use build chain when available

### Immediate Fix Priority

**1) Symlink Update** - Point `latest` to `0.3.0.0`  
**2) Message Improvement** - Change confusing "not available" warning  
**3) Build Chain Testing** - Verify comprehensive build actually works

---

**🎯 ROOT CAUSE: Outdated symlink (latest -> 0.1.0.0) and filename mismatch cause Build component to appear unavailable despite working 0.3.0.0 version existing.**