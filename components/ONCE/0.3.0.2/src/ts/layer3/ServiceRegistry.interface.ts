/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from '../../../../IOR/0.3.0.3/dist/index.js';

export interface ServiceRegistration {
  /**
   * Component IOR for service identification
   */
  componentIOR: IOR;

  /**
   * Service endpoint URL for communication
   */
  serviceEndpoint: string;

  /**
   * Component capabilities exposed as service
   */
  capabilities: string[];

  /**
   * Service registration status
   */
  status: 'registering' | 'active' | 'inactive' | 'error';

  /**
   * Service registration timestamp
   */
  registeredAt: string;

  /**
   * Last heartbeat timestamp for health monitoring
   */
  lastHeartbeat?: string;

  /**
   * Service metadata and configuration
   */
  metadata?: {
    [key: string]: any;
  };
}

export interface ServiceRegistry {
  /**
   * Register component as service
   */
  registerService(registration: ServiceRegistration): Promise<void>;

  /**
   * Unregister component service
   */
  unregisterService(componentIOR: IOR): Promise<void>;

  /**
   * Get all registered services
   */
  getServices(): ServiceRegistration[];

  /**
   * Find services by capability
   */
  findServicesByCapability(capability: string): ServiceRegistration[];

  /**
   * Get service by component IOR
   */
  getService(componentIOR: IOR): ServiceRegistration | undefined;

  /**
   * Update service heartbeat for health monitoring
   */
  updateHeartbeat(componentIOR: IOR): Promise<void>;

  /**
   * Start service registry server on port 42777
   */
  startServer(): Promise<void>;

  /**
   * Stop service registry server
   */
  stopServer(): Promise<void>;
}