/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface UserProfile {
  [key: string]: unknown;
}

export interface UserSettings {
  [key: string]: unknown;
}

export interface UserModel {
  uuid: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  profile: UserProfile;
  settings: UserSettings;
  lastLogin: string | null;
  created: string;
  active: boolean;
}

export interface AuthCredentials {
  username: string;
  password?: string;
  [key: string]: unknown;
}