# Component Comparison Analysis
## Web4TSComponent 0.3.0.6 vs Web4TSComponent 0.3.0.7

**Generated:** 2025-09-26 15:57:57 UTC
**Tool:** Web4TSComponent Compare
**Command:** `web4tscomponent compare "Web4TSComponent 0.3.0.6, Web4TSComponent 0.3.0.7"`

---

## Executive Summary

This analysis compares 2 components to identify architectural differences, dependencies, and file structure variations.

## Package and Configuration Differences

| Aspect | Web4TSComponent 0.3.0.6 | Web4TSComponent 0.3.0.7 |
|---|---|---|
| package name | @web4/web4tscomponent | @web4/web4tscomponent |
| version | 0.3.0.6 | 0.3.0.7 |
| engines.node | (not specified) | (not specified) |
| scripts.test | vitest | vitest |
| devDependencies.vitest | ^3.2.4 | ^3.2.4 |
| devDependencies.typescript | ^5.0.0 | ^5.0.0 |
| dependencies | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 | @web4/defaultcli file:../../../DefaultCLI/0.3.0.4 |

## File Structure Analysis

| Entry (file/dir) | Web4TSComponent 0.3.0.6 | Web4TSComponent 0.3.0.7 | Purpose | Similarity |
|---|---|---|---|---|
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/README.md) \| [README.md](README.md) | ✅ | ✅ | Component documentation | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/dist/) \| [dist/](dist/) | ✅ | ❌ | Compiled JS and type declarations | 🟪 Unique – W |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/node_modules/) \| [node_modules/](node_modules/) | ✅ | ❌ | Installed dependencies directory | 🟪 Unique – W |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/package-lock.json) \| [package-lock.json](package-lock.json) | ✅ | ✅ | Deterministic dependency lockfile | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/package.json) \| [package.json](package.json) | ✅ | ✅ | Package metadata, scripts, entry points | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/) \| [src/](src/) | ✅ | ✅ | Source code (layers 2/3/4/5) | 🟩 Identical |
| src/ts/ | ❌ | ❌ | Component file | 🟥 Different |
| src/ts/layer2/ | ❌ | ❌ | Implementation layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer2/DefaultCLI.ts) \| [src/ts/layer2/DefaultCLI.ts](src/ts/layer2/DefaultCLI.ts) | ✅ | ✅ | CLI entry | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer2/DefaultWeb4TSComponent.ts) \| [src/ts/layer2/DefaultWeb4TSComponent.ts](src/ts/layer2/DefaultWeb4TSComponent.ts) | ✅ | ✅ | Core component implementation | 🟨 Similar (W+W) |
| src/ts/layer3/ | ❌ | ❌ | Interface layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/CLI.interface.ts) \| [src/ts/layer3/CLI.interface.ts](src/ts/layer3/CLI.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/ColorScheme.interface.ts) \| [src/ts/layer3/ColorScheme.interface.ts](src/ts/layer3/ColorScheme.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Completion.ts) \| [src/ts/layer3/Completion.ts](src/ts/layer3/Completion.ts) | ✅ | ✅ | Interface layer | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/ComponentAnalysis.interface.ts) \| [src/ts/layer3/ComponentAnalysis.interface.ts](src/ts/layer3/ComponentAnalysis.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/MethodInfo.interface.ts) \| [src/ts/layer3/MethodInfo.interface.ts](src/ts/layer3/MethodInfo.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Model.interface.ts) \| [src/ts/layer3/Model.interface.ts](src/ts/layer3/Model.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Scenario.interface.ts) \| [src/ts/layer3/Scenario.interface.ts](src/ts/layer3/Scenario.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Web4TSComponent.interface.ts) \| [src/ts/layer3/Web4TSComponent.interface.ts](src/ts/layer3/Web4TSComponent.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer3/Web4TSComponentModel.interface.ts) \| [src/ts/layer3/Web4TSComponentModel.interface.ts](src/ts/layer3/Web4TSComponentModel.interface.ts) | ✅ | ✅ | TypeScript interface definition | 🟨 Similar (W+W) |
| src/ts/layer4/ | ❌ | ❌ | Service layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer4/TSCompletion.ts) \| [src/ts/layer4/TSCompletion.ts](src/ts/layer4/TSCompletion.ts) | ✅ | ✅ | Service layer | 🟨 Similar (W+W) |
| src/ts/layer5/ | ❌ | ❌ | CLI layer | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/src/ts/layer5/Web4TSComponentCLI.ts) \| [src/ts/layer5/Web4TSComponentCLI.ts](src/ts/layer5/Web4TSComponentCLI.ts) | ✅ | ✅ | CLI entry | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/) \| [test/](test/) | ✅ | ✅ | Automated test specs | 🟩 Identical |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/test.validation.table.md) \| [test/test.validation.table.md](test/test.validation.table.md) | ✅ | ✅ | Component file | 🟨 Similar (W+W) |
| test/utils/ | ❌ | ❌ | Component file | 🟥 Different |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/utils/ProjectRootMocker.ts) \| [test/utils/ProjectRootMocker.ts](test/utils/ProjectRootMocker.ts) | ✅ | ✅ | Component file | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/web4tscomponent.command-chaining.test.ts) \| [test/web4tscomponent.command-chaining.test.ts](test/web4tscomponent.command-chaining.test.ts) | ✅ | ✅ | Component test specs | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/test/web4tscomponent.functionality.test.ts) \| [test/web4tscomponent.functionality.test.ts](test/web4tscomponent.functionality.test.ts) | ✅ | ✅ | Component test specs | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/tsconfig.json) \| [tsconfig.json](tsconfig.json) | ✅ | ✅ | TypeScript compiler configuration | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/vitest.config.ts) \| [vitest.config.ts](vitest.config.ts) | ✅ | ✅ | Vitest test runner configuration | 🟨 Similar (W+W) |
| [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/components/Web4TSComponent/0.3.0.6/web4tscomponent) \| [web4tscomponent](web4tscomponent) | ✅ | ✅ | Component file | 🟨 Similar (W+W) |

---

**Analysis completed:** ✅ Component comparison analysis complete
**Generated by:** Web4TSComponent Compare Tool
**Components analyzed:** 2