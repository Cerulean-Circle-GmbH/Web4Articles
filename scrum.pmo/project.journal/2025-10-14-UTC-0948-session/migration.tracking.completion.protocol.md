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
| 1 | TypeScript | DefaultWeb4TSComponent.ts | `completion(what, filter)` | ANSI formatted output | ⏳ **TODO** | Add DISPLAY/WORD prefix protocol |
| 2 | TypeScript | DefaultCLI.ts | `completeParameter(callback, ...args)` | ANSI formatted output | ⏳ **TODO** | Add DISPLAY/WORD prefix protocol |
| 3 | TypeScript | TSCompletion.ts | `complete(args)` | Returns string array | ⏳ **TODO** | Check if needs migration |
| 4 | bash | source.env | `_web4_tscompletion()` | 442 lines with ANSI parsing | ⏳ **TODO** | Simplify to ~20 lines with grep |
| 5 | bash | source.env | Method completion logic | Lines 50-252 (~200 lines) | ⏳ **TODO** | Replace with 3 grep one-liners |
| 6 | bash | source.env | Parameter completion logic | Lines 277-329 (~52 lines) | ⏳ **TODO** | Replace with 3 grep one-liners |
| 7 | bash | source.env | Callback handling | Lines 167-176, 267-275, 392-400 | ⏳ **TODO** | Simplify callback detection |
| 8 | bash | source.env | Single-match detection | Multiple locations with regex | ⏳ **TODO** | Remove - bash counts words instead |
| 9 | bash | source.env | ANSI stripping logic | `sed` commands in 3 places | ⏳ **TODO** | Remove - TypeScript outputs clean text |
| 10 | bash | source.env | Timeout handling | Lines 167-176, 267-275, 392-400 | ✅ **KEEP** | Already simple, just update message |

**Status Legend:**
- ⏳ **TODO** - Not started
- 🔄 **IN PROGRESS** - Being worked on
- ✅ **DONE** - Completed and tested
- ✅ **KEEP** - Already simple, no migration needed
- ❌ **SKIP** - Not needed after migration

---

## **TypeScript Changes Required**

### **1. DefaultWeb4TSComponent.ts - `completion()` method**

**Current behavior:** Returns formatted ANSI output  
**New behavior:** Output with DISPLAY/WORD prefixes

**Changes:**
```typescript
// OLD:
console.log(formattedOutput);

// NEW:
formattedLines.forEach(line => console.log(`DISPLAY: ${line}`));
methodNames.forEach(name => console.log(`WORD: ${name}`));
```

**Test cases:**
- Multiple matches: Show display + words
- Single match: Show display + single word (bash auto-completes)
- No matches: Empty output

---

### **2. DefaultCLI.ts - `completeParameter()` method**

**Current behavior:** Returns formatted callback completions  
**New behavior:** Output with DISPLAY/WORD prefixes

**Changes:**
```typescript
// Similar to completion() - add DISPLAY/WORD prefixes
```

**Test cases:**
- Callback-based parameter completion
- Direct parameter values
- Single match auto-completion

---

### **3. TSCompletion.ts - `complete()` method**

**Current behavior:** Returns string array  
**Investigation needed:** Is this used by bash completion? Or internal only?

**Action:** Investigate usage and determine if migration needed

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

**Key Learning:** Large migrations need tracking tables. Without them, easy to forget pieces and create broken system.

---

**Last Updated:** Tue Oct 21 06:27:23 UTC 2025  
**Next Update:** After Phase 1 TypeScript changes completed

