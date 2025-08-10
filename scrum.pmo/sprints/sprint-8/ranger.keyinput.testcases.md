[Back to Planning](./planning.md)

# ranger Key Input Test Cases (Python ranger)

These cases assume default keybindings with no custom rc.conf.

## Navigation
- Case: `j` — Move down one entry
  - Expect: Selection index increments; preview updates accordingly
- Case: `k` — Move up one entry
- Case: `h` — Go to parent directory
  - Expect: Center column shows parent; right preview updates; history updated
- Case: `l` — Enter selected directory / open file
  - Expect: For directory: center shows its contents; For file: open via rifle
- Case: `H` / `L` — History back/forward

## Selection and marking
- Case: `Space` — Toggle mark on current item
- Case: `v` — Enter visual mode; with `j`/`k`, extend selection; `v` again exits
- Case: `V` — Toggle all
- Case: `uv` — Unmark all

## File ops buffer
- Case: `yy` then move to another directory `pp`
  - Expect: File copied to new location
- Case: `dd` then navigate `pp`
  - Expect: File moved to new location
- Case: `cw` — Rename: enter prompt, type new name, Enter to confirm
- Case: `dD` — Delete with confirmation

## Search and filter
- Case: `/term[Enter]` — Incremental search
  - Expect: Matches highlighted; `n`/`N` navigate
- Case: `o` — Sort options
  - Expect: Sort menu; choose `t` for type, `s` for size, etc.

## Tabs and bookmarks
- Case: `Ctrl+n` — New tab; `gt` next tab; `gT` previous tab
- Case: `mA` — Bookmark current directory as `A`; `\'A` jumps to bookmark
- Case: `` (backtick twice) — Jump to previous directory

## Preview toggles and openness
- Case: `i` or `zp` — Toggle preview pane behavior (depends on setup)
- Case: `Enter` on file — Open with rifle rule

## Quit and reload
- Case: `R` — Reload directory
- Case: `q` — Quit ranger; `ZZ` save and quit

Notes:
- Behavior may vary slightly by install; these reflect typical defaults.