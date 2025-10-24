/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.js';

/**
 * Base interface for all Web4 components
 * Implements hibernation/restoration pattern
 */
export interface Component {
    /**
     * Component name
     */
    getName(): string;

    /**
     * Component version
     */
    getVersion(): string;

    /**
     * Initialize component from scenario
     * Web4 pattern: empty constructor + scenario initialization
     */
    init(scenario?: Scenario): Promise<Component>;

    /**
     * Hibernate component state to scenario
     */
    toScenario(): Scenario;

    /**
     * Check if component is initialized
     */
    isInitialized(): boolean;

    /**
     * Get component capabilities
     */
    getCapabilities(): string[];

    /**
     * Shutdown component cleanly
     */
    shutdown(): Promise<void>;
}