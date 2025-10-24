/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// import { ServiceRegistration } from '../../../ONCE/0.3.0.2/src/ts/layer3/ServiceRegistry.interface.js';

export interface ServiceCapable {
  /**
   * Register component as service with ONCE 42777 server
   */
  registerAsService(onceServerEndpoint?: string): Promise<void>;

  /**
   * Unregister component from ONCE service registry
   */
  unregisterFromService(): Promise<void>;

  /**
   * Check if component is registered as service
   */
  isRegisteredAsService(): boolean;

  /**
   * Get service registration information
   */
  getServiceRegistration(): any; // ServiceRegistration | undefined;

  /**
   * Start component in service mode
   */
  startAsService(onceServerEndpoint: string): Promise<void>;

  /**
   * Start component in standalone mode
   */
  startStandalone(): Promise<void>;

  /**
   * Find ONCE server for service registration
   */
  findOnceServer(): string | undefined;

  /**
   * Get component capabilities for service registration
   */
  getCapabilities(): string[];
}