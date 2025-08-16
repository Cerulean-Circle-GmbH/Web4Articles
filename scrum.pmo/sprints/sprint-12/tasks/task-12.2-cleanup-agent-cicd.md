[Back to Sprint 12 Planning](../planning.md)

# Task 12.2: Plan Automated Cleanup Agent for CI/CD

## Status: Planning

## Problem Statement
Your wisdom:
> "focus is highest prio. cleanup has to always happen at eod. maybe cicd could start a cleanup agent regularly…"

Development sessions naturally create temporary files and structural drift when focus is on solving problems. Manual cleanup is often forgotten.

## Solution
Create an automated cleanup agent that runs at EOD (End of Day) to ensure project structure compliance.

## Requirements

### 1. Cleanup Agent Features
- **Structure Validation**: Check sprint folders for misplaced files
- **PDCA Migration**: Move PDCAs from sprint folders to journal sessions
- **Article Organization**: Ensure articles are in `/workspace/articles/`
- **Dead Link Detection**: Find and report broken references
- **Naming Convention**: Enforce file naming standards

### 2. CI/CD Integration
```yaml
# .github/workflows/cleanup-eod.yml
name: EOD Cleanup Agent
on:
  schedule:
    - cron: '0 22 * * *'  # 10 PM UTC daily
  workflow_dispatch:       # Manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Cleanup Agent
        run: |
          node --loader ts-node/esm tools/cleanup-agent.ts
      - name: Create PR if changes
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: EOD structural cleanup"
          body: "Automated cleanup of project structure"
          branch: cleanup/eod-${{ github.run_id }}
```

### 3. Agent Implementation
```typescript
// tools/cleanup-agent.ts
interface CleanupReport {
  movedFiles: string[];
  fixedLinks: string[];
  violations: string[];
}

class StructureCleanupAgent {
  async validateSprintFolders(): Promise<Violation[]>
  async migratePDCAs(): Promise<MovedFile[]>
  async organizeArticles(): Promise<MovedFile[]>
  async fixBrokenLinks(): Promise<FixedLink[]>
  async generateReport(): Promise<CleanupReport>
}
```

### 4. Configuration
```json
// .cleanup-config.json
{
  "rules": {
    "sprintFolder": ["planning.md", "requirements.md", "tasks/"],
    "pdcaLocation": "project.journal/{session}/pdca/role/{role}/",
    "articleLocation": "articles/{platform}/{series}/"
  },
  "exceptions": [
    "sprint-0/**",  // Foundation sprint may have different structure
    "*.tmp.md"      // Temporary files during active development
  ]
}
```

## Benefits
1. **Maintains Focus**: Developers concentrate on solving problems
2. **Automatic Compliance**: Structure fixed daily without manual intervention
3. **Git History**: All moves use `git mv` to preserve history
4. **Review Process**: Changes submitted as PR for review
5. **Learning Tool**: Report shows common structural mistakes

## Implementation Plan
1. Create TypeScript cleanup agent
2. Add GitHub Action workflow
3. Test on sample violations
4. Deploy to CI/CD
5. Monitor and refine rules

## Success Criteria
- [ ] Agent detects all structure violations
- [ ] Automated fixes preserve git history
- [ ] Daily cleanup PRs created
- [ ] No manual cleanup needed
- [ ] Focus time protected

"focus is highest prio. cleanup has to always happen at eod"