# Web4TSComponent Release Comparison

**Generated:** 2026-01-13
**Purpose:** Compare methods available across semantic version links
**Base Version:** 0.3.13.1 (Tab Completion Architecture Complete)

---

## Semantic Version Links

| Link | Version | Status | Key Feature |
|------|---------|--------|-------------|
| **prod** | 0.3.5.2 | Production | Core functionality, DRY compliance |
| **test** | 0.3.18.0 | Testing | Enhanced completion, setCICDVersion |
| **dev** | 0.3.20.1 | Development | DelegationProxy, testShell |
| **latest** | 0.3.21.1 | Latest | Parameter completion for delegated methods |

---

## Complete Method Availability Matrix

| Method | Source | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) | Notes |
|--------|--------|:-------------:|:---------------:|:--------------:|:-----------------:|-------|
| `actionParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `auditComponentCompliance()` | Component | ✅ | ✅ | ✅ | ✅ | Compliance audit |
| `build()` | Component | ✅ | ✅ | ✅ | ✅ | Build component |
| `buildDependencies()` | Component | ❌ | ✅ | ✅ | ✅ | Multi-component builds |
| `clean()` | Component | ✅ | ✅ | ✅ | ✅ | Clean build artifacts |
| `cliSignature()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Show CLI signature |
| `compare()` | Component | ✅ | ✅ | ✅ | ✅ | Compare components |
| `completeParameter()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Parameter completion |
| `completion()` | Component | ❌ | ✅ | ✅ | ✅ | Completion discovery |
| `componentParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `create()` | Component | ✅ | ✅ | ✅ | ✅ | Create new component |
| `depthParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `execute()` | Component | ✅ | ❌ | ❌ | ❌ | Removed in 0.3.18+ |
| `filterParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `find()` | Component | ✅ | ✅ | ✅ | ✅ | Find component |
| `formatParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `from()` | Component | ✅ | ✅ | ✅ | ✅ | Load from path |
| `generateComplianceReport()` | Component | ✅ | ✅ | ✅ | ✅ | Generate report |
| `generateLocationResilientCLI()` | Component | ✅ | ✅ | ✅ | ✅ | Generate CLI |
| `get()` | Component | ✅ | ✅ | ✅ | ✅ | Get property |
| `getContext()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Get current context |
| `getDelegationTarget()` | DelegationProxy | ❌ | ❌ | ✅ | ✅ | Get delegation target |
| `getMethodSignature()` | Component | ❌ | ✅ | ✅ | ✅ | Get method info |
| `getWeb4TSComponent()` | DelegationProxy | ❌ | ❌ | ✅ | ✅ | Get Web4TSComponent |
| `handleReleaseTestSuccessPromotion()` | Component | ✅ | ✅ | ❌ | ❌ | Internalized |
| `handleTestSuccessPromotion()` | Component | ✅ | ✅ | ❌ | ❌ | Internalized |
| `hasDelegation()` | DelegationProxy | ❌ | ❌ | ✅ | ✅ | Check delegation |
| `hasMethod()` | Component | ❌ | ✅ | ✅ | ✅ | Check method exists |
| `info()` | Component | ✅ | ✅ | ✅ | ✅ | Show info |
| `init()` | Component | ✅ | ✅ | ✅ | ✅ | Initialize |
| `initProject()` | Component | ✅ | ✅ | ✅ | ✅ | Initialize project |
| `links()` | Component | ✅ | ✅ | ✅ | ✅ | Show version links |
| `listMethods()` | Component | ❌ | ✅ | ✅ | ✅ | List all methods |
| `nameParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `on()` | DefaultCLI | ✅ | ✅ | ✅ | ✅ | Load context |
| `optionsParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `promoteMajor()` | SemanticVersion | ❌ | ✅ | ✅ | ✅ | Version promotion |
| `promoteMinor()` | SemanticVersion | ❌ | ✅ | ✅ | ✅ | Version promotion |
| `promotePatch()` | SemanticVersion | ❌ | ✅ | ✅ | ✅ | Version promotion |
| `promoteRevision()` | SemanticVersion | ❌ | ✅ | ✅ | ✅ | Version promotion |
| `referencesParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `releaseTest()` | Component | ✅ | ✅ | ✅ | ✅ | Release test |
| `removeComponent()` | Component | ✅ | ✅ | ✅ | ✅ | Remove component |
| `removeVersion()` | Component | ✅ | ✅ | ✅ | ✅ | Remove version |
| `scaffoldComponent()` | Component | ✅ | ✅ | ✅ | ✅ | Scaffold component |
| `scopeParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `set()` | Component | ✅ | ✅ | ✅ | ✅ | Set property |
| `setCICDVersion()` | Component | ❌ | ✅ | ✅ | ✅ | CI/CD version set |
| `setDev()` | Component | ✅ | ❌ | ❌ | ❌ | Replaced by setCICDVersion |
| `setLatest()` | Component | ✅ | ❌ | ❌ | ❌ | Replaced by setCICDVersion |
| `setProd()` | Component | ✅ | ❌ | ❌ | ❌ | Replaced by setCICDVersion |
| `setTarget()` | DelegationProxy | ❌ | ❌ | ✅ | ✅ | Set delegation target |
| `setTargetDirectory()` | Component | ✅ | ✅ | ✅ | ✅ | Set target dir |
| `setTest()` | Component | ✅ | ❌ | ❌ | ❌ | Replaced by setCICDVersion |
| `shCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Shell completion |
| `showGuidelines()` | Component | ✅ | ✅ | ❌ | ❌ | Moved to docs |
| `showHiddenParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `showStandard()` | Component | ✅ | ✅ | ❌ | ❌ | Moved to docs |
| `showUsage()` | Component | ✅ | ✅ | ✅ | ✅ | Show usage |
| `skipPromotionParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `start()` | Component | ✅ | ✅ | ✅ | ✅ | Start component |
| `targetDirParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `targetVersionParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `test()` | Component | ✅ | ✅ | ✅ | ✅ | Run tests |
| `testCompletion()` | Component | ❌ | ✅ | ✅ | ✅ | Test completion |
| `testDescribeReferenceParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `testDiscovery()` | Component | ✅ | ✅ | ❌ | ❌ | Dev utility removed |
| `testItCaseReferenceParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `testNewMethod()` | Component | ✅ | ✅ | ❌ | ❌ | Dev utility removed |
| `testShell()` | Component | ❌ | ❌ | ✅ | ✅ | Isolated test shell |
| `toScenario()` | Component | ✅ | ✅ | ✅ | ✅ | Export scenario |
| `tree()` | Component | ✅ | ✅ | ✅ | ✅ | Show tree view |
| `updateBuildSystem()` | Component | ✅ | ✅ | ✅ | ✅ | Update build |
| `upgrade()` | Component | ✅ | ✅ | ✅ | ✅ | Upgrade version |
| `validateCLIStandard()` | Component | ✅ | ✅ | ✅ | ✅ | Validate CLI |
| `verifyAndFix()` | Component | ✅ | ✅ | ❌ | ❌ | Internalized |
| `verifyTestSuccess()` | Component | ✅ | ✅ | ❌ | ❌ | Internalized |
| `versionParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `versionPromotionParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |
| `whatParameterCompletion()` | DefaultCLI | ❌ | ✅ | ✅ | ✅ | Completion callback |

---

## Summary Statistics

| Version | Total Methods | Available | New | Removed |
|---------|--------------|-----------|-----|---------|
| prod (0.3.5.2) | 82 | 41 | - | - |
| test (0.3.18.0) | 82 | 68 | +31 | -4 |
| dev (0.3.20.1) | 82 | 70 | +8 | -6 |
| latest (0.3.21.1) | 82 | 70 | 0 | 0 |

---

## Breaking Changes Summary

| From | To | Removed Methods | Replacement |
|------|-----|-----------------|-------------|
| prod | test | `setDev`, `setTest`, `setProd`, `setLatest` | `setCICDVersion(targetVersion)` |
| test | dev | `testDiscovery`, `testNewMethod`, `showGuidelines`, `showStandard`, `verifyAndFix`, `verifyTestSuccess` | Internalized or moved to docs |
| dev | latest | None | Bug fixes only |

---

## Related Documentation

- [Fractal PDCA HowTo](/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/_shared/howto.fractal.pdca.md)
- [CMM3 Compliance Checklist](/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)

---

**Legend:** ✅ Available | ❌ Not Available
