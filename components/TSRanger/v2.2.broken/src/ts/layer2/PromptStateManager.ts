// PromptStateManager - Centralized prompt updates to ensure consistency
// Implements the architecture designed in TSRanger v2.1 sprint PDCAs

export interface PromptState {
  readonly content: string;
  readonly cursorPosition: number;
  readonly mode: 'NAVIGATION' | 'ADVANCEMENT' | 'FILTER';
  readonly selectedClass: string | undefined;
  readonly selectedMethod: string | undefined;
  readonly timestamp: number;
  readonly isValid: boolean;
}

export class PromptResult {
  constructor(
    public readonly state: PromptState,
    public readonly displayContent: string,
    public readonly cursorPosition: number
  ) {}
}

export interface PromptUpdate {
  type: 'NAVIGATION' | 'ADVANCEMENT' | 'FILTER' | 'RETREAT';
  selectedClass?: string;
  selectedMethod?: string;
  filterContent?: string;
  cursorPosition?: number;
}

export class PromptStateManager {
  private state: PromptState;
  
  constructor(initialState?: PromptState) {
    this.state = initialState || {
      content: '',
      cursorPosition: 0,
      mode: 'NAVIGATION',
      selectedClass: undefined,
      selectedMethod: undefined,
      timestamp: Date.now(),
      isValid: true
    };
  }
  
  // CRITICAL: Fix "prompt line not always updated as expected after navigation"
  updatePrompt(update: PromptUpdate): PromptResult {
    const newState = this.applyUpdate(this.state, update);
    
    if (!this.validatePromptState(newState)) {
      throw new Error('PromptStateManager: Invalid prompt state transition');
    }
    
    this.state = newState;
    
    // Generate display content and cursor position
    const { displayContent, cursorPosition } = this.generateDisplay(newState);
    
    return new PromptResult(newState, displayContent, cursorPosition);
  }
  
  // Navigation always updates prompt correctly
  updateForNavigation(selectedClass: string): PromptResult {
    return this.updatePrompt({
      type: 'NAVIGATION',
      selectedClass: selectedClass,
      selectedMethod: undefined,
      cursorPosition: 0
    });
  }
  
  // Advancement updates prompt with method
  updateForAdvancement(selectedClass: string, selectedMethod: string): PromptResult {
    return this.updatePrompt({
      type: 'ADVANCEMENT',
      selectedClass: selectedClass,
      selectedMethod: selectedMethod,
      cursorPosition: selectedClass.length + 1 // Position cursor on method
    });
  }
  
  // Filter updates prompt with suggestion
  updateForFilter(filterContent: string, suggestion: string): PromptResult {
    return this.updatePrompt({
      type: 'FILTER',
      selectedClass: suggestion,
      filterContent: filterContent,
      cursorPosition: filterContent.length
    });
  }
  
  // Retreat removes method/filter content
  updateForRetreat(selectedClass: string): PromptResult {
    return this.updatePrompt({
      type: 'RETREAT',
      selectedClass: selectedClass,
      selectedMethod: undefined,
      cursorPosition: 0
    });
  }
  
  // Private: Apply update to create new state
  private applyUpdate(currentState: PromptState, update: PromptUpdate): PromptState {
    switch (update.type) {
      case 'NAVIGATION':
        return {
          ...currentState,
          content: update.selectedClass || '',
          mode: 'NAVIGATION',
          selectedClass: update.selectedClass,
          selectedMethod: undefined,
          cursorPosition: 0,
          timestamp: Date.now()
        };
        
      case 'ADVANCEMENT':
        const advancementContent = update.selectedMethod 
          ? `${update.selectedClass} ${update.selectedMethod}`
          : update.selectedClass || '';
        return {
          ...currentState,
          content: advancementContent,
          mode: 'ADVANCEMENT',
          selectedClass: update.selectedClass,
          selectedMethod: update.selectedMethod,
          cursorPosition: update.cursorPosition || advancementContent.length,
          timestamp: Date.now()
        };
        
      case 'FILTER':
        return {
          ...currentState,
          content: update.selectedClass || update.filterContent || '',
          mode: 'FILTER',
          selectedClass: update.selectedClass,
          selectedMethod: undefined,
          cursorPosition: update.cursorPosition || 0,
          timestamp: Date.now()
        };
        
      case 'RETREAT':
        return {
          ...currentState,
          content: update.selectedClass || '',
          mode: 'NAVIGATION',
          selectedClass: update.selectedClass,
          selectedMethod: undefined,
          cursorPosition: 0,
          timestamp: Date.now()
        };
        
      default:
        return currentState;
    }
  }
  
  // Private: Validate prompt state integrity
  private validatePromptState(state: PromptState): boolean {
    // Basic validation
    if (!state || typeof state.content !== 'string') {
      return false;
    }
    
    // Mode-specific validation
    switch (state.mode) {
      case 'NAVIGATION':
        // Navigation mode should have class but no method
        return !!state.selectedClass && !state.selectedMethod;
        
      case 'ADVANCEMENT':
        // Advancement mode should have both class and method
        return !!state.selectedClass && !!state.selectedMethod;
        
      case 'FILTER':
        // Filter mode should have class (suggestion)
        return !!state.selectedClass;
        
      default:
        return false;
    }
  }
  
  // Private: Generate display content with proper formatting
  private generateDisplay(state: PromptState): { displayContent: string; cursorPosition: number } {
    let displayContent: string;
    let cursorPosition: number;
    
    switch (state.mode) {
      case 'NAVIGATION':
        displayContent = state.selectedClass || '';
        cursorPosition = 0; // Cursor at start for navigation
        break;
        
      case 'ADVANCEMENT':
        displayContent = state.selectedMethod 
          ? `${state.selectedClass} ${state.selectedMethod}`
          : state.selectedClass || '';
        cursorPosition = state.selectedClass ? state.selectedClass.length + 1 : 0; // Cursor on method
        break;
        
      case 'FILTER':
        displayContent = state.selectedClass || '';
        cursorPosition = state.cursorPosition;
        break;
        
      default:
        displayContent = state.content;
        cursorPosition = state.cursorPosition;
    }
    
    return { displayContent, cursorPosition };
  }
  
  // Get current state (readonly)
  getCurrentState(): PromptState {
    return { ...this.state };
  }
  
  // Validate current state
  validateCurrentState(): boolean {
    return this.validatePromptState(this.state);
  }
}
