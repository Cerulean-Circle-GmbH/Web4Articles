/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { MethodInfo } from './MethodInfo.interface.js';

export interface ComponentAnalysis {
  className: string;
  version: string;
  description: string;
  methods: MethodInfo[];
  interfaces: InterfaceAnalysis[];
  examples: ExampleAnalysis[];
}

export interface InterfaceAnalysis {
  name: string;
  properties: PropertyAnalysis[];
  description: string;
}

export interface PropertyAnalysis {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ExampleAnalysis {
  title: string;
  code: string;
  description: string;
  category: string;
}