/**
 * CLIModel Interface - Extends Model for CLI context
 * 
 * Web4 principle: Self-sufficient, FLAT model - no relationships, no nested objects
 * All completion context fields are at top level in the model
 * 
 * Pattern: components/Web4TSComponent/0.3.14.4/spec/completion-architecture-oop.md:19-59
 */

import { Model } from './Model.interface.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { User } from './User.interface.js';

export interface CLIModel extends Model {
  // uuid, name, origin, definition inherited from Model
  
  /**
   * CLI Model with embedded component instances (radical OOP)
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 2: Deleted deprecated fields
   */
  
  /**
   * Web4TSComponent instance (not componentClass reference!)
   * @pdca 2025-10-28-UTC-0934.pdca.md:1153 - Stores INSTANCE
   */
  component?: DefaultWeb4TSComponent;
  
  /**
   * User service instance
   * @pdca 2025-10-28-UTC-0934.pdca.md:1153 - Stores INSTANCE
   */
  user?: User;
  
  // Completion context - FLAT in model (no CompletionContext relationship!)
  // From bash environment
  completionCliName: string;           // e.g., "web4tscomponent"
  completionCompWords: string[];       // Full COMP_WORDS array from bash
  completionCompCword: number;         // Current word index from bash
  
  // Derived completion state (computed by TypeScript)
  completionCurrentWord: string;       // compWords[compCword]
  completionPreviousWord: string;      // compWords[compCword-1]
  completionCommand: string | null;    // Detected command (null if completing method)
  completionParameters: string[];      // Parameters provided so far
  completionParameterIndex: number;    // Which parameter (0-based)
  
  // "on" context (flat)
  completionOnComponent: string | null;   // Component from "on ComponentName version"
  completionOnVersion: string | null;     // Version from "on ComponentName version"
  
  // Chaining context
  completionChainedCommands: string[]; // Commands in chain
  
  // Completion state flags
  completionIsCompletingMethod: boolean;    // True if completing method name
  completionIsCompletingParameter: boolean; // True if completing parameter
}


