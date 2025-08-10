[Back to Planning](./planning.md)

# ranger (Python) TUI Behavior

This document captures the default behavior of the Python file manager `ranger` as experienced with stock configuration (no custom rc.conf). It is distinct from `TSRanger` in this repo.

## Layout (Miller columns)
- Three main columns by default:
  - Left: parent directories (breadcrumbs/history of ancestors)
  - Center: contents of the current directory
  - Right: preview of the selected entry (file content or directory info)
- Optional additional panes (tabs, status) depending on configuration.

## Navigation (Vim-like)
- j: move down
- k: move up
- h: go to parent directory
- l: enter directory or open file (respects file opener)
- H/L: history back/forward
- gg/G: jump to top/bottom
- ^U/^D: half-page up/down (if enabled)

## Selection and marking
- Space: toggle mark on selected file
- v: visual mode (select a range)
- V: toggle all
- uv: unmark all (via keychain: u then v)

## File operations
- yy: yank (copy) selection to buffer
- dd: cut selection to buffer
- pp: paste buffer into current directory
- dD: delete selection (with confirmation)
- cw: rename selected file (change word)
- a: create (file) / A: create directory (depending on prompts/config)
- zr/zm: adjust preview folds (where applicable)

## Search, filter, sort
- /: search (incremental); n/N navigate results
- f: jump to character within column (keychain-based quick select)
- o: sort options menu (choose by key)
- zr/zm: zoom preview/folds (varies with preview plugin)
- zh/zl: hide/show hidden files (depending on mappings)

## Tabs and bookmarks
- Ctrl+n: new tab
- Ctrl+w: close tab
- gt/gT: next/prev tab
- m<letter>: set bookmark for current directory
- '<letter>: jump to bookmark
- ``: jump to previous directory

## Preview and external open
- Right column previews text/images (with scope.sh) and metadata; toggles via `zp` or `i` depending on config
- Enter or l: opens files; external opener determined by `rifle` rules

## Misc
- : enters command mode (colon-commands)
- R: reload directory
- q: quit; ZZ: save and quit

Note: Exact keys can vary slightly by version/distribution; above reflects typical defaults documented in ranger man/cheatsheets.