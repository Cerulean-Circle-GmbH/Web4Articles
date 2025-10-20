# Known Bugs - 2025-10-14 Session

## 🟢 Resolved Bugs

### Bug 1: `web4tscomponent completion method <TAB>` Falls Back to File Listing

**Status:** ✅ RESOLVED (2025-10-20)  
**Fix Commit:** 8ff37ef7  
**Severity:** High - Fundamental functionality broken  
**Discovered:** 2025-10-19  
**Session:** 2025-10-14-UTC-0948  
**Last Working Commit:** `58a9b0a1` (2025-10-17-UTC-2015 - setCICDVersion implementation)  
**First Broken Commit:** `c4fbcfbe` (2025-10-18 - Add filter support)

**📋 Detailed Analysis:** [known.bug1.analysis.md](./known.bug1.analysis.md)

**Description:**
When user typed `web4tscomponent completion method <TAB>` or `web4tscomponent completion parameter <TAB>`, the tab completion was falling back to directory/file listing instead of showing the expected method/parameter list.

**Root Cause:**
The bug was NOT about trailing empty arguments. The root cause was **architectural principle violation**: moving completion intelligence into bash script violated the core Web4 principle "All logic in TypeScript". This created:
- 100+ lines of conditional bash logic
- Multiple code paths and edge cases
- Interdependencies that broke existing functionality
- CMM1/CMM2 descent (lost reproducibility, predictability, simplicity)

**The Fix:**
**RADICAL SIMPLIFICATION** - Reverted bash script to simple 58a9b0a1 architecture:
1. Removed hierarchical display block (lines 143-308)
2. Removed all complex conditional logic
3. Restored simple callback pattern: `TSCompletion → callback hint → execute callback → display`
4. Kept bash as DUMB display layer (as intended)
5. Kept TypeScript as SMART completion engine (all logic)

**Test Coverage:**
Created comprehensive regression test suite (12 tests in 6 categories):
- Test 1: `web4tscomponent <TAB>` → ✅ Full method list
- Test 2: `web4tscomponent co<TAB>` → ✅ Filtered list
- Test 3: `completion method <TAB>` → ✅ FIXED (was broken)
- Test 4: `completion parameter <TAB>` → ✅ FIXED (was broken)
- Test 5: `on Unit <TAB>` → ✅ Context-aware completion
- Test 6: `test <TAB>` → ✅ Evidence callbacks always worked

**Verification:**
```bash
cd components/Web4TSComponent/0.3.13.2
npx vitest run test/web4tscomponent.bug1-regression.test.ts
# All tests pass
```

**Architectural Lesson:**
**"Never 2 1. Always 4 2."** - Logic in ONE place (TypeScript), not duplicated across TWO layers (bash + TypeScript). This bug demonstrates why the "All logic in TypeScript" principle is not just a guideline, it's a requirement for system stability.

**Files Changed:**
- `source.env` - Restored to simple architecture (-164 lines)
- `components/Web4TSComponent/0.3.13.2/templates/project/source.env.template` - Synced with source.env
- `components/Web4TSComponent/0.3.13.2/test/web4tscomponent.bug1-regression.test.ts` - New comprehensive regression tests (+234 lines)

---

## 🐛 Active Bugs

(None currently)

*(None yet)*

---

**Last Updated:** 2025-10-19  
**Maintained By:** AI Agent (Claude Sonnet 4.5)


