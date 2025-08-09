[Back to Versioned Units Policy](../docs/versioned-units.md)

# test.v2

- This folder is reserved for version-scoped tests for v2.
- Tests here must only exercise src.v2/* code paths (e.g., via wrapper with TSRANGER_V2=1).
- Keep test inputs/UX identical to v1 where possible; use environment toggles for routing.
