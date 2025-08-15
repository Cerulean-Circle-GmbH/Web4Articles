[Back to Docs](../)

# Tree Index Documentation Process

## Overview

The `tree.index.md` file is an automated documentation standard for capturing directory structures throughout the Web4Articles project. These files provide a consistent, readable snapshot of folder hierarchies, making project navigation and understanding easier for all team members.

## Purpose and Benefits

### CMM Level 4 Alignment
- **Automated Documentation**: Reduces manual documentation burden
- **Consistent Format**: Standardized across all project components
- **Version Controlled**: Track structural changes over time
- **Searchable**: Markdown format enables easy searching

### Key Benefits
1. **Quick Navigation**: Understand component structure at a glance
2. **Onboarding Support**: New team members can quickly understand project layout
3. **Change Tracking**: Git history shows structural evolution
4. **Integration Ready**: Works with recovery and CI/CD processes

## When to Create tree.index.md

### Automatic Generation Triggers
1. **Component Creation**: When creating new components under `/components/`
2. **Recovery Process**: During project recovery from README
3. **Major Refactoring**: After significant structural changes
4. **Sprint Deliverables**: For new features with multiple files

### Manual Generation Cases
1. **Documentation Updates**: When updating project documentation
2. **Troubleshooting**: To understand current state during debugging
3. **Architecture Reviews**: For architectural decision records

## File Naming and Location

### Standard Naming
- Always named: `tree.index.md`
- One per directory that needs documentation
- Located at the root of the directory being documented

### Example Structure
```
components/
├── TSRanger/
│   ├── tree.index.md      # Documents TSRanger structure
│   ├── v1.0/
│   │   └── tree.index.md  # Documents v1.0 structure
│   └── v2.5/
│       └── tree.index.md  # Documents v2.5 structure
```

## Generation Process

### Using TSRanger (Recommended)
```bash
# Generate tree index for current directory
tsranger tree index generate .

# Generate with specific depth
tsranger tree index generate . --depth 3

# Generate excluding certain patterns
tsranger tree index generate . --exclude "*.test.ts,*.spec.ts"
```

### Using Direct Tool
```bash
# From project root
ts-node src/tools/TreeIndexGenerator.ts --path ./components/TSRanger

# With configuration
ts-node src/tools/TreeIndexGenerator.ts --config tree-config.json
```

### Programmatic Usage
```typescript
import { TreeIndexGenerator } from '../tools/TreeIndexGenerator';

const generator = new TreeIndexGenerator({
  maxDepth: 4,
  excludePatterns: ['node_modules', '.git', 'dist'],
  includeFiles: true,
  showSizes: true
});

await generator.generate('./src');
```

## Configuration Options

### Default Configuration
```json
{
  "excludePatterns": [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    "*.log"
  ],
  "maxDepth": 5,
  "includeFiles": true,
  "showSizes": false,
  "showDates": false,
  "sortBy": "name"
}
```

### Environment-Specific Settings
- **Development**: Include test files, show dates
- **Production**: Exclude tests, minimize output
- **Documentation**: Full detail, include examples

## Integration Guidelines

### Recovery Process Integration
1. Add tree index generation to recovery workflow
2. Update `recovery-process.md` Phase 2:
   ```bash
   # After context recovery
   tsranger tree index generate . --output ./tree.index.md
   ```

### CI/CD Integration
```yaml
# .github/workflows/documentation.yml
- name: Generate Tree Indexes
  run: |
    npm run generate:tree-indexes
    git add **/tree.index.md
    git commit -m "chore: Update tree indexes" || true
```

### Component Templates
Update component creation templates to include:
```bash
# After creating component structure
tsranger tree index generate "./components/${COMPONENT_NAME}"
```

## Maintenance Guidelines

### Update Frequency
- **Automatic**: On significant structural changes
- **Scheduled**: Weekly for active development branches
- **Manual**: Before architectural reviews or demos

### Version Control
- Commit tree.index.md files with related changes
- Use meaningful commit messages: `docs: Update TSRanger tree index`
- Include in PR reviews for structural changes

### Review Process
1. Verify accuracy during code reviews
2. Check for excluded files that should be visible
3. Ensure depth is appropriate for understanding

## Role-Specific Guidelines

### Architect
- Review tree indexes during design phase
- Ensure architectural decisions are reflected
- Use for PlantUML diagram creation

### Developer
- Generate after implementing new features
- Update when refactoring
- Use for debugging file location issues

### Tester
- Reference for test file organization
- Verify test coverage against structure
- Use for test planning

### PO
- Review for feature completeness
- Use in sprint reviews
- Include in deliverable documentation

### Scrum Master
- Monitor for process compliance
- Include in sprint artifacts
- Use for impediment identification

## Examples

### Basic tree.index.md
```markdown
# Tree Index - Generated 2025-08-15 09:30 UTC

\`\`\`
src/
├── components/
│   ├── io/
│   │   ├── Logger.ts
│   │   └── TerminalIO.ts
│   ├── model/
│   │   └── RangerModel.ts
│   └── view/
│       └── RangerView.ts
├── tools/
│   └── TreeIndexGenerator.ts
└── index.ts
\`\`\`

Total: 7 files, 3 directories
```

### Detailed tree.index.md
```markdown
# Tree Index - Generated 2025-08-15 09:30 UTC

## Configuration
- Max Depth: 3
- Exclude: node_modules, .git, dist
- Sort: Alphabetical

## Structure
\`\`\`
components/TSRanger/v2.5/ (156 KB)
├── src/
│   ├── components/
│   │   ├── io/ (24 KB)
│   │   ├── model/ (31 KB)
│   │   └── view/ (42 KB)
│   └── index.ts (2 KB)
├── test/
│   └── tsranger.test.ts (18 KB)
├── README.md (8 KB)
└── tree.index.md (2 KB)
\`\`\`

## Summary
- Total Files: 23
- Total Directories: 8
- Total Size: 156 KB
- Last Updated: 2025-08-15 09:30 UTC
```

## Troubleshooting

### Common Issues
1. **Permission Errors**: Run with appropriate permissions
2. **Large Directories**: Increase depth limit gradually
3. **Circular Links**: Tool automatically detects and skips
4. **Performance**: Use exclude patterns for large codebases

### Debug Mode
```bash
# Enable verbose logging
tsranger tree index generate . --verbose

# Dry run to see what would be generated
tsranger tree index generate . --dry-run
```

---

This process ensures consistent, automated documentation of project structure, supporting CMM Level 4 principles and improving project maintainability.