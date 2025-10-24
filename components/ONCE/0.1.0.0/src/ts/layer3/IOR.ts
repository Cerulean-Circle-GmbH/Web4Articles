/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Internet Object Reference for distributed Web4 objects
 */
export interface IOR {
    /**
     * Object type (e.g., "component", "scenario", "pdca")
     */
    objectType: string;

    /**
     * Unique identifier (UUID)
     */
    uuid: string;

    /**
     * Network location of object
     */
    location: NetworkLocation;

    /**
     * Version of referenced object
     */
    version?: string;

    /**
     * Convert IOR to URL string
     */
    toURL(): string;

    /**
     * Parse IOR from string format
     */
    parse(iorString: string): IOR;

    /**
     * Check if reference is local
     */
    isLocal(): boolean;

    /**
     * Resolve the referenced object
     */
    resolve(): Promise<any>;
}

/**
 * Network location information
 */
export interface NetworkLocation {
    /**
     * Protocol (web4, https, etc.)
     */
    protocol: string;

    /**
     * Host address
     */
    host: string;

    /**
     * Port number
     */
    port?: number;

    /**
     * Path to object
     */
    path?: string;

    /**
     * Convert to URL string
     */
    toURL(): string;
}