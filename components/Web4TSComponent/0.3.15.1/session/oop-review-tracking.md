<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# OOP Completion Architecture - Review Tracking

**Purpose:** Track files and concepts to review to understand existing OOP architecture before adding functional patches

---

## Review Checklist

| **#** | **File/Concept** | **Purpose** | **Questions to Answer** | **Status** |
|-------|------------------|-------------|-------------------------|------------|
| 1 | `layer3/Model.interface.ts` | Base model pattern | How do models store state? What's the model pattern? | ⏳ TODO |
| 2 | `layer3/Web4TSComponentModel.interface.ts` | Component model | What does component model track? What's in model already? | ⏳ TODO |
| 3 | `layer3/CLI.interface.ts` | CLI interface | What should CLI track? Is there a CLI model? | ⏳ TODO |
| 4 | `layer2/DefaultCLI.ts` lines 17-30 | CLI constructor and properties | What does CLI already store? componentClass, methodSignatures, etc. | ⏳ TODO |
| 5 | `layer2/DefaultCLI.ts` `completeParameter` | Existing completion method | How does completion already work? What context does it have? | ⏳ TODO |
| 6 | `layer2/DefaultCLI.ts` `getContext` | Context detection | How does "on" context work? How is it detected? | ⏳ TODO |
| 7 | `layer5/Web4TSComponentCLI.ts` `executeDynamicCommandWithChaining` | Command chaining | How does chaining work? How are remaining args tracked? | ⏳ TODO |
| 8 | `layer2/DefaultWeb4TSComponent.ts` `getComponentContext` | Component context | What context information exists? How is it used? | ⏳ TODO |
| 9 | `source.env` `_web4_generic_completion` | Bash completion flow | What does bash pass to TypeScript? COMP_WORDS, COMP_CWORD? | ⏳ TODO |
| 10 | `layer4/TSCompletion.ts` | AST introspection | How are callbacks discovered? How are parameters extracted? | ⏳ TODO |

---

## Functional Garbage to Remove (Occam's Razor)

| **#** | **Method** | **File** | **Problem** | **OOP Solution** | **Status** |
|-------|------------|----------|-------------|------------------|------------|
| 1 | `getCallbackValues()` | Web4TSComponentCLI.ts:264 | Duplicates existing callback execution logic | Use model to track current command, call callback through existing `completeParameter` | ⏳ TODO |
| 2 | Parameter validation loop | Web4TSComponentCLI.ts:149-173 | Functional validation instead of model-driven | CompletionContext model should know what's valid | ⏳ TODO |
| 3 | Callback detection in validation | Web4TSComponentCLI.ts:154-171 | Checks callbacks during validation | Model should expose `isValidParameterValue()` method | ⏳ TODO |

---

## OOP Architecture Questions

### 1. Where should completion context live?

**Current:** No completion context model  
**Problem:** TypeScript doesn't know:
- Are we completing methods or parameters?
- What command is being completed?
- What's the "on" context?
- What parameters are already provided?
- Is this chained completion?

**Proposed:** `CompletionContext` model

### 2. Who should own completion logic?

**Current:** Mixed between DefaultCLI, Web4TSComponentCLI, bash  
**Problem:** Bash knows COMP_CWORD, TypeScript doesn't. Logic is split.  
**Proposed:** DefaultCLI with CompletionContext model passed from bash

### 3. How should callbacks be invoked?

**Current:** `completeParameter` method exists  
**Problem:** I added `getCallbackValues` instead of using existing method  
**Proposed:** Use existing `completeParameter`, don't duplicate

### 4. How should parameter validation work?

**Current:** Manual loop checking callbacks  
**Problem:** Functional, not model-driven  
**Proposed:** Model exposes `getValidValues(paramIndex)` using existing callbacks

---

## Key OOP Principles Violated

1. **Model-Driven:** Added functions instead of model properties
2. **DRY:** Duplicated callback invocation logic
3. **Context Awareness:** Didn't use existing context detection
4. **Chaining Awareness:** Didn't respect command chaining model

---

## Next Steps

1. Read all files in review checklist
2. Answer all questions
3. Design CompletionContext model
4. Remove functional garbage
5. Implement OOP solution

