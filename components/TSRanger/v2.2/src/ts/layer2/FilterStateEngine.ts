// FilterStateEngine - Immutable filter operations to eliminate corruption
// Implements the architecture designed in TSRanger v2.1 sprint PDCAs

export interface FilterState {
  readonly filter: string;
  readonly timestamp: number;
  readonly isValid: boolean;
}

export class FilterResult {
  constructor(
    public readonly state: FilterState,
    public readonly filteredItems: string[]
  ) {}
}

export class FilterStateEngine {
  private state: FilterState;
  
  constructor(initialState?: FilterState) {
    this.state = initialState || {
      filter: '',
      timestamp: Date.now(),
      isValid: true
    };
  }
  
  // CRITICAL: Prevent [t][backspace][g] → "tg" corruption
  addCharacter(char: string): FilterResult {
    // Validate input character
    if (!char || char.length !== 1) {
      throw new Error('FilterStateEngine: Invalid character input');
    }
    
    // Create new state atomically
    const newState: FilterState = {
      filter: this.state.filter + char,
      timestamp: Date.now(),
      isValid: true
    };
    
    // Get filtered items based on new filter
    const filteredItems = this.getFilteredItems(newState.filter);
    
    this.state = newState;
    return new FilterResult(newState, filteredItems);
  }
  
  // CRITICAL: Safe backspace without residue accumulation
  removeCharacter(): FilterResult {
    // Handle empty filter case
    if (this.state.filter.length === 0) {
      return new FilterResult(this.state, this.getFilteredItems(''));
    }
    
    // Remove last character atomically
    const newFilter = this.state.filter.slice(0, -1);
    const newState: FilterState = {
      filter: newFilter,
      timestamp: Date.now(),
      isValid: true
    };
    
    // Get filtered items based on new filter
    const filteredItems = this.getFilteredItems(newFilter);
    
    this.state = newState;
    return new FilterResult(newState, filteredItems);
  }
  
  // CRITICAL: Complete state reset for recovery
  clearFilter(): FilterResult {
    const newState: FilterState = {
      filter: '',
      timestamp: Date.now(),
      isValid: true
    };
    
    this.state = newState;
    return new FilterResult(newState, this.getFilteredItems(''));
  }
  
  // State validation for corruption detection
  validateState(): boolean {
    return this.state.isValid && 
           typeof this.state.filter === 'string' &&
           this.state.timestamp > 0;
  }
  
  // Get current state (readonly)
  getCurrentState(): FilterState {
    return { ...this.state };
  }
  
  // Private method for filtering items - integrate with actual class list
  private getFilteredItems(filter: string): string[] {
    // Default class list - will be injected from RangerModel
    const allClasses = ['Logger', 'OOSH', 'ParameterParser', 'TSsh', 'DefaultCLI', 'GitScrumProject'];
    
    if (!filter) {
      return allClasses;
    }
    
    return allClasses.filter(className => 
      className.toLowerCase().startsWith(filter.toLowerCase())
    );
  }
  
  // Update class list (called by RangerModel)
  setClassList(classes: string[]): void {
    // This will be called to inject the actual class list
    // For now, keeping the default list in getFilteredItems
  }
}
