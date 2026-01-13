# Web4TSComponent Release Comparison

**Generated:** 2026-01-13
**Purpose:** Compare methods available across repositories and semantic version links

---

## Version Overview

| Repository | Version | Link/Status | Key Feature |
|------------|---------|-------------|-------------|
| **Web4Articles** | 0.3.5.2 | `prod` | Core functionality, DRY compliance |
| **Web4Articles** | 0.3.18.0 | `test` | Enhanced completion, setCICDVersion |
| **Web4Articles** | 0.3.20.1 | `dev` | DelegationProxy, testShell |
| **Web4Articles** | 0.3.21.1 | `latest` | Parameter completion fixes |
| **UpDown** | 0.3.20.6 | Active | Tootsie testing, componentDescriptor |
| **ONCE** | 0.3.22.2 | Embedded | Stripped-down + ONCE-specific methods |

**This file is symlinked to:**
- UpDown/components/Web4TSComponent/0.3.20.6/spec/web4tscomponent.release.comparison.md
- UpDown/components/ONCE/0.3.22.2/spec/web4tscomponent.release.comparison.md

---

## Major Differences

### 1. UpDown 0.3.20.6: Tootsie Testing Framework

**New methods not in Web4Articles:**
| Method | Purpose |
|--------|---------|
| `tootsie()` | Radical OOP test runner (replaces Vitest for component testing) |
| `componentDescriptorUpdate()` | Update component descriptor JSON |
| `componentDescriptorRead()` | Read component descriptor |
| `componentStart()` | Start component from descriptor |

**Tootsie Philosophy:** Tests are component methods, not external test files. Run with `./once tootsie file 1`.

### 2. ONCE 0.3.22.2: Embedded/Stripped Web4TSComponent

**Removed from embedded version:**
- Most scaffolding methods (`create`, `scaffoldComponent`, etc.)
- Project initialization (`initProject`)
- Many compliance/audit methods

**Added ONCE-specific methods:**
| Method | Purpose |
|--------|---------|
| `unitsDiscover()` | Discover UCP units in component |
| `cliWrapperGenerate()` | Generate CLI wrapper |
| `demo()` | Interactive demo mode |
| `peerStart()/peerStop()` | ONCE peer management |
| `startServer()/stopServer()` | Server lifecycle |
| `openBrowser()` | Launch browser to ONCE UI |

### 3. DelegationProxy Evolution

| Version | DelegationProxy | Inherited Methods |
|---------|-----------------|-------------------|
| prod (0.3.5.2) | ❌ | N/A |
| test (0.3.18.0) | ❌ | N/A |
| dev (0.3.20.1) | ✅ | ~120 |
| latest (0.3.21.1) | ✅ | ~120 |
| UpDown (0.3.20.6) | ✅ | ~120 + tootsie |
| ONCE (0.3.22.2) | ✅ | Reduced set |

### 4. CI/CD Version Management

| Version | Method | Status |
|---------|--------|--------|
| prod (0.3.5.2) | `setDev/setTest/setProd/setLatest` | Individual methods |
| test+ | `setCICDVersion(targetVersion)` | Unified method |

---

## Complete Method Availability Matrix

| Method | Source | prod | test | dev | latest | UpDown | ONCE | Notes |
|--------|--------|:----:|:----:|:---:|:------:|:------:|:----:|-------|
| `actionParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `auditComponentCompliance()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Removed in ONCE |
| `build()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `buildDependencies()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `cacheClear()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `clean()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `cliSignature()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `cliWrapperGenerate()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `compare()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `completeParameter()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `completion()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `componentDescriptorRead()` | Comp | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | UpDown+ |
| `componentDescriptorUpdate()` | Comp | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | UpDown+ |
| `componentParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `componentStart()` | Comp | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | UpDown+ |
| `create()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Removed in ONCE |
| `demo()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `demoMessages()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `depthParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `discoverServers()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `execute()` | Comp | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Removed |
| `filterParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `find()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `formatParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `from()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `generateComplianceReport()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `generateLocationResilientCLI()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `get()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `getContext()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `getDelegationTarget()` | Proxy | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | |
| `getHealth()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `getMethodSignature()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `getWeb4TSComponent()` | Proxy | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | |
| `handleReleaseTestSuccessPromotion()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Internalized |
| `handleTestSuccessPromotion()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Internalized |
| `hasDelegation()` | Proxy | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | |
| `hasMethod()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `info()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `init()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `initProject()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `links()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `listMethods()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `nameParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `on()` | CLI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `openBrowser()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `optionsParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `peersDiscover()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `peerStart()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `peerStop()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `peerStopAll()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `promoteMajor()` | Version | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `promoteMinor()` | Version | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `promotePatch()` | Version | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `promoteRevision()` | Version | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `referencesParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `releaseTest()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `removeComponent()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `removeVersion()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `scaffoldComponent()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `scopeParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `set()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `setCICDVersion()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `setDev()` | Comp | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Replaced |
| `setLatest()` | Comp | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Replaced |
| `setProd()` | Comp | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Replaced |
| `setTarget()` | Proxy | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | |
| `setTargetDirectory()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `setTest()` | Comp | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Replaced |
| `shCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `showGuidelines()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Removed |
| `showHiddenParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `showStandard()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Removed |
| `showUsage()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `shutdownAll()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `skipPromotionParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `start()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `startClientServer()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `startServer()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `stopServer()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `targetDirParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `targetVersionParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `test()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `testCompletion()` | Comp | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `testDescribeReferenceParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `testDiscovery()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Removed |
| `testInput()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `testItCaseReferenceParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `testNewMethod()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Removed |
| `testShell()` | Comp | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | |
| `tootsie()` | Comp | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | UpDown+ |
| `toScenario()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `tree()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `unitsDiscover()` | ONCE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ONCE-only |
| `updateBuildSystem()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `upgrade()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `validateCLIStandard()` | Comp | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | |
| `verifyAndFix()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Internalized |
| `verifyTestSuccess()` | Comp | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Internalized |
| `versionParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `versionPromotionParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `whatParameterCompletion()` | CLI | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |

---

## Summary Statistics

| Version | Repository | Available | Unique |
|---------|------------|-----------|--------|
| prod (0.3.5.2) | Web4Articles | 41 | 4 (setDev/Test/Prod/Latest) |
| test (0.3.18.0) | Web4Articles | 68 | 0 |
| dev (0.3.20.1) | Web4Articles | 70 | 0 |
| latest (0.3.21.1) | Web4Articles | 70 | 0 |
| 0.3.20.6 | UpDown | 75 | 4 (tootsie, componentDescriptor*) |
| 0.3.22.2 | ONCE | ~45 | 15+ (peer*, server*, demo*) |

---

## Breaking Changes Summary

| From | To | Removed | Replacement |
|------|-----|---------|-------------|
| prod | test | `setDev/Test/Prod/Latest` | `setCICDVersion()` |
| test | dev | `testDiscovery`, `testNewMethod`, `showGuidelines`, `showStandard` | Internalized/docs |
| Web4Articles | UpDown | - | Added `tootsie()`, `componentDescriptor*` |
| Web4Articles | ONCE | ~30 methods | Stripped + ONCE-specific |

---

## Related Documentation

- [Fractal PDCA HowTo](/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/_shared/howto.fractal.pdca.md)
- [CMM3 Compliance Checklist](/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)
- [UpDown Spec](./updown-0.3.20.6/)
- [ONCE Spec](./once-0.3.22.2/)

---

**Legend:** ✅ Available | ❌ Not Available
**Source:** Comp = DefaultWeb4TSComponent | CLI = DefaultCLI | Proxy = DelegationProxy | Version = SemanticVersion | ONCE = NodeJsOnce
