# Web4TSComponent Checklist

**Purpose:** CHECK BEFORE EVERY COMPONENT MODIFICATION during fractal PDCA execution.
**Updated:** 2026-01-13
**Session Context:** AI/claude session management - 2026-01-13-UTC-0947

---

## Architecture Principles

- [ ] W1: Layer System - Layer 2 (Implementation), Layer 3 (Interfaces), Layer 4 (Utilities), Layer 5 (CLI Entry) - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts)
- [ ] W1: One class per layer file - `DefaultX.ts` in layer2, `X.interface.ts` in layer3 - [Example](../src/ts/layer3/Component.interface.ts)
- [ ] W2: Auto-Discovery CLI - Methods become CLI commands via TSDoc, NO switch/case in CLI files - [Details](./component.spec.md)
- [ ] W2: TSDoc Annotations - Use `@cliSyntax`, `@cliDefault`, `@cliHide`, `@cliValues` for CLI discovery - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:4620)
- [ ] W3: Method Chaining - All public methods return `Promise<this>` for fluent interface - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts)
- [ ] W3: No CLI Flags - Positional arguments only, no `--flag` style options - [Details](./component.spec.md)

## Delegation & Proxy

- [ ] W4: DelegationProxy Pattern - Use `DelegationProxy<T>` for transparent method delegation - [Example](../src/ts/layer2/DelegationProxy.ts)
- [ ] W4: Delegation Context - Check `this.model.isDelegation` and use `this.model.displayName` when delegating - [Bug Fix](../session/2026-01-13-UTC-0835.setCICDVersion-delegation-context-bug.pdca.md)
- [ ] W5: `getWeb4TSComponent()` - All components must implement this for delegation discovery - [Example](../src/ts/layer2/DelegationProxy.ts:284)
- [ ] W5: `setDelegationContext()` - Sets `displayName`, `displayVersion`, `isDelegation` before delegated calls - [Example](../src/ts/layer2/DelegationProxy.ts:93)

## Model & State

- [ ] W6: Model-Driven State - All state in `this.model`, never in class variables - [Details](./component.spec.md)
- [ ] W6: Model Interface - Define `XModel` interface extending `Model` in layer3 - [Example](../src/ts/layer3/Model.interface.ts)
- [ ] W7: Path Authority - CLI calculates paths (`projectRoot`, `componentsDirectory`), component uses them - [Details](../session/2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md)
- [ ] W7: `updateModelPaths()` - Call before methods that need accurate path context - [Example](../src/ts/layer2/DefaultCLI.ts)

## Version Management

- [ ] W8: Semantic Version Links - Use `dev`, `test`, `prod`, `latest` symlinks - [Example](../src/ts/layer2/SemanticVersion.ts)
- [ ] W8: `setCICDVersion(targetVersion, version)` - Unified method for all CI/CD version setting - [Details](./release.comparison.md)
- [ ] W9: Version Promotion Workflow - `dev` → `test` → `prod`, each stage requires 100% tests - [Details](./component.spec.md)
- [ ] W9: `releaseTest()` - Run before promotion, handles success/failure workflows - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts)

## Completion System

- [ ] W10: Tab Completion - Implement `*ParameterCompletion()` methods for intelligent suggestions - [Example](../src/ts/layer2/DefaultCLI.ts:2195)
- [ ] W10: `HierarchicalCompletionFilter` - Filter completions hierarchically by method context - [Example](../src/ts/layer4/HierarchicalCompletionFilter.ts)
- [ ] W11: `shCompletion()` - Entry point for shell completion integration - [Example](../src/ts/layer2/DefaultCLI.ts:2215)
- [ ] W11: `completion(what, filter)` - Discovery method for listing available completions - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:2969)

## Testing

- [ ] W12: Tootsie Tests Only - No Vitest/Jest, use `./component tootsie file N` - [Details](./component.spec.md)
- [ ] W12: Test Methods as Component Methods - Tests are methods on the component, not external files - [Example](../test/tootsie/)
- [ ] W13: `testShell()` - Isolated test environment with ProjectRootMocker - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:1944)
- [ ] W13: Surgical Test Execution - `test file N`, `test describe N`, `test it N` for targeted testing - [Details](./component.spec.md)

## Build & DRY

- [ ] W14: Shared node_modules - Install to project root, symlink into component - [Details](./component.spec.md)
- [ ] W14: `build.sh` - Standard build script with ESLint integration - [Example](../src/sh/build.sh)
- [ ] W15: Location-Resilient CLI - Use `generateLocationResilientCLI()` for portable scripts - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:820)
- [ ] W15: `scripts/versions/` - Versioned CLI wrappers for each component version - [Example](../../scripts/versions/)

## Component Lifecycle

- [ ] W16: `create(component, version, options)` - Scaffold new component with all layers - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:1194)
- [ ] W16: `scaffoldComponent()` - Generate component structure from template - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:716)
- [ ] W17: `upgrade(versionPromotion)` - Create new version with promotion type - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:1500)
- [ ] W17: `removeVersion()` / `removeComponent()` - Clean removal with symlink handling - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:3021)

## Compliance & Audit

- [ ] W18: `auditComponentCompliance()` - Check component against Web4 standards - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:884)
- [ ] W18: `generateComplianceReport()` - Generate detailed compliance report - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:942)
- [ ] W19: `validateCLIStandard()` - Verify CLI script meets standards - [Example](../src/ts/layer2/DefaultWeb4TSComponent.ts:835)
- [ ] W19: CMM3+ Compliance - Follow PDCA cycles, document decisions - [Details](../../scrum.pmo/roles/_shared/cmm3.compliance.checklist.md)

---

## Quick Reference

| Pattern | Correct | Incorrect |
|---------|---------|-----------|
| Return type | `Promise<this>` | `Promise<void>` |
| CLI params | `method param1 param2` | `method --param=value` |
| Delegation context | `this.model.displayName` | `this.model.component` (when delegating) |
| State location | `this.model.x` | `this.x` |
| Version links | `setCICDVersion(prod, 1.0.0)` | `setDev()`, `setProd()` (deprecated) |

---

**Session:** AI/claude session management
**Generated by:** Claude Opus 4.5 via Web4TSComponent expertise session
**PDCA Reference:** [2026-01-13-UTC-0835.setCICDVersion-delegation-context-bug.pdca.md](../session/2026-01-13-UTC-0835.setCICDVersion-delegation-context-bug.pdca.md)
