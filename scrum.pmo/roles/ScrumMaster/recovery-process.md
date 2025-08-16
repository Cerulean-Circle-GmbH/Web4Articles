[Back to ScrumMaster Role](../)

# Recovery from README Process

## Overview
This document defines the canonical recovery process for AI agents when context is lost or when explicitly asked to "recover". The process ensures consistency, completeness, and proper branch management.

## Project Status Reporting Requirements (Canonical)
- This document is the canonical source for the structure and content of project status/journal entries.
- Follow "Phase 3: Journal Entry Creation" and "Phase 4: Project Status Report" below for the required sections, including the GitHub Quick Links and verification checklist.

## Critical Requirements

### 1. Always Start from release/dev
- **MANDATORY**: Recovery MUST begin by checking out the `release/dev` branch
- This ensures all latest changes and integrations are present
- Never start recovery from `main` or any other branch

### 1.1. CRITICAL SAFETY PROTOCOL: Multi-Agent Coordination
- **⚠️ DANGER**: NEVER perform branch switches while other agents are active
- **MANDATORY**: Confirm ALL other agents are stopped before any branch operations
- **SAFETY RULE**: All development work MUST happen in `release/dev` branch
- **ESCALATION**: If branch switch is required during active development, coordinate with QA user first
- **DOCUMENTATION**: Any branch operations during multi-agent sessions must be documented as safety incidents

### 2. Create Background Agent Branch
- After checking out `release/dev`, create a new background agent branch:
  - Pattern: `cursor/recovery-YYYY-MM-DD-HHMM`
  - Example: `cursor/recovery-2025-08-11-1745`

### 3. Complete Recovery Before Implementation
- Recovery ends with a project status report
- NO implementation or testing during recovery
- Only after recovery is complete should any new work begin

## Recovery Process Steps

### Phase 0: Role Selection (New)
```bash
# Optional: Specify target role for recovery
# If not specified, defaults to ScrumMaster
# Valid roles: ScrumMaster, Developer, PO, Architect, Tester, DevOps, OntologyAgent, etc.
TARGET_ROLE="${1:-ScrumMaster}"
echo "Recovery will proceed as: $TARGET_ROLE"
```

### Phase 1: Environment Setup
```bash
# 1. Ensure on release/dev
git fetch origin
git checkout release/dev
git pull origin release/dev

# 2. Create recovery branch
TIMESTAMP=$(date -u +"%Y-%m-%d-%H%M")
BRANCH_NAME="cursor/recovery-${TIMESTAMP}"
git checkout -b "$BRANCH_NAME"

# 3. Verify environment
docker version
node --version
npm --version

# 4. Generate repository tree (not following symbolic links)
tree -I 'node_modules|.git' -a --charset ascii --noreport > repo.tree.txt
```

### Phase 2: Context Recovery
1. **Read Core Documents**
   - `/workspace/README.md` - Project overview and principles
   - `/workspace/wiki/Ontology.md` - Key terminology
   - `/workspace/scrum.pmo/project.journal/*/project.state.md` - Latest state
   - **Role-Specific**: `/workspace/scrum.pmo/roles/${TARGET_ROLE}/process.md` - Target role process

2. **Check Role Processes**
   - Review all `/workspace/scrum.pmo/roles/*/process.md`
   - Note role-specific recovery steps
   - Identify active roles and responsibilities
   - **Load Target Role Context**: Read specific responsibilities and current tasks for `$TARGET_ROLE`

3. **Sprint & Task Status**
   - Review `/workspace/scrum.pmo/sprints/*`
   - Identify current sprint and active tasks
   - Check task completion status
   - **Role-Specific Tasks**: Filter tasks assigned to `$TARGET_ROLE`

### Phase 3: Session-Based Journal Entry Creation
```bash
# Create new journal session with PDCA structure
SESSION_TYPE="${SESSION_TYPE:-recovery}"
JOURNAL_DIR="/workspace/scrum.pmo/project.journal/${TIMESTAMP}-${SESSION_TYPE}"
mkdir -p "$JOURNAL_DIR/pdca/role"

# Create project.state.md from canonical template
TEMPLATE="/workspace/scrum.pmo/templates/project.state.template.md"
{
  echo "[Back to Project Journal](../) | [Journal Overview](../../project.journal.overview.md)"
  echo ""
  sed "s/{{TIMESTAMP}}/${TIMESTAMP} UTC/g" "$TEMPLATE"
} > "$JOURNAL_DIR/project.state.md"

# Update project state with role-specific information and session context
sed -i "s/ScrumMaster (autonomous)/${TARGET_ROLE} (recovery session)/g" "$JOURNAL_DIR/project.state.md"
sed -i "s/Status:** Active/Status:** Recovery in Progress - Session: ${SESSION_TYPE}/g" "$JOURNAL_DIR/project.state.md"

# Create role-based PDCA entry with optional sprint organization
UTC_TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
SPRINT_CONTEXT="${SPRINT_CONTEXT:-general}"
ROLE_PDCA_DIR="$JOURNAL_DIR/pdca/role/${TARGET_ROLE,,}/${SPRINT_CONTEXT}"
mkdir -p "$ROLE_PDCA_DIR"
cat > "$ROLE_PDCA_DIR/${UTC_TIMESTAMP}.md" << EOF
[Back to Session](../../../../project.state.md) | [Journal Overview](../../../../../../project.journal.overview.md)

# 📋 **PDCA Cycle: Recovery Session Start - ${UTC_TIMESTAMP}**

**🗓️ Date:** ${UTC_TIMESTAMP}  
**🎯 Objective:** Recover as ${TARGET_ROLE} from README context  
**👤 Role:** ${TARGET_ROLE}  
**🚨 Issues:** Context restoration and role initialization

---

## **📊 Summary**

Recovery process initiated for ${TARGET_ROLE} role from README context. Session structure created with simplified PDCA organization and role-specific context loading.

### **🔗 Artifact Links**

- **Session State**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/${JOURNAL_DIR##*/}/project.state.md) | [project.state.md](../../../project.state.md)
- **Journal Overview**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal.overview.md) | [project.journal.overview.md](../../../../../project.journal.overview.md)

---

## **📝 Plan**

### **Recovery Objectives**
1. **Context Restoration**: Load ${TARGET_ROLE} role context from README and project documentation
2. **Session Structure**: Create organized PDCA structure with role-based organization
3. **Process Integration**: Ensure recovery aligns with current project workflows

### **Recovery Scope**
- Complete recovery and role initialization
- Session documentation with proper backlinks
- Role-specific task identification and prioritization

---

## **🔧 Do**

### **Recovery Actions Completed**
- Recovery initiated from README context
- Session structure created: ${JOURNAL_DIR}
- Role context loading in progress
- PDCA directory structure established

---

## **✅ Check**

### **Recovery Validation**
✅ **Session Created**: ${JOURNAL_DIR} established ✅  
✅ **PDCA Structure**: Role-based organization implemented ✅  
✅ **Context Loading**: ${TARGET_ROLE} role context initiated ✅  

---

## **🚀 Act**

### **Next Steps**
1. **Role Initialization**: Complete ${TARGET_ROLE} context loading
2. **Task Identification**: Review current project priorities
3. **Process Continuation**: Proceed with role-specific activities

---

## **📋 PDCA Process Update**

### **${TARGET_ROLE} Learning**
✅ **Recovery Process**: Enhanced PDCA format implemented ✅  
✅ **Session Organization**: Role-based structure established ✅  

---

**📊 Summary:** Recovery session started for ${TARGET_ROLE} with enhanced PDCA format and proper session organization! 📋✅

[Back to Session](../../../project.state.md) | [Journal Overview](../../../../../project.journal.overview.md)
EOF

# Create role transition PDCA if applicable
if [ ! -z "$PREVIOUS_ROLE" ] && [ "$PREVIOUS_ROLE" != "$TARGET_ROLE" ]; then
  PREV_ROLE_DIR="$JOURNAL_DIR/pdca/role/${PREVIOUS_ROLE,,}"
  mkdir -p "$PREV_ROLE_DIR"
  cat > "$PREV_ROLE_DIR/${UTC_TIMESTAMP}.md" << EOF
[Back to Session](../../../project.state.md) | [Journal Overview](../../../../../project.journal.overview.md)

# 📋 **PDCA Cycle: Role Transition - ${PREVIOUS_ROLE} to ${TARGET_ROLE} - ${UTC_TIMESTAMP}**

**🗓️ Date:** ${UTC_TIMESTAMP}  
**🎯 Objective:** Transition from ${PREVIOUS_ROLE} to ${TARGET_ROLE}  
**👤 Role:** ${PREVIOUS_ROLE} → ${TARGET_ROLE}  
**🚨 Issues:** Role handoff and context transfer

---

## **📊 Summary**

Role transition process from ${PREVIOUS_ROLE} to ${TARGET_ROLE} with complete context handoff and new role initialization.

### **🔗 Artifact Links**

- **Session State**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/${JOURNAL_DIR##*/}/project.state.md) | [project.state.md](../../../project.state.md)
- **${PREVIOUS_ROLE} Process**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/roles/${PREVIOUS_ROLE}/process.md) | [../../../../../roles/${PREVIOUS_ROLE}/process.md](../../../../../roles/${PREVIOUS_ROLE}/process.md)
- **${TARGET_ROLE} Process**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/roles/${TARGET_ROLE}/process.md) | [../../../../../roles/${TARGET_ROLE}/process.md](../../../../../roles/${TARGET_ROLE}/process.md)

---

## **📝 Plan**

### **Transition Objectives**
1. **Context Preservation**: Document ${PREVIOUS_ROLE} completion status
2. **Handoff Process**: Transfer relevant context to ${TARGET_ROLE}
3. **Role Initialization**: Begin ${TARGET_ROLE} activities

### **Handoff Requirements**
- Complete previous role context documentation
- Initialize new role context
- Update session structure for new role

---

## **🔧 Do**

### **Transition Actions Completed**
- Previous role context preserved and documented
- New role context loading initiated
- Session structure updated for new role
- PDCA organization maintained

---

## **✅ Check**

### **Transition Validation**
✅ **${PREVIOUS_ROLE} Context**: Properly documented and preserved ✅  
✅ **${TARGET_ROLE} Context**: Successfully initiated ✅  
✅ **Session Continuity**: Maintained throughout transition ✅  

---

## **🚀 Act**

### **New Role Status**
1. **${TARGET_ROLE} Operational**: Context loaded and ready
2. **Previous Context**: Preserved for future reference
3. **Process Continuity**: Seamless transition achieved

---

## **📋 PDCA Process Update**

### **Role Transition Learning**
✅ **Handoff Process**: Smooth transition protocol established ✅  
✅ **Context Preservation**: Previous role documentation maintained ✅  
✅ **New Role Integration**: ${TARGET_ROLE} context successfully loaded ✅  

---

**📊 Summary:** Role transition from ${PREVIOUS_ROLE} to ${TARGET_ROLE} completed successfully with full context preservation! 📋✅

[Back to Session](../../../project.state.md) | [Journal Overview](../../../../../project.journal.overview.md)
EOF
fi

# Create tree.index.md next to project state
tree -I 'node_modules|.git' -a --charset ascii --noreport > "$JOURNAL_DIR/tree.index.md"
# Add markdown formatting to tree output
{
  echo "[Back to Project State](./project.state.md)"
  echo ""
  echo "# Repository Tree Index — ${TIMESTAMP} UTC"
  echo ""
  echo "\`\`\`"
  cat "$JOURNAL_DIR/tree.index.md"
  echo "\`\`\`"
  echo ""
  echo "*Generated automatically. Not following symbolic links.*"
  echo ""
  echo "## PDCA Structure"
  echo "- **Role-based PDCAs:** [pdca/role/](./pdca/role/)"
} > "$JOURNAL_DIR/tree.index.tmp" && mv "$JOURNAL_DIR/tree.index.tmp" "$JOURNAL_DIR/tree.index.md"

# Create workspace mount point documentation in session
if [ -L "/workspace/workspacesMountPoint" ]; then
  echo "Creating workspace mount point documentation..."
  
  # Generate workspace tree structure
  tree /workspace/workspacesMountPoint -I 'node_modules|.git' -a --charset ascii --noreport > "$JOURNAL_DIR/workspaces.tree.txt"
  
  # Create workspacesMountPoint-tree.index.md
  {
    echo "[Back to Session](./project.state.md)"
    echo ""
    echo "# Workspace Mount Point Tree Index — ${TIMESTAMP} UTC"
    echo ""
    echo "\`\`\`"
    cat "$JOURNAL_DIR/workspaces.tree.txt"
    echo "\`\`\`"
    echo ""
    echo "*Generated automatically from workspacesMountPoint/. Git repositories identified and marked.*"
    echo ""
    echo "## Repository Statistics"
    echo "- **Total Git Repositories**: $(find /workspace/workspacesMountPoint -name ".git" -type d | wc -l | tr -d ' ')"
    echo "- **Primary Development Hub**: 2cuGitHub/"
    echo "- **Active Project**: Web4Articles (current session)"
  } > "$JOURNAL_DIR/workspacesMountPoint-tree.index.md"
  
  # Create comprehensive workspacesMountPoint.md
  {
    echo "[Back to Session](./project.state.md)"
    echo ""
    echo "# Workspace Mount Point — Accessible Git Repositories"
    echo ""
    echo "This document provides an overview of all git repositories accessible through the workspace mount point for this recovery session."
    echo ""
    echo "## Recovery Session Context"
    echo "- **Session**: ${JOURNAL_DIR}"
    echo "- **Role**: ${TARGET_ROLE}"
    echo "- **Timestamp**: ${TIMESTAMP} UTC"
    echo ""
    echo "## Accessible Repository Summary"
    find /workspace/workspacesMountPoint -name ".git" -type d | while read -r repo_git; do
      repo_dir=$(dirname "$repo_git")
      repo_name=$(basename "$repo_dir")
      repo_path=$(echo "$repo_dir" | sed 's|/workspace/workspacesMountPoint/||')
      echo "- **$repo_name** - [$repo_path]($repo_dir)"
    done
    echo ""
    echo "## Background Agent Advantages"
    echo "- Access to broader development ecosystem beyond current project"
    echo "- Cross-repository integration and template reuse capabilities"
    echo "- Historical perspective and learning from related projects"
    echo "- Comprehensive documentation and best practices"
    echo ""
    echo "[Back to Session](./project.state.md)"
  } > "$JOURNAL_DIR/workspacesMountPoint.md"
  
  rm -f "$JOURNAL_DIR/workspaces.tree.txt"
  echo "✅ Workspace mount point documentation created"
else
  echo "ℹ️  No workspace mount point available in this environment"
fi

# Create branch-overview.md from template and populate unresolved PRs to release/dev
BRANCH_TEMPLATE="/workspace/scrum.pmo/templates/branch-overview.template.md"
cp "$BRANCH_TEMPLATE" "$JOURNAL_DIR/branch-overview.md"

# Fill timestamp
sed -i "s/{{TIMESTAMP}}/${TIMESTAMP}/g" "$JOURNAL_DIR/branch-overview.md"

# Build unresolved PRs section (requires gh api or curl+jq on CI; locally optional)
if command -v gh >/dev/null 2>&1; then
  PRS=$(gh pr list --base release/dev --state open --json number,title,headRefName,url,author --jq '.[] | "- [ ] [#\(.number) \(.title)](\(.url)) from `\(.headRefName)` by @\(.author.login)"' || true)
elif command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1 && [ -n "$GITHUB_TOKEN" ]; then
  REPO="https://api.github.com/repos/${GITHUB_REPOSITORY:-Cerulean-Circle-GmbH/Web4Articles}"
  PRS=$(curl -s -H "Accept: application/vnd.github+json" -H "Authorization: Bearer $GITHUB_TOKEN" "$REPO/pulls?state=open&base=release/dev&per_page=100" | jq -r '.[] | "- [ ] [#\(.number) \(.title)](\(.html_url)) from `\(.head.ref)` by @\(.user.login)"' || true)
else
  PRS="- [ ] Unable to fetch PRs (install gh CLI or set GITHUB_TOKEN for curl+jq)"
fi

if [ -z "$PRS" ]; then
  PRS='- [x] No open PRs targeting release/dev'
fi

# Escape newlines for in-place sed
PRS_ESCAPED=$(echo "$PRS" | sed ':a;N;$!ba;s/\n/\\n/g')
sed -i "s/{{UNRESOLVED_RELEASE_DEV_PRS}}/${PRS_ESCAPED}/g" "$JOURNAL_DIR/branch-overview.md"

# Populate merged-into-release/dev list (informational)
MERGED_DEV_LIST=$(git branch -r --merged origin/release/dev | grep -v HEAD | grep -v 'release/dev' | sed 's#origin/##;s#^#- [x] #')
MERGED_DEV_LIST_ESCAPED=$(echo "$MERGED_DEV_LIST" | sed ':a;N;$!ba;s/\n/\\n/g')
sed -i "s/{{MERGED_DEV_BRANCHES_LIST}}/${MERGED_DEV_LIST_ESCAPED}/g" "$JOURNAL_DIR/branch-overview.md"

# Analyze markdown files for symbolic links and create tree.index.md in linked directories
find /workspace -name "*.md" -type f -exec grep -l '\[.*\](.*/' {} \; | while read -r md_file; do
  # Extract directory links from markdown files
  grep -oE '\[.*\]\([^)]*\/[^)]*\)' "$md_file" | grep -oE '\([^)]+\)' | tr -d '()' | while read -r link_path; do
    if [[ "$link_path" =~ ^/ ]]; then
      # Absolute path
      target_dir="$link_path"
    else
      # Relative path - resolve from md_file location
      target_dir="$(dirname "$md_file")/$link_path"
      target_dir="$(realpath "$target_dir" 2>/dev/null || echo "$target_dir")"
    fi
    
    # Check if target is a directory and exists
    if [[ -d "$target_dir" ]]; then
      tree_index_file="$target_dir/tree.index.md"
      
      # Create tree.index.md if it doesn't exist or is older than 1 day
      if [[ ! -f "$tree_index_file" ]] || [[ $(find "$tree_index_file" -mtime +1 2>/dev/null) ]]; then
        echo "Creating/updating tree.index.md in: $target_dir"
        {
          echo "[Back to Parent](../)"
          echo ""
          echo "# Directory Tree Index — $(date -u +"%Y-%m-%d-%H%M") UTC"
          echo ""
          echo "\`\`\`"
          tree "$target_dir" -I 'node_modules|.git' -a --charset ascii --noreport
          echo "\`\`\`"
          echo ""
          echo "*Generated automatically. Not following symbolic links.*"
        } > "$tree_index_file"
      fi
    fi
  done
done

# Update project index (index.md) with enhanced links
/workspace/scripts/update-project-index.sh "$JOURNAL_DIR"

# Update project journal overview with new session
echo "Updating project journal overview..."
/workspace/scripts/update-journal-overview.sh
echo "✅ Journal overview updated"

# Commit journal entry and generated files
git add "$JOURNAL_DIR/"
git add "$JOURNAL_DIR/../project.journal.overview.md"  # Add updated overview
git add -A  # Add any generated tree.index.md files
git commit -m "docs: Create recovery journal entry ${TIMESTAMP} with tree indexes and role ${TARGET_ROLE}

- Session type: ${SESSION_TYPE}
- Updated journal overview with current session
- Complete PDCA documentation structure"
git push origin "$BRANCH_NAME"
```

### Phase 4: Project Status Report
Before ANY implementation work, create and deliver the status report using the canonical journal template and example:

- Canonical template: [`scrum.pmo/templates/project.state.template.md`](../templates/project.state.template.md)
- Recent example: [`scrum.pmo/project.journal/2025-08-12-0900/project.state.md`](../project.journal/2025-08-12-0900/project.state.md)

**Journal Overview Update (Automatic):**
- The recovery process now automatically updates [`project.journal.overview.md`](../project.journal.overview.md)
- This maintains a chronological index of all sessions with their roles, status, and PDCA counts
- The overview serves as a central navigation hub for all project journal entries

**Role-Specific Status Report:**
- The status report will be customized for the specified `$TARGET_ROLE`
- Project status section will show: **Role**: `${TARGET_ROLE} (autonomous)` instead of ScrumMaster
- Role-specific responsibilities and next steps will be highlighted
- Links to role-specific process documentation will be included

Ensure the journal includes GitHub Quick Links and navigation-friendly markdown links throughout. In the Sprints Overview section, include relative links to each sprint's planning.md file for complete navigation (e.g., [sprint-0 planning](../../sprints/sprint-0/planning.md)).

## Post-Recovery Actions

Only AFTER the status report is delivered:
1. Implementation work can begin
2. Create feature branches as needed
3. Follow normal development workflow

## Common Issues

### Missing release/dev
If `release/dev` doesn't exist locally:
```bash
git fetch origin release/dev:release/dev
git checkout release/dev
```

### Uncommitted Changes
Before switching branches:
```bash
git stash push -m "Pre-recovery work"
# After recovery:
git stash list  # Note stash reference
```

### Environment Issues
Document in journal but continue recovery:
- Missing tools
- Version mismatches
- Configuration problems

## Verification Checklist

- [ ] Started from release/dev branch
- [ ] Created background agent branch
- [ ] Read all core documents
- [ ] Created journal entry with GitHub repo/branch/PR links
- [ ] Pushed recovery branch
- [ ] Delivered status report
- [ ] NO implementation during recovery
- [ ] NO testing during recovery

## References
- README.md recovery section
- CMMI Level 4 requirements
- Project journal standards