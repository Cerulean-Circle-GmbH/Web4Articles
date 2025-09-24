# Component Comparison Analysis
## Unit 0.3.0.4 vs Unit 0.3.0.5

**Generated:** 2025-09-23 16:59:19 UTC
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
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/README.md) \| [README.md](README.md) | ❌ | ✅ | Component documentation | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/dist/) \| [dist/](dist/) | ❌ | ✅ | Compiled JS and type declarations | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/node_modules/) \| [node_modules/](node_modules/) | ❌ | ✅ | Installed dependencies directory | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/package-lock.json) \| [package-lock.json](package-lock.json) | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/package.json) \| [package.json](package.json) | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/) \| [src/](src/) | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer2/DefaultCLI.ts) \| [src/ts/layer2/DefaultCLI.ts](src/ts/layer2/DefaultCLI.ts) | ❌ | ✅ | CLI entry | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/DefaultStorage.ts) \| [src/ts/layer2/DefaultStorage.ts](src/ts/layer2/DefaultStorage.ts) | ✅ | ✅ | Core component implementation | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts) \| [src/ts/layer2/DefaultUnit.ts](src/ts/layer2/DefaultUnit.ts) | ✅ | ✅ | Core component implementation | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/GitTextIOR.ts) \| [src/ts/layer2/GitTextIOR.ts](src/ts/layer2/GitTextIOR.ts) | ✅ | ✅ | Implementation layer | 🟥 Different (U+U) |
| src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/BaseIOR.interface.ts) \| [src/ts/layer3/BaseIOR.interface.ts](src/ts/layer3/BaseIOR.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/CLI.interface.ts) \| [src/ts/layer3/CLI.interface.ts](src/ts/layer3/CLI.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/ChangeEvent.interface.ts) \| [src/ts/layer3/ChangeEvent.interface.ts](src/ts/layer3/ChangeEvent.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ColorScheme.interface.ts) \| [src/ts/layer3/ColorScheme.interface.ts](src/ts/layer3/ColorScheme.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Completion.ts) \| [src/ts/layer3/Completion.ts](src/ts/layer3/Completion.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ComponentAnalysis.interface.ts) \| [src/ts/layer3/ComponentAnalysis.interface.ts](src/ts/layer3/ComponentAnalysis.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitPositioning.interface.ts) \| [src/ts/layer3/GitPositioning.interface.ts](src/ts/layer3/GitPositioning.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitTextIORScenario.interface.ts) \| [src/ts/layer3/GitTextIORScenario.interface.ts](src/ts/layer3/GitTextIORScenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts) \| [src/ts/layer3/IOR.interface.ts](src/ts/layer3/IOR.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/MethodInfo.interface.ts) \| [src/ts/layer3/MethodInfo.interface.ts](src/ts/layer3/MethodInfo.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Model.interface.ts) \| [src/ts/layer3/Model.interface.ts](src/ts/layer3/Model.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/NamedLink.interface.ts) \| [src/ts/layer3/NamedLink.interface.ts](src/ts/layer3/NamedLink.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) \| [src/ts/layer3/Scenario.interface.ts](src/ts/layer3/Scenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Storage.interface.ts) \| [src/ts/layer3/Storage.interface.ts](src/ts/layer3/Storage.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageModel.interface.ts) \| [src/ts/layer3/StorageModel.interface.ts](src/ts/layer3/StorageModel.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageScenario.interface.ts) \| [src/ts/layer3/StorageScenario.interface.ts](src/ts/layer3/StorageScenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts) \| [src/ts/layer3/TypeM3.enum.ts](src/ts/layer3/TypeM3.enum.ts) | ✅ | ✅ | Interface layer | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUID.interface.ts) \| [src/ts/layer3/UUID.interface.ts](src/ts/layer3/UUID.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUIDv4.class.ts) \| [src/ts/layer3/UUIDv4.class.ts](src/ts/layer3/UUIDv4.class.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Unit.interface.ts) \| [src/ts/layer3/Unit.interface.ts](src/ts/layer3/Unit.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitIdentifier.type.ts) \| [src/ts/layer3/UnitIdentifier.type.ts](src/ts/layer3/UnitIdentifier.type.ts) | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts) \| [src/ts/layer3/UnitModel.interface.ts](src/ts/layer3/UnitModel.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitReference.interface.ts) \| [src/ts/layer3/UnitReference.interface.ts](src/ts/layer3/UnitReference.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Upgrade.interface.ts) \| [src/ts/layer3/Upgrade.interface.ts](src/ts/layer3/Upgrade.interface.ts) | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts) \| [src/ts/layer4/TSCompletion.ts](src/ts/layer4/TSCompletion.ts) | ❌ | ✅ | Service layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit) \| [src/ts/layer4/TSCompletion.ts.unit](src/ts/layer4/TSCompletion.ts.unit) | ❌ | ✅ | Service layer | 🟪 Unique – U |
| src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts) \| [src/ts/layer5/UnitCLI.ts](src/ts/layer5/UnitCLI.ts) | ✅ | ✅ | CLI entry | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/) \| [temp-filename-test/](temp-filename-test/) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/M2.Class.unit) \| [temp-filename-test/M2.Class.unit](temp-filename-test/M2.Class.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/Test.Name.unit) \| [temp-filename-test/Test.Name.unit](temp-filename-test/Test.Name.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/UUID.Indexing.unit) \| [temp-filename-test/UUID.Indexing.unit](temp-filename-test/UUID.Indexing.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/) \| [test/](test/) | ✅ | ✅ | Automated test specs | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.acceptance.test.ts) \| [test/unit.acceptance.test.ts](test/unit.acceptance.test.ts) | ✅ | ✅ | Component test specs | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.filename.consistency.test.ts) \| [test/unit.filename.consistency.test.ts](test/unit.filename.consistency.test.ts) | ✅ | ✅ | Component test specs | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/tsconfig.json) \| [tsconfig.json](tsconfig.json) | ✅ | ✅ | TypeScript compiler configuration | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/unit) \| [unit](unit) | ✅ | ✅ | Component file | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/vitest.config.ts) \| [vitest.config.ts](vitest.config.ts) | ✅ | ✅ | Vitest test runner configuration | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/°folder.unit) \| [°folder.unit](°folder.unit) | ❌ | ✅ | Component file | 🟪 Unique – U |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 2