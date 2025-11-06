/**
 * CLIModel Interface - Extends Model for CLI context
 * 
 * Web4 principle: Self-sufficient, FLAT model - no relationships, no nested objects
 * All completion context fields are at top level in the model
 * 
 * Pattern: components/Web4TSComponent/0.3.14.4/spec/completion-architecture-oop.md:19-59
 */

import { Model } from './Model.interface.js';

export interface CLIModel extends Model {
  // uuid, name, origin, definition inherited from Model
  
  /**
   * CLI Model - DATA ONLY (no instances!)
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 2: Deleted deprecated fields
   * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md - Removed instances (component, context, user)
   */
  
  // ✅ Path Authority - Project-level absolute paths (CLI's sole responsibility)
  // Applied to ALL CLIs through inheritance: Web4TSComponentCLI, TestIsolatedComponentCLI, PDCACLI, etc.
  // @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority architecture
  // @pdca 2025-10-28-UTC-0934.pdca.md:207-218 - Original design
  projectRoot: string;              // e.g., /Users/.../Web4Articles (or test/data in test isolation)
  componentsDir: string;            // e.g., projectRoot/components
  scriptsDir: string;               // e.g., projectRoot/scripts  
  scriptsVersionDir: string;        // e.g., projectRoot/scripts/versions
  testDataDir: string;              // e.g., projectRoot/test/data
  
  // ❌ DELETED: component, context, user moved to DefaultCLI instance variables
  // Models = DATA ONLY (strings, numbers, booleans, arrays)
  // Instances = BEHAVIOR (belong in class, not model!)
  // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
  
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
  
  // Chaining context
  completionChainedCommands: string[]; // Commands in chain
  
  // Completion state flags
  completionIsCompletingMethod: boolean;    // True if completing method name
  completionIsCompletingParameter: boolean; // True if completing parameter
  
  // Completion output buffer (Radical OOP - output is STATE!)
  // @pdca 2025-11-04-UTC-2159.pdca.md - Centralized output in model
  completionOutputLines: string[];         // DISPLAY: and WORD: lines built by methods, output by shCompletion()
}


