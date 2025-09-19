/**
 * ChangeEvent Interface - Separate concern for tracking model changes
 * Web4 principle: Single responsibility, separate from model structure
 * Purpose: Track creation and modification events independently
 * 
 * TRON Feedback: createdAt/updatedAt better in change event object (Occam's Razor)
 */
export interface ChangeEvent {
  targetUuid: string;              // UUID of the model being tracked
  eventType: 'created' | 'updated' | 'deleted';
  timestamp: string;               // ISO 8601 timestamp
  actor: string;                   // Who made the change
  changes?: Record<string, any>;   // What changed (optional)
}