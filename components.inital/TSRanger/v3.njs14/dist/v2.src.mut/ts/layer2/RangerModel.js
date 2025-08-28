import { TSCompletion } from '../layer4/TSCompletion';
export class RangerModel {
    constructor() {
        this.classes = [];
        this.methods = [];
        this.params = [];
        this.docs = [];
        this.selectedColumn = 0; // 0: Classes, 1: Methods, 2: Params, 3: Preview
        this.selectedIndexPerColumn = [0, 0, 0, 0];
        this.filters = ['', '', '', ''];
        this.paramValues = [];
        this.paramEntryActive = false;
        this.paramEntryIndex = 0;
        this.paramEntryBuffer = '';
        // Prompt editor state (Task 7)
        this.promptEditActive = true;
        this.promptBuffer = '';
        this.promptCursorIndex = 0;
        // When true, do not derive Methods filter from prompt's method token (e.g., after auto-inserting first method)
        this.suppressMethodFilter = false;
    }
    get selectedClass() {
        return this.filteredClasses()[this.selectedIndexPerColumn[0]];
    }
    get selectedMethod() {
        return this.filteredMethods()[this.selectedIndexPerColumn[1]];
    }
    get selectedParam() {
        return this.filteredParams()[this.selectedIndexPerColumn[2]];
    }
    filteredClasses() {
        const f = this.filters[0];
        if (!f)
            return this.classes;
        return this.classes.filter(c => c.toLowerCase().startsWith(f.toLowerCase()));
    }
    filteredMethods() {
        const f = this.filters[1];
        if (!f)
            return this.methods;
        return this.methods.filter(m => m.toLowerCase().startsWith(f.toLowerCase()));
    }
    filteredParams() {
        const f = this.filters[2];
        if (!f)
            return this.params;
        return this.params.filter(p => p.toLowerCase().startsWith(f.toLowerCase()));
    }
    buildCommandParts() {
        var _a;
        const parts = [];
        const c = this.selectedClass;
        const m = this.selectedMethod;
        if (c)
            parts.push(c);
        if (m)
            parts.push(m);
        // Use entered parameter values (progressively) for preview/execution
        if (c && m && this.paramValues.length > 0) {
            for (let i = 0; i < this.paramValues.length; i++) {
                const val = (_a = this.paramValues[i]) !== null && _a !== void 0 ? _a : '';
                if (val && val.length > 0)
                    parts.push(val);
            }
            // While actively entering a value, show the buffer as the next token
            if (this.paramEntryActive && this.paramEntryBuffer.length > 0) {
                parts.push(this.paramEntryBuffer);
            }
        }
        return parts;
    }
    updateMethods() {
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
    updateParams() {
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
    getSelectedDocs() {
        const c = this.selectedClass;
        const m = this.selectedMethod;
        const p = this.selectedParam;
        switch (this.selectedColumn) {
            case 2:
                if (c && m && p)
                    return TSCompletion.getParamDoc(c, m, p);
                // fallback to method
                if (c && m)
                    return TSCompletion.getMethodDoc(c, m);
                if (c)
                    return TSCompletion.getClassDoc(c);
                return '';
            case 1:
                if (c && m)
                    return TSCompletion.getMethodDoc(c, m);
                if (c)
                    return TSCompletion.getClassDoc(c);
                return '';
            case 0:
                if (c)
                    return TSCompletion.getClassDoc(c);
                return '';
            default:
                if (c && m && p)
                    return TSCompletion.getParamDoc(c, m, p);
                if (c && m)
                    return TSCompletion.getMethodDoc(c, m);
                if (c)
                    return TSCompletion.getClassDoc(c);
                return '';
        }
    }
    deriveFiltersFromPrompt() {
        var _a, _b;
        // Tokens: [classToken, methodToken, ...ignored]
        const tokens = this.promptBuffer.split(/\s+/);
        const classToken = (_a = tokens[0]) !== null && _a !== void 0 ? _a : '';
        const methodToken = (_b = tokens[1]) !== null && _b !== void 0 ? _b : '';
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
        }
        else {
            this.selectedIndexPerColumn[1] = 0;
        }
        this.updateParams();
    }
    getCurrentPromptTokenIndex() {
        // Determine which token the cursor is currently editing
        const left = this.promptBuffer.slice(0, this.promptCursorIndex);
        return left.split(/\s+/).length - 1;
    }
    allParamsFilled() {
        if (!this.params || this.params.length === 0)
            return true;
        return this.paramValues.length === this.params.length && this.paramValues.every(v => v !== '');
    }
}
