// SharedKeyOperations - DRY/OOP compliance for paired key behaviors
// Implements the architecture designed in TSRanger v2.1 sprint PDCAs

import { RangerModel } from '../layer2/RangerModel';
import { RangerView } from '../layer5/RangerView';
import { PromptStateManager, PromptResult } from '../layer2/PromptStateManager';
import { FilterStateEngine } from '../layer2/FilterStateEngine';

export interface OperationResult {
  type: 'NAVIGATION' | 'ADVANCEMENT' | 'RETREAT' | 'FILTER';
  selectedClass?: string;
  selectedMethod?: string;
  success: boolean;
}

export abstract class SharedKeyOperation {
  protected model: RangerModel;
  protected view: RangerView;
  protected promptManager: PromptStateManager;
  protected filterEngine: FilterStateEngine;
  
  constructor(
    model: RangerModel, 
    view: RangerView, 
    promptManager: PromptStateManager,
    filterEngine: FilterStateEngine
  ) {
    this.model = model;
    this.view = view;
    this.promptManager = promptManager;
    this.filterEngine = filterEngine;
  }
  
  // Abstract method that each operation must implement
  abstract execute(): OperationResult;
  
  // Final method ensures consistent execution pattern
  performOperation(): void {
    try {
      // Execute the specific operation
      const result = this.execute();
      
      // Update state based on result
      this.updateModelState(result);
      
      // Update prompt through PromptStateManager
      this.updatePrompt(result);
      
      // Render updated state
      this.view.render(this.model);
      
    } catch (error) {
      console.error('SharedKeyOperation failed:', error);
      this.handleError();
    }
  }
  
  // Protected: Update model state
  protected updateModelState(result: OperationResult): void {
    if (result.selectedClass) {
      // This will need to be implemented based on RangerModel interface
      // For now, assuming these methods exist or will be added
    }
    if (result.selectedMethod) {
      // This will need to be implemented based on RangerModel interface
    }
  }
  
  // Protected: Update prompt via PromptStateManager
  protected updatePrompt(result: OperationResult): void {
    let promptResult: PromptResult;
    
    switch (result.type) {
      case 'NAVIGATION':
        promptResult = this.promptManager.updateForNavigation(result.selectedClass || '');
        break;
      case 'ADVANCEMENT':
        promptResult = this.promptManager.updateForAdvancement(
          result.selectedClass || '', 
          result.selectedMethod || ''
        );
        break;
      case 'RETREAT':
        promptResult = this.promptManager.updateForRetreat(result.selectedClass || '');
        break;
      default:
        return;
    }
    
    // Update model with prompt result
    // This will need to be implemented based on RangerModel interface
  }
  
  // Protected: Error handling
  protected handleError(): void {
    // Reset to safe state
    const selectedClass = this.model.selectedClass || '';
    const resetResult = this.promptManager.updateForNavigation(selectedClass);
    // Update model with reset result
    this.view.render(this.model);
  }
}

// DRY Implementation: Tab and Right use identical logic
export class TabRightAdvancement extends SharedKeyOperation {
  execute(): OperationResult {
    const currentClass = this.model.selectedClass;
    // Get first method for the current class
    const currentMethod = this.getFirstMethodForClass(currentClass);
    
    if (!currentClass || !currentMethod) {
      return { type: 'ADVANCEMENT', success: false };
    }
    
    return {
      type: 'ADVANCEMENT',
      selectedClass: currentClass,
      selectedMethod: currentMethod,
      success: true
    };
  }
  
  private getFirstMethodForClass(className: string | undefined): string | undefined {
    if (!className) return undefined;
    
    // This will need to be implemented based on how methods are stored in RangerModel
    // For now, using simple mapping
    const methodMap: Record<string, string> = {
      'Logger': 'log',
      'OOSH': 'start',
      'ParameterParser': 'parse',
      'TSsh': 'execute',
      'DefaultCLI': 'run',
      'GitScrumProject': 'start'
    };
    
    return methodMap[className];
  }
}

// DRY Implementation: Left and ShiftTab use identical logic  
export class LeftShiftTabRetreat extends SharedKeyOperation {
  execute(): OperationResult {
    const currentClass = this.model.selectedClass;
    
    if (!currentClass) {
      return { type: 'RETREAT', success: false };
    }
    
    return {
      type: 'RETREAT',
      selectedClass: currentClass,
      selectedMethod: undefined,
      success: true
    };
  }
}

// Navigation operations (up/down arrows)
export class NavigationOperation extends SharedKeyOperation {
  private direction: number;
  
  constructor(
    model: RangerModel, 
    view: RangerView, 
    promptManager: PromptStateManager,
    filterEngine: FilterStateEngine,
    direction: number // -1 for up, 1 for down
  ) {
    super(model, view, promptManager, filterEngine);
    this.direction = direction;
  }
  
  execute(): OperationResult {
    // Move selection in the specified direction
    // This will need to be implemented based on RangerModel interface
    const currentClass = this.model.selectedClass;
    
    if (!currentClass) {
      return { type: 'NAVIGATION', success: false };
    }
    
    return {
      type: 'NAVIGATION',
      selectedClass: currentClass,
      success: true
    };
  }
}
