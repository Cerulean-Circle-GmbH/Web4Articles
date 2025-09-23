# Component Comparison Analysis
## Unit 0.3.0.4 vs Unit 0.3.0.5

**Generated:** 2025-09-23 16:48:36 UTC
**Tool:** Web4TSComponent Compare
**Command:** `web4tscomponent compare "Unit 0.3.0.4, Unit 0.3.0.5"`

---

## Executive Summary

This analysis compares 2 components to identify architectural differences, dependencies, and file structure variations.

## Package and Configuration Differences

| Aspect | Unit 0.3.0.4 | Unit 0.3.0.5 |
|---|---|---|
| package name | @web4/unit | @web4/unit |
| version | 0.3.0.4 | 0.3.0.5 |
| engines.node | (not specified) | (not specified) |
| scripts.test | vitest | vitest |
| devDependencies.vitest | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 |
| dependencies | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

## File Structure Analysis

| Entry (file/dir) | Unit 0.3.0.4 | Unit 0.3.0.5 | Purpose | Similarity |
|---|---|---|---|---|
| [README.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/README.md) \| [components/Unit/0.3.0.5/README.md](components/Unit/0.3.0.5/README.md) | ❌ | ✅ | Component documentation | 🟪 Unique – U |
| [dist/](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/dist/) \| [components/Unit/0.3.0.5/dist/](components/Unit/0.3.0.5/dist/) | ❌ | ✅ | Compiled JS and type declarations | 🟪 Unique – U |
| [node_modules/](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/node_modules/) \| [components/Unit/0.3.0.5/node_modules/](components/Unit/0.3.0.5/node_modules/) | ❌ | ✅ | Installed dependencies directory | 🟪 Unique – U |
| [package-lock.json](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/package-lock.json) \| [components/Unit/0.3.0.4/package-lock.json](components/Unit/0.3.0.4/package-lock.json) | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (U+U) |
| [package.json](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/package.json) \| [components/Unit/0.3.0.4/package.json](components/Unit/0.3.0.4/package.json) | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (U+U) |
| [src/](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/) \| [components/Unit/0.3.0.4/src/](components/Unit/0.3.0.4/src/) | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| [src/ts/layer2/DefaultCLI.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer2/DefaultCLI.ts) \| [components/Unit/0.3.0.5/src/ts/layer2/DefaultCLI.ts](components/Unit/0.3.0.5/src/ts/layer2/DefaultCLI.ts) | ❌ | ✅ | CLI entry | 🟪 Unique – U |
| [src/ts/layer2/DefaultStorage.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/DefaultStorage.ts) \| [components/Unit/0.3.0.4/src/ts/layer2/DefaultStorage.ts](components/Unit/0.3.0.4/src/ts/layer2/DefaultStorage.ts) | ✅ | ✅ | Core component implementation | 🟥 Different (U+U) |
| [src/ts/layer2/DefaultUnit.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts) \| [components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts](components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts) | ✅ | ✅ | Core component implementation | 🟥 Different (U+U) |
| [src/ts/layer2/GitTextIOR.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/GitTextIOR.ts) \| [components/Unit/0.3.0.4/src/ts/layer2/GitTextIOR.ts](components/Unit/0.3.0.4/src/ts/layer2/GitTextIOR.ts) | ✅ | ✅ | Implementation layer | 🟥 Different (U+U) |
| src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| [src/ts/layer3/BaseIOR.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/BaseIOR.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/BaseIOR.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/BaseIOR.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/CLI.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/CLI.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/CLI.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/CLI.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/ChangeEvent.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/ChangeEvent.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/ChangeEvent.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/ChangeEvent.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/ColorScheme.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ColorScheme.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/ColorScheme.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/ColorScheme.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/Completion.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Completion.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/Completion.ts](components/Unit/0.3.0.5/src/ts/layer3/Completion.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [src/ts/layer3/ComponentAnalysis.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ComponentAnalysis.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/ComponentAnalysis.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/ComponentAnalysis.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/GitPositioning.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitPositioning.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/GitPositioning.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/GitPositioning.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/GitTextIORScenario.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitTextIORScenario.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/GitTextIORScenario.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/GitTextIORScenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/IOR.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/MethodInfo.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/MethodInfo.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/MethodInfo.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/MethodInfo.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/Model.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Model.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/Model.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/Model.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/NamedLink.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/NamedLink.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/NamedLink.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/NamedLink.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/Scenario.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/Storage.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Storage.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/Storage.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/Storage.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/StorageModel.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageModel.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/StorageModel.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/StorageModel.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/StorageScenario.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageScenario.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/StorageScenario.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/StorageScenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [src/ts/layer3/TypeM3.enum.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts](components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts) | ✅ | ✅ | Interface layer | 🟥 Different (U+U) |
| [src/ts/layer3/UUID.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUID.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/UUID.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/UUID.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/UUIDv4.class.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUIDv4.class.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/UUIDv4.class.ts](components/Unit/0.3.0.5/src/ts/layer3/UUIDv4.class.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [src/ts/layer3/Unit.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Unit.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/Unit.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/Unit.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟥 Different (U+U) |
| [src/ts/layer3/UnitIdentifier.type.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitIdentifier.type.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/UnitIdentifier.type.ts](components/Unit/0.3.0.5/src/ts/layer3/UnitIdentifier.type.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [src/ts/layer3/UnitModel.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts) \| [components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts](components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar |
| [src/ts/layer3/UnitReference.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitReference.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/UnitReference.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/UnitReference.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [src/ts/layer3/Upgrade.interface.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Upgrade.interface.ts) \| [components/Unit/0.3.0.5/src/ts/layer3/Upgrade.interface.ts](components/Unit/0.3.0.5/src/ts/layer3/Upgrade.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| [src/ts/layer4/TSCompletion.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts) \| [components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts](components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts) | ❌ | ✅ | Service layer | 🟪 Unique – U |
| [src/ts/layer4/TSCompletion.ts.unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit) \| [components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit](components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit) | ❌ | ✅ | Service layer | 🟪 Unique – U |
| src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| [src/ts/layer5/UnitCLI.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts) \| [components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts](components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts) | ✅ | ✅ | CLI entry | 🟥 Different (U+U) |
| [temp-filename-test/](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/) \| [components/Unit/0.3.0.5/temp-filename-test/](components/Unit/0.3.0.5/temp-filename-test/) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [temp-filename-test/M2.Class.unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/M2.Class.unit) \| [components/Unit/0.3.0.5/temp-filename-test/M2.Class.unit](components/Unit/0.3.0.5/temp-filename-test/M2.Class.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [temp-filename-test/Test.Name.unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/Test.Name.unit) \| [components/Unit/0.3.0.5/temp-filename-test/Test.Name.unit](components/Unit/0.3.0.5/temp-filename-test/Test.Name.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [temp-filename-test/UUID.Indexing.unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/UUID.Indexing.unit) \| [components/Unit/0.3.0.5/temp-filename-test/UUID.Indexing.unit](components/Unit/0.3.0.5/temp-filename-test/UUID.Indexing.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [test/](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/) \| [components/Unit/0.3.0.4/test/](components/Unit/0.3.0.4/test/) | ✅ | ✅ | Automated test specs | 🟩 Identical |
| [test/unit.acceptance.test.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.acceptance.test.ts) \| [components/Unit/0.3.0.4/test/unit.acceptance.test.ts](components/Unit/0.3.0.4/test/unit.acceptance.test.ts) | ✅ | ✅ | Component test specs | 🟥 Different (U+U) |
| [test/unit.filename.consistency.test.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.filename.consistency.test.ts) \| [components/Unit/0.3.0.4/test/unit.filename.consistency.test.ts](components/Unit/0.3.0.4/test/unit.filename.consistency.test.ts) | ✅ | ✅ | Component test specs | 🟥 Different (U+U) |
| [tsconfig.json](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/tsconfig.json) \| [components/Unit/0.3.0.4/tsconfig.json](components/Unit/0.3.0.4/tsconfig.json) | ✅ | ✅ | TypeScript compiler configuration | 🟩 Identical |
| [unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/unit) \| [components/Unit/0.3.0.4/unit](components/Unit/0.3.0.4/unit) | ✅ | ✅ | Component file | 🟥 Different (U+U) |
| [vitest.config.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/vitest.config.ts) \| [components/Unit/0.3.0.4/vitest.config.ts](components/Unit/0.3.0.4/vitest.config.ts) | ✅ | ✅ | Vitest test runner configuration | 🟩 Identical |
| [°folder.unit](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/°folder.unit) \| [components/Unit/0.3.0.5/°folder.unit](components/Unit/0.3.0.5/°folder.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 2