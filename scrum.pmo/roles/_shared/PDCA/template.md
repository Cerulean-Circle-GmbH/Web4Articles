# PDCA Template (Background Agents)

Note: Name files `YYYY-MM-DD-UTC-HHMM.md` in each role's `PDCA/` directory.

**Important**: All PDCA entries must include links to artifacts:
- In "Do" section: List all files changed with markdown links and descriptions
- In "Check" section: If analysis-only (no changes), list artifacts analyzed
- Use relative paths from the PDCA file location (e.g., `../../../sprints/...`)

## Plan
- **Objective:** 
  - 
- **Scope:** 
  - 
- **Targets (metrics):** 
  - 
- **Inputs (files/dirs):** 
  - 
- **Acceptance Criteria:**
  - 
- **Assumptions:**
  - 
- **Constraints:**
  - 
- **Options Considered (with pros/cons):**
  - 
- **Rationale for Selected Option:**
  - 
- **Risks and Mitigations:**
  - 

## Do
- Actions executed:
- Artifacts changed (with links and descriptions):
  - [Path/to/file.md](relative/path/to/file.md) - Brief description of changes
  - [Another/file.ts](relative/path/to/file.ts) - What was modified
- Commands run (examples):
```bash
# Show current role tree and PDCA directory
TREE_WIDTH=2 tree -a -I 'node_modules|.git' scrum.pmo/roles/OntologyAgent | sed -n '1,40p'

# Grep for ontology files to update counts
rg -n "^\|-\s*(Nouns|Verbs|Ambiguities):" Documentation/Ontology.md/ontology.status.md || true

# Verify new files staged
git status --porcelain=v1
```

## Check
- Verifications performed:
- QA Feedback (quote literally):
> [paste the exact QA/user prompt here]
- Artifacts analyzed (if no changes made):
  - [Path/to/analyzed/file.md](relative/path) - What was examined
- Evidence (snippets/commands):
```bash
# Count table rows (excluding header/separators)
awk 'BEGIN{FS="|"} /^\|/{c++} END{print c-2}' Documentation/Ontology.md/nouns.index.md

# Validate links (basic)
rg -n "\]\(\./|\]\(\.\./" Documentation/Ontology.md | sed -n '1,40p'
```

## Act
- Improvements for next cycle:
- Automation to add:
- Follow-ups:
- After completing this PDCA entry, execute: commit and push to current branch.

## Metadata
- Agent:
- Branch:
- Commit:
- Date: