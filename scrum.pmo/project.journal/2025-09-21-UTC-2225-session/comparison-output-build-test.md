📊 Component Comparison Analysis
🔍 Analyzing components: Web4Requirement 0.3.0.5, Web4TSComponent 0.3.0.8

📋 Components to analyze: 2
   - Web4Requirement 0.3.0.5
   - Web4TSComponent 0.3.0.8

### **Differences Table**

| Aspect | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 |
|---|---|---|
| package name | web4-requirement | @web4/web4tscomponent |
| version | 0.3.0.5 | 0.3.0.8 |
| engines.node | >=14.0.0 | (not specified) |
| scripts.test | vitest | vitest |
| devDependencies.vitest | ^1.0.0 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 |
| dependencies | uuid ^9.0.0 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

### **File Comparison Table**

| Entry (file/dir) | Web4Requirement 0.3.0.5 | Web4TSComponent 0.3.0.8 | Purpose | Similarity |
|---|---|---|---|---|
| README.md | ❌ | ✅ | Component documentation | 🟪 Unique – W |
| dist/ | ❌ | ✅ | Compiled JS and type declarations | 🟪 Unique – W |
| node_modules/ | ❌ | ✅ | Installed dependencies directory | 🟪 Unique – W |
| package-lock.json | ✅ | ✅ | Deterministic dependency lockfile | 🟥 Different (W+W) |
| package.json | ✅ | ✅ | Package metadata, scripts, entry points | 🟨 Similar |
| requirement | ✅ | ❌ | Component file | 🟪 Unique – W |
| src/ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | CLI entry | 🟥 Different (W+W) |
| src/ts/layer2/DefaultCLI.ts.unit | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer2/DefaultRequirement.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ❌ | ✅ | Core component implementation | 🟪 Unique – W |
| src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/ColorScheme.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Completion.ts | ✅ | ✅ | Interface layer | 🟩 Identical |
| src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟨 Similar |
| src/ts/layer3/Model.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Requirement.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/RequirementIdentifier.type.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| src/ts/layer3/Scenario.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/UUID.interface.ts | ✅ | ❌ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/UUIDv4.class.ts | ✅ | ❌ | Interface layer | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponent.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ❌ | ✅ | TypeScript interface definition | 🟪 Unique – W |
| src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | Service layer | 🟨 Similar |
| src/ts/layer4/TSCompletion.ts.unit | ✅ | ❌ | Service layer | 🟪 Unique – W |
| src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| src/ts/layer5/RequirementCLI.ts | ✅ | ❌ | CLI entry | 🟪 Unique – W |
| src/ts/layer5/Web4TSComponentCLI.ts | ❌ | ✅ | CLI entry | 🟪 Unique – W |
| test/ | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/requirement.regression.test.ts | ✅ | ❌ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.command-chaining.test.ts | ❌ | ✅ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.file-protection.test.ts | ❌ | ✅ | Component test specs | 🟪 Unique – W |
| test/web4tscomponent.functionality.test.ts | ❌ | ✅ | Component test specs | 🟪 Unique – W |
| tsconfig.json | ✅ | ✅ | TypeScript compiler configuration | 🟥 Different (W+W) |
| vitest.config.ts | ✅ | ✅ | Vitest test runner configuration | 🟥 Different (W+W) |
| web4tscomponent | ❌ | ✅ | Component file | 🟪 Unique – W |
| °folder.unit | ✅ | ❌ | Component file | 🟪 Unique – W |

✅ Component comparison analysis complete
