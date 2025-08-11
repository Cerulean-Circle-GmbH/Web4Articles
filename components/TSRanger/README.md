# TSRanger Component

Scope:
- TUI model/view/controller
- Completion adapter and view rendering
- Shell wrappers and test harness

Repository:
- This folder will be a Git submodule in production (`components/TSRanger`).
- Version branches: `main`, `n14.4`, `njs14`.

Integration:
- Root-level scripts delegate to this component’s entry points.
- Tests at root can shell out to component CLIs.