# Commit & Push Point: Modern TypeScript, ES Modules, and Robust CLI Completion

## Summary
- Sprint 2 delivered TS Ranger UX improvements and prompt features
  - Fixed selected-row indentation across columns (padded cells before styling)
  - Anchored blue/white key footer at bottom; enforced one blank line above preview and one before footer
  - Added prompt to command preview: honors `$PS1` (`\h`, `\u`, `\w`), fallback `[hostname] user@pwd`
  - Prompt colorization: username cyan (red if root), path yellow
  - Resize-aware re-render to maintain layout
- Added scripted tests for spacing and ANSI colors; full suite green
- Replaced grid Preview column with Docs column and added JSDoc extraction in `TSCompletion`
- Enriched `TestClass` with JSDoc and added scripted tests asserting Docs rendering

## Commit Message Suggestion
```
feat(tsranger): Docs column, JSDoc extraction, footer anchoring, and prompt spacing/colors

- RangerView: pad cells pre-style; keep 1 blank line above preview and 1 before footer; anchor footer
- Prompt: support $PS1 (\h, \u, \w) with colors (user cyan/red if root; path yellow); fallback format
- Controller: resize re-render; scripted test mode final-frame support
- Docs: replace Preview column with Docs; wrap text and show contextual docs
- Completion: add getClassDoc/getMethodDoc/getParamDoc using TS AST JSDoc
- Tests: add TUI scripted tests for spacing, color, and Docs; all tests green
```

## Next Steps
- Push this commit to the repository
- Close Sprint 2 items 3.2 and 3.3; proceed to docs (Task 1.6) or next sprint planning

---

*Documented by GitHub Copilot, 2025-08-03*
