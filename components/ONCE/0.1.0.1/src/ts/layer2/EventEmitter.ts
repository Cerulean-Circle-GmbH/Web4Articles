/**
 * EventEmitter - Simple event emitter for lifecycle events
 * Web4 pattern: Minimal dependencies, scenario-compatible
 */

import { LifecycleEventType, LifecycleEventHandler } from '../layer3/LifecycleEvents.js';

export class EventEmitter {
    private handlers: Map<LifecycleEventType, Set<LifecycleEventHandler>> = new Map();

    constructor() {
        // Empty constructor - Web4 pattern
    }

    on(eventType: LifecycleEventType, handler: LifecycleEventHandler): void {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        this.handlers.get(eventType)!.add(handler);
    }

    off(eventType: LifecycleEventType, handler: LifecycleEventHandler): void {
        const eventHandlers = this.handlers.get(eventType);
        if (eventHandlers) {
            eventHandlers.delete(handler);
            if (eventHandlers.size === 0) {
                this.handlers.delete(eventType);
            }
        }
    }

    async emit(eventType: LifecycleEventType, event: any): Promise<void> {
        const eventHandlers = this.handlers.get(eventType);
        if (eventHandlers) {
            const promises: Promise<void>[] = [];
            for (const handler of eventHandlers) {
                const result = handler(event);
                if (result instanceof Promise) {
                    promises.push(result);
                }
            }
            await Promise.all(promises);
        }
    }

    clear(): void {
        this.handlers.clear();
    }

    toScenario(): any {
        // Event handlers cannot be serialized
        // Return metadata about registered events
        const events: string[] = [];
        for (const [eventType, handlers] of this.handlers.entries()) {
            if (handlers.size > 0) {
                events.push(eventType);
            }
        }
        return { registeredEvents: events };
    }
}