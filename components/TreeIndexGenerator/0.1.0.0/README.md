<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Components](../../)

# TreeIndexGenerator v1.0

Automated tree index generator for creating `tree.index.md` files that document directory structures.

## Features

- Generates markdown-formatted directory trees
- Configurable depth and filtering
- File size and date information
- Respects .gitignore patterns
- Handles symbolic links safely
- Cross-platform compatible

## Usage

### Command Line
```bash
# Generate tree.index.md in current directory
ts-node src/TreeIndexGenerator.ts

# Generate for specific directory
ts-node src/TreeIndexGenerator.ts ./components
```

### Programmatic
```typescript
import { TreeIndexGenerator } from './TreeIndexGenerator.js';

const generator = new TreeIndexGenerator({
  maxDepth: 5,
  showSizes: true,
  excludePatterns: ['*.test.ts', '*.spec.ts']
});

// Generate and write to file
await generator.generateToFile('./src');

// Or get as string
const markdown = await generator.generate('./src');
```

## Configuration

See [Tree Index Specification](../../../docs/tree-index-specification.md) for full configuration options.

## Architecture

- **TreeIndexGenerator**: Main orchestrator
- **DirectoryTraverser**: File system traversal with filtering
- **TreeFormatter**: Converts nodes to tree format
- **MarkdownRenderer**: Generates final markdown output
- **Logger**: Simple logging with debug support

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```