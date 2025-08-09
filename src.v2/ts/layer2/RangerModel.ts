import { TSCompletion } from '../../../src/ts/layer4/TSCompletion.ts';

export class RangerModel {
  classes: string[] = [];
  methods: string[] = [];
  params: string[] = [];
  docs: string[] = [];

  selectedColumn: 0 | 1 | 2 | 3 = 0;
  selectedIndexPerColumn: [number, number, number, number] = [0, 0, 0, 0];
  filters: [string, string, string, string] = ['', '', '', ''];

  paramValues: string[] = [];
  paramEntryActive: boolean = false;
  paramEntryIndex: number = 0;
  paramEntryBuffer: string = '';

  promptEditActive: boolean = true;
  promptBuffer: string = '';
  promptCursorIndex: number = 0;
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
    const all = this.classes;
    return f ? all.filter(c => c.toLowerCase().startsWith(f.toLowerCase())) : all;
  }
  filteredMethods(): string[] {
    const f = this.filters[1];
    const all = this.methods;
    return f ? all.filter(m => m.toLowerCase().startsWith(f.toLowerCase())) : all;
  }
  filteredParams(): string[] {
    const f = this.filters[2];
    const all = this.params;
    return f ? all.filter(p => p.toLowerCase().startsWith(f.toLowerCase())) : all;
  }

  buildCommandParts(): string[] {
    const parts: string[] = [];
    const c = this.selectedClass;
    const m = this.selectedMethod;
    if (c) parts.push(c);
    if (m) parts.push(m);
    if (c && m && this.paramValues.length > 0) {
      for (let i = 0; i < this.paramValues.length; i++) {
        const val = this.paramValues[i] ?? '';
        if (val && val.length > 0) parts.push(val);
      }
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
    const tokens = this.promptBuffer.split(/\s+/);
    const classToken = tokens[0] ?? '';
    const methodToken = tokens[1] ?? '';
    this.filters[0] = classToken;
    this.selectedIndexPerColumn[0] = 0;
    this.classes = TSCompletion.getClasses();
    const filteredClasses = this.filteredClasses();
    const exactClassIdx = filteredClasses.findIndex(c => c === classToken);
    if (exactClassIdx >= 0) {
      this.selectedIndexPerColumn[0] = exactClassIdx;
    }
    this.updateMethods();
    this.filters[1] = this.suppressMethodFilter ? '' : methodToken;
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
    const left = this.promptBuffer.slice(0, this.promptCursorIndex);
    return left.split(/\s+/).length - 1;
  }

  allParamsFilled(): boolean {
    if (!this.params || this.params.length === 0) return true;
    return this.paramValues.length === this.params.length && this.paramValues.every(v => v !== '');
  }
}