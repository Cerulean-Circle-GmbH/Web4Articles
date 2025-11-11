/**
 * UnitIdentifier Type - Web4 Union Type for Unit Identification
 * Web4 principle: Single type per file, union types for flexible interfaces
 * Purpose: Define union type for unit identification supporting both UUID and file paths
 */

import { UUIDv4 } from './UUIDv4.class.js';

/**
 * Unit identifier supporting both UUID and file path formats
 * Web4 pattern: Union type for flexible parameter interfaces
 * 
 * @example
 * ```typescript
 * // UUID format
 * const uuid: UnitIdentifier = new UUIDv4('44443290-015c-4720-be80-c42caf842252');
 * 
 * // File path format
 * const filePath: UnitIdentifier = 'components/Unit/0.3.0.6/src/ts/layer4/TSCompletion.ts.unit';
 * 
 * // Method usage
 * async linkInto(identifier: UnitIdentifier, targetFolder: string): Promise<void>
 * ```
 */
export type UnitIdentifier = UUIDv4 | string;

/**
 * Type guard to check if UnitIdentifier is UUIDv4
 * Web4 pattern: Type guards for union type discrimination
 * 
 * @param identifier - UnitIdentifier to check
 * @returns true if identifier is UUIDv4 instance
 * @example
 * ```typescript
 * if (isUUIDv4(identifier)) {
 *   // Handle as UUIDv4
 *   const uuid = identifier.toString();
 * } else {
 *   // Handle as file path
 *   const filePath = identifier;
 * }
 * ```
 */
export function isUUIDv4(identifier: UnitIdentifier): identifier is UUIDv4 {
  return identifier instanceof UUIDv4;
}

/**
 * Type guard to check if UnitIdentifier is file path
 * Web4 pattern: Type guards for union type discrimination
 * 
 * @param identifier - UnitIdentifier to check
 * @returns true if identifier is string (file path)
 * @example
 * ```typescript
 * if (isFilePath(identifier)) {
 *   // Handle as file path
 *   const filePath = identifier;
 * } else {
 *   // Handle as UUIDv4
 *   const uuid = identifier.toString();
 * }
 * ```
 */
export function isFilePath(identifier: UnitIdentifier): identifier is string {
  return typeof identifier === 'string';
}

/**
 * Convert UnitIdentifier to UUID string
 * Web4 pattern: Utility function for union type conversion
 * 
 * @param identifier - UnitIdentifier to convert
 * @returns UUID string representation
 * @example
 * ```typescript
 * const uuid = toUUIDString(identifier);
 * ```
 */
export function toUUIDString(identifier: UnitIdentifier): string {
  if (isUUIDv4(identifier)) {
    return identifier.toString();
  }
  // For file paths, would need to extract UUID from file
  // This would be implemented in the specific method context
  throw new Error('Cannot convert file path to UUID without file system access');
}