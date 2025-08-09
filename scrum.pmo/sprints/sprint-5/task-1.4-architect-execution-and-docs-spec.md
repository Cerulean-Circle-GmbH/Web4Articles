[Back to Planning Sprint 5](./planning.md)

# Task 1.4 — Architect: Docs Column, TSCompletion Integration, and Execution Bridge

## Status
- Planned

## Traceability
- Up: [requirement:uuid:60718293-a4b5-4f2a-3b4c-5d6e7f8091a2], [requirement:uuid:8293a4b5-c6d7-4f4c-5d6e-7f8091a2b3c4]

## Description
Define how TS Ranger v2 surfaces documentation and executes commands.

## Docs Column Spec
- Replace Preview with Docs column showing Class/Method/Param docs based on `selectedColumn` priority.
- Use TSCompletion for:
  - `getClasses`, `getClassMethods`, `getMethodParameters`
  - `getClassDoc`, `getMethodDoc`, `getParamDoc`
- Text wrapping rules within column width; no ANSI in docs content.

## Execution Bridge Spec
- Build parts from selected Class, Method, and entered Param values.
- Resolve modules from `layer1` then `layer2` namespaces; support static methods; fallback to `help` when method missing.
- Log execution; swallow promise resolution for async methods; error messages stable for tests.

## Acceptance Criteria
- Sequence diagrams for docs retrieval and command execution.
- Pseudocode for assembly of command parts and invocation.