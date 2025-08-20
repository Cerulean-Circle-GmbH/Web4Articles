# PDCA: Complete Column-Filter Architecture Implementation

**📎 Previous Commit:** fb9dd87 - success: surgical tab advancement fix documented  
**🔗 Previous PDCA:** [2025-08-20-UTC-1820-surgical-tab-advancement-method-filter-fix.md](../2025-08-20-UTC-1820-surgical-tab-advancement-method-filter-fix.md) | [../2025-08-20-UTC-1820-surgical-tab-advancement-method-filter-fix.md](../2025-08-20-UTC-1820-surgical-tab-advancement-method-filter-fix.md)

## Summary

**Artifact Links:** TSRanger v2.2 Complete 3-Column Filtering Architecture  
**QA Decisions:**  
- [x] **ARCHITECTURAL BREAKTHROUGH:** Complete specification provided by user  
- [x] **SCOPE EXPANSION:** From single tab fix to complete 3-column architecture
- [ ] **SYSTEMATIC IMPLEMENTATION:** Build complete column-aware filtering system
- [ ] **COMPREHENSIVE VALIDATION:** Test full specification compliance

---

## Plan

### Complete Architectural Specification
**QA Feedback Verbatim (2025-08-20T18:25:00.000Z):**
> *"[tab] and [right] always switches colum and filter context [shift,tab] and [lef] always switch it back classe [tab] mehtods [tab] parameter abc classes filter [tab]abc method filter [tab][tab]abc parameter filert [right][right][left]abc method filter [right][left]abc classes filter same as navigation columns prompt follows g[tab][tab][tab] SelectedClass selectedMethod selectedParamert"*

### System Architecture Requirements

**3-Column System:**
1. **Classes** (Column 0) → **Methods** (Column 1) → **Parameters** (Column 2)
2. **Advancement Keys:** `[tab]`, `[right]` - switch column + filter context
3. **Retreat Keys:** `[left]`, `[shift+tab]` - retreat column + filter context
4. **Filter Context Routing:** Typing routes to current column's filter

**Filter Context Examples:**
- `abc` → Classes filter (Column 0)
- `[tab]abc` → Methods filter (Column 1)  
- `[tab][tab]abc` → Parameters filter (Column 2)
- `[right][right][left]abc` → Methods filter (Column 1)
- `[right][left]abc` → Classes filter (Column 0)

**Prompt Display Pattern:**
- `g[tab][tab][tab]` → `SelectedClass selectedMethod selectedParameter`

### Implementation Strategy
1. **Column-Aware Keystroke Routing**: Route typed characters to correct column filter
2. **Advancement/Retreat Synchronization**: Ensure keys behave identically  
3. **Filter Context Management**: Maintain correct filter state per column
4. **Prompt Display Logic**: Show progression through selections

---

## Do

### Implementation Phase 1: Column-Aware Keystroke Routing

Let me first test the current state and then implement the complete architecture:

