/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from '../layer3/IOR.interface.js';

export class DefaultIOR implements IOR {
  uuid: string = '';
  component: string = '';
  version: string = '';
  location?: string;
  endpoint?: string;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Empty constructor - no dependencies
  }

  /**
   * Web4 Pattern: Scenario initialization
   */
  init(data: Partial<IOR>): this {
    Object.assign(this, data);
    return this;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): IOR {
    return {
      uuid: this.uuid,
      component: this.component,
      version: this.version,
      location: this.location,
      endpoint: this.endpoint
    };
  }

  /**
   * Validate IOR completeness
   */
  isValid(): boolean {
    return !!(this.uuid && this.component && this.version);
  }
}