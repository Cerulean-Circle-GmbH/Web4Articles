[Back to Planning](./planning.md)

# Requirements — ranger (Python file manager)

This requirements document describes the default ranger TUI behavior for analysis and testing. Not to be confused with `TSRanger`.

## Functional Requirements
- FR1: Miller-columns layout shows parent, current directory, and preview panes.
- FR2: Vim-like keybindings for navigation: h, j, k, l; history H/L; gg/G; optional half-page ^U/^D.
- FR3: Selection/marking: Space toggles marks, v visual selection, V toggle all, uv unmark all.
- FR4: File operations buffer: yy (copy), dd (cut), pp (paste), dD (delete), cw (rename), a/A (create).
- FR5: Search/filter/sort: `/` opens search, n/N cycle; `o` opens sort menu.
- FR6: Tabs/bookmarks: Ctrl+n new tab, Ctrl+w close tab, gt/gT switch tabs; m<letter> set bookmark; '<letter> jump.
- FR7: Preview integration: right pane previews files with scope; toggle preview via `i`/`zp`; open via Enter/l and rifle rules.
- FR8: Quit and reload: q to quit, ZZ save and quit, R reload.

## Non-Functional Requirements
- NFR1: Responsive navigation and file operations under typical directory sizes (<10k entries).
- NFR2: UTF-8 support for filenames; graceful handling of permission errors.
- NFR3: Configurable via `~/.config/ranger/` without breaking defaults.

## Acceptance Criteria
- AC1: Default keybindings perform the actions described in FR2–FR8 in a stock install.
- AC2: File operations reflect on-disk changes appropriately and update the UI.
- AC3: Search and sort operate on current directory contents and update selection and preview.
- AC4: Tabs and bookmarks persist during session and behave via documented keys.
- AC5: Preview pane displays supported formats and respects toggles.

## References
- `man ranger`, official docs, cheatsheets for default keybindings.