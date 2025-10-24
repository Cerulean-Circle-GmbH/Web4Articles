/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface BuildModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  name: string;                    // Build system name for terminal identification
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  indexPath: string;               // scenarios/index/path to this build system
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  buildCapabilities: string[];     // What build system can build
  dependencyCapabilities: string[]; // Dependency resolution features
  createdAt: string;
  updatedAt: string;
}

export interface NamedLink {
  location: string;                // Relative path to scenario file
  filename: string;                // Link filename (e.g., "build-system.unit")
}