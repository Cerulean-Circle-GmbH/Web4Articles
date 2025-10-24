<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

📊 Component Comparison Analysis
🔍 Analyzing components: Web4Requirement 0.3.0.5, Web4TSComponent 0.3.0.8, Unit 0.3.0.5

📋 Components to analyze: 3
   - Web4Requirement 0.3.0.5
   - Web4TSComponent 0.3.0.8
   - Unit 0.3.0.5

### **Differences Table**

| Aspect | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 | Unit 0.3.0.5 |
|---|---|---|---|
| package name | web4-requirement | @web4/web4tscomponent | @web4/unit |
| version | 0.3.0.5 | 0.3.0.8 | 0.3.0.5 |
| engines.node | >=14.0.0 | (not specified) | (not specified) |
| scripts.test | vitest | vitest | vitest |
| devDependencies.vitest | ^1.0.0 | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 | ^5.0.0 |
| dependencies | uuid ^9.0.0 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

### **File Comparison Table**

| Entry (file/dir) | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 | Unit 0.3.0.5 | Purpose | Similarity |
|---|---|---|---|---|---|
| CLI Template (src/ts/layer5/RequirementCLI.ts, src/ts/layer5/Web4TSComponentCLI.ts, src/ts/layer5/UnitCLI.ts) | ✅ | ✅ | ✅ | CLI template pattern | 🟨 Similar (W+W+U) |
| README.md | ❌ | ✅ | ✅ | Component documentation | 🟥 Different (W+U) |
| dist/ | ❌ | ✅ | ❌ | Compiled JS and type declarations | 🟪 Unique – W |
| node_modules/ | ❌ | ✅ | ❌ | Installed dependencies directory | 🟪 Unique – W |
| package-lock.json | ✅ | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (W+W+U) |
| package.json | ✅ | ✅ | ✅ | Package metadata, scripts, entry points | 🟥 Different (W+W+U) |
| requirement | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| src/ | ✅ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | ❌ | Implementation layer | 🟥 Different |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | ✅ | CLI entry | 🟥 Different (W+W+U) |
| src/ts/layer2/DefaultCLI.ts.unit | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer2/DefaultRequirement.ts | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/DefaultStorage.ts | ❌ | ❌ | ✅ | Core component implementation | 🟪 Unique – U |
| src/ts/layer2/DefaultUnit.ts | ❌ | ❌ | ✅ | Core component implementation | 🟪 Unique – U |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ❌ | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/GitTextIOR.ts | ❌ | ❌ | ✅ | Implementation layer | 🟪 Unique – U |
| src/ts/layer3/ | ❌ | ❌ | ❌ | Interface layer | 🟥 Different |
| src/ts/layer3/BaseIOR.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/ChangeEvent.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/ColorScheme.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Completion.ts | ✅ | ✅ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/GitPositioning.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/GitTextIORScenario.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/IOR.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | ✅ | TypeScript interface definition | 🟥 Different (W+W+U) |
| src/ts/layer3/Model.interface.ts | ❌ | ✅ | ✅ | TypeScript interface definition | 🟥 Different (W+U) |
| src/ts/layer3/NamedLink.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Requirement.interface.ts | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/RequirementIdentifier.type.ts | ✅ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| src/ts/layer3/Scenario.interface.ts | ❌ | ✅ | ✅ | TypeScript interface definition | 🟥 Different (W+U) |
| src/ts/layer3/Storage.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/StorageModel.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/StorageScenario.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/TypeM3.enum.ts | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| src/ts/layer3/UUID.interface.ts | ✅ | ❌ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/UUIDv4.class.ts | ✅ | ❌ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/Unit.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/UnitIdentifier.type.ts | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – U |
| src/ts/layer3/UnitModel.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/UnitReference.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Upgrade.interface.ts | ❌ | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Web4TSComponent.interface.ts | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer4/ | ❌ | ❌ | ❌ | Service layer | 🟥 Different |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | ✅ | Service layer | 🟥 Different (W+W+U) |
| src/ts/layer4/TSCompletion.ts.unit | ✅ | ❌ | ✅ | Service layer | 🟩 Identical |
| src/ts/layer5/ | ❌ | ❌ | ❌ | CLI layer | 🟥 Different |
| temp-filename-test/ | ❌ | ❌ | ✅ | Component file | 🟪 Unique – U |
| temp-filename-test/M2.Class.unit | ❌ | ❌ | ✅ | Component file | 🟪 Unique – U |
| temp-filename-test/Test.Name.unit | ❌ | ❌ | ✅ | Component file | 🟪 Unique – U |
| temp-filename-test/UUID.Indexing.unit | ❌ | ❌ | ✅ | Component file | 🟪 Unique – U |
| test/ | ✅ | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/requirement.regression.test.ts | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/unit.acceptance.test.ts | ❌ | ❌ | ✅ | Component test specs | 🟪 Unique – U |
| test/unit.filename.consistency.test.ts | ❌ | ❌ | ✅ | Component test specs | 🟪 Unique – U |
| test/web4tscomponent.command-chaining.test.ts | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.file-protection.test.ts | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.functionality.test.ts | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| tsconfig.json | ✅ | ✅ | ✅ | TypeScript compiler configuration | 🟥 Different (W+W+U) |
| unit | ❌ | ❌ | ✅ | Component file | 🟪 Unique – U |
| vitest.config.ts | ✅ | ✅ | ✅ | Vitest test runner configuration | 🟥 Different (W+W+U) |
| web4tscomponent | ❌ | ✅ | ❌ | Component file | 🟪 Unique – W |
| °folder.unit | ✅ | ❌ | ✅ | Component file | 🟥 Different (W+U) |

✅ Component comparison analysis complete
