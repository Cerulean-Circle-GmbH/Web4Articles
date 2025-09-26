# Project Journal Session Template

## Session Structure

Each project journal session should follow this structure:

```
scrum.pmo/project.journal/{TIMESTAMP}-{SESSION_TYPE}/
├── project.state.md              # Main project status for this session
├── tree.index.md                 # Repository structure snapshot
└── pdca/                          # All PDCA documentation for this session
    ├── role-transitions/          # Role switching documentation
    │   ├── {TIMESTAMP}-{FROM_ROLE}-to-{TO_ROLE}.md
    │   └── {TIMESTAMP}-{FROM_ROLE}-to-{TO_ROLE}.md
    ├── tasks/                     # Task-specific PDCA entries
    │   ├── {TIMESTAMP}-{ROLE}-{TASK_DESCRIPTION}.md
    │   ├── {TIMESTAMP}-{ROLE}-{TASK_DESCRIPTION}.md
    │   └── {TIMESTAMP}-{ROLE}-{TASK_DESCRIPTION}.md
    └── session/                   # Session management PDCA
        ├── {TIMESTAMP}-session-start.md
        ├── {TIMESTAMP}-session-milestone.md
        └── {TIMESTAMP}-session-completion.md
```

## Session Types

- `recovery` - Recovery sessions starting from README or context
- `sprint` - Sprint planning and execution sessions  
- `release` - Release management and deployment sessions
- `hotfix` - Emergency fixes and critical issues
- `demo` - Demonstration and validation sessions
- `refactor` - Major refactoring and process improvement sessions

## PDCA Categories

### Role Transitions (`pdca/role-transitions/`)
Document when an agent switches from one role to another:
- Current role completion status
- Handoff documentation
- New role initialization
- Context preservation

### Tasks (`pdca/tasks/`)
Document specific work activities:
- Feature implementation
- Bug fixes
- Documentation updates
- Process improvements

### Session Management (`pdca/session/`)
Document session-level activities:
- Session objectives and scope
- Milestones and checkpoints
- Session completion and outcomes
- Lessons learned and improvements

## Naming Convention

### Timestamps
- Use UTC format: `YYYY-MM-DD-UTC-HHMM`
- Example: `2025-08-15-UTC-0930`

### Role Transitions
- Format: `{TIMESTAMP}-{FROM_ROLE}-to-{TO_ROLE}.md`
- Example: `2025-08-15-UTC-0930-scrummaster-to-po.md`

### Tasks
- Format: `{TIMESTAMP}-{ROLE}-{TASK_DESCRIPTION}.md`
- Example: `2025-08-15-UTC-1000-developer-feature-implementation.md`

### Session Files
- Format: `{TIMESTAMP}-session-{TYPE}.md`
- Example: `2025-08-15-UTC-0927-session-start.md`

## Usage Guidelines

1. **Every recovery creates a new session** - Use session type `recovery`
2. **Role switching is documented** - Create role transition PDCA before switching
3. **Tasks are documented** - Each significant task gets its own PDCA
4. **Session lifecycle is tracked** - Start, milestones, and completion are documented
5. **All PDCAs reference the session** - Maintain context and traceability

## Integration with Recovery Process

The enhanced recovery process should:
1. Create new project journal session
2. Generate initial session start PDCA
3. Document any role transitions
4. Create task PDCAs for work performed
5. Update session completion PDCA when done

This structure provides complete traceability and session-based organization of all PDCA documentation.
