[Back to Sprint 5 Planning](../scrum.pmo/sprints/sprint-5/planning.md)

# Versioned Units Policy

- Only use code within the active version folder (e.g., `src.v2/`). Do not import from previous versions (`src/ts/...`) or other version folders.
- If a required unit (file) is missing in the active version, migrate it into the version folder first, then reference it there. Do not reference outside the version.
- Each file is a unit; units are version-dependent. Keep one class/interface per file. Within a version, extract shared logic into dedicated units under that version.
- DRY: Avoid duplication across files. Consolidate behavior into a single unit inside the active version. Prefer migration over duplication from older versions.
- Prohibit cross-version imports. Enforce with CI/pre-commit checks (e.g., flag `../../../src/ts` references inside `src.v2`).
- Entry points and wrappers must route to the correct version (e.g., `TSRANGER_V2=1` → `src.v2/ts/layer4/TSRanger.ts`). Implementation code must not fall back to older-version modules at runtime.
- Documentation and tasks must link versioned units explicitly (e.g., `src.v2/ts/layer4/TSRanger.ts`) to avoid ambiguity.

## No Shared Files Between Versions

- Never share a physical file between versions (no symlinks, no external includes). If logic is needed in multiple versions, migrate or re-implement it within each version’s folder.
- If a unit must be reused, create a copy under the new version and make it canonical for that version. Do not reference the old file.

## Context Discipline

- Folders are contexts. Do not leave a folder’s context (sprint, version, role) without an explicit backlink and justification.
- When referencing outside a context, double-check necessity and add a clear link explaining why.

## Migration Steps (Summary)

1. Identify dependency in older version code.
2. Copy the unit into the active version folder, adjust imports to intra-version paths.
3. Refactor to remove any cross-version reference. Add tests if needed.
4. Update documentation/tasks to reference the new versioned path.


