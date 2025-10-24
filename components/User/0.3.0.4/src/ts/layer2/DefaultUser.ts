/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { User, OwnerParams } from '../layer3/User.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UserModel } from '../layer3/UserModel.interface.js';

export class DefaultUser implements User {
  private data: UserModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.data = {
      uuid: crypto.randomUUID(),
      username: 'system',
      hostname: 'localhost',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.data = scenario.model;
    }
    return this;
  }

  async generateOwnerData(params: OwnerParams): Promise<string> {
    // Generate owner data following ONCE pattern
    return JSON.stringify({
      user: params.user || 'system',
      hostname: params.hostname || 'localhost',
      uuid: params.uuid || this.data.uuid,
      timestamp: new Date().toISOString(),
      component: 'User',
      version: '0.3.0.4'
    });
  }

  async toScenario(): Promise<Scenario> {
    // Generate proper owner data for scenario
    const ownerData = await this.generateOwnerData({
      user: this.data.username,
      hostname: this.data.hostname,
      uuid: this.data.uuid
    });

    return {
      ior: {
        uuid: this.data.uuid,
        component: 'User',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: this.data
    };
  }
}