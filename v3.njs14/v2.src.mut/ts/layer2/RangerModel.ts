import { TSCompletion } from '../layer4/TSCompletion';

export class RangerModel {
  classes: string[] = [];
  methods: string[] = [];
  params: string[] = [];
  docs: string[] = [];

  selectedColumn: 0 | 1 | 2 | 3 = 0; // 0: Classes, 1: Methods, 2: Params, 3: Preview
  selectedIndexPerColumn: number[] = [0, 0, 0, 0];

  filters: string[] = ['', '', '', ''];
  paramValues: string[] = [];
  paramEntryActive: boolean = false;
  paramEntryIndex: number = 0;
  paramEntryBuffer: string = '';

  // Prompt editor state (Task 7)
  promptEditActive: boolean = true;
  promptBuffer: string = '';
  promptCursorIndex: number = 0;
  // When true, do not derive Methods filter from prompt's method token (e.g., after auto-inserting first method)
  suppressMethodFilter: boolean = false;

  get selectedClass(): string | undefined {
    return this.filteredClasses()[this.selectedIndexPerColumn[0]];
  }

  get selectedMethod(): string | undefined {
    return this.filteredMethods()[this.selectedIndexPerColumn[1]];
  }

  get selectedParam(): string | undefined {
    return this.filteredParams()[this.selectedIndexPerColumn[2]];
  }

  filteredClasses(): string[] {
    const f = this.filters[0];
    if (!f) return this.classes;
    return this.classes.filter(c => c.toLowerCase().startsWith(f.toLowerCase()));
  }

  filteredMethods(): string[] {
    const f = this.filters[1];
    if (!f) return this.methods;
    return this.methods.filter(m => m.toLowerCase().startsWith(f.toLowerCase()));
  }

  filteredParams(): string[] {
    const f = this.filters[2];
    if (!f) return this.params;
    return this.params.filter(p => p.toLowerCase().startsWith(f.toLowerCase()));
  }

  buildCommandParts(): string[] {
    const parts: string[] = [];
    const c = this.selectedClass;
    const m = this.selectedMethod;
    if (c) parts.push(c);
    if (m) parts.push(m);
    // Use entered parameter values (progressively) for preview/execution
    if (c && m && this.paramValues.length > 0) {
      for (let i = 0; i < this.paramValues.length; i++) {
        const val = this.paramValues[i] ?? '';
        if (val && val.length > 0) parts.push(val);
      }
      // While actively entering a value, show the buffer as the next token
      if (this.paramEntryActive && this.paramEntryBuffer.length > 0) {
        parts.push(this.paramEntryBuffer);
      }
    }
    return parts;
  }

  updateMethods(): void {
    const c = this.selectedClass;
    this.methods = c ? TSCompletion.getClassMethods(c) : [];
    this.selectedIndexPerColumn[1] = 0;
    this.filters[1] = '';
    // Method list changed; params will be recomputed, so clear param state
    this.params = [];
    this.docs = [];
    this.paramValues = [];
    this.paramEntryActive = false;
    this.paramEntryIndex = 0;
    this.paramEntryBuffer = '';
  }

  updateParams(): void {
    const c = this.selectedClass;
    const m = this.selectedMethod;
    this.params = c && m ? TSCompletion.getMethodParameters(c, m) : [];
    this.selectedIndexPerColumn[2] = 0;
    this.filters[2] = '';
    // Prepare param values for sequential entry according to discovered params
    this.paramValues = new Array(this.params.length).fill('');
    this.paramEntryActive = false;
    this.paramEntryIndex = 0;
    this.paramEntryBuffer = '';
  }

  getSelectedDocs(): string {
    const c = this.selectedClass;
    const m = this.selectedMethod;
    const p = this.selectedParam;
    switch (this.selectedColumn) {
      case 2:
        if (c && m && p) return TSCompletion.getParamDoc(c, m, p);
        // fallback to method
        if (c && m) return TSCompletion.getMethodDoc(c, m);
        if (c) return TSCompletion.getClassDoc(c);
        return '';
      case 1:
        if (c && m) return TSCompletion.getMethodDoc(c, m);
        if (c) return TSCompletion.getClassDoc(c);
        return '';
      case 0:
        if (c) return TSCompletion.getClassDoc(c);
        return '';
      default:
        if (c && m && p) return TSCompletion.getParamDoc(c, m, p);
        if (c && m) return TSCompletion.getMethodDoc(c, m);
        if (c) return TSCompletion.getClassDoc(c);
        return '';
    }
  }

  deriveFiltersFromPrompt(): void {
    // Tokens: [classToken, methodToken, ...ignored]
    const tokens = this.promptBuffer.split(/\s+/);
    const classToken = tokens[0] ?? '';
    const methodToken = tokens[1] ?? '';
    this.filters[0] = classToken;
    // Prefer exact match class selection if present
    this.selectedIndexPerColumn[0] = 0;
    // Update methods based on class filter impact
    this.classes = TSCompletion.getClasses();
    const filteredClasses = this.filteredClasses();
    // Snap selection to exact class match if unique
    const exactClassIdx = filteredClasses.findIndex(c => c === classToken);
    if (exactClassIdx >= 0) {
      this.selectedIndexPerColumn[0] = exactClassIdx;
    }
    this.updateMethods();
    // Apply method filter only when not suppressed
    this.filters[1] = this.suppressMethodFilter ? '' : methodToken;
    // If a method token exists and corresponds to an available method, snap selection to it
    const methodsNow = this.filteredMethods();
    if (!this.suppressMethodFilter && methodToken) {
      const exactMethodIdx = methodsNow.findIndex(m => m === methodToken);
      this.selectedIndexPerColumn[1] = exactMethodIdx >= 0 ? exactMethodIdx : 0;
    } else {
      this.selectedIndexPerColumn[1] = 0;
    }
    this.updateParams();
  }

  getCurrentPromptTokenIndex(): number {
    // Determine which token the cursor is currently editing
    const left = this.promptBuffer.slice(0, this.promptCursorIndex);
    return left.split(/\s+/).length - 1;
  }

  allParamsFilled(): boolean {
    if (!this.params || this.params.length === 0) return true;
    return this.paramValues.length === this.params.length && this.paramValues.every(v => v !== '');
  }
}