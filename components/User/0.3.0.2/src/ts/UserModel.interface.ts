/**
 * Web4 User Model Interface
 * 
 * Type-safe model for User component
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