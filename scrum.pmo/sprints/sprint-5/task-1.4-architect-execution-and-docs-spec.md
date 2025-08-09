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

## Selection-to-Docs Priority
- If selectedColumn is Params and a param is selected: show Param doc; otherwise fall back to Method doc.
- If in Methods: show Method doc (fallback to Class).
- If in Classes: show Class doc.
- Default: prefer the most specific available.

## Docs Retrieval Pseudocode
```ts
function getSelectedDocs(model: RangerModelV2): string {
  const c = model.selectedClass, m = model.selectedMethod, p = model.selectedParam;
  switch (model.selectedColumn) {
    case 2: return p? TSCompletion.getParamDoc(c!, m!, p) : (m? TSCompletion.getMethodDoc(c!, m) : (c? TSCompletion.getClassDoc(c) : ''));
    case 1: return m? TSCompletion.getMethodDoc(c!, m) : (c? TSCompletion.getClassDoc(c) : '');
    case 0: return c? TSCompletion.getClassDoc(c) : '';
    default: return (p && c && m)? TSCompletion.getParamDoc(c, m, p) : (m && c? TSCompletion.getMethodDoc(c, m) : (c? TSCompletion.getClassDoc(c) : ''));
  }
}
```

## Execution Bridge Pseudocode
```ts
async function execute(parts: string[]) {
  if (parts.length < 2) return; // need class and method
  const [className, methodName, ...params] = parts;
  let mod;
  try { mod = await import(`../layer1/${className}.ts`); }
  catch (e1) {
    try { mod = await import(`../layer2/${className}.ts`); }
    catch (e2) { return logError(`Class import failed for ${className}: ${e1} | ${e2}`); }
  }
  const Ref = mod[className] || mod[className[0].toUpperCase() + className.slice(1)];
  if (!Ref) return logError(`Class ${className} not found in module`);
  if (typeof Ref[methodName] === 'function') {
    const result = Ref[methodName](...params);
    if (result && typeof result.then === 'function') await result;
    logInfo(`Executed ${className}.${methodName}(${params.join(', ')})`);
  } else if (typeof Ref['help'] === 'function') {
    Ref['help']();
  } else {
    logError(`Method ${methodName} not found on ${className}`);
  }
}
```

## Determinism for Tests
- Docs content contains no ANSI; wrapping is purely width-based; ensure predictable lines for assertions.