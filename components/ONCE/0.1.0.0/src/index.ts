/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// Layer 3 - Interfaces
export { EnvironmentInfo, ComponentQuery, PerformanceMetrics } from './ts/layer3/ONCE.js';
export { Component } from './ts/layer3/Component.js';
export { Scenario, ScenarioReference, ScenarioMetadata } from './ts/layer3/Scenario.js';
export { IOR, NetworkLocation } from './ts/layer3/IOR.js';
export { LifecycleEventType, LifecycleEvent, LifecycleEventHandler, LifecycleHooks, LifecycleState } from './ts/layer3/LifecycleEvents.js';

// Layer 2 - Default Implementation
export { DefaultONCE } from './ts/layer2/DefaultONCE.js';
export { DefaultIOR, DefaultNetworkLocation } from './ts/layer2/DefaultIOR.js';

// Main export - ONCE singleton instance
export const ONCE = {
    /**
     * Initialize and get ONCE kernel instance
     * @param scenario Optional scenario for initialization
     * @returns Initialized ONCE kernel
     */
    async init(scenario?: Scenario): Promise<ONCEInterface> {
        const once = DefaultONCE.getInstance();
        return await once.init(scenario);
    },

    /**
     * Get existing ONCE instance (must call init first)
     * @returns ONCE kernel instance
     */
    getInstance(): ONCEInterface {
        return DefaultONCE.getInstance();
    }
};

// Re-export from default import
import { Scenario } from './ts/layer3/Scenario.js';
import { ONCE as ONCEInterface } from './ts/layer3/ONCE.js';
import { DefaultONCE } from './ts/layer2/DefaultONCE.js';