/**
 * ONCEModel - ONCE Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';
import { Scenario } from './Scenario.js';
import { LifecycleEventType, LifecycleEventHandler } from './LifecycleEvents.js';
import { ONCEServerModel } from './ONCEServerModel.js';

/**
 * Web4 Scenario Message - TRUE Radical OOP Message Format
 * @pdca 2025-11-11-UTC-2322.pdca.md - Automated multi-server demo
 * MUST BE a Scenario (not just look like one)
 */
export interface ONCEScenarioMessage extends Scenario {
  // Override objectType to be specific
  objectType: 'ONCEMessage';
  
  // Message-specific state structure
  state: {
    type: 'broadcast' | 'relay' | 'p2p';
    from: { uuid: string; port: number };
    to: { uuid: string; port: number } | 'all';
    content: string;
    timestamp: string;
    sequence: number;
  };
}

/**
 * Message Tracker - Model-driven message tracking (TRUE Radical OOP)
 * @pdca 2025-11-11-UTC-2322.pdca.md - No private state, all in model
 */
export interface ONCEMessageTracker {
  sent: ONCEScenarioMessage[];
  received: ONCEScenarioMessage[];
  acknowledged: string[]; // UUIDs of acknowledged messages
  patterns: {
    broadcast: number;
    relay: number;
    p2p: number;
  };
}

export interface ONCEModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
  component?: string;             // Component name for CLI display
  version?: string;               // Component version for CLI display and test promotion
  // @pdca 2025-11-10-UTC-1010.pdca.md - Path Authority fields for delegation
  componentRoot?: string;         // THIS component's root directory
  projectRoot?: string;           // Project root directory (for delegation)
  targetDirectory?: string;       // Target directory for operations (Path Authority from CLI)
  targetComponentRoot?: string;   // Target component's root (for tree/links delegation)
  context?: any;                  // Context for "on" delegation mode (holds delegated component instance)
  
  // 🎯 Radical OOP Properties - Store ONCE, Never Recalculate
  // @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
  isTestIsolation?: boolean;      // Flag for test isolation mode
  testDataDirectory?: string;     // Test data directory path (when isTestIsolation = true)
  displayName?: string;           // Component name to show (this OR context)
  displayVersion?: string;        // Version to show (this OR context)
  isDelegation?: boolean;         // true if this.model.context exists
  delegationInfo?: string;        // e.g., "via Web4TSComponent v0.3.19.0"
  testIsolationContext?: string;  // e.g., "Web4TSComponent v0.3.19.0" or null
  componentsDirectory?: string;   // Pre-calculated components directory

  // 🔌 ONCE Domain Properties - Store ONCE Server State
  // @pdca 2025-11-10-UTC-1830.migrate-once-to-0.3.20.0.pdca.md
  initialized?: boolean;                           // ONCE kernel initialization flag
  initializationTime?: number;                     // Time taken for initialization (ms)
  scenario?: Scenario;                             // Current ONCE scenario
  serverModel?: ONCEServerModel;                   // Server model for hierarchy
  eventHandlers?: Map<LifecycleEventType, LifecycleEventHandler[]>; // Lifecycle event handlers
  
  // 📨 Message Exchange Properties - TRUE Radical OOP
  // @pdca 2025-11-11-UTC-2322.pdca.md - Model-driven message tracking
  messageTracker?: ONCEMessageTracker;             // All message tracking in model
}
