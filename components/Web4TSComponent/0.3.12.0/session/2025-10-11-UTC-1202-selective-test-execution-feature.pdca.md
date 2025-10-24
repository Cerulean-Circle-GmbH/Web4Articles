<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# PDCA: Selective Test Execution Feature

**Date:** 2025-10-11 UTC 12:02  
**Version:** 0.3.11.2 (dev/test)  
**Context:** Avoid re-running 144 stable tests while debugging 1 failing test  

---

## 🎯 PLAN

### **Problem Statement**

Current testing workflow is inefficient:
- Running `npm test` executes ALL 172 tests every time
- Takes 214+ seconds to get feedback on a single test
- Developer must wait through 144 passing tests to see 1 failure
- No CLI integration with vitest's selective test features

### **Proposed Solution**

Implement `web4tscomponent test <scope> <reference>` command:

```bash
# List available test files with numbers
web4tscomponent test file <Tab>
# Shows:
#   1: web4tscomponent.tab-completion.test.ts
#   2: web4tscomponent.dirtpig-detection.test.ts
#   3: web4tscomponent.full-workflow.test.ts
#   ...

# Run specific test file
web4tscomponent test file 2
# → npx vitest test/web4tscomponent.dirtpig-detection.test.ts

# List describe blocks in a file
web4tscomponent test describe 2
# Shows:
#   1: 🧽 Dirtpig Detection Tests
#   2: 🚨 DIRTPIG ALARM
#   ...

# Run specific describe block
web4tscomponent test describe 2 1
# → npx vitest -t "🧽 Dirtpig Detection Tests"

# List it() test cases in a describe
web4tscomponent test itCase 2 1
# Shows:
#   1: Should detect test component contamination
#   2: Should detect broken symlinks
#   ...

# Run specific test case
web4tscomponent test itCase 2 1 3
# → npx vitest -t "Should maintain stable component count"
```

### **Architecture Design**

#### **1. CLI Method Signature**

```typescript
// In DefaultWeb4TSComponent.ts
async test(
  scope: 'file' | 'describe' | 'itCase',
  ...references: string[]
): Promise<void>
```

#### **2. Tab Completion Methods**

```typescript
// Completion for scope parameter
async testScopeParameterCompletion(contextArgs: string[]): Promise<string[]> {
  return ['file', 'describe', 'itCase'];
}

// Completion for file reference (shows numbered list)
async testFileParameterCompletion(contextArgs: string[]): Promise<string[]> {
  const testDir = path.join(this.componentPath, 'test');
  const testFiles = await this.scanTestFiles(testDir);
  return testFiles.map((f, i) => `${i + 1}:${f.name}`);
}

// Completion for describe reference (parses chosen file)
async testDescribeParameterCompletion(contextArgs: string[]): Promise<string[]> {
  const fileNum = parseInt(contextArgs[2]); // references[0]
  const testFile = await this.getTestFileByNumber(fileNum);
  const describes = await this.parseDescribeBlocks(testFile);
  return describes.map((d, i) => `${i + 1}:${d.name}`);
}

// Completion for itCase reference (parses chosen describe)
async testItCaseParameterCompletion(contextArgs: string[]): Promise<string[]> {
  const fileNum = parseInt(contextArgs[2]); // references[0]
  const describeNum = parseInt(contextArgs[3]); // references[1]
  const testFile = await this.getTestFileByNumber(fileNum);
  const itCases = await this.parseItCases(testFile, describeNum);
  return itCases.map((it, i) => `${i + 1}:${it.name}`);
}
```

#### **3. Test Parser (TypeScript AST)**

```typescript
// New layer4 component: TestFileParser.ts
export class TestFileParser {
  // Parse test file and extract describe blocks
  static parseDescribeBlocks(filePath: string): DescribeBlock[] {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const ast = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    
    const describes: DescribeBlock[] = [];
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'describe'
      ) {
        const nameArg = node.arguments[0];
        if (ts.isStringLiteral(nameArg)) {
          describes.push({
            name: nameArg.text,
            startLine: ts.getLineAndCharacterOfPosition(
              ast,
              node.getStart()
            ).line + 1,
          });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    return describes;
  }

  // Parse test file and extract it() cases
  static parseItCases(
    filePath: string,
    describeBlock?: number
  ): ItCase[] {
    // Similar AST parsing for it() calls
  }
}
```

#### **4. Vitest Executor**

```typescript
// In DefaultWeb4TSComponent.ts
private async runVitest(options: {
  file?: string;
  testNamePattern?: string;
  bail?: boolean;
}): Promise<TestResults> {
  const args = ['npx', 'vitest'];
  
  if (options.file) {
    args.push(path.join('test', options.file));
  }
  
  if (options.testNamePattern) {
    args.push('-t', options.testNamePattern);
  }
  
  if (options.bail) {
    args.push('--bail=1');
  }
  
  // Execute and capture results
  const result = await this.executeCommand(args.join(' '));
  return this.parseTestResults(result);
}
```

### **Implementation Steps**

1. **Create TestFileParser.ts** (layer4)
   - Parse TypeScript AST to find describe() and it() calls
   - Extract test names and line numbers
   - Support nested describe blocks

2. **Add test() method to DefaultWeb4TSComponent.ts**
   - Implement scope routing logic
   - Map numeric references to test files/blocks/cases
   - Execute vitest with appropriate filters

3. **Add completion methods to DefaultWeb4TSComponent.ts**
   - `testScopeParameterCompletion()` - returns scope options
   - `testFileParameterCompletion()` - lists test files with numbers
   - `testDescribeParameterCompletion()` - lists describes with numbers
   - `testItCaseParameterCompletion()` - lists it cases with numbers

4. **Update package.json scripts**
   - Add convenience scripts for common patterns
   - Add to template first, then current versions

5. **Add completion metadata**
   - Annotate test() method parameters for TSCompletion
   - Ensure proper callback registration

6. **Write tests**
   - Test AST parsing on sample test files
   - Test CLI argument routing
   - Test vitest command generation
   - Test completion methods

7. **Update README.md**
   - Document new test command
   - Show examples with tab completion
   - Explain scope types and workflow

### **Expected Behavior**

#### **Scenario 1: Debug single failing test**

```bash
$ web4tscomponent test file <Tab>
1:web4tscomponent.tab-completion.test.ts
2:web4tscomponent.dirtpig-detection.test.ts
3:web4tscomponent.full-workflow.test.ts
...

$ web4tscomponent test file 2
# Runs only dirtpig-detection tests (362ms vs 214s)
✓ 2 passed | 1 failed (4)
```

#### **Scenario 2: Run specific describe block**

```bash
$ web4tscomponent test describe 2 <Tab>
1:🧽 Dirtpig Detection Tests

$ web4tscomponent test describe 2 1
# Runs all tests in that describe block
```

#### **Scenario 3: Run single test case**

```bash
$ web4tscomponent test itCase 2 1 <Tab>
1:Should detect test component contamination
2:Should detect broken symlinks
3:Should maintain stable component count
4:Should verify test components are properly isolated

$ web4tscomponent test itCase 2 1 3
# Runs ONLY "Should maintain stable component count" test
```

### **Package.json Scripts (Template)**

```json
{
  "scripts": {
    "test": "./src/sh/test.sh",
    "test:bail": "npx vitest --bail=1",
    "test:watch": "npx vitest --watch",
    "test:file": "npx vitest",
    "test:coverage": "npx vitest --coverage"
  }
}
```

### **Success Criteria**

- ✅ Can run single test file in <1 second
- ✅ Can run single describe block via CLI
- ✅ Can run single it() case via CLI
- ✅ Tab completion lists all test files with numbers
- ✅ Tab completion lists describes for chosen file
- ✅ Tab completion lists it cases for chosen describe
- ✅ All 172 tests still pass with full test run
- ✅ README documents the new feature
- ✅ Package.json template updated

### **Version Management**

- **Stable:** 0.3.11.1 (no changes)
- **Development:** 0.3.11.2 (set as dev)
- **Testing:** 0.3.11.2 (set as test)
- **Work on:** 0.3.11.2

---

## 🔧 DO

### **Phase 1: Setup Version**

1. ✅ Verify 0.3.11.2 exists
2. ⏳ Set 0.3.11.2 as dev
3. ⏳ Set 0.3.11.2 as test
4. ⏳ Load component context: Web4TSComponent 0.3.11.2

### **Phase 2: Create TestFileParser**

1. ⏳ Create `src/ts/layer4/TestFileParser.ts`
2. ⏳ Implement `parseDescribeBlocks(filePath: string)`
3. ⏳ Implement `parseItCases(filePath: string, describeIndex?: number)`
4. ⏳ Implement `scanTestFiles(testDir: string)`
5. ⏳ Add TypeScript AST parsing utilities
6. ⏳ Handle nested describe blocks
7. ⏳ Handle describe.skip, it.skip, it.only, etc.

### **Phase 3: Implement CLI Methods**

1. ⏳ Add `test()` method to DefaultWeb4TSComponent.ts
2. ⏳ Implement scope routing (file/describe/itCase)
3. ⏳ Add numeric reference resolution
4. ⏳ Add vitest command builder
5. ⏳ Add test result parser
6. ⏳ Add error handling for invalid references

### **Phase 4: Implement Completion Methods**

1. ⏳ Add `testScopeParameterCompletion()`
2. ⏳ Add `testFileParameterCompletion()`
3. ⏳ Add `testDescribeParameterCompletion()`
4. ⏳ Add `testItCaseParameterCompletion()`
5. ⏳ Ensure numeric formatting: `1:test-name`
6. ⏳ Add metadata annotations for TSCompletion

### **Phase 5: Update Templates**

1. ⏳ Update package.json template with test scripts
2. ⏳ Update any.interface.ts if needed for types
3. ⏳ Update ComponentAnalysis.interface.ts if needed

### **Phase 6: Testing**

1. ⏳ Write test for TestFileParser.parseDescribeBlocks()
2. ⏳ Write test for TestFileParser.parseItCases()
3. ⏳ Write test for test() method with file scope
4. ⏳ Write test for test() method with describe scope
5. ⏳ Write test for test() method with itCase scope
6. ⏳ Write test for completion methods
7. ⏳ Run full test suite (must be 100%)

### **Phase 7: Documentation**

1. ⏳ Update README.md with new test command
2. ⏳ Add examples with tab completion
3. ⏳ Document scope types
4. ⏳ Document workflow for debugging failing tests

---

## ✅ CHECK

### **Validation Checklist**

- [ ] TestFileParser correctly parses describe blocks
- [ ] TestFileParser correctly parses it cases
- [ ] TestFileParser handles nested describes
- [ ] test() method routes to correct scope handler
- [ ] Numeric references resolve to correct test files
- [ ] Numeric references resolve to correct describes
- [ ] Numeric references resolve to correct it cases
- [ ] Vitest commands are generated correctly
- [ ] Tab completion shows numbered test files
- [ ] Tab completion shows numbered describes
- [ ] Tab completion shows numbered it cases
- [ ] Error handling for invalid file numbers
- [ ] Error handling for invalid describe numbers
- [ ] Error handling for invalid it case numbers
- [ ] All 172 existing tests still pass
- [ ] New feature tests pass
- [ ] README is updated and clear
- [ ] Package.json template updated

### **Performance Validation**

- [ ] Single test file runs in <1 second
- [ ] Single describe runs in <2 seconds
- [ ] Single it case runs in <500ms
- [ ] Parsing test files for completion is instant (<100ms)

---

## 🔄 ACT

### **Success Metrics**

- Time to run single test: **214s → <1s** (200x improvement)
- Developer iteration speed: **Significantly improved**
- Test debugging experience: **Much better**
- Feature completeness: **Full tab completion integration**

### **Follow-up Actions**

- [ ] Consider adding `test all` scope for full suite
- [ ] Consider adding `test failed` scope for last failed tests
- [ ] Consider adding `test changed` scope for tests related to changed files
- [ ] Consider caching test file AST parsing results
- [ ] Consider adding `--watch` flag support
- [ ] Consider adding `--bail` flag support

### **Promotion Path**

1. Complete all Phase 1-7 tasks on 0.3.11.2
2. Run full test suite: `web4tscomponent test`
3. Verify 100% test success (172/172 passing)
4. Promote 0.3.11.2 → 0.3.11.3 (nextBuild) as prod
5. Create 0.3.11.4 as new dev

---

## 📊 METRICS

### **Before**

- Full test run: 214 seconds
- Debug single test: 214 seconds (must run all)
- Iterations per hour: ~16
- Developer frustration: High

### **After (Expected)**

- Full test run: 214 seconds (unchanged)
- Debug single test: <1 second (200x faster)
- Iterations per hour: 3600+ possible
- Developer frustration: Low

### **Time Investment**

- Estimated implementation: 4-6 hours
- Payback period: Immediate (first debugging session)
- Long-term value: High (used constantly)

---

## 🎯 NEXT STEPS

1. **Verify 0.3.11.2 version setup**
2. **Create TestFileParser.ts skeleton**
3. **Implement basic AST parsing**
4. **Add test() method to CLI**
5. **Test with single file first**
6. **Expand to describe/itCase scopes**
7. **Add all completion methods**
8. **Update templates**
9. **Full test suite verification**
10. **Promotion to prod**

---

**Status:** PLANNED - Ready to execute Phase 1  
**Priority:** HIGH - Immediate developer productivity improvement  
**Risk:** LOW - Additive feature, no breaking changes  

