# Test Story Tracking Table

## Goal
Systematically test Web4TSComponent lifecycle operations with consistent isolation:
- Create/Remove operations work identically in test/data and real project
- No test mode detection in component code
- Tests control environment via `setTargetDirectory()`

## Summary

✅ **10/10 Stories Automated & Passing**

- Stories 1-4: test/data operations (create, verify, remove, cleanup)
- Stories 5-8: Real project operations (create, verify, remove, cleanup)  
- Story 11: Architecture compliance (model-based, no ENV/globals)
- Story 12: Operations work without test mode coupling

**Key Achievement:** All manual tests converted to repeatable vitest automation with dual-linked manual command documentation.

## Test Story Status

| # | Test Story | Status | CLI Command | Method Signature | Internal Methods | Vitest | Describe |
|---|------------|--------|-------------|------------------|------------------|--------|----------|
| 1 | Create component in test/data | ✅ PASS | `web4tscomponent create ScriptTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` | [:28](test/web4tscomponent.test-story.test.ts#L28) | 🧪 Part 1: Operations in test/data |
| 2 | Verify created component structure | ✅ PASS | `web4tscomponent create ScriptTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` → templates | [:40](test/web4tscomponent.test-story.test.ts#L40) | 🧪 Part 1: Operations in test/data |
| 3 | Test component removal in test/data | ✅ PASS | `web4tscomponent removeComponent StoryTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `removeComponent()` | [:62](test/web4tscomponent.test-story.test.ts#L62) | 🧪 Part 1: Operations in test/data |
| 4 | Verify removal cleanup (files + symlinks) | ✅ PASS | `web4tscomponent removeComponent StoryTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `cleanupAllComponentScriptSymlinks()` | [:75](test/web4tscomponent.test-story.test.ts#L75) | 🧪 Part 1: Operations in test/data |
| 5 | Create component in real project | ✅ PASS | `web4tscomponent create RealTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` → `updateScriptsSymlinks()` | [:164](test/web4tscomponent.test-story.test.ts#L164) | 🏭 Part 2: Operations in Real Project (Automated) |
| 6 | Verify real component structure + scripts | ✅ PASS | `web4tscomponent create RealTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `createVersionScriptSymlink()` + `updateMainScriptSymlink()` | [:176](test/web4tscomponent.test-story.test.ts#L176) | 🏭 Part 2: Operations in Real Project (Automated) |
| 7 | Test component removal in real project | ✅ PASS | `web4tscomponent removeComponent RealTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `removeComponent()` → `cleanupAllComponentScriptSymlinks()` | [:209](test/web4tscomponent.test-story.test.ts#L209) | 🏭 Part 2: Operations in Real Project (Automated) |
| 8 | Verify real removal cleanup | ✅ PASS | `web4tscomponent removeComponent RealTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `cleanupAllComponentScriptSymlinks()` (lstatSync fix) | [:222](test/web4tscomponent.test-story.test.ts#L222) | 🏭 Part 2: Operations in Real Project (Automated) |
| 9 | Test version promotion in test/data | ❌ TODO | `web4tscomponent upgrade nextBuild` | [`upgrade(versionType)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L912) | `createVersionFromExisting()` | - | 🚀 Part 4: Version Promotion |
| 10 | Verify promotion symlinks (dev/test/prod) | ❌ TODO | `web4tscomponent createSemanticLink dev 0.1.0.1` | [`createSemanticLink(name, type, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1207) | `createSemanticLink()` → `updateScriptsSymlinks()` | - | 🚀 Part 4: Version Promotion |
| 11 | Remove redundant test detection | ✅ FIXED | - | - | `resolveProjectRoot()` simplified | [:246](test/web4tscomponent.test-story.test.ts#L246) | 🔧 Part 3: Architecture Fix |
| 12 | Verify operations work with model only | ✅ PASS | `web4tscomponent create + removeComponent` | [`create(...)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) + [`removeComponent(...)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `setTargetDirectory()` controls environment | [:275](test/web4tscomponent.test-story.test.ts#L275) | 🔧 Part 3: Architecture Fix |
| 13 | Test removeVersion cleans up script symlinks | ❌ TODO | `web4tscomponent removeVersion ComponentName 0.1.0.0` | [`removeVersion(componentName, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1770) | `cleanupVersionScriptSymlinks()` | - | 🧹 Part 5: removeVersion Bug Fix |

## PDCA: Systematic Test Development

### PLAN
**Objective:** Create consistent, isolated tests that verify component behavior without coupling component to test environment.

**Approach:**
1. Remove `isTestEnvironment()` logic from component
2. All tests use `setTargetDirectory(test/data)` 
3. Create single comprehensive test file
4. Test each operation in test/data THEN verify same in real project
5. Systematic cleanup after each test

**Expected Outcome:**
- Component behavior identical in test and production
- No global state or environment detection
- Clean separation: tests control environment, component executes logic

### DO
(Implementation below)

### CHECK
(Test execution and verification)

### ACT
(Improvements based on results)

## Next Steps
1. Create `web4tscomponent.test-story.test.ts`
2. Implement systematic test cases 1-12
3. Run test, document results
4. Fix issues
5. Repeat until all pass

