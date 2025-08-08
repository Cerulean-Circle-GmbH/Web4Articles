import { TSCompletion } from './TSCompletion.ts';

export class RangerModel {
  classes: string[] = [];
  methods: string[] = [];
  params: string[] = [];

  selectedColumn: 0 | 1 | 2 | 3 = 0; // 0: Classes, 1: Methods, 2: Params, 3: Preview
  selectedIndexPerColumn: number[] = [0, 0, 0, 0];

  filters: string[] = ['', '', '', ''];

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
    // Params: use filter as current token if present, else selected item
    const currentParamToken = this.filters[2];
    if (c && m) {
      if (currentParamToken) {
        // Try default value completion for token
        const defaultVals = TSCompletion.getMethodParameters(c, m, currentParamToken);
        if (defaultVals.length > 0) {
          parts.push(defaultVals[0]);
        } else {
          parts.push(currentParamToken);
        }
      } else {
        const p = this.selectedParam;
        if (p) parts.push(p);
      }
    }
    return parts;
  }

  updateMethods(): void {
    const c = this.selectedClass;
    this.methods = c ? TSCompletion.getClassMethods(c) : [];
    this.selectedIndexPerColumn[1] = 0;
    this.filters[1] = '';
  }

  updateParams(): void {
    const c = this.selectedClass;
    const m = this.selectedMethod;
    this.params = c && m ? TSCompletion.getMethodParameters(c, m) : [];
    this.selectedIndexPerColumn[2] = 0;
    this.filters[2] = '';
  }
}