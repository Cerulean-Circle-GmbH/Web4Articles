<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# WODAAnalyzer Tutorial - Step by Step

## Quick Start

```bash
# Navigate to project root
cd /var/dev/Workspaces/2cuGitHub/Web4Articles

# Run the analyzer
node components/WODAAnalyzer/0.1.0.0/dist/ts/layer5/WODAAnalyzerCLI.js

# With custom output
node components/WODAAnalyzer/0.1.0.0/dist/ts/layer5/WODAAnalyzerCLI.js \
  --output my-analysis.md
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `--help` or `-h` | Show help |
| `--version` or `-v` | Show version |
| `--root <path>` or `-r` | Set project root |
| `--output <path>` or `-o` | Set output file |

## Component Structure

```
WODAAnalyzer/0.1.0.0/
├── src/ts/
│   ├── layer3/          # Interfaces (what it does)
│   ├── layer2/          # Implementation (how it does it)
│   └── layer5/          # CLI (user interface)
├── dist/ts/             # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development Workflow

1. **Edit Source**: `src/ts/layer2/DefaultWODAAnalyzer.ts`
2. **Build**: `npm run build`
3. **Test**: `node dist/ts/layer5/WODAAnalyzerCLI.js --help`
4. **Clean**: `npm run clean` (if needed)

## What It Does

✅ Finds all loose end branches (not in release/dev or dev/0400)  
✅ Analyzes each branch (commits, files, age)  
✅ Generates WODA format (What, Overview, Details, Action)  
✅ Creates complete markdown document with:
- Executive summary
- Priority categorization (CRITICAL/HIGH/MEDIUM/LOW)
- GitHub links
- Recommendations and questions

## Output Verification

```bash
# Count branches
grep -c '^## \*\*#[0-9]' output.md

# Count WODA sections  
grep -c '### \*\*What\*\*' output.md
grep -c '### \*\*Overview\*\*' output.md
grep -c '### \*\*Details\*\*' output.md
grep -c '### \*\*Action\*\*' output.md

# Check file size
wc -l output.md
```

## Web4 Architecture Principles

- **Empty Constructor**: Initialization via `init(scenario)`
- **Version from Directory**: Single source of truth (0.1.0.0)
- **Standard Methods**: `init()`, `transform()`, `validate()`, `process()`
- **Interface = API**: TypeScript interfaces document the contract

## Example Usage (Programmatic)

```typescript
import { DefaultWODAAnalyzer } from '@web4articles/woda-analyzer';

const analyzer = new DefaultWODAAnalyzer();
analyzer.init({
  model: {
    projectRoot: '/path/to/project',
    outputPath: 'analysis.md'
  }
});
await analyzer.process();
```

---

**Generated**: 2025-10-16  
**Component**: WODAAnalyzer v0.1.0.0  
**Architecture**: Web4TSComponent
