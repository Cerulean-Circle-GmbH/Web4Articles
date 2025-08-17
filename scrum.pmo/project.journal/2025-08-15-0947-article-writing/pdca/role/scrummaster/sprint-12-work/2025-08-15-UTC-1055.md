[Back to Sprint 12](./planning.md)

# PDCA 12 - Sprint Structure Discovery

## Plan
- **Your Observation**:
  > "the sprint 12 file structure totally went astray. read the recover process again and plan a restructuring task"
- **Goal**: Understand proper sprint and PDCA structure
- **Method**: Compare recovery process with current Sprint 12

## Do
### Current Sprint 12 Structure (Incorrect)
```
sprint-12/
├── planning.md
├── planning.input.md
├── planning-article-series.md
├── article-v1-chaos-to-order.md
├── article-v2-tsranger-journey.md
├── article-v3-consciousness-journey.md
├── article-v4-developer-struggles.md
├── pdca-research-journey.md
├── pdca-research-journey-2.md
├── pdca-journey-tasks.md
├── pdca-article-versions.md
├── pdca-qa-consciousness-research.md
├── pdca-web4x-tla-research.md
├── pdca-you-revealed.md
├── pdca-article-v3.md
├── pdca-original-quotes-research.md
├── pdca-distillation-wisdom.md
├── pdca-article-progression.md
└── pdca-structure-discovery.md (this file)
```

### Proper Structure (Per Recovery Process)
```
sprint-12/
├── planning.md              # Sprint planning only
├── requirements.md          # Optional requirements
└── tasks/                   # Actual tasks (if needed)
    ├── task-12.1-xxx.md
    └── task-12.2-xxx.md

project.journal/YYYY-MM-DD-HHMM-session-name/
├── project.state.md         # Session state
├── tree.index.md           # Session tree
└── pdca/
    ├── role/               # Role-based PDCAs
    │   ├── scrummaster/
    │   │   └── YYYY-MM-DD-UTC-HHMM.md
    │   ├── developer/
    │   │   └── YYYY-MM-DD-UTC-HHMM.md
    │   └── po/
    │       └── YYYY-MM-DD-UTC-HHMM.md
    ├── tasks/              # Task-specific PDCAs
    └── session/            # Session-level PDCAs
```

### What Went Wrong

1. **PDCAs in Sprint Folder**: All PDCAs should be in `project.journal/` sessions
2. **Articles in Sprint Folder**: Articles should be in `/workspace/articles/medium.com/`
3. **Multiple Planning Files**: Should have one `planning.md`
4. **No Session Structure**: Working without proper journal session

## Check
### Validation Against Recovery Process

From recovery-process.md:
- ✅ "Create new journal session with PDCA structure"
- ✅ "mkdir -p $JOURNAL_DIR/pdca/role"
- ✅ "Role-based PDCAs: pdca/role/"
- ❌ Sprint 12 has PDCAs directly in sprint folder
- ❌ No session structure created

### Impact
- PDCAs scattered and hard to trace
- No role-based organization
- Missing session context
- Not following CMMI Level 4 structure

## Act
### Restructuring Plan

1. **Create Proper Session** (if not in one)
   ```bash
   project.journal/2025-08-15-1200-sprint-12-articles/
   ```

2. **Move PDCAs to Session**
   - All `pdca-*.md` files → `pdca/role/scrummaster/`
   - Rename with UTC timestamps

3. **Move Articles**
   - All `article-v*.md` → `/workspace/articles/medium.com/`
   - Keep planning references

4. **Clean Sprint Folder**
   - Keep only: `planning.md`, `requirements.md`
   - Add `tasks/` if needed

5. **Update Links**
   - Fix all internal references
   - Update planning.md

### Next Steps
1. Get QA approval on this plan
2. Execute restructuring
3. Document in proper PDCA format
4. Update sprint planning

"make it a task and after qa rev you fix it…"