/**
 * Web4 Object Identifier Interface
 * 
 * Simple structure to identify objects in scenarios
 * This is the data structure stored in scenarios, not the runtime IOR
 */

export interface ObjectIdentifier {
  uuid: string;
  component: string;
  version: string;
}

// Re-export as IOR for backward compatibility
export type IOR = ObjectIdentifier;