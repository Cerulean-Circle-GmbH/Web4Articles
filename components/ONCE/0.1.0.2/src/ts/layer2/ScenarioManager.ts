/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Component } from '../layer3/Component.js';
import { Scenario } from '../layer3/Scenario.js';

export class ScenarioManager {
    private scenarioCache: Map<string, Scenario> = new Map();

    constructor() {
        // Empty constructor - Web4 pattern
    }

    async init(state?: any): Promise<void> {
        if (state && state.cache) {
            // Restore scenario cache
            for (const [key, scenario] of Object.entries(state.cache)) {
                this.scenarioCache.set(key, scenario as Scenario);
            }
        }
    }

    async saveComponent(component: Component): Promise<Scenario> {
        const scenario = component.toScenario();
        
        // Cache the scenario
        this.scenarioCache.set(scenario.uuid, scenario);
        
        return scenario;
    }

    async loadComponent(scenario: Scenario): Promise<Component> {
        // Dynamic component loading based on scenario type
        const componentType = scenario.objectType;
        const componentVersion = scenario.version;
        
        // In a real implementation, this would dynamically load the component module
        // For now, we'll throw an error indicating the need for component registration
        throw new Error(`Component type ${componentType} v${componentVersion} not registered. Use ONCE.registerComponent() first.`);
    }

    toScenario(): any {
        const cache: Record<string, Scenario> = {};
        for (const [key, scenario] of this.scenarioCache.entries()) {
            cache[key] = scenario;
        }
        return { cache };
    }
}