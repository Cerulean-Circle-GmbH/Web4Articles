/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Scenario interface for Web4 object hibernation
 * Supports CSV, JSON, XML, Database - all semantically equivalent
 */
export interface Scenario {
    /**
     * Unique identifier for this scenario
     */
    uuid: string;

    /**
     * Type of object this scenario represents
     */
    objectType: string;

    /**
     * Version of the object type
     */
    version: string;

    /**
     * Serialized state of the object
     */
    state: Record<string, any>;

    /**
     * References to other scenarios (IORs)
     */
    references?: ScenarioReference[];

    /**
     * Metadata about scenario creation
     */
    metadata: ScenarioMetadata;
}

/**
 * Reference to another scenario via IOR
 */
export interface ScenarioReference {
    name: string;
    ior: string;
    type: string;
    optional?: boolean;
}

/**
 * Scenario metadata
 */
export interface ScenarioMetadata {
    created: string;
    modified: string;
    creator?: string;
    description?: string;
    tags?: string[];
}