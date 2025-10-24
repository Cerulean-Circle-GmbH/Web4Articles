/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.js';
import { IOR } from './IOR.js';

/**
 * Basic Web4 component interface
 */
export interface Component {
    /**
     * Component UUID
     */
    uuid: string;

    /**
     * Component type/name
     */
    type: string;

    /**
     * Component version
     */
    version: string;

    /**
     * Initialize component from scenario
     */
    init(scenario?: Scenario): Promise<Component>;

    /**
     * Convert component to scenario for hibernation
     */
    toScenario(): Scenario;

    /**
     * Get component's Internet Object Reference
     */
    getIOR(): IOR;

    /**
     * Check if component is initialized
     */
    isInitialized(): boolean;
}
