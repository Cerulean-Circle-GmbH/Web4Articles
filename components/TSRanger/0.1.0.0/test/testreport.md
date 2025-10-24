<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 🧪 TSRanger v2.2 Comprehensive Test Report

**Generated:** 2025-08-20T06:55:27.284Z  
**Test Suite:** Comprehensive Testing Matrix (54 test cases)  
**Source:** [comprehensive-testing-matrix.md](../../../scrum.pmo/project.journal/2025-08-19-0800-fresh-dawn/comprehensive-testing-matrix.md)  
**TSRanger Version:** v2.2  
**Test Protocol:** Non-interactive mode using `tsranger test "input"`

---

## 📊 **EXECUTIVE SUMMARY**

| Metric | Value | 
|--------|-------|
| **Total Tests** | 32 |
| **✅ Passed** | 0 |
| **❌ Failed** | 32 |
| **Success Rate** | 0.0% |
| **Average Duration** | 3374ms |

---

## 📋 **DETAILED TEST RESULTS**

| Test ID | Level | Input | Expected | Requirement UUID | Test UUID | Result | Duration | Prompt Line | Status |
|---------|-------|-------|----------|------------------|-----------|--------|----------|-------------|--------|
| 1 | LEVEL 1: Basic Navigation | `[down]` | OOSH (class only, cursor at start) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]` | `[test:uuid:test-nav-001-basic-down]` | ❌ FAIL | 3670ms | `Logger` | BROKEN |
| 2 | LEVEL 1: Basic Navigation | `[down][down]` | OOSH (class only, no method) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d6]` | `[test:uuid:test-nav-002-double-down]` | ❌ FAIL | 2769ms | `Logger                        start` | BROKEN |
| 3 | LEVEL 1: Basic Navigation | `[down][down][down]` | ParameterParser (class only) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d7]` | `[test:uuid:test-nav-003-triple-down]` | ❌ FAIL | 3325ms | `Logger                        start` | BROKEN |
| 4 | LEVEL 1: Basic Navigation | `[down][down][down][down]` | TSsh (class only) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d8]` | `[test:uuid:test-nav-004-quad-down]` | ❌ FAIL | 2278ms | `Logger                        start` | BROKEN |
| 5 | LEVEL 1: Basic Navigation | `[down][down][down][down][down]` | DefaultCLI (class only) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d9]` | `[test:uuid:test-nav-005-five-down]` | ❌ FAIL | 2807ms | `Logger                        start` | BROKEN |
| 6 | LEVEL 1: Basic Navigation | `[down][down][down][down][down][down]` | GitScrumProject (class only) | `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4da]` | `[test:uuid:test-nav-006-six-down]` | ❌ FAIL | 5050ms | `Logger` | BROKEN |
| 7 | LEVEL 2: Basic Advancement | `[tab]` | Logger log (class + method, cursor on method) | `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e7]` | `[test:uuid:test-adv-001-tab-advance]` | ❌ FAIL | 4310ms | `Logger` | BROKEN |
| 8 | LEVEL 2: Basic Advancement | `[right]` | Logger log (class + method, cursor on method) | `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e8]` | `[test:uuid:test-adv-002-right-advance]` | ❌ FAIL | 4077ms | `Logger` | BROKEN |
| 9 | LEVEL 2: Basic Advancement | `[down][tab]` | OOSH start (class + method) | `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e9]` | `[test:uuid:test-adv-003-nav-then-advance]` | ❌ FAIL | 3645ms | `OOSH                                                        level` | BROKEN |
| 10 | LEVEL 3: Basic Filters | `g` | GitScrumProject (filter suggestion) | `[requirement:uuid:95c6d7e8-f901-6172-8283-a3b4c5d6e7f8]` | `[test:uuid:test-flt-001-g-filter]` | ❌ FAIL | 2663ms | `Logger` | BROKEN |
| 11 | LEVEL 3: Basic Filters | `t` | TSsh (filter suggestion) | `[requirement:uuid:95c6d7e8-f901-6172-8283-a3b4c5d6e7f9]` | `[test:uuid:test-flt-002-t-filter]` | ❌ FAIL | 3514ms | `Logger` | BROKEN |
| 12 | LEVEL 4: Filter Advancement | `g[tab]` | GitScrumProject start (method shown) | `[requirement:uuid:96d7e8f9-0123-7283-9394-b4c5d6e7f8a9]` | `[test:uuid:test-flt-adv-001-g-tab]` | ❌ FAIL | 3073ms | `OOSH                                                        level` | BROKEN |
| 13 | LEVEL 4: Filter Advancement | `t[tab]` | TSsh start (method shown) | `[requirement:uuid:96d7e8f9-0123-7283-9394-b4c5d6e7f8aa]` | `[test:uuid:test-flt-adv-002-t-tab]` | ❌ FAIL | 2530ms | `OOSH                                                        level` | BROKEN |
| 14 | LEVEL 5: Retreat Operations | `[tab][left]` | Logger (class only, method removed) | `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9ba]` | `[test:uuid:test-ret-001-tab-left]` | ❌ FAIL | 3421ms | `Logger` | BROKEN |
| 15 | LEVEL 5: Retreat Operations | `[tab][shifttab]` | Logger (class only, method removed) | `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9bb]` | `[test:uuid:test-ret-002-tab-shifttab]` | ❌ FAIL | 4187ms | `Logger` | BROKEN |
| 16 | LEVEL 5: Retreat Operations | `g[tab][left]` | GitScrumProject (no filter residue) | `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9bc]` | `[test:uuid:test-ret-003-filter-retreat]` | ❌ FAIL | 3676ms | `OOSH                                                        level` | BROKEN |
| 17 | LEVEL 6: CRITICAL - Filter Corruption | `tg` | GitScrumProject (clean 'g' filter) | `[requirement:uuid:98f90123-4567-94a5-b5c6-d6e7f8a9bacb]` | `[test:uuid:test-crit-001-filter-corruption]` | ❌ FAIL | 2878ms | `Logger` | BROKEN |
| 18 | LEVEL 6: CRITICAL - Filter Corruption | `abc` | Class starting with 'c' | `[requirement:uuid:98f90123-4567-94a5-b5c6-d6e7f8a9bacc]` | `[test:uuid:test-crit-002-multi-filter-corruption]` | ❌ FAIL | 2960ms | `Logger` | BROKEN |
| 19 | LEVEL 7: Navigation + Filter Combinations | `[down][down][down][down][down][down][tab]` | GitScrumProject start (positional equivalence to g[tab]) | `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbdc]` | `[test:uuid:test-nav-flt-001-positional-equiv]` | ❌ FAIL | 2792ms | `Logger                        start` | BROKEN |
| 20 | LEVEL 7: Navigation + Filter Combinations | `g[right][down]` | GitScrumProject create (next method) | `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbdd]` | `[test:uuid:test-nav-flt-002-filter-method-nav]` | ❌ FAIL | 3622ms | `OOSH                                                        level` | BROKEN |
| 21 | LEVEL 7: Navigation + Filter Combinations | `t[tab][down]` | TSsh dispatch (method navigation) | `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbde]` | `[test:uuid:test-nav-flt-003-t-method-nav]` | ❌ FAIL | 2855ms | `OOSH                                                        level` | BROKEN |
| 22 | LEVEL 8: Complex Filter Clearing | `g[right][down][left]` | GitScrumProject (no filter residue) | `[requirement:uuid:9a123456-789a-b6c7-d7e8-f8a9bacbdced]` | `[test:uuid:test-flt-clr-001-complex-clear]` | ❌ FAIL | 2796ms | `OOSH                                                        level` | BROKEN |
| 23 | LEVEL 8: Complex Filter Clearing | `g[down]` | Next class after GitScrumProject | `[requirement:uuid:9a123456-789a-b6c7-d7e8-f8a9bacbdcee]` | `[test:uuid:test-flt-clr-002-nav-filter-clear]` | ❌ FAIL | 2434ms | `Logger` | BROKEN |
| 24 | LEVEL 9: Ultra-Complex Sequences | `g[right][down][right][left][tab]` | Final state with method | `[requirement:uuid:9b234567-89ab-c7d8-e8f9-a9bacbdcedef]` | `[test:uuid:test-complex-001-multi-column-nav]` | ❌ FAIL | 4045ms | `OOSH                                                        level` | BROKEN |
| 25 | LEVEL 9: Ultra-Complex Sequences | `[down][down][down][tab][down][left][right]` | Complex state transitions | `[requirement:uuid:9b234567-89ab-c7d8-e8f9-a9bacbdcedf0]` | `[test:uuid:test-complex-002-long-sequence]` | ❌ FAIL | 5043ms | `N/A` | BROKEN |
| 26 | LEVEL 10: DRY/OOP Validation | `[tab]` | Logger log | `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf012]` | `[test:uuid:test-dry-001-tab-baseline]` | ❌ FAIL | 5014ms | `N/A` | BROKEN |
| 27 | LEVEL 10: DRY/OOP Validation | `[right]` | Logger log (identical to [tab]) | `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf013]` | `[test:uuid:test-dry-002-right-comparison]` | ❌ FAIL | 2182ms | `Logger` | BROKEN |
| 28 | LEVEL 10: DRY/OOP Validation | `[tab][left]` | Logger (class only) | `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf014]` | `[test:uuid:test-dry-003-left-baseline]` | ❌ FAIL | 2994ms | `Logger` | BROKEN |
| 29 | LEVEL 10: DRY/OOP Validation | `[tab][shifttab]` | Logger (identical to [tab][left]) | `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf015]` | `[test:uuid:test-dry-004-shifttab-comparison]` | ❌ FAIL | 3394ms | `Logger` | BROKEN |
| 30 | LEVEL 11: Prompt Update Consistency | `[down]` | Must update prompt | `[requirement:uuid:9d456789-abcd-e9f0-123b-cbdcedf01234]` | `[test:uuid:test-prompt-001-nav-update]` | ❌ FAIL | 3782ms | `Logger` | BROKEN |
| 31 | LEVEL 11: Prompt Update Consistency | `[up][down][left][right]` | Consistent prompt updates | `[requirement:uuid:9d456789-abcd-e9f0-123b-cbdcedf01235]` | `[test:uuid:test-prompt-002-chain-consistency]` | ❌ FAIL | 2876ms | `Logger                        start` | BROKEN |
| 32 | LEVEL 12: State Recovery | `tg` | Should remain usable | `[requirement:uuid:9e56789a-bcde-f012-345c-dcedf0123456]` | `[test:uuid:test-recovery-001-corruption-resilience]` | ❌ FAIL | 3301ms | `Logger` | BROKEN |

---

## 🚨 **FAILED TESTS ANALYSIS**

### Test 1: Classes: Logger → OOSH

**Input:** `[down]`  
**Expected:** OOSH (class only, cursor at start)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3670ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 2: Classes: OOSH → OOSH

**Input:** `[down][down]`  
**Expected:** OOSH (class only, no method)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2769ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 3: Classes: OOSH → ParameterParser

**Input:** `[down][down][down]`  
**Expected:** ParameterParser (class only)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3325ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 4: Classes: ParameterParser → TSsh

**Input:** `[down][down][down][down]`  
**Expected:** TSsh (class only)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2278ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 5: Classes: TSsh → DefaultCLI

**Input:** `[down][down][down][down][down]`  
**Expected:** DefaultCLI (class only)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2807ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 6: Classes: DefaultCLI → GitScrumProject

**Input:** `[down][down][down][down][down][down]`  
**Expected:** GitScrumProject (class only)  
**Exit Code:** null  
**Error:** spawnSync /Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/sh/tsranger ETIMEDOUT  
**Duration:** 5050ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 7: Classes → Methods: Logger → Logger log

**Input:** `[tab]`  
**Expected:** Logger log (class + method, cursor on method)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 4310ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 8: Classes → Methods: Logger → Logger log (DRY equivalence)

**Input:** `[right]`  
**Expected:** Logger log (class + method, cursor on method)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 4077ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 9: Classes: OOSH → OOSH start

**Input:** `[down][tab]`  
**Expected:** OOSH start (class + method)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3645ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 10: Classes filter: → GitScrumProject

**Input:** `g`  
**Expected:** GitScrumProject (filter suggestion)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2663ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 11: Classes filter: → TSsh

**Input:** `t`  
**Expected:** TSsh (filter suggestion)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3514ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 12: GitScrumProject → GitScrumProject start

**Input:** `g[tab]`  
**Expected:** GitScrumProject start (method shown)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3073ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 13: TSsh → TSsh start

**Input:** `t[tab]`  
**Expected:** TSsh start (method shown)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2530ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 14: Methods → Classes: Logger log → Logger

**Input:** `[tab][left]`  
**Expected:** Logger (class only, method removed)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3421ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 15: Methods → Classes: Logger log → Logger (DRY equivalence)

**Input:** `[tab][shifttab]`  
**Expected:** Logger (class only, method removed)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 4187ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 16: GitScrumProject start → GitScrumProject

**Input:** `g[tab][left]`  
**Expected:** GitScrumProject (no filter residue)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3676ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 17: Filter: t → clear → g (CRITICAL BUG)

**Input:** `tg`  
**Expected:** GitScrumProject (clean 'g' filter)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2878ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 18: Multiple filter ops should result in 'c' only

**Input:** `abc`  
**Expected:** Class starting with 'c'  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2960ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 19: GitScrumProject → GitScrumProject start

**Input:** `[down][down][down][down][down][down][tab]`  
**Expected:** GitScrumProject start (positional equivalence to g[tab])  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2792ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 20: GitScrumProject → methods → next method

**Input:** `g[right][down]`  
**Expected:** GitScrumProject create (next method)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3622ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 21: TSsh start → TSsh dispatch

**Input:** `t[tab][down]`  
**Expected:** TSsh dispatch (method navigation)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2855ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 22: GitScrumProject → method → back to class

**Input:** `g[right][down][left]`  
**Expected:** GitScrumProject (no filter residue)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2796ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 23: GitScrumProject → navigate to next class

**Input:** `g[down]`  
**Expected:** Next class after GitScrumProject  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2434ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 24: Multi-column navigation with filter

**Input:** `g[right][down][right][left][tab]`  
**Expected:** Final state with method  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 4045ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 25: Navigation + advancement + retreat + advancement

**Input:** `[down][down][down][tab][down][left][right]`  
**Expected:** Complex state transitions  
**Exit Code:** null  
**Error:** spawnSync /Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/sh/tsranger ETIMEDOUT  
**Duration:** 5043ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
No stdout output
```

---

### Test 26: Baseline for [tab] vs [right] comparison

**Input:** `[tab]`  
**Expected:** Logger log  
**Exit Code:** null  
**Error:** spawnSync /Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/sh/tsranger ETIMEDOUT  
**Duration:** 5014ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
No stdout output
```

---

### Test 27: Must be identical to [tab] result

**Input:** `[right]`  
**Expected:** Logger log (identical to [tab])  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2182ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 28: Baseline for [left] vs [shifttab] comparison

**Input:** `[tab][left]`  
**Expected:** Logger (class only)  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2994ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 29: Must be identical to [left] result

**Input:** `[tab][shifttab]`  
**Expected:** Logger (identical to [tab][left])  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3394ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 30: Any navigation must update prompt

**Input:** `[down]`  
**Expected:** Must update prompt  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3782ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 31: Navigation chain prompt consistency

**Input:** `[up][down][left][right]`  
**Expected:** Consistent prompt updates  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 2876ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---

### Test 32: System should remain usable after filter corruption

**Input:** `tg`  
**Expected:** Should remain usable  
**Exit Code:** 0  
**Error:** N/A  
**Duration:** 3301ms  

**STDERR:**
```
No stderr output
```

**STDOUT:**
```
[2J[H[McDonges.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/TSRanger/v2.2/test[0m [7mL[0mogger
[46m                              [0m[43m                              [0m[45m                              [0m[42m                              [0m
[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[32m[Docs]                        [0m
[7m[36mLogger         ...
```

---


## 🔬 **CRITICAL ISSUES IDENTIFIED**

- **Filter: t → clear → g (CRITICAL BUG)**: 🚨 ACTIVE
- **Multiple filter ops should result in 'c' only**: 🚨 ACTIVE

---

## 📈 **TESTING STATISTICS**

### **By Test Level:**
- **LEVEL 1: Basic Navigation**: 0/6 (0.0%)
- **LEVEL 2: Basic Advancement**: 0/3 (0.0%)
- **LEVEL 3: Basic Filters**: 0/2 (0.0%)
- **LEVEL 4: Filter Advancement**: 0/2 (0.0%)
- **LEVEL 5: Retreat Operations**: 0/3 (0.0%)
- **LEVEL 6: CRITICAL - Filter Corruption**: 0/2 (0.0%)
- **LEVEL 7: Navigation + Filter Combinations**: 0/3 (0.0%)
- **LEVEL 8: Complex Filter Clearing**: 0/2 (0.0%)
- **LEVEL 9: Ultra-Complex Sequences**: 0/2 (0.0%)
- **LEVEL 10: DRY/OOP Validation**: 0/4 (0.0%)
- **LEVEL 11: Prompt Update Consistency**: 0/2 (0.0%)
- **LEVEL 12: State Recovery**: 0/1 (0.0%)

### **Performance Analysis:**
- **Fastest Test:** 2182ms
- **Slowest Test:** 5050ms
- **Total Execution Time:** 107963ms

---

## 🎯 **NEXT ACTIONS**

### **Immediate Actions Required:**
1. **Fix Failed Tests**: 32 tests require immediate attention
2. **Root Cause Analysis**: Investigate common failure patterns
3. **Regression Prevention**: Ensure fixes don't break existing functionality

### **Priority Order:**
⚠️ **HIGH**: Test 1 - Classes: Logger → OOSH
⚠️ **HIGH**: Test 2 - Classes: OOSH → OOSH
⚠️ **HIGH**: Test 3 - Classes: OOSH → ParameterParser
⚠️ **HIGH**: Test 4 - Classes: ParameterParser → TSsh
⚠️ **HIGH**: Test 5 - Classes: TSsh → DefaultCLI
⚠️ **HIGH**: Test 6 - Classes: DefaultCLI → GitScrumProject
⚠️ **HIGH**: Test 7 - Classes → Methods: Logger → Logger log
⚠️ **HIGH**: Test 8 - Classes → Methods: Logger → Logger log (DRY equivalence)
⚠️ **HIGH**: Test 9 - Classes: OOSH → OOSH start
⚠️ **HIGH**: Test 10 - Classes filter: → GitScrumProject
⚠️ **HIGH**: Test 11 - Classes filter: → TSsh
⚠️ **HIGH**: Test 12 - GitScrumProject → GitScrumProject start
⚠️ **HIGH**: Test 13 - TSsh → TSsh start
⚠️ **HIGH**: Test 14 - Methods → Classes: Logger log → Logger
⚠️ **HIGH**: Test 15 - Methods → Classes: Logger log → Logger (DRY equivalence)
⚠️ **HIGH**: Test 16 - GitScrumProject start → GitScrumProject
🚨 **CRITICAL**: Test 17 - Filter: t → clear → g (CRITICAL BUG)
🚨 **CRITICAL**: Test 18 - Multiple filter ops should result in 'c' only
⚠️ **HIGH**: Test 19 - GitScrumProject → GitScrumProject start
⚠️ **HIGH**: Test 20 - GitScrumProject → methods → next method
⚠️ **HIGH**: Test 21 - TSsh start → TSsh dispatch
⚠️ **HIGH**: Test 22 - GitScrumProject → method → back to class
⚠️ **HIGH**: Test 23 - GitScrumProject → navigate to next class
⚠️ **HIGH**: Test 24 - Multi-column navigation with filter
⚠️ **HIGH**: Test 25 - Navigation + advancement + retreat + advancement
⚠️ **HIGH**: Test 26 - Baseline for [tab] vs [right] comparison
⚠️ **HIGH**: Test 27 - Must be identical to [tab] result
⚠️ **HIGH**: Test 28 - Baseline for [left] vs [shifttab] comparison
⚠️ **HIGH**: Test 29 - Must be identical to [left] result
⚠️ **HIGH**: Test 30 - Any navigation must update prompt
⚠️ **HIGH**: Test 31 - Navigation chain prompt consistency
⚠️ **HIGH**: Test 32 - System should remain usable after filter corruption

---

## 📚 **TEST TRACEABILITY**

### **Requirement UUID → Test UUID Mapping:**
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]` → `[test:uuid:test-nav-001-basic-down]` ❌
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d6]` → `[test:uuid:test-nav-002-double-down]` ❌
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d7]` → `[test:uuid:test-nav-003-triple-down]` ❌
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d8]` → `[test:uuid:test-nav-004-quad-down]` ❌
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d9]` → `[test:uuid:test-nav-005-five-down]` ❌
- `[requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4da]` → `[test:uuid:test-nav-006-six-down]` ❌
- `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e7]` → `[test:uuid:test-adv-001-tab-advance]` ❌
- `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e8]` → `[test:uuid:test-adv-002-right-advance]` ❌
- `[requirement:uuid:94b5c6d7-e8f9-5061-7172-92a3b4c5d6e9]` → `[test:uuid:test-adv-003-nav-then-advance]` ❌
- `[requirement:uuid:95c6d7e8-f901-6172-8283-a3b4c5d6e7f8]` → `[test:uuid:test-flt-001-g-filter]` ❌
- `[requirement:uuid:95c6d7e8-f901-6172-8283-a3b4c5d6e7f9]` → `[test:uuid:test-flt-002-t-filter]` ❌
- `[requirement:uuid:96d7e8f9-0123-7283-9394-b4c5d6e7f8a9]` → `[test:uuid:test-flt-adv-001-g-tab]` ❌
- `[requirement:uuid:96d7e8f9-0123-7283-9394-b4c5d6e7f8aa]` → `[test:uuid:test-flt-adv-002-t-tab]` ❌
- `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9ba]` → `[test:uuid:test-ret-001-tab-left]` ❌
- `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9bb]` → `[test:uuid:test-ret-002-tab-shifttab]` ❌
- `[requirement:uuid:97e8f901-2345-8394-a4b5-c5d6e7f8a9bc]` → `[test:uuid:test-ret-003-filter-retreat]` ❌
- `[requirement:uuid:98f90123-4567-94a5-b5c6-d6e7f8a9bacb]` → `[test:uuid:test-crit-001-filter-corruption]` ❌
- `[requirement:uuid:98f90123-4567-94a5-b5c6-d6e7f8a9bacc]` → `[test:uuid:test-crit-002-multi-filter-corruption]` ❌
- `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbdc]` → `[test:uuid:test-nav-flt-001-positional-equiv]` ❌
- `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbdd]` → `[test:uuid:test-nav-flt-002-filter-method-nav]` ❌
- `[requirement:uuid:99012345-6789-a5b6-c6d7-e7f8a9bacbde]` → `[test:uuid:test-nav-flt-003-t-method-nav]` ❌
- `[requirement:uuid:9a123456-789a-b6c7-d7e8-f8a9bacbdced]` → `[test:uuid:test-flt-clr-001-complex-clear]` ❌
- `[requirement:uuid:9a123456-789a-b6c7-d7e8-f8a9bacbdcee]` → `[test:uuid:test-flt-clr-002-nav-filter-clear]` ❌
- `[requirement:uuid:9b234567-89ab-c7d8-e8f9-a9bacbdcedef]` → `[test:uuid:test-complex-001-multi-column-nav]` ❌
- `[requirement:uuid:9b234567-89ab-c7d8-e8f9-a9bacbdcedf0]` → `[test:uuid:test-complex-002-long-sequence]` ❌
- `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf012]` → `[test:uuid:test-dry-001-tab-baseline]` ❌
- `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf013]` → `[test:uuid:test-dry-002-right-comparison]` ❌
- `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf014]` → `[test:uuid:test-dry-003-left-baseline]` ❌
- `[requirement:uuid:9c345678-9abc-d8e9-f901-bacbdcedf015]` → `[test:uuid:test-dry-004-shifttab-comparison]` ❌
- `[requirement:uuid:9d456789-abcd-e9f0-123b-cbdcedf01234]` → `[test:uuid:test-prompt-001-nav-update]` ❌
- `[requirement:uuid:9d456789-abcd-e9f0-123b-cbdcedf01235]` → `[test:uuid:test-prompt-002-chain-consistency]` ❌
- `[requirement:uuid:9e56789a-bcde-f012-345c-dcedf0123456]` → `[test:uuid:test-recovery-001-corruption-resilience]` ❌

---

**Generated by:** TSRanger Comprehensive Test Automation  
**Command:** `node comprehensive-test-automation.js`  
**Test Matrix Source:** [Fresh Dawn Comprehensive Testing Matrix](../../../scrum.pmo/project.journal/2025-08-19-0800-fresh-dawn/comprehensive-testing-matrix.md)  

[Back to Test Directory](../test/) | [TSRanger v2.2](../README.md)
