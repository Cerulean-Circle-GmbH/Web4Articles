/**
 * Reference<T> - Type-safe nullable reference wrapper
 * Web4 pattern: All references are nullable by default
 * 
 * Usage: Reference<DefaultWeb4TSComponent> = DefaultWeb4TSComponent | null
 * 
 * Why: Makes nullable references explicit and type-safe
 * Eliminates `any` type usage for component references
 * 
 * @pdca 2025-10-31-UTC-1727.pdca.md - Planned (never implemented)
 * @pdca 2025-11-05-UTC-1158.pdca.md - Implemented
 */
export type Reference<T> = T | null;

