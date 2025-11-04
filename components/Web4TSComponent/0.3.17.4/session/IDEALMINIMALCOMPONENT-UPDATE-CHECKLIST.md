# 📋 IdealMinimalComponent Update Checklist

**Purpose**: When testing changes in `IdealMinimalComponent`, this checklist ensures all propagation paths are updated.

**Context**: `IdealMinimalComponent` is generated from `Web4TSComponent` templates. Changes to the core component must propagate through multiple layers before being visible in test components.

---

## 🔄 Update Propagation Flow

```
Web4TSComponent source (layer 2-5)
  ↓ (build)
Web4TSComponent dist/
  ↓ (create command)
Web4TSComponent templates/
  ↓ (create IdealMinimalComponent)
IdealMinimalComponent source
  ↓ (build)
IdealMinimalComponent dist/
  ↓ (source source.env)
IdealMinimalComponent CLI (executable)
```

---

## ✅ Complete Update Checklist

### 1️⃣ **Update Web4TSComponent Source**
**Location**: `components/Web4TSComponent/0.3.17.4/src/`

- [ ] Edit TypeScript source files in:
  - `src/ts/layer2/DefaultCLI.ts` (CLI core logic)
  - `src/ts/layer2/DefaultWeb4TSComponent.ts` (Component core logic)
  - `src/ts/layer3/` (Intermediate layers)
  - `src/ts/layer4/` (Higher-level abstractions)
  - `src/ts/layer5/Web4TSComponentCLI.ts` (CLI entry point)

**Files Modified**: ___________________________________________

---

### 2️⃣ **Build Web4TSComponent**
**Command**: `web4tscomponent build`

**Purpose**: Compile TypeScript → JavaScript in `dist/`

- [ ] Run build command
- [ ] Verify no compilation errors
- [ ] Check `dist/ts/layer2/DefaultCLI.js` has changes
- [ ] Check `dist/ts/layer2/DefaultWeb4TSComponent.js` has changes

**Output**: `components/Web4TSComponent/0.3.17.4/dist/`

---

### 3️⃣ **Update Templates (if applicable)**
**Location**: `components/Web4TSComponent/0.3.17.4/templates/`

#### Template Categories:
- [ ] **Project Templates** (`templates/project/`)
  - [ ] `source.env.template` - Bash completion, PS1, PATH setup
  - [ ] `package.json.template` - npm dependencies
  - [ ] `vitest.config.ts.template` - Test configuration

- [ ] **Config Templates** (`templates/config/`)
  - [ ] `root-tsconfig.json.template` - TypeScript compilation config
  - [ ] `component-tsconfig.json.template` - Component-specific TS config

- [ ] **Component Templates** (`templates/component/`)
  - [ ] `Default{ComponentName}.template.ts` - Component implementation
  - [ ] `{ComponentName}CLI.template.ts` - CLI wrapper
  - [ ] `{ComponentName}Model.template.ts` - Data model

- [ ] **Script Templates** (`templates/scripts/`)
  - [ ] CLI wrapper scripts
  - [ ] Build scripts
  - [ ] Test scripts

**Changed Templates**: ___________________________________________

---

### 4️⃣ **Rebuild After Template Changes**
**Command**: `web4tscomponent build` (if templates changed)

**Purpose**: Copy updated templates into `dist/templates/`

- [ ] Run build command
- [ ] Verify templates copied to `dist/templates/`
- [ ] Check template content matches source

---

### 5️⃣ **Update Project-Level source.env Files**

#### Root Project source.env
**Location**: `/Users/Shared/Workspaces/temp/Web4Articles/source.env`

- [ ] Update bash completion logic (if changed)
- [ ] Update PS1 prompt (if changed)
- [ ] Update PATH setup (if changed)
- [ ] Update versioned CLI registration (if changed)
- [ ] Test: `source source.env` (no errors)

#### Test Data source.env
**Location**: `components/Web4TSComponent/0.3.17.4/test/data/source.env`

- [ ] Sync changes from root `source.env`
- [ ] Ensure test isolation paths are correct
- [ ] Test: Run tests to verify isolation works

#### Test Component source.env
**Location**: `components/Web4TSComponent/0.3.17.4/test/data/components/TestIsolatedComponent/0.1.0.0/source.env`

- [ ] Sync changes from root `source.env`
- [ ] Verify component-specific paths
- [ ] Test: Run component tests

---

### 6️⃣ **Regenerate IdealMinimalComponent**
**Command**: `rm -rf components/IdealMinimalComponent && web4tscomponent create IdealMinimalComponent`

**Purpose**: Generate fresh component with updated templates and dist/ files

- [ ] Delete old `IdealMinimalComponent`
- [ ] Run create command
- [ ] Verify creation success message
- [ ] Check structure created:
  ```
  components/IdealMinimalComponent/
    0.1.0.0/
      src/
      dist/ (after build)
      source.env
      package.json
      tsconfig.json
      idealminimalcomponent (CLI wrapper)
    latest → 0.1.0.0
    prod → 0.1.0.0
  ```

---

### 7️⃣ **Build IdealMinimalComponent**
**Command**: (automatic during create, but verify)

**Purpose**: Compile IdealMinimalComponent TypeScript → JavaScript

- [ ] Verify `dist/` directory exists
- [ ] Check `dist/ts/layer2/DefaultCLI.js` has changes
- [ ] Check `dist/ts/layer5/IdealMinimalComponentCLI.js` exists
- [ ] Verify CLI wrapper script is executable

---

### 8️⃣ **Source Environment (reload shell state)**
**Command**: `source source.env` (in project root)

**Purpose**: Register CLI for tab completion and PATH

- [ ] Run source command
- [ ] Verify no errors
- [ ] Check CLI is in PATH: `which idealminimalcomponent`
- [ ] Check tab completion registered: `complete -p | grep idealminimalcomponent`
- [ ] Check versioned CLI registered: `complete -p | grep idealminimalcomponent-v`

---

### 9️⃣ **Test Tab Completion Manually**
**Interactive Testing**: Open bash and test

#### Method Name Completion:
- [ ] `idealminimalcomponent <Tab>` → shows methods
- [ ] `idealminimalcomponent te<Tab>` → shows methods starting with "te"
- [ ] `idealminimalcomponent test<Tab>` → completes to "test "

#### Parameter Completion:
- [ ] `idealminimalcomponent test <Tab>` → shows file/describe/itCase
- [ ] `idealminimalcomponent completion <Tab>` → shows method/parameter
- [ ] `idealminimalcomponent build <Tab>` → shows "(no completions available)"

#### Edge Cases:
- [ ] Empty completion shows "(no completions available)" NOT "💭 Thinking..." forever
- [ ] Multi-word parameters work
- [ ] Hierarchical completion works (test → describe → itCase)

---

### 🔟 **Run Automated Tests**

#### Architecture Tests:
- [ ] `web4tscomponent test file four-cases-architecture-enforcement.test`
  - Validates Path Authority (no `process.cwd()`)
  - Validates no `require()` (ESM only)
  - Checks all 4 cases: prod/test × create/initProject

#### Completion Tests:
- [ ] `web4tscomponent test file completion-model-driven.test`
  - Validates parameterless completion methods
  - Validates method signature (0 parameters)
  - Validates method name completion integration

#### Component Creation Tests:
- [ ] `web4tscomponent test file idealminimalcomponent-creation-isolation.test`
  - Creates IdealMinimalComponent in test isolation
  - Verifies `shCompletion` method exists
  - Verifies tab completion doesn't hang
  - Checks test evidence preservation

#### Template Sync Tests:
- [ ] `web4tscomponent test file web4tscomponent.template-sync.test`
  - Validates templates match project root files
  - Checks `source.env` content sync
  - Validates `tsconfig.json` correctness

---

### 1️⃣1️⃣ **Update Tests (if needed)**
**Location**: `components/Web4TSComponent/0.3.17.4/test/vitest/`

- [ ] Update test expectations if behavior changed
- [ ] Add new test cases for new features
- [ ] Update mocks/fixtures if needed
- [ ] Verify all tests pass: `web4tscomponent test`

**Changed Tests**: ___________________________________________

---

### 1️⃣2️⃣ **Update Documentation**
**Location**: `components/Web4TSComponent/0.3.17.4/`

- [ ] Update `README.md` with new features/changes
- [ ] Update method TSDoc comments if behavior changed
- [ ] Create/Update PDCA in `session/` directory
- [ ] Update this checklist if process changed

**Changed Docs**: ___________________________________________

---

### 1️⃣3️⃣ **Git Commit**
**Command**: `git add -A && git commit -m "..."`

#### Commit Message Rules:
- **PDCA files**: Use ONLY the filename (no description)
  ```bash
  git commit -m "2025-11-04-UTC-1200.pdca.md"
  ```

- **Code files**: Use descriptive message
  ```bash
  git commit -m "Fix parameter completion: Use getComponentClass() instead of hardcoded component name"
  ```

- [ ] Stage all changes: `git add -A`
- [ ] Write correct commit message (follow rules above)
- [ ] Commit: `git commit -m "..."`
- [ ] Verify commit: `git log --oneline -1`

---

## 🚨 Common Pitfalls

### ❌ **Don't Skip Steps!**
- ❌ Editing source but not building → old code runs
- ❌ Building but not regenerating component → old templates used
- ❌ Regenerating but not sourcing → tab completion broken
- ❌ Updating code but not tests → tests fail with confusing errors

### ❌ **Don't Edit Generated Files!**
- ❌ Editing `IdealMinimalComponent/0.1.0.0/` files directly
- ❌ Editing `dist/` files directly
- ❌ Editing template output instead of template source

### ❌ **Don't Forget Environment Reload!**
- ❌ Testing without `source source.env`
- ❌ Tab completion caching old results
- ❌ CLI not in PATH after regeneration

---

## 🎯 Quick Reference: Full Update Cycle

```bash
# 1. Edit source
vim components/Web4TSComponent/0.3.17.4/src/ts/layer2/DefaultCLI.ts

# 2. Build Web4TSComponent
web4tscomponent build

# 3. Update templates if needed
vim components/Web4TSComponent/0.3.17.4/templates/project/source.env.template

# 4. Rebuild if templates changed
web4tscomponent build

# 5. Regenerate IdealMinimalComponent
rm -rf components/IdealMinimalComponent
web4tscomponent create IdealMinimalComponent

# 6. Reload environment
source source.env

# 7. Test manually
idealminimalcomponent <Tab>
idealminimalcomponent completion <Tab>

# 8. Run automated tests
web4tscomponent test file completion-model-driven.test
web4tscomponent test file idealminimalcomponent-creation-isolation.test

# 9. Commit
git add -A
git commit -m "Descriptive message about the change"
```

---

## 📊 Files Affected by Change Type

### **Completion Logic Changes**
- ✏️ `src/ts/layer2/DefaultCLI.ts`
- 📦 `dist/ts/layer2/DefaultCLI.js` (after build)
- 🧪 `test/vitest/completion-model-driven.test.ts`
- 🔄 Regenerate `IdealMinimalComponent`

### **Component Logic Changes**
- ✏️ `src/ts/layer2/DefaultWeb4TSComponent.ts`
- 📦 `dist/ts/layer2/DefaultWeb4TSComponent.js` (after build)
- 🧪 `test/vitest/four-cases-architecture-enforcement.test.ts`
- 🔄 Regenerate `IdealMinimalComponent`

### **Bash Completion Changes**
- ✏️ `templates/project/source.env.template`
- 📦 `dist/templates/project/source.env.template` (after build)
- ✏️ Root `source.env`
- ✏️ Test `source.env` files (3 locations)
- 🧪 Test manually in bash
- 🔄 Regenerate `IdealMinimalComponent`
- 🔄 Run `web4tscomponent initProject § force` (updates project root files)

### **Template Changes**
- ✏️ Any file in `templates/`
- 📦 Corresponding file in `dist/templates/` (after build)
- 🧪 `test/vitest/web4tscomponent.template-sync.test.ts`
- 🔄 Regenerate `IdealMinimalComponent`
- 🔄 Run `web4tscomponent initProject § force` if project templates changed

### **TypeScript Config Changes**
- ✏️ `templates/config/root-tsconfig.json.template`
- 📦 Root `tsconfig.json`
- 🧪 `test/vitest/web4tscomponent.template-sync.test.ts`
- 🔄 Run `web4tscomponent initProject § force`

---

## 🔍 Debug Checklist

**If tab completion is broken:**
- [ ] Check `/tmp/debug-completion.log`
- [ ] Verify component class name is correct (not "null")
- [ ] Verify callback is found (not "null")
- [ ] Check CLI is registered: `complete -p | grep idealminimalcomponent`
- [ ] Source environment: `source source.env`

**If tests are failing:**
- [ ] Check `web4tscomponent build` succeeded
- [ ] Verify `dist/` files are up to date
- [ ] Check test expectations match new behavior
- [ ] Run single test: `web4tscomponent test file <testname>`
- [ ] Check for architectural violations (process.cwd, require)

**If component creation fails:**
- [ ] Check templates are up to date
- [ ] Verify `dist/templates/` exists
- [ ] Run `web4tscomponent build` again
- [ ] Check for file permission errors

---

**Version**: 0.3.17.4  
**Last Updated**: 2025-11-04  
**Author**: Web4TSComponent Development Team

