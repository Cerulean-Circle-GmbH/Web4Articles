# 📦 **Web4 Unit Component - Latest Version**

**Version:** latest (0.1.0)  
**Type:** UCP-Compliant Web4 Specification Component  
**Architecture:** 5-Layer Web4 Architecture  

---

## 🎯 **Component Overview**

The **Unit** component provides **unique Linux file identification and coordination** through UUID-based indexing and symbolic link management. It serves as the foundational evidence storage system for Web4 architecture, enabling scenario persistence with backlink tracking and lifecycle management.

### **UCP 4-Qualities Compliance**
- ✅ **Self-Contained:** No external Web4 dependencies, runs independently
- ✅ **Blackbox:** Clear interfaces via UnitIndexStorage and DefaultUnit classes  
- ✅ **Interface Exposure:** TypeScript interfaces and CLI tool available
- ✅ **Machine-Readable:** Package.json with web4 component metadata

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20+
- TypeScript 5.0+
- Git repository context

### **Installation & Build**
```bash
# From component directory
cd components/Unit/latest
npm install
npm run build

# Or use project-level source.env
source ../../source.env  # if available
```

### **Usage as Library**
```typescript
import { UnitIndexStorage } from './src/ts/layer2/UnitIndexStorage.js';

// Initialize storage with project root
const storage = new UnitIndexStorage().init('/path/to/project');

// Save scenario with UUID indexing
await storage.saveScenario(uuid, scenario, symlinkPaths);

// Load scenario from index
const loadedScenario = await storage.loadScenario(uuid);
```

### **Usage via CLI** *(Planned)*
```bash
# From any directory in project
./components/Unit/latest/unit.sh create-scenario --name "Test Unit"
./components/Unit/latest/unit.sh list-scenarios
./components/Unit/latest/unit.sh move-scenario <uuid> <new-path>
```

---

## 📁 **Architecture**

### **Directory Structure**
```
components/Unit/latest/
├── src/
│   ├── ts/layer2/          # Implementation Layer
│   │   ├── DefaultUnit.ts       # Main Unit implementation
│   │   └── UnitIndexStorage.ts  # UUID storage system
│   ├── ts/layer3/          # Interface Layer  
│   │   ├── Unit.ts             # Unit interface definition
│   │   └── SimpleTypes.ts      # Local type definitions
│   └── puml/               # Architecture Diagrams
├── spec/                   # Requirements & Scenarios
├── dist/                   # Compiled JavaScript
└── unit.sh                 # CLI Tool
```

### **Core Classes**

#### **UnitIndexStorage** *(Primary Service)*
- **Purpose:** UUID-based scenario storage with 5-level directory structure
- **Key Methods:**
  - `saveScenario(uuid, scenario, symlinkPaths)` - Stores with symbolic links
  - `loadScenario(uuid)` - Retrieves from index
  - `getBacklinkInfo(uuid)` - Tracks all symlink references
- **Storage Pattern:** `scenarios/index/1/a/1/2/3/1a123c8b-....scenario.json`

#### **DefaultUnit** *(Web4 Wrapper)*
- **Purpose:** Web4-compliant Unit implementation with scenario initialization
- **Pattern:** Empty constructor + `init(scenario)` + `toScenario()`
- **Integration:** Uses UnitIndexStorage for persistence

---

## 🔧 **Integration**

### **With Web4Requirement**
```typescript
// Web4Requirement uses Unit for storage
import { UnitIndexStorage } from '../../../../../Unit/latest/dist/ts/layer2/UnitIndexStorage.js';

const storage = new UnitIndexStorage().init(this.findProjectRoot());
await storage.saveScenario(uuid, scenario, [requirementPath, unitPath]);
```

### **Storage Architecture**
- **Master Files:** Stored in UUID index (`scenarios/index/a/b/c/d/e/`)
- **Symbolic Links:** Created at logical locations for component access
- **Backlink Tracking:** All symlink paths recorded for lifecycle management

---

## 🎯 **Web4 Patterns**

### **Constructor Pattern**
```typescript
// ✅ Web4 Empty Constructor
const unit = new DefaultUnit();

// ✅ Scenario-Based Initialization  
unit.init({
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  name: "Test Unit",
  type: "file-coordination"
});

// ✅ State Serialization
const scenario = unit.toScenario();
```

### **Architecture Layers**
1. **Layer 5:** CLI/View *(Planned)*
2. **Layer 4:** Controllers *(Planned)*  
3. **Layer 3:** Interfaces (Unit, IOR, Scenario)
4. **Layer 2:** Implementation (DefaultUnit, UnitIndexStorage)
5. **Layer 1:** Infrastructure *(Node.js/TypeScript)*

---

## 📋 **Component Metadata**

```json
"web4": {
  "component": {
    "name": "Unit",
    "version": "latest", 
    "type": "specification",
    "architecture": "5-layer",
    "patterns": [
      "empty-constructor",
      "scenario-initialization",
      "ior-references", 
      "network-distribution"
    ]
  }
}
```

---

## 🔍 **Status & Future**

### **Current Implementation**
- ✅ **UUID Index Storage:** Fully functional 5-level directory structure
- ✅ **Symbolic Link Management:** Creation and backlink tracking
- ✅ **Web4Requirement Integration:** Used by requirement storage
- ✅ **TypeScript Compilation:** Clean build with proper imports

### **Planned Features** *(Annotated as @TODO @FUTURE)*
- 🔮 **CLI Implementation:** Complete unit.sh functionality
- 🔮 **Web4 Core Integration:** `@web4/core`, `@web4/ior`, `@web4/scenario` packages
- 🔮 **Network Distribution:** Multi-node Unit coordination
- 🔮 **Advanced Lifecycle:** Move, delete, merge operations via CLI

### **Integration Dependencies** *(Future)*
```json  
// Currently commented out with @TODO @FUTURE @BUG annotations
// "@web4/core": "^0.1.0",           // Future: Core Web4 functionality
// "@web4/ior": "^0.1.0",            // Future: Interoperable Object Reference  
// "@web4/scenario": "^0.1.0"        // Future: Scenario hibernation
```

---

## 🤝 **Contributing**

This component follows **Web4 Architecture** principles and **UCP compliance standards**. 

### **Development Workflow**
1. **Build:** `npm run build`
2. **Test:** `npm test` *(when implemented)*  
3. **Integration:** Use `UnitIndexStorage` class directly
4. **Requirements:** Add scenarios to `spec/requirements/`

### **Architecture Compliance**
- **Empty Constructors:** Always use `new Unit()` then `init(scenario)`
- **Interface Contracts:** Implement Unit interface exactly
- **Self-Containedness:** No breaking external dependencies
- **Evidence Storage:** All scenarios stored in UUID index

---

**🎯 Unit component: Self-contained UUID-based file coordination and evidence storage for Web4 architecture.** 🗂️✨
