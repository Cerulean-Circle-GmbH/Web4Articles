[Back to Planning](./planning.md)

# Task 1.2: Developer - Implement TSsh.ts backend

## Goal
Create `src/ts/layer1/TSsh.ts` as the TypeScript backend for `tssh`, initially duplicating the logic of `OOSH.ts`.

## Steps
- Duplicate the CLI argument parsing and output logic from `OOSH.ts`.
- Add methods to print received arguments, project path, and unit path.
- Ensure all code is ESM-compliant and uses strict OOP (no functions outside classes).
- Prepare for Bash completion integration.

## Acceptance Criteria
- `TSsh.ts` prints arguments, project path, and unit path when called by `tssh`.
- Code is ESM-compliant, OOP, and documented.
