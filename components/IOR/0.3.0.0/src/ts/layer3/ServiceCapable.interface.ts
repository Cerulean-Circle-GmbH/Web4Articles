/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { ServiceRegistration } from './ServiceRegistration.interface.js';

export interface ServiceCapable {
  /**
   * Get component capabilities for ONCE kernel service integration
   * When ONCE kernel loads component into 42777 server, these capabilities
   * determine service availability - no additional endpoints required
   */
  getCapabilities(): string[];

  /**
   * Get service registration information for ONCE kernel
   * Simple data structure for kernel-managed service integration
   */
  getServiceRegistration(): ServiceRegistration | undefined;
}