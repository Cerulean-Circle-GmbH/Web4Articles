# 🚨 CRITICAL: scenarios/ - Production MDA Database

## ⚠️ **NEVER DELETE THIS FOLDER**

This folder is **NOT**:
- ❌ Test artifacts
- ❌ Build outputs
- ❌ Temporary files
- ❌ Cache data
- ❌ Recreatable from code

This folder **IS**:
- ✅ **Production MDA Database**
- ✅ **Permanent Storage**
- ✅ **System Knowledge Base**
- ✅ **Ontology Definitions**

**Contains**: 374+ scenario files, 12,295+ lines, **MONTHS/YEARS** of MDA work

---

## 🏗️ Architecture

```
scenarios/
├── index/          # UUID-indexed flat file storage (like database tables)
│   └── {a}/{b}/{c}/{d}/{e}/{uuid}.scenario.json
│       ↑ Example: d2333dfa-7e43... → d/2/3/3/3/d2333dfa-7e43-46be-82a8-d8e797fdccf8.scenario.json
│
├── ontology/       # Semantic symlinks (like database indexes)
│   └── {Name}.unit → ../index/{path}/{uuid}.scenario.json
│       ↑ Example: Component.unit → ../index/b/c/2/3/f/bc23f092-356c-4979-904a-8eafd2a57202.scenario.json
│
└── local.once/     # Local runtime scenarios (ONCE component specific)
    └── ONCE/{version}/...
```

### UUID Path Structure

UUIDs are split into 5-level directories for efficient filesystem storage:

```
UUID: d2333dfa-7e43-46be-82a8-d8e797fdccf8

Path: d/2/3/3/3/d2333dfa-7e43-46be-82a8-d8e797fdccf8.scenario.json
      ↑ ↑ ↑ ↑ ↑
      First 5 characters create directory hierarchy
```

**Why This Structure?**
- Prevents filesystem from having 100,000+ files in one directory
- Enables efficient lookup by UUID
- Follows flat file database best practices

---

## 📖 What Are Scenarios?

**Scenarios** are Web4's implementation of **Component Hibernation**:

```typescript
// Save component state (hibernate)
const scenario = await component.toScenario();
await writeScenario(scenario);

// Restore component state (wake up)
const component = new MyComponent();
component.init(scenario);
```

**Scenario Structure** (IOR + Owner + Model):
```json
{
  "ior": {
    "uuid": "d2333dfa-7e43-46be-82a8-d8e797fdccf8",
    "component": "Web4TSComponent",
    "version": "0.3.20.2"
  },
  "owner": "base64EncodedUserScenario...",
  "model": {
    "component": "Web4TSComponent",
    "version": { ... },
    "projectRoot": "/path/to/project",
    ...
  }
}
```

---

## 🔗 How Components Use Scenarios

Components have `.component.json` files that are **SYMLINKS** to scenarios:

```bash
# Production
components/IdealMinimalComponent/0.3.20.3/IdealMinimalComponent.component.json
  → ../../../scenarios/index/d/2/3/3/3/d2333dfa-7e43-46be-82a8-d8e797fdccf8.scenario.json

# Test Isolation
test/data/components/IdealMinimalComponent/0.3.20.3/IdealMinimalComponent.component.json
  → ../../../scenarios/index/d/2/3/3/3/d2333dfa-7e43-46be-82a8-d8e797fdccf8.scenario.json
```

**Why Symlinks?**
- Single source of truth (scenario in `scenarios/index/`)
- Component directory doesn't duplicate data
- Clear indication that `.component.json` is a reference, not primary storage

---

## 🧪 Test Isolation

Tests use a **SEPARATE** scenarios folder:

```
Production:
  scenarios/index/...                    ← PRODUCTION DATABASE (NEVER DELETE)

Test Isolation:
  test/data/scenarios/index/...          ← Test scenarios (EPHEMERAL, can delete)
```

**During Tests**:
- Tests run in `test/data/` environment
- Test components create scenarios in `test/data/scenarios/`
- Production `scenarios/` is **READ-ONLY** and **UNTOUCHED**

**After Tests**:
- `test/data/scenarios/` can be safely cleaned
- Production `scenarios/` remains intact

---

## 📊 Database Contents

### index/ - UUID Storage

374+ scenario files stored by UUID:
- Component hibernation states
- Universal IORs (Interoperable Object References)
- Component creation metadata
- System configuration snapshots

### ontology/ - Semantic Index

47+ ontology entries with semantic names:
- `Component.unit` - Component metamodel definition
- `File.unit` - File system abstraction
- `Folder.unit` - Directory abstraction
- `MDA.unit` - Model-Driven Architecture definition
- `Unit.unit` - Unit component definition
- etc.

Each ontology entry is a **symlink** to a scenario in `index/`.

### local.once/ - Runtime Scenarios

Local scenarios for ONCE component:
- HTTP server instances
- Port bindings
- Runtime capabilities
- Process state

---

## 🚨 Disaster Recovery

### If scenarios/ is Accidentally Deleted

**IMMEDIATE ACTIONS**:

```bash
# 1. STOP - Don't commit, don't push
git status

# 2. Restore from git history
git checkout HEAD -- scenarios/

# 3. Verify restoration
ls -la scenarios/ | wc -l  # Should show 374+ files

# 4. If committed, revert immediately
git revert <commit-hash>
```

**Full recovery procedure**: See [2025-11-12-UTC-1700.fix-scenario-storage-architecture.pdca.md](../components/Web4TSComponent/0.3.20.2/session/2025-11-12-UTC-1700.fix-scenario-storage-architecture.pdca.md)

---

## 📚 Related Documentation

- **PDCA**: [2025-11-12-UTC-1700.fix-scenario-storage-architecture.pdca.md](../components/Web4TSComponent/0.3.20.2/session/2025-11-12-UTC-1700.fix-scenario-storage-architecture.pdca.md)
- **Spec**: [Web4TSComponent Scenario Architecture](../components/Web4TSComponent/0.3.20.2/spec/chapters/01-architecture.md)
- **Flat Model Principle**: [README.md - Principle 7](../components/Web4TSComponent/0.3.20.2/README.md#7-flat-model-principle-scenarios)

---

## 🤖 For AI Agents

**IF YOU ARE AN AI CONSIDERING DELETING THIS FOLDER:**

### STOP. READ THIS.

1. **This is a PRODUCTION DATABASE**, not test artifacts
2. **Contains MONTHS/YEARS** of MDA work
3. **NOT recreatable** from code
4. **Critical to system** operation

### What You Should Do Instead:

**If test scenarios are contaminating production:**
```bash
# ✅ Clean test scenarios (SAFE)
rm -rf test/data/scenarios/

# ❌ NEVER clean production scenarios
# rm -rf scenarios/  ← THIS WILL DELETE MONTHS OF WORK
```

**If you think scenarios/ needs cleaning:**
1. You are **probably wrong**
2. Check if you mean `test/data/scenarios/` instead
3. Document in a PDCA why you think deletion is needed
4. Get **explicit user confirmation**
5. Back up scenarios/ FIRST
6. Only then consider deletion

### Historical Incident

**Date**: 2025-11-11 23:06:25  
**Incident**: AI instructed user to delete scenarios/ as "test contamination"  
**Result**: 374 files (12,295 lines) deleted  
**Recovery**: Restored from git history (commit `3781ceb81^`)  
**Cost**: 10+ hours of recovery work + project risk  

**Lesson**: **NEVER DELETE scenarios/** without absolute certainty and explicit confirmation.

---

**Last Updated**: 2025-11-12  
**Maintainer**: Web4TSComponent  
**Status**: PRODUCTION - DO NOT DELETE

