[Back to Docs](../)

# Tree Index Format Specification

## Overview

This specification defines the format, structure, and generation rules for `tree.index.md` files in the Web4Articles project. The tree index provides an automated, consistent way to document directory structures.

## File Format Specification

### Required Header
```markdown
# Tree Index - Generated YYYY-MM-DD HH:MM UTC

## Directory: [relative/path/to/directory]
```

### Optional Configuration Section
```markdown
## Configuration
- Max Depth: [number]
- Exclude Patterns: [comma-separated list]
- Include Files: [true/false]
- Sort By: [name|size|date]
```

### Required Structure Section
````markdown
## Structure
```
[tree output]
```
````

### Optional Summary Section
```markdown
## Summary
- Total Files: [number]
- Total Directories: [number]  
- Total Size: [size with unit]
- Generated: [timestamp]
```

## Generation Rules

### 1. Directory Traversal
- Start from specified root directory
- Follow symbolic links only if explicitly enabled
- Respect .gitignore patterns by default
- Apply custom exclude patterns

### 2. Filtering Rules

#### Default Exclusions
```json
{
  "alwaysExclude": [
    "node_modules",
    ".git",
    ".DS_Store",
    "Thumbs.db",
    "*.log",
    ".env*"
  ],
  "conditionalExclude": {
    "production": ["test", "*.test.*", "*.spec.*"],
    "documentation": ["dist", "build", "coverage"]
  }
}
```

#### Inclusion Priority
1. Explicitly included patterns override exclusions
2. .gitignore patterns applied unless overridden
3. Custom patterns applied last

### 3. Depth Control
- Default maximum depth: 4 levels
- Configurable per generation
- Show continuation marker for truncated branches: `└── ...`

### 4. File Information

#### Minimal Mode
```
├── filename.ext
```

#### Standard Mode
```
├── filename.ext (1.2 KB)
```

#### Detailed Mode
```
├── filename.ext (1.2 KB, 2025-08-15 09:30)
```

## Output Formatting

### Tree Characters
- Use Unicode box-drawing characters
- Fallback to ASCII if Unicode not supported
- Maintain consistent alignment

### Standard Tree Format
```
root/
├── dir1/
│   ├── file1.ts (2.3 KB)
│   └── subdir/
│       └── file2.md (1.1 KB)
└── dir2/
    ├── file3.json (456 B)
    └── file4.ts (3.2 KB)
```

### Size Formatting
- Bytes: 0-999 B
- Kilobytes: 1.0 KB - 999.9 KB
- Megabytes: 1.0 MB - 999.9 MB
- Gigabytes: 1.0 GB+

## Component Architecture

### Core Components

1. **TreeIndexGenerator**
   - Main orchestrator class
   - Configurable via constructor
   - Async generation support

2. **DirectoryTraverser**
   - Handles file system operations
   - Implements filtering logic
   - Manages depth control

3. **TreeFormatter**
   - Converts traversal data to tree format
   - Handles character sets
   - Manages alignment

4. **MarkdownRenderer**
   - Generates final markdown
   - Applies templates
   - Handles special characters

### Integration Points

1. **CLI Integration**
   - TSRanger command: `tree index generate`
   - Standalone tool support

2. **API Integration**
   - Programmatic generation
   - Configuration objects
   - Event hooks

3. **Recovery Integration**
   - Auto-generation during recovery
   - Batch generation support

## Configuration Schema

```typescript
interface TreeIndexConfig {
  // Core settings
  maxDepth: number;
  includeFiles: boolean;
  followSymlinks: boolean;
  
  // Filtering
  excludePatterns: string[];
  includePatterns: string[];
  useGitignore: boolean;
  
  // Display options
  showSizes: boolean;
  showDates: boolean;
  sortBy: 'name' | 'size' | 'date';
  sortReverse: boolean;
  
  // Output control
  outputPath?: string;
  format: 'minimal' | 'standard' | 'detailed';
  encoding: 'utf8' | 'ascii';
  
  // Performance
  maxFiles?: number;
  timeout?: number;
}
```

## Error Handling

### Graceful Degradation
1. Permission errors: Skip inaccessible directories
2. Symbolic link loops: Detect and break
3. Large directories: Apply limits and show warnings

### Error Reporting
```markdown
## Errors and Warnings
- Permission denied: /path/to/restricted
- Symbolic link loop detected: /path/to/link
- Directory limit exceeded (1000+ entries): /path/to/large
```

## Performance Considerations

### Optimization Strategies
1. Lazy evaluation for large trees
2. Streaming output for memory efficiency
3. Parallel traversal for multi-core systems
4. Caching for repeated generations

### Limits
- Default max files: 10,000
- Default timeout: 30 seconds
- Configurable for different environments

## Versioning

### Format Version
```markdown
<!-- tree-index-format: 1.0 -->
```

### Backward Compatibility
- Version detection in existing files
- Migration support for format changes
- Graceful handling of unknown versions

---

This specification provides the foundation for implementing a robust, scalable tree index generation system that integrates seamlessly with the Web4Articles project architecture.