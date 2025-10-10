# Component Comparison Analysis
## Web4TSComponent 0.3.5.1 vs Unit 0.3.2.0

**Generated:** 2025-10-09 16:20:37 UTC
**Tool:** Web4TSComponent Compare
**Command:** `web4tscomponent compare "Web4TSComponent 0.3.5.1,Unit 0.3.2.0"`

---

## Executive Summary

This analysis compares 2 components to identify architectural differences, dependencies, and file structure variations.

## Package and Configuration Differences

| Aspect | Web4TSComponent 0.3.5.1 | Unit 0.3.2.0 |
|---|---|---|
| package name | @web4x/web4tscomponent | @web4x/unit |
| version | 0.3.5.1 | 0.3.2.0 |
| engines.node | (not specified) | (not specified) |
| scripts.test | ./src/sh/test.sh | ./src/sh/test.sh |
| devDependencies.vitest | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.9.3 | ^5.9.3 |
| dependencies | glob ^11.0.3, minimatch ^10.0.3 | glob ^11.0.3, minimatch ^10.0.3 |

## File Structure Analysis

| Entry (file/dir) | Web4TSComponent 0.3.5.1 | Unit 0.3.2.0 | Purpose | Similarity |
|---|---|---|---|---|
| CLEANUP_TRACKING.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| CRITICAL_BUG_REPORT.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| README.md | ✅ | ❌ | Component documentation | 🟪 Unique – W |
| TEST_PROMOTION_STRATEGY.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| TEST_STORY_TRACKING.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| dist/ | ✅ | ✅ | Compiled JS and type declarations | 🟩 Identical |
| node_modules | ✅ | ✅ | Component file | 🟨 Similar (W+U) |
| package-lock.json | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (W+U) |
| package.json | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (W+U) |
| src/ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| src/sh/build.sh | ✅ | ✅ | Component file | 🟥 Different (W+U) |
| src/sh/clean-local.sh | ✅ | ✅ | Component file | 🟩 Identical |
| src/sh/clean.sh | ✅ | ✅ | Component file | 🟩 Identical |
| src/sh/detect-dirtpigs.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| src/sh/install-deps.sh | ✅ | ✅ | Component file | 🟥 Different (W+U) |
| src/sh/start-clean.sh | ✅ | ✅ | Component file | 🟥 Different (W+U) |
| src/sh/start.sh | ✅ | ✅ | Component file | 🟥 Different (W+U) |
| src/sh/test.sh | ✅ | ✅ | Component file | 🟥 Different (W+U) |
| src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | CLI entry | 🟥 Different (W+U) |
| src/ts/layer2/DefaultUnit.ts | ❌ | ✅ | Core component implementation | 🟪 Unique – U |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/ColorScheme.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Completion.ts | ✅ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Model.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Scenario.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Unit.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/UnitModel.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Web4TSComponent.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| src/ts/layer5/UnitCLI.ts | ❌ | ✅ | CLI entry | 🟪 Unique – U |
| src/ts/layer5/Web4TSComponentCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| templates/ | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/config/ | ❌ | ❌ | Component file | 🟥 Different |
| templates/config/package.json.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/config/root-package.json.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/config/root-tsconfig.json.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/config/tsconfig.json.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/config/vitest.config.ts.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| templates/sh/build.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/clean-local.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/clean.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/component-wrapper.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/install-deps.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/start-clean.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/start.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/test.sh.template | ✅ | ❌ | Component file | 🟪 Unique – W |
| templates/test/ | ❌ | ❌ | Component file | 🟥 Different |
| templates/test/basic.test.ts.template | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| templates/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| templates/ts/Component.interface.ts.template | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| templates/ts/ComponentCLI.ts.template | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| templates/ts/ComponentModel.interface.ts.template | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| templates/ts/DefaultComponent.ts.template | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/ | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/data/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/contexttest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/contexttest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer2/DefaultContextTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/ContextTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/ContextTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/src/ts/layer5/ContextTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.0/test/contexttest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/contexttest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/contexttest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer2/DefaultContextTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/ContextTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/ContextTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/src/ts/layer5/ContextTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ContextTest/0.1.0.1/test/contexttest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/0.1.0.1/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/dev | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ContextTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/CUSTOM.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/drytest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/drytest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer2/DefaultDryTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/DryTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/DryTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/src/ts/layer5/DryTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.0/test/drytest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/CUSTOM.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/drytest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/drytest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer2/DefaultDryTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/DryTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/DryTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/src/ts/layer5/DryTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/DryTest/0.1.0.1/test/drytest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/0.1.0.1/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/DryTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/errortest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/errortest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer2/DefaultErrorTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/ErrorTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/ErrorTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/src/ts/layer5/ErrorTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/ErrorTest/0.1.0.0/test/errortest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ErrorTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/isolationtest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/isolationtest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer2/DefaultIsolationTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/IsolationTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/IsolationTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/src/ts/layer5/IsolationTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.0/test/isolationtest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/isolationtest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/isolationtest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer2/DefaultIsolationTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/IsolationTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/IsolationTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/src/ts/layer5/IsolationTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/IsolationTest/0.1.0.1/test/isolationtest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/0.1.0.1/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/dev | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IsolationTest/test | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/npmstarttest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/npmstarttest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer2/DefaultNpmStartTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/NpmStartTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/NpmStartTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/src/ts/layer5/NpmStartTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/NpmStartTest/0.1.0.0/test/npmstarttest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/NpmStartTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/semantictest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/semantictest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer2/DefaultSemanticTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/SemanticTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer3/SemanticTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/src/ts/layer5/SemanticTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.0/test/semantictest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/semantictest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/semantictest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer2/DefaultSemanticTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/SemanticTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer3/SemanticTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/src/ts/layer5/SemanticTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.1/test/semantictest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.1/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/semantictest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/semantictest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer2/DefaultSemanticTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/SemanticTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer3/SemanticTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/src/ts/layer5/SemanticTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/SemanticTest/0.1.0.2/test/semantictest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/0.1.0.2/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/dev | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/SemanticTest/test | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer2/DefaultTreeTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/TreeTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer3/TreeTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/src/ts/layer5/TreeTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.0/test/treetest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/treetest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/treetest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.0/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/sh/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/sh/build.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/clean-local.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/install-deps.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/start-clean.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/start.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/sh/test.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer2/DefaultTreeTest.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/TreeTest.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer3/TreeTestModel.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/src/ts/layer5/TreeTestCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/test/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/components/TreeTest/0.1.0.1/test/treetest.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/treetest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/treetest.sh | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/tsconfig.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/0.1.0.1/vitest.config.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/dev | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/latest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/package.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/prod | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TreeTest/test | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/scripts/contexttest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/drytest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/errortest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/isolationtest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/npmstarttest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/semantictest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/treetest | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/ | ❌ | ❌ | Component file | 🟥 Different |
| test/data/scripts/versions/contexttest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/contexttest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/drytest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/drytest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/errortest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/isolationtest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/isolationtest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/lifecycletest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/npmstarttest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/semantictest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/semantictest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/semantictest-v0.1.0.2 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/treetest-v0.1.0.0 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/treetest-v0.1.0.1 | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/ | ❌ | ❌ | Component file | 🟥 Different |
| test/logs/CONSOLIDATED_TEST_RESULTS.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251007-184746.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-102518.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-102604.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-102634.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-110300.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-111802.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-111831.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-111939.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-111958.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-113943.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130524.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130602.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130718.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130732.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130745.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130835.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-130905.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-133905.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-134103.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-134532.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-134636.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-134658.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-135752.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-135849.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-135957.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-155816.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-155849.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-171435.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-171508.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-171658.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-172112.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-172221.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-172706.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-172731.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-172918.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-173042.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/logs/test-20251008-173056.log | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/test-results.json | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/test.validation.table.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/utils/ | ❌ | ❌ | Component file | 🟥 Different |
| test/utils/ProjectRootMocker.ts | ✅ | ❌ | Component file | 🟪 Unique – W |
| test/web4tscomponent.cleanup-testpromo.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.component-creation.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.consolidated-story.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.dirtpig-detection.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.dry-compliance.test.ts.SKIP | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.file-protection.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.full-workflow.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.generated-component-auto-promotion.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.generated-component-testing.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.hardcoded-version-detection.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.npm-start-only.test.ts.SKIP | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.promotion-context.test.ts.SKIP | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.promotion-edge-cases.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.promotion-isolation.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.test-story.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.test-success-verification.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.two-stage-promotion.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.version-display.test.ts.SKIP | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.version-promotion.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| tsconfig.json | ✅ | ✅ | TypeScript compiler configuration | 🟥 Different (W+U) |
| unit.sh | ❌ | ✅ | Component file | 🟪 Unique – U |
| vitest.config.ts | ✅ | ✅ | Vitest test runner configuration | 🟥 Different (W+U) |
| web4tscomponent | ✅ | ❌ | Component file | 🟪 Unique – W |
| web4tscomponent-0351-vs-unit-0320-comparison-20251009T1613.md | ✅ | ❌ | Component file | 🟪 Unique – W |
| web4tscomponent-0351-vs-unit-0320-comparison-20251009T1618.md | ✅ | ❌ | Component file | 🟪 Unique – W |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 2