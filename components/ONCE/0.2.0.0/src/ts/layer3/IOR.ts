/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Internet Object Reference - Universal object locator
 */
export interface IOR {
    /**
     * Protocol (web4, http, https, ws, wss)
     */
    protocol: string;

    /**
     * Host (domain name or IP)
     */
    host: string;

    /**
     * Port number
     */
    port: number;

    /**
     * Path to object
     */
    path: string;

    /**
     * Object UUID
     */
    uuid: string;

    /**
     * Object type
     */
    objectType: string;

    /**
     * Object version
     */
    version: string;

    /**
     * Additional parameters
     */
    params?: Record<string, string>;
}

/**
 * Convert IOR to URL string
 */
export function iorToUrl(ior: IOR): string {
    const baseUrl = `${ior.protocol}://${ior.host}:${ior.port}${ior.path}`;
    const params = new URLSearchParams({
        uuid: ior.uuid,
        type: ior.objectType,
        version: ior.version,
        ...ior.params
    });
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse URL string to IOR
 */
export function urlToIor(url: string): IOR {
    const parsed = new URL(url);
    const params = Object.fromEntries(parsed.searchParams);
    
    return {
        protocol: parsed.protocol.replace(':', ''),
        host: parsed.hostname,
        port: parseInt(parsed.port) || 80,
        path: parsed.pathname,
        uuid: params.uuid || '',
        objectType: params.type || '',
        version: params.version || '',
        params: Object.fromEntries(
            Object.entries(params).filter(([key]) => 
                !['uuid', 'type', 'version'].includes(key)
            )
        )
    };
}
