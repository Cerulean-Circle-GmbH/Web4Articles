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

## Version Evolution Summary

| Version | Total Methods | New Methods Added | Key Changes |
|---------|--------------|-------------------|-------------|
| 0.3.5.2 (prod) | ~40 | Baseline | Core component management |
| 0.3.18.0 (test) | ~70 | +30 | Completion system, CI/CD support |
| 0.3.20.1 (dev) | ~75 | +5 | DelegationProxy, testShell |
| 0.3.21.1 (latest) | ~75 | 0 | Bug fixes, parameter completion fixes |

---

## Method Availability Matrix

### Core Component Methods (DefaultWeb4TSComponent)

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `start()` | ✅ | ✅ | ✅ | ✅ |
| `init()` | ✅ | ✅ | ✅ | ✅ |
| `initProject()` | ✅ | ✅ | ✅ | ✅ |
| `toScenario()` | ✅ | ✅ | ✅ | ✅ |
| `create()` | ✅ | ✅ | ✅ | ✅ |
| `set()` | ✅ | ✅ | ✅ | ✅ |
| `get()` | ✅ | ✅ | ✅ | ✅ |
| `from()` | ✅ | ✅ | ✅ | ✅ |
| `find()` | ✅ | ✅ | ✅ | ✅ |
| `on()` | ✅ | ✅ | ✅ | ✅ |

### Build & Test Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `build()` | ✅ | ✅ | ✅ | ✅ |
| `clean()` | ✅ | ✅ | ✅ | ✅ |
| `test()` | ✅ | ✅ | ✅ | ✅ |
| `releaseTest()` | ✅ | ✅ | ✅ | ✅ |
| `testDiscovery()` | ✅ | ✅ | ❌ | ❌ |
| `testNewMethod()` | ✅ | ✅ | ❌ | ❌ |
| `testCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `testShell()` | ❌ | ❌ | ✅ | ✅ |
| `buildDependencies()` | ❌ | ✅ | ✅ | ✅ |

### Version Management Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `upgrade()` | ✅ | ✅ | ✅ | ✅ |
| `links()` | ✅ | ✅ | ✅ | ✅ |
| `setLatest()` | ✅ | ❌ | ❌ | ❌ |
| `setDev()` | ✅ | ❌ | ❌ | ❌ |
| `setTest()` | ✅ | ❌ | ❌ | ❌ |
| `setProd()` | ✅ | ❌ | ❌ | ❌ |
| `setCICDVersion()` | ❌ | ✅ | ✅ | ✅ |
| `removeVersion()` | ✅ | ✅ | ✅ | ✅ |
| `removeComponent()` | ✅ | ✅ | ✅ | ✅ |

### Display & Information Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `tree()` | ✅ | ✅ | ✅ | ✅ |
| `info()` | ✅ | ✅ | ✅ | ✅ |
| `compare()` | ✅ | ✅ | ✅ | ✅ |
| `showUsage()` | ✅ | ✅ | ✅ | ✅ |
| `showGuidelines()` | ✅ | ✅ | ❌ | ❌ |
| `showStandard()` | ✅ | ✅ | ❌ | ❌ |
| `getContext()` | ❌ | ✅ | ✅ | ✅ |

### Compliance & Validation Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `validateCLIStandard()` | ✅ | ✅ | ✅ | ✅ |
| `auditComponentCompliance()` | ✅ | ✅ | ✅ | ✅ |
| `generateComplianceReport()` | ✅ | ✅ | ✅ | ✅ |
| `verifyAndFix()` | ✅ | ✅ | ❌ | ❌ |
| `verifyTestSuccess()` | ✅ | ✅ | ❌ | ❌ |

### Scaffolding & Generation Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `scaffoldComponent()` | ✅ | ✅ | ✅ | ✅ |
| `generateLocationResilientCLI()` | ✅ | ✅ | ✅ | ✅ |
| `updateBuildSystem()` | ✅ | ✅ | ✅ | ✅ |

### Completion System Methods (DefaultCLI)

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `completion()` | ❌ | ✅ | ✅ | ✅ |
| `shCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `cliSignature()` | ❌ | ✅ | ✅ | ✅ |
| `completeParameter()` | ❌ | ✅ | ✅ | ✅ |
| `componentParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `versionParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `scopeParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `targetVersionParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `versionPromotionParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `depthParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `showHiddenParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `skipPromotionParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `formatParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `whatParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `filterParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `actionParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `targetDirParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `referencesParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `testDescribeReferenceParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `testItCaseReferenceParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `nameParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |
| `optionsParameterCompletion()` | ❌ | ✅ | ✅ | ✅ |

### DelegationProxy Methods (New in 0.3.19+)

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `setTarget()` | ❌ | ❌ | ✅ | ✅ |
| `getWeb4TSComponent()` | ❌ | ❌ | ✅ | ✅ |
| `hasDelegation()` | ❌ | ❌ | ✅ | ✅ |
| `getDelegationTarget()` | ❌ | ❌ | ✅ | ✅ |
| `hasMethod()` | ❌ | ✅ | ✅ | ✅ |
| `listMethods()` | ❌ | ✅ | ✅ | ✅ |
| `getMethodSignature()` | ❌ | ✅ | ✅ | ✅ |

### SemanticVersion Methods

| Method | prod (0.3.5.2) | test (0.3.18.0) | dev (0.3.20.1) | latest (0.3.21.1) |
|--------|:-------------:|:---------------:|:--------------:|:-----------------:|
| `promoteMajor()` | ❌ | ✅ | ✅ | ✅ |
| `promoteMinor()` | ❌ | ✅ | ✅ | ✅ |
| `promotePatch()` | ❌ | ✅ | ✅ | ✅ |
| `promoteRevision()` | ❌ | ✅ | ✅ | ✅ |
| `toScenario()` | ❌ | ✅ | ✅ | ✅ |

---

## Breaking Changes

### prod → test (0.3.5.2 → 0.3.18.0)

| Change Type | Description |
|-------------|-------------|
| **Removed** | `setLatest()`, `setDev()`, `setTest()`, `setProd()` - Replaced by `setCICDVersion()` |
| **Added** | Full completion system (20+ methods) |
| **Added** | `buildDependencies()` for multi-component workflows |
| **Added** | `testCompletion()` for completion testing |
| **Added** | `getContext()` for context inspection |

### test → dev (0.3.18.0 → 0.3.20.1)

| Change Type | Description |
|-------------|-------------|
| **Removed** | `testDiscovery()`, `testNewMethod()` - Development utilities |
| **Removed** | `showGuidelines()`, `showStandard()` - Moved to documentation |
| **Removed** | `verifyAndFix()`, `verifyTestSuccess()` - Internalized |
| **Added** | `testShell()` for isolated test environments |
| **Added** | DelegationProxy system (transparent method delegation) |

### dev → latest (0.3.20.1 → 0.3.21.1)

| Change Type | Description |
|-------------|-------------|
| **Fixed** | Parameter completion for delegated methods |
| **No API Changes** | Same methods available |

---

## Feature Comparison

### Architectural Features

| Feature | prod | test | dev | latest |
|---------|:----:|:----:|:---:|:------:|
| Auto-Discovery CLI | ✅ | ✅ | ✅ | ✅ |
| Tab Completion | Basic | Full | Full | Full |
| DelegationProxy | ❌ | ❌ | ✅ | ✅ |
| Method Chaining | ✅ | ✅ | ✅ | ✅ |
| DRY Compliance | ✅ | ✅ | ✅ | ✅ |
| Test Isolation | ✅ | ✅ | ✅ | ✅ |
| CI/CD Support | ❌ | ✅ | ✅ | ✅ |

### Radical OOP Principles

| Principle | prod | test | dev | latest |
|-----------|:----:|:----:|:---:|:------:|
| Empty Constructor | ✅ | ✅ | ✅ | ✅ |
| Model-Driven State | Partial | ✅ | ✅ | ✅ |
| Flat Model (Scenarios) | ❌ | Partial | ✅ | ✅ |
| Path Authority | ❌ | ✅ | ✅ | ✅ |
| No CLI Flags | ✅ | ✅ | ✅ | ✅ |

---

## Upgrade Recommendations

### From prod (0.3.5.2)

1. **Test First** - Run `npm test` on target version
2. **Update CI/CD** - Replace `setDev/setTest/setProd/setLatest` with `setCICDVersion`
3. **Enable Completion** - Add `source source.env` to shell profile
4. **Review Removed Methods** - Check for usage of deprecated methods

### From test (0.3.18.0)

1. **Test First** - Run `npm test` on target version
2. **DelegationProxy Benefits** - Generated components now have 120+ methods with zero boilerplate
3. **testShell** - Use for isolated test environments
4. **Review Removed Methods** - `testDiscovery`, `showGuidelines`, etc. are removed

### From dev (0.3.20.1) to latest (0.3.21.1)

1. **Safe Upgrade** - No breaking changes
2. **Parameter Completion Fix** - Delegated method parameter completion now works correctly

---

## Related Documentation

- [Fractal PDCA HowTo](../../Web4Articles/scrum.pmo/roles/_shared/howto.fractal.pdca.md)
- [CMM3 Compliance Checklist](../../Web4Articles/scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)
- [Web4 Principles Checklist](../session/web4-principles-checklist.md)
- [DelegationProxy PDCA](../0.3.18.9/session/2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md)

---

**Legend:**
- ✅ Available
- ❌ Not Available
- Partial = Limited implementation
