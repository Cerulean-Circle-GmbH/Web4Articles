<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../LICENSE) and AI-GPL Addendum (../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Component Comparison Analysis
## Unit 0.3.0.2 vs Unit 0.3.0.4 vs Unit 0.3.0.5 vs Unit 0.3.0.6 vs Web4TSComponent 0.3.0.6 vs Web4TSComponent 0.3.0.7 vs Web4TSComponent 0.3.0.8 vs Web4TSComponent 0.3.0.9

**Generated:** 2025-09-23 18:30:32 UTC
**Tool:** Web4TSComponent Compare
**Command:** `web4tscomponent compare "Unit 0.3.0.2, Unit 0.3.0.4, Unit 0.3.0.5, Unit 0.3.0.6, Web4TSComponent 0.3.0.6, Web4TSComponent 0.3.0.7, Web4TSComponent 0.3.0.8, Web4TSComponent 0.3.0.9"`

---

## Executive Summary

This analysis compares 8 components to identify architectural differences, dependencies, and file structure variations.

## Package and Configuration Differences

| Aspect | Unit 0.3.0.2 | Unit 0.3.0.4 | Unit 0.3.0.5 | Unit 0.3.0.6 | Web4TSComponent 0.3.0.6 | Web4TSComponent 0.3.0.7 | Web4TSComponent 0.3.0.8 | Web4TSComponent 0.3.0.9 |
|---|---|---|---|---|---|---|---|---|
| package name | @web4/unit | @web4/unit | @web4/unit | @web4x/unit | @web4/web4tscomponent | @web4/web4tscomponent | @web4/web4tscomponent | @web4/web4tscomponent |
| version | 0.3.0.2 | 0.3.0.4 | 0.3.0.5 | 0.3.0.6 | 0.3.0.6 | 0.3.0.7 | 0.3.0.8 | 0.3.0.9 |
| engines.node | (not specified) | (not specified) | (not specified) | (not specified) | (not specified) | (not specified) | (not specified) | (not specified) |
| scripts.test | vitest | vitest | vitest | vitest | vitest | vitest | vitest | vitest |
| devDependencies.vitest | ^1.0.0 | ^3.2.4 | ^3.2.4 | ^1.0.0 | ^3.2.4 | ^3.2.4 | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.0.0 |
| dependencies |  | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |  | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

## File Structure Analysis

| Entry (file/dir) | Unit 0.3.0.2 | Unit 0.3.0.4 | Unit 0.3.0.5 | Unit 0.3.0.6 | Web4TSComponent 0.3.0.6 | Web4TSComponent 0.3.0.7 | Web4TSComponent 0.3.0.8 | Web4TSComponent 0.3.0.9 | Purpose | Similarity |
|---|---|---|---|---|---|---|---|---|---|---|
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/0.3.0.5.unit) \| [0.3.0.5.unit](0.3.0.5.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/Folder.unit) \| [Folder.unit](Folder.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/README.md) \| [README.md](README.md) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Component documentation | 🟥 Different (U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/b/) \| [b/](b/) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| b/8/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| b/8/9/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| b/8/9/4/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| b/8/9/4/b/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/b/8/9/4/b/b894b510-a413-47d2-a85d-22bf0f2bcd9e.scenario.json) \| [b/8/9/4/b/b894b510-a413-47d2-a85d-22bf0f2bcd9e.scenario.json](b/8/9/4/b/b894b510-a413-47d2-a85d-22bf0f2bcd9e.scenario.json) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/dist/) \| [dist/](dist/) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | Compiled JS and type declarations | 🟨 Partial (U+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/node_modules/) \| [node_modules/](node_modules/) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | Installed dependencies directory | 🟨 Partial (U+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/package-lock.json) \| [package-lock.json](package-lock.json) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (U+U+U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/package.json) \| [package.json](package.json) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (U+U+U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/) \| [src/](src/) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/index.ts) \| [src/index.ts](src/index.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| src/puml/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/SimplifiedScenarioStructure.puml) \| [src/puml/SimplifiedScenarioStructure.puml](src/puml/SimplifiedScenarioStructure.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/Unit-Web4Requirement-Integration.png) \| [src/puml/Unit-Web4Requirement-Integration.png](src/puml/Unit-Web4Requirement-Integration.png) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/Unit-Web4Requirement-Integration.puml) \| [src/puml/Unit-Web4Requirement-Integration.puml](src/puml/Unit-Web4Requirement-Integration.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/UnitArchitecture.puml) \| [src/puml/UnitArchitecture.puml](src/puml/UnitArchitecture.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/UnitCurrentArchitecture.puml) \| [src/puml/UnitCurrentArchitecture.puml](src/puml/UnitCurrentArchitecture.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/UnitEnhancedArchitecture.puml) \| [src/puml/UnitEnhancedArchitecture.puml](src/puml/UnitEnhancedArchitecture.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/puml/UnitExecutionFlow.puml) \| [src/puml/UnitExecutionFlow.puml](src/puml/UnitExecutionFlow.puml) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| src/ts/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/DefaultUnit.ts) \| [src/ts/DefaultUnit.ts](src/ts/DefaultUnit.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Core component implementation | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/Unit.interface.ts) \| [src/ts/Unit.interface.ts](src/ts/Unit.interface.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/UnitModel.interface.ts) \| [src/ts/UnitModel.interface.ts](src/ts/UnitModel.interface.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer2/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Implementation layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer2/DefaultCLI.ts) \| [src/ts/layer2/DefaultCLI.ts](src/ts/layer2/DefaultCLI.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | CLI entry | 🟥 Different (U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/DefaultStorage.ts) \| [src/ts/layer2/DefaultStorage.ts](src/ts/layer2/DefaultStorage.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Core component implementation | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/layer2/DefaultUnit.ts) \| [src/ts/layer2/DefaultUnit.ts](src/ts/layer2/DefaultUnit.ts) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Core component implementation | 🟥 Different (U+U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer2/DefaultWeb4TSComponent.ts) \| [src/ts/layer2/DefaultWeb4TSComponent.ts](src/ts/layer2/DefaultWeb4TSComponent.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Core component implementation | 🟥 Different (W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer2/GitTextIOR.ts) \| [src/ts/layer2/GitTextIOR.ts](src/ts/layer2/GitTextIOR.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Implementation layer | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/layer2/UnitIndexStorage.ts) \| [src/ts/layer2/UnitIndexStorage.ts](src/ts/layer2/UnitIndexStorage.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Implementation layer | 🟪 Unique – U |
| src/ts/layer3/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/BaseIOR.interface.ts) \| [src/ts/layer3/BaseIOR.interface.ts](src/ts/layer3/BaseIOR.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/CLI.interface.ts) \| [src/ts/layer3/CLI.interface.ts](src/ts/layer3/CLI.interface.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/ChangeEvent.interface.ts) \| [src/ts/layer3/ChangeEvent.interface.ts](src/ts/layer3/ChangeEvent.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ColorScheme.interface.ts) \| [src/ts/layer3/ColorScheme.interface.ts](src/ts/layer3/ColorScheme.interface.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Completion.ts) \| [src/ts/layer3/Completion.ts](src/ts/layer3/Completion.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Interface layer | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/ComponentAnalysis.interface.ts) \| [src/ts/layer3/ComponentAnalysis.interface.ts](src/ts/layer3/ComponentAnalysis.interface.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitPositioning.interface.ts) \| [src/ts/layer3/GitPositioning.interface.ts](src/ts/layer3/GitPositioning.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/GitTextIORScenario.interface.ts) \| [src/ts/layer3/GitTextIORScenario.interface.ts](src/ts/layer3/GitTextIORScenario.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/IOR.interface.ts) \| [src/ts/layer3/IOR.interface.ts](src/ts/layer3/IOR.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/MethodInfo.interface.ts) \| [src/ts/layer3/MethodInfo.interface.ts](src/ts/layer3/MethodInfo.interface.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟥 Different (U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Model.interface.ts) \| [src/ts/layer3/Model.interface.ts](src/ts/layer3/Model.interface.ts) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟥 Different (U+U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/NamedLink.interface.ts) \| [src/ts/layer3/NamedLink.interface.ts](src/ts/layer3/NamedLink.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts) \| [src/ts/layer3/Scenario.interface.ts](src/ts/layer3/Scenario.interface.ts) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (U+U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/layer3/SimpleTypes.ts) \| [src/ts/layer3/SimpleTypes.ts](src/ts/layer3/SimpleTypes.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Storage.interface.ts) \| [src/ts/layer3/Storage.interface.ts](src/ts/layer3/Storage.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageModel.interface.ts) \| [src/ts/layer3/StorageModel.interface.ts](src/ts/layer3/StorageModel.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/StorageScenario.interface.ts) \| [src/ts/layer3/StorageScenario.interface.ts](src/ts/layer3/StorageScenario.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts) \| [src/ts/layer3/TypeM3.enum.ts](src/ts/layer3/TypeM3.enum.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUID.interface.ts) \| [src/ts/layer3/UUID.interface.ts](src/ts/layer3/UUID.interface.ts) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UUIDv4.class.ts) \| [src/ts/layer3/UUIDv4.class.ts](src/ts/layer3/UUIDv4.class.ts) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/Unit.interface.ts) \| [src/ts/layer3/Unit.interface.ts](src/ts/layer3/Unit.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/layer3/Unit.ts) \| [src/ts/layer3/Unit.ts](src/ts/layer3/Unit.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitIdentifier.type.ts) \| [src/ts/layer3/UnitIdentifier.type.ts](src/ts/layer3/UnitIdentifier.type.ts) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts) \| [src/ts/layer3/UnitModel.interface.ts](src/ts/layer3/UnitModel.interface.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟨 Similar (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/UnitReference.interface.ts) \| [src/ts/layer3/UnitReference.interface.ts](src/ts/layer3/UnitReference.interface.ts) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer3/Upgrade.interface.ts) \| [src/ts/layer3/Upgrade.interface.ts](src/ts/layer3/Upgrade.interface.ts) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Web4TSComponent.interface.ts) \| [src/ts/layer3/Web4TSComponent.interface.ts](src/ts/layer3/Web4TSComponent.interface.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Web4TSComponentModel.interface.ts) \| [src/ts/layer3/Web4TSComponentModel.interface.ts](src/ts/layer3/Web4TSComponentModel.interface.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W+W+W) |
| src/ts/layer4/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Service layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/src/ts/layer4/NamingValidator.ts) \| [src/ts/layer4/NamingValidator.ts](src/ts/layer4/NamingValidator.ts) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Service layer | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts) \| [src/ts/layer4/TSCompletion.ts](src/ts/layer4/TSCompletion.ts) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Service layer | 🟥 Different (U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit) \| [src/ts/layer4/TSCompletion.ts.unit](src/ts/layer4/TSCompletion.ts.unit) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Service layer | 🟩 Identical |
| src/ts/layer5/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | CLI layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts) \| [src/ts/layer5/UnitCLI.ts](src/ts/layer5/UnitCLI.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | CLI entry | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer5/Web4TSComponentCLI.ts) \| [src/ts/layer5/Web4TSComponentCLI.ts](src/ts/layer5/Web4TSComponentCLI.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | CLI entry | 🟨 Similar (W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/) \| [temp-filename-test/](temp-filename-test/) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/M2.Class.unit) \| [temp-filename-test/M2.Class.unit](temp-filename-test/M2.Class.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/Test.Name.unit) \| [temp-filename-test/Test.Name.unit](temp-filename-test/Test.Name.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/temp-filename-test/UUID.Indexing.unit) \| [temp-filename-test/UUID.Indexing.unit](temp-filename-test/UUID.Indexing.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/test-integration-with-web4requirement.js) \| [test-integration-with-web4requirement.js](test-integration-with-web4requirement.js) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/test-uuid-storage.js) \| [test-uuid-storage.js](test-uuid-storage.js) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/) \| [test/](test/) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Automated test specs | 🟨 Partial (U+U+U+W+W+W+W) |
| test/data/ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/test/data/unit-0304-vs-unit-0305-comparison-20250923T1659.md) \| [test/data/unit-0304-vs-unit-0305-comparison-20250923T1659.md](test/data/unit-0304-vs-unit-0305-comparison-20250923T1659.md) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.8/test/data/unit-0305-vs-unit-0306-comparison-20250923T1659.md) \| [test/data/unit-0305-vs-unit-0306-comparison-20250923T1659.md](test/data/unit-0305-vs-unit-0306-comparison-20250923T1659.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – W |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.6/test/data/unit-version-comparison-0304-0305-0306.md) \| [test/data/unit-version-comparison-0304-0305-0306.md](test/data/unit-version-comparison-0304-0305-0306.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.acceptance.test.ts) \| [test/unit.acceptance.test.ts](test/unit.acceptance.test.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Component test specs | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/test/unit.filename.consistency.test.ts) \| [test/unit.filename.consistency.test.ts](test/unit.filename.consistency.test.ts) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Component test specs | 🟥 Different (U+U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/web4tscomponent.command-chaining.test.ts) \| [test/web4tscomponent.command-chaining.test.ts](test/web4tscomponent.command-chaining.test.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Component test specs | 🟥 Different (W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.8/test/web4tscomponent.file-protection.test.ts) \| [test/web4tscomponent.file-protection.test.ts](test/web4tscomponent.file-protection.test.ts) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Component test specs | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/web4tscomponent.functionality.test.ts) \| [test/web4tscomponent.functionality.test.ts](test/web4tscomponent.functionality.test.ts) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Component test specs | 🟥 Different (W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/tsconfig.json) \| [tsconfig.json](tsconfig.json) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | TypeScript compiler configuration | 🟥 Different (U+U+U+U+W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/unit) \| [unit](unit) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/unit.sh) \| [unit.sh](unit.sh) | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different (U+U) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/units/) \| [units/](units/) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.2/units/example-unit.scenario.json) \| [units/example-unit.scenario.json](units/example-unit.scenario.json) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.4/vitest.config.ts) \| [vitest.config.ts](vitest.config.ts) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Vitest test runner configuration | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/web4tscomponent) \| [web4tscomponent](web4tscomponent) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Component file | 🟥 Different (W+W+W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Unit/0.3.0.5/°folder.unit) \| [°folder.unit](°folder.unit) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – U |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 8