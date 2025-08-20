# Global First Principles

- Occam's Razor: When multiple approaches exist, choose the simplest (or most naive) method that satisfies requirements; discard unnecessary complexity. Example: when creating files, a simple `printf` may be preferred over more complex agent orchestration.
- Quote stakeholder feedback verbatim with UTC timestamps and backlinks.
- Folders are contexts; do not cross contexts without explicit backlinks and rationale.
- No shared files between versions; migrate units per active version.
- DRY within a version; consolidate into single canonical units inside the version.
- Non-interactive, deterministic tests; respect environment toggles.
- ESM TypeScript, layered architecture, one class/interface per file.
