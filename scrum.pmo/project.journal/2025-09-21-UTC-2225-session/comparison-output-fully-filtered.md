🔧 Building Web4TSComponent 0.3.0.8 (source files updated)...
src/ts/layer2/DefaultCLI.ts(231,11): error TS2393: Duplicate function implementation.
src/ts/layer2/DefaultCLI.ts(263,34): error TS2341: Property 'getAllTypeScriptFiles' is private and only accessible within class 'TSCompletion'.
src/ts/layer2/DefaultCLI.ts(390,11): error TS2393: Duplicate function implementation.
src/ts/layer2/DefaultWeb4TSComponent.ts(925,28): error TS18047: 'analysis.packageJson' is possibly 'null'.
src/ts/layer2/DefaultWeb4TSComponent.ts(926,33): error TS18047: 'analysis.packageJson' is possibly 'null'.
src/ts/layer2/DefaultWeb4TSComponent.ts(927,36): error TS18047: 'analysis.packageJson' is possibly 'null'.
src/ts/layer2/DefaultWeb4TSComponent.ts(928,28): error TS18047: 'analysis.packageJson' is possibly 'null'.
📊 Component Comparison Analysis
🔍 Analyzing components: Web4Requirement 0.3.0.5, Web4TSComponent 0.3.0.8, Unit 0.3.0.5, ONCE 0.2.0.0

📋 Components to analyze: 4
   - Web4Requirement 0.3.0.5
   - Web4TSComponent 0.3.0.8
   - Unit 0.3.0.5
   - ONCE 0.2.0.0

### **Differences Table**

| Aspect | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 | Unit 0.3.0.5 | ONCE 0.2.0.0 |
|---|---|---|---|---|
| package name | web4-requirement | @web4/web4tscomponent | @web4/unit | @web4/once |
| version | 0.3.0.5 | 0.3.0.8 | 0.3.0.5 | 0.2.0.0 |
| engines.node | >=14.0.0 | (not specified) | (not specified) | >=18.0.0 |
| scripts.test | vitest | vitest | vitest | vitest |
| devDependencies.vitest | ^1.0.0 | ^3.2.4 | ^3.2.4 | ^0.34.0 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 | ^5.0.0 | ^5.2.2 |
| dependencies | uuid ^9.0.0 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @types/uuid ^10.0.0, uuid ^11.1.0, ws ^8.14.2 |

### **File Comparison Table**

| Entry (file/dir) | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 | Unit 0.3.0.5 | ONCE 0.2.0.0 | Purpose | Similarity |
|---|---|---|---|---|---|---|
| README.md | ❌ | ✅ | ✅ | ❌ | Component documentation | 🟨 Similar (W+U) |
| bin/ | ❌ | ❌ | ❌ | ✅ | CLI executable shims | 🟪 Unique – O |
| bin/once | ❌ | ❌ | ❌ | ✅ | Component file | 🟪 Unique – O |
| bin/once-launcher | ❌ | ❌ | ❌ | ✅ | Component file | 🟪 Unique – O |
| dist/ | ❌ | ✅ | ❌ | ❌ | Compiled JS and type declarations | 🟪 Unique – W |
| node_modules/ | ❌ | ✅ | ❌ | ❌ | Installed dependencies directory | 🟪 Unique – W |
| package-lock.json | ✅ | ✅ | ✅ | ❌ | Deterministic dependency lockfile | 🟨 Similar |
| package.json | ✅ | ✅ | ✅ | ✅ | Package metadata, scripts, entry points | 🟩 Identical |
| requirement | ✅ | ❌ | ❌ | ❌ | Component file | 🟪 Unique – W |
| scenarios/ | ❌ | ❌ | ❌ | ✅ | Example/runtime scenarios | 🟪 Unique – O |
| scenarios/local.once/ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| scenarios/local.once/ONCE/ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| scenarios/local.once/ONCE/0.2.0.0/ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| scenarios/local.once/ONCE/0.2.0.0/6dd45500-f679-4a13-b287-da0ee1f93a9c.scenario.json | ❌ | ❌ | ❌ | ✅ | Component file | 🟪 Unique – O |
| src/ | ✅ | ✅ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/index.ts | ❌ | ❌ | ❌ | ✅ | Component file | 🟪 Unique – O |
| src/ts/ | ❌ | ❌ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | ❌ | ❌ | Implementation layer | 🟥 Different |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | ✅ | ❌ | CLI entry | 🟨 Similar |
| src/ts/layer2/DefaultCLI.ts.unit | ✅ | ❌ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer2/DefaultONCE.ts | ❌ | ❌ | ❌ | ✅ | Core component implementation | 🟪 Unique – O |
| src/ts/layer2/DefaultRequirement.ts | ✅ | ❌ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/DefaultStorage.ts | ❌ | ❌ | ✅ | ❌ | Core component implementation | 🟪 Unique – U |
| src/ts/layer2/DefaultUnit.ts | ❌ | ❌ | ✅ | ❌ | Core component implementation | 🟪 Unique – U |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ❌ | ✅ | ❌ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/GitTextIOR.ts | ❌ | ❌ | ✅ | ❌ | Implementation layer | 🟪 Unique – U |
| src/ts/layer2/PortManager.ts | ❌ | ❌ | ❌ | ✅ | Implementation layer | 🟪 Unique – O |
| src/ts/layer2/ScenarioManager.ts | ❌ | ❌ | ❌ | ✅ | Implementation layer | 🟪 Unique – O |
| src/ts/layer2/ServerHierarchyManager.ts | ❌ | ❌ | ❌ | ✅ | Implementation layer | 🟪 Unique – O |
| src/ts/layer3/ | ❌ | ❌ | ❌ | ❌ | Interface layer | 🟥 Different |
| src/ts/layer3/BaseIOR.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar |
| src/ts/layer3/ChangeEvent.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/ColorScheme.interface.ts | ✅ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar |
| src/ts/layer3/Completion.ts | ✅ | ✅ | ✅ | ❌ | Interface layer | 🟨 Similar |
| src/ts/layer3/Component.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar |
| src/ts/layer3/GitPositioning.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/GitTextIORScenario.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/IOR.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/IOR.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/LifecycleEvents.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar |
| src/ts/layer3/Model.interface.ts | ❌ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar (W+U) |
| src/ts/layer3/NamedLink.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/ONCE.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/ONCEServerModel.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/Requirement.interface.ts | ✅ | ❌ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/RequirementIdentifier.type.ts | ✅ | ❌ | ❌ | ❌ | Interface layer | 🟪 Unique – W |
| src/ts/layer3/Scenario.interface.ts | ❌ | ✅ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar (W+U) |
| src/ts/layer3/Scenario.ts | ❌ | ❌ | ❌ | ✅ | Interface layer | 🟪 Unique – O |
| src/ts/layer3/Storage.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/StorageModel.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/StorageScenario.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/TypeM3.enum.ts | ❌ | ❌ | ✅ | ❌ | Interface layer | 🟪 Unique – U |
| src/ts/layer3/UUID.interface.ts | ✅ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟨 Similar (W+U) |
| src/ts/layer3/UUIDv4.class.ts | ✅ | ❌ | ✅ | ❌ | Interface layer | 🟨 Similar (W+U) |
| src/ts/layer3/Unit.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/UnitIdentifier.type.ts | ❌ | ❌ | ✅ | ❌ | Interface layer | 🟪 Unique – U |
| src/ts/layer3/UnitModel.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/UnitReference.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Upgrade.interface.ts | ❌ | ❌ | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – U |
| src/ts/layer3/Web4TSComponent.interface.ts | ❌ | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ❌ | ✅ | ❌ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer4/ | ❌ | ❌ | ❌ | ❌ | Service layer | 🟥 Different |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | ✅ | ❌ | Service layer | 🟨 Similar |
| src/ts/layer4/TSCompletion.ts.unit | ✅ | ❌ | ✅ | ❌ | Service layer | 🟨 Similar (W+U) |
| src/ts/layer5/ | ❌ | ❌ | ❌ | ❌ | CLI layer | 🟥 Different |
| src/ts/layer5/ONCECLI.ts | ❌ | ❌ | ❌ | ✅ | CLI entry | 🟪 Unique – O |
| src/ts/layer5/RequirementCLI.ts | ✅ | ❌ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer5/UnitCLI.ts | ❌ | ❌ | ✅ | ❌ | CLI entry | 🟪 Unique – U |
| src/ts/layer5/Web4TSComponentCLI.ts | ❌ | ✅ | ❌ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer5/index.ts | ❌ | ❌ | ❌ | ✅ | CLI layer | 🟪 Unique – O |
| temp-filename-test/ | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – U |
| temp-filename-test/M2.Class.unit | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – U |
| temp-filename-test/Test.Name.unit | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – U |
| temp-filename-test/UUID.Indexing.unit | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – U |
| test/ | ✅ | ✅ | ✅ | ❌ | Automated test specs | 🟨 Similar |
| test/requirement.regression.test.ts | ✅ | ❌ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/unit.acceptance.test.ts | ❌ | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – U |
| test/unit.filename.consistency.test.ts | ❌ | ❌ | ✅ | ❌ | Component test specs | 🟪 Unique – U |
| test/web4tscomponent.command-chaining.test.ts | ❌ | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.file-protection.test.ts | ❌ | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.functionality.test.ts | ❌ | ✅ | ❌ | ❌ | Component test specs | 🟪 Unique – W |
| tsconfig.json | ✅ | ✅ | ✅ | ✅ | TypeScript compiler configuration | 🟩 Identical |
| unit | ❌ | ❌ | ✅ | ❌ | Component file | 🟪 Unique – U |
| vitest.config.ts | ✅ | ✅ | ✅ | ❌ | Vitest test runner configuration | 🟨 Similar |
| web4tscomponent | ❌ | ✅ | ❌ | ❌ | Component file | 🟪 Unique – W |
| °folder.unit | ✅ | ❌ | ✅ | ❌ | Component file | 🟨 Similar (W+U) |

✅ Component comparison analysis complete
