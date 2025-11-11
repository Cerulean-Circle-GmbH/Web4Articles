# Component Comparison Analysis
## Web4TSComponent 0.3.17.5 vs IdealMinimalComponent 0.3.17.5 vs Web4Programmer 0.3.17.5

**Generated:** 2025-11-04 18:02:01 UTC
**Tool:** Web4TSComponent Compare
**Command:** `web4tscomponent compare "Web4TSComponent 0.3.17.5,IdealMinimalComponent 0.3.17.5,Web4Programmer 0.3.17.5"`

---

## Executive Summary

This analysis compares 3 components to identify architectural differences, dependencies, and file structure variations.

## Package and Configuration Differences

| Aspect | Web4TSComponent 0.3.17.5 | IdealMinimalComponent 0.3.17.5 | Web4Programmer 0.3.17.5 |
|---|---|---|---|
| package name | web4-project | @web4x/idealminimalcomponent | @web4x/web4programmer |
| version | 0.3.17.5 | 0.3.17.5 | 0.3.17.5 |
| engines.node | (not specified) | (not specified) | (not specified) |
| scripts.test | (not specified) | ./src/sh/test.sh | ./src/sh/test.sh |
| devDependencies.vitest | ^3.2.4 | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.9.3 | ^5.9.3 | ^5.9.3 |
| dependencies | glob ^11.0.3, minimatch ^10.0.3 | glob ^11.0.3, minimatch ^10.0.3 | glob ^11.0.3, minimatch ^10.0.3 |

## File Structure Analysis

| Entry (file/dir) | Web4TSComponent 0.3.17.5 | IdealMinimalComponent 0.3.17.5 | Web4Programmer 0.3.17.5 | Purpose | Similarity |
|---|---|---|---|---|---|
| .DS_Store | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| README.md | ✅ | ❌ | ❌ | Component documentation | 🟪 Unique – W |
| dist/ | ✅ | ❌ | ❌ | Compiled JS and type declarations | 🟪 Unique – W |
| idealminimalcomponent | ❌ | ✅ | ❌ | Component file | 🟪 Unique – I |
| node_modules | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| package-lock.json | ✅ | ❌ | ❌ | Deterministic dependency lockfile | 🟪 Unique – W |
| package.json | ✅ | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (W+I+W) |
| session/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-0938.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1005.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1244.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1450.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1515-cliSignature-radical-oop.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1630.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/2025-11-04-UTC-1755.pdca.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| session/IDEALMINIMALCOMPONENT-UPDATE-CHECKLIST.md | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| source.env | ✅ | ✅ | ✅ | Component file | 🟩 Identical |
| src/ | ✅ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/sh/ | ✅ | ✅ | ✅ | Component file | 🟩 Identical |
| src/sh/build.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/clean-local.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/clean.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/detect-dirtpigs.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| src/sh/install-deps.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/start-clean.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/start.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/sh/test.sh | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+I+W) |
| src/ts/ | ✅ | ✅ | ✅ | Component file | 🟩 Identical |
| src/ts/layer2/ | ✅ | ✅ | ✅ | Implementation layer | 🟩 Identical |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | ✅ | CLI entry | 🟩 Identical |
| src/ts/layer2/DefaultIdealMinimalComponent.ts | ❌ | ✅ | ❌ | Core component implementation | 🟪 Unique – I |
| src/ts/layer2/DefaultWeb4Programmer.ts | ❌ | ❌ | ✅ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/SemanticVersion.ts | ✅ | ❌ | ❌ | Implementation layer | 🟪 Unique – W |
| src/ts/layer3/ | ✅ | ✅ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/CLIModel.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Colors.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Completion.ts | ✅ | ✅ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/Component.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/ComponentDependency.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/IdealMinimalComponent.interface.ts | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – I |
| src/ts/layer3/IdealMinimalComponentModel.interface.ts | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – I |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/MethodSignature.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Model.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Scenario.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/User.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Version.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/VersionModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4Programmer.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4ProgrammerModel.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponent.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer4/ | ✅ | ✅ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer4/DefaultColors.ts | ✅ | ✅ | ✅ | Core component implementation | 🟩 Identical |
| src/ts/layer4/HierarchicalCompletionFilter.ts | ✅ | ✅ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer4/TestFileParser.ts | ✅ | ✅ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer5/ | ✅ | ✅ | ✅ | CLI layer | 🟩 Identical |
| src/ts/layer5/IdealMinimalComponentCLI.ts | ❌ | ✅ | ❌ | CLI entry | 🟪 Unique – I |
| src/ts/layer5/Web4ProgrammerCLI.ts | ❌ | ❌ | ✅ | CLI entry | 🟪 Unique – W |
| src/ts/layer5/Web4TSComponentCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| templates/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/package.json.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/root-package.json.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/root-tsconfig.json.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/tsconfig.json.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/config/vitest.config.ts.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/project/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/project/source.env.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/build.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/clean-local.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/clean.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/component-wrapper.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/install-deps.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/start-clean.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/start.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/test.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/sh/version-wrapper.sh.template | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/test/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/test/basic.test.ts.template | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| templates/ts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| templates/ts/Colors.interface.ts.template | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| templates/ts/Component.interface.ts.template | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| templates/ts/ComponentCLI.ts.template | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| templates/ts/ComponentModel.interface.ts.template | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| templates/ts/DefaultColors.ts.template | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| templates/ts/DefaultComponent.ts.template | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test-output.log | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test-results.log | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/ | ✅ | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/benchmark/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/benchmark/functional-equivalence-0.3.13.2.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/archtestisolate1 | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/source.env | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/build.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/start.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/sh/test.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer2/ | ✅ | ❌ | ❌ | Implementation layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer2/DefaultArchTestIsolate1.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/ | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/ArchTestIsolate1.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/ArchTestIsolate1Model.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/CLIModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/Colors.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/Component.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/MethodSignature.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer3/User.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer4/ | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer4/DefaultColors.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer4/HierarchicalCompletionFilter.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer4/TestFileParser.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer5/ | ✅ | ❌ | ❌ | CLI layer | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/src/ts/layer5/ArchTestIsolate1CLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/test/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/test/archtestisolate1.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/tsconfig.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/0.1.0.0/vitest.config.ts | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/latest | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/ArchTestIsolate1/prod | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/dist/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/idealminimalcomponent | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/node_modules | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/package-lock.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/source.env | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/build.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/start.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/sh/test.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer2/ | ✅ | ❌ | ❌ | Implementation layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer2/DefaultIdealMinimalComponent.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/ | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/CLIModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/Colors.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/Component.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/IdealMinimalComponent.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/IdealMinimalComponentModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/MethodSignature.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer3/User.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer4/ | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer4/DefaultColors.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer4/HierarchicalCompletionFilter.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer4/TestFileParser.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer5/ | ✅ | ❌ | ❌ | CLI layer | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/src/ts/layer5/IdealMinimalComponentCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/test/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/test/idealminimalcomponent.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/tsconfig.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/0.1.0.0/vitest.config.ts | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/latest | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/IdealMinimalComponent/prod | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/source.env | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/build.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/clean-local.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/install-deps.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/start-clean.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/start.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/sh/test.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer2/ | ✅ | ❌ | ❌ | Implementation layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer2/DefaultTestIsolatedComponent.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/ | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/CLIModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/Colors.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/Component.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/MethodSignature.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/TestIsolatedComponent.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/TestIsolatedComponentModel.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer3/User.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer4/ | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer4/DefaultColors.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer4/HierarchicalCompletionFilter.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer4/TestFileParser.ts | ✅ | ❌ | ❌ | Service layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer5/ | ✅ | ❌ | ❌ | CLI layer | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/src/ts/layer5/TestIsolatedComponentCLI.ts | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/test/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/test/testisolatedcomponent.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/testisolatedcomponent | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/tsconfig.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/0.1.0.0/vitest.config.ts | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/latest | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/components/TestIsolatedComponent/prod | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/node_modules/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/package.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/archtestisolate1 | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/idealminimalcomponent | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/testisolatedcomponent | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/archtestisolate1-v0.1.0.0 | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/idealminimalcomponent-v0.1.0.0 | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/scripts/versions/testisolatedcomponent-v0.1.0.0 | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/source.env | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/data/tsconfig.json | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/idealminimalcomponent.test.ts | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – I |
| test/sh/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/sh/test-auto-source-detection.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/sh/test-auto-source-efficiency.sh | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/temp/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/temp/context-delegation-test/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/temp/context-delegation-test/components/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/temp/context-delegation-test/scripts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/temp/context-delegation-test/scripts/versions/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/tootsie/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/ts/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/ts/helpers/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/ts/helpers/testHelpers.ts | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/ts/layer2/ | ✅ | ❌ | ❌ | Implementation layer | 🟪 Unique – W |
| test/ts/layer2/DefaultWeb4TSComponent.baseline.test.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/ts/layer2/PhaseCompletion.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer2/ScenarioPattern.baseline.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer2/SemanticVersionScenario.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer2/UserScenarioPattern.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer2/VersionOperations.baseline.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer2/delegation-version-display.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/ts/layer5/ | ✅ | ❌ | ❌ | CLI layer | 🟪 Unique – W |
| test/ts/layer5/Web4TSComponentCLI.baseline.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| test/vitest/DefaultCLI.test-directory-path.test.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| test/vitest/cli-command-execution-integration.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/cli-model-purity.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/completion-model-driven.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/component-creation-isolation.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/component-discovery-radical-oop.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/duplication-detection.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/environment-completion-consistency.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/four-cases-architecture-enforcement.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/functional-regression-0.3.13.2.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/idealminimalcomponent-creation-isolation.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/idealminimalcomponent-migration.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/on-context-path-initialization.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/path-authority-architecture.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/template-context-delegation.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/template-generation.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/test-isolation-compliance.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/web4-naming-compliance.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/vitest/web4tscomponent.template-sync.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4programmer.test.ts | ❌ | ❌ | ✅ | Component test specs | 🟪 Unique – W |
| tsconfig.json | ✅ | ✅ | ✅ | TypeScript compiler configuration | 🟥 Different (W+I+W) |
| vitest.config.ts | ✅ | ✅ | ✅ | Vitest test runner configuration | 🟥 Different (W+I+W) |
| web4programmer | ❌ | ❌ | ✅ | Component file | 🟪 Unique – W |
| web4tscomponent | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 3