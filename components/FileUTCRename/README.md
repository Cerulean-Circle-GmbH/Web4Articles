# FileUTCRename Component

**Version:** v1.0  
**Purpose:** Web4 component for renaming PDCA files with correct UTC timestamps from file creation dates  
**Category:** File Management Utility Component  

## Component Architecture

### Layer Structure (Web4 5-Layer)
- **Layer 1**: Infrastructure - File system operations, Git integration
- **Layer 2**: Implementation - File renaming logic, timestamp extraction
- **Layer 3**: Interface - FileRenamer interface contract
- **Layer 4**: Controller - Orchestration and business logic
- **Layer 5**: View - Command-line interface and output

### Web4 Principles
- **Empty Constructor**: `constructor() {}`
- **Scenario Initialization**: `init(scenario: FileRenameScenario): this`
- **Hibernation Capable**: Complete state serialization via scenarios
- **IOR References**: Network-addressable component references

## Usage

```typescript
import { FileUTCRename } from '@web4x/components/FileUTCRename';

const renamer = new FileUTCRename();
await renamer.init(fileRenameScenario);
await renamer.execute();
```

## Purpose
Fix hallucinated UTC-1552 timestamps in PDCA filenames by using actual file creation dates to generate correct UTC timestamps in format: `2025-08-20-UTC-HHMM-description.md`
