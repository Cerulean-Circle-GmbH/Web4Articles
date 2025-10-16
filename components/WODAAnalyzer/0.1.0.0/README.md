[Back to Components](../../)

# WODAAnalyzer v0.1.0.0

**Git Branch Analysis & WODA Document Generator**

A Web4TSComponent for analyzing Git branches and generating consistent WODA (What, Overview, Details, Action) format documentation.

## Architecture

**Web4 5-Layer Architecture:**
- **Layer 5:** CLI (WODAAnalyzerCLI.ts) - Command-line interface
- **Layer 4:** [Reserved for utilities]
- **Layer 3:** Interfaces (WODAAnalyzer.interface.ts, WODAAnalyzerModel.interface.ts, BranchAnalysis.interface.ts)
- **Layer 2:** Implementation (DefaultWODAAnalyzer.ts) - Core logic
- **Layer 1:** [Reserved for low-level utilities]

## Features

- ✅ **Git Branch Discovery:** Automatically finds "loose end" branches not in release/dev or dev/0400
- ✅ **Comprehensive Analysis:** Commits ahead, file counts (PDCA/components/tests), branch age
- ✅ **Priority Categorization:** CRITICAL/HIGH/MEDIUM/LOW based on configurable thresholds
- ✅ **WODA Format:** Consistent What/Overview/Details/Action sections for every branch
- ✅ **GitHub Links:** Direct links to browse each branch
- ✅ **Recommendations:** AI-generated recommendations and questions per branch
- ✅ **Web4 Compliant:** Follows full Web4TSComponent architecture patterns

## Installation

```bash
cd components/WODAAnalyzer/0.1.0.0
npm install
npm run build
```

## Usage

### Command Line

```bash
# Basic usage (current directory)
npm run analyze

# Or via CLI directly
./dist/ts/layer5/WODAAnalyzerCLI.js

# With options
node dist/ts/layer5/WODAAnalyzerCLI.js --root /path/to/project --output my-analysis.md
```

### Programmatic

```typescript
import { DefaultWODAAnalyzer } from '@web4articles/woda-analyzer';
import { Scenario } from './layer3/Scenario.interface.js';

const scenario: Scenario = {
  model: {
    projectRoot: '/var/dev/Workspaces/2cuGitHub/Web4Articles',
    outputPath: 'analysis.md'
  }
};

const analyzer = new DefaultWODAAnalyzer();
analyzer.init(scenario);
await analyzer.process();
```

## Configuration

**Model Properties:**
- `projectRoot` - Git repository root (default: current directory)
- `gitRemote` - Git remote name (default: 'origin')
- `targetBranch` - Base branch for comparison (default: 'origin/release/dev')
- `outputPath` - Output file path (default: 'scrum.pmo/roles/PDCAQualityAgent/pdca/woda-analysis.md')
- `maxBranches` - Maximum branches to analyze (default: 1000)
- `priorityThresholds` - Customizable priority thresholds

## Output Format

```markdown
# 🎯 COMPLETE Loose Ends Analysis - All N Branches (WODA Format)

## Executive Summary
- Total branches analyzed
- Priority distribution
- Component info

## #1. origin/branch-name 🔴

### What
One-line description from commit message

### Overview
- Last Commit
- Age
- Priority
- Size
- Content statistics

### Details
- Branch Analysis (commits, files)
- Why This Matters

### Action
- Recommendation
- Reasoning
- Questions for reviewer
```

## Web4 Compliance

**Follows Web4TSComponent patterns:**
1. ✅ Empty constructor
2. ✅ Scenario-based initialization
3. ✅ Web4 standard methods (init, transform, validate, process)
4. ✅ Model interface extending base Model
5. ✅ Component interface with domain methods
6. ✅ CLI wrapper for command-line execution
7. ✅ TypeScript with strict mode
8. ✅ ES modules
9. ✅ Version from directory name (single source of truth)

## Evolution

**From Script to Component:**
- **Before:** Bash script (generate-woda-simple.sh)
- **After:** Full Web4TSComponent with proper architecture
- **Benefits:** Reusable, testable, maintainable, extendable

## Development

```bash
# Build
npm run build

# Clean
npm run clean

# Test (when tests added)
npm test
```

## Dependencies

- Node.js >= 18.0.0
- TypeScript 5.x
- Git (for branch analysis)

## License

PROPRIETARY - Cerulean Circle GmbH

---

**Component Info:**
- Name: WODAAnalyzer
- Version: 0.1.0.0
- Type: Web4TSComponent
- Created: 2025-10-16
- Purpose: Branch analysis automation with consistent WODA format

