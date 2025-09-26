/**
 * ComponentRegistry - Manages component registration and discovery
 */

import { Component } from '../layer3/Component.js';
import { IOR } from '../layer3/IOR.js';
import { ComponentQuery } from '../layer3/ONCE.js';
import { Scenario } from '../layer3/Scenario.js';

interface ComponentEntry {
    component: Component;
    ior: IOR;
    registered: Date;
}

export class ComponentRegistry {
    private components: Map<string, ComponentEntry> = new Map();

    constructor() {
        // Empty constructor - Web4 pattern
    }

    async init(state?: any): Promise<void> {
        if (state && state.components) {
            // Restore from saved state
            // Note: Components themselves would need to be re-instantiated
            // This just restores the registry metadata
        }
    }

    async register(component: Component, ior: IOR): Promise<void> {
        const key = `${ior.objectType}:${ior.uuid}`;
        this.components.set(key, {
            component,
            ior,
            registered: new Date()
        });
    }

    async discover(query?: ComponentQuery): Promise<IOR[]> {
        const results: IOR[] = [];

        for (const entry of this.components.values()) {
            const component = entry.component;
            
            // Apply query filters
            if (query) {
                if (query.name && component.getName() !== query.name) continue;
                if (query.version && component.getVersion() !== query.version) continue;
                if (query.type && entry.ior.objectType !== query.type) continue;
                if (query.capabilities) {
                    const caps = component.getCapabilities();
                    const hasAll = query.capabilities.every(c => caps.includes(c));
                    if (!hasAll) continue;
                }
            }

            results.push(entry.ior);
        }

        return results;
    }

    getCount(): number {
        return this.components.size;
    }

    toScenario(): any {
        // Return registry state (without actual component instances)
        const entries: any[] = [];
        for (const [key, entry] of this.components.entries()) {
            entries.push({
                key,
                ior: entry.ior,
                registered: entry.registered.toISOString()
            });
        }
        return { components: entries };
    }
}