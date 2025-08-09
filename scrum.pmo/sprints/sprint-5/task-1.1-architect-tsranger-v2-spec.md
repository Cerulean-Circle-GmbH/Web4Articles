[Back to Planning Sprint 5](./planning.md)

# Task 1.1 — Architect: MVC, IO Abstractions, and State Model

## Status
- Planned

## Traceability
- Up: [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b], [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f], [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80], [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091], [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Deliverables
- Interface definitions for:
  - `RangerModelV2`: lists, filters, selection, params, docs, prompt buffer, cursor index, flags (e.g., `suppressMethodFilter`).
  - `RangerViewV2`: pure renderer from `Model` to text frames; no direct process I/O.
  - `RangerControllerV2`: input handler state machine that mutates `Model` and requests renders.
  - `TerminalIO`: abstraction for stdin/stdout, width/height, resize events; provide a `DeterministicTestIO` adapter for tests.
- State machine specs:
  - Navigation across columns; selection updates; column change rules.
  - Prompt edit mode: token index detection, cursor movement, backspace semantics at token boundaries.
  - Param entry mode: buffer commit, advancement, exit conditions.
- Rendering spec:
  - Grid layout with column widths; padding-before-styling rule; color codes per column titles.
  - Preview line structure: `prompt` + `command buffer` with inverse cursor.
  - Footer: content, colors, width fill, bottom anchoring via top padding.

## Acceptance Criteria
- All interfaces and state diagrams are documented and unambiguous.
- Includes pseudocode for key handlers: Up/Down/Left/Right/Tab/Enter/Space/Backspace/Esc.
- Specifies behavior for resize re-render.
- Clearly separates IO from rendering to enable deterministic tests.

## Specification

### Interfaces (TypeScript)
```ts
export interface TerminalIO {
  readonly columns: number;
  readonly rows: number;
  onResize(handler: () => void): void;
  write(text: string): void;
  clear(): void; // optional convenience for \x1b[2J\x1b[H
}

export interface RangerModelV2 {
  classes: string[];
  methods: string[];
  params: string[];
  docs: string[];

  selectedColumn: 0 | 1 | 2 | 3;
  selectedIndexPerColumn: [number, number, number, number];
  filters: [string, string, string, string];

  // Param entry
  paramValues: string[];
  paramEntryActive: boolean;
  paramEntryIndex: number;
  paramEntryBuffer: string;

  // Prompt editing
  promptEditActive: boolean;
  promptBuffer: string;
  promptCursorIndex: number;
  suppressMethodFilter: boolean;

  readonly selectedClass?: string;
  readonly selectedMethod?: string;
  readonly selectedParam?: string;

  filteredClasses(): string[];
  filteredMethods(): string[];
  filteredParams(): string[];
  updateMethods(): void;
  updateParams(): void;
  buildCommandParts(): string[];
  getSelectedDocs(): string;
  deriveFiltersFromPrompt(): void;
  getCurrentPromptTokenIndex(): number;
  allParamsFilled(): boolean;
}

export interface RangerViewV2 {
  render(model: RangerModelV2, io: TerminalIO): void;
}

export interface RangerControllerV2 {
  run(): Promise<void>;
}
```

### IO Implementations
- NodeProcessIO: wraps process.stdin/stdout, `columns`, `rows`, resize event, writes.
- DeterministicTestIO: fixed `columns`/`rows` from env (e.g., `TSRANGER_TEST_COLUMNS`, `TSRANGER_TEST_ROWS`), collects output frames for assertions.

### Rendering Rules
- Four columns [Classes, Methods, Params, Docs]; width = floor(total/4), min 16.
- Pad cells to width before applying ANSI; headers show filter in parentheses when non-empty.
- Frame composition: grid, topPad to push footer to last row, 1 blank line, prompt+buffer with inverse cursor, 1 blank line, footer (blue bg, white bold).

### Prompt Construction
- Prompt uses `$PS1` with `\\u`, `\\h`, `\\w` escapes; user cyan (36) or root red (31); path yellow (33). Fallback: `[host] user@pwd`.
- Inverse-cursor renders over current char, or over a space if at EOL.

### Key Handling Pseudocode
```ts
onKey(key) {
  if (key in ['\u0003','\u001b','q']) return exit();
  if (model.paramEntryActive) return handleParamEntry(key);
  switch (key) {
    case '\r': return onEnter();
    case '\u001b[A': return moveSelection(-1);
    case '\u001b[B': return moveSelection(+1);
    case '\u001b[D': return changeColumn(-1);
    case '\u001b[C':
    case '\t':
      return handleRightOrTab();
    case '\x7f':
      if (!model.promptEditActive) return backspaceFilter();
      return backspacePrompt();
    default:
      if (isPrintable(key)) return insertPrintable(key);
  }
}
```

- Right/Tab: if current prompt token is empty, just `changeColumn(+1)`; else perform shell-like completion respecting class/method token, suppress method filter when auto-inserting first method, update cursor to method start.
- Up/Down while editing Methods: sync prompt to `Class method`, keep cursor at method start; do not set Methods filter unless user types.

### Resize
- On `io.onResize`, re-render current frame with new `columns`/`rows` preserving state.

## Rationale
This design separates IO from rendering and control, enabling deterministic scripted tests and future portability.