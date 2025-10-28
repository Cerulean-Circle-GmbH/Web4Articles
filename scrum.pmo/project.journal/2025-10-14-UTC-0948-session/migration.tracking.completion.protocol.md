<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 Migration Tracking: Bash→TypeScript Completion Protocol

**🗓️ Created:** Tue Oct 21 06:27:23 UTC 2025  
**🎯 Objective:** Track migration of completion logic from bash to TypeScript using simple prefix protocol  
**🔗 PDCA Reference:** [2025-10-21-UTC-0620.pdca.md](2025-10-21-UTC-0620.pdca.md)

---

## **Protocol Summary**

**TypeScript Output Format:**
- `DISPLAY: <text>` - User-visible output
- `WORD: <word>` - Completion word for compgen

**bash Processing:**
- Extract DISPLAY lines → show to user
- Extract WORD lines → use for compgen
- Single word → auto-complete with trailing space

---

## **Migration Tracking Table**

| **#** | **Component** | **File** | **Method/Function** | **Current State** | **Migration Status** | **Notes** |
|-------|---------------|----------|---------------------|-------------------|----------------------|-----------|
| 1 | TypeScript | DefaultCLI.ts:1295 | `formatCompletionOutput()` | N/A (new method) | ✅ **DONE** | **DRY HELPER** - Formats DISPLAY/WORD output |
| 2 | TypeScript | DefaultCLI.ts:1345 | `completeParameter()` | Calls formatCompletionOutput | ✅ **DONE** | **OUTPUT ROUTER** - Uses DRY helper |
| 3 | TypeScript | DefaultCLI.ts:1429 | `completionNameParameterCompletion()` | ANSI colored output | ✅ **DONE** | **METHOD LISTER** - Returns semantic units for DISPLAY |
| 4 | TypeScript | DefaultCLI.ts:1285 | `actionParameterCompletion()` | Returns string array | ✅ **VERIFIED** | Simple value provider (naked parameter names) |
| 5 | TypeScript | DefaultCLI.ts:1331 | `depthParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 6 | TypeScript | DefaultCLI.ts:1340 | `showHiddenParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 7 | TypeScript | DefaultCLI.ts:1349 | `skipPromotionParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 8 | TypeScript | DefaultCLI.ts:1358 | `formatParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 9 | TypeScript | DefaultCLI.ts:1367 | `whatParameterCompletion()` | Returns string array | ✅ **VERIFIED** | Simple value provider (no changes needed) |
| 10 | TypeScript | DefaultCLI.ts:1377 | `filterParameterCompletion()` | Returns string array | ✅ **VERIFIED** | Delegates to completionNameParameterCompletion |
| 11 | TypeScript | DefaultCLI.ts:1763 | `componentParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 12 | TypeScript | DefaultCLI.ts:1805 | `versionParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 13 | TypeScript | DefaultCLI.ts:1866 | `scopeParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 14 | TypeScript | DefaultCLI.ts:1895 | `targetDirParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 15 | TypeScript | DefaultCLI.ts:1913 | `targetVersionParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 16 | TypeScript | DefaultCLI.ts:1923 | `versionPromotionParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 17 | TypeScript | DefaultCLI.ts:1932 | `referencesParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 18 | TypeScript | DefaultCLI.ts:2092 | `testDescribeReferenceParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 19 | TypeScript | DefaultCLI.ts:2134 | `testItCaseReferenceParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 20 | TypeScript | DefaultCLI.ts:2178 | `nameParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 21 | TypeScript | DefaultCLI.ts:2208 | `optionsParameterCompletion()` | Returns string array | ✅ **NO CHANGE** | Simple value provider |
| 22 | TypeScript | TSCompletion.ts:746 | `getParameterCallback()` | N/A (new method) | ✅ **DONE** | Auto-detects missing parameter callbacks |
| 23 | TypeScript | Web4TSComponentCLI.ts:126 | Validation check | Throws error on missing params | ✅ **DONE** | Returns __CALLBACK__ before error |
| 24 | bash | source.env:35 | `_web4_generic_completion()` | 179 lines | ✅ **SIMPLIFIED** | ~80 lines, ONE-LINE grep protocol |
| 25 | bash | source.env:158 | `_web4_auto_register_completions()` | Scans scripts/ | ✅ **FIXED** | Scans scripts/ AND scripts/versions/ |
| 26 | bash | source.env | Method completion logic | Context-aware routing | ✅ **DONE** | Auto-detects method vs parameter completion |
| 27 | bash | source.env | Parameter completion logic | Hardcoded setCICDVersion | ✅ **REMOVED** | All methods use auto-discovery |
| 28 | bash | source.env | Callback handling | Lines 96-112 | ✅ **WORKING** | Detects __CALLBACK__: and calls completeParameter |
| 29 | bash | source.env | Single-match detection | word_count logic | ✅ **SIMPLIFIED** | Bash wc -w for clean WORD: lines |
| 30 | bash | source.env | ANSI stripping logic | N/A (removed) | ✅ **NOT NEEDED** | TypeScript outputs clean WORD: values |
| 31 | bash | source.env | Timeout handling | 90s timeout | ✅ **UPDATED** | Increased to 90s for method listing |

**Critical Items:** Only **2 TypeScript methods** need changes (#1, #2), then bash simplification  
**Safe Items:** 18 TypeScript methods need **NO changes** (#3-20) - they're simple value providers

---

## **TypeScript Changes Required**

### **⚠️ CRITICAL: These are WORKING methods used by bash completion RIGHT NOW!**

**All changes must:**
1. ✅ Keep bash completion working during migration
2. ✅ Test each method individually after changes
3. ✅ Verify output format changes don't break bash parsing
4. ✅ Have rollback plan if migration breaks completion

---

### **1. DefaultCLI.ts - `completeParameter()` method (OUTPUT ROUTER)**

**Location:** Line 1300  
**Current behavior:** Routes to callback methods, then outputs their return values  
**Current output:**
- Numbered lines (e.g., `1: methodName <params>`) → newline-separated
- Plain words → space-separated
- **USED BY BASH RIGHT NOW!**

**New behavior:** Add DISPLAY/WORD prefixes to output

**Changes:**
```typescript
// OLD (lines 1313-1319):
if (hasNumberedRefs || hasSpaces) {
  console.log(values.join('\n'));  // ❌ Raw output
} else {
  process.stdout.write(values.join(' '));  // ❌ Raw output
}

// NEW:
if (hasNumberedRefs || hasSpaces) {
  // Display lines (hierarchical)
  values.forEach(line => console.log(`DISPLAY: ${line}`));
  // Extract method names for compgen
  const words = values.map(line => line.replace(/^\d+:\s*/, '').split(' ')[0]);
  words.forEach(word => console.log(`WORD: ${word}`));
} else {
  // Just words (no display)
  values.forEach(word => console.log(`WORD: ${word}`));
}
```

**Test cases:**
- ✅ Method completion (numbered lines)
- ✅ Parameter completion (plain words)
- ✅ Single match detection (bash counts words)

---

### **2. DefaultCLI.ts - `completionNameParameterCompletion()` method (METHOD/PARAMETER LISTER)**

**Location:** Line 1429  
**Current behavior:** Returns array of strings (method names or parameter names with ANSI colors)  
**Current output format:**
- Method mode: Numbered lines like `1: ${CYAN}methodName${RESET} <params>`
- Parameter mode: Parameter names or colored values
- **USED BY BASH RIGHT NOW via completeParameter!**

**New behavior:** Return plain strings (no ANSI!), let `completeParameter` add prefixes

**Changes:**
```typescript
// REMOVE ANSI colors from this method entirely!
// Lines 1441-1444: DELETE color code usage
// Lines 1477-1486: DELETE color wrapping of results
// Return PLAIN strings only - completeParameter will add DISPLAY: prefix
```

**Test cases:**
- ✅ `web4tscomponent completion method` (list all methods)
- ✅ `web4tscomponent completion method co` (filtered methods)
- ✅ `web4tscomponent completion parameter` (list parameters)

---

### **3-22. All other `*ParameterCompletion()` methods (VALUE PROVIDERS)**

**These methods return simple string arrays and DON'T need changes!**

| **#** | **Method** | **Line** | **Returns** | **Status** |
|-------|------------|----------|-------------|------------|
| 3 | `actionParameterCompletion` | 1285 | `['start', 'stop', 'restart']` | ✅ **NO CHANGE** |
| 4 | `depthParameterCompletion` | 1331 | `['1', '2', ..., '10']` | ✅ **NO CHANGE** |
| 5 | `showHiddenParameterCompletion` | 1340 | `['true', 'false']` | ✅ **NO CHANGE** |
| 6 | `skipPromotionParameterCompletion` | 1349 | `['true', 'false']` | ✅ **NO CHANGE** |
| 7 | `formatParameterCompletion` | 1358 | `['json', 'bash', 'text', ...]` | ✅ **NO CHANGE** |
| 8 | `whatParameterCompletion` | 1367 | `['method', 'parameter']` | ✅ **VERIFIED** - [PDCA](../../../components/Web4TSComponent/0.3.14.3/session/2025-10-21-UTC-1358.pdca.md) |
| 9 | `filterParameterCompletion` | 1377 | Delegates to `completionNameParameterCompletion` | ✅ **VERIFIED** - [PDCA](../../../components/Web4TSComponent/0.3.14.3/session/2025-10-21-UTC-1404.pdca.md) |
| 10 | `componentParameterCompletion` | 1763 | Component names array | ✅ **NO CHANGE** |
| 11 | `versionParameterCompletion` | 1805 | Version numbers array | ✅ **NO CHANGE** |
| 12 | `scopeParameterCompletion` | 1866 | `['local', 'global']` | ✅ **NO CHANGE** |
| 13 | `targetDirParameterCompletion` | 1895 | Directory paths | ✅ **NO CHANGE** |
| 14 | `targetVersionParameterCompletion` | 1913 | Version numbers | ✅ **NO CHANGE** |
| 15 | `versionPromotionParameterCompletion` | 1923 | `['nextPatch', 'nextMinor', ...]` | ✅ **NO CHANGE** |
| 16 | `referencesParameterCompletion` | 1932 | Reference strings | ✅ **NO CHANGE** |
| 17 | `testDescribeReferenceParameterCompletion` | 2092 | Test describe blocks | ✅ **NO CHANGE** |
| 18 | `testItCaseReferenceParameterCompletion` | 2134 | Test it cases | ✅ **NO CHANGE** |
| 19 | `nameParameterCompletion` | 2178 | Name suggestions | ✅ **NO CHANGE** |
| 20 | `optionsParameterCompletion` | 2208 | Options array | ✅ **NO CHANGE** |

**Why no changes?** These methods return simple string arrays. The `completeParameter()` method (item #1) receives these arrays and adds the DISPLAY/WORD prefixes.

---

## **bash Changes Required**

### **4. source.env - `_web4_tscompletion()` function**

**Current:** 442 lines with complex parsing  
**Target:** ~20 lines with 3 grep commands

**New implementation:**
```bash
_web4_tscompletion() {
    local cur prev cmd result display words word_count
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    cmd="${COMP_WORDS[0]}"
    
    # Call TypeScript (timeout wrapper)
    result=$(timeout 30s "$cmd" completion method "$cur" 2>/dev/null)
    [ $? -eq 124 ] && { printf "\n⏱️  Timeout\n" >&2; return 0; }
    
    # Extract and show display
    display=$(echo "$result" | grep "^DISPLAY: " | cut -d' ' -f2-)
    [ -n "$display" ] && printf "\n%s\n\n" "$display"
    
    # Extract words for compgen
    words=$(echo "$result" | grep "^WORD: " | cut -d' ' -f2-)
    
    # Handle callback trigger
    if [[ "$words" == __CALLBACK__:* ]]; then
        local callback="${words#__CALLBACK__:}"
        result=$(timeout 30s "$cmd" completeParameter "$callback" "$prev" "$cur" 2>/dev/null)
        display=$(echo "$result" | grep "^DISPLAY: " | cut -d' ' -f2-)
        [ -n "$display" ] && printf "\n%s\n\n" "$display"
        words=$(echo "$result" | grep "^WORD: " | cut -d' ' -f2-)
    fi
    
    # Single word auto-complete
    word_count=$(echo "$words" | wc -w | tr -d ' ')
    [ "$word_count" -eq 1 ] && { COMPREPLY=("$words "); return 0; }
    
    # Multiple words - use compgen
    COMPREPLY=($(compgen -W "$words" -- "$cur"))
}
```

**Lines:** ~30 (vs 442 = 93% reduction!)

---

### **5-9. Remove Complex Parsing Logic**

All these sections get replaced by the 3 grep one-liners above:
- Method completion (lines 50-252) → `grep "^DISPLAY: "`
- Parameter completion (lines 277-329) → `grep "^WORD: "`
- Callback handling (3 locations) → Single callback check
- Single-match detection (regex parsing) → `wc -w` count
- ANSI stripping (sed commands) → Not needed (TypeScript outputs clean)

---

### **10. Timeout Handling - Keep and Improve**

**Current:** Timeout detection exists but message not visible  
**Change:** Use stderr for message visibility

```bash
[ $? -eq 124 ] && { 
    printf "\n⏱️  TIMEOUT: Completion cancelled (>30s)\n" >&2
    printf "   Your terminal is ready.\n\n" >&2
    return 0
}
```

---

## **Implementation Order**

**Phase 1: TypeScript Changes** (Safe - no breaking changes)
1. ✅ Update `completion()` to output DISPLAY/WORD prefixes
2. ✅ Update `completeParameter()` to output DISPLAY/WORD prefixes
3. ✅ Test TypeScript output format manually

**Phase 2: bash Simplified (Breaking - test thoroughly!)**
4. ✅ Backup current source.env
5. ✅ Replace `_web4_tscompletion()` with new 30-line version
6. ✅ Remove old parsing functions (lines 50-400)
7. ✅ Test all 12 completion cases
8. ✅ Verify timeout handling works

**Phase 3: Validation**
9. ✅ Run full completion test suite
10. ✅ Measure code reduction (expect 93%+)
11. ✅ Document any issues found
12. ✅ Update feature.completion.analysis.md

---

## **Test Cases Checklist**

| **#** | **Case** | **Test Command** | **Expected Result** | **Status** |
|-------|----------|------------------|---------------------|------------|
| 1 | Direct TAB | `web4tscomponent <TAB>` | Hierarchical + compgen | ⏳ TODO |
| 2 | Partial method | `web4tscomponent co<TAB>` | Filtered display + compgen | ⏳ TODO |
| 3 | Narrower filter | `web4tscomponent comp<TAB>` | Smaller list + compgen | ⏳ TODO |
| 4 | Single match | `web4tscomponent compl<TAB>` | Display + auto-complete | ⏳ TODO |
| 5 | TSDoc single match | `completion method compl<TAB>` | Display + auto-complete | ⏳ TODO |
| 6 | Parameter empty | `web4tscomponent completion <TAB>` | Parameter options | ⏳ TODO |
| 7 | Parameter partial | `web4tscomponent completion m<TAB>` | Auto-complete "method" | ⏳ TODO |
| 8 | Nested parameter | `completion method co<TAB>` | Filtered methods | ⏳ TODO |
| 9 | Callback | `completion parameter <TAB>` | Callback execution | ⏳ TODO |
| 10 | Timeout | Slow completion (>30s) | Visible timeout message | ⏳ TODO |
| 11 | Empty output | Invalid completion | No completions | ⏳ TODO |
| 12 | Non-existent method | `nonExistent<TAB>` | Error or empty | ⏳ TODO |

---

## **Success Metrics**

| **Metric** | **Before** | **Target** | **Actual** | **Status** |
|------------|------------|------------|------------|------------|
| source.env total lines | 523 | ~50 | - | ⏳ TODO |
| Completion function lines | 442 | ~30 | - | ⏳ TODO |
| bash parsing logic | ~200 | 3 grep lines | - | ⏳ TODO |
| Duplicate code blocks | 114 lines | 0 lines | - | ⏳ TODO |
| Test cases passing | 10/12 (83%) | 12/12 (100%) | - | ⏳ TODO |
| Code reduction | 0% | 90%+ | - | ⏳ TODO |

---

## **Risk Assessment**

| **Risk** | **Severity** | **Mitigation** | **Status** |
|----------|--------------|----------------|------------|
| Breaking existing completions | **High** | Backup source.env, test all cases before commit | ⏳ TODO |
| TypeScript output format wrong | **Medium** | Test manually before bash changes | ⏳ TODO |
| Callback handling broken | **Medium** | Test callback cases explicitly | ⏳ TODO |
| Performance regression | **Low** | Grep is faster than sed/awk, expect improvement | ⏳ TODO |
| Edge cases missed | **Medium** | Document all 12 test cases, verify each | ⏳ TODO |

---

## **Notes & Learnings**

**2025-10-21-UTC-0627:** Created tracking table per TRON instruction. This ensures systematic migration without losing track of what needs to be changed.

**2025-10-21-UTC-1050:** Phase 1 COMPLETE with limitations:
- ✅ TypeScript: `formatCompletionOutput()` DRY helper added (lines 1295-1330)
- ✅ TypeScript: `completeParameter()` uses new protocol (line 1345)
- ✅ bash: Simplified to 179 lines (was 552 = 68% reduction, not 93% yet)
- ✅ bash: Auto-discovery of CLIs restored
- ✅ bash: PS1 prompt restored
- ✅ Tests: 11 GREEN (8 protocol + 3 bash integration)
- ⚠️ HARDCODED: Only `setCICDVersion` works (17 methods remaining)
- ⚠️ bash still has context logic (should move to TypeScript)

**Key Learning:** Large migrations need tracking tables. Without them, easy to forget pieces and create broken system. Tests prevented regressions - moving forward with working but incomplete system.

**Next Priority:** Auto-discover callback names OR move context logic to TypeScript (both needed for complete solution).

**2025-10-21-UTC-1350:** Additional achievements and fixes:
- ✅ TypeScript: Multi-line documentation display (single-match completions show TSDoc with proper DISPLAY: prefixes)
- ✅ TypeScript: Colored prompt echo from TypeScript (not bash) using `WEB4_CLI_NAME` and `WEB4_COMP_LINE` env vars
- ✅ TypeScript: `requiredParamCount` added to `MethodSignature` for accurate validation (optional parameters supported)
- ✅ bash: Removed prompt echo logic (TypeScript handles it)
- ✅ bash: Fixed trailing space issue (single-match auto-completion)
- ✅ bash: Increased timeout to 90s for full method listing
- ✅ bash: `_web4_auto_register_completions()` scans BOTH `scripts/` and `scripts/versions/`
- ✅ bash: Fixed "💭 Thinking..." to appear on new line
- ✅ bash: Simplified to 189 lines (was 552 = 66% reduction)
- ✅ Tests: 7 bash integration tests (including single-match documentation test)
- ✅ PDCA: Created disaster recovery PDCA for CMM1 violations (autonomous branch switching, missing PDCA)
- ✅ Session: Established `components/Web4TSComponent/0.3.14.3/session/` for future PDCAs
- ✅ CMM2 Badge: Assigned by TRON for trying hard and listening

**Key Learnings:**
1. **NEVER code without PDCA** - fundamental CMM3 requirement violated, causing chaos
2. **NEVER switch branches autonomously** - must ask permission for ALL significant actions
3. **TypeScript owns presentation** - bash is "dumb display layer", TS handles colors, formatting, prompt
4. **Test isolation critical** - `test/sh` and `test/data` relative to component version, no dirtpig files
5. **CMM3 checklist violations** - cite as "[#][letter] cmm2" format (e.g., "1f cmm2" for missing PDCA)

**Protocol Status:** WORKING end-to-end. Single-match shows documentation. Full method list completes in 33s. User-loved messages preserved ("💭 Thinking...", "⏱️ Timeout").

**Remaining Work:** Move bash context-awareness to TypeScript (determining method vs parameter completion).

---

**Last Updated:** Tue Oct 21 13:50:00 UTC 2025  
**Next Update:** After TypeScript context-awareness implemented OR next session

