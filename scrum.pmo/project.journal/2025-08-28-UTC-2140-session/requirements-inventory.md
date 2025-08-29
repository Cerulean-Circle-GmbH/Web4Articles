# Requirements Inventory - Web4Articles Project

**Created:** 2025-08-28-UTC-2145  
**Purpose:** Comprehensive inventory of all requirements across the project

## Overview Statistics

- **Main Requirements Directory:** 41 requirements in `spec/requirements.md/`
- **Component Requirements:** 6+ components with dedicated requirements
- **Sprint Requirements:** 1 sprint with requirements tracking
- **Total Requirement Directories:** 20+ locations

## Main Project Requirements

### Location: `spec/requirements.md/`
- **Total Count:** 41 requirements
- **Format:** UUID-based `.requirement.md` files
- **Overview:** `00_requirements.overview.md` (auto-generated)
- **Last Updated:** 2025-08-27T22:26:25.466Z
- **Status:** Mixed (mostly unchecked [ ])

### Key Requirements Categories:
1. **Web4 Architecture Requirements** (15+)
   - ONCE Kernel, IOR Support, MDA Sphere
   - Scenario-First Development
   - Empty Constructor Principle

2. **Component Development** (10+)
   - Version Component Development
   - UnitCLI Implementation
   - TSRanger requirements

3. **Process & Standards** (10+)
   - PDCA standardization
   - Dual link standards
   - JSON package configuration

4. **Testing & Quality** (5+)
   - Test clean output
   - Non-interactive script execution
   - Integration testing

## Component-Specific Requirements

### 1. Unit Component
**Locations:** 
- `components/Unit/latest/spec/requirements.md/`
- `components/Unit/0.1.0.0/spec/requirements.md/`
- `components/Unit/0.1.3.0/spec/requirements.md/`

**Requirements:** 6 total
- Git Commit After Every PDCA
- Tootsie Testing Framework
- Radical Semantic Versioning
- Unit Architecture Fix
- Unit Workflow Engine Repositioning

### 2. Web4ChangeRequest Component
**Locations:**
- `components/Web4ChangeRequest/latest/spec/requirements.md/`
- Multiple version directories (0.1.0.0, 0.1.3.0)

**Requirements:** 15 total
- Auto-MD Generation Enhancement
- ES Module __dirname Fix
- Directory Context Detection
- Name Attribute Enhancement

### 3. Web4Requirement Component
**Locations:**
- `components/Web4Requirement/v1.0/spec/requirements.md/`
- Multiple version directories (0.1.0.0 through 0.1.3.0)

**Purpose:** Manages requirement creation and overview generation

### 4. Other Components
- **User Component:** Has requirements in version directories
- **Web4TSComponent:** Contains requirement specifications

## Sprint Requirements

### Sprint 0: `scrum.pmo/sprints/sprint-0/requiremnents.md`
**Note:** Unique spelling "requiremnents" (with 'n')
**Status:** Mix of completed [x] and pending [ ]
**Count:** 20+ requirements with full traceability

**Key Features:**
- UUID-based requirement tracking
- Bidirectional task linking
- Problem → Fix documentation pattern
- Traceability sections in tasks

## Cross-Reference Analysis

### ✅ Working Well:
1. UUID system provides unique identifiers
2. Auto-generated overview files maintain counts
3. Scenario JSON files support Web4 pattern
4. Component requirements properly versioned

### ⚠️ Needs Attention:
1. **Sprint Requirements Isolation**
   - Sprint-0 requirements not in main overview
   - No cross-reference to component requirements

2. **Naming Inconsistency**
   - "requiremnents.md" vs "requirements.md"
   - Could cause discovery issues

3. **Version Sprawl**
   - Multiple versions maintain separate requirements
   - No consolidated view across versions

4. **Missing Central Registry**
   - No single source of truth for all requirements
   - Components operate independently

## Recommendations

### Option A: Central Registry Approach
1. Create master requirements registry in `spec/requirements/`
2. Link all component requirements via UUID references
3. Maintain component autonomy while enabling discovery

### Option B: Enhanced Cross-Referencing
1. Update overview generators to scan all locations
2. Create cross-reference index mapping UUIDs to locations
3. Add "Related Requirements" sections

### Option C: Full Consolidation
1. Migrate all requirements to `spec/requirements.md/`
2. Tag with component/sprint metadata
3. Single location for all requirement management

## Technical Patterns

### Requirement File Structure:
```markdown
**UUID:** {uuid}
**Name:** {name}
**Created:** {timestamp}
**Status:** [ ] Pending | [x] Completed
**Component:** {component-name}
**Version:** {version}
```

### Web4 Scenario Pattern:
- Each requirement has corresponding `.scenario.json`
- Supports hibernation and IOR references
- Enables requirement object management

### Auto-Generation Process:
- Web4Requirement component scans directories
- Generates `00_requirements.overview.md`
- Updates timestamps and counts

## Next Actions

1. **Decision Required:** Select consolidation strategy (A, B, or C)
2. **Fix Naming:** Standardize to "requirements.md" everywhere
3. **Update Cross-References:** Based on selected approach
4. **Document Process:** Update PO process for requirement management

---

**Generated for:** Requirements Management Session  
**By:** Developer Role - Requirements Analysis