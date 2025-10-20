# Known Bugs - 2025-10-14 Session

## 🐛 Active Bugs

### Bug 1: `web4tscomponent completion method <TAB>` Falls Back to File Listing

**Status:** 🔴 Active - Not Fixed  
**Severity:** High - Fundamental functionality broken  
**Discovered:** 2025-10-19  
**Session:** 2025-10-14-UTC-0948  
**Last Working Commit:** `58a9b0a1` (2025-10-17-UTC-2015 - setCICDVersion implementation)  
**First Broken Commit:** `c4fbcfbe` (2025-10-18 - Add filter support)

**📋 Detailed Analysis:** [known.bug1.analysis.md](./known.bug1.analysis.md)

**Description:**
When user types `web4tscomponent completion method <TAB>`, the tab completion falls back to directory/file listing instead of showing the method list.

**Expected Behavior:**
Should display numbered list of all 200+ methods (same as `web4tscomponent <TAB>`).

**Actual Behavior:**
Shows directory listing (`.git/`, `package.json`, etc.).

**Root Cause:**
The bash completion script is not correctly passing the trailing empty argument to the `filterParameterCompletion` callback. The callback receives `["completion", "method"]` instead of `["completion", "method", ""]`, causing it to return empty and bash falls back to file completion.

**Log Evidence:**
```
Calling: web4tscomponent completeParameter filterParameterCompletion completion method 
Callback returned: ''
Final output for compgen: ''
```

**Direct Command Workaround:**
The direct command works correctly:
```bash
web4tscomponent completeParameter filterParameterCompletion completion method ""
```

**Related Issues:**
- P24: completionNameParameterCompletion Array Index Bug
- Trailing empty element preservation in bash arrays

**Attempted Fixes:**
1. Added trailing empty element fix with condition `[ $((COMP_CWORD - 1)) -ge ${#args[@]} ]`
2. Multiple iterations of the condition logic
3. Confirmed condition evaluates TRUE in isolation, but behavior not fixed in actual completion

**Files Affected:**
- `source.env` (lines 46-52)
- `components/Web4TSComponent/0.3.13.2/templates/project/source.env.template` (lines 46-52)

**Impact:**
Users cannot use tab completion to discover available methods when testing the `completion` command. Must manually type method names or use the direct command workaround.

**Priority:** High - Core functionality regression

---

## 🟢 Resolved Bugs

*(None yet)*

---

**Last Updated:** 2025-10-19  
**Maintained By:** AI Agent (Claude Sonnet 4.5)


