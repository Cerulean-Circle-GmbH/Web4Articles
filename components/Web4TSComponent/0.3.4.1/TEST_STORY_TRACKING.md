# Test Story Tracking Table

## Goal
Systematically test Web4TSComponent lifecycle operations with consistent isolation:
- Create/Remove operations work identically in test/data and real project
- No test mode detection in component code
- Tests control environment via `setTargetDirectory()`

## Summary

✅ **15/17 Stories Automated & Passing** (2 TODO)

- Stories 1-4: test/data operations (create, verify, remove, cleanup)
- Stories 5-8: Real project operations (create, verify, remove, cleanup)  
- Story 11: Architecture compliance (model-based, no ENV/globals)
- Story 12: Operations work without test mode coupling
- Story 13: removeVersion script cleanup (bug was already fixed)
- Stories 14-17: Location independence (CLI works from any symlink)

**Key Achievement:** All manual tests converted to repeatable vitest automation with dual-linked manual command documentation.

## Test Story Status

| # | it() description (EXACT) | Status | CLI Command | Method Signature | Internal Methods | Vitest |
|---|--------------------------|--------|-------------|------------------|------------------|--------|
| 1 | Story 1: Create component in test/data | ✅ PASS | `web4tscomponent create ScriptTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` | [:45](test/web4tscomponent.test-story.test.ts#L45) |
| 2 | Story 2: Verify created component structure | ✅ PASS | `web4tscomponent create ScriptTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` | [:56](test/web4tscomponent.test-story.test.ts#L56) |
| 3 | Story 3: Test component removal in test/data | ✅ PASS | `web4tscomponent removeComponent StoryTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `removeComponent()` | [:82](test/web4tscomponent.test-story.test.ts#L82) |
| 4 | Story 4: Verify removal cleanup (files + symlinks) | ✅ PASS | `web4tscomponent removeComponent StoryTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `cleanupAllComponentScriptSymlinks()` | [:99](test/web4tscomponent.test-story.test.ts#L99) |
| 5 | Story 5: Create component in real project | ✅ PASS | `web4tscomponent create RealTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `scaffoldComponent()` | [:164](test/web4tscomponent.test-story.test.ts#L164) |
| 6 | Story 6: Verify real component structure | ✅ PASS | `web4tscomponent create RealTestComponent 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) | `createVersionScriptSymlink()` | [:176](test/web4tscomponent.test-story.test.ts#L176) |
| 7 | Story 7: Remove component from real project | ✅ PASS | `web4tscomponent removeComponent RealTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `removeComponent()` | [:209](test/web4tscomponent.test-story.test.ts#L209) |
| 8 | Story 8: Verify real removal cleanup | ✅ PASS | `web4tscomponent removeComponent RealTestComponent` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `cleanupAllComponentScriptSymlinks()` | [:222](test/web4tscomponent.test-story.test.ts#L222) |
| 9 | Story 9: TBD | ❌ TODO | `web4tscomponent upgrade nextBuild` | [`upgrade(versionType)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L912) | `createVersionFromExisting()` | - |
| 10 | Story 10: TBD | ❌ TODO | `web4tscomponent createSemanticLink dev 0.1.0.1` | [`createSemanticLink(name, type, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1207) | `createSemanticLink()` | - |
| 11 | Story 11: Verify test detection uses model (not ENV/globals) | ✅ FIXED | - | - | `resolveProjectRoot()` | [:246](test/web4tscomponent.test-story.test.ts#L246) |
| 12 | Story 12: All operations work without test mode detection | ✅ PASS | `web4tscomponent create + removeComponent` | [`create(...)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) + [`removeComponent(...)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) | `setTargetDirectory()` | [:275](test/web4tscomponent.test-story.test.ts#L275) |
| 13 | Story 13: removeVersion should clean up script symlinks | ✅ PASS | `web4tscomponent removeVersion RemoveVersionTestComponent 0.1.0.0` | [`removeVersion(componentName, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1737) | `cleanupVersionScriptSymlinks()` | [:324](test/web4tscomponent.test-story.test.ts#L324) |
| 14 | Story 14: CLI works from component directory | ✅ PASS | `cd components/Web4TSComponent/0.3.4.1 && ./web4tscomponent` | [Shell wrapper script](web4tscomponent#L8) | Symlink resolution | [:368](test/web4tscomponent.test-story.test.ts#L368) |
| 15 | Story 15: CLI works via scripts/web4tscomponent symlink | ✅ PASS | `./scripts/web4tscomponent` | [Shell wrapper script](web4tscomponent#L8) | Symlink resolution | [:391](test/web4tscomponent.test-story.test.ts#L391) |
| 16 | Story 16: CLI works via scripts/versions/vX.X.X.X | ✅ PASS | `./scripts/versions/web4tscomponent-v0.3.4.1` | [Shell wrapper script](web4tscomponent#L8) | Symlink resolution | [:413](test/web4tscomponent.test-story.test.ts#L413) |
| 17 | Story 17: CLI works via latest symlink | ✅ PASS | `./components/Web4TSComponent/latest/web4tscomponent` | [Shell wrapper script](web4tscomponent#L8) | Symlink resolution | [:441](test/web4tscomponent.test-story.test.ts#L441) |

## CLI Method Test Coverage

| Method | Tested In Story | Status | CLI Command Example | Method Signature |
|--------|----------------|--------|---------------------|------------------|
| `build` | - | ❌ TODO | `web4tscomponent build` | [`build()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1653) |
| `clean` | - | ❌ TODO | `web4tscomponent clean` | [`clean()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1701) |
| `compare` | - | ❌ TODO | `web4tscomponent compare` | [`compare(components)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1893) |
| `create` | Stories 1-2, 5-6 | ✅ TESTED | `web4tscomponent create ComponentName 0.1.0.0 all` | [`create(name, version, options)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L681) |
| `find` | - | ❌ TODO | `web4tscomponent find components/` | [`find(componentDir)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L830) |
| `info` | - | ❌ TODO | `web4tscomponent info` | [`info(topic)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L3082) |
| `initProject` | - | ❌ TODO | `web4tscomponent initProject .` | [`initProject(targetDir)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L546) |
| `links` | - | ❌ TODO | `web4tscomponent links` | [`links()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1121) |
| `on` | Story 13 | ✅ TESTED | `web4tscomponent on ComponentName 0.1.0.0` | [`on(component, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L865) |
| `removeComponent` | Stories 3-4, 7-8 | ✅ TESTED | `web4tscomponent removeComponent ComponentName` | [`removeComponent(componentName)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1814) |
| `removeVersion` | Story 13 | ✅ TESTED | `web4tscomponent removeVersion ComponentName 0.1.0.0` | [`removeVersion(componentName, version)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1737) |
| `setDev` | - | ❌ TODO | `web4tscomponent setDev 0.1.0.1` | [`setDev(targetVersion)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1057) |
| `setLatest` | - | ❌ TODO | `web4tscomponent setLatest 0.1.0.1` | [`setLatest(targetVersion)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1008) |
| `setProd` | - | ❌ TODO | `web4tscomponent setProd 0.1.0.1` | [`setProd(targetVersion)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1099) |
| `setTest` | - | ❌ TODO | `web4tscomponent setTest 0.1.0.1` | [`setTest(targetVersion)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1078) |
| `start` | - | ❌ TODO | `web4tscomponent start` | [`start()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1620) |
| `test` | - | ❌ TODO | `web4tscomponent test` | [`test(skipPromotion)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L1286) |
| `tree` | - | ❌ TODO | `web4tscomponent tree 3` | [`tree(depth, showHidden)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L980) |
| `updateBuildSystem` | - | ❌ TODO | `web4tscomponent updateBuildSystem` | [`updateBuildSystem()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L3982) |
| `upgrade` | Story 9 | ❌ TODO | `web4tscomponent upgrade nextBuild` | [`upgrade(versionType)`](src/ts/layer2/DefaultWeb4TSComponent.ts#L912) |
| `verifyAndFix` | - | ❌ TODO | `web4tscomponent verifyAndFix` | [`verifyAndFix()`](src/ts/layer2/DefaultWeb4TSComponent.ts#L3235) |

**Coverage:** 4/21 methods tested (19%)

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

