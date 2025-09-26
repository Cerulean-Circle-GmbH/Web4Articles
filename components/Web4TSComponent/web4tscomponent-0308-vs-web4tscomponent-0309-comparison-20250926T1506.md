### **Differences Table**

| Aspect | Web4TSComponent 0.3.0.8 | Web4TSComponent 0.3.0.9 |
|---|---|---|
| package name | @web4/web4tscomponent | @web4/web4tscomponent |
| version | 0.3.0.8 | 0.3.0.9 |
| engines.node | (not specified) | (not specified) |
| scripts.test | vitest | vitest |
| devDependencies.vitest | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 |
| dependencies | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

### **File Comparison Table**

| Entry (file/dir) | Web4TSComponent 0.3.0.8 | Web4TSComponent 0.3.0.9 | Purpose | Similarity |
|---|---|---|---|---|
| README.md | ✅ | ✅ | Component documentation | 🟩 Identical |
| dist/ | ✅ | ❌ | Compiled JS and type declarations | 🟪 Unique – W |
| node_modules/ | ✅ | ✅ | Installed dependencies directory | 🟩 Identical |
| package-lock.json | ✅ | ✅ | Deterministic dependency lockfile | 🟩 Identical |
| package.json | ✅ | ✅ | Package metadata, scripts, entry points | 🟩 Identical |
| src/ | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | Source code (layers 2/3/4/5) | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Source code (layers 2/3/4/5) | 🟥 Different |
| src/ts/layer2/DefaultCLI.ts | ✅ | ✅ | CLI entry | 🟩 Identical |
| src/ts/layer2/DefaultWeb4TSComponent.from-dev0308.ts | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer2/DefaultWeb4TSComponent.ts | ✅ | ✅ | Core component implementation | 🟩 Identical |
| src/ts/layer2/DefaultWeb4TSComponent.ts.BACKUP_OUR_PERFECT_VERSION | ✅ | ❌ | Core component implementation | 🟪 Unique – W |
| src/ts/layer3/ | ❌ | ❌ | Source code (layers 2/3/4/5) | 🟥 Different |
| src/ts/layer3/CLI.interface.ts | ✅ | ✅ | CLI entry | 🟩 Identical |
| src/ts/layer3/ColorScheme.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Completion.ts | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/MethodInfo.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Model.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Scenario.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Web4TSComponent.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer3/Web4TSComponentModel.interface.ts | ✅ | ✅ | TypeScript interface definition | 🟩 Identical |
| src/ts/layer4/ | ❌ | ❌ | Source code (layers 2/3/4/5) | 🟥 Different |
| src/ts/layer4/TSCompletion.ts | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/layer5/ | ❌ | ❌ | Source code (layers 2/3/4/5) | 🟥 Different |
| src/ts/layer5/Web4TSComponentCLI.ts | ✅ | ✅ | CLI entry | 🟩 Identical |
| test/ | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/data/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/package.json | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/layer2/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer2/DefaultTestComp1.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/Completion.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/Model.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/TestComp1.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer3/TestComp1Model.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer4/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/src/ts/layer5/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp1/0.1.0.0/src/ts/layer5/TestComp1CLI.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/testcomp1.sh | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/tsconfig.json | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp1/0.1.0.0/vitest.config.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/package.json | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/layer2/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/layer2/DefaultCLI.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer2/DefaultTestComp2.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/CLI.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/ColorScheme.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/Completion.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/ComponentAnalysis.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/MethodInfo.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/Model.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/Scenario.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/TestComp2.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer3/TestComp2Model.interface.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer4/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/layer4/TSCompletion.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/src/ts/layer5/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/data/TestComp2/0.1.0.1/src/ts/layer5/TestComp2CLI.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/testcomp2.sh | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/tsconfig.json | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/data/TestComp2/0.1.0.1/vitest.config.ts | ✅ | ❌ | Automated test specs | 🟪 Unique – W |
| test/test.validation.table.md | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/utils/ | ❌ | ❌ | Automated test specs | 🟥 Different |
| test/utils/ProjectRootMocker.ts | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/web4tscomponent.command-chaining.test.ts | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/web4tscomponent.file-protection.test.ts | ✅ | ✅ | Automated test specs | 🟩 Identical |
| test/web4tscomponent.functionality.test.ts | ✅ | ✅ | Automated test specs | 🟩 Identical |
| tsconfig.json | ✅ | ✅ | Component file | 🟩 Identical |
| vitest.config.ts | ✅ | ✅ | Automated test specs | 🟩 Identical |
| web4tscomponent | ✅ | ✅ | Component file | 🟩 Identical |
| web4tscomponent-0308-vs-web4tscomponent-0309-comparison-20250926T1455.md | ✅ | ❌ | Component file | 🟪 Unique – W |